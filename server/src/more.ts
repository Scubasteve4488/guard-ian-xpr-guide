// more.ts — four read-only tools added in 1.10.0 (builder, 2026-10-16: "i need all 8"; this file is items 5–8,
// IAN-CODE builds 1–4). Every one is read-only, goes through net.ts (shared per-host budgets, 403/429 back-off,
// caching, 1 MB cap), checks robots.txt for every non-RPC host, and passes through index.ts's privacy wrapper.
//
//   metal_blockchain   — Metal Blockchain (layer 0) through Metallicus's public API server.
//   xpr_governance     — gov.xprnetwork.org communities and proposals, read from the on-chain `gov` contract.
//   xpr_testnet        — XPR Network testnet: chain status, accounts, tables, and the SimpleDEX testnet indexer.
//   dogecoinvm_status  — DogecoinVM: its published limits, plus live reads that its robots.txt does not forbid.
//
// SOURCES (read 2026-10-16):
// - Metal public API: docs.metalblockchain.org/apis/metalgo/public-api-server — "The public API server is at
//   api.metalblockchain.org for Metal Mainnet and tahoe.metalblockchain.org for Metal Tahoe Testnet"; P-Chain at
//   /ext/bc/P, C-Chain at /ext/bc/C/rpc; "free and available to everyone without any authentication".
//   Methods and reply fields: MetalBlockchain/metalgo @ 9e18361 vms/platformvm/service.go (GetHeight :88,
//   GetCurrentValidators :708, GetCurrentSupply :1079 "an upper bound on the supply", GetBlockchainStatus :1154,
//   GetBlockchains :1348, GetMinStake :1652, GetTotalStake :1705) and vms/platformvm/api/validator.go; units from
//   utils/units/avax.go (1 coin = 1,000,000,000 nano units).
// - Governance: XPRNetwork/xpr-agents @ 69adfab openclaw/skills/governance (SKILL.md + src/index.ts): contract `gov`,
//   tables communities / proposals / govglobal, proposal text from https://gov.api.xprnetwork.org/api/v1/proposals/{id},
//   status rules (proposalStatus), proposal URL pattern. Upstream ships these reads; this is a port, not a new design.
//   Individual votes are NOT listed (upstream gov_get_votes scans up to 2,000 rows and returns voter names; totals
//   come from the Gov API instead, and voters stay private).
// - Testnet: XPRNetwork/xpr-network-dev-skill @ b7d9f1f skill/rpc-queries.md:22-27 (tn1.protonnz.com, Saltant),
//   SKILL.md:47 (chain id), resources.md:108 (explorer); SimpleDEX testnet guide testnet.dex.protonnz.com/llms-testnet.txt
//   v1.7 2026-09-24 (contracts simpledexv2 / simlaunchv2 / simpletoken, indexer testnet.indexer.protonnz.com, limits
//   120 requests/min general).
// - DogecoinVM: MetalBlockchain/dogecoin-vm @ cfb9dad (2026-10-13) README.md and docs/API.md. metaldoge.com/robots.txt
//   (read 2026-10-16): "Disallow: /api/" and "Disallow: /rpc", so neither is read here. The bridge's Dogecoin-side
//   balance comes from BlockCypher (www.blockcypher.com/dev/bitcoin/#rate-limits-and-tokens: no token needed for
//   read-only GET calls; free tier "up to 3 requests/sec and 100 requests/hr"), cached 10 minutes.
// SOURCE (hand-built code): none found that a Worker can import — upstream's governance skill runs inside the
// openclaw runtime; its reads are ported here line for line with the shared rate limits added.

import { z } from 'zod';
import { politeFetch, UpstreamError } from './net.ts';
import { robotsAllows } from './robots.ts';
import { makeKeep, maskName } from './history.ts';
import { table, isAccountName, isTableName, scopeFor } from './chain.ts';
import { labelUntrusted } from './sources.ts';

type Handler = (args: any) => Promise<any>;
type Register = (name: string, config: unknown, handler: Handler) => unknown;
type Result = { isError?: boolean; content: Array<{ type: 'text'; text: string }> };

const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } as const;

