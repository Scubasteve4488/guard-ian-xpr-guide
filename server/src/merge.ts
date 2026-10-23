// merge.ts — 1.25.0: fewer, bigger tools (owner, 2026-10-23 12:38 MT: "Doesn't make sense to have a bunch of little tools
// if some can be combined"; 12:40 MT: "Yes" to the 23-tool list). A fresh app sees 23 tools; every OLD tool name keeps
// working with its OLD arguments, as a hidden alias, because apps save a connector's tool list and users must never
// have to refresh it (owner ruling; catalog.ts has the sources on how ChatGPT, Claude and Grok cache lists).
//
// How it works, without rewriting any tool:
//   1. The old tools still register exactly as before (same schema, same handler, same privacy wrapper), but a name in
//      HIDDEN_TOOLS is recorded only in the guide_tools catalog, not offered in tools/list (index.ts's register wrapper).
//   2. Each merged tool takes a `view` and runs the old tool's recorded handler, after checking the arguments against
//      that old tool's own schema. Its inputs are the union of the old tools' inputs (all optional except `view`).
//   3. A direct tools/call to an old name is rewritten to the merged name + the right view before the MCP SDK
//      dispatches it (installAliases). The MCP SDK's McpServer keeps its handlers in Protocol._requestHandlers
//      (@modelcontextprotocol/server 2.0.0 dist/mcp-*.mjs setToolRequestHandlers; src-*.mjs setRequestHandler), so the
//      stored tools/call handler is wrapped in place; tools/list is untouched.
// SOURCE (hand-built code): none found — the MCP spec has no alias mechanism; this is the smallest wrapper that keeps
// old names callable while listing only the new ones.

import { z } from 'zod';

export interface MergeView {
	/** The old tool that does the work. */
	tool: string;
	/** Fixed arguments this view adds (e.g. the old tool's own sub-view). */
	args?: Record<string, unknown>;
}
export interface MergeSpec {
	name: string;
	title: string;
	description: string;
	/** When set, `view` may be left out. */
	defaultView?: string;
	views: Record<string, MergeView>;
}

