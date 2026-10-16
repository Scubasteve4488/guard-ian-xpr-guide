// chain.ts: read-only XPR Network chain lookups. Nothing here signs, holds a key, or sends a transaction.
// SOURCE: XPRNetwork/xpr-network-dev-skill @ a1d455e skill/rpc-queries.md:181-256 (get_table_rows parameters; the
// all-numeric account-name bug and its nameToU64 fix, copied as published) and :66-73 (poll/caching defaults).

import { rpc, politeFetch, HYPERION_ENDPOINTS, RPC_ENDPOINTS, UpstreamError, rpcPool, type Network } from './net.ts';

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

/**
 * A token symbol code as the u64 a table scope uses ("XPR" → 5394520): one byte per letter, first letter lowest.
 * A token contract's `stat` table is scoped by the symbol code. SOURCE: XPRNetwork/xpr-network-dev-skill @ main
 * skill/token-creation.md:78-79 ("TableStore's second argument is the SCOPE … wrap the symbol code
 * (`new Name(sym.code())`)") and :168 (`new TableStore<CurrencyStats>(this.receiver, new Name(symbol.code()))`).
 * Sent as a plain number, so no node has to guess whether "MPD" is a name or a symbol. The value is below 2^56, so it
 * can never decode to an account name (access.ts u64ToName needs a letter in the top 5 bits).
 */
export function symbolScope(code: string): string | null {
	if (!isSymbol(code)) return null;
	let v = 0n;
	for (let i = 0; i < code.length; i++) v |= BigInt(code.charCodeAt(i)) << BigInt(8 * i);
	return v.toString();
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

/**
 * Scope. An all-digit NAME (digits 1-5 only, up to 12) is u64-encoded (rpc-queries.md:222 @ b7d9f1f). A number that
 * cannot be a name (contains 0 or 6-9, or is longer than 12, e.g. "1785205097907617792") is sent as-is, and so is
 * anything with scope_type "number" (a token ID such as 14). Expert exam run 1, 2026-10-16 (review L1).
 */
export function scopeFor(scope: string, scopeType?: 'name' | 'number'): string {
	if (!/^\d+$/.test(scope)) return scope;
	if (scopeType === 'number') return scope;
	if (scopeType === 'name') return nameToU64(scope);
	return scope.length > 12 || /[06-9]/.test(scope) ? scope : nameToU64(scope);
}

/**
 * Table bounds are sent unchanged. SOURCE: XPRNetwork/xpr-network-dev-skill @ b7d9f1f skill/rpc-queries.md:223 —
 * lower_bound / upper_bound: "pass `key_type: "name"` (primary index) so the string is parsed as a name"; and :225
 * "Do not append "." to force name parsing — "333555." throws chain_type_exception on current nodeos … for bounds as
 * well as scope." So an all-digit NAME goes as-is with key_type "name" (the tool's enum already passes it through),
 * and a numeric ID stays a number (the 2026-10-15 fix: simplelaunch curves 14 and 15).
 * Fixed 2026-10-16 (security review M4): 1.2.1 appended ".", which the source says throws.
 */
export function boundFor(value: string, _keyType?: string): string {
	return value;
}

// TTLs, per rpc-queries.md:68-69: chain_id forever-ish, most state 10 s+.
const TTL = { info: 5, account: 20, table: 15, producers: 60, currency: 60, tokens: 30 };

export async function chainInfo(ctx?: ExecutionContext, net?: Network) {
	const r = await rpc('/v1/chain/get_info', {}, TTL.info, ctx, undefined, rpcPool(net));
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

export async function account(name: string, ctx?: ExecutionContext, net?: Network) {
	const r = await rpc('/v1/chain/get_account', { account_name: name }, TTL.account, ctx, undefined, rpcPool(net));
	const j = r.json;
	return {
		data: {
			account_name: j.account_name,
			created: j.created,
			// When the account's contract code last changed (deploys); 1970-01-01 means no code was ever set.
			last_code_update: j.last_code_update,
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
	args: { code: string; table: string; scope?: string; scope_type?: 'name' | 'number'; limit?: number; lower_bound?: string; upper_bound?: string; reverse?: boolean; key_type?: string },
	ctx?: ExecutionContext,
	net?: Network,
) {
	const pool = rpcPool(net);
	const limit = Math.max(1, Math.min(50, args.limit ?? 20));
	const body: any = {
		code: args.code,
		table: args.table,
		scope: scopeFor(args.scope ?? args.code, args.scope_type),
		json: true,
		limit,
	};
	if (args.key_type) body.key_type = args.key_type;
	if (args.lower_bound) body.lower_bound = boundFor(args.lower_bound, args.key_type);
	if (args.upper_bound) body.upper_bound = boundFor(args.upper_bound, args.key_type);
	if (args.reverse) body.reverse = true;
	let r = await rpc('/v1/chain/get_table_rows', body, TTL.table, ctx, undefined, pool);
	// Stuck page (seen 2026-10-15 on one node: lower_bound 84 → 1 row, more=true, next_key "84"). Following it would
	// loop forever, so ask a different node once (rpc-queries.md best practice 5, "Multiple endpoints").
	const stuck = (x: typeof r) => !!x.json.more && !!args.lower_bound && String(x.json.next_key ?? '') === String(body.lower_bound);
	if (stuck(r)) {
		const used = pool.findIndex((e) => r.source.startsWith(e));
		r = await rpc('/v1/chain/get_table_rows', body, 0, ctx, used >= 0 ? used + 1 : undefined, pool);
	}
	return {
		data: { rows: r.json.rows ?? [], more: !!r.json.more, next_key: r.json.next_key ?? null, limit, ...(stuck(r) ? { stuck: true } : {}) },
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
