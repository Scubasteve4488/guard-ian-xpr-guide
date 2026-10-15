// Unit tests: node --experimental-strip-types test/unit.test.ts  (no network: fetch is stubbed)
import { readFileSync } from 'node:fs';
import { isAccountName, isSymbol, nameToU64, safeName } from '../src/chain.ts';
import { checkSourceUrl, htmlToText } from '../src/sources.ts';
import { splitSections, searchSections, tokenize } from '../src/guide.ts';
import { registryLookup, tokenCheck } from '../src/tokens.ts';
import { politeFetch } from '../src/net.ts';

let pass = 0,
	failN = 0;
function t(name: string, cond: boolean) {
	if (cond) pass++;
	else {
		failN++;
		console.log('FAIL', name);
	}
}

// ── names and symbols
t('account ok', isAccountName('protonnz') && isAccountName('xmd.token') && isAccountName('333555'));
t('account bad', !isAccountName('ProtonNZ') && !isAccountName('toolongname123') && !isAccountName('abc.') && !isAccountName('a6') && !isAccountName(''));
t('symbol', isSymbol('XBTC') && !isSymbol('xbtc') && !isSymbol('TOOLONGX') && !isSymbol('X1'));
// rpc-queries.md:216 — "333555" encodes to u64 1785205097907617792
t('nameToU64 doc example', nameToU64('333555') === '1785205097907617792');
t('safeName leaves letters', safeName('simplelaunch') === 'simplelaunch' && safeName('333555') === '1785205097907617792');

// ── source allow-list
t('allow official', checkSourceUrl('https://simpledex.fun/llms-launches.txt').ok);
t('allow catalogued github owner', checkSourceUrl('https://raw.githubusercontent.com/XPRNetwork/xpr-network-dev-skill/main/skill/simpledex.md').ok);
t('refuse other github owner', !checkSourceUrl('https://raw.githubusercontent.com/randomuser/x/main/a.md').ok);
t('refuse unknown host', !checkSourceUrl('https://evil.example.com/').ok);
t('refuse http', !checkSourceUrl('http://simpledex.fun/llms.txt').ok);
t('refuse credentials', !checkSourceUrl('https://u:p@simpledex.fun/').ok);
t('refuse odd port', !checkSourceUrl('https://simpledex.fun:8443/').ok);
t('refuse lookalike host', !checkSourceUrl('https://simpledex.fun.evil.com/').ok);

// ── html to text
const h = htmlToText('<html><head><style>x{}</style><script>alert(1)</script></head><body><h2>Title</h2><p>Hello <a href="https://a.b/c">link</a></p></body></html>');
t('html strips script', !h.includes('alert') && !h.includes('x{}'));
t('html keeps text + link', h.includes('## Title') && h.includes('Hello') && h.includes('(https://a.b/c)'));

