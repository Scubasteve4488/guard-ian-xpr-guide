// access.ts: what the PUBLIC connector will investigate (builder's ruling 2026-10-16, after an external review:
// "Public GUARD.IAN may explain XPR accounts and transactions, but detailed investigation of an individual's wallet
// should require verified control of that account").
//
// Public = system accounts, deployed contracts, block producers, exchange deposit accounts, registered XPR Agents,
// and accounts the guide itself names. Everyone else counts as a private person: the public connector declines to
// profile them (balances, history, holdings) and gives the explorer link instead, so a person can look for themselves.
// When unsure, the answer is "private". The records stay public on chain; the connector just doesn't do the profiling.

import { rpc, rpcPool, type Network } from './net.ts';
import { makeKeep } from './history.ts';
import { readGuideFile } from './guide.ts';

const cache = new Map<string, { at: number; pub: boolean; why: string }>();
const TTL_MS = 60 * 60 * 1000;
const NO_CODE = '1970-01-01T00:00:00.000';

let guideNames: { at: number; names: Set<string> } | null = null;
async function namesInGuide(repo: string, branch: string, ctx?: ExecutionContext, token?: string): Promise<Set<string>> {
	if (guideNames && Date.now() - guideNames.at < 10 * 60 * 1000) return guideNames.names;
	const names = new Set<string>();
	try {
		const r = await readGuideFile(repo, branch, 'ECOSYSTEM.md', ctx, token);
		// Accounts the guide names are written in code spans, e.g. `simplelaunch`, `xmd.token`.
		for (const m of r.text.matchAll(/`([a-z1-5.]{1,12})`/g)) names.add(m[1]);
		guideNames = { at: Date.now(), names };
	} catch {
		/* fall back to the other checks */
	}
	return guideNames?.names ?? names;
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
			if (a.json?.last_code_update && a.json.last_code_update !== NO_CODE) res = { pub: true, why: 'a smart contract' };
		} catch {
			/* unknown → stays private */
		}
		if (!res.pub && opts.net !== 'testnet' && (await isRegisteredAgent(name, ctx))) res = { pub: true, why: 'a registered XPR Agent' };
		if (!res.pub && (await namesInGuide(opts.repo, opts.branch, ctx, opts.token)).has(name)) res = { pub: true, why: 'an account the guide lists' };
	}
	cache.set(key, { at: Date.now(), ...res });
	return res;
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
