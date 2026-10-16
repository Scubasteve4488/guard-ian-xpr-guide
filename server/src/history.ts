// history.ts: read-only action history (Hyperion) and contract interfaces (ABI), plus explorer links for people.
// Builder's go 2026-10-16, after the expert exam: neither Grok nor ChatGPT could find the setantisnp transaction
// (no history tool) and ChatGPT could not read a contract's action fields (no ABI tool). The XPR Network Explorer
// (explorer.xprnetwork.org) builds its pages in the browser, so it cannot be fetched; it shows this same data, from
// Hyperion and the chain, and every result here carries an explorer link so a person can check it.
// SOURCE: XPRNetwork/xpr-network-dev-skill @ b7d9f1f skill/rpc-queries.md:49-56 (Hyperion etiquette: cap page-scroll,
// cache historical pages), hyperion-operations-caveats.md §9-10 (10,000 offset cap; asc window 90 days).

import { politeFetch, rpc, HYPERION_ENDPOINTS, UpstreamError, rpcPool, hyperionPool, type Network } from './net.ts';

export const EXPLORER = 'https://explorer.xprnetwork.org';
export const TESTNET_EXPLORER = 'https://testnet.explorer.xprnetwork.org';
const ex = (n?: Network) => (n === 'testnet' ? TESTNET_EXPLORER : EXPLORER);
export const explorerTx = (id: string, n?: Network) => `${ex(n)}/transaction/${id}`;
export const explorerAccount = (name: string, n?: Network) => `${ex(n)}/account/${name}`;

const MAX_DATA_CHARS = 600;
const clip = (v: unknown) => {
	const s = JSON.stringify(v ?? null);
	return s.length > MAX_DATA_CHARS ? s.slice(0, MAX_DATA_CHARS) + '…(cut)' : s;
};

// Privacy (builder's ruling 2026-10-16; RULES §3, INSTRUCTIONS rule 7): history and block reads show WHO signed and
// who sent to whom. Keep system, contract, exchange and block-producer accounts and any account the caller typed;
// hide everyone else as "[private account]". Conservative: a contract not on this list is hidden too.
const PUBLIC_ACCOUNTS = new Set([
	'eosio', 'eosio.token', 'eosio.msig', 'eosio.ram', 'eosio.ramfee', 'eosio.stake', 'eosio.bpay', 'eosio.vpay', 'eosio.names',
	'eosio.saving', 'eosio.rex', 'eosio.wrap', 'eosio.proton', 'stake.proton', 'eosio.null', 'eosio.prods',
	'simplelaunch', 'simpledex', 'simpletoken', 'simplesetup', 'simpleguard', 'dex.protonnz', 'simlaunchv2', 'simpledexv2',
	'xtokens', 'xmd.token', 'xmd.treasury', 'loan.token', 'lending.loan', 'shares.loan', 'dex', 'proton.swaps', 'blocklist',
	'agentcore', 'agentescrow', 'agentvalid', 'agentfeed', 'atomicassets', 'atomicmarket', 'oracles', 'proton.wrap',
	'metalpay.com', 'kucoindotxpr', 'bithumbxprr1', 'gatedeposit', 'hitbtcxprins', 'coinex2zmoon', 'webauth', 'protonnz',
]);
// A field counts as "a person" when its NAME contains one of these words (to_account, new_owner, bidder, ram_payer…).
const PERSON_KEY = /(^|_)(from|to|payer|owner|account|acct|user|buyer|seller|creator|receiver|voter|actor|proposer|executer|executor|approver|claimer|client|agent|holder|trader|recipient|sender|name|bidder|winner|player|member|signer|referrer|beneficiary|delegator|producer|validator|staker|minter|maker|taker|caller|requester|arbitrator|author|admin|controller|seller_user|bid_user|ask_user)s?($|_)/i;
export const PRIVATE = '[private account]';
const NAME = /^[a-z1-5.]{1,12}$/;
const MAX_DEPTH = 6;
// Field names that hold project identifiers, not people (an NFT collection, schema or market name).
const NOT_PERSON = new Set(['collection_name', 'schema_name', 'market_name', 'symbol_name', 'token_name', 'pool_name', 'community_name', 'contract']);
export const NESTED_HIDDEN = '[nested data hidden]';

