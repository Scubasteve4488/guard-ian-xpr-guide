// loan.ts — LOAN Protocol (lending.loan), read-only, in plain numbers. Added 1.15.0 (builder 2026-10-16: "Fix all the
// stuff it doesnt do", after the LOAN gap was named: raw rates per half-second, no APY, no TVL).
//
// SOURCE (port, not a new design): XPRNetwork/xpr-agents openclaw/skills/lending/src/index.ts (last change daf1a27,
// 2026-10-02; checkout a7410e9 read 2026-10-16) — the read-only tools loan_list_markets (:162), loan_get_market (:219),
// loan_get_user_positions (:296), loan_get_config (:433), loan_get_market_apy (:467) and loan_get_market_tvl (:507):
//   - contract `lending.loan`, tables markets / rewards.cfg / globals.cfg / shares / borrows (scope lending.loan,
//     user rows keyed by account name, key_type "name");
//   - APY and TVL from the Metal X API https://identity.api.prod.metalx.com/v1/loan/stats/{apy,tvl}?token_symbol=&days=
//     with days 7, 30 or 90; field names avgDepositApy / avgDepositLoanApy / avgBorrowApy / avgBorrowLoanApy /
//     avgDepositTvl / avgBorrowTvl / chartData, exactly as upstream reads them.
// The upstream write tools (supply, borrow, repay, redeem, claim...) are NOT ported: this server signs nothing.
// Contracts and "mainnet only": xpr-network-dev-skill loan-protocol.md (lending.loan, shares.loan, loan.token).
// No interest-rate formula is computed here: no XPR source documents one, so current rates come from the Metal X API.
// Privacy: positions are shown only for PUBLIC accounts (contracts, exchanges, producers, registered agents), through
// the same gate as every other wallet tool; a private person's loans are refused, never shown.

import { z } from 'zod';
import { UpstreamError } from './net.ts';
import { table, isAccountName } from './chain.ts';
import { getJson, type AccountGate } from './more.ts';

type Handler = (args: any) => Promise<any>;
type Register = (name: string, config: unknown, handler: Handler) => unknown;
type Result = { isError?: boolean; content: Array<{ type: 'text'; text: string }> };

export const LENDING = 'lending.loan';
export const LOAN_API = 'https://identity.api.prod.metalx.com';
const DAYS = [7, 30, 90] as const;
const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } as const;

function ok(data: unknown, source: string | string[], readAt: string, note?: string): Result {
	const srcs = Array.isArray(source) ? source : [source];
	const text = [JSON.stringify(data, null, 2), '', `Source: ${srcs.join(' ; ')}`, `Read at: ${readAt}`, note ? `Note: ${note}` : '']
		.filter((x) => x !== '')
		.join('\n');
	return { content: [{ type: 'text', text }] };
}
const bad = (msg: string): Result => ({ isError: true, content: [{ type: 'text', text: msg }] });
function fail(e: unknown, hint: string): Result {
	const msg = (e instanceof UpstreamError ? e.message : 'unexpected error').replace(/\.+$/, '');
	return { isError: true, content: [{ type: 'text', text: `Could not complete: ${msg}. ${hint}` }] };
}

/** "8,LBTC" + contract → { precision, symbol, contract } (upstream parseExtSym). */
export function extSym(s: any): { precision: number; symbol: string; contract: string } | null {
	const parts = String(s?.sym ?? s?.symbol ?? '').split(',');
	if (parts.length !== 2 || !parts[1].trim()) return null;
	return { precision: parseInt(parts[0], 10) || 0, symbol: parts[1].trim(), contract: String(s?.contract ?? '') };
}
/** 0.69999999999999996 → "70%"; 0.2 → "20%". Up to 2 decimals, trailing zeros dropped. */
export function pct(x: unknown, digits = 2): string | null {
	const n = Number(x);
	if (!Number.isFinite(n)) return null;
	return `${Number((n * 100).toFixed(digits))}%`;
}
const qty = (a: any) => (a && typeof a.quantity === 'string' ? a.quantity : null);

