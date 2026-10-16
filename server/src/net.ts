// net.ts: polite outbound HTTP for the GUARD.IAN XPR Guide server.
//
// SOURCE: XPRNetwork/xpr-network-dev-skill @ a1d455e skill/rpc-queries.md:47-142 (Endpoint Etiquette + "Polite client
// (drop-in)"): rotate endpoints, set a meaningful User-Agent, back off on 429/503 honouring Retry-After, and stop on
// 403 ("retrying just confirms you're a bot"). Adapted for an MCP request: at most 3 attempts and a short backoff cap,
// because a person is waiting for the answer. Cache aggressively (rpc-queries.md:69), using the Workers Cache API.

export const USER_AGENT = 'XPRAgent/guard-ian-guide 1.0 (+https://github.com/Scubasteve4488/guard-ian-xpr-guide)';

// SOURCE: XPRNetwork/xpr-network-dev-skill @ main (read 2026-10-16) skill/rpc-queries.md "### Mainnet" table (RPC column,
// 8 endpoints) and the "Hyperion endpoints" list; same table in skill/resources.md "RPC Endpoints". Luminary Vision added
// 2026-10-16: upstream marks it RPC ✓ and the server had left it out of the RPC rotation (builder's yes).
export const RPC_ENDPOINTS = [
	'https://proton.eosusa.io',
	'https://proton.protonuk.io',
	'https://proton-api.eosiomadrid.io',
	'https://api-xprnetwork-main.saltant.io',
	'https://xpr-mainnet-api.bloxprod.io',
	'https://proton-hyperion.luminaryvisn.com',
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
// Security review M3: never buffer an unbounded body. Stop reading at 1 MB and cancel the rest.
const MAX_BODY_BYTES = 1_000_000;
async function readCapped(res: Response): Promise<{ text: string; tooLarge: boolean }> {
	if (!res.body) return { text: '', tooLarge: false };
	const reader = res.body.getReader();
	const dec = new TextDecoder();
	let text = '';
	let n = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) return { text: text + dec.decode(), tooLarge: false };
		n += value.byteLength;
		if (n > MAX_BODY_BYTES) {
			const keep = value.byteLength - (n - MAX_BODY_BYTES);
			text += dec.decode(value.subarray(0, Math.max(0, keep)));
			await reader.cancel().catch(() => {});
			return { text, tooLarge: true };
		}
		text += dec.decode(value, { stream: true });
	}
}
const MAX_BACKOFF_MS = 1500;
const TIMEOUT_MS = 8000;

export class UpstreamError extends Error {}

