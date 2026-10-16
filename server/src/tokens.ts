// tokens.ts: "is this the real token?" — facts from several independent sources, side by side. It never declares a
// token safe or a scam; it reports what each source says and what nothing here can verify.
//
// SOURCE (registry): XPRNetwork/xpr-network-dev-skill skill/resources.md "Token Contract Registry". Copied at a1d455e;
// re-checked identical to main on 2026-10-16 (the daily job compares it with main every run and reports any drift).
// ("Verified live (May 2026) via get_currency_stats"). FOOBAR is listed there as test-only (resources.md:276-278).

import { currencyStats } from './chain.ts';
import { getJson, UpstreamError } from './net.ts';

export interface RegistryEntry {
	symbol: string;
	contract: string;
	precision: number;
	what: string;
}

export const REGISTRY_SOURCE =
	'https://github.com/XPRNetwork/xpr-network-dev-skill/blob/main/skill/resources.md#token-contract-registry';

export const REGISTRY: RegistryEntry[] = [
	{ symbol: 'XPR', contract: 'eosio.token', precision: 4, what: 'Native gas/staking token (issuer eosio)' },
	{ symbol: 'XMD', contract: 'xmd.token', precision: 6, what: 'Metallicus USD stablecoin, Metal Dollar (issuer xmd.treasury)' },
	{ symbol: 'LOAN', contract: 'loan.token', precision: 4, what: 'LOAN protocol governance (issuer lending.loan)' },
	...[
		['XUSDT', 6, 'Tether USD'], ['XUSDC', 6, 'USD Coin'], ['XBTC', 8, 'Bitcoin'], ['XETH', 8, 'Ethereum'],
		['XBCH', 8, 'Bitcoin Cash'], ['XLTC', 8, 'Litecoin'], ['XBNB', 8, 'Binance Coin'], ['XEOS', 4, 'EOS'],
		['XADA', 6, 'Cardano'], ['XDOGE', 6, 'Dogecoin'], ['XHBAR', 6, 'Hedera'], ['XSOL', 6, 'Solana'],
		['XXRP', 6, 'Ripple (double-X prefix)'], ['XXLM', 6, 'Stellar (double-X prefix)'],
		['METAL', 8, 'Metal Blockchain native token (not Metal X)'], ['XMT', 8, 'MTL, Metal DAO governance token'],
	].map(([symbol, precision, wraps]) => ({ symbol: symbol as string, contract: 'xtokens', precision: precision as number, what: `Wrapped ${wraps} on xtokens` })),
	{ symbol: 'SNIPS', contract: 'snipcoins', precision: 4, what: 'Snipcoins community' },
	{ symbol: 'STRX', contract: 'storex', precision: 4, what: 'StoreX' },
];

const TEST_ONLY = new Set(['FOOBAR@xtokens']);

export function registryLookup(symbol: string, contract?: string) {
	const sameSymbol = REGISTRY.filter((r) => r.symbol === symbol);
	const exact = contract ? sameSymbol.find((r) => r.contract === contract) ?? null : null;
	return { exact, sameSymbol };
}

async function settle<T>(p: Promise<T>): Promise<{ ok: true; value: T } | { ok: false; error: string }> {
	try {
		return { ok: true, value: await p };
	} catch (e: any) {
		return { ok: false, error: e instanceof UpstreamError ? e.message : 'lookup failed' };
	}
}

