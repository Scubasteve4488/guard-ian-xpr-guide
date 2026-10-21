// paycheck.ts — xpr_account_check: "Who am I about to pay?" Added 1.18.0 (builder, 2026-10-21: "The only question I see
// people having when it comes to transactions is: is this platform that's requesting the transaction safe? Is this wallet
// safe? Who am I sending this to? Who owns this wallet? ... they see a service that charges 1,000 XPR ... Is the service
// legitimate? Is the website legitimate?").
//
// What it does: for ONE account the person names (the one they are about to pay), it gathers the public facts a careful
// person would check, in GUARD.IAN's report shape — what can be verified, what deserves attention, what cannot be
// verified, what to confirm. It never says "safe" and never says "scam": it shows the record and names the gaps.
//
// SOURCES (each read live on every call; nothing from memory):
// - get_account (chain.ts account()): creation date → age; permission structure → who else can sign for it.
// - get_code_hash / get_abi (access.ts rules): is it a deployed contract; and isPublicAccount's classification
//   (system / exchange / block producer / contract / registered XPR Agent / private person).
// - eosio.proton::usersinfo (dev skill webauth-identity.md @ b7d9f1f, "Profile Table Structure"): `kyc` is a list of
//   {kyc_provider, kyc_level} where kyc_level is a COMMA-SEPARATED CLAIM LIST, never a number ("Don't parseInt");
//   `verified` is an opt-in display checkmark set by a verifier, independent of KYC; `name` is a self-chosen display
//   name (third-party text). An ID-document claim = frontofid / backofid / nationalidnumber.
// - blocklist::blocklist (ABI read 2026-10-21: actions adduser/removeuser/pausebl, table blocklist row type
//   blocklists): is THIS account on the network blocklist. The server never lists blocklist rows (RULES), but the person
//   named this account themselves, so a yes/no about it is theirs to have.
// - XPR Agents indexer /api/agents/<account> (ecosystem.ts source): registered agent record — trust score, jobs,
//   earnings, registered date, the indexer's own kyc_level.
// - The guide's host directory (sources.ts ALLOWED_HOSTS) for the optional website check: listed / not listed, and a
//   look-alike warning when the host contains an official brand name but is not that site.
// SOURCE (hand-built code): none found upstream that composes these; each read is upstream's own endpoint.
//
// Privacy: the person's own named account is shown (RULES 7: "unless the user gave it to you"). Every OTHER account that
// appears (controllers in the permission tree) passes the usual filter: public ones named, people's wallets hidden.
// Balances and transaction history are NOT read here for private accounts (that stays behind the public-account gate).

import { z } from 'zod';
import { isAccountName, account as readAccount } from './chain.ts';
import { rpc, getJson, UpstreamError } from './net.ts';
import { makeKeep, maskName, producerNames } from './history.ts';
import { ALLOWED_HOSTS } from './sources.ts';

type Handler = (args: any) => Promise<any>;
type Register = (name: string, config: unknown, handler: Handler) => unknown;
type Result = { isError?: boolean; content: Array<{ type: 'text'; text: string }> };
const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } as const;

const AGENTS = 'https://indexer.xpragents.com/api';
const CACHE_SEC = 120;

/** Official brand hosts (ECOSYSTEM.md §1): a host that merely CONTAINS one of these brand words is a look-alike, not the site. */
export const OFFICIAL_SITES: Array<{ brand: string; hosts: string[] }> = [
	{ brand: 'webauth', hosts: ['webauth.com'] },
	{ brand: 'xprnetwork', hosts: ['xprnetwork.org', 'docs.xprnetwork.org', 'help.xprnetwork.org', 'explorer.xprnetwork.org', 'gov.xprnetwork.org', 'status.xprnetwork.org', 'nft.xprnetwork.org'] },
	{ brand: 'metallicus', hosts: ['metallicus.com'] },
	{ brand: 'metalx', hosts: ['metalx.com', 'docs.metalx.com', 'lending.docs.metalx.com'] },
	{ brand: 'metalpay', hosts: ['metalpay.com', 'status.metalpay.com', 'help.metalpay.com'] },
	{ brand: 'metaldollar', hosts: ['metaldollar.com'] },
	{ brand: 'metalblockchain', hosts: ['metalblockchain.org', 'docs.metalblockchain.org'] },
	{ brand: 'metall2', hosts: ['metall2.com', 'status.metall2.com'] },
	{ brand: 'simpledex', hosts: ['simpledex.fun'] },
	{ brand: 'xpragents', hosts: ['xpragents.com', 'indexer.xpragents.com'] },
	{ brand: 'protonnz', hosts: ['protonnz.com'] },
];