function ok(data: unknown, source: string | string[], readAt: string, note?: string): Result {
	const srcs = Array.isArray(source) ? source : [source];
	const text = [JSON.stringify(data, null, 2), '', `Source: ${srcs.join(' ; ')}`, `Read at: ${readAt}`, note ? `Note: ${note}` : '']
		.filter((x) => x !== '')
		.join('\n');
	return { content: [{ type: 'text', text }] };
}
function fail(e: unknown, hint: string): Result {
	const msg = (e instanceof UpstreamError ? e.message : 'unexpected error').replace(/\.+$/, '');
	return { isError: true, content: [{ type: 'text', text: `Could not complete: ${msg}. ${hint}` }] };
}
function bad(msg: string): Result {
	return { isError: true, content: [{ type: 'text', text: msg }] };
}

/** GET/POST JSON from a non-RPC host, after its robots.txt allows the path. */
async function getJson(base: string, path: string, ttlSec: number, ctx?: ExecutionContext, body?: unknown) {
	const url = new URL(`${base}${path}`);
	if (!(await robotsAllows(url, ctx))) throw new UpstreamError(`${url.host}'s robots.txt does not allow automated reading of ${url.pathname}`);
	const r = await politeFetch([base], path, body === undefined ? { method: 'GET' } : { method: 'POST', body: JSON.stringify(body) }, { ttlSec, ctx });
	if (r.status !== 200) throw new UpstreamError(`${url.host} answered HTTP ${r.status}`);
	if (r.tooLarge) throw new UpstreamError(`${url.host} sent more than 1 MB, so the answer was not used`);
	try {
		return { json: JSON.parse(r.text), source: r.source, readAt: r.readAt };
	} catch {
		throw new UpstreamError(`${url.host} returned non-JSON`);
	}
}

/** Nano units (9 decimals) as a decimal string, without floating point. */
export function fromNano(v: unknown, decimals = 9): string | null {
	const s = String(v ?? '');
	if (!/^\d+$/.test(s)) return null;
	const b = BigInt(s);
	const d = 10n ** BigInt(decimals);
	const frac = (b % d).toString().padStart(decimals, '0').replace(/0+$/, '');
	return `${(b / d).toString()}${frac ? '.' + frac : ''}`;
}
/** A signed integer amount in koinu (8 decimals), e.g. a pending outgoing payment is negative. */
export function signedDoge(v: unknown): string | null {
	const n = String(v ?? '');
	if (!/^-?\d+$/.test(n)) return null;
	const neg = n.startsWith('-');
	const abs = fromNano(neg ? n.slice(1) : n, 8);
	return abs === null ? null : neg && abs !== '0' ? `-${abs}` : abs;
}
const iso = (sec: unknown) => (/^\d+$/.test(String(sec ?? '')) ? new Date(Number(sec) * 1000).toISOString() : null);

// ── 5. Metal Blockchain ─────────────────────────────────────────────────────────────────────────────────────────
export const METAL_API = { mainnet: 'https://api.metalblockchain.org', tahoe: 'https://tahoe.metalblockchain.org' } as const;
const PRIMARY_NETWORK = '11111111111111111111111111111111LpoYY'; // metalgo constants.PrimaryNetworkID (ids.Empty)

async function metalRpc(net: keyof typeof METAL_API, path: string, method: string, params: unknown, ttl: number, ctx?: ExecutionContext) {
	const r = await getJson(METAL_API[net], path, ttl, ctx, { jsonrpc: '2.0', id: 1, method, params });
	if (r.json?.error) throw new UpstreamError(`${method}: ${String(r.json.error.message ?? 'error').slice(0, 160)}`);
	return { result: r.json?.result, source: `${r.source} (${method})`, readAt: r.readAt };
}

/** Validators, compacted: reward-owner addresses are left out on purpose (they belong to people). */
export function compactValidators(list: any[], limit: number) {
	const rows = (Array.isArray(list) ? list : []).map((v) => ({
		nodeID: String(v.nodeID ?? ''),
		stakeMETAL: fromNano(v.weight ?? v.stakeAmount),
		start: iso(v.startTime),
		end: iso(v.endTime),
		delegationFeePercent: v.delegationFee != null ? Number(v.delegationFee) : null,
		uptimePercent: v.uptime != null ? Number(v.uptime) : null,
		connected: typeof v.connected === 'boolean' ? v.connected : null,
		delegators: v.delegatorCount != null ? Number(v.delegatorCount) : null,
		delegatedMETAL: v.delegatorWeight != null ? fromNano(v.delegatorWeight) : null,
		_w: BigInt(/^\d+$/.test(String(v.weight ?? '')) ? String(v.weight) : '0'),
	}));
	rows.sort((a, b) => (a._w < b._w ? 1 : a._w > b._w ? -1 : 0));
	const total = rows.reduce((s, r) => s + r._w, 0n);
	return {
		count: rows.length,
		totalStakeMETAL: fromNano(total.toString()),
		top: rows.slice(0, limit).map(({ _w, ...r }) => r),
	};
}

