// history.ts: read-only action history (Hyperion) and contract interfaces (ABI), plus explorer links for people.
// Builder's go 2026-10-16, after the expert exam: neither Grok nor ChatGPT could find the setantisnp transaction
// (no history tool) and ChatGPT could not read a contract's action fields (no ABI tool). The XPR Network Explorer
// (explorer.xprnetwork.org) builds its pages in the browser, so it cannot be fetched; it shows this same data, from
// Hyperion and the chain, and every result here carries an explorer link so a person can check it.
// SOURCE: XPRNetwork/xpr-network-dev-skill @ b7d9f1f skill/rpc-queries.md:49-56 (Hyperion etiquette: cap page-scroll,
// cache historical pages), hyperion-operations-caveats.md §9-10 (10,000 offset cap; asc window 90 days).

import { politeFetch, rpc, HYPERION_ENDPOINTS, UpstreamError } from './net.ts';

export const EXPLORER = 'https://explorer.xprnetwork.org';
export const explorerTx = (id: string) => `${EXPLORER}/transaction/${id}`;
export const explorerAccount = (name: string) => `${EXPLORER}/account/${name}`;

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
const PERSON_FIELDS = new Set(['from', 'to', 'payer', 'owner', 'account', 'user', 'buyer', 'seller', 'creator', 'receiver', 'voter', 'actor', 'proposer', 'executer', 'approver', 'claimer', 'client', 'agent', 'holder', 'trader', 'recipient', 'sender', 'name']);
export const PRIVATE = '[private account]';
const NAME = /^[a-z1-5.]{1,12}$/;

export function makeKeep(extra: string[] = [], producers: string[] = []): Set<string> {
	return new Set([...PUBLIC_ACCOUNTS, ...producers, ...extra.filter(Boolean)]);
}
export function maskName(n: string, keep: Set<string>): string {
	return keep.has(n) ? n : PRIVATE;
}
export function maskData(v: any, keep: Set<string>, depth = 0): any {
	if (depth > 4 || v == null || typeof v !== 'object') return v;
	if (Array.isArray(v)) return v.map((x) => maskData(x, keep, depth + 1));
	const out: any = {};
	for (const [k, x] of Object.entries(v)) {
		if (PERSON_FIELDS.has(k) && typeof x === 'string' && NAME.test(x)) out[k] = maskName(x, keep);
		else if (PERSON_FIELDS.has(k) && Array.isArray(x)) out[k] = x.map((y) => (typeof y === 'string' && NAME.test(y) ? maskName(y, keep) : maskData(y, keep, depth + 1)));
		else out[k] = maskData(x, keep, depth + 1);
	}
	return out;
}
const auths = (list: any[], keep: Set<string>) => (list ?? []).map((x: any) => `${maskName(x.actor, keep)}@${x.permission}`);

let producerCache: { at: number; names: string[] } | null = null;
async function producerNames(ctx?: ExecutionContext): Promise<string[]> {
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
	args: { account: string; filter?: string; limit?: number; sort?: 'desc' | 'asc'; after?: string; before?: string },
	ctx?: ExecutionContext,
) {
	const limit = Math.max(1, Math.min(25, args.limit ?? 10));
	const q = new URLSearchParams({ account: args.account, limit: String(limit), sort: args.sort ?? 'desc' });
	if (args.filter) q.set('filter', args.filter);
	if (args.after) q.set('after', args.after);
	if (args.before) q.set('before', args.before);
	const keep = makeKeep([args.account], await producerNames(ctx));
	const r = await politeFetch(HYPERION_ENDPOINTS, `/v2/history/get_actions?${q}`, { method: 'GET' }, { ttlSec: 30, ctx });
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
		authorization: auths(a.act?.authorization, keep),
		data: clip(maskData(a.act?.data, keep)),
		explorer: a.trx_id ? explorerTx(a.trx_id) : undefined,
	}));
	return {
		data: { total: j.total?.value ?? j.total ?? null, returned: rows.length, actions: rows },
		source: r.source,
		readAt: r.readAt,
	};
}

export async function transaction(id: string, ctx?: ExecutionContext, typed: string[] = []) {
	const keep = makeKeep(typed, await producerNames(ctx));
	const r = await politeFetch(HYPERION_ENDPOINTS, `/v2/history/get_transaction?id=${encodeURIComponent(id)}`, { method: 'GET' }, { ttlSec: 3600, ctx });
	if (r.status >= 400) throw new UpstreamError(`Hyperion returned HTTP ${r.status}`);
	let j: any;
	try {
		j = JSON.parse(r.text);
	} catch {
		throw new UpstreamError('Hyperion returned non-JSON');
	}
	const acts = (j.actions ?? []).slice(0, 40).map((a: any) => ({
		action: `${a.act?.account}::${a.act?.name}`,
		authorization: auths(a.act?.authorization, keep),
		data: clip(maskData(a.act?.data, keep)),
		inline: a.creator_action_ordinal ? a.creator_action_ordinal > 0 : undefined,
	}));
	if (!acts.length) throw new UpstreamError('no transaction with that id was found by this Hyperion node');
	const first = j.actions[0];
	return {
		data: { trx_id: id, time: first?.timestamp ?? first?.['@timestamp'], block: first?.block_num, executed: j.executed, actions: acts, explorer: explorerTx(id) },
		source: r.source,
		readAt: r.readAt,
	};
}

/** One block: its time stamp, producer and the actions in it, in order (the first legal block of a launch, who bought first). */
export async function block(num: number, ctx?: ExecutionContext, typed: string[] = []) {
	const keep = makeKeep(typed, await producerNames(ctx));
	const r = await rpc('/v1/chain/get_block', { block_num_or_id: num }, 3600, ctx);
	const b = r.json;
	const rows: any[] = [];
	for (const t of b.transactions ?? []) {
		const trx = typeof t.trx === 'object' ? t.trx : null;
		for (const a of trx?.transaction?.actions ?? []) {
			if (rows.length >= 60) break;
			rows.push({
				trx_id: trx.id,
				action: `${a.account}::${a.name}`,
				authorization: auths(a.authorization, keep),
				data: clip(maskData(a.data, keep)),
			});
		}
	}
	return {
		data: { block: b.block_num, timestamp: b.timestamp, producer: b.producer, schedule_version: b.schedule_version, transactions: (b.transactions ?? []).length, actions_in_order: rows, explorer: `${EXPLORER}/block/${b.block_num}` },
		source: r.source,
		readAt: r.readAt,
	};
}

/** A contract's interface: its actions, tables, and (for one action) the fields in order, with base structs resolved. */
export async function abi(contract: string, action?: string, ctx?: ExecutionContext) {
	const r = await rpc('/v1/chain/get_abi', { account_name: contract }, 3600, ctx);
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
		explorer: explorerAccount(contract),
	};
	if (action) {
		const act = (a.actions ?? []).find((x: any) => x.name === action);
		if (!act) throw new UpstreamError(`${contract} has no action "${action}" (its actions: ${actionsList.join(', ')})`);
		data.action = { name: action, fields_in_order: fieldsOf(act.type) };
	}
	return { data, source: r.source, readAt: r.readAt };
}