/** One markets row in plain words. The raw interest model is kept only in the single-market view. */
export function marketSummary(m: any) {
	const share = extSym(m.share_symbol);
	const und = extSym(m.underlying_symbol);
	return {
		market: share?.symbol ?? null,
		underlying: und ? `${und.symbol}@${und.contract}` : null,
		borrowLimitPctOfCollateral: pct(m.collateral_factor),
		reserveFactorPct: pct(m.reserve_factor),
		borrowedVariable: qty(m.total_variable_borrows),
		borrowedStable: qty(m.total_stable_borrows),
		reserves: qty(m.total_reserves),
		stableLoans: m.stable_loans_enabled ? 'on' : 'off',
		oracleFeed: m.oracle_feed_index ?? null,
		lastAccrual: m.variable_accrual_time ?? null,
	};
}

/** Metal X APY reply (fractions) → percentages, as upstream formats them. */
export function apySummary(d: any, token: string, days: number) {
	const p = (x: unknown) => pct(x ?? 0);
	const chart = Array.isArray(d?.chartData) ? d.chartData : [];
	const last = chart.length ? chart[chart.length - 1] : null;
	return {
		token: d?.tokenSymbol || token,
		days: d?.days || days,
		averages: {
			depositApy: p(d?.avgDepositApy),
			depositApyWithLoanRewards: p(d?.avgDepositLoanApy),
			borrowApy: p(d?.avgBorrowApy),
			borrowLoanRewardsApy: p(d?.avgBorrowLoanApy),
		},
		latestDay: last ? { date: last.date ?? null, depositApy: p(last.depositApy), borrowApy: p(last.borrowApy) } : null,
		daily: chart.slice(-7).map((c: any) => ({ date: c.date ?? null, depositApy: p(c.depositApy), borrowApy: p(c.borrowApy) })),
	};
}

/** Metal X TVL reply → whole US dollars and utilisation (borrowed ÷ deposited), as upstream computes it. */
export function tvlSummary(d: any, token: string, days: number) {
	const dep = Number(d?.avgDepositTvl ?? 0);
	const bor = Number(d?.avgBorrowTvl ?? 0);
	const chart = Array.isArray(d?.chartData) ? d.chartData : [];
	return {
		token: d?.tokenSymbol || token,
		days: d?.days || days,
		avgDepositedUsd: Math.round(dep),
		avgBorrowedUsd: Math.round(bor),
		utilizationPct: dep > 0 ? `${Number(((bor / dep) * 100).toFixed(1))}%` : null,
		daily: chart.slice(-7).map((c: any) => ({ date: c.date ?? null, depositedUsd: Math.round(Number(c.depositTvl ?? 0)), borrowedUsd: Math.round(Number(c.borrowTvl ?? 0)) })),
	};
}

/** A user's shares row → supplied L-tokens; borrows row → principals. Upstream loan_get_user_positions, same fields. */
export function positionsSummary(shares: any[], borrows: any[]) {
	const amt = (raw: unknown, p: number, sym: string) => {
		const n = Number(raw ?? 0);
		return Number.isFinite(n) ? `${(n / 10 ** p).toFixed(p)} ${sym}` : null;
	};
	const supplied = shares.flatMap((row: any) =>
		(Array.isArray(row?.tokens) ? row.tokens : []).map((t: any) => {
			const s = extSym(t.key);
			return { market: s?.symbol ?? null, balance: s ? amt(t.value, s.precision, s.symbol) : String(t.value) };
		}),
	);
	const borrowed = borrows.flatMap((row: any) =>
		(Array.isArray(row?.tokens) ? row.tokens : []).map((t: any) => {
			const s = extSym(t.key);
			const v = t.value || {};
			return {
				underlying: s ? `${s.symbol}@${s.contract}` : null,
				variablePrincipal: s ? amt(v.variable_principal, s.precision, s.symbol) : null,
				stablePrincipal: s ? amt(v.stable_principal, s.precision, s.symbol) : null,
			};
		}),
	);
	return { supplied, borrowed };
}