export async function tokenCheck(symbol: string, contract: string, ctx?: ExecutionContext) {
	const reg = registryLookup(symbol, contract);
	const [stats, metalx, alcor, sdex] = await Promise.all([
		settle(currencyStats(contract, symbol, ctx)),
		settle(getJson('https://dex.api.mainnet.metalx.com/dex/v1/markets/all', 300, ctx)),
		settle(getJson(`https://proton.alcor.exchange/api/v2/tokens/${symbol.toLowerCase()}-${contract.toLowerCase()}`, 300, ctx)),
		contract === 'simpletoken'
			? settle(getJson(`https://indexer.protonnz.com/api/tokens?symbol=${encodeURIComponent(symbol)}`, 120, ctx))
			: Promise.resolve(null),
	]);

	const facts: string[] = [];
	const cannot: string[] = [];
	const sources: string[] = [REGISTRY_SOURCE];

	// 1. Official registry
	if (TEST_ONLY.has(`${symbol}@${contract}`)) facts.push(`${symbol}@${contract} is listed as TEST-ONLY in XPR's developer registry.`);
	else if (reg.exact) facts.push(`In XPR's developer token registry: ${symbol}@${contract}, precision ${reg.exact.precision}. ${reg.exact.what}.`);
	else if (reg.sameSymbol.length)
		facts.push(
			`NOT the registry's ${symbol}. XPR's developer registry lists ${symbol} on ${reg.sameSymbol.map((r) => r.contract).join(', ')}, not on ${contract}. Same symbol on a different contract is a different token.`,
		);
	else facts.push(`${symbol} is not in XPR's developer token registry (that registry covers only the main native, wrapped and a few project tokens).`);

	// 2. On-chain existence
	if (stats.ok) {
		sources.push(stats.value.source);
		if (stats.value.data) facts.push(`On chain: supply ${stats.value.data.supply}, max ${stats.value.data.max_supply}, issuer ${stats.value.data.issuer} (get_currency_stats).`);
		else facts.push(`On chain: no ${symbol} token found on contract ${contract} (get_currency_stats returned nothing).`);
	} else cannot.push(`On-chain supply/issuer: ${stats.error}.`);

	// 3. Metal X (Metallicus's own DEX) market list
	if (metalx.ok) {
		sources.push(metalx.value.source);
		const list: any[] = Array.isArray(metalx.value.json) ? metalx.value.json : metalx.value.json?.data ?? [];
		// Match symbol AND contract on the SAME side of a market (security review M6). Field names read live
		// 2026-10-16 from dex.api.mainnet.metalx.com/dex/v1/markets/all: bid_token / ask_token = { code, contract, … }.
		const sideIs = (s: any) => !!s && s.code === symbol && s.contract === contract;
		const hits = list.filter((m) => sideIs(m?.bid_token) || sideIs(m?.ask_token));
		facts.push(
			hits.length
				? `Metal X lists ${symbol}@${contract} in ${hits.length} market(s)${hits[0]?.symbol ? `, e.g. ${hits[0].symbol}` : ''}.`
				: `Metal X's market list (${list.length} markets) does not include ${symbol}@${contract}. Most tokens are never on Metal X, so this alone means little.`,
		);
	} else cannot.push(`Metal X market list: ${metalx.error}.`);

	// 4. Alcor's own flags (a third party's judgement, reported as theirs)
	if (alcor.ok) {
		sources.push(alcor.value.source);
		const a = alcor.value.json || {};
		const flags = [a.is_scam ? 'is_scam=true' : null, a.is_trusted ? 'is_trusted=true' : null].filter(Boolean).join(', ');
		facts.push(`Alcor lists ${symbol}@${contract}${flags ? ` and flags it ${flags}` : ' with no scam/trusted flag'} (Alcor's own labels, not a verdict here).`);
	} else if (/HTTP 404/.test(alcor.error)) facts.push(`Alcor has no listing for ${symbol}@${contract}.`);
	else cannot.push(`Alcor listing: ${alcor.error}.`);

	// 5. SimpleDEX indexer (only for simpletoken launches)
	if (sdex && sdex.ok) {
		sources.push(sdex.value.source);
		const t = Array.isArray(sdex.value.json) ? sdex.value.json[0] : sdex.value.json?.tokens?.[0] ?? sdex.value.json;
		if (t && (t.tokenId ?? t.id) !== undefined)
			facts.push(`SimpleDEX token ${t.tokenId ?? t.id}${t.name ? ` ("${t.name}")` : ''}${t.graduated !== undefined ? `, graduated: ${t.graduated}` : ''}.`);
	} else if (sdex && !sdex.ok) cannot.push(`SimpleDEX indexer: ${sdex.error}.`);

	cannot.push('Who controls the issuer and contract keys, team identity, liquidity depth, and whether the project keeps its promises. Nothing on chain answers those.');
	return { symbol, contract, facts, cannot_verify: cannot, sources, readAt: new Date().toISOString() };
}
