// access.ts: what the PUBLIC connector will investigate (builder's ruling 2026-10-16, after an external review:
// "Public GUARD.IAN may explain XPR accounts and transactions, but detailed investigation of an individual's wallet
// should require verified control of that account").
//
// Public = system accounts, deployed contracts, block producers, exchange deposit accounts and registered XPR Agents
// (since 2026-10-16 no longer "any account the guide names": that let a guide edit open a person's wallet). Everyone else counts as a private person: the public connector declines to
// profile them (balances, history, holdings) and gives the explorer link instead, so a person can look for themselves.
// When unsure, the answer is "private". The records stay public on chain; the connector just doesn't do the profiling.

import { rpc, rpcPool, type Network } from './net.ts';
import { makeKeep } from './history.ts';

const cache = new Map<string, { at: number; pub: boolean; why: string }>();
const TTL_MS = 60 * 60 * 1000;
const NO_CODE = '1970-01-01T00:00:00.000';

// An account that once had code and later cleared it keeps its last_code_update date (found 2026-10-16: a staker's
// account counted as "a smart contract" with no code or ABI). get_code_hash tells whether code is there now:
// all zeros = none. null = the read failed or looked odd, and the older date-only rule then decides.
async function hasCodeNow(name: string, net: Network | undefined, ctx?: ExecutionContext): Promise<boolean | null> {
	try {
		const r = await rpc('/v1/chain/get_code_hash', { account_name: name }, 300, ctx, undefined, rpcPool(net));
		const h = String(r.json?.code_hash ?? '');
		if (!/^[0-9a-f]{64}$/i.test(h)) return null;
		return !/^0+$/.test(h);
	} catch {
		return null;
	}
}

// A real contract publishes an interface (ABI) with actions; an account with code but no ABI actions is unclear, and
// unclear counts as private (live check 2026-10-16: a staker's account still counted as a contract after 1.14.3).
async function hasAbiActions(name: string, net: Network | undefined, ctx?: ExecutionContext): Promise<boolean | null> {
	try {
		const r = await rpc('/v1/chain/get_abi', { account_name: name }, 300, ctx, undefined, rpcPool(net));
		if (!r.json || typeof r.json !== 'object') return null;
		return Array.isArray(r.json.abi?.actions) && r.json.abi.actions.length > 0;
	} catch {
		return null;
	}
}

async function isRegisteredAgent(name: string, ctx?: ExecutionContext): Promise<boolean> {
	try {
		const r = await rpc('/v1/chain/get_table_rows', { code: 'agentcore', scope: 'agentcore', table: 'agents', json: true, limit: 1, lower_bound: name, upper_bound: name, key_type: 'name' }, 600, ctx);
		return (r.json?.rows ?? []).some((x: any) => x.account === name);
	} catch {
		return false;
	}
}

export interface PublicCheck {
	pub: boolean;
	why: string;
}

/** Is this account public (OK to investigate on the public connector)? Cached for an hour. Fails toward "private". */
export async function isPublicAccount(
	name: string,
	opts: { repo: string; branch: string; token?: string; net?: Network; producers?: string[] },
	ctx?: ExecutionContext,
): Promise<PublicCheck> {
	const key = `${opts.net ?? 'mainnet'}:${name}`;
	const hit = cache.get(key);
	if (hit && Date.now() - hit.at < TTL_MS) return { pub: hit.pub, why: hit.why };
	let res: PublicCheck = { pub: false, why: 'a private account' };
	if (makeKeep([], opts.producers ?? []).has(name)) res = { pub: true, why: 'a system, exchange or block-producer account' };
	else {
		try {
			const a = await rpc('/v1/chain/get_account', { account_name: name }, 300, ctx, undefined, rpcPool(opts.net));
			if (
				a.json?.last_code_update &&
				a.json.last_code_update !== NO_CODE &&
				(await hasCodeNow(name, opts.net, ctx)) !== false &&
				(await hasAbiActions(name, opts.net, ctx)) !== false
			)
				res = { pub: true, why: 'a smart contract' };
		} catch {
			/* unknown → stays private */
		}
		if (!res.pub && opts.net !== 'testnet' && (await isRegisteredAgent(name, ctx))) res = { pub: true, why: 'a registered XPR Agent' };
		// Being named in the guide no longer opens an account (external review 2026-10-16): a guide edit must never open
		// an ordinary person's wallet. Public = what the chain says it is.
	}
	cache.set(key, { at: Date.now(), ...res });
	return res;
}

/** The account name a u64 encodes (the reverse of chain.ts nameToU64), or null if it is not a clean account name. */
export function u64ToName(v: string): string | null {
	if (!/^\d{1,20}$/.test(v)) return null;
	let n: bigint;
	try {
		n = BigInt(v);
	} catch {
		return null;
	}
	if (n <= 0n || n >= 1n << 64n) return null;
	const charset = '.12345abcdefghijklmnopqrstuvwxyz';
	let s = '';
	for (let i = 0; i < 12; i++) s += charset[Number((n >> BigInt(64 - 5 * (i + 1))) & 31n)];
	if (n & 0xfn) return null; // a 13th character: not an ordinary account name
	s = s.replace(/\.+$/, '');
	return /^[a-z1-5][a-z1-5.]{0,11}$/.test(s) && !s.includes('..') ? s : null;
}