const norm = (h: string) => h.toLowerCase().replace(/^www\./, '');

export interface SiteCheck {
	host: string;
	listedInGuide: boolean;
	official: string | null; // the official host it IS, when exact
	looksLike: string | null; // the brand it resembles without being it
	note: string;
}

/** The website check: exact official site, listed community site, look-alike of an official brand, or unknown. */
export function checkSite(raw: string): SiteCheck | { error: string } {
	let u: URL;
	try {
		u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
	} catch {
		return { error: 'not a web address' };
	}
	const host = norm(u.hostname);
	if (!host.includes('.')) return { error: 'not a public web address' };
	const exact = OFFICIAL_SITES.find((s) => s.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
	if (exact) return { host, listedInGuide: true, official: host, looksLike: null, note: `${host} is an official ${exact.brand === 'protonnz' ? 'Proton NZ' : 'Metallicus / XPR Network'} site listed in the guide.` };
	const squeezed = host.replace(/[^a-z0-9]/g, '');
	const lookalike = OFFICIAL_SITES.find((s) => squeezed.includes(s.brand));
	const listed = ALLOWED_HOSTS.has(host) || [...ALLOWED_HOSTS].some((h) => host.endsWith(`.${h}`));
	if (lookalike)
		return { host, listedInGuide: listed, official: null, looksLike: lookalike.hosts[0], note: `${host} contains "${lookalike.brand}" but is NOT ${lookalike.hosts[0]}. The official site is ${lookalike.hosts[0]}; a name that looks like it is the oldest trick there is.` };
	if (listed) return { host, listedInGuide: true, official: null, looksLike: null, note: `${host} is a community site listed in the guide (not Metallicus). Being listed means the guide knows the site, not that any offer on it is good.` };
	return { host, listedInGuide: false, official: null, looksLike: null, note: `${host} is not in the guide's directory. Unlisted is not a verdict; it means nothing here vouches for it.` };
}

/** KYC claims across providers (webauth-identity.md: split kyc_level on commas; never parseInt). */
export function kycClaims(row: any): string[] {
	const kyc = Array.isArray(row?.kyc) ? row.kyc : [];
	return kyc.flatMap((k: any) => String(k?.kyc_level ?? '').split(',').map((c: string) => c.trim()).filter(Boolean));
}

export function identitySummary(row: any) {
	if (!row) return { profileFound: false, kycRecord: false, kycClaims: 0, idDocument: false, verifiedCheckmark: false, displayName: null as string | null, kycDate: null as string | null, kycProvider: null as string | null };
	const claims = kycClaims(row);
	const providers = Array.isArray(row.kyc) ? [...new Set(row.kyc.map((k: any) => String(k?.kyc_provider ?? '')).filter(Boolean))] : [];
	const dates = Array.isArray(row.kyc) ? row.kyc.map((k: any) => Number(k?.kyc_date)).filter((n: number) => Number.isFinite(n) && n > 0) : [];
	return {
		profileFound: true,
		kycRecord: claims.length > 0,
		kycClaims: claims.length,
		idDocument: claims.some((c) => /frontofid|backofid|nationalidnumber/.test(c)),
		verifiedCheckmark: row.verified === true,
		displayName: typeof row.name === 'string' && row.name ? row.name.slice(0, 60) : null,
		kycDate: dates.length ? new Date(Math.max(...dates) * 1000).toISOString() : null,
		kycProvider: providers.length ? (providers as string[]).join(', ') : null,
	};
}

export function ageDays(created: string, now = new Date()): number | null {
	const d = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(created) ? created : `${created}Z`);
	return Number.isNaN(d.getTime()) ? null : Math.floor((now.getTime() - d.getTime()) / 86_400_000);
}

