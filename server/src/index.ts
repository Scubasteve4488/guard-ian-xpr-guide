// GUARD.IAN XPR Guide — remote MCP server (Cloudflare Worker).
// Built on Cloudflare's official template: cloudflare/ai demos/remote-mcp-authless @ 0e5bc3b (read 2026-10-15).
// Read-only. No AI model, no keys, no signing, no transactions. Every answer carries its source and read time.

import { McpServer } from '@modelcontextprotocol/server';
import { createMcpHandler } from 'agents/mcp/server';
import { z } from 'zod';
import { GUIDE_FILES, readGuideFile, splitSections, searchSections, type GuideFile } from './guide.ts';
import { fetchSource } from './sources.ts';
import { chainInfo, account, tokenBalances, table, producers, isAccountName, isTableName, isSymbol } from './chain.ts';
import { tokenCheck } from './tokens.ts';
import { UpstreamError } from './net.ts';

interface Env {
	GUIDE_REPO: string;
	GUIDE_BRANCH: string;
	GITHUB_TOKEN?: string; // Worker secret, only if the guide repo is private (read-only, one repo)
	RATE_LIMITER?: { limit(o: { key: string }): Promise<{ success: boolean }> };
}

const VERSION = '1.0.0';

const INSTRUCTIONS = `GUARD.IAN XPR Guide: a community-built, read-only guide to XPR Network and the Metallicus ecosystem (Metal X, Metal Pay, WebAuth, Metal Dollar XMD, LOAN, Metal Blockchain, Metal L2, PulseVM), SimpleDEX, XPR Agents, KSTO and the wider community. Not affiliated with Metallicus or XPR Network.
How to answer with it:
1. Start with guide_search (or guide_read "ECOSYSTEM.md" / "llms.txt") to find the official source, then source_fetch that source or use the xpr_* chain tools for live facts.
2. Every fact needs its source link and the time it was read. If nothing covers it, say "I haven't verified that" and say where it could be checked. Never fill a gap from memory.
3. The chain beats documents; official pages beat community posts; community beats press. Tokens are always symbol + contract.
4. No price predictions and no buy/sell/hold advice. Never call a person or project a scam; report what each source says.
5. Public records are worded exactly as the record says, only when asked.
Full rules: guide_read "RULES.md".`;

const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } as const;

function ok(data: unknown, source: string | string[], readAt: string, note?: string) {
	const srcs = Array.isArray(source) ? source : [source];
	const text = [JSON.stringify(data, null, 2), '', `Source: ${srcs.join(' ; ')}`, `Read at: ${readAt}`, note ? `Note: ${note}` : '']
		.filter((x) => x !== '')
		.join('\n');
	return { content: [{ type: 'text' as const, text }] };
}

function fail(e: unknown, hint: string) {
	const msg = (e instanceof UpstreamError ? e.message : 'unexpected error').replace(/\.+$/, '');
	return { isError: true, content: [{ type: 'text' as const, text: `Could not complete: ${msg}. ${hint}` }] };
}

function badInput(msg: string) {
	return { isError: true, content: [{ type: 'text' as const, text: msg }] };
}

