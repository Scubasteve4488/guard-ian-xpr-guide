// sources.ts: fetch ONE page from an official or catalogued source, so any AI client can read it even when its own
// web access is limited. Strictly allow-listed (no open proxy), HTTPS only, redirects not followed, size-capped, cached.

import { politeFetch, UpstreamError } from './net.ts';

// Hosts that appear in the guide's index and ecosystem directory (read 2026-10-15). Add hosts here only after the
// guide lists them as a source.
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

// GitHub is huge: only these owners are sources.
const GITHUB_OWNERS = new Set(['xprnetwork', 'metalblockchain', 'paulgnz', 'charliebot87', 'scubasteve4488', 'antelopeio', 'eoscafe']);

export function checkSourceUrl(raw: string): { ok: true; url: URL } | { ok: false; why: string } {
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
	if (!ALLOWED_HOSTS.has(host)) {
		return { ok: false, why: `${host} is not in the guide's source list. Use guide_search to find the right official source.` };
	}
	if (host === 'github.com' || host === 'raw.githubusercontent.com') {
		const owner = url.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
		if (!owner || !GITHUB_OWNERS.has(owner)) return { ok: false, why: `GitHub owner "${owner ?? ''}" is not a catalogued source` };
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

export async function fetchSource(raw: string, ctx?: ExecutionContext) {
	const chk = checkSourceUrl(raw);
	if (!chk.ok) throw new UpstreamError(chk.why);
	const r = await politeFetch([chk.url.toString()], '', { method: 'GET' }, { ttlSec: 600, ctx, startAt: 0 });
	if (r.status >= 400) throw new UpstreamError(`${chk.url.host} returned HTTP ${r.status}`);
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
