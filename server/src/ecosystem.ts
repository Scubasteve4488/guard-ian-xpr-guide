// ecosystem.ts: read-only reads of the ecosystem's own public APIs (builder's go 2026-10-16: "i need all 8").
// Every endpoint below was fetched and its robots/terms checked on 2026-10-16:
// GUARD-Project docs/xpr-guide/NEW-SOURCES-ENDPOINTS-2026-10-16.md. Same etiquette as the rest of the server:
// User-Agent, shared per-host budget (net.ts), caching, 1 MB cap. Every output passes the privacy filter here
// (people's accounts hidden; contracts, producers, registered agents and typed accounts kept) and again in index.ts.
// DogecoinVM: metaldoge.com robots.txt disallows /api/ and /rpc, so it is NOT read; only its Metal P-Chain validator.

import { politeFetch, getJson, UpstreamError } from './net.ts';
import { makeKeep, maskData, producerNames } from './history.ts';

const SIMPLEDEX = 'https://indexer.protonnz.com';
const METALX = 'https://dex.api.mainnet.metalx.com/dex/v1';
const AGENTS = 'https://indexer.xpragents.com/api';
const ATOMIC = 'https://xpr.api.atomicassets.io';
const METAL_API = 'https://api.metalblockchain.org';

const cap = (n: number | undefined, d: number, m: number) => Math.max(1, Math.min(m, n ?? d));
const enc = encodeURIComponent;
export const isMarketSymbol = (s: string) => /^[A-Z0-9]{1,10}_[A-Z0-9]{1,10}$/.test(s);
export const isSymbol = (s: string) => /^[A-Z]{1,7}$/.test(s);

async function keepFor(typed: string[], ctx?: ExecutionContext, extra: string[] = []) {
	return makeKeep([...typed, ...extra], await producerNames(ctx));
}

// ── 1. SimpleDEX indexer (Proton NZ). Doc: simpledex.fun/llms-analytics.txt §1 (120/min; holders/trades 50/min).
export async function simpledexTokens(a: { sort?: 'newest' | 'volume' | 'mcap'; graduated?: boolean; limit?: number }, ctx?: ExecutionContext) {
	const q = new URLSearchParams({ sort: a.sort ?? 'newest', fields: 'compact', limit: String(cap(a.limit, 20, 50)) });
	if (a.graduated !== undefined) q.set('graduated', String(a.graduated));
	const r = await getJson(`${SIMPLEDEX}/api/tokens?${q}`, 120, ctx);
	const keep = await keepFor([], ctx);
	return { data: maskData(r.json, keep), source: r.source, readAt: r.readAt };
}

export async function simpledexToken(a: { symbol?: string; id?: number; view?: 'info' | 'holders' | 'trades'; limit?: number }, ctx?: ExecutionContext) {
	const view = a.view ?? 'info';
	const keep = await keepFor([], ctx);
	if (view === 'info') {
		if (!a.symbol) throw new UpstreamError('give the token symbol for view "info"');
		const r = await getJson(`${SIMPLEDEX}/api/tokens?symbol=${enc(a.symbol)}`, 120, ctx);
		return { data: maskData(r.json, keep), source: r.source, readAt: r.readAt };
	}
	if (a.id === undefined) throw new UpstreamError(`give the numeric token id for view "${view}" (view "info" shows it as tokenId)`);
	const r = await getJson(`${SIMPLEDEX}/api/tokens/${a.id}/${view}?limit=${cap(a.limit, 20, 50)}`, 120, ctx);
	return { data: maskData(r.json, keep), source: r.source, readAt: r.readAt };
}

export async function simpledexMarket(a: { view?: 'stats' | 'pools' | 'graduations'; poolId?: number; limit?: number }, ctx?: ExecutionContext) {
	const view = a.view ?? 'stats';
	const path =
		view === 'stats' ? '/api/stats' : view === 'pools' ? `/api/pools?${a.poolId !== undefined ? `poolId=${a.poolId}` : `limit=${cap(a.limit, 20, 50)}`}` : `/api/events?limit=${cap(a.limit, 10, 50)}`;
	const r = await getJson(`${SIMPLEDEX}${path}`, 120, ctx);
	return { data: maskData(r.json, await keepFor([], ctx)), source: r.source, readAt: r.readAt };
}