export function parseAmount(s?: string): { amount: number; symbol: string } | null {
	if (!s) return null;
	const m = s.trim().match(/^([\d,]+(?:\.\d+)?)\s*([A-Z]{1,7})?$/i);
	if (!m) return null;
	const n = Number(m[1].replace(/,/g, ''));
	return Number.isFinite(n) ? { amount: n, symbol: (m[2] ?? 'XPR').toUpperCase() } : null;
}

export interface Classification {
	pub: boolean;
	why: string;
}

/** Build the report from facts already read (pure, tested). */
export function buildReport(input: {
	account: string;
	acct: any; // chain.ts account().data or null when it does not exist
	cls: Classification;
	identity: ReturnType<typeof identitySummary>;
	blocklisted: boolean | null;
	agent: any | null; // indexer record or null
	site: SiteCheck | { error: string } | null;
	amount: { amount: number; symbol: string } | null;
	keep: Set<string>;
	now?: Date;
}) {
	const now = input.now ?? new Date();
	const verified: string[] = [];
	const attention: string[] = [];
	const cannot: string[] = [];
	const confirm: string[] = [];
	const a = input.acct;
	if (!a) {
		return {
			account: input.account,
			exists: false,
			whatICanVerify: [`The account "${input.account}" does not exist on XPR Network mainnet right now.`],
			whatDeservesAttention: ['A payment to a name that does not exist cannot go through; a name one letter away from a real one might. Check the spelling the site shows you against what you typed.'],
			whatICannotVerify: ['Anything about who asked you to pay this name.'],
			whatToConfirm: ['Ask the seller for the exact account name in writing and read it back letter for letter in WebAuth before sending.'],
		};
	}
	const days = ageDays(a.created, now);
	verified.push(`Account exists; created ${a.created}${days !== null ? ` (${days} days ago)` : ''}.`);
	verified.push(`On chain it is ${input.cls.why}.`);
	if (days !== null && days < 30) attention.push(`The account is ${days} days old. New is not bad, but a brand-new account asking for money has no record to check.`);

	// who can sign for it
	const ctrl = new Set<string>();
	for (const p of a.permissions ?? []) for (const x of p.accounts ?? []) ctrl.add(String(x).split('@')[0]);
	ctrl.delete(input.account);
	if (ctrl.size) {
		const shown = [...ctrl].map((n) => maskName(n, input.keep));
		verified.push(`Other accounts can sign for it: ${shown.join(', ')}.`);
		if (!input.cls.pub) attention.push('Another account controls this one. For a person\'s wallet that can be normal (a recovery setup) or a sign it is not what it seems; for a business it should be explained.');
	} else verified.push('No other account is set to sign for it (only its own keys).');

	// identity
	const id = input.identity;
	if (!id.profileFound) {
		verified.push('No WebAuth profile row (eosio.proton usersinfo): no display name, no KYC record published for this account.');
		attention.push('Metallicus has not recorded identity verification (KYC) for this account. Many legitimate accounts have none; a seller asking for money usually has one.');
	} else {
		if (id.kycRecord) verified.push(`Identity verification (KYC) recorded: ${id.kycClaims} claim${id.kycClaims === 1 ? '' : 's'} from ${id.kycProvider ?? 'a provider'}${id.kycDate ? `, latest ${id.kycDate.slice(0, 10)}` : ''}${id.idDocument ? ', including a government ID document' : ', without an ID-document claim'}.`);
		else {
			verified.push('WebAuth profile exists but carries no KYC record.');
			attention.push('No identity verification (KYC) on this account. Many legitimate accounts have none; a seller asking for money usually has one.');
		}
		verified.push(id.verifiedCheckmark ? 'Shows WebAuth\'s verified checkmark (a display flag set by a verifier account; it is separate from KYC).' : 'No WebAuth verified checkmark (most KYC\'d accounts do not have one either; it is opt-in).');
		if (id.displayName) verified.push(`Self-chosen display name: "${id.displayName}" (anyone can set any name; it proves nothing).`);
	}
	cannot.push('WHO the verified person or company is: KYC proves Metallicus checked a real identity, not that the identity matches the seller you are talking to.');

	// blocklist
	if (input.blocklisted === true) {
		verified.push('This account IS on the XPR Network blocklist (contract `blocklist`).');
		attention.push('Being on the network blocklist is the strongest on-chain warning that exists. Do not send anything until you understand why it is there.');
	} else if (input.blocklisted === false) verified.push('Not on the XPR Network blocklist (contract `blocklist`).');
	else cannot.push('Whether it is on the network blocklist: that read failed this time.');

	// XPR Agents
	if (input.agent) {
		const g = input.agent;
		verified.push(
			`Registered on XPR Agents: trust score ${g.trust_score ?? '?'}, ${g.completed_jobs ?? 0} completed of ${g.total_jobs ?? 0} jobs, ${typeof g.earnings === 'number' ? (g.earnings / 10_000).toLocaleString('en-US') : '?'} XPR earned on the board, registered ${g.registered_at ? new Date(g.registered_at * 1000).toISOString().slice(0, 10) : '?'}${g.active === 1 || g.active === true ? ', active' : ', not active'}.`,
		);
		confirm.push('If you are buying this agent\'s service, pay THROUGH xpragents.com (the buy:<id> memo creates an escrow job) and not by a plain transfer: escrow holds the money until you accept the work.');
	} else if (input.cls.why.includes('Agent')) verified.push('Registered in the agentcore contract, but the XPR Agents indexer had no record to show.');

	// website
	if (input.site && !('error' in input.site)) {
		verified.push(input.site.note);
		if (input.site.looksLike) attention.push(`The website name resembles ${input.site.looksLike} without being it. Type the official address yourself instead of following the link.`);
		if (!input.site.listedInGuide && !input.site.looksLike) cannot.push('Whether the website is run by the account you are paying: nothing on chain links a domain to an account.');
	} else if (input.site && 'error' in input.site) cannot.push(`The website: ${input.site.error}.`);

	// amount
	if (input.amount) {
		verified.push(`You said the price is ${input.amount.amount.toLocaleString('en-US')} ${input.amount.symbol}.`);
		confirm.push(`Before approving, read the amount and the token in the WebAuth request itself: it must say ${input.amount.amount.toLocaleString('en-US')} ${input.amount.symbol} to ${input.account}, nothing else and nothing extra in the same request.`);
	} else confirm.push('Read the amount, the token and the receiving account inside the WebAuth request itself before approving; a request can carry more than one action.');

	cannot.push('Whether the service or product will be delivered, or is worth the price. The chain records payments, not promises.');
	cannot.push('Anything said off chain: chat messages, screenshots, reviews on the seller\'s own page.');
	confirm.push(`The account name letter for letter: "${input.account}" (XPR names are 12 characters or fewer, lowercase a–z and 1–5; "l" and "1" look alike).`);
	confirm.push('A small first payment if the seller accepts one. A refund promise is only as good as the record above.');
	if (!input.cls.pub) confirm.push('Who is behind the account: ask the seller to show the same name in their WebAuth profile or on their official page, and check the official page address yourself (the guide lists them).');

	return { account: input.account, exists: true, whatICanVerify: verified, whatDeservesAttention: attention.length ? attention : ['Nothing in the on-chain record stood out. That is a record, not a guarantee.'], whatICannotVerify: cannot, whatToConfirm: confirm };
}

