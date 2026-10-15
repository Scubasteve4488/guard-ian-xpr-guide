// guide.ts: read the guide's own files straight from GitHub (always the latest commit on main, cached 5 minutes),
// and a plain keyword search over them. No AI model is called anywhere in this server (IDEAS-REGISTER C5 cost rule).

import { politeFetch, UpstreamError } from './net.ts';

export const GUIDE_FILES = ['llms.txt', 'RULES.md', 'ECOSYSTEM.md', 'SOURCES.md', 'KSTO.md', 'README.md', 'CHANGELOG.md'] as const;
export type GuideFile = (typeof GUIDE_FILES)[number];

const GUIDE_TTL_SEC = 300;

export function rawUrl(repo: string, branch: string, file: string) {
	return `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;
}

export async function readGuideFile(repo: string, branch: string, file: GuideFile, ctx?: ExecutionContext) {
	const url = rawUrl(repo, branch, file);
	const r = await politeFetch([url], '', { method: 'GET' }, { ttlSec: GUIDE_TTL_SEC, ctx, startAt: 0 });
	if (r.status !== 200) throw new UpstreamError(`could not read ${file} from GitHub (HTTP ${r.status})`);
	return { text: r.text, source: url, readAt: r.readAt };
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
	if (out.length > maxChars) out = out.slice(0, maxChars) + '\n…(trimmed; read the whole file with guide_read)';
	return out.trim();
}