// ── 2. Metal X market data. Doc: dev skill metalx-dex.md:59-201; api.dex.docs.metalx.com.
export async function metalxMarket(a: { symbol?: string; view: 'markets' | 'depth' | 'trades' | 'ohlcv' | 'daily'; interval?: string; from?: string; to?: string; limit?: number; step?: number }, ctx?: ExecutionContext) {
	const s = a.symbol ? enc(a.symbol) : '';
	let path: string;
	switch (a.view) {
		case 'markets':
			path = '/markets/all';
			break;
		case 'daily':
			path = '/trades/daily';
			break;
		case 'depth':
			path = `/orders/depth?symbol=${s}&limit=${cap(a.limit, 10, 50)}&step=${a.step ?? 1000}`;
			break;
		case 'trades':
			path = `/trades/recent?symbol=${s}&limit=${cap(a.limit, 20, 100)}`;
			break;
		case 'ohlcv':
			path = `/chart/ohlcv?symbol=${s}&interval=${enc(a.interval ?? '1D')}&limit=${cap(a.limit, 30, 200)}${a.from ? `&from=${enc(a.from)}` : ''}${a.to ? `&to=${enc(a.to)}` : ''}`;
			break;
	}
	if (a.view !== 'markets' && a.view !== 'daily' && !a.symbol) throw new UpstreamError('give a market symbol, e.g. "XPR_XMD"');
	const r = await getJson(`${METALX}${path}`, a.view === 'markets' ? 300 : 20, ctx);
	return { data: maskData(r.json, await keepFor([], ctx)), source: r.source, readAt: r.readAt };
}

// ── 3. XPR Agents indexer. Doc: xpr-agents @ 69adfab indexer/src/api/routes.ts (200/min live).
// Registered agents are public (RULES §3); their human owners and job clients are not.
export async function agentsDirectory(a: { view: 'stats' | 'list' | 'agent' | 'search' | 'jobs' | 'open_jobs'; account?: string; q?: string; limit?: number }, ctx?: ExecutionContext) {
	const lim = cap(a.limit, 10, 50);
	const path =
		a.view === 'stats' ? '/stats'
		: a.view === 'list' ? `/agents?limit=${lim}`
		: a.view === 'agent' ? `/agents/${enc(a.account ?? '')}`
		: a.view === 'search' ? `/search?q=${enc(a.q ?? '')}`
		: a.view === 'jobs' ? `/jobs?limit=${lim}`
		: `/jobs/open?limit=${lim}`;
	if (a.view === 'agent' && !a.account) throw new UpstreamError('give the agent account');
	if (a.view === 'search' && !a.q) throw new UpstreamError('give a search word');
	const r = await getJson(`${AGENTS}${path}`, 60, ctx);
	// Agent accounts named in the response stay visible; owners/clients do not.
	const agentNames: string[] = [];
	const collect = (x: any) => (Array.isArray(x) ? x : x ? [x] : []).forEach((g: any) => typeof g?.account === 'string' && agentNames.push(g.account));
	collect(r.json?.agents);
	if (a.view === 'agent') collect(r.json?.agent ?? r.json);
	const keep = await keepFor(a.account ? [a.account] : [], ctx, agentNames);
	return { data: maskData(r.json, keep), source: r.source, readAt: r.readAt };
}

// ── 4. AtomicAssets / AtomicMarket for XPR NFTs. Doc: dev skill nfts-atomicassets.md:80-218 (240/min live).
export async function nfts(a: { view: 'collections' | 'collection' | 'assets' | 'templates' | 'sales'; collection?: string; owner?: string; limit?: number }, ctx?: ExecutionContext) {
	const lim = cap(a.limit, 10, 50);
	const col = a.collection ? `&collection_name=${enc(a.collection)}` : '';
	const path =
		a.view === 'collections' ? `/atomicassets/v1/collections?limit=${lim}`
		: a.view === 'collection' ? `/atomicassets/v1/collections/${enc(a.collection ?? '')}`
		: a.view === 'assets' ? `/atomicassets/v1/assets?limit=${lim}${a.owner ? `&owner=${enc(a.owner)}` : ''}${col}`
		: a.view === 'templates' ? `/atomicassets/v1/templates?limit=${lim}${col}`
		: `/atomicmarket/v1/sales?state=1&limit=${lim}${col}`;
	if (a.view === 'collection' && !a.collection) throw new UpstreamError('give the collection name');
	if (a.view === 'assets' && !a.owner && !a.collection) throw new UpstreamError('give an owner (an account you know) or a collection');
	const r = await getJson(`${ATOMIC}${path}`, 60, ctx);
	// Collection names and authors of collections are project identities; owners/sellers/buyers are people.
	const typed = [a.owner, a.collection].filter(Boolean) as string[];
	return { data: maskData(r.json, await keepFor(typed, ctx)), source: r.source, readAt: r.readAt };
}