// ── 6. Governance ───────────────────────────────────────────────────────────────────────────────────────────────
const GOV = 'gov';
const GOV_API = 'https://gov.api.xprnetwork.org';
const GOV_SITE = 'https://gov.xprnetwork.org';
const STATUSES = ['Active', 'Upcoming', 'Ended', 'Approved', 'Declined'] as const;

/** Upstream proposalStatus (xpr-agents @ 69adfab openclaw/skills/governance/src/index.ts). */
export function proposalStatus(p: any, nowSec = Math.floor(Date.now() / 1000)): string {
	if (p.approve === 'Approved') return 'Approved';
	if (p.approve === 'Declined') return 'Declined';
	if (nowSec < Number(p.startTime)) return 'Upcoming';
	if (nowSec <= Number(p.endTime)) return 'Active';
	return 'Ended';
}
function proposalRow(p: any, keep: Set<string>) {
	return {
		id: p.id,
		community_id: p.communityId,
		author: typeof p.author === 'string' ? maskName(p.author, keep) : null,
		content_id: p.content ?? null,
		voting_system: p.votingSystem,
		candidates: Array.isArray(p.candidates) ? p.candidates.map((c: any) => ({ id: c.id, name: c.name })) : [],
		start: iso(p.startTime),
		end: iso(p.endTime),
		status: proposalStatus(p),
		url: `${GOV_SITE}/communities/${p.communityId}/proposals/${p.id}`,
	};
}

// ── 7. Testnet ──────────────────────────────────────────────────────────────────────────────────────────────────
export const TESTNET_RPC = ['https://tn1.protonnz.com', 'https://api-xprnetwork-test.saltant.io'];
export const TESTNET_CHAIN_ID = '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd';
const TESTNET_INDEXER = 'https://testnet.indexer.protonnz.com';
const TESTNET_EXPLORER = 'https://testnet.explorer.xprnetwork.org';
export const TESTNET_INDEXER_PATHS = {
	stats: '/api/stats',
	tokens: '/api/tokens?fields=compact&limit=20',
	newest: '/api/tokens?sort=newest&fields=compact&limit=10',
	pools: '/api/pools',
	events: '/api/events?limit=10',
} as const;

async function testnetRpc(path: string, body: unknown, ttl: number, ctx?: ExecutionContext) {
	const r = await politeFetch(TESTNET_RPC, path, { method: 'POST', body: JSON.stringify(body ?? {}) }, { ttlSec: ttl, ctx });
	let json: any;
	try {
		json = JSON.parse(r.text);
	} catch {
		throw new UpstreamError(`${new URL(r.source).host} returned non-JSON (HTTP ${r.status})`);
	}
	if (r.status !== 200) throw new UpstreamError(`${new URL(r.source).host}: ${String(json?.error?.what ?? json?.message ?? `HTTP ${r.status}`).slice(0, 160)}`);
	return { json, source: r.source, readAt: r.readAt };
}

// ── 8. DogecoinVM ───────────────────────────────────────────────────────────────────────────────────────────────
export const DOGEVM = {
	repo: 'https://github.com/MetalBlockchain/dogecoin-vm',
	commit: 'cfb9dad (2026-10-13)',
	site: 'https://metaldoge.com',
	chainID: '2hFCfzdMmfXBxYgvvdL7BYiJAxdejyn4AksMYUM2eM5gN7Xrjy', // docs/API.md "GET /api/info" example
	vmID: 'mEUwHwfd8UTHf23UYkQxHvy1n1EGwWieXQnjmtzSryJRZckzu', // README.md:94
	pegAddress: 'AAvNfukpAa4iTcRJPetxuxX8XxbC5gFqUM', // docs/API.md: the bridge's multisig on Dogecoin
	published: {
		status: 'Live on Metal mainnet as a capped alpha with real DOGE (README.md:13)',
		maxDepositDOGE: '100',
		maxCirculatingDOGE: '4200',
		minDepositDOGE: '1',
		minPegOutDOGE: '2',
		signersRequired: 2,
		depositConfirmations: '6 to 20 Dogecoin confirmations depending on amount, never fewer than 6 on mainnet',
		warning: 'README: the code has not been audited, the chain has one validator, and one operator holds every peg signer key. Keep amounts small.',
	},
};
const BLOCKCYPHER = 'https://api.blockcypher.com';

