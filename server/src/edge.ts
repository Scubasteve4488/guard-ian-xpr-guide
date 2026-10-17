/**
 * Edge hygiene for guide.standguard.net (REA Lab job 2, 2026-10-17, GUARD-Project REA/reports/lab-job-2-2026-10-17.md):
 *  - Fix 1: plain http:// was answered with 200 and no redirect → redirect every http request to https (308 keeps the
 *    method and body, so a POST to /mcp is not turned into a GET).
 *  - Fix 2: no Strict-Transport-Security → send it on every https answer. max-age one year; no includeSubDomains and no
 *    preload (this host has no subdomains, and preload is hard to undo).
 *  - Fix 2 also notes X-Content-Type-Options was missing → nosniff on every answer.
 *  - Fix 10: /favicon.ico was a 404 → an empty 204.
 * How the visitor's scheme is known: the request URL a Worker sees keeps the scheme the visitor used; Cloudflare's
 * CF-Visitor header ({"scheme":"http"}) is checked as well, in case a request arrives rewritten.
 */

export const SECURITY_HEADERS: Record<string, string> = {
	'strict-transport-security': 'max-age=31536000',
	'x-content-type-options': 'nosniff',
};

export function plainHttp(request: Request): boolean {
	if (new URL(request.url).protocol === 'http:') return true;
	const v = request.headers.get('cf-visitor');
	if (v) {
		try {
			return JSON.parse(v)?.scheme === 'http';
		} catch {
			return false;
		}
	}
	return false;
}

export function httpsRedirect(request: Request): Response {
	const u = new URL(request.url);
	u.protocol = 'https:';
	u.port = '';
	return new Response(null, { status: 308, headers: { location: u.toString() } });
}

/** Adds the security headers to a finished answer without touching its body (streams stay streams). */
export function withSecurityHeaders(res: Response): Response {
	// A WebSocket upgrade (101) cannot be rebuilt; it carries no page content anyway.
	if (res.status === 101 || (res as Response & { webSocket?: unknown }).webSocket) return res;
	const headers = new Headers(res.headers);
	for (const [k, v] of Object.entries(SECURITY_HEADERS)) if (!headers.has(k)) headers.set(k, v);
	return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export function favicon(): Response {
	return withSecurityHeaders(new Response(null, { status: 204, headers: { 'cache-control': 'public, max-age=86400' } }));
}