export const MERGES: MergeSpec[] = [
	{
		name: 'guide',
		title: 'The GUARD.IAN XPR Guide: search or read',
		description:
			'The guide itself. view "search" (default): keyword search across the whole guide (ecosystem directory, source catalog, glossary, rules, KSTO, index), best-matching sections with file, line, lastChecked date and stale flag; use it first for any question about XPR Network, Metallicus products, dApps, tokens, governance or communities, and for "Metallicus vs <other chain, stablecoin, wallet or standard>" (ECOSYSTEM §16). view "read": one whole file, always the latest from GitHub (llms.txt, RULES.md, ECOSYSTEM.md, SOURCES.md, GLOSSARY.md, KSTO.md, README.md, CHANGELOG.md).',
		defaultView: 'search',
		views: { search: { tool: 'guide_search' }, read: { tool: 'guide_read' } },
	},
	{
		name: 'xpr_network',
		title: 'XPR Network: chain status and block producers',
		description: 'view "status" (default): live chain status (head block, last irreversible block, chain id, server version); network "testnet" reads the testnet. view "producers": the current block-producer schedule (21 at a time).',
		defaultView: 'status',
		views: { status: { tool: 'xpr_chain_info' }, producers: { tool: 'xpr_producers' } },
	},
	{
		name: 'xpr_account',
		title: 'XPR Network: one public account',
		description:
			'One PUBLIC account (contracts, exchanges, block producers, registered agents; a private person\'s wallet is declined with an explorer link). view "info" (default): resources, permissions, creation date. view "balances": every token balance (symbol + contract). view "history": recent actions, newest first, filterable by contract:action and time. Accounts of people in the results are shown as [private account].',
		defaultView: 'info',
		views: { info: { tool: 'xpr_account' }, balances: { tool: 'xpr_token_balances' }, history: { tool: 'xpr_actions' } },
	},
	{
		name: 'xpr_contract',
		title: 'XPR Network: contract ABI or table',
		description: 'view "abi": a contract\'s actions and tables (optionally one action expanded). view "table": read rows of a contract table (code, table, scope, bounds, paging with next_key); rows naming private people are masked.',
		views: { abi: { tool: 'xpr_abi' }, table: { tool: 'xpr_table' } },
	},
	{
		name: 'xpr_tx',
		title: 'XPR Network: transaction or block',
		description: 'view "transaction": one transaction by its 64-character id (actions, block, time). view "block": one block by number (its transactions and actions). Private accounts in them are masked.',
		views: { transaction: { tool: 'xpr_transaction' }, block: { tool: 'xpr_block' } },
	},
	{
		name: 'simpledex',
		title: 'SimpleDEX: launches, tokens and market',
		description:
			'SimpleDEX (Proton NZ\'s launchpad + DEX). view "list" (default): launched tokens, newest / by volume / by market cap, optionally only graduated. One token: "info" (by symbol: price, supply, graduation, pool, 24h trades), "holders" or "trades" (by numeric token id; accounts shown as [private account]). Market: "stats" (TVL, market cap, token and graduated counts, volumes), "pools" (reserves, TVL, fee, APY) or "graduations" (recent).',
		defaultView: 'list',
		views: {
			list: { tool: 'simpledex_tokens' },
			info: { tool: 'simpledex_token', args: { view: 'info' } },
			holders: { tool: 'simpledex_token', args: { view: 'holders' } },
			trades: { tool: 'simpledex_token', args: { view: 'trades' } },
			stats: { tool: 'simpledex_market', args: { view: 'stats' } },
			pools: { tool: 'simpledex_market', args: { view: 'pools' } },
			graduations: { tool: 'simpledex_market', args: { view: 'graduations' } },
		},
	},
	{
		name: 'markets',
		title: 'Markets: Metal X and Alcor',
		description:
			'Market data. Metal X order-book DEX: "markets" (fees, minimum order, token precision), "depth" (order book), "trades" (recent), "ohlcv" (candles) or "daily" (24h stats); symbols look like "XPR_XMD". "alcor": Alcor Exchange on XPR Network (alcor_view tokens, tickers, ticker, amm_tickers, pools, pool, global). Every number is live. No price predictions and no buy/sell advice.',
		views: Object.fromEntries(['markets', 'depth', 'trades', 'ohlcv', 'daily', 'alcor'].map((v) => [v, { tool: 'metalx_market', args: { view: v } }])),
	},
	{
		name: 'metal_blockchain',
		title: 'Metal Blockchain and its Bitcoin, Litecoin and Dogecoin chains',
		description:
			'Metal Blockchain (layer 0) through Metallicus\'s public API: "status" (height, supply, chain status), "validators", "chains" (subnets and chains) or "staking" (minimum and total stake); network "tahoe" = testnet. Its pegged chains: "btcvm" / "ltcvm" (public wallet info of BTCVM and LTCVM: network, confirmations, limits; alpha software) and "dogecoinvm" (DogecoinVM: published alpha limits and warnings, chain registration, the bridge\'s DOGE balance).',
		defaultView: 'status',
		views: {
			status: { tool: 'metal_blockchain', args: { view: 'status' } },
			validators: { tool: 'metal_blockchain', args: { view: 'validators' } },
			chains: { tool: 'metal_blockchain', args: { view: 'chains' } },
			staking: { tool: 'metal_blockchain', args: { view: 'staking' } },
			btcvm: { tool: 'metal_vm_info', args: { chain: 'btcvm' } },
			ltcvm: { tool: 'metal_vm_info', args: { chain: 'ltcvm' } },
			dogecoinvm: { tool: 'dogecoinvm_status' },
		},
	},
	{
		name: 'xpr_help',
		title: 'XPR Network official help center',
		description: 'help.xprnetwork.org. view "search" (default): find articles by words (each with its own updated date). view "article": the full text of one article by its numeric id.',
		defaultView: 'search',
		views: { search: { tool: 'xpr_help_search' }, article: { tool: 'xpr_help_article' } },
	},
];

/** Every old tool that now lives inside a merged tool. Recorded for guide_tools and aliases, never listed. */
export const HIDDEN_TOOLS = new Set(MERGES.flatMap((m) => Object.values(m.views).map((v) => v.tool)));
/** Old names that differ from their merged tool's name (xpr_account and metal_blockchain keep their names). */
export const ALIAS_NAMES = [...HIDDEN_TOOLS].filter((n) => !MERGES.some((m) => m.name === n));
/** Marks a merged tool's config so index.ts's wrapper offers it even when its name is also an old name. */
export const MERGED = Symbol.for('guard-ian.merged');