export function registerMoreTools(register: Register, ctx?: ExecutionContext) {
	// ── metal_blockchain
	register(
		'metal_blockchain',
		{
			title: 'Metal Blockchain live data (layer 0)',
			description:
				"Live reads from Metal Blockchain, Metallicus's layer 0, through its official public API server: status (P-Chain height, METAL supply upper bound, C-Chain block), validators (count, total stake, top validators by stake), chains (every blockchain on Metal with its subnet and VM, e.g. DogecoinVM, BTCVM), staking (minimum validator and delegator stake, total staked). Mainnet or the Tahoe testnet. Read-only.",
			inputSchema: z.object({
				view: z.enum(['status', 'validators', 'chains', 'staking']).describe('What to read'),
				network: z.enum(['mainnet', 'tahoe']).optional().describe('Default mainnet'),
				limit: z.number().int().min(1).max(50).optional().describe('validators: how many to list (default 20)'),
			}),
			annotations: { title: 'Metal Blockchain', ...RO },
		},
		async ({ view, network, limit }: { view: string; network?: 'mainnet' | 'tahoe'; limit?: number }) => {
			const net = network ?? 'mainnet';
			const explorer = net === 'mainnet' ? 'https://explorer.metalblockchain.org' : 'https://tahoe.metalblockchain.org';
			try {
				if (view === 'status') {
					const h = await metalRpc(net, '/ext/bc/P', 'platform.getHeight', {}, 10, ctx);
					const s = await metalRpc(net, '/ext/bc/P', 'platform.getCurrentSupply', { subnetID: PRIMARY_NETWORK }, 60, ctx);
					const c = await metalRpc(net, '/ext/bc/C/rpc', 'eth_blockNumber', [], 10, ctx);
					return ok(
						{
							network: net,
							pChainHeight: Number(h.result?.height ?? NaN),
							currentSupplyMETAL: fromNano(s.result?.supply),
							cChainBlock: typeof c.result === 'string' ? parseInt(c.result, 16) : null,
							explorer,
						},
						[h.source, s.source, c.source],
						h.readAt,
						'Live. currentSupply is what the node reports as "an upper bound on the supply" (metalgo service.go:1078). Amounts are METAL.',
					);
				}
				if (view === 'validators') {
					const v = await metalRpc(net, '/ext/bc/P', 'platform.getCurrentValidators', {}, 60, ctx);
					return ok(
						{ network: net, ...compactValidators(v.result?.validators ?? [], limit ?? 20), explorer },
						v.source,
						v.readAt,
						'Live primary-network validators, largest stake first. Reward addresses are left out on purpose: they belong to people. Node IDs are servers.',
					);
				}
				if (view === 'chains') {
					const b = await metalRpc(net, '/ext/bc/P', 'platform.getBlockchains', {}, 300, ctx);
					const chains = (b.result?.blockchains ?? []).map((x: any) => ({
						id: x.id,
						name: x.name,
						subnetID: x.subnetID,
						vmID: x.vmID,
						...(x.vmID === DOGEVM.vmID ? { known: 'DogecoinVM (VM ID from its README)' } : {}),
					}));
					return ok({ network: net, count: chains.length, chains, explorer }, b.source, b.readAt, 'Live list of every blockchain registered on Metal\'s P-Chain. A chain being listed does not mean it is in use.');
				}
				const m = await metalRpc(net, '/ext/bc/P', 'platform.getMinStake', { subnetID: PRIMARY_NETWORK }, 300, ctx);
				const t = await metalRpc(net, '/ext/bc/P', 'platform.getTotalStake', { subnetID: PRIMARY_NETWORK }, 60, ctx);
				return ok(
					{
						network: net,
						minValidatorStakeMETAL: fromNano(m.result?.minValidatorStake),
						minDelegatorStakeMETAL: fromNano(m.result?.minDelegatorStake),
						totalStakedMETAL: fromNano(t.result?.weight ?? t.result?.stake),
						explorer,
					},
					[m.source, t.source],
					m.readAt,
					'Live staking rules for the Metal primary network. Running a validator also needs a node; see docs.metalblockchain.org/nodes.',
				);
			} catch (e) {
				return fail(e, `Metal's explorer is at ${explorer}.`);
			}
		},
	);

	// ── xpr_governance
	register(
		'xpr_governance',
		{
			title: 'XPR Network governance (gov.xprnetwork.org)',
			description:
				'Read XPR Network governance from the on-chain `gov` contract (the gov.xprnetwork.org portal): communities (XPR Network, Metal DAO, LOAN Protocol, XPR Grants, Metal X, D.O.G.E.) with their voting strategy, proposal fee and quorum; recent proposals, filtered by community and status; one proposal with its title, description and vote totals from the official Gov API; the global counts. Voters are not listed; authors and admins show as "[private account]". Read-only.',
			inputSchema: z.object({
				view: z.enum(['communities', 'proposals', 'proposal', 'config']).describe('What to read'),
				community_id: z.number().int().min(0).max(100000).optional().describe('proposals: only this community (e.g. 3 = XPR Network)'),
				status: z.enum(STATUSES).optional().describe('proposals: only this status'),
				proposal_id: z.number().int().min(0).max(100000000).optional().describe('proposal: its ID'),
				limit: z.number().int().min(1).max(20).optional().describe('proposals: how many (default 10)'),
			}),
			annotations: { title: 'XPR governance', ...RO },
		},
		async (a: { view: string; community_id?: number; status?: string; proposal_id?: number; limit?: number }) => {
			const keep = makeKeep([]);
			try {
				if (a.view === 'communities') {
					const r = await table({ code: GOV, table: 'communities', limit: 50 }, ctx);
					const rows = r.data.rows.map((c: any) => ({
						id: c.id,
						name: c.name,
						description: typeof c.description === 'string' ? c.description.slice(0, 300) : null,
						website: c.website ?? null,
						strategies: c.strategies,
						voting_systems: c.votingSystems,
						proposal_fee: c.proposalFee?.quantity ?? null,
						proposal_fee_contract: c.proposalFee?.contract ?? null,
						quorum_percent: typeof c.quorum === 'number' ? c.quorum / 100 : null,
						admins: Array.isArray(c.admins) ? c.admins.map((x: string) => maskName(x, keep)) : [],
						url: `${GOV_SITE}/communities/${c.id}`,
					}));
					return ok({ count: rows.length, communities: rows }, r.source, r.readAt, 'Live from the gov contract. Quorum is a percent of the strategy\'s total weight.');
				}
				if (a.view === 'config') {
					const r = await table({ code: GOV, table: 'govglobal', limit: 1 }, ctx);
					const g = r.data.rows[0];
					if (!g) return bad('The governance config row was not found.');
					return ok(
						{ paused: !!g.isPaused, next_community_id: g.communityId, next_proposal_id: g.proposalId, next_vote_id: g.voteId },
						r.source,
						r.readAt,
						'Live. The "next" IDs are counters, so they show how many communities, proposals and votes have ever been created (upstream reads them the same way).',
					);
				}
				if (a.view === 'proposal') {
					if (a.proposal_id === undefined) return bad('proposal needs proposal_id.');
					const r = await table({ code: GOV, table: 'proposals', lower_bound: String(a.proposal_id), upper_bound: String(a.proposal_id), limit: 1 }, ctx);
					const p = r.data.rows[0];
					if (!p) return bad(`Proposal #${a.proposal_id} was not found.`);
					const row = proposalRow(p, keep);
					const sources = [r.source];
					let detail: any = null;
					if (p.content) {
						try {
							const g = await getJson(GOV_API, `/api/v1/proposals/${encodeURIComponent(String(p.content))}`, 120, ctx);
							sources.push(g.source);
							const desc = typeof g.json?.description === 'string' ? g.json.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000) : null;
							detail = {
								title: typeof g.json?.title === 'string' ? g.json.title.slice(0, 300) : null,
								description: desc ? labelUntrusted(desc, `${GOV_API}/api/v1/proposals/${p.content}`) : null,
								candidates: Array.isArray(g.json?.candidates)
									? g.json.candidates.map((c: any) => ({ id: c.id, name: c.name, votes: c.tokenAmount ?? null }))
									: null,
								total_votes: g.json?.tokenAmount ?? null,
								quorum_reached_percent: g.json?.quorum ?? null,
							};
						} catch {
							detail = { note: 'The Gov API did not answer, so the title and vote totals are missing.' };
						}
					}
					return ok({ ...row, ...(detail ?? {}) }, sources, r.readAt, 'Live. Votes are totals only; who voted is not listed.');
				}
				const want = a.limit ?? 10;
				const r = await table({ code: GOV, table: 'proposals', reverse: true, limit: 50 }, ctx);
				const rows = r.data.rows
					.filter((p: any) => a.community_id === undefined || p.communityId === a.community_id)
					.filter((p: any) => !a.status || proposalStatus(p) === a.status)
					.slice(0, want)
					.map((p: any) => proposalRow(p, keep));
				return ok(
					{ count: rows.length, scanned: r.data.rows.length, proposals: rows },
					r.source,
					r.readAt,
					'Live, newest first, from the latest 50 proposals. Use view "proposal" with an ID for its title, text and vote totals.',
				);
			} catch (e) {
				return fail(e, `The portal is ${GOV_SITE}.`);
			}
		},
	);

	// ── xpr_testnet
	register(
		'xpr_testnet',
		{
			title: 'XPR Network testnet reads',
			description:
				'Read the XPR Network TESTNET (not mainnet): chain status (verifies the testnet chain id), one account, one contract table, or the SimpleDEX testnet indexer (stats, tokens, newest launches, pools, graduations). Testnet SimpleDEX contracts are simpledexv2, simlaunchv2 and simpletoken. Testnet tokens have no value. Read-only.',
			inputSchema: z.object({
				view: z.enum(['chain_info', 'account', 'table', 'simpledex']).describe('What to read'),
				account: z.string().max(13).optional().describe('account: the testnet account'),
				code: z.string().max(13).optional().describe('table: contract, e.g. "simlaunchv2"'),
				table: z.string().max(13).optional().describe('table: table name, e.g. "curves"'),
				scope: z.string().max(20).optional().describe('table: scope (default = code)'),
				lower_bound: z.string().max(40).optional().describe('table: start key'),
				limit: z.number().int().min(1).max(50).optional().describe('table: rows (default 20)'),
				simpledex: z.enum(['stats', 'tokens', 'newest', 'pools', 'events']).optional().describe('simpledex: which indexer view (default stats)'),
			}),
			annotations: { title: 'XPR testnet', ...RO },
		},
		async (a: any) => {
			try {
				if (a.view === 'chain_info') {
					const r = await testnetRpc('/v1/chain/get_info', {}, 5, ctx);
					if (r.json.chain_id !== TESTNET_CHAIN_ID) return bad(`That endpoint did not report the XPR testnet chain id, so its answer was not used.`);
					return ok(
						{ network: 'XPR Network testnet', chain_id: r.json.chain_id, head_block: r.json.head_block_num, last_irreversible_block: r.json.last_irreversible_block_num, head_block_time: r.json.head_block_time, explorer: TESTNET_EXPLORER },
						r.source,
						r.readAt,
						'Live testnet. Not mainnet: nothing here has real value.',
					);
				}
				if (a.view === 'account') {
					if (!a.account || !isAccountName(a.account)) return bad('account needs a valid XPR account name.');
					const r = await testnetRpc('/v1/chain/get_account', { account_name: a.account }, 20, ctx);
					const j = r.json;
					return ok(
						{
							network: 'XPR Network testnet',
							account: j.account_name,
							created: j.created,
							xpr_balance: j.core_liquid_balance ?? null,
							ram: { quota: j.ram_quota, used: j.ram_usage },
							permissions: (j.permissions ?? []).map((p: any) => ({
								name: p.perm_name,
								parent: p.parent,
								threshold: p.required_auth?.threshold,
								keys: (p.required_auth?.keys ?? []).map((k: any) => k.key),
								accounts: (p.required_auth?.accounts ?? []).map((x: any) => `${x.permission?.actor}@${x.permission?.permission}`),
							})),
							explorer: `${TESTNET_EXPLORER}/account/${j.account_name}`,
						},
						r.source,
						r.readAt,
						'Live testnet. Public keys are public; no secret is ever shown.',
					);
				}
				if (a.view === 'table') {
					if (!a.code || !isAccountName(a.code) || !a.table || !isTableName(a.table)) return bad('table needs code and table (valid names).');
					const body: any = { code: a.code, table: a.table, scope: scopeFor(a.scope ?? a.code), json: true, limit: Math.max(1, Math.min(50, a.limit ?? 20)) };
					if (a.lower_bound) body.lower_bound = a.lower_bound;
					const r = await testnetRpc('/v1/chain/get_table_rows', body, 15, ctx);
					return ok({ network: 'XPR Network testnet', rows: r.json.rows ?? [], more: !!r.json.more, next_key: r.json.next_key ?? null }, r.source, r.readAt, 'Live testnet. Page with lower_bound = next_key.');
				}
				const which = (a.simpledex ?? 'stats') as keyof typeof TESTNET_INDEXER_PATHS;
				const g = await getJson(TESTNET_INDEXER, TESTNET_INDEXER_PATHS[which], 60, ctx);
				let data: any = g.json;
				if (which === 'pools' && Array.isArray(g.json?.pools)) {
					const pools = [...g.json.pools].sort((x: any, y: any) => (Number(y.tvlUsd) || 0) - (Number(x.tvlUsd) || 0));
					data = { count: pools.length, top: pools.slice(0, 20).map((p: any) => ({ poolId: p.poolId, pair: `${p.tokenA?.symbol}/${p.tokenB?.symbol}`, tvlUsd: p.tvlUsd, feeRate: p.feeRate, volumeUsd24h: p.volumeUsd24h })) };
				}
				return ok(
					{ network: 'XPR Network testnet', view: which, data },
					g.source,
					g.readAt,
					'SimpleDEX TESTNET indexer (updates about every 5 minutes; testnet guide llms-testnet.txt v1.7). Testnet prices are not real.',
				);
			} catch (e) {
				return fail(e, `The testnet explorer is ${TESTNET_EXPLORER}.`);
			}
		},
	);

	// ── dogecoinvm_status
	register(
		'dogecoinvm_status',
		{
			title: 'DogecoinVM status and reserve',
			description:
				"DogecoinVM (Dogecoin on Metal Blockchain, pegged 1:1 to real DOGE): its published alpha limits and warnings from its official code repository, plus two live reads: whether its chain is registered on Metal's P-Chain, and the DOGE held by the bridge's multisig address on the Dogecoin chain. Its own /api and /rpc pages are not read, because metaldoge.com's robots.txt asks automated tools not to. Read-only.",
			inputSchema: z.object({}),
			annotations: { title: 'DogecoinVM', ...RO },
		},
		async () => {
			const out: any = { published: { ...DOGEVM.published, source: `${DOGEVM.repo} @ ${DOGEVM.commit} (README.md, docs/API.md)` }, chainID: DOGEVM.chainID, site: DOGEVM.site };
			const sources: string[] = [`${DOGEVM.repo} @ ${DOGEVM.commit}`];
			const notes: string[] = [];
			let readAt = new Date().toISOString();
			try {
				const s = await metalRpc('mainnet', '/ext/bc/P', 'platform.getBlockchainStatus', { blockchainID: DOGEVM.chainID }, 300, ctx);
				out.metalPChain = { status: s.result?.status ?? null, meaning: 'Registered on Metal mainnet if not "Unknown". The public API node does not validate it, so "Created" is normal.' };
				sources.push(s.source);
				readAt = s.readAt;
			} catch (e) {
				notes.push(`Metal P-Chain status not read: ${e instanceof UpstreamError ? e.message : 'error'}.`);
			}
			try {
				const b = await getJson(BLOCKCYPHER, `/v1/doge/main/addrs/${DOGEVM.pegAddress}/balance`, 600, ctx);
				out.bridgeReserveOnDogecoin = {
					address: DOGEVM.pegAddress,
					confirmedDOGE: fromNano(b.json?.balance, 8),
					pendingChangeDOGE: signedDoge(b.json?.unconfirmed_balance),
					transactions: b.json?.n_tx ?? null,
					addressFrom: `docs/API.md @ ${DOGEVM.commit}; the bridge can move its reserve (API.md "maintenance"), so a zero here may mean it moved`,
				};
				sources.push(b.source);
			} catch (e) {
				notes.push(`Dogecoin-side balance not read: ${e instanceof UpstreamError ? e.message : 'error'}.`);
			}
			notes.push('Not read: DogecoinVM\'s own live circulating supply and proof-of-reserves pages (metaldoge.com/api, /rpc), because its robots.txt disallows them for automated tools.');
			return ok(out, sources, readAt, notes.join(' '));
		},
	);
}
