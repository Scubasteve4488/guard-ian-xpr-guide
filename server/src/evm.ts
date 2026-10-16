// evm.ts — live reads of the three EVM chains the Metallicus world touches, read-only. Added 1.15.0 (builder
// 2026-10-16: "Fix all the stuff it doesnt do": Metal L2 and the Ethereum/BNB versions of XPR were documented but not
// read live).
//
// SOURCES (read 2026-10-16):
// - Metal L2: docs.metall2.com/chain/networks — "Chain ID 1750", "Public RPC URL https://rpc.metall2.com", explorer
//   https://explorer.metall2.com; "The public RPC URLs provided below are rate limited".
// - BNB Smart Chain: docs.bnbchain.org/bnb-smart-chain/developers/json_rpc/json-rpc-endpoint — mainnet ChainID 56,
//   https://bsc-dataseed.bnbchain.org; "The rate limit of BSC endpoint on Testnet and Mainnet is 10K/5min".
// - Ethereum: ethereum.org's developer-tools listing "PublicNode by Allnodes" (ethereum.org/developers/tools/
//   publicnode-allnodes): free, no API key. Endpoint https://ethereum-rpc.publicnode.com. Every read checks
//   eth_chainId first, so a wrong chain is refused, never reported.
// - The calls: Ethereum JSON-RPC (github.com/ethereum/execution-apis): eth_chainId, eth_blockNumber,
//   eth_getBlockByNumber, eth_getCode, eth_getBalance, eth_call. ERC-20 (EIP-20, eips.ethereum.org/EIPS/eip-20):
//   name() 0x06fdde03, symbol() 0x95d89b41, decimals() 0x313ce567, totalSupply() 0x18160ddd,
//   balanceOf(address) 0x70a08231 — the standard 4-byte selectors.
// - Etherscan and BscScan are NOT used: their terms forbid AI use of their data (docs/xpr-guide/SOURCES-CANDIDATES
//   -2026-10-16.md §2-3); the chains are read directly instead.
// - Token addresses: the guide (ECOSYSTEM.md §2b XPR on Ethereum / BNB Chain, read on those chains 2026-10-15;
//   §1a MTL v2 from the Metal L2 whitepaper).
// SOURCE (hand-built code): none found that a Worker can import without a new dependency; JSON-RPC over fetch is the
// documented interface.
// Privacy: a balance is shown only for an address that holds contract code (a token, bridge, exchange contract).
// A plain wallet address (no code) belongs to a person and is refused, the same rule as XPR accounts.

import { z } from 'zod';
import { politeFetch, UpstreamError } from './net.ts';

type Handler = (args: any) => Promise<any>;
type Register = (name: string, config: unknown, handler: Handler) => unknown;
type Result = { isError?: boolean; content: Array<{ type: 'text'; text: string }> };
const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } as const;

export const EVM_NETWORKS = {
	metal_l2: { name: 'Metal L2', chainId: 1750, rpc: 'https://rpc.metall2.com', explorer: 'https://explorer.metall2.com', native: 'ETH' },
	ethereum: { name: 'Ethereum', chainId: 1, rpc: 'https://ethereum-rpc.publicnode.com', explorer: 'https://etherscan.io', native: 'ETH' },
	bnb: { name: 'BNB Smart Chain', chainId: 56, rpc: 'https://bsc-dataseed.bnbchain.org', explorer: 'https://bscscan.com', native: 'BNB' },
} as const;
export type EvmNet = keyof typeof EVM_NETWORKS;

/** Names a user may type instead of an address. Only addresses the guide already records. */
export const KNOWN_TOKENS: Record<string, Partial<Record<EvmNet, string>>> = {
	XPR: { ethereum: '0xd7efb00d12c2c13131fd319336fdf952525da2af', bnb: '0x5de3939b2f811a61d830e6f52d13b066881412ab' },
	MTL: { ethereum: '0x709c999b4Bc5d19B5a2EE30297129D5aB4AAe454' },
};

export const SEL = { name: '0x06fdde03', symbol: '0x95d89b41', decimals: '0x313ce567', totalSupply: '0x18160ddd', balanceOf: '0x70a08231' } as const;

export const isAddress = (s: string) => /^0x[0-9a-fA-F]{40}$/.test(s);
export const hexToBig = (h: unknown): bigint | null => (typeof h === 'string' && /^0x[0-9a-fA-F]*$/.test(h) ? BigInt(h === '0x' ? '0x0' : h) : null);

