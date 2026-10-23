// guide.ts: read the guide's own files straight from GitHub (always the latest commit on main, cached 5 minutes),
// and a plain keyword search over them. No AI model is called anywhere in this server (IDEAS-REGISTER C5 cost rule).

import { politeFetch, UpstreamError } from './net.ts';

export const GUIDE_FILES = ['llms.txt', 'RULES.md', 'ECOSYSTEM.md', 'SOURCES.md', 'GLOSSARY.md', 'KSTO.md', 'README.md', 'CHANGELOG.md'] as const;
export type GuideFile = (typeof GUIDE_FILES)[number];

const GUIDE_TTL_SEC = 300;

export function rawUrl(repo: string, branch: string, file: string) {
	return `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;
}

/**
 * Read one guide file. Public repo: raw.githubusercontent.com. Private repo: set the Worker secret GITHUB_TOKEN (a
 * fine-grained, read-only token for this one repo) and the file is read through the GitHub contents API instead.
 * The token is sent only to api.github.com and never appears in any answer or cache key.
 */
export async function readGuideFile(repo: string, branch: string, file: GuideFile, ctx?: ExecutionContext, token?: string) {
	const shown = `https://github.com/${repo}/blob/${branch}/${file}`;
	const url = token
		? `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(file)}?ref=${encodeURIComponent(branch)}`
		: rawUrl(repo, branch, file);
	const headers = token
		? { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.raw', 'X-GitHub-Api-Version': '2022-11-28' }
		: undefined;
	const r = await politeFetch([url], '', { method: 'GET', headers }, { ttlSec: GUIDE_TTL_SEC, ctx, startAt: 0 });
	if (r.status !== 200) throw new UpstreamError(`could not read ${file} from GitHub (HTTP ${r.status})`);
	return { text: r.text, source: token ? shown : url, readAt: r.readAt };
}

export interface Section {
	file: string;
	heading: string;
	startLine: number;
	text: string;
}

/** Split a markdown/llms.txt file into sections at each heading (#, ##, ###). Table rows stay inside their section. */
export function splitSections(file: string, text: string): Section[] {
	const lines = text.split('\n');
	const out: Section[] = [];
	let cur: Section = { file, heading: '(top)', startLine: 1, text: '' };
	lines.forEach((line, i) => {
		const m = /^(#{1,4})\s+(.*)$/.exec(line);
		if (m) {
			if (cur.text.trim()) out.push(cur);
			cur = { file, heading: m[2].trim(), startLine: i + 1, text: line + '\n' };
		} else {
			cur.text += line + '\n';
		}
	});
	if (cur.text.trim()) out.push(cur);
	return out;
}

const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are', 'what', 'who', 'how', 'does', 'do', 'it', 'its', 'with', 'by', 'about', 'xpr', 'network']);

export function tokenize(q: string): string[] {
	return q
		.toLowerCase()
		.split(/[^a-z0-9.@_-]+/)
		.map((t) => t.replace(/^[.\-_]+|[.\-_]+$/g, ''))
		.filter((t) => t.length > 1 && !STOP.has(t));
}

/** Score each section by how many query terms it contains (heading hits count triple). Returns the best matches. */
export function searchSections(sections: Section[], query: string, limit = 6) {
	const terms = tokenize(query);
	if (!terms.length) return [];
	const scored = sections.map((s) => {
		const body = s.text.toLowerCase();
		const head = s.heading.toLowerCase();
		let score = 0;
		let matched = 0;
		for (const t of terms) {
			const n = body.split(t).length - 1;
			if (n > 0) matched++;
			score += Math.min(n, 5) + (head.includes(t) ? 3 : 0);
		}
		// Prefer sections that contain more of the distinct terms.
		score *= 1 + matched / terms.length;
		// CHANGELOG is one long dated log that mentions almost everything, so it used to outrank the page that holds the
		// fact. Halve it: it still answers "when did this change?" and still shows when nothing else matches.
		if (s.file === 'CHANGELOG.md') score *= 0.5;
		return { s, score, matched };
	});
	return scored
		.filter((x) => x.matched > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map(({ s, score }) => ({ ...s, score: Math.round(score * 10) / 10, text: excerpt(s.text, terms) }));
}

/** Keep a section short: whole section if small, else the lines that mention a term plus the heading. */
export function excerpt(text: string, terms: string[], maxChars = 2500): string {
	if (text.length <= maxChars) return text.trim();
	const lines = text.split('\n');
	const keep = lines.filter((l, i) => i === 0 || terms.some((t) => l.toLowerCase().includes(t)));
	let out = keep.join('\n');
	if (out.length > maxChars) out = out.slice(0, maxChars) + '\n…(trimmed; read the whole file with guide view read)';
	return out.trim();
}

// ── Freshness (1.24.0, owner 2026-10-23 "all"): the newest date written in a hit, so the AI can say "last checked …"
// and re-read the live source when a fact is old. Forms read: YYYY-MM-DD anywhere ("row last edited 2026-10-23",
// "read 2026-10-16"), and MM-DD only right after a dating word (read/checked/edited/updated/verified/as of/live) or in
// parentheses, because a bare "10-15" is too often a range. An MM-DD gets the year that does not put it in the future.
const STALE_DAYS = 30;
export function freshness(text: string, now = new Date()): { lastChecked: string | null; stale: boolean } {
	const dates: string[] = [];
	const valid = (y: number, m: number, d: number) => m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 2015 && y <= now.getUTCFullYear() + 1;
	for (const m of text.matchAll(/(?<![\d-])(20\d\d)-(\d\d)-(\d\d)(?![\d])/g)) if (valid(+m[1], +m[2], +m[3])) dates.push(`${m[1]}-${m[2]}-${m[3]}`);
	for (const m of text.matchAll(/(?:\b(?:read|checked|edited|updated|verified|as of|live|seen)\s+|\()(\d\d)-(\d\d)(?![\d-])/gi)) {
		let y = now.getUTCFullYear();
		const iso = (yy: number) => `${yy}-${m[1]}-${m[2]}`;
		if (!valid(y, +m[1], +m[2])) continue;
		if (iso(y) > now.toISOString().slice(0, 10)) y -= 1;
		dates.push(iso(y));
	}
	const today = now.toISOString().slice(0, 10);
	const newest = dates.filter((d) => d <= today).sort().pop() ?? null;
	if (!newest) return { lastChecked: null, stale: true };
	const age = (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${newest}T00:00:00Z`)) / 86400_000;
	return { lastChecked: newest, stale: age > STALE_DAYS };
}