/** Does this account exist on chain? Unknown counts as yes, so a failed read cannot open a lookup. */
export async function accountExists(name: string, net: Network | undefined, ctx?: ExecutionContext): Promise<boolean> {
	try {
		await rpc('/v1/chain/get_account', { account_name: name }, 300, ctx, undefined, rpcPool(net));
		return true;
	} catch (e: any) {
		// 1.22.4: nodeos reports a missing account as "Account Query Exception" (seen live 2026-10-23, ondastream on mainnet).
		return !/unknown key|does not exist|not found|account query exception|\b500\b/i.test(String(e?.message ?? e));
	}
}

/**
 * The account names a table read would be keyed on (2026-10-16, closing the side doors): the scope (also an all-digit
 * name, and a scope sent as a number that is the u64 encoding of a name), and the bounds (nodeos reads a name-shaped
 * bound as a name on a u64 key even without key_type "name"; a long number may be an encoded name).
 * direct = check as typed; encoded = decoded from a number, check only if that account exists.
 */
export function tableAccountRefs(a: { code: string; scope?: string; scope_type?: 'name' | 'number'; lower_bound?: string; upper_bound?: string; key_type?: string }): { direct: string[]; encoded: string[] } {
	const direct = new Set<string>();
	const encoded = new Set<string>();
	const valid = (s: string) => /^[a-z1-5.]{1,12}$/.test(s) && !s.endsWith('.');
	if (a.scope && a.scope !== a.code) {
		if (!/^\d+$/.test(a.scope)) direct.add(a.scope);
		else if (a.scope_type === 'name' || (a.scope_type !== 'number' && a.scope.length <= 12 && !/[06-9]/.test(a.scope))) direct.add(a.scope);
		else {
			const d = u64ToName(a.scope);
			if (d) encoded.add(d);
		}
	}
	for (const b of [a.lower_bound, a.upper_bound]) {
		if (!b) continue;
		if (valid(b) && (a.key_type === 'name' || /[a-z.]/.test(b))) direct.add(b);
		else if (/^\d{13,20}$/.test(b)) {
			const d = u64ToName(b);
			if (d) encoded.add(d);
		}
	}
	direct.delete(a.code);
	encoded.delete(a.code);
	return { direct: [...direct], encoded: [...encoded] };
}

/**
 * Private mode (builder, 2026-10-16: "private"). With a secret set, the connector answers only at /mcp/<secret>
 * ('rewrite' → served as /mcp); everything else is 'deny' (404), the landing page included. Without one, the public
 * behaviour stays: '/' shows the landing page, everything else passes.
 */
export function accessGate(pathname: string, secret?: string, lock?: string): 'pass' | 'rewrite' | 'deny' | 'open-landing' {
	const s = (secret ?? '').trim();
	if (s && pathname === `/mcp/${s}`) return 'rewrite';
	// The public address stays open unless LOCK_PUBLIC is "1" (builder, 2026-10-16: "give the connection back to them,
	// i need to use it on my phone tomorrow"); the secret address works either way.
	if (s && (lock ?? '').trim() === '1') return 'deny';
	return pathname === '/' || pathname === '' ? 'open-landing' : 'pass';
}

/**
 * 1.22.3 (builder 2026-10-23 "Fix it"): an account that does not exist on this network was refused as "a private
 * person's account" (found with ondastream: a testnet-only contract, absent on mainnet). Existence is public and is
 * not a profile, so say plainly that there is no such account and where to look instead. accountExists() fails toward
 * "exists", so a failed read still ends in the ordinary private refusal.
 */
export function missingAccount(name: string, net?: Network) {
	const where = net === 'testnet' ? 'the XPR testnet' : 'XPR Network mainnet';
	const other = net === 'testnet' ? 'mainnet (network "mainnet", the default)' : 'the testnet (xpr_testnet, view "account")';
	return {
		isError: true,
		content: [
			{
				type: 'text' as const,
				text: `No account named "${name}" exists on ${where} (checked live). Check the spelling; a project still in testing may only exist on ${other}.`,
			},
		],
	};
}

/** The refusal for a non-public account: "no such account" when the chain says so, otherwise the private refusal. */
export async function declineAccount(name: string, net: Network | undefined, ctx?: ExecutionContext) {
	return (await accountExists(name, net, ctx)) ? privateRefusal(name, net) : missingAccount(name, net);
}

export function privateRefusal(name: string, net?: Network) {
	const host = net === 'testnet' ? 'https://testnet.explorer.xprnetwork.org' : 'https://explorer.xprnetwork.org';
	return {
		isError: true,
		content: [
			{
				type: 'text' as const,
				text:
					`Declined: "${name}" looks like a private person's account, and this public connector doesn't profile individuals' wallets (balances, history, holdings). ` +
					`The records are public on chain: the person can look at their own account at ${host}/account/${name}. ` +
					`Contracts, tokens, block producers, exchanges, registered agents and projects listed in the guide can be looked up here. ` +
					`(A verified "look up my own wallet" option is planned, using a WebAuth sign-in.)`,
			},
		],
	};
}
