// catalog.ts: one stable tool, guide_tools, that lists every tool this server has and runs any of them by name.
// Why (builder, 2026-10-16: "we cant make things complicated for the user or even change chats. fix it"): AI apps save a
// connector's tool list when it is added and do not pick up new tools by themselves, so a tool added later is invisible
// until each user refreshes. Sources read 2026-10-16:
//   - OpenAI, developers.openai.com/apps-sdk/deploy/connect-chatgpt: a custom MCP server needs a manual "Refresh" in
//     ChatGPT before new metadata shows.
//   - github.com/anthropics/claude-code/issues/38324 (a user's report, tested 2026-03-24): the Claude desktop and mobile
//     apps keep the first tools/list "indefinitely", even in a new chat.
//   - Grok, measured here 2026-10-16: re-adding the same URL kept the old 9 tools.
// The fix is the published "meta-tool" pattern (list → describe → call): Giant Swarm Muster's list_tools / describe_tool /
// call_tool (docs.giantswarm.io/overview/agent-platform/meta-tools/), CrowdStrike Falcon MCP "dynamic mode"
// (developer.crowdstrike.com/falcon-mcp/usage/dynamic-mode/). The MCP way (notifications/tools/list_changed) needs a live
// session and a client that honours it; none of the three apps above was found to re-read the list for it.
// Every call made through guide_tools runs the tool's own handler, behind the same privacy filter, private-key refusal,
// off switch and rate limits as a direct call. guide_tools cannot call itself.

import { z } from 'zod';

export const CATALOG_TOOL = 'guide_tools';

type Result = { content: { type: 'text'; text: string }[]; isError?: boolean; [k: string]: unknown };
type Run = (args: unknown, extra: unknown) => Promise<Result>;
interface ToolConfig {
	title?: string;
	description?: string;
	inputSchema?: z.ZodType;
	annotations?: { readOnlyHint?: boolean };
}

const err = (text: string): Result => ({ isError: true, content: [{ type: 'text', text }] });
const okText = (data: unknown): Result => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });

/** "mcp__GUARD_IAN_XPR_Guide-a1166e8e__xpr_table", "guard/xpr_table" or " XPR_TABLE " → "xpr_table". Apps prefix names. */
export function normalizeToolName(name: string): string {
	const s = String(name ?? '').trim().toLowerCase();
	const parts = s.split(/__|\/|:/).filter(Boolean);
	return parts.length ? parts[parts.length - 1] : s;
}

function summary(description = ''): string {
	const first = description.split(/(?<=[.!?])\s/)[0] ?? '';
	return first.length > 180 ? first.slice(0, 177) + '...' : first;
}

export function footerText(version: string, toolCount: number, catalogOffered = true): string {
	if (!catalogOffered) return `[GUARD.IAN XPR Guide server ${version}, ${toolCount} tools.]`;
	return `[GUARD.IAN XPR Guide server ${version}, ${toolCount} tools. If a tool named in a result, the guide or the rules is not in your tool list, run it through ${CATALOG_TOOL}: no refresh or new chat needed. If ${CATALOG_TOOL} itself is missing, this app saved an older tool list: the user can refresh it once (README "After an update").]`;
}

export class ToolCatalog {
	private tools = new Map<string, { config: ToolConfig; run: Run }>();
	// 1.25.0: old tool names that now live inside a merged tool (merge.ts). Not listed; describe and call still accept them.
	private hidden = new Map<string, { config: ToolConfig; run: Run }>();
	private aliasOf = new Map<string, string>();
	/** True once guide_tools itself is registered (the off switch can leave it out). */
	offered = false;

	add(name: string, config: unknown, run: Run) {
		if (name === CATALOG_TOOL) this.offered = true;
		else this.tools.set(name, { config: (config ?? {}) as ToolConfig, run });
	}

	addHidden(name: string, config: unknown, run: Run) {
		this.hidden.set(name, { config: (config ?? {}) as ToolConfig, run });
	}
	getHidden(name: string) {
		return this.hidden.get(name);
	}
	/** Record which merged tool an old name now belongs to, for describe. */
	setAlias(oldName: string, merged: string) {
		this.aliasOf.set(oldName, merged);
	}

