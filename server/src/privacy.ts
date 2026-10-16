// Privacy filter for everything the server returns.
// Builder's ruling 2026-10-16: "most if not all wallet names should be protected" — anyone in the world can use the
// connector, so it does not hand out who owns which wallet. IAN-CODE's review the same night set the line:
//   hide  — private people's accounts the AI comes across (a "Creator:" line on a community page; creator / buyer /
//           seller / holder fields in SimpleDEX tables and indexer JSON), plus the builder's own account anywhere;
//   keep  — contract, project, block-producer and exchange accounts (they are not in those fields), and any account
//           the caller typed into the tool call themselves (a user may always look up an account they already know).
// Also: a private key never passes through, in either direction.
// SOURCE: none found — this is not an XPR protocol matter; it is the builder's product rule (RULES.md §3).

export const MASK = '[private account]';
export const KEY_MASK = '[private key hidden]';

// The builder's account, by SHA-256 so this public file does not spell it out. More names can be added without a
// code change through the PRIVATE_ACCOUNTS Worker secret (comma-separated).
const PRIVATE_NAME_HASHES = new Set(['91b15a99688585cf4c25abb607466e72bdcfbb7e271ae841e70148d776e04f1f']);

// Fields that hold a private person's account in SimpleDEX / launch data.
const PERSON_KEYS = ['creator', 'buyer', 'seller', 'holder', 'updatedBy', 'updated_by', 'bidder', 'winner', 'trader'];
const JSON_PERSON = new RegExp(`("(?:${PERSON_KEYS.join('|')})"\\s*:\\s*")([a-z1-5.]{1,13})(")`, 'gi');
// Page text such as "Creator: somename" or "Created by @somename".
const LABEL_PERSON = /\b(Creator|Created by|Buyer|Seller|Holder)(\s*[:\-–]\s*@?|\s+@)([A-Za-z1-5.]{1,13})\b/g;
// An account-shaped word, not glued to other letters, digits, dots, dashes or underscores.
const WORD = /(?<![A-Za-z0-9._@-])@?[A-Za-z1-5.]{1,12}(?![A-Za-z0-9_-]|\.[A-Za-z0-9])/g;
// Private keys: Antelope K1/R1 strings and legacy WIF.
const PRIVATE_KEY = /\bPVT_(?:K1|R1)_[1-9A-HJ-NP-Za-km-z]{20,}\b|\b5[HJK][1-9A-HJ-NP-Za-km-z]{49}\b/g;

const hashCache = new Map<string, boolean>();

async function isProtectedByHash(word: string): Promise<boolean> {
	const w = word.toLowerCase();
	const hit = hashCache.get(w);
	if (hit !== undefined) return hit;
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(w));
	const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
	const yes = PRIVATE_NAME_HASHES.has(hex);
	if (hashCache.size > 5000) hashCache.clear();
	hashCache.set(w, yes);
	return yes;
}

/** Emergency off switch: true when the DISABLED_TOOLS list names this tool, or holds "*". */
export function toolDisabled(name: string, disabled: Set<string>): boolean {
	return disabled.has('*') || disabled.has(name.toLowerCase());
}

export function parsePrivateList(raw?: string): Set<string> {
	return new Set((raw ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
}

/** Account-shaped words the caller typed into a tool call. These are never hidden from that caller. */
export function exemptionsFrom(args: unknown): Set<string> {
	const out = new Set<string>();
	const walk = (v: unknown) => {
		if (typeof v === 'string') for (const m of v.toLowerCase().matchAll(/[a-z1-5.]{1,12}/g)) out.add(m[0]);
		else if (Array.isArray(v)) v.forEach(walk);
		else if (v && typeof v === 'object') Object.values(v).forEach(walk);
	};
	walk(args);
	return out;
}

/** True if any string in the tool call looks like a private key. */
export function containsPrivateKey(args: unknown): boolean {
	let found = false;
	const walk = (v: unknown) => {
		if (found) return;
		if (typeof v === 'string') found = new RegExp(PRIVATE_KEY.source).test(v);
		else if (Array.isArray(v)) v.forEach(walk);
		else if (v && typeof v === 'object') Object.values(v).forEach(walk);
	};
	walk(args);
	return found;
}

export async function maskText(text: string, exempt: Set<string> = new Set(), extra: Set<string> = new Set()): Promise<string> {
	const keep = (name: string) => exempt.has(name.toLowerCase().replace(/^@/, ''));
	let out = text.replace(PRIVATE_KEY, KEY_MASK);
	// 1.16.0 (builder 2026-10-16, option (a)): creator / buyer / seller / holder names in data and page text are shown.
	// The two patterns stay defined for reference but are no longer applied. The builder's own account below still is.
	void JSON_PERSON;
	void LABEL_PERSON;
	void keep;
	// The builder's account and any extra listed names, wherever they appear.
	// A sentence-ending dot is not part of the name.
	const norm = (m: string) => m.replace(/^@/, '').replace(/\.+$/, '').toLowerCase();
	const words = new Set([...out.matchAll(WORD)].map((m) => norm(m[0])));
	const hide = new Set<string>();
	for (const w of words) if (w && !exempt.has(w) && (extra.has(w) || (await isProtectedByHash(w)))) hide.add(w);
	if (hide.size)
		out = out.replace(WORD, (m) => (hide.has(norm(m)) ? MASK + (m.match(/\.+$/)?.[0] ?? '') : m));
	return out;
}

type ToolResult = { content?: Array<{ type: string; text?: string }>; [k: string]: unknown };

export async function maskResult<T extends ToolResult>(result: T, exempt: Set<string>, extra: Set<string>): Promise<T> {
	if (!result || !Array.isArray(result.content)) return result;
	const content = await Promise.all(
		result.content.map(async (c) => (c && c.type === 'text' && typeof c.text === 'string' ? { ...c, text: await maskText(c.text, exempt, extra) } : c)),
	);
	return { ...result, content };
}