export function makeKeep(extra: string[] = [], producers: string[] = []): Set<string> {
	return new Set([...PUBLIC_ACCOUNTS, ...producers, ...extra.filter(Boolean)]);
}
// 1.16.0 (builder 2026-10-16, option (a): "wallet names ... They're not private"): account names in lists, tables,
// history, blocks and indexer data are shown. Still hidden: every name on the network blocklist (table rows and the
// blocklist contract's own actions: naming a listed account reads as a label) and, in every result, the builder's
// own account (privacy.ts). Looking into ONE ordinary wallet (balances, history, holdings) stays limited to public
// accounts by the gates in index.ts; that part is unchanged.
const NAMES_SHOWN = true;
export function maskName(n: string, keep: Set<string>, strict = false): string {
	return (!strict && NAMES_SHOWN) || keep.has(n) ? n : PRIVATE;
}
/**
 * Fail closed (review 2026-10-16): anything deeper than MAX_DEPTH is replaced, never passed through unchecked.
 * Under a person-like key, every name-shaped string is checked, however it is nested (arrays, {actor, permission}…).
 */
export function maskData(v: any, keep: Set<string>, depth = 0, personal = false, strict = false): any {
	if (v == null) return v;
	if (typeof v === 'string') return personal && NAME.test(v) ? maskName(v, keep, strict) : v;
	if (typeof v !== 'object') return v;
	if (depth >= MAX_DEPTH) return NESTED_HIDDEN;
	if (Array.isArray(v)) return v.map((x) => maskData(x, keep, depth + 1, personal, strict));
	const out: any = {};
	for (const [k, x] of Object.entries(v)) out[k] = maskData(x, keep, depth + 1, !NOT_PERSON.has(k) && (personal || PERSON_KEY.test(k)), strict);
	return out;
}
/** Every name-shaped string maskData would hide (same walk, same person keys), so a caller can check a few first. */
export function personNames(v: any, out: Set<string> = new Set(), depth = 0, personal = false): Set<string> {
	if (v == null || depth >= MAX_DEPTH) return out;
	if (typeof v === 'string') {
		if (personal && NAME.test(v)) out.add(v);
		return out;
	}
	if (typeof v !== 'object') return out;
	if (Array.isArray(v)) {
		for (const x of v) personNames(x, out, depth + 1, personal);
		return out;
	}
	for (const [k, x] of Object.entries(v)) personNames(x, out, depth + 1, !NOT_PERSON.has(k) && (personal || PERSON_KEY.test(k)));
	return out;
}

// Tables whose rows ARE public entities by their nature: the registered block producers and the registered agents.
const PUBLIC_ROW_FIELDS: Record<string, string> = { 'eosio/producers': 'owner', 'agentcore/agents': 'account' };
// Tables whose names are never shown, whatever the account is (RULES: accounts on a blocklist stay private; naming one
// would read as a label). Live check 2026-10-16: one listed account passed the contract check and was shown.
const ALWAYS_PRIVATE_TABLES = new Set(['blocklist/blocklist']);
/** Tables whose every name is private (1.14.5). 1.15.2: they are read only from the start, without bounds. */
export const isAlwaysPrivateTable = (code: string, table: string) => ALWAYS_PRIVATE_TABLES.has(`${code}/${table}`);
/** The account name a page cursor (next_key) stands for, as text or as its u64 number; null if it is not one. */
export function cursorName(nextKey: unknown, u64ToName: (v: string) => string | null): string | null {
	const k = String(nextKey ?? '');
	if (!k) return null;
	if (/^[a-z1-5][a-z1-5.]{0,11}$/.test(k) && !/^\d+$/.test(k)) return k;
	return u64ToName(k);
}
/** How many unknown names one table read may check on chain before the rest are hidden unchecked (rate budget). */
export const TABLE_PUBLIC_CHECKS = 5;

/**
 * Table rows can name people in any field (a staker, a voter, an owner, a blocklisted account): found 2026-10-16 in
 * `longstaking::stakes`, where two private stakers' accounts came back unmasked. Hide them like history reads do.
 * Names already kept stay; up to `max` other names are checked with `isPub` (contracts, registered agents and
 * producers stay visible); every name left over is hidden. A failed check counts as private.
 */
