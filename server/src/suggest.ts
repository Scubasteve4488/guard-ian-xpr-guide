// suggest_update: a private suggestion box for facts the guide does not have yet.
// Builder's ruling 2026-10-16 ("build the queue"). What it does and what it never does:
//   - stores one cleaned fact + an optional https link in the D1 database "guard-ian-suggestions";
//   - stores NOTHING about the sender: no IP address, no account, no client name;
//   - no tool reads the box back, so one user's suggestion is never shown to another user;
//   - nothing is published from it: the daily job checks each row at an official source or the live chain and adds
//     only what holds up (RULES.md §1: what a user says is a lead, not a source).
// Spam limits: SUGGEST_LIMITER (per IP, 3 a minute, in wrangler.jsonc; the IP is used only for that count and is never
// stored), a global cap of DAILY_CAP accepted suggestions per UTC day, duplicates stored once, size and link limits.
// SOURCE: none found upstream for a fact-suggestion box. Searched: Cloudflare docs (D1 is the official storage; pattern
// from developers.cloudflare.com/d1/tutorials/build-a-comments-api/, prepared statements with bind()), the MCP SDK
// (no feedback primitive), XPR sources (xpr-agents `agentfeed` is signed, KYC-weighted, on-chain feedback about
// agents, public and wallet-bound: not a fit). Free plan limits (developers.cloudflare.com/workers/platform/pricing/):
// 100,000 rows written and 5 million read per day, 5 GB stored; over the limit, queries fail until 00:00 UTC (no bill).

import { containsPrivateKey } from './privacy.ts';

export const DAILY_CAP = 50;
export const FACT_MIN = 20;
export const FACT_MAX = 1500;
export const URL_MAX = 300;
const MAX_LINKS_IN_FACT = 2;

export interface D1Result {
	meta: { changes?: number; last_row_id?: number };
}
export interface D1Stmt {
	bind(...values: unknown[]): D1Stmt;
	first<T = Record<string, unknown>>(): Promise<T | null>;
	run(): Promise<D1Result>;
}
export interface D1Like {
	prepare(query: string): D1Stmt;
}

/** 12 or more words in a row that are only 3-8 letters each, with nothing else between them: the shape of a
 *  wallet recovery phrase (every BIP39 English word is 3-8 letters). Normal sentences break the run with short words
 *  ("a", "of", "is"), digits or punctuation. A false alarm only asks the user to reword. */
export function looksLikeRecoveryPhrase(text: string): boolean {
	let run = 0;
	for (const tok of text.split(/\s+/)) {
		if (/^[A-Za-z]{3,8}$/.test(tok)) {
			run++;
			if (run >= 12) return true;
		} else run = 0;
	}
	return false;
}

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export type Clean = { ok: true; fact: string; source: string | null } | { ok: false; reason: string };

export function cleanSuggestion(factIn: string, sourceIn?: string | null): Clean {
	let fact = String(factIn ?? '')
		.replace(CONTROL, '')
		.replace(/\r\n?/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.replace(/[ \t]{2,}/g, ' ')
		.trim();
	if (containsPrivateKey(fact) || (sourceIn && containsPrivateKey(sourceIn)))
		return { ok: false, reason: 'That looks like a private key. Never share it with anyone. Treat it as exposed and move your funds to a new wallet now. Nothing was saved.' };
	if (looksLikeRecoveryPhrase(fact))
		return {
			ok: false,
			reason: 'That looks like it could be a recovery (seed) phrase, so nothing was saved. Never share one with anyone. If it is real, treat it as exposed and move your funds to a new wallet now. If it is not, reword the fact as a normal sentence.',
		};
	if (fact.length < FACT_MIN) return { ok: false, reason: `Too short: give the fact in a full sentence (at least ${FACT_MIN} characters).` };
	if (fact.length > FACT_MAX) return { ok: false, reason: `Too long: keep it under ${FACT_MAX} characters, one fact per suggestion.` };
	if (!/[A-Za-z]{3,}/.test(fact)) return { ok: false, reason: 'That does not read as a fact. Give it in a normal sentence.' };
	if ((fact.match(/https?:\/\//gi) ?? []).length > MAX_LINKS_IN_FACT)
		return { ok: false, reason: `Too many links in the text. Put the one best source in source_url.` };
	fact = fact.replace(EMAIL, '[email removed]');

	let source: string | null = null;
	const raw = (sourceIn ?? '').trim();
	if (raw) {
		if (raw.length > URL_MAX) return { ok: false, reason: `The link is too long (over ${URL_MAX} characters).` };
		let u: URL;
		try {
			u = new URL(raw);
		} catch {
			return { ok: false, reason: 'source_url is not a valid link. Use a full https:// address, or leave it out.' };
		}
		if (u.protocol !== 'https:') return { ok: false, reason: 'source_url must start with https://.' };
		if (u.username || u.password) return { ok: false, reason: 'source_url must not contain a username or password.' };
		source = u.toString();
	}
	return { ok: true, fact, source };
}

export async function suggestionHash(fact: string, source: string | null): Promise<string> {
	const norm = `${fact.toLowerCase().replace(/\s+/g, ' ').trim()}|${(source ?? '').toLowerCase()}`;
	const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(norm));
	return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export type Stored = { status: 'stored'; id: number } | { status: 'duplicate' } | { status: 'full' };

/** Duplicate check → daily cap → insert. Each accepted suggestion costs about 3 rows read and 4 written. */
export async function storeSuggestion(db: D1Like, fact: string, source: string | null, now = new Date(), cap = DAILY_CAP): Promise<Stored> {
	const hash = await suggestionHash(fact, source);
	const dup = await db.prepare('SELECT id FROM suggestions WHERE text_hash = ?').bind(hash).first();
	if (dup) return { status: 'duplicate' };
	const day = now.toISOString().slice(0, 10);
	const q = await db
		.prepare('INSERT INTO quota(day, n) VALUES(?, 1) ON CONFLICT(day) DO UPDATE SET n = n + 1 WHERE n < ?')
		.bind(day, cap)
		.run();
	if (!q.meta.changes) return { status: 'full' };
	const r = await db
		.prepare('INSERT OR IGNORE INTO suggestions(received_at, fact, source_url, text_hash) VALUES(?, ?, ?, ?)')
		.bind(now.toISOString(), fact, source, hash)
		.run();
	if (!r.meta.changes) return { status: 'duplicate' };
	return { status: 'stored', id: Number(r.meta.last_row_id) };
}