async function readIdentity(account: string, ctx?: ExecutionContext) {
	const r = await rpc('/v1/chain/get_table_rows', { code: 'eosio.proton', scope: 'eosio.proton', table: 'usersinfo', json: true, limit: 1, lower_bound: account, upper_bound: account }, CACHE_SEC, ctx);
	const row = (r.json?.rows ?? []).find((x: any) => x?.acc === account) ?? null;
	return { row, source: r.source };
}

async function readBlocklisted(account: string, ctx?: ExecutionContext): Promise<{ listed: boolean | null; source: string | null }> {
	try {
		const r = await rpc('/v1/chain/get_table_rows', { code: 'blocklist', scope: 'blocklist', table: 'blocklist', json: true, limit: 1, lower_bound: account, upper_bound: account }, CACHE_SEC, ctx);
		const rows: any[] = r.json?.rows ?? [];
		const listed = rows.some((x) => Object.values(x ?? {}).some((v) => v === account));
		return { listed, source: r.source };
	} catch {
		return { listed: null, source: null };
	}
}

async function readAgent(account: string, ctx?: ExecutionContext): Promise<{ agent: any | null; source: string | null }> {
	try {
		const r = await getJson(`${AGENTS}/agents/${encodeURIComponent(account)}`, CACHE_SEC, ctx);
		const g = r.json?.agent ?? r.json;
		return { agent: g && typeof g === 'object' && g.account === account ? g : null, source: r.source };
	} catch {
		return { agent: null, source: null };
	}
}