export async function maskRows(
	rows: any[],
	code: string,
	table: string,
	keep: Set<string>,
	isPub: (name: string) => Promise<boolean>,
	max = TABLE_PUBLIC_CHECKS,
): Promise<{ rows: any[]; hidden: number }> {
	// 1.16.0: names in table rows are shown; only an all-private table (the blocklist) is masked, every name in it.
	if (!ALWAYS_PRIVATE_TABLES.has(`${code}/${table}`)) return { rows: rows ?? [], hidden: 0 };
	void isPub;
	void max;
	const field = PUBLIC_ROW_FIELDS[`${code}/${table}`];
	if (field) for (const r of rows ?? []) if (r && typeof r[field] === 'string' && NAME.test(r[field])) keep.add(r[field]);
	const unknown = [...personNames(rows)].filter((n) => !keep.has(n)).sort();
	return { rows: maskData(rows ?? [], keep, 0, false, true), hidden: unknown.length };
}
const auths = (list: any[], keep: Set<string>, strict = false) => (list ?? []).map((x: any) => `${maskName(x.actor, keep, strict)}@${x.permission}`);
/** The blocklist contract's own actions name listed accounts: masked strictly (1.16.0). */
const isBlocklistAct = (contract: unknown) => contract === 'blocklist';

let producerCache: { at: number; names: string[] } | null = null;
export async function producerNames(ctx?: ExecutionContext): Promise<string[]> {
	if (producerCache && Date.now() - producerCache.at < 10 * 60 * 1000) return producerCache.names;
	try {
		const r = await rpc('/v1/chain/get_producer_schedule', {}, 600, ctx);
		const names = (r.json?.active?.producers ?? []).map((p: any) => p.producer_name);
		producerCache = { at: Date.now(), names };
		return names;
	} catch {
		return producerCache?.names ?? [];
	}
}

export function isFilter(s: string): boolean {
	// contract:action, either side may be "*" (Hyperion filter syntax)
	return /^([a-z1-5.]{1,12}|\*):([a-z1-5.]{1,13}|\*)$/.test(s);
}
export function isIsoTime(s: string): boolean {
	return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?Z?)?$/.test(s);
}

export async function actions(
	args: { account: string; filter?: string; limit?: number; sort?: 'desc' | 'asc'; after?: string; before?: string; network?: Network },
	ctx?: ExecutionContext,
) {
	const net = args.network;
	const limit = Math.max(1, Math.min(25, args.limit ?? 10));
	const q = new URLSearchParams({ account: args.account, limit: String(limit), sort: args.sort ?? 'desc' });
	if (args.filter) q.set('filter', args.filter);
	if (args.after) q.set('after', args.after);
	if (args.before) q.set('before', args.before);
	const keep = makeKeep([args.account], await producerNames(ctx));
	const r = await politeFetch(hyperionPool(net), `/v2/history/get_actions?${q}`, { method: 'GET' }, { ttlSec: 30, ctx });
	if (r.status >= 400) throw new UpstreamError(`Hyperion returned HTTP ${r.status}`);
	let j: any;
	try {
		j = JSON.parse(r.text);
	} catch {
		throw new UpstreamError('Hyperion returned non-JSON');
	}
	const rows = (j.actions ?? []).map((a: any) => ({
		time: a.timestamp ?? a['@timestamp'],
		block: a.block_num,
		trx_id: a.trx_id,
		action: `${a.act?.account}::${a.act?.name}`,
		authorization: auths(a.act?.authorization, keep, isBlocklistAct(a.act?.account)),
		data: clip(maskData(a.act?.data, keep, 0, false, isBlocklistAct(a.act?.account))),
		explorer: a.trx_id ? explorerTx(a.trx_id, net) : undefined,
	}));
	return {
		data: { total: j.total?.value ?? j.total ?? null, returned: rows.length, actions: rows },
		source: r.source,
		readAt: r.readAt,
	};
}