// ── 5. Metal Blockchain official public API (docs.metalblockchain.org/apis/metalgo/public-api-server).
async function metalRpc(chainPath: string, method: string, params: unknown, ttl: number, ctx?: ExecutionContext) {
	const r = await politeFetch([METAL_API], chainPath, { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }, { ttlSec: ttl, ctx, startAt: 0 });
	let j: any;
	try {
		j = JSON.parse(r.text);
	} catch {
		throw new UpstreamError('Metal API returned non-JSON');
	}
	if (j.error) throw new UpstreamError(`Metal API said: ${String(j.error.message ?? 'error').slice(0, 120)}`);
	return { result: j.result, source: `${METAL_API}${chainPath} (${method})`, readAt: r.readAt };
}

export async function metalChain(a: { view: 'height' | 'stake' | 'validator' | 'cchain' | 'dogecoinvm_validator'; address?: string; nodeId?: string }, ctx?: ExecutionContext) {
	switch (a.view) {
		case 'height': {
			const r = await metalRpc('/ext/bc/P', 'platform.getHeight', {}, 10, ctx);
			return { data: { pChainHeight: r.result?.height }, source: r.source, readAt: r.readAt };
		}
		case 'stake': {
			if (!a.address || !/^P-metal1[0-9a-z]{20,80}$/.test(a.address)) throw new UpstreamError('give a P-Chain address like "P-metal1…"');
			const r = await metalRpc('/ext/bc/P', 'platform.getStake', { addresses: [a.address] }, 60, ctx);
			const s = r.result ?? {};
			return { data: { address: a.address, stakedNanoMetal: s.staked, stakedMETAL: s.staked ? Number(s.staked) / 1e9 : null }, source: r.source, readAt: r.readAt };
		}
		case 'validator': {
			if (!a.nodeId || !/^NodeID-[1-9A-HJ-NP-Za-km-z]{20,60}$/.test(a.nodeId)) throw new UpstreamError('give a node id like "NodeID-…"');
			const r = await metalRpc('/ext/bc/P', 'platform.getCurrentValidators', { nodeIDs: [a.nodeId] }, 120, ctx);
			const v = (r.result?.validators ?? [])[0];
			if (!v) return { data: { nodeId: a.nodeId, validating: false }, source: r.source, readAt: r.readAt };
			return {
				data: { nodeId: v.nodeID, validating: true, weight: v.weight, startTime: v.startTime, endTime: v.endTime, uptime: v.uptime, connected: v.connected, delegationFee: v.delegationFee, delegatorCount: v.delegatorCount },
				source: r.source,
				readAt: r.readAt,
			};
		}
		case 'cchain': {
			const b = await metalRpc('/ext/bc/C/rpc', 'eth_blockNumber', [], 10, ctx);
			const c = await metalRpc('/ext/bc/C/rpc', 'eth_chainId', [], 3600, ctx);
			return { data: { blockNumber: parseInt(b.result, 16), chainId: parseInt(c.result, 16) }, source: b.source, readAt: b.readAt };
		}
		case 'dogecoinvm_validator': {
			// The only DogecoinVM read the site's robots.txt leaves open: its L1 validator on the Metal P-Chain
			// (dogecoin-vm docs/TESTING.md:16). Supply/peg figures sit behind metaldoge.com /api/ and /rpc, which are disallowed.
			const r = await metalRpc('/ext/bc/P', 'platform.getL1Validator', { validationID: 'qPanCREE6TaXz1TFT2qbt9uKvjtHg1AzWNMzYnStYAeJshNmB' }, 300, ctx);
			const v = r.result ?? {};
			return {
				data: { nodeId: v.nodeID, weight: v.weight, startTime: v.startTime, balance: v.balance, subnetID: v.subnetID, note: 'Validator state only. DogecoinVM supply and peg data are not read: metaldoge.com robots.txt disallows /api/ and /rpc.' },
				source: r.source,
				readAt: r.readAt,
			};
		}
	}
}

// ── 8. BTCVM / LTCVM wallet info (metalbtc.com, metalltc.com: no robots file; /api/info is the sites' own wallet API, undocumented).
export async function vmInfo(chain: 'btcvm' | 'ltcvm', ctx?: ExecutionContext) {
	const host = chain === 'btcvm' ? 'https://metalbtc.com' : 'https://metalltc.com';
	const r = await getJson(`${host}/api/info`, 300, ctx);
	return { data: r.json, source: r.source, readAt: r.readAt };
}

// ── 6. Governance (gov.xprnetwork.org) lives in contract `gov` (ABI read live 2026-10-16): read with xpr_table
// (code "gov", tables communities / proposals / votes). Proposal text is off chain (proposals.content is an id).

export async function governance(a: { view: 'communities' | 'proposals' | 'votes'; limit?: number }, ctx?: ExecutionContext) {
	const { table } = await import('./chain.ts');
	const r = await table({ code: 'gov', table: a.view, limit: cap(a.limit, 10, 50), reverse: a.view !== 'communities' }, ctx);
	return { data: maskData(r.data, await keepFor([], ctx)), source: r.source, readAt: r.readAt };
}
