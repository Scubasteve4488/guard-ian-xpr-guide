// net.ts: polite outbound HTTP for the GUARD.IAN XPR Guide server.
//
// SOURCE: XPRNetwork/xpr-network-dev-skill @ a1d455e skill/rpc-queries.md:47-142 (Endpoint Etiquette + "Polite client
// (drop-in)"): rotate endpoints, set a meaningful User-Agent, back off on 429/503 honouring Retry-After, and stop on
// 403 ("retrying just confirms you're a bot"). Adapted for an MCP request: at most 3 attempts and a short backoff cap,
// because a person is waiting for the answer. Cache aggressively (rpc-queries.md:69), using the Workers Cache API.

export const USER_AGENT = 'XPRAgent/guard-ian-guide 1.0 (+https://github.com/Scubasteve4488/guard-ian-xpr-guide)';

// SOURCE: rpc-queries.md:11-20 (mainnet table, RPC column) and :79-88 (Hyperion-serving list), @ a1d455e.
export const RPC_ENDPOINTS = [
	'https://proton.eosusa.io',
	'https://proton.protonuk.io',
	'https://proton-api.eosiomadrid.io',
	'https://api-xprnetwork-main.saltant.io',
	'https://xpr-mainnet-api.bloxprod.io',
	'https://api.protonnz.com',
	'https://proton.cryptolions.io',
];
export const HYPERION_ENDPOINTS = [
	'https://proton.eosusa.io',
	'https://proton.protonuk.io',
	'https://proton-api.eosiomadrid.io',
	'https://api-xprnetwork-main.saltant.io',
	'https://xpr-mainnet-api.bloxprod.io',
	'https://proton-hyperion.luminaryvisn.com',
];

const MAX_ATTEMPTS = 3;
const MAX_BACKOFF_MS = 1500;
const TIMEOUT_MS = 8000;

export class UpstreamError extends Error {}

export interface FetchResult {
	status: number;
	text: string;
	source: string; // the exact URL that answered
	cached: boolean;
	readAt: string; // ISO time the upstream answered (or the cached copy was stored)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function cacheKey(url: string, body?: string): Request {
	// POST bodies are folded into a synthetic GET key so the Cache API can store them.
	const k = body ? `${url}#${body}` : url;
	return new Request(`https://cache.guard-ian-guide.internal/${encodeURIComponent(k)}`);
}

async function cacheGet(key: Request): Promise<FetchResult | null> {
	try {
		const hit = await (globalThis as any).caches?.default?.match(key);
		if (!hit) return null;
		return { ...(await hit.json()), cached: true } as FetchResult;
	} catch {
		return null;
	}
}

async function cachePut(key: Request, value: FetchResult, ttlSec: number, ctx?: ExecutionContext) {
	try {
		const c = (globalThis as any).caches?.default;
		if (!c || ttlSec <= 0) return;
		const res = new Response(JSON.stringify(value), {
			headers: { 'content-type': 'application/json', 'cache-control': `max-age=${ttlSec}` },
		});
		const p = c.put(key, res);
		if (ctx) ctx.waitUntil(p);
		else await p;
	} catch {
		/* cache is best-effort */
	}
}

/**
 * Fetch one path from a pool of endpoints, rotating on 429/503/network errors and stopping on 403.
 * `pool` = list of base URLs (or a single full URL with path '').
 */
export async function politeFetch(
	pool: string[],
	path: string,
	init: { method?: 'GET' | 'POST'; body?: string; headers?: Record<string, string> } = {},
	opts: { ttlSec?: number; ctx?: ExecutionContext; startAt?: number } = {},
): Promise<FetchResult> {
	const ttl = opts.ttlSec ?? 0;
	const key = cacheKey(pool.join('|') + path, init.body);
	if (ttl > 0) {
		const hit = await cacheGet(key);
		if (hit) return hit;
	}
	const start = opts.startAt ?? Math.floor(Math.random() * pool.length);
	let lastErr = 'no endpoint answered';
	for (let attempt = 0; attempt < Math.min(MAX_ATTEMPTS, pool.length); attempt++) {
		const base = pool[(start + attempt) % pool.length];
		const url = `${base}${path}`;
		let res: Response;
		try {
			res = await fetch(url, {
				method: init.method ?? 'GET',
				body: init.body,
				headers: {
					'User-Agent': USER_AGENT,
					...(init.body ? { 'Content-Type': 'application/json' } : {}),
					Accept: 'application/json, text/plain, text/html;q=0.8, */*;q=0.5',
					...(init.headers ?? {}),
				},
				redirect: 'manual',
				signal: AbortSignal.timeout(TIMEOUT_MS),
			});
		} catch (e: any) {
			lastErr = `${new URL(url).host}: ${e?.name === 'TimeoutError' ? 'timed out' : 'network error'}`;
			continue;
		}
		if (res.status === 403) {
			// rpc-queries.md:63 — 403 means a human banned this traffic. Do not retry it on that host.
			lastErr = `${new URL(url).host} returned 403`;
			continue;
		}
		if (res.status === 429 || res.status === 503) {
			const ra = parseInt(res.headers.get('Retry-After') || '0', 10);
			lastErr = `${new URL(url).host} returned ${res.status}`;
			await sleep(Math.min(MAX_BACKOFF_MS, ra > 0 ? ra * 1000 : 400 * 2 ** attempt));
			continue;
		}
		if (res.status >= 300 && res.status < 400) {
			lastErr = `${new URL(url).host} redirected (not followed)`;
			continue;
		}
		const text = await res.text();
		const out: FetchResult = { status: res.status, text, source: url, cached: false, readAt: new Date().toISOString() };
		if (res.ok && ttl > 0) await cachePut(key, out, ttl, opts.ctx);
		return out;
	}
	throw new UpstreamError(lastErr);
}

/** POST a JSON body to an XPR RPC path (e.g. /v1/chain/get_info) and parse the JSON answer. */
export async function rpc(path: string, body: unknown, ttlSec: number, ctx?: ExecutionContext) {
	const r = await politeFetch(RPC_ENDPOINTS, path, { method: 'POST', body: JSON.stringify(body ?? {}) }, { ttlSec, ctx });
	let json: any;
	try {
		json = JSON.parse(r.text);
	} catch {
		throw new UpstreamError(`${new URL(r.source).host} returned non-JSON (HTTP ${r.status})`);
	}
	if (r.status >= 400) {
		const msg = json?.error?.what || json?.message || `HTTP ${r.status}`;
		throw new UpstreamError(`chain said: ${msg}`);
	}
	return { json, source: r.source, readAt: r.readAt, cached: r.cached };
}

/** GET a JSON document from a full URL (no rotation). */
export async function getJson(url: string, ttlSec: number, ctx?: ExecutionContext) {
	const r = await politeFetch([url], '', { method: 'GET' }, { ttlSec, ctx, startAt: 0 });
	if (r.status >= 400) throw new UpstreamError(`${new URL(url).host} returned HTTP ${r.status}`);
	try {
		return { json: JSON.parse(r.text), source: r.source, readAt: r.readAt, cached: r.cached };
	} catch {
		throw new UpstreamError(`${new URL(url).host} returned non-JSON`);
	}
}