export async function transaction(id: string, ctx?: ExecutionContext, typed: string[] = [], net?: Network) {
	const keep = makeKeep(typed, await producerNames(ctx));
	const r = await politeFetch(hyperionPool(net), `/v2/history/get_transaction?id=${encodeURIComponent(id)}`, { method: 'GET' }, { ttlSec: 3600, ctx });
	if (r.status >= 400) throw new UpstreamError(`Hyperion returned HTTP ${r.status}`);
	let j: any;
	try {
		j = JSON.parse(r.text);
	} catch {
		throw new UpstreamError('Hyperion returned non-JSON');
	}
	const acts = (j.actions ?? []).slice(0, 40).map((a: any) => ({
		action: `${a.act?.account}::${a.act?.name}`,
		authorization: auths(a.act?.authorization, keep, isBlocklistAct(a.act?.account)),
		data: clip(maskData(a.act?.data, keep, 0, false, isBlocklistAct(a.act?.account))),
		inline: a.creator_action_ordinal ? a.creator_action_ordinal > 0 : undefined,
	}));
	if (!acts.length) throw new UpstreamError('no transaction with that id was found by this Hyperion node');
	const first = j.actions[0];
	return {
		data: { trx_id: id, time: first?.timestamp ?? first?.['@timestamp'], block: first?.block_num, executed: j.executed, actions: acts, explorer: explorerTx(id, net) },
		source: r.source,
		readAt: r.readAt,
	};
}

/** One block: its time stamp, producer and the actions in it, in order (the first legal block of a launch, who bought first). */
export async function block(num: number, ctx?: ExecutionContext, typed: string[] = [], net?: Network) {
	const keep = makeKeep(typed, await producerNames(ctx));
	const r = await rpc('/v1/chain/get_block', { block_num_or_id: num }, 3600, ctx, undefined, rpcPool(net));
	const b = r.json;
	const rows: any[] = [];
	for (const t of b.transactions ?? []) {
		const trx = typeof t.trx === 'object' ? t.trx : null;
		for (const a of trx?.transaction?.actions ?? []) {
			if (rows.length >= 60) break;
			rows.push({
				trx_id: trx.id,
				action: `${a.account}::${a.name}`,
				authorization: auths(a.authorization, keep, isBlocklistAct(a.account)),
				data: clip(maskData(a.data, keep, 0, false, isBlocklistAct(a.account))),
			});
		}
	}
	return {
		data: { block: b.block_num, timestamp: b.timestamp, producer: b.producer, schedule_version: b.schedule_version, transactions: (b.transactions ?? []).length, actions_in_order: rows, explorer: `${ex(net)}/block/${b.block_num}` },
		source: r.source,
		readAt: r.readAt,
	};
}

/** A contract's interface: its actions, tables, and (for one action) the fields in order, with base structs resolved. */
export async function abi(contract: string, action?: string, ctx?: ExecutionContext, net?: Network) {
	const r = await rpc('/v1/chain/get_abi', { account_name: contract }, 3600, ctx, undefined, rpcPool(net));
	const a = r.json?.abi;
	if (!a) throw new UpstreamError(`${contract} has no contract (no ABI)`);
	const structs = new Map<string, any>((a.structs ?? []).map((s: any) => [s.name, s]));
	const fieldsOf = (type: string, depth = 0): { name: string; type: string }[] => {
		const s = structs.get(type);
		if (!s || depth > 5) return [];
		return [...(s.base ? fieldsOf(s.base, depth + 1) : []), ...(s.fields ?? []).map((f: any) => ({ name: f.name, type: f.type }))];
	};
	const actionsList = (a.actions ?? []).map((x: any) => x.name);
	const data: any = {
		contract,
		version: a.version,
		actions: actionsList,
		tables: (a.tables ?? []).map((t: any) => ({ name: t.name, row_type: t.type, index: t.index_type })),
		explorer: explorerAccount(contract, net),
	};
	if (action) {
		const act = (a.actions ?? []).find((x: any) => x.name === action);
		if (!act) throw new UpstreamError(`${contract} has no action "${action}" (its actions: ${actionsList.join(', ')})`);
		data.action = { name: action, fields_in_order: fieldsOf(act.type) };
	}
	return { data, source: r.source, readAt: r.readAt };
}