function ok(data: unknown, source: string[], readAt: string, note?: string): Result {
	const text = [JSON.stringify(data, null, 2), '', `Source: ${source.join(' ; ')}`, `Read at: ${readAt}`, note ? `Note: ${note}` : ''].filter((x) => x !== '').join('\n');
	return { content: [{ type: 'text', text }] };
}
function fail(e: unknown, hint: string): Result {
	const msg = (e instanceof UpstreamError ? e.message : 'unexpected error').replace(/\.+$/, '');
	return { isError: true, content: [{ type: 'text', text: `Could not complete: ${msg}. ${hint}` }] };
}

const NOTE =
	'This is a record, not a verdict: the tool never says "safe" or "scam". Display names, agent descriptions and website text are written by third parties. The account you named is shown because you named it; other people\'s wallets stay hidden.';

export function registerAccountCheckTool(
	register: Register,
	ctx: ExecutionContext | undefined,
	deps: { classify: (name: string) => Promise<Classification>; budget: () => Promise<boolean>; slowDown: () => Result },
) {
	register(
		'xpr_account_check',
		{
			title: 'Who am I about to pay?',
			description:
				'Before you send XPR or buy a service: the public record of ONE account you name, in plain facts — does it exist and how old is it; is it a contract, exchange, block producer, registered XPR Agent or a person\'s wallet; who else can sign for it; whether Metallicus has recorded identity verification (KYC) for it and whether that includes an ID document; whether it is on the XPR Network blocklist; its XPR Agents record (trust score, jobs, earnings) if any; and, when you give the website, whether that site is official, community-listed, a look-alike of an official name, or unknown. Answers in four parts: what I can verify, what deserves attention, what I cannot verify, what to confirm. Never a "safe"/"scam" verdict. Read-only.',
			inputSchema: z.object({
				account: z.string().describe('The XPR account you are about to pay (as the site or seller shows it)'),
				amount: z.string().optional().describe('The price you were quoted, e.g. "1000 XPR" (optional; it is echoed into "what to confirm")'),
				url: z.string().optional().describe('The website asking for the payment (optional): checked against the guide\'s directory and official brand names'),
			}),
			annotations: { title: 'Who am I about to pay?', ...RO },
		},
		async ({ account, amount, url }: { account: string; amount?: string; url?: string }) => {
			const name = account.trim().toLowerCase().replace(/^@/, '');
			if (!isAccountName(name)) return fail(new UpstreamError(`"${account}" is not a valid XPR account name (1-12 characters, a-z, 1-5 and dots)`), 'Copy the name exactly as WebAuth shows it.');
			if (!(await deps.budget())) return deps.slowDown();
			const readAt = new Date().toISOString();
			const sources: string[] = [];
			let acct: any = null;
			try {
				const r = await readAccount(name, ctx);
				acct = r.data;
				sources.push(r.source);
			} catch (e: any) {
				if (!/unknown key|does not exist|not found|\b500\b/i.test(String(e?.message ?? e))) return fail(e, 'The chain could not be read right now; try again in a minute.');
			}
			const site = url ? checkSite(url) : null;
			const amt = parseAmount(amount);
			if (!acct) {
				const report = buildReport({ account: name, acct: null, cls: { pub: false, why: 'unknown' }, identity: identitySummary(null), blocklisted: null, agent: null, site, amount: amt, keep: new Set() });
				return ok(report, sources.length ? sources : ['XPR Network RPC (get_account)'], readAt, NOTE);
			}
			const [cls, idr, bl, ag, producers] = await Promise.all([deps.classify(name), readIdentity(name, ctx), readBlocklisted(name, ctx), readAgent(name, ctx), producerNames(ctx)]);
			sources.push(idr.source);
			if (bl.source) sources.push(bl.source);
			if (ag.source) sources.push(ag.source);
			const keep = makeKeep([name], producers);
			const report = buildReport({ account: name, acct, cls, identity: identitySummary(idr.row), blocklisted: bl.listed, agent: ag.agent, site, amount: amt, keep });
			return ok(report, [...new Set(sources)], readAt, NOTE);
		},
	);
}