function createServer(env: Env, ctx?: ExecutionContext) {
	const repo = env.GUIDE_REPO || 'Scubasteve4488/guard-ian-xpr-guide';
	const branch = env.GUIDE_BRANCH || 'main';
	const server = new McpServer({ name: 'guard-ian-xpr-guide', version: VERSION }, { instructions: INSTRUCTIONS });

	server.registerTool(
		'guide_search',
		{
			title: 'Search the GUARD.IAN XPR Guide',
			description:
				'Keyword search across the whole guide (ecosystem directory, source catalog, rules, KSTO, index). Returns the best-matching sections with file and line. Use this first for any question about XPR Network, Metallicus products, dApps, tokens, governance or communities.',
			inputSchema: z.object({
				query: z.string().min(2).max(200).describe('What to look for, e.g. "Vibrr", "LOAN protocol lending", "XMD contract"'),
				limit: z.number().int().min(1).max(10).optional().describe('Max sections to return (default 6)'),
			}),
			annotations: { title: 'Search the guide', ...RO },
		},
		async ({ query, limit }) => {
			try {
				const files = await Promise.all(GUIDE_FILES.map((f) => readGuideFile(repo, branch, f, ctx, env.GITHUB_TOKEN).then((r) => ({ f, r }))));
				const sections = files.flatMap(({ f, r }) => splitSections(f, r.text));
				const hits = searchSections(sections, query, limit ?? 6);
				if (!hits.length)
					return ok({ query, results: [] }, `https://github.com/${repo}`, new Date().toISOString(), 'No match in the guide. Say "I haven\'t verified that" and suggest an official source, or try other words.');
				return ok(
					{ query, results: hits.map((h) => ({ file: h.file, heading: h.heading, line: h.startLine, score: h.score, text: h.text })) },
					[...new Set(hits.map((h) => `https://github.com/${repo}/blob/${branch}/${h.file}#L${h.startLine}`))],
					files[0].r.readAt,
				);
			} catch (e) {
				return fail(e, 'GitHub may be slow; try again in a minute.');
			}
		},
	);

	server.registerTool(
		'guide_read',
		{
			title: 'Read a guide file',
			description:
				'Read one whole file of the guide, always the latest version from GitHub. Files: llms.txt (index of official sources), RULES.md (how to answer), ECOSYSTEM.md (directory of products, dApps, tokens, feeds, governance, communities, GitHub), SOURCES.md (tiered source catalog), KSTO.md, README.md, CHANGELOG.md.',
			inputSchema: z.object({ file: z.enum(GUIDE_FILES).describe('Which file to read') }),
			annotations: { title: 'Read a guide file', ...RO },
		},
		async ({ file }) => {
			try {
				const r = await readGuideFile(repo, branch, file as GuideFile, ctx, env.GITHUB_TOKEN);
				return { content: [{ type: 'text' as const, text: `${r.text}\n\nSource: ${r.source}\nRead at: ${r.readAt}` }] };
			} catch (e) {
				return fail(e, 'Try guide_search instead.');
			}
		},
	);

	server.registerTool(
		'source_fetch',
		{
			title: 'Fetch an official source page',
			description:
				'Fetch one page from a source the guide lists (XPR Network, Metallicus, Metal X, SimpleDEX, XPR Agents, KSTO, block producers, catalogued GitHub orgs, data APIs). Returns readable text (HTML stripped, max 20,000 characters). Hosts outside the guide\'s source list are refused.',
			inputSchema: z.object({ url: z.string().url().max(500).describe('https URL taken from the guide, e.g. https://simpledex.fun/llms-launches.txt') }),
			annotations: { title: 'Fetch a source page', ...RO },
		},
		async ({ url }) => {
			try {
				const r = await fetchSource(url, ctx);
				const notes = [r.truncated ? 'Truncated at 20,000 characters.' : '', r.jsShell ? 'This page builds itself in the browser, so little text was readable. Use another source or a live API.' : '']
					.filter(Boolean)
					.join(' ');
				return { content: [{ type: 'text' as const, text: `${r.text}\n\nSource: ${r.source}\nRead at: ${r.readAt}${notes ? `\nNote: ${notes}` : ''}` }] };
			} catch (e) {
				return fail(e, 'Use guide_search to find the listed official URL.');
			}
		},
	);

	server.registerTool(
		'xpr_chain_info',
		{
			title: 'XPR Network: chain status',
			description: 'Live XPR Network mainnet status: chain id, head block number and time, last irreversible block, node version.',
			inputSchema: z.object({}),
			annotations: { title: 'Chain status', ...RO },
		},
		async () => {
			try {
				const r = await chainInfo(ctx);
				return ok(r.data, r.source, r.readAt);
			} catch (e) {
				return fail(e, 'Public endpoints may be busy; try again shortly.');
			}
		},
	);

	server.registerTool(
		'xpr_account',
		{
			title: 'XPR Network: account',
			description:
				'Live public facts about an XPR account: creation date, XPR balance, CPU/NET/RAM, permission structure (which accounts/keys can sign, never any secret), and votes. Read-only.',
			inputSchema: z.object({ account: z.string().min(1).max(13).describe('XPR account name, e.g. "protonnz"') }),
			annotations: { title: 'Account', ...RO },
		},
		async ({ account: name }) => {
			if (!isAccountName(name)) return badInput('Not a valid XPR account name (1–12 characters: a–z, 1–5 and ".").');
			try {
				const r = await account(name, ctx);
				return ok(r.data, r.source, r.readAt);
			} catch (e) {
				return fail(e, 'Check the spelling of the account name.');
			}
		},
	);

	server.registerTool(
		'xpr_token_balances',
		{
			title: 'XPR Network: token balances',
			description: 'Every token an XPR account holds, each as symbol + contract + amount (Hyperion state API). Read-only.',
			inputSchema: z.object({ account: z.string().min(1).max(13).describe('XPR account name') }),
			annotations: { title: 'Token balances', ...RO },
		},
		async ({ account: name }) => {
			if (!isAccountName(name)) return badInput('Not a valid XPR account name (1–12 characters: a–z, 1–5 and ".").');
			try {
				const r = await tokenBalances(name, ctx);
				return ok({ account: name, tokens: r.data }, r.source, r.readAt, 'Same symbol on a different contract is a different token.');
			} catch (e) {
				return fail(e, 'Hyperion endpoints may be busy; try again shortly.');
			}
		},
	);

	server.registerTool(
		'xpr_table',
		{
			title: 'XPR Network: read a contract table',
			description:
				'Read rows from any XPR smart-contract table (get_table_rows, max 50 rows, paged with next_key). Example: code "simplelaunch", table "antisnipe" for SimpleDEX launch windows. Read-only.',
			inputSchema: z.object({
				code: z.string().min(1).max(12).describe('Contract account, e.g. "simplelaunch"'),
				table: z.string().min(1).max(12).describe('Table name, e.g. "antisnipe"'),
				scope: z.string().min(1).max(12).optional().describe('Scope (defaults to the contract)'),
				limit: z.number().int().min(1).max(50).optional().describe('Rows to return (default 20, max 50)'),
				lower_bound: z.string().max(64).optional().describe('Start key (use next_key from a previous page)'),
				upper_bound: z.string().max(64).optional(),
				reverse: z.boolean().optional(),
			}),
			annotations: { title: 'Contract table', ...RO },
		},
		async (a) => {
			if (!isAccountName(a.code) || !isTableName(a.table) || (a.scope && !isAccountName(a.scope)))
				return badInput('code, table and scope must be valid XPR names (a–z, 1–5 and ".", up to 12 characters).');
			try {
				const r = await table(a, ctx);
				return ok(r.data, r.source, r.readAt, r.data.more ? `More rows exist: call again with lower_bound="${r.data.next_key}".` : undefined);
			} catch (e) {
				return fail(e, 'Check the contract and table names (the contract ABI lists its tables).');
			}
		},
	);

	server.registerTool(
		'xpr_producers',
		{
			title: 'XPR Network: active block producers',
			description: 'The live active block-producer schedule (who is producing blocks right now).',
			inputSchema: z.object({}),
			annotations: { title: 'Block producers', ...RO },
		},
		async () => {
			try {
				const r = await producers(ctx);
				return ok(r.data, r.source, r.readAt);
			} catch (e) {
				return fail(e, 'Try again shortly.');
			}
		},
	);

	server.registerTool(
		'xpr_token_check',
		{
			title: 'Is this the real token?',
			description:
				"Check a token by symbol + contract against XPR's developer token registry, the live chain (supply/issuer), Metal X's market list, Alcor's listing flags and (for SimpleDEX tokens) the SimpleDEX indexer. Reports each source's facts and what cannot be verified. It does not declare anything safe or a scam.",
			inputSchema: z.object({
				symbol: z.string().min(1).max(7).describe('Token symbol in capitals, e.g. "XBTC"'),
				contract: z.string().min(1).max(12).describe('Token contract account, e.g. "xtokens"'),
			}),
			annotations: { title: 'Token check', ...RO },
		},
		async ({ symbol, contract }) => {
			if (!isSymbol(symbol)) return badInput('Symbol must be 1–7 capital letters, e.g. "XBTC".');
			if (!isAccountName(contract)) return badInput('Contract must be a valid XPR account name, e.g. "xtokens".');
			try {
				const r = await tokenCheck(symbol, contract, ctx);
				return ok({ symbol: r.symbol, contract: r.contract, facts: r.facts, cannot_verify: r.cannot_verify }, r.sources, r.readAt);
			} catch (e) {
				return fail(e, 'Try again shortly.');
			}
		},
	);

	return server;
}

