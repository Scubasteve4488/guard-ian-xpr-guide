// help.ts: XPR Network's official help center (Metallicus Client Services), read through Zendesk's public Help Center
// API. The HTML pages at help.xprnetwork.org sit behind a Cloudflare browser check (HTTP 403 to any server); the API on
// the same host answers normally with no key. robots.txt (read 2026-10-16) disallows only the .../stats/view paths under
// /api/v2/help_center, not the article, list or search endpoints used here. Read-only; operator yes 2026-10-16.
// Endpoints: https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/

import { getJson, UpstreamError } from './net.ts';

const BASE = 'https://help.xprnetwork.org/api/v2/help_center';
const TTL_SEC = 6 * 60 * 60; // articles change a few times a month (10 of 61 topic articles updated in Oct 2026)

function plain(html: string): string {
	return String(html ?? '')
		.slice(0, 200_000)
		.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr)\b[^>]*>/gi, '\n')
		.replace(/<li\b[^>]*>/gi, '\n- ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/[ \t]+/g, ' ')
		.replace(/\n\s*\n\s*\n+/g, '\n\n')
		.trim();
}

export async function helpSearch(query: string, ctx?: ExecutionContext) {
	const url = `${BASE}/articles/search.json?locale=en-us&per_page=8&query=${encodeURIComponent(query)}`;
	const r = await getJson(url, TTL_SEC, ctx);
	const results = (r.json?.results ?? []).map((a: any) => ({
		id: String(a.id),
		title: String(a.title ?? '').slice(0, 200),
		url: a.html_url,
		updated: String(a.updated_at ?? '').slice(0, 10),
		extract: plain(a.snippet ?? '').slice(0, 300),
	}));
	return { data: { count: r.json?.count ?? results.length, results }, source: r.source, readAt: r.readAt };
}

export async function helpArticle(id: string, ctx?: ExecutionContext) {
	if (!/^\d{6,20}$/.test(id)) throw new UpstreamError('article id must be the number from the article URL');
	const r = await getJson(`${BASE}/en-us/articles/${id}.json`, TTL_SEC, ctx);
	const a = r.json?.article;
	if (!a) throw new UpstreamError('the help center returned no article for that id');
	let text = plain(a.body);
	const truncated = text.length > 15000;
	if (truncated) text = text.slice(0, 15000);
	return {
		data: { title: a.title, url: a.html_url, updated: String(a.updated_at ?? '').slice(0, 10), text, truncated },
		source: a.html_url as string,
		readAt: r.readAt,
	};
}