// ── guide search over the real files in this repo
const files = ['llms.txt', 'ECOSYSTEM.md', 'SOURCES.md', 'RULES.md', 'KSTO.md'];
const sections = files.flatMap((f) => splitSections(f, readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8')));
t('sections parsed', sections.length > 30);
const vib = searchSections(sections, 'What is Vibrr?');
t('search finds Vibrr in ECOSYSTEM', vib.length > 0 && vib[0].file === 'ECOSYSTEM.md' && vib[0].text.includes('vibrr.ai'));
const xmd = searchSections(sections, 'XMD contract');
t('search finds XMD contract', xmd.some((s) => s.text.includes('xmd.token')));
const ksto = searchSections(sections, 'KSTO vetted tokens');
t('search finds vetted tokens', ksto.some((s) => s.text.includes('SNIPPY')));
t('tokenize drops stop words', tokenize('What is the XPR Network LOAN protocol?').join(',') === 'loan,protocol');
t('no wallet name in guide files', !files.some((f) => /\bscubasteve44\b/.test(readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8'))));

// ── registry
t('registry exact', registryLookup('XBTC', 'xtokens').exact?.precision === 8);
t('registry other contract', registryLookup('XBTC', 'fakexbtc').exact === null && registryLookup('XBTC', 'fakexbtc').sameSymbol.length === 1);

// ── network behaviour with a stubbed fetch
const realFetch = globalThis.fetch;
const calls: string[] = [];
function stub(handler: (url: string, init?: any) => Response) {
	globalThis.fetch = (async (input: any, init?: any) => {
		const url = typeof input === 'string' ? input : input.url;
		calls.push(url);
		return handler(url, init);
	}) as any;
}

// 403 on the first host must not be retried on that host; next host answers.
calls.length = 0;
stub((url) => (url.startsWith('https://a.test') ? new Response('banned', { status: 403 }) : new Response('{"ok":1}', { status: 200 })));
const r1 = await politeFetch(['https://a.test', 'https://b.test'], '/x', {}, { startAt: 0 });
t('403 rotates to next host', r1.source === 'https://b.test/x' && calls.filter((c) => c.startsWith('https://a.test')).length === 1);

// every request carries the User-Agent (rpc-queries.md:72)
let ua = '';
stub((_url, init) => {
	ua = init?.headers?.['User-Agent'] || '';
	return new Response('{}', { status: 200 });
});
await politeFetch(['https://c.test'], '/y', {}, { startAt: 0 });
t('user agent set', ua.startsWith('XPRAgent/guard-ian-guide'));

// tokenCheck: lookalike XBTC on another contract
stub((url, init) => {
	if (url.endsWith('/v1/chain/get_currency_stats')) {
		const b = JSON.parse(init.body);
		return Response.json(b.code === 'fakexbtc' ? { XBTC: { supply: '21000000.00000000 XBTC', max_supply: '21000000.00000000 XBTC', issuer: 'someone' } } : {});
	}
	if (url.includes('metalx.com')) return Response.json({ data: [{ symbol: 'XBTC_XMD', bid_token: { code: 'XBTC', contract: 'xtokens' } }] });
	if (url.includes('alcor.exchange')) return Response.json({ symbol: 'XBTC', contract: 'fakexbtc', is_scam: true });
	return new Response('nope', { status: 404 });
});
const tc = await tokenCheck('XBTC', 'fakexbtc');
t('token check says not the registry token', tc.facts.some((f) => f.startsWith('NOT the registry')));
t('token check reports on-chain supply', tc.facts.some((f) => f.includes('issuer someone')));
t('token check: Metal X does not list it', tc.facts.some((f) => f.includes('does not include XBTC@fakexbtc')));
t('token check reports Alcor flag as Alcor\'s', tc.facts.some((f) => f.includes('is_scam=true') && f.includes("Alcor's own labels")));
t('token check never says safe', !JSON.stringify(tc).toLowerCase().includes('safe'));
const tc2 = await tokenCheck('XBTC', 'xtokens');
t('real XBTC is in registry and on Metal X', tc2.facts.some((f) => f.startsWith('In XPR')) && tc2.facts.some((f) => f.startsWith('Metal X lists')));

// private-repo mode: token goes only to api.github.com, never into the answer
let authHost = '', authHeader = '';
stub((url, init) => {
	if (init?.headers?.Authorization) { authHost = new URL(url).host; authHeader = init.headers.Authorization; }
	return new Response('# hello', { status: 200 });
});
const { readGuideFile } = await import('../src/guide.ts');
const g = await readGuideFile('o/r', 'main', 'RULES.md', undefined, 'tok123');
t('private mode uses GitHub API with token', authHost === 'api.github.com' && authHeader === 'Bearer tok123');
t('private mode answer has no token', !JSON.stringify(g).includes('tok123') && g.source === 'https://github.com/o/r/blob/main/RULES.md');

globalThis.fetch = realFetch;
console.log(`${pass} passed, ${failN} failed`);
if (failN) process.exit(1);
