// robots.ts: respect each site's robots.txt before source_fetch reads a page.
//
// Adapted from idosal/git-mcp @ c487a29 src/api/utils/robotsTxt.ts (Apache License 2.0,
// https://github.com/idosal/git-mcp/blob/c487a29895dcfcb5b672247e646426a56e2051c1/LICENSE): GitMCP's
// fetch_generic_url_content "respects robots.txt rules". Changes from the original:
//  - robots.txt is read with our polite fetch (User-Agent, 403 stop) and the Workers Cache API instead of Upstash;
//  - a rule group naming our own agent ("XPRAgent" or "guard-ian-guide") wins over "*";
//  - when no group matches us and there is no "*" group, the page is allowed (RFC 9309 section 2.2.1), where the
//    original applied the first group it found;
//  - "# ..." comments at the end of a line are stripped (the original only skipped whole comment lines).
// Like the original: Allow beats Disallow, prefix matching only, and any error reading robots.txt allows the fetch.

import { politeFetch } from './net.ts';

export interface RobotsRule {
	userAgent: string;
	disallow: string[];
	allow: string[];
}

const OUR_AGENTS = new Set(['xpragent', 'guard-ian-guide']);

export function parseRobotsTxt(content: string): RobotsRule[] {
	const rules: RobotsRule[] = [];
	let current: RobotsRule | null = null;
	for (const line of content.split('\n')) {
		const trimmed = line.replace(/#.*$/, '').trim();
		if (!trimmed) continue;
		const [directive, ...rest] = trimmed.split(':');
		const value = rest.join(':').trim();
		if (!directive || !value) continue;
		const d = directive.trim().toLowerCase();
		if (d === 'user-agent') {
			if (current && current.userAgent) rules.push(current);
			current = { userAgent: value, disallow: [], allow: [] };
		} else if (d === 'disallow' && current) {
			current.disallow.push(value);
		} else if (d === 'allow' && current) {
			current.allow.push(value);
		}
	}
	if (current && current.userAgent) rules.push(current);
	return rules;
}

export function isPathAllowed(rules: RobotsRule[], path: string): boolean {
	if (!path.startsWith('/')) path = '/' + path;
	const group = rules.find((r) => OUR_AGENTS.has(r.userAgent.toLowerCase())) ?? rules.find((r) => r.userAgent === '*');
	if (!group || (group.disallow.length === 0 && group.allow.length === 0)) return true;
	for (const a of group.allow) if (path.startsWith(a)) return true;
	for (const d of group.disallow) if (d === '/' || path.startsWith(d)) return false;
	return true;
}

/** true = robots.txt lets us read this URL (or the site has no readable robots.txt). Cached 1 hour per host. */
export async function robotsAllows(url: URL, ctx?: ExecutionContext): Promise<boolean> {
	try {
		const r = await politeFetch([`https://${url.host}/robots.txt`], '', { method: 'GET' }, { ttlSec: 3600, ctx, startAt: 0, noBanOn403: true });
		if (r.status !== 200) return true;
		return isPathAllowed(parseRobotsTxt(r.text), url.pathname);
	} catch {
		return true;
	}
}