/** A raw integer amount with `decimals` as a decimal string (no floating point). */
export function units(v: bigint | null, decimals: number): string | null {
	if (v === null) return null;
	if (decimals <= 0) return v.toString();
	const d = 10n ** BigInt(decimals);
	const frac = (v % d).toString().padStart(decimals, '0').replace(/0+$/, '');
	return `${(v / d).toString()}${frac ? '.' + frac : ''}`;
}

/** ABI-decode a `string` return (offset, length, bytes) or a bytes32 return (older tokens). */
export function decodeString(hex: unknown): string | null {
	if (typeof hex !== 'string' || !/^0x[0-9a-fA-F]*$/.test(hex) || hex.length < 66) return null;
	const body = hex.slice(2);
	const bytesFrom = (h: string) => {
		const out: number[] = [];
		for (let i = 0; i + 1 < h.length; i += 2) out.push(parseInt(h.slice(i, i + 2), 16));
		return new TextDecoder().decode(new Uint8Array(out)).replace(/\u0000+$/g, '');
	};
	if (body.length >= 128) {
		const off = Number(BigInt('0x' + body.slice(0, 64)));
		if (off === 32 && body.length >= 128) {
			const len = Number(BigInt('0x' + body.slice(64, 128)));
			if (len >= 0 && len <= 256 && body.length >= 128 + len * 2) return bytesFrom(body.slice(128, 128 + len * 2));
		}
	}
	return bytesFrom(body.slice(0, 64)); // bytes32 style
}

/** balanceOf(address) call data. */
export const balanceOfData = (addr: string) => SEL.balanceOf + addr.toLowerCase().replace(/^0x/, '').padStart(64, '0');

function ok(data: unknown, source: string, readAt: string, note?: string): Result {
	const text = [JSON.stringify(data, null, 2), '', `Source: ${source}`, `Read at: ${readAt}`, note ? `Note: ${note}` : ''].filter((x) => x !== '').join('\n');
	return { content: [{ type: 'text', text }] };
}
const bad = (msg: string): Result => ({ isError: true, content: [{ type: 'text', text: msg }] });
function fail(e: unknown, hint: string): Result {
	const msg = (e instanceof UpstreamError ? e.message : 'unexpected error').replace(/\.+$/, '');
	return { isError: true, content: [{ type: 'text', text: `Could not complete: ${msg}. ${hint}` }] };
}

async function evmRpc(net: EvmNet, method: string, params: unknown[], ttl: number, ctx?: ExecutionContext) {
	const n = EVM_NETWORKS[net];
	const r = await politeFetch([n.rpc], '', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }, { ttlSec: ttl, ctx, startAt: 0 });
	if (r.status !== 200) throw new UpstreamError(`${n.name} RPC answered HTTP ${r.status}`);
	let j: any;
	try {
		j = JSON.parse(r.text);
	} catch {
		throw new UpstreamError(`${n.name} RPC returned non-JSON`);
	}
	if (j?.error) throw new UpstreamError(`${n.name} RPC: ${String(j.error.message ?? 'error').slice(0, 160)}`);
	return { result: j?.result, source: `${r.source} (${method})`, readAt: r.readAt };
}

/** Every read starts here: the endpoint must say it is the chain we think it is. */
async function checkChain(net: EvmNet, ctx?: ExecutionContext) {
	const c = await evmRpc(net, 'eth_chainId', [], 300, ctx);
	const id = hexToBig(c.result);
	if (id === null || Number(id) !== EVM_NETWORKS[net].chainId)
		throw new UpstreamError(`the ${EVM_NETWORKS[net].name} endpoint reported chain id ${id ?? 'unknown'}, not ${EVM_NETWORKS[net].chainId}, so nothing from it is used`);
	return c;
}