async function allMarkets(ctx?: ExecutionContext) {
	const rows: any[] = [];
	let lower: string | undefined;
	let first: { source: string; readAt: string } | null = null;
	for (let page = 0; page < 4; page++) {
		const r = await table({ code: LENDING, table: 'markets', limit: 50, ...(lower ? { lower_bound: lower } : {}) }, ctx);
		first ??= { source: r.source, readAt: r.readAt };
		rows.push(...r.data.rows);
		if (!r.data.more || !r.data.next_key || r.data.stuck) break;
		lower = String(r.data.next_key);
	}
	return { rows, source: first!.source, readAt: first!.readAt };
}

export function registerLoanTool(register: Register, ctx?: ExecutionContext, gate: AccountGate = async () => null) {
	register(
		'loan_protocol',
		{
			title: 'LOAN Protocol (Metal X lending)',
			description:
				'LOAN Protocol, the lending market in Metal X (contract lending.loan, mainnet only), in plain numbers. view "markets": every market with its borrow limit (% of collateral), reserve factor, amount borrowed and reserves, live from the chain. "market": one market by its L-token (e.g. LBTC, LXMD, LXPR) or underlying (XBTC), with the raw interest model and LOAN reward settings. "config": liquidation rules (close factor, liquidation bonus, oracle). "apy": average deposit and borrow APY over 7, 30 or 90 days, with and without LOAN rewards, plus the latest day (Metal X API). "tvl": deposited and borrowed value in USD and utilisation (Metal X API). "positions": what a PUBLIC account (contract, exchange, producer, registered agent) supplies and borrows; private people are refused. Read-only.',
			inputSchema: z.object({
				view: z.enum(['markets', 'market', 'config', 'apy', 'tvl', 'positions']).describe('What to read'),
				market: z.string().max(12).optional().describe('market / apy / tvl: L-token (LBTC) or underlying token (XBTC, XPR, XMD)'),
				days: z.union([z.literal(7), z.literal(30), z.literal(90)]).optional().describe('apy / tvl: 7, 30 or 90 (default 7)'),
				account: z.string().max(12).optional().describe('positions: a public account (contract, exchange, producer or registered agent)'),
			}),
			annotations: { title: 'LOAN Protocol', ...RO },
		},
		async ({ view, market, days, account }: { view: string; market?: string; days?: number; account?: string }) => {
			const d = DAYS.includes((days ?? 7) as any) ? (days ?? 7) : 7;
			const app = 'https://app.metalx.com/lending';
			try {
				if (view === 'markets') {
					const m = await allMarkets(ctx);
					return ok(
						{ contract: LENDING, count: m.rows.length, markets: m.rows.map(marketSummary), app },
						m.source,
						m.readAt,
						'Live from the chain. "borrowLimitPctOfCollateral" is the collateral factor: how much of a deposit\'s value can be borrowed against it. For interest rates use view "apy".',
					);
				}
				if (view === 'market') {
					if (!market) return bad('Give the market, e.g. market "LBTC" (L-token) or "XBTC" (underlying).');
					const want = market.trim().toUpperCase();
					const m = await allMarkets(ctx);
					const row = m.rows.find((r: any) => extSym(r.share_symbol)?.symbol === want || extSym(r.underlying_symbol)?.symbol === want);
					if (!row) return bad(`No LOAN market "${want}". Markets now: ${m.rows.map((r: any) => extSym(r.share_symbol)?.symbol).filter(Boolean).join(', ')}.`);
					const share = extSym(row.share_symbol)?.symbol;
					let rewards: any = null;
					let rSource: string | null = null;
					try {
						const rc = await table({ code: LENDING, table: 'rewards.cfg', limit: 50 }, ctx);
						rSource = rc.source;
						rewards = rc.data.rows.find((x: any) => x.market_symbol === share) ?? null;
					} catch {
						/* rewards.cfg may be absent: reported as null, never assumed */
					}
					return ok(
						{
							...marketSummary(row),
							interestModelVariable: row.variable_interest_model ?? null,
							interestModelStable: row.stable_interest_model ?? null,
							borrowIndex: row.borrow_index ?? null,
							loanRewards: rewards
								? {
										supplierPerHalfSecond: rewards.supplier_rewards_per_half_second ?? null,
										borrowerPerHalfSecond: rewards.borrower_rewards_per_half_second ?? null,
									}
								: null,
							app,
						},
						rSource ? [m.source, rSource] : m.source,
						m.readAt,
						'Live from the chain. The interest model is the contract\'s own raw numbers (rates per half-second, the "kink" is the utilisation where the rate steepens). For APY in percent use view "apy".',
					);
				}
				if (view === 'config') {
					const g = await table({ code: LENDING, table: 'globals.cfg', limit: 1 }, ctx);
					const c = g.data.rows[0];
					if (!c) return bad('The global LOAN config row was not found on chain.');
					return ok(
						{
							oracleContract: c.oracle_contract ?? null,
							closeFactorPct: pct(c.close_factor),
							liquidationBonusPct: pct(c.liquidation_incentive),
							rewardToken: c.reward_symbol ?? null,
							app,
						},
						g.source,
						g.readAt,
						'Live from the chain. Close factor = the most of a loan a liquidator may repay in one go. Liquidation bonus = the discount a liquidator gets on the collateral it takes.',
					);
				}
				if (view === 'apy' || view === 'tvl') {
					if (!market) return bad('Give the token, e.g. market "XBTC", "XPR" or "XMD".');
					let tok = market.trim().toUpperCase();
					if (!/^[A-Z]{1,7}$/.test(tok)) return bad('A token symbol is 1-7 capital letters, e.g. XBTC.');
					if (tok.startsWith('L') && tok !== 'LOAN') {
						// An L-token (LBTC): the API wants its underlying (XBTC), read from the chain, never guessed.
						const m = await allMarkets(ctx);
						const row = m.rows.find((r: any) => extSym(r.share_symbol)?.symbol === tok);
						const und = row ? extSym(row.underlying_symbol)?.symbol : null;
						if (und) tok = und;
					}
					const r = await getJson(LOAN_API, `/v1/loan/stats/${view}?token_symbol=${encodeURIComponent(tok)}&days=${d}`, 900, ctx);
					const data = view === 'apy' ? apySummary(r.json, tok, d) : tvlSummary(r.json, tok, d);
					return ok(
						{ ...data, app },
						r.source,
						r.readAt,
						view === 'apy'
							? 'From the Metal X API (the same source the official XPR Agents lending skill reads). Averages over the period; "with LOAN rewards" adds the LOAN token paid to depositors. Past rates, not a forecast.'
							: 'From the Metal X API. USD values as Metal X computes them; utilisation = borrowed ÷ deposited.',
					);
				}
				if (view === 'positions') {
					const name = String(account ?? '').trim().toLowerCase();
					if (!isAccountName(name)) return bad('Give a valid XPR account name (1-12 characters a-z, 1-5, dots).');
					const refusal = await gate(name);
					if (refusal) return refusal;
					const s = await table({ code: LENDING, table: 'shares', lower_bound: name, upper_bound: name, key_type: 'name', limit: 1 }, ctx);
					const b = await table({ code: LENDING, table: 'borrows', lower_bound: name, upper_bound: name, key_type: 'name', limit: 1 }, ctx);
					const pos = positionsSummary(s.data.rows, b.data.rows);
					return ok({ account: name, ...pos, app }, [s.source, b.source], s.readAt, 'Live from the chain. Borrow principals are what was borrowed; interest owed since then is not added here.');
				}
				return bad('Unknown view.');
			} catch (e) {
				return fail(e, 'Try again in a minute, or open the Metal X lending page: https://app.metalx.com/lending');
			}
		},
	);
}