export interface FetchResult {
	status: number;
	text: string;
	contentType?: string;
	tooLarge?: boolean; // the body passed MAX_BODY_BYTES and was cut there
	source: string; // the exact URL that answered
	cached: boolean;
	readAt: string; // ISO time the upstream answered (or the cached copy was stored)
	location?: string; // only with opts.returnRedirects: the Location header of a 3xx answer
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Never get banned (2026-10-16, operator: "we should never be banned"; security review M1, M2, L5, L7).
// SOURCE: rpc-queries.md:62-64 @ b7d9f1f — 429/503: "back off exponentially (2s → 4s → 8s, cap ~60s), switch endpoint …
// Honor Retry-After"; 403: "added to the operator's manual ban list … Don't keep retrying — that confirms you're a bot."
// :70 "Rotate between endpoints"; :68-69 "Cache aggressively".
// 1. A host that answered 403 is not contacted again by this isolate for BAN_COOLDOWN_MS; 429/503 for Retry-After
//    (min 2 s, max 60 s). If every host in a pool is cooling down, the call fails WITHOUT sending anything.
// 2. A shared budget per TARGET (not per caller): all XPR RPC + Hyperion calls share one key, every other host its own.
//    Cache-busting tricks (?a=1, ?a=2 … or a new lower_bound each call) therefore cannot multiply traffic to anyone.
// 3. An in-isolate memory cache backs up the Cache API, which may do nothing on *.workers.dev (review L7).
const BAN_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const coolUntil = new Map<string, number>(); // host → epoch ms
export function hostCooling(host: string, now = Date.now()): boolean {
	const t = coolUntil.get(host);
	if (t === undefined) return false;
	if (t <= now) {
		coolUntil.delete(host);
		return false;
	}
	return true;
}
function coolHost(host: string, ms: number) {
	coolUntil.set(host, Math.max(coolUntil.get(host) ?? 0, Date.now() + ms));
}

export interface Limiter {
	limit(o: { key: string }): Promise<{ success: boolean }>;
}
let chainLimiter: Limiter | undefined;
let hostLimiter: Limiter | undefined;
/** Set once per request from the Worker env (bindings CHAIN_LIMITER / HOST_LIMITER in wrangler.jsonc). */
export function setUpstreamLimiters(chain?: Limiter, host?: Limiter) {
	chainLimiter = chain;
	hostLimiter = host;
}
// Testnet (rpc-queries.md:22-28; Hyperion found live 2026-10-16, see NEW-SOURCES-ENDPOINTS §7).
export const TESTNET_RPC_ENDPOINTS = ['https://tn1.protonnz.com', 'https://api-xprnetwork-test.saltant.io'];
export const TESTNET_HYPERION_ENDPOINTS = ['https://hyp-xprtest.api.testnet.metalx.com'];
export type Network = 'mainnet' | 'testnet';
export const rpcPool = (n?: Network) => (n === 'testnet' ? TESTNET_RPC_ENDPOINTS : RPC_ENDPOINTS);
export const hyperionPool = (n?: Network) => (n === 'testnet' ? TESTNET_HYPERION_ENDPOINTS : HYPERION_ENDPOINTS);
const CHAIN_HOSTS = new Set([...RPC_ENDPOINTS, ...HYPERION_ENDPOINTS, ...TESTNET_RPC_ENDPOINTS, ...TESTNET_HYPERION_ENDPOINTS].map((u) => new URL(u).host));
// GitHub serves the guide's own files and runs its own published limits; it is not a community operator.
const UNMETERED_HOSTS = new Set(['raw.githubusercontent.com', 'api.github.com']);
async function withinBudget(host: string): Promise<boolean> {
	if (UNMETERED_HOSTS.has(host)) return true;
	const lim = CHAIN_HOSTS.has(host) ? chainLimiter : hostLimiter;
	if (!lim) return true;
	try {
		return (await lim.limit({ key: CHAIN_HOSTS.has(host) ? 'xpr-chain' : host })).success;
	} catch {
		return false; // fail closed: never send when the budget can't be checked
	}
}

const MEM_MAX = 300;
const mem = new Map<string, { until: number; value: FetchResult }>();
function memGet(k: string): FetchResult | null {
	const e = mem.get(k);
	if (!e) return null;
	if (e.until <= Date.now()) {
		mem.delete(k);
		return null;
	}
	return { ...e.value, cached: true };
}
function memPut(k: string, value: FetchResult, ttlSec: number) {
	if (ttlSec <= 0) return;
	if (mem.size >= MEM_MAX) mem.delete(mem.keys().next().value as string);
	mem.set(k, { until: Date.now() + ttlSec * 1000, value });
}
/** Tests only: forget cooldowns and the memory cache. */
export function __resetNetState() {
	coolUntil.clear();
	mem.clear();
}

function cacheKey(url: string, body?: string): Request {
	// POST bodies are folded into a synthetic GET key so the Cache API can store them.
	const k = body ? `${url}#${body}` : url;
	return new Request(`https://cache.guard-ian-guide.internal/${encodeURIComponent(k)}`);
}

async function cacheGet(key: Request): Promise<FetchResult | null> {
	const m = memGet(key.url);
	if (m) return m;
	try {
		const hit = await (globalThis as any).caches?.default?.match(key);
		if (!hit) return null;
		return { ...(await hit.json()), cached: true } as FetchResult;
	} catch {
		return null;
	}
}

async function cachePut(key: Request, value: FetchResult, ttlSec: number, ctx?: ExecutionContext) {
	memPut(key.url, value, ttlSec);
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
	opts: { ttlSec?: number; ctx?: ExecutionContext; startAt?: number; returnRedirects?: boolean; noBanOn403?: boolean } = {},
): Promise<FetchResult> {
	const ttl = opts.ttlSec ?? 0;
	const key = cacheKey(pool.join('|') + path, init.body);
	if (ttl > 0) {
		const hit = await cacheGet(key);
		if (hit) return hit;
	}
	const start = opts.startAt ?? Math.floor(Math.random() * pool.length);
	// Rotation order from `start`, minus every host that is cooling down (banned or rate-limited).
	const order = pool.map((_, i) => pool[(start + i) % pool.length]).filter((b) => !hostCooling(new URL(`${b}${path}`).host));
	if (!order.length) throw new UpstreamError('every endpoint for this read is cooling down after a ban or rate-limit answer, so nothing was sent; try again later');
	let lastErr = 'no endpoint answered';
	for (let attempt = 0; attempt < Math.min(MAX_ATTEMPTS, order.length); attempt++) {
		const base = order[attempt];
		const url = `${base}${path}`;
		const host = new URL(url).host;
		if (!(await withinBudget(host))) {
			throw new UpstreamError(
				`the shared budget for ${CHAIN_HOSTS.has(host) ? 'XPR chain reads' : host} is used up for this minute, so nothing was sent (it protects the people who run these servers); try again in a minute`,
			);
		}
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
			// rpc-queries.md:63 — 403 means a human banned this traffic. Stop contacting that host (whole isolate) for hours.
			// Except a robots.txt read (noBanOn403): some sites' firewalls answer 403 to /robots.txt alone (seen
			// 2026-10-16 on gov.api.xprnetwork.org, whose API answers normally), and that must not shut out the API.
			if (!opts.noBanOn403) coolHost(host, BAN_COOLDOWN_MS);
			lastErr = `${host} returned 403`;
			continue;
		}
		if (res.status === 429 || res.status === 503) {
			// rpc-queries.md:62,64 — honour Retry-After (2 s floor, 60 s cap) for every later request, then switch host.
			const ra = parseInt(res.headers.get('Retry-After') || '0', 10);
			coolHost(host, Math.min(60_000, Math.max(2_000, ra > 0 ? ra * 1000 : 2_000 * 2 ** attempt)));
			lastErr = `${host} returned ${res.status}`;
			await sleep(Math.min(MAX_BACKOFF_MS, 400 * 2 ** attempt));
			continue;
		}
		if (res.status >= 300 && res.status < 400) {
			// The caller (source_fetch) re-checks the target against its allow-list before following it.
			if (opts.returnRedirects) {
				const location = res.headers.get('Location') || '';
				return { status: res.status, text: '', source: url, cached: false, readAt: new Date().toISOString(), location };
			}
			lastErr = `${new URL(url).host} redirected (not followed)`;
			continue;
		}
		const { text, tooLarge } = await readCapped(res);
		const out: FetchResult = { status: res.status, text, source: url, cached: false, readAt: new Date().toISOString(), contentType: res.headers.get('content-type') || undefined, ...(tooLarge ? { tooLarge } : {}) };
		if (res.ok && ttl > 0 && !tooLarge) await cachePut(key, out, ttl, opts.ctx);
		return out;
	}
	throw new UpstreamError(lastErr);
}

/** POST a JSON body to an XPR RPC path (e.g. /v1/chain/get_info) and parse the JSON answer. */
export async function rpc(path: string, body: unknown, ttlSec: number, ctx?: ExecutionContext, startAt?: number, pool: string[] = RPC_ENDPOINTS) {
	const r = await politeFetch(pool, path, { method: 'POST', body: JSON.stringify(body ?? {}) }, { ttlSec, ctx, startAt: startAt === undefined ? undefined : startAt % pool.length });
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
