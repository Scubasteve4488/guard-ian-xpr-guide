// Unit tests: node --experimental-strip-types test/unit.test.ts  (no network: fetch is stubbed)
import { readFileSync } from 'node:fs';
import { isAccountName, isSymbol, nameToU64, safeName } from '../src/chain.ts';
import { checkSourceUrl, htmlToText, extractLinks, isPublicHostname, fetchSource, guideLinks } from '../src/sources.ts';
import { parseRobotsTxt, isPathAllowed } from '../src/robots.ts';
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

// ── self-updating allow-list: hosts come from the guide's own links (operator ruling 2026-10-15)
const guideText = ['llms.txt', 'ECOSYSTEM.md', 'SOURCES.md', 'RULES.md', 'KSTO.md', 'README.md', 'CHANGELOG.md']
	.map((f) => readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8'))
	.join('\n');
const links = extractLinks(guideText);
t('guide links extracted (100+ hosts)', links.hosts.size >= 100);
t('guide links include official sites the floor list missed', ['webauth.com', 'explorer.xprnetwork.org', 'gov.xprnetwork.org', 'app.metalx.com'].every((h) => links.hosts.has(h)));
t('webauth.com refused without guide links', !checkSourceUrl('https://webauth.com/').ok);
t('webauth.com allowed with guide links', checkSourceUrl('https://webauth.com/', links).ok);
t('www variant of a linked host allowed', checkSourceUrl('https://www.webauth.com/', links).ok);
t('unlisted real-looking host refused', !checkSourceUrl('https://notlisted-site.com/', links).ok);
t('social site refused even if linked', !checkSourceUrl('https://x.com/XPRNetwork', links).ok && !checkSourceUrl('https://www.reddit.com/r/ProtonChain', links).ok && !checkSourceUrl('https://t.me/XPRNetwork', links).ok);
t('github owner linked in the guide allowed', checkSourceUrl('https://github.com/idosal/git-mcp', links).ok);
t('unlinked github owner still refused', !checkSourceUrl('https://github.com/randomuser/x', links).ok);
const evil = extractLinks('see https://127.0.0.1/x and https://localhost/a and https://metadata.internal/ and https://10.0.0.1/');
t('IPs and internal names never become sources', evil.hosts.size === 0 && !checkSourceUrl('https://127.0.0.1/', evil).ok);
t('public hostname check', isPublicHostname('webauth.com') && !isPublicHostname('localhost') && !isPublicHostname('192.168.1.1') && !isPublicHostname('[::1]') && !isPublicHostname('box.local'));
t('trailing punctuation trimmed from links', extractLinks('Read https://simpledex.fun/llms.txt.').hosts.has('simpledex.fun'));

// ── robots.txt (adapted from GitMCP)
const rb = parseRobotsTxt('User-agent: *\nDisallow: /private # staff only\nAllow: /private/open\n\nUser-agent: XPRAgent\nDisallow: /no-agents\n');
t('robots: our own group wins over *', !isPathAllowed(rb, '/no-agents/x') && isPathAllowed(rb, '/private/x'));
const rb2 = parseRobotsTxt('User-agent: *\nDisallow: /private # staff only\nAllow: /private/open\n');
t('robots: * disallow applies, inline comment stripped', !isPathAllowed(rb2, '/private/x') && isPathAllowed(rb2, '/public'));
t('robots: Allow beats Disallow', isPathAllowed(rb2, '/private/open/page'));
t('robots: no group for us and no * means allowed (RFC 9309)', isPathAllowed(parseRobotsTxt('User-agent: GPTBot\nDisallow: /\n'), '/x'));
t('robots: Disallow / blocks everything', !isPathAllowed(parseRobotsTxt('User-agent: *\nDisallow: /\n'), '/x'));
t('robots: empty Disallow allows', isPathAllowed(parseRobotsTxt('User-agent: *\nDisallow:\n'), '/x'));

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

// source_fetch: robots.txt, redirects re-checked on every hop
const lk = extractLinks('https://webauth.com/ https://help.webauth.com/ https://simpledex.fun/');
stub((url) => {
	if (url.endsWith('/robots.txt')) return url.includes('help.webauth.com') ? new Response('User-agent: *\nDisallow: /secret\n', { status: 200 }) : new Response('nf', { status: 404 });
	if (url === 'https://webauth.com/') return new Response('', { status: 301, headers: { Location: 'https://help.webauth.com/start' } });
	if (url === 'https://help.webauth.com/start') return new Response('<html><body><p>WebAuth help page</p></body></html>', { status: 200 });
	if (url === 'https://help.webauth.com/away') return new Response('', { status: 302, headers: { Location: 'https://elsewhere-unlisted.com/' } });
	if (url === 'https://simpledex.fun/loop') return new Response('', { status: 302, headers: { Location: '/loop' } });
	return new Response('nope', { status: 404 });
});
const fs1 = await fetchSource('https://webauth.com/', undefined, lk);
t('redirect to a listed host is followed', fs1.text.includes('WebAuth help page') && fs1.source === 'https://help.webauth.com/start');
let refused = '';
try { await fetchSource('https://help.webauth.com/secret/x', undefined, lk); } catch (e: any) { refused = e.message; }
t('robots.txt disallow is obeyed', refused.includes('robots.txt'));
refused = '';
try { await fetchSource('https://help.webauth.com/away', undefined, lk); } catch (e: any) { refused = e.message; }
t('redirect off the guide is refused', refused.includes('elsewhere-unlisted.com') && refused.includes('refused'));
refused = '';
try { await fetchSource('https://simpledex.fun/loop', undefined, lk); } catch (e: any) { refused = e.message; }
t('redirect loop stops', refused.includes('more than 3'));

// guideLinks reads the guide files live and survives a failed file
stub((url) => (url.endsWith('/ECOSYSTEM.md') ? new Response('New project: https://brand-new-project.io/app', { status: 200 }) : new Response('x', { status: 500 })));
const gl = await guideLinks('o/r', 'main');
t('a project added to the guide becomes fetchable', gl.hosts.has('brand-new-project.io') && checkSourceUrl('https://brand-new-project.io/app', gl).ok);

globalThis.fetch = realFetch;
console.log(`${pass} passed, ${failN} failed`);
if (failN) process.exit(1);