	/** Every tool offered, counting guide_tools itself when it is on. */
	get count() {
		return this.tools.size + (this.offered ? 1 : 0);
	}

	names() {
		return [...this.tools.keys()];
	}

	list(version: string): Result {
		return okText({
			server: `GUARD.IAN XPR Guide ${version}`,
			how: `To run one: ${CATALOG_TOOL} action "describe" with its name (shows its inputs), then action "call" with name and arguments.`,
			tools: [...this.tools].map(([name, t]) => ({
				name,
				title: t.config.title,
				summary: summary(t.config.description),
				...(t.config.annotations?.readOnlyHint === false ? { writes: true } : {}),
			})),
		});
	}

	private find(name: string) {
		const n = normalizeToolName(name);
		if (n === CATALOG_TOOL) return { error: err(`${CATALOG_TOOL} cannot run itself. Give the name of another tool.`) };
		const t = this.tools.get(n) ?? this.hidden.get(n);
		if (!t) return { error: err(`No tool named "${n}" here. Tools: ${this.names().join(', ')}.`) };
		return { name: n, t };
	}

	describe(name: string): Result {
		const f = this.find(name);
		if ('error' in f) return f.error!;
		let inputs: unknown = { type: 'object', properties: {} };
		try {
			if (f.t.config.inputSchema) inputs = z.toJSONSchema(f.t.config.inputSchema, { unrepresentable: 'any' });
		} catch {
			inputs = 'inputs could not be described; call it with the fields its description names';
		}
		const merged = this.tools.has(f.name) ? undefined : this.aliasOf.get(f.name);
		return okText({ name: f.name, ...(merged ? { note: `Older name, still works with these inputs. It is now part of "${merged}".` } : {}), title: f.t.config.title, description: f.t.config.description, inputs, annotations: f.t.config.annotations });
	}

	async call(name: string, args: unknown, extra: unknown): Promise<Result> {
		const f = this.find(name);
		if ('error' in f) return f.error!;
		let a: unknown = args ?? {};
		if (typeof a === 'string') {
			try {
				a = a.trim() ? JSON.parse(a) : {};
			} catch {
				return err('arguments must be a JSON object, e.g. {"account": "eosio.token"}.');
			}
		}
		if (!a || typeof a !== 'object' || Array.isArray(a)) return err('arguments must be a JSON object, e.g. {"account": "eosio.token"}.');
		// A tool that saves something (suggest_update) runs only as a direct call, where the app shows it to the user first.
		if (f.t.config.annotations?.readOnlyHint === false)
			return err(`${f.name} saves something, so it runs only as a direct call, where the app shows it to the user first. If it is not in your tool list, the user can refresh the list once (README "After an update"), or open an issue with the source link on the guide's GitHub.`);
		const schema = f.t.config.inputSchema;
		if (schema) {
			const parsed = schema.safeParse(a);
			if (!parsed.success)
				return err(`Inputs for ${f.name} did not fit: ${z.prettifyError(parsed.error)}\nUse ${CATALOG_TOOL} action "describe" with name "${f.name}" to see its inputs.`);
			a = parsed.data;
		}
		return f.t.run(a, extra);
	}
}

export const catalogInput = z.object({
	action: z.enum(['list', 'describe', 'call']).describe('"list" every tool, "describe" one tool\'s inputs, or "call" one tool'),
	name: z.string().max(120).optional().describe('The tool to describe or call, e.g. "metal_blockchain"'),
	arguments: z
		.union([z.record(z.string(), z.unknown()), z.string().max(5000)])
		.optional()
		.describe('For "call": the tool\'s inputs as a JSON object, e.g. {"view": "status"}'),
});

export const CATALOG_DESCRIPTION = `Every tool this GUARD.IAN server has, kept current on the server, and a way to run any of them by name. AI apps save a connector's tool list when it is added, so tools added later can be missing from yours: use this whenever a result, the guide or the rules names a tool you don't have, or to see what is available. Steps: action "list"; then "describe" with a name (its inputs); then "call" with name and arguments. A call runs that tool exactly as a direct call would, with the same rules, privacy filter and limits. Read-only: a tool that saves something (suggest_update) runs only as a direct call.`;
