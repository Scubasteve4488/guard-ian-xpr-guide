// sources.ts: fetch ONE page from an official or catalogued source, so any AI client can read it even when its own
// web access is limited. Allow-listed (no open proxy), HTTPS only, robots.txt respected, size-capped, cached.
//
// The allow-list keeps itself current (operator ruling 2026-10-15, "Yes definitely"): any https host linked anywhere
// in the guide's own files (llms.txt, ECOSYSTEM.md, SOURCES.md, ...) is allowed, read live from the guide repo. So
// when the daily update adds a project, its site becomes readable within 5 minutes, with no code change.
// The static lists below are the floor that still works if GitHub cannot be reached.
// Same idea as GitMCP's fetch_generic_url_content ("retrieve referenced urls ... mentioned in previously fetched
// documentation", idosal/git-mcp @ c487a29 src/api/tools/index.ts), but limited to the guide's links.

import { politeFetch, UpstreamError, type FetchResult } from './net.ts';
import { GUIDE_FILES, readGuideFile } from './guide.ts';
import { robotsAllows } from './robots.ts';

// Hosts that appear in the guide's index and ecosystem directory (read 2026-10-15): the floor, used even when the
// guide cannot be read.
export const ALLOWED_HOSTS = new Set([
	// XPR Network / Metallicus (official)
	'xprnetwork.org', 'www.xprnetwork.org', 'docs.xprnetwork.org', 'help.xprnetwork.org', 'gov.docs.xprnetwork.org',
	'metallicus.com', 'www.metallicus.com', 'metalx.com', 'docs.metalx.com', 'lending.docs.metalx.com',
	'dex.api.mainnet.metalx.com', 'metaldollar.com', 'www.metalpay.com', 'metalpay.com', 'metalblockchain.org',
	'www.metalblockchain.org', 'docs.metalblockchain.org', 'metall2.com', 'nft.xprnetwork.org',
	// Builders and community (labelled by tier in the guide)
	'simpledex.fun', 'indexer.protonnz.com', 'protonnz.com', 'www.protonnz.com', 'xpragents.com', 'indexer.xpragents.com',
	'pulsevm.dev', 'ksto.world', 'standguard.net', 'xprpulse.com', 'shellbook.io', 'charliebot.dev', 'proton.alcor.exchange',
	'alcor.exchange', 'blastpad.io', 'vibrr.ai', 'snipverse.com', 'cyphergang.com', 'bloxprod.io', 'madblocks.tech',
	'xprotect.org', 'tax.protonnz.com', 'cleanup.protonnz.com',
	// Data
	'defillama.com', 'api.llama.fi', 'www.coingecko.com',
	// Code
	'raw.githubusercontent.com', 'github.com',
]);

// GitHub is huge: only these owners (plus any owner the guide links to) are sources.
const GITHUB_OWNERS = new Set(['xprnetwork', 'metalblockchain', 'paulgnz', 'charliebot87', 'scubasteve4488', 'antelopeio', 'eoscafe']);

// Never fetched, even when the guide links them: social and log-in sites (pages need a browser or an account, and
// their terms forbid scraping). The AI should give the person the link to open themselves.
const BLOCKED_HOSTS = [
	'x.com', 'twitter.com', 't.me', 'telegram.me', 'telegram.org', 'discord.gg', 'discord.com', 'reddit.com',
	'youtube.com', 'youtu.be', 'vimeo.com', 'linkedin.com', 'facebook.com', 'instagram.com', 'tiktok.com',
];

export interface GuideLinks {
	hosts: Set<string>;
	githubOwners: Set<string>;
}

const norm = (h: string) => h.toLowerCase().replace(/^www\./, '');

function isBlocked(host: string): boolean {
	const h = norm(host);
	return BLOCKED_HOSTS.some((b) => h === b || h.endsWith('.' + b));
}

/** A public internet name: has a dot, is not an IP address, not localhost or a reserved/internal suffix. */
export function isPublicHostname(host: string): boolean {
	const h = host.toLowerCase();
	if (!h.includes('.') || h.startsWith('[') || h.includes(':')) return false;
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return false;
	if (/(^|\.)(localhost|local|internal|localdomain|home\.arpa|test|invalid|example|onion)$/.test(h)) return false;
	return /^[a-z0-9.-]+$/.test(h) && !h.startsWith('.') && !h.endsWith('.');
}

