// chain.ts: read-only XPR Network chain lookups. Nothing here signs, holds a key, or sends a transaction.
// SOURCE: XPRNetwork/xpr-network-dev-skill @ a1d455e skill/rpc-queries.md:181-256 (get_table_rows parameters; the
// all-numeric account-name bug and its nameToU64 fix, copied as published) and :66-73 (poll/caching defaults).

import { rpc, politeFetch, HYPERION_ENDPOINTS, UpstreamError } from './net.ts';

/** Antelope account / contract name: 1–12 chars of a-z, 1-5 and '.', not ending in '.'. */
export function isAccountName(s: string): boolean {
	return /^[a-z1-5.]{1,12}$/.test(s) && !s.endsWith('.');
}
/** Antelope table / action name (same character rules). */
export const isTableName = isAccountName;
/** Token symbol: 1–7 upper-case letters. */
export function isSymbol(s: string): boolean {
	return /^[A-Z]{1,7}$/.test(s);
}

// Copied from rpc-queries.md:234-254 @ a1d455e (upstream's published fix).
export function nameToU64(name: string): string {
	const charset = '.12345abcdefghijklmnopqrstuvwxyz';
	let value = BigInt(0);
	const len = Math.min(name.length, 12);
	for (let i = 0; i < len; i++) {
		const idx = charset.indexOf(name[i]);
		if (idx < 0) return name;
		value |= BigInt(idx) << BigInt(64 - 5 * (i + 1));
	}
	if (name.length === 13) {
		const idx = charset.indexOf(name[12]);
		if (idx >= 0) value |= BigInt(idx & 0xf);
	}
	return value.toString();
}
export function safeName(name: string): string {
	return /^\d+$/.test(name) ? nameToU64(name) : name;
}

// TTLs, per rpc-queries.md:68-69: chain_id forever-ish, most state 10 s+.
const TTL = { info: 5, account: 20, table: 15, producers: 60, currency: 60, tokens: 30 };

export async function chainInfo(ctx?: ExecutionContext) {
	const r = await rpc('/v1/chain/get_info', {}, TTL.info, ctx);
	const j = r.json;
	return {
		data: {
			chain_id: j.chain_id,
			head_block_num: j.head_block_num,
			head_block_time: j.head_block_time,
			last_irreversible_block_num: j.last_irreversible_block_num,
			server_version_string: j.server_version_string,
		},
		source: r.source,
		readAt: r.readAt,
	};
}

export async function account(name: string, ctx?: ExecutionContext) {
	const r = await rpc('/v1/chain/get_account', { account_name: name }, TTL.account, ctx);
	const j = r.json;
	return {
		data: {
			account_name: j.account_name,
			created: j.created,
			core_liquid_balance: j.core_liquid_balance ?? null,
			ram_quota: j.ram_quota,
			ram_usage: j.ram_usage,
			cpu_limit: j.cpu_limit,
			net_limit: j.net_limit,
			// Permission structure is public chain data; it shows WHO can sign, never a key's secret.
			permissions: (j.permissions || []).map((p: any) => ({
				perm_name: p.perm_name,
				parent: p.parent,
				threshold: p.required_auth?.threshold,
				keys: (p.required_auth?.keys || []).length,
				accounts: (p.required_auth?.accounts || []).map((a: any) => `${a.permission.actor}@${a.permission.permission}`),
			})),
			voter_info: j.voter_info ? { staked: j.voter_info.staked, producers: j.voter_info.producers } : null,
		},
		source: r.source,
		readAt: r.readAt,
	};
}

export async function tokenBalances(name: string, ctx?: ExecutionContext) {
	const r = await politeFetch(HYPERION_ENDPOINTS, `/v2/state/get_tokens?account=${encodeURIComponent(name)}`, { method: 'GET' }, { ttlSec: TTL.tokens, ctx });
	if (r.status >= 400) throw new UpstreamError(`Hyperion returned HTTP ${r.status}`);
	const j = JSON.parse(r.text);
	const tokens = (j.tokens || []).map((t: any) => ({ symbol: t.symbol, contract: t.contract, amount: t.amount, precision: t.precision }));
	return { data: tokens, source: r.source, readAt: r.readAt };
}

export async function table(
	args: { code: string; table: string; scope?: string; limit?: number; lower_bound?: string; upper_bound?: string; reverse?: boolean },
	ctx?: ExecutionContext,
) {
	const limit = Math.max(1, Math.min(50, args.limit ?? 20));
	const body: any = {
		code: args.code,
		table: args.table,
		scope: safeName(args.scope ?? args.code),
		json: true,
		limit,
	};
	if (args.lower_bound) body.lower_bound = safeName(args.lower_bound);
	if (args.upper_bound) body.upper_bound = safeName(args.upper_bound);
	if (args.reverse) body.reverse = true;
	const r = await rpc('/v1/chain/get_table_rows', body, TTL.table, ctx);
	return {
		data: { rows: r.json.rows ?? [], more: !!r.json.more, next_key: r.json.next_key ?? null, limit },
		source: r.source,
		readAt: r.readAt,
	};
}

export async function producers(ctx?: ExecutionContext) {
	const r = await rpc('/v1/chain/get_producer_schedule', {}, TTL.producers, ctx);
	const active = r.json.active?.producers ?? [];
	return {
		data: { version: r.json.active?.version, count: active.length, producers: active.map((p: any) => p.producer_name) },
		source: r.source,
		readAt: r.readAt,
	};
}

export async function currencyStats(contract: string, symbol: string, ctx?: ExecutionContext) {
	const r = await rpc('/v1/chain/get_currency_stats', { code: contract, symbol }, TTL.currency, ctx);
	const s = r.json?.[symbol];
	return { data: s ? { supply: s.supply, max_supply: s.max_supply, issuer: s.issuer } : null, source: r.source, readAt: r.readAt };
}