const LANDING = `GUARD.IAN XPR Guide — read-only MCP server
Connector URL: <this host>/mcp   (add it as a custom connector in Claude, ChatGPT, Grok or any MCP app; no sign-in)
Tools: guide_search, guide_read, source_fetch, xpr_chain_info, xpr_account, xpr_token_balances, xpr_table, xpr_producers, xpr_token_check
Read-only: no AI model, no keys, no transactions. Community-built; not affiliated with Metallicus or XPR Network.
Code and content: https://github.com/Scubasteve4488/guard-ian-xpr-guide
`;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === '/' || url.pathname === '') return new Response(LANDING, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
		if (url.pathname === '/health') return Response.json({ ok: true, name: 'guard-ian-xpr-guide', version: VERSION });

		// Rate limit (CLAUDE.md rule 10). Keyed per client IP; per Cloudflare location (see wrangler.jsonc).
		if (env.RATE_LIMITER) {
			const ip = request.headers.get('cf-connecting-ip') || 'unknown';
			const { success } = await env.RATE_LIMITER.limit({ key: ip });
			if (!success) return new Response('Rate limit: 60 requests per minute. Please slow down.', { status: 429, headers: { 'retry-after': '60' } });
		}
		const handler = createMcpHandler(() => createServer(env, ctx));
		return handler(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