/** Old tool name + its old arguments → merged tool name + arguments with the right view. null when not an alias. */
export function translateOld(name: string, args: Record<string, unknown> = {}): { name: string; args: Record<string, unknown> } | null {
	if (!HIDDEN_TOOLS.has(name)) return null;
	const spec = MERGES.find((m) => Object.values(m.views).some((v) => v.tool === name))!;
	if (spec.name === name) return null; // same name: the merged tool accepts the old arguments as they are
	const candidates = Object.entries(spec.views).filter(([, v]) => v.tool === name);
	// The view whose fixed args the old call already states (e.g. simpledex_token {view:"holders"}, metal_vm_info
	// {chain:"ltcvm"}); else the first one, which is the old tool's own default (info, stats, markets, btcvm…).
	const match = candidates.find(([, v]) => v.args && Object.entries(v.args).every(([k, val]) => args[k] === val)) ?? candidates[0];
	const rest = { ...args };
	for (const k of Object.keys(match[1].args ?? {})) delete rest[k];
	return { name: spec.name, args: { ...rest, view: match[0] } };
}

type Rec = { config: { inputSchema?: z.ZodType; description?: string }; run: (args: unknown, extra: unknown) => Promise<any> };
type Register = (name: string, config: unknown, handler: (args: any, extra: any) => any) => unknown;
const shapeOf = (s: unknown): Record<string, z.ZodType> => ((s as any)?.shape && typeof (s as any).shape === 'object' ? (s as any).shape : {});
const err = (text: string) => ({ isError: true, content: [{ type: 'text' as const, text }] });

/** The merged tool's inputs: `view` plus every old tool's fields, optional (first definition of a field wins). */
export function mergedSchema(spec: MergeSpec, getHidden: (n: string) => Rec | undefined) {
	const viewNames = Object.keys(spec.views) as [string, ...string[]];
	const viewField = spec.defaultView ? z.enum(viewNames).default(spec.defaultView as any) : z.enum(viewNames);
	const shape: Record<string, z.ZodType> = { view: viewField.describe(`Which part: ${viewNames.join(', ')}${spec.defaultView ? ` (default ${spec.defaultView})` : ''}`) as any };
	for (const v of Object.values(spec.views)) {
		const fixed = new Set(Object.keys(v.args ?? {}));
		for (const [k, f] of Object.entries(shapeOf(getHidden(v.tool)?.config.inputSchema))) {
			if (k === 'view' || fixed.has(k) || shape[k]) continue;
			shape[k] = (f as any).optional();
		}
	}
	return z.object(shape);
}

/** Register the merged tools. Each runs the old tool's recorded handler after its own schema accepts the arguments. */
export function registerMerged(register: Register, getHidden: (n: string) => Rec | undefined, annotations: Record<string, unknown>) {
	for (const spec of MERGES) {
		const present = Object.values(spec.views).filter((v) => getHidden(v.tool));
		if (!present.length) continue; // every part switched off (DISABLED_TOOLS)
		register(
			spec.name,
			{ title: spec.title, description: spec.description, inputSchema: mergedSchema(spec, getHidden), annotations: { title: spec.title, ...annotations }, [MERGED]: true },
			async (a: Record<string, unknown>, extra: unknown) => {
				const viewName = String(a?.view ?? spec.defaultView ?? '');
				const v = spec.views[viewName];
				if (!v) return err(`${spec.name}: view must be one of ${Object.keys(spec.views).join(', ')}.`);
				const old = getHidden(v.tool);
				if (!old) return err(`${spec.name} view "${viewName}" is switched off on this server right now.`);
				const rest: Record<string, unknown> = { ...a };
				delete rest.view;
				const targs = { ...rest, ...(v.args ?? {}) };
				const schema = old.config.inputSchema;
				if (schema) {
					const parsed = schema.safeParse(targs);
					if (!parsed.success) return err(`Inputs for ${spec.name} view "${viewName}" did not fit: ${z.prettifyError(parsed.error)}`);
					return old.run(parsed.data, extra);
				}
				return old.run(targs, extra);
			},
		);
	}
}

/** Rewrite a direct tools/call to an old name into the merged name + view, before the SDK dispatches it. */
export function installAliases(mcpServer: unknown): boolean {
	const handlers: Map<string, (req: any, ctx: any) => any> | undefined = (mcpServer as any)?.server?._requestHandlers;
	const orig = handlers?.get('tools/call');
	if (!handlers || !orig) return false;
	handlers.set('tools/call', (req: any, ctx: any) => {
		const t = req?.params?.name ? translateOld(String(req.params.name), (req.params.arguments ?? {}) as Record<string, unknown>) : null;
		if (t) req = { ...req, params: { ...req.params, name: t.name, arguments: t.args } };
		return orig(req, ctx);
	});
	return true;
}