export function registerEvmTool(register: Register, ctx?: ExecutionContext) {
	register(
		'evm_chains',
		{
			title: 'Metal L2, Ethereum and BNB Chain (live)',
			description:
				'Live, read-only reads of the EVM chains in the Metallicus world: Metal L2 (Metallicus\'s Ethereum layer 2, chain 1750), Ethereum and BNB Smart Chain (where XPR also exists as an ERC-20 / BEP-20 token, not native XPR). view "status": chain id (checked), latest block and its time. "token": an ERC-20 token\'s name, symbol, decimals and total supply, by address or by a name the guide records ("XPR" on ethereum or bnb, "MTL" on ethereum). "balance": native coin and optionally one token held by a CONTRACT address (token, bridge or exchange contract); a plain wallet address belongs to a person and is refused. Metal Blockchain\'s own C-Chain is in metal_blockchain. Read-only.',
			inputSchema: z.object({
				network: z.enum(['metal_l2', 'ethereum', 'bnb']).describe('Which chain'),
				view: z.enum(['status', 'token', 'balance']).describe('What to read'),
				token: z.string().max(42).optional().describe('token / balance: a 0x token address, or "XPR" / "MTL"'),
				address: z.string().max(42).optional().describe('balance: a 0x CONTRACT address'),
			}),
			annotations: { title: 'EVM chains', ...RO },
		},
		async ({ network, view, token, address }: { network: EvmNet; view: string; token?: string; address?: string }) => {
			const n = EVM_NETWORKS[network];
			if (!n) return bad('network must be metal_l2, ethereum or bnb.');
			const resolveToken = (t?: string) => {
				const s = String(t ?? '').trim();
				if (isAddress(s)) return s;
				const known = KNOWN_TOKENS[s.toUpperCase()]?.[network];
				return known ?? null;
			};
			try {
				const c = await checkChain(network, ctx);
				if (view === 'status') {
					const b = await evmRpc(network, 'eth_getBlockByNumber', ['latest', false], 10, ctx);
					const num = hexToBig(b.result?.number);
					const ts = hexToBig(b.result?.timestamp);
					return ok(
						{ network: n.name, chainId: n.chainId, latestBlock: num === null ? null : Number(num), blockTime: ts === null ? null : new Date(Number(ts) * 1000).toISOString(), explorer: n.explorer },
						b.source,
						b.readAt,
						`Live. Chain id ${n.chainId} confirmed by the endpoint itself (${c.source}).`,
					);
				}
				if (view === 'token') {
					const addr = resolveToken(token);
					if (!addr) return bad(`Give a 0x token address, or a name the guide records for ${n.name}: ${Object.keys(KNOWN_TOKENS).filter((k) => KNOWN_TOKENS[k][network]).join(', ') || 'none yet'}.`);
					const code = await evmRpc(network, 'eth_getCode', [addr, 'latest'], 3600, ctx);
					if (typeof code.result !== 'string' || code.result === '0x') return bad(`${addr} has no contract code on ${n.name}, so it is not a token there.`);
					const call = (data: string) => evmRpc(network, 'eth_call', [{ to: addr, data }, 'latest'], 300, ctx);
					const [nm, sy, de, ts] = await Promise.all([call(SEL.name), call(SEL.symbol), call(SEL.decimals), call(SEL.totalSupply)]);
					const dec = hexToBig(de.result);
					const decimals = dec === null || dec > 36n ? null : Number(dec);
					return ok(
						{
							network: n.name,
							address: addr,
							name: decodeString(nm.result),
							symbol: decodeString(sy.result),
							decimals,
							totalSupply: decimals === null ? null : units(hexToBig(ts.result), decimals),
							explorer: `${n.explorer}/token/${addr}`,
						},
						ts.source,
						ts.readAt,
						network === 'metal_l2'
							? 'Live from Metal L2.'
							: `Live from ${n.name}. This is the ${network === 'ethereum' ? 'ERC-20' : 'BEP-20'} token contract, not native XPR on XPR Network: the two are on different networks.`,
					);
				}
				if (view === 'balance') {
					const who = String(address ?? '').trim();
					if (!isAddress(who)) return bad('Give a 0x contract address.');
					const code = await evmRpc(network, 'eth_getCode', [who, 'latest'], 3600, ctx);
					if (typeof code.result !== 'string' || code.result === '0x')
						return bad(`${who} is a plain wallet address (no contract code), which belongs to a person. This guide does not look up people's wallets.`);
					const nat = await evmRpc(network, 'eth_getBalance', [who, 'latest'], 60, ctx);
					const out: any = { network: n.name, address: who, [n.native]: units(hexToBig(nat.result), 18) };
					if (token) {
						const t = resolveToken(token);
						if (!t) return bad('The token must be a 0x address or a name the guide records (XPR, MTL).');
						const [bal, de, sy] = await Promise.all([
							evmRpc(network, 'eth_call', [{ to: t, data: balanceOfData(who) }, 'latest'], 60, ctx),
							evmRpc(network, 'eth_call', [{ to: t, data: SEL.decimals }, 'latest'], 3600, ctx),
							evmRpc(network, 'eth_call', [{ to: t, data: SEL.symbol }, 'latest'], 3600, ctx),
						]);
						const dec = hexToBig(de.result);
						out.token = { address: t, symbol: decodeString(sy.result), balance: dec === null || dec > 36n ? null : units(hexToBig(bal.result), Number(dec)) };
					}
					out.explorer = `${n.explorer}/address/${who}`;
					return ok(out, nat.source, nat.readAt, `Live from ${n.name}. Shown because this address is a contract.`);
				}
				return bad('Unknown view.');
			} catch (e) {
				return fail(e, `Try again in a minute, or check the explorer: ${n.explorer}`);
			}
		},
	);
}