/** Every https host (and GitHub owner) linked in the given text. */
export function extractLinks(text: string, into: GuideLinks = { hosts: new Set(), githubOwners: new Set() }): GuideLinks {
	for (const m of text.matchAll(/https:\/\/[^\s)<>"'`\]|]+/g)) {
		let u: URL;
		try {
			u = new URL(m[0].replace(/[.,;:!?*_]+$/, ''));
		} catch {
			continue;
		}
		const host = u.hostname.toLowerCase();
		if (!isPublicHostname(host)) continue;
		into.hosts.add(norm(host));
		if (host === 'github.com' || host === 'raw.githubusercontent.com') {
			const owner = u.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
			if (owner) into.githubOwners.add(owner);
		}
	}
	return into;
}

let memo: { at: number; links: GuideLinks } | null = null;
const MEMO_MS = 5 * 60 * 1000;

/** The hosts and GitHub owners linked anywhere in the guide, read live (5-minute cache). Empty if GitHub fails. */
export async function guideLinks(repo: string, branch: string, ctx?: ExecutionContext, token?: string): Promise<GuideLinks> {
	if (memo && Date.now() - memo.at < MEMO_MS) return memo.links;
	const reads = await Promise.allSettled(GUIDE_FILES.map((f) => readGuideFile(repo, branch, f, ctx, token)));
	const links: GuideLinks = { hosts: new Set(), githubOwners: new Set() };
	let anyOk = false;
	for (const r of reads) {
		if (r.status === 'fulfilled') {
			anyOk = true;
			extractLinks(r.value.text, links);
		}
	}
	if (anyOk) memo = { at: Date.now(), links };
	return links;
}

export function checkSourceUrl(raw: string, links?: GuideLinks): { ok: true; url: URL } | { ok: false; why: string } {
	let url: URL;
	try {
		url = new URL(raw);
	} catch {
		return { ok: false, why: 'not a valid URL' };
	}
	if (url.protocol !== 'https:') return { ok: false, why: 'only https:// URLs are allowed' };
	if (url.username || url.password) return { ok: false, why: 'URLs with credentials are not allowed' };
	if (url.port && url.port !== '443') return { ok: false, why: 'non-standard ports are not allowed' };
	const host = url.hostname.toLowerCase();
	if (!isPublicHostname(host)) return { ok: false, why: 'only public website names are allowed' };
	if (isBlocked(host)) {
		return { ok: false, why: `${host} is a social or log-in site the connector does not read. Give the person the link to open themselves` };
	}
	const listed = ALLOWED_HOSTS.has(host) || ALLOWED_HOSTS.has(norm(host)) || ALLOWED_HOSTS.has('www.' + norm(host)) || !!links?.hosts.has(norm(host));
	if (!listed) {
		return { ok: false, why: `${host} is not linked anywhere in the guide` };
	}
	if (host === 'github.com' || host === 'raw.githubusercontent.com') {
		const owner = url.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
		if (!owner || !(GITHUB_OWNERS.has(owner) || links?.githubOwners.has(owner))) {
			return { ok: false, why: `GitHub owner "${owner ?? ''}" is not linked in the guide` };
		}
	}
	return { ok: true, url };
}

/** Very small HTML → text: drop script/style/nav noise, keep link targets, collapse whitespace. */
export function htmlToText(html: string): string {
	let t = html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
		.replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
		.replace(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, inner) => `${inner} (${href})`)
		.replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr)\b[^>]*>/gi, '\n')
		.replace(/<li\b[^>]*>/gi, '\n- ')
		.replace(/<h([1-6])\b[^>]*>/gi, (_m, n) => '\n' + '#'.repeat(Number(n)) + ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
	t = t.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n+/g, '\n\n');
	return t.trim();
}

const MAX_CHARS = 20000;

const MAX_REDIRECTS = 3;

export async function fetchSource(raw: string, ctx?: ExecutionContext, links?: GuideLinks) {
	let target = raw;
	let r: FetchResult;
	for (let hop = 0; ; hop++) {
		const chk = checkSourceUrl(target, links);
		if (!chk.ok) throw new UpstreamError(hop === 0 ? chk.why : `it redirected to ${target}, which is refused: ${chk.why}`);
		if (!(await robotsAllows(chk.url, ctx))) throw new UpstreamError(`${chk.url.host}'s robots.txt does not allow automated reading of this page`);
		r = await politeFetch([chk.url.toString()], '', { method: 'GET' }, { ttlSec: 600, ctx, startAt: 0, returnRedirects: true });
		if (r.status < 300 || r.status >= 400) break;
		if (hop >= MAX_REDIRECTS) throw new UpstreamError(`${chk.url.host} redirected more than ${MAX_REDIRECTS} times`);
		if (!r.location) throw new UpstreamError(`${chk.url.host} redirected without saying where`);
		// Each hop is checked again (allow-list, robots.txt), so a redirect can never lead off the guide's sources.
		target = new URL(r.location, chk.url).toString();
	}
	if (r.status >= 400) throw new UpstreamError(`${new URL(r.source).host} returned HTTP ${r.status}`);
	const looksHtml = /<html|<!doctype html|<body/i.test(r.text.slice(0, 2000));
	let text = looksHtml ? htmlToText(r.text) : r.text;
	let truncated = false;
	if (text.length > MAX_CHARS) {
		text = text.slice(0, MAX_CHARS);
		truncated = true;
	}
	const jsShell = looksHtml && text.length < 300;
	return { text, source: r.source, readAt: r.readAt, truncated, jsShell };
}
