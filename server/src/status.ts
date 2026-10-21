// status.ts — metallicus_status: the three official Metallicus status pages, read live. Added 1.16.0 (builder
// 2026-10-21: "I like. Help guard trigger X posts. I need to be notified in telegram too." — this is the read half;
// the Telegram/X half lives in GUARD-Project, where GUARD.IAN runs).
//
// Why: during the 2026-10-17 withdrawal pause the status page said "investigating" for four days while social posts
// called it an exploit. The right answer is what the official page says, with its own time stamps, nothing added.
//
// SOURCES (read 2026-10-21):
// - The pages are Atlassian Statuspage sites: https://status.xprnetwork.org, https://status.metalpay.com,
//   https://status.metall2.com (ECOSYSTEM.md §7 "Official status pages").
// - status.xprnetwork.org/robots.txt (read 2026-10-21 06:16 UTC): "User-agent: * / Disallow: /api/ / Disallow: /embed/".
//   So the JSON API (/api/v2/*.json) is NOT read. The page itself offers two machine feeds to subscribers,
//   history.atom and history.rss ("Get the Atom Feed"); the Atom feed is what this tool reads for incidents.
//   Checked live 2026-10-21: history.atom lists each incident once, with its page link, `published`/`updated` times and
//   every update (Investigating / Identified / Update / Monitoring / Resolved) as HTML in <content>.
// - Component states (WebAuth Wallet, Bridge, Deposits, Withdrawal, ...) are only on the HTML page. Statuspage marks each
//   one `component-inner-container status-<state>` with the name in `<span class="name">`; states are operational,
//   degraded_performance, partial_outage, major_outage, under_maintenance (Statuspage's five). If the markup ever
//   changes, the tool SAYS the component list could not be read rather than returning an empty list as "all fine".
// - robots.txt is checked for every page through robots.ts, like every other non-RPC host in this server.
// SOURCE (hand-built code): none found that a Worker can import. Atom is RFC 4287; the parsing here is a small
// regex reader for that one feed shape, with the HTML stripped by sources.ts's htmlToText.
//
// Privacy: status pages name no people. Nothing here touches a wallet.

import { z } from 'zod';
import { politeFetch, UpstreamError } from './net.ts';
import { robotsAllows } from './robots.ts';
import { htmlToText } from './sources.ts';

type Handler = (args: any) => Promise<any>;
type Register = (name: string, config: unknown, handler: Handler) => unknown;
type Result = { isError?: boolean; content: Array<{ type: 'text'; text: string }> };
const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } as const;

export const STATUS_PAGES = {
	xpr: { name: 'XPR Network Status', url: 'https://status.xprnetwork.org', covers: 'XPR Network, WebAuth, Metal X (swap, pools, farms, lending, OTC), bridge, deposits, withdrawals, explorer, Metal Blockchain' },
	metalpay: { name: 'Metal Pay Status', url: 'https://status.metalpay.com', covers: 'Metal Pay app, fiat and crypto deposits and withdrawals' },
	metal_l2: { name: 'Metal L2 Status', url: 'https://status.metall2.com', covers: 'Metal L2 (RPC, explorer, bridge)' },
} as const;
export type StatusPage = keyof typeof STATUS_PAGES;

/** Statuspage's component states, in its own words. */
const STATE_WORDS: Record<string, string> = {
	operational: 'Operational',
	degraded_performance: 'Degraded Performance',
	partial_outage: 'Partial Outage',
	major_outage: 'Major Outage',
	under_maintenance: 'Under Maintenance',
};

const CACHE_SEC = 120; // two minutes: a status page changes slowly, and repeated questions during an incident must not hammer it

function decodeEntities(s: string): string {
	return s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&');
}
const clean = (s: string) => htmlToText(s).replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim(); // Statuspage wraps the day in <var>, leaving "Oct 17 , 07:46"

export interface IncidentUpdate {
	/** Statuspage's own step word: Investigating, Identified, Update, Monitoring, Resolved, Postmortem */
	status: string;
	/** The time as the page prints it, e.g. "Oct 17, 07:46 UTC" (the feed body carries no year) */
	at: string;
	text: string;
}
export interface Incident {
	title: string;
	url: string;
	/** ISO time of the first entry in the feed (the incident's opening), from <published> */
	opened: string;
	/** ISO time of the newest update, from <updated> */
	lastUpdate: string;
	/** The newest step word; "Resolved" or "Postmortem" means closed */
	status: string;
	resolved: boolean;
	updates: IncidentUpdate[];
}

/** Read Statuspage's history.atom. Returns incidents newest-update first, exactly as the feed states them. */
export function parseAtom(xml: string): Incident[] {
	const out: Incident[] = [];
	const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
	for (const e of entries) {
		const pick = (tag: string) => (e.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`)) ?? [])[1]?.trim() ?? '';
		const title = clean(decodeEntities(pick('title')));
		const url = (e.match(/<link[^>]*href="([^"]+)"/) ?? [])[1] ?? '';
		const content = decodeEntities(pick('content'));
		// Each update is one <p>: <small>Oct 17, 07:46 UTC</small><br><strong>Update</strong> - text
		const updates: IncidentUpdate[] = [];
		for (const p of content.match(/<p>[\s\S]*?<\/p>/g) ?? []) {
			const at = clean((p.match(/<small>([\s\S]*?)<\/small>/) ?? [])[1] ?? '');
			const status = clean((p.match(/<strong>([\s\S]*?)<\/strong>/) ?? [])[1] ?? '');
			const body = clean(p.replace(/<small>[\s\S]*?<\/small>/, '').replace(/<strong>[\s\S]*?<\/strong>/, '')).replace(/^-\s*/, '');
			if (status || body) updates.push({ status, at, text: body });
		}
		const status = updates[0]?.status ?? '';
		out.push({
			title,
			url,
			opened: pick('published'),
			lastUpdate: pick('updated'),
			status,
			resolved: /^(resolved|postmortem|completed)$/i.test(status),
			updates,
		});
	}
	// Newest update first (the feed is roughly ordered, but not strictly: a reopened incident keeps its place).
	return out.sort((a, b) => (a.lastUpdate < b.lastUpdate ? 1 : -1));
}

export interface ComponentState {
	name: string;
	/** Statuspage's state word as the page shows it */
	status: string;
}

/** Statuspage's five component states, exactly as the page prints them (case matters: the page legend prints
 *  "Major outage" / "Partial outage" in lower case, and those must NOT be read as components). */
const STATE_LINES = new Set(['Operational', 'Degraded Performance', 'Partial Outage', 'Major Outage', 'Under Maintenance']);

/**
 * Read component states from the status page. Live check 2026-10-21 (server 1.16.0): the markup guess in 1.16.0 read
 * nothing on all three pages, so this reads the page the way a person does: the rendered text, where every component
 * is a line with its name followed by a line with its state ("Withdrawals" / "Major Outage"). The list sits after the
 * uptime link and before the legend; a state word is never a name, which keeps the legend out. A group header
 * ("Cryptocurrency Services" / "Major Outage") is kept as a component too, which is how the page shows it.
 * Returns null when no name/state pair was found, so a changed page is reported, never shown as "all fine".
 */
export function parseComponents(html: string): ComponentState[] | null {
	const lines = htmlToText(html)
		.split('\n')
		.map((l) => l.replace(/\s+/g, ' ').trim())
		.filter(Boolean);
	const from = lines.findIndex((l) => /View historical uptime/i.test(l));
	const scan = from >= 0 ? lines.slice(from + 1) : lines;
	const out: ComponentState[] = [];
	for (let i = 0; i + 1 < scan.length; i++) {
		const name = scan[i];
		const status = scan[i + 1];
		if (STATE_LINES.has(status) && !STATE_LINES.has(name) && name.length <= 80 && !/^[#\-]/.test(name) && !/\(http/.test(name)) {
			out.push({ name, status });
			i++;
		}
	}
	return out.length ? out : null;
}

/** The banner at the top of the page ("All Systems Operational", "Partial System Outage", ...), when present. */
export function parseBanner(html: string): string | null {
	const m = html.match(/class="page-status[^"]*"[\s\S]*?<span class="status[^"]*">([\s\S]*?)<\/span>/);
	return m ? clean(decodeEntities(m[1])) : null;
}

const MAX_HOPS = 3;
/** GET one path on a status page, following up to 3 redirects that stay on the same host (nothing else is followed). */
async function getOnHost(base: URL, path: string, ctx?: ExecutionContext) {
	let url = new URL(path, base);
	for (let hop = 0; ; hop++) {
		const r = await politeFetch([url.toString()], '', { method: 'GET' }, { ttlSec: CACHE_SEC, ctx, startAt: 0, returnRedirects: true });
		if (r.status < 300 || r.status >= 400) return r;
		if (hop >= MAX_HOPS) throw new UpstreamError(`${base.host} redirected more than ${MAX_HOPS} times`);
		if (!r.location) throw new UpstreamError(`${base.host} redirected without saying where`);
		const next = new URL(r.location, url);
		if (next.host !== base.host) throw new UpstreamError(`${base.host} redirected to ${next.host}, which this tool does not follow`);
		url = next;
	}
}

async function readPage(key: StatusPage, ctx?: ExecutionContext) {
	const page = STATUS_PAGES[key];
	const base = new URL(page.url);
	if (!(await robotsAllows(new URL('/history.atom', base), ctx)) || !(await robotsAllows(base, ctx)))
		throw new UpstreamError(`${base.host} asks automated tools not to read these pages (robots.txt), so nothing was read`);
	const readAt = new Date().toISOString();
	const [atom, home] = await Promise.all([getOnHost(base, '/history.atom', ctx), getOnHost(base, '/', ctx)]);
	if (atom.status !== 200) throw new UpstreamError(`${base.host}/history.atom answered HTTP ${atom.status}`);
	const incidents = parseAtom(atom.text);
	const components = home.status === 200 ? parseComponents(home.text) : null;
	const banner = home.status === 200 ? parseBanner(home.text) : null;
	return { page, readAt, incidents, components, banner, homeStatus: home.status };
}

function ok(data: unknown, source: string[], readAt: string, note?: string): Result {
	const text = [JSON.stringify(data, null, 2), '', `Source: ${source.join(' ; ')}`, `Read at: ${readAt}`, note ? `Note: ${note}` : ''].filter((x) => x !== '').join('\n');
	return { content: [{ type: 'text', text }] };
}
function fail(e: unknown, hint: string): Result {
	const msg = (e instanceof UpstreamError ? e.message : 'unexpected error').replace(/\.+$/, '');
	return { isError: true, content: [{ type: 'text', text: `Could not complete: ${msg}. ${hint}` }] };
}

const SAY_IT_STRAIGHT =
	'Report exactly what the page says, with its time stamps. The pages do not state causes; if the user asks why, say the cause is not stated on the official page and that other explanations are unconfirmed. Time stamps inside updates are UTC with no year; opened/lastUpdate are full ISO times.';

export function registerStatusTool(register: Register, ctx?: ExecutionContext) {
	register(
		'metallicus_status',
		{
			title: 'Metallicus status pages (live)',
			description:
				'Is something down? Reads the three official Metallicus status pages live: XPR Network (WebAuth, Metal X, bridge, deposits, withdrawals, explorer, Metal Blockchain), Metal Pay, and Metal L2. view "now": the banner, every component that is not Operational, and every open incident with its update history, each in the page\'s own words and time stamps. view "history": the incident feed (open and resolved) for the last weeks, so repeat problems can be counted. Reads the pages\' own Atom feed and HTML, never the API their robots.txt closes. Read-only. Use this before answering any "is X down / paused / delayed" question, and quote the page rather than guessing a cause.',
			inputSchema: z.object({
				page: z.enum(['all', 'xpr', 'metalpay', 'metal_l2']).default('all').describe('Which status page; "all" reads the three'),
				view: z.enum(['now', 'history']).default('now').describe('"now" = current state and open incidents; "history" = the incident feed including resolved ones'),
				limit: z.number().int().min(1).max(50).default(15).describe('history: how many incidents to list'),
			}),
			annotations: { title: 'Metallicus status', ...RO },
		},
		async ({ page, view, limit }: { page: 'all' | StatusPage; view: 'now' | 'history'; limit: number }) => {
			const keys: StatusPage[] = page === 'all' ? (Object.keys(STATUS_PAGES) as StatusPage[]) : [page];
			const results: any[] = [];
			const sources: string[] = [];
			const problems: string[] = [];
			let readAt = new Date().toISOString();
			for (const k of keys) {
				try {
					const r = await readPage(k, ctx);
					readAt = r.readAt;
					sources.push(`${r.page.url}/history.atom`, r.page.url);
					const open = r.incidents.filter((i) => !i.resolved);
					const notOk = r.components?.filter((c) => c.status !== 'Operational') ?? null;
					const item: any = { page: r.page.name, url: r.page.url, covers: r.page.covers };
					if (view === 'now') {
						item.banner = r.banner ?? 'no banner (the page shows one only when every component is Operational)';
						item.componentsNotOperational = notOk ?? 'component list could not be read from the page (its layout may have changed; open the page to see component states)';
						item.componentsOperational = r.components ? r.components.length - (notOk?.length ?? 0) : null;
						item.openIncidents = open.map((i) => ({ title: i.title, status: i.status, opened: i.opened, lastUpdate: i.lastUpdate, url: i.url, updates: i.updates }));
						if (!open.length) item.openIncidents = 'none in the feed';
					} else {
						item.incidents = r.incidents.slice(0, limit).map((i) => ({ title: i.title, status: i.status, resolved: i.resolved, opened: i.opened, lastUpdate: i.lastUpdate, url: i.url, updates: i.updates }));
						item.listed = Math.min(limit, r.incidents.length);
						item.inFeed = r.incidents.length;
					}
					results.push(item);
				} catch (e) {
					if (keys.length === 1) return fail(e, 'The person can open the page directly.');
					problems.push(`${STATUS_PAGES[k].name}: ${e instanceof UpstreamError ? e.message : 'could not be read'}`);
				}
			}
			if (!results.length) return fail(new UpstreamError(problems.join('; ') || 'no page could be read'), 'The person can open the pages directly.');
			const data: any = { pages: results };
			if (problems.length) data.notRead = problems;
			return ok(data, sources, readAt, SAY_IT_STRAIGHT);
		},
	);
}
