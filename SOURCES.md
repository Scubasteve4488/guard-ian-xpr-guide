# Source catalog: XPR Network, Metallicus, KSTO and the wider crypto world

Part of the GUARD.IAN XPR Guide (community-built, not official). Every source here is allowed; its **tier** decides how a fact from it is worded. Dates are when the page was read.

Publisher key and how to read:
Publisher key: **OFFICIAL-M** = Metallicus Inc. · **OFFICIAL-X** = XPR Network (Metallicus-run site/org) · **COMMUNITY-BP** = a block producer / independent builder · **COMMUNITY** = community project · **PRESS** = media / data aggregator.
"How to read": RSS = fetch the feed; SITEMAP = diff the URL list; PAGE = web_fetch the page and read the dated list; API = JSON; GH = GitHub API (`/users/<org>/repos?sort=pushed`, `/repos/<o>/<r>/commits?per_page=1`).

## 0. Update 2026-10-02 — added and corrected (all loaded and dated that day)

**Added, machine-readable (check these first in the daily read):**
- Metallicus `https://metallicus.com/llms.txt` (product map) · Metal Pay `https://www.metalpay.com/sitemap.xml` (lastmod) · Metal X `https://docs.metalx.com/llms.txt` + `sitemap-pages.xml`.
- WebAuth SDK `https://github.com/XPRNetwork/proton-web-sdk/releases.atom` (v5.1.0, 2026-09-17; still the latest, re-read 2026-10-18) · npm `https://registry.npmjs.org/@proton%2fweb-sdk`. WebAuth has NO docs/help site (help/docs/support.webauth.com don't resolve; webauth.com is an app page).
- MetalGo `https://github.com/MetalBlockchain/metalgo/releases.atom` (v1.14.2-tahoe, 2026-09-22; still the latest, re-read 2026-10-18) · PulseVM `https://github.com/MetalBlockchain/pulsevm/commits/main.atom` + `/tags.atom` (v1.0.0 is a TAG, no release; tag dated 2026-10-13, re-read 2026-10-18) · pulse-cutover `https://github.com/paulgnz/pulse-cutover/releases.atom` (main at 1c4613e, 2026-10-20 11:20 UTC: v0.5.0-rc.33 pins; the cutover now moves XPR to a **new chain_id**, a decision dated 2026-10-19 in the commits, with the chain_id as replay protection across the cut (docs/EXCHANGES.md §2b); README still says "Status: proposed — community project… not an official Metallicus product and not an announced migration plan"; whether rc.33 is published as a GitHub release was not checked; read 2026-10-20; ~~v0.5.0-rc.32, 2026-10-16~~ superseded 2026-10-20; ~~rc.20, 2026-10-01~~ superseded 2026-10-18) · pulsevm.dev `/llms.txt` + `/sitemap.xml` (COMMUNITY — Paul Grey).
- XPR GitHub: xpr-network-dev-skill `releases.atom` (v2.12.0, 2026-10-16: XPR Agents module updated for sdk 0.5.2 / openclaw 0.8.7; v2.11.0 removed the liquidation how-to and added Network Etiquette; read 2026-10-18; ~~v2.9.0~~ superseded 2026-10-18) · xpr-agents `releases.atom` + commits (HEAD 3b7370f, 2026-10-19: October 2026 audit fixes, npm `@xpr-agents/openclaw` 0.9.2 and `@xpr-agents/sdk` 0.5.3; latest GitHub release still v2026.09.17; read 2026-10-19; ~~HEAD a7410e9, openclaw 0.9.1~~ superseded 2026-10-19; ~~HEAD 69adfab, 0.8.8 signing limits~~ superseded 2026-10-18) · proton-cli · proton.contracts.
- SimpleDEX: `simpledex.fun/llms*.txt` — store version line AND a content hash (launches says v1.11 but the server changed it 2026-10-01; still headed "v1.11 · 2026-05-12" on 2026-10-18 while its body now gives the 120 s creator window) · `https://indexer.protonnz.com/api/stats` · `https://protonnz.com/feed.xml` (RSS).
- XPR Agents: `https://xpragents.com/llms.txt` (no version line — hash it) · `https://indexer.xpragents.com/api/stats`.
- Chain: `get_producer_schedule` (21 in the active schedule, re-read 2026-10-18, schedule version 1426; 104 registered, 10-15 figure) + each producer's bp.json.

**Corrections:** drop `t.me/s/xprannouncements` (last post 2023-08-22; source not readable 2026-10-18: the guide connector does not open Telegram). `t.me/XPRNetwork`, `t.me/MetalBlockchain`, `t.me/metallicus` are groups with no public preview — unreadable. YouTube feeds for XPR channels returned 404 — skip. `xprnetwork.org/consortium` is 404 (still 404, 2026-10-18). `help.metalpay.com` blocks scripts.

## 1. Metallicus (corporate)

| Source | URL | Covers | Publisher | Update rate | How to read |
|---|---|---|---|---|---|
| Metallicus home | https://metallicus.com | Product catalogue: institutions (stablecoins, identity, custody/wallets, Metal Pay Enterprise/Connect, FedNow), individuals (Metal Pay, Metal X, WebAuth, Metal Dollar), developer platforms (Metal Blockchain, XPR Network, Metal L2) | OFFICIAL-M | as products change | PAGE |
| Newsroom | https://metallicus.com/news | Press releases + quarterly CEO reports; 80+ items back to 2022-08 | OFFICIAL-M | ~1–3 items/month in 2026 | PAGE (no RSS found; `?format=rss` returns HTML). SITEMAP https://metallicus.com/sitemap.xml (131 URLs, 67 under /blog/, no lastmod) — new /blog/ slug = new item |
| Quarterly reports | https://metallicus.com/blog/metallicus---2026-q1-report · …/metallicus---2026-q2-report | CEO's quarterly summary of products, partners, compliance, next-half focus | OFFICIAL-M (by Marshall Hayner) | quarterly, published 1–3 months after quarter end | PAGE |
| Leadership | https://metallicus.com/company/meet-the-team | Executives + advisory board | OFFICIAL-M | rare | PAGE |
| CEO profile | https://metallicus.com/company/marshall-hayner | Marshall Hayner bio | OFFICIAL-M | rare | PAGE |
| Marshall Hayner on X | https://x.com/MarshallHayner | CEO's public posts (policy, product previews) | the CEO personally | daily | not machine-readable without X API; quote only what a fetched post says |
| Marshall Hayner LinkedIn | https://www.linkedin.com/in/marshallhayner/ | career, posts | the CEO personally | irregular | login wall — treat as UNREADABLE |
| Metallicus TDBN on X | https://x.com/MetallicusTDBN | corporate posts ("The Digital Banking Network") | OFFICIAL-M | daily | as above (handle seen in a community recap, 2026-09-21; verify before citing; source not readable 2026-10-18: X is not fetched) |
| Whitepapers | https://metallicus.com/company/whitepapers ; Metal L2 WP https://metallicus.com/metal-l2-whitepaper.pdf | design documents | OFFICIAL-M | rare | PDF |
| Metal Pay | https://metallicus.com (Individuals → Metal Pay); on-ramp https://onramp.metalpay.com | fiat on-ramp app | OFFICIAL-M | — | PAGE |
| Metal Dollar | https://metaldollar.com | XMD: basket-backed stablecoin index, chains, live treasury composition, newsroom list | OFFICIAL-M / Metal DAO | newsroom + live treasury | PAGE |

## 2. XPR Network

| Source | URL | Covers | Publisher | Update rate | How to read |
|---|---|---|---|---|---|
| Home | https://xprnetwork.org | positioning, links hub | OFFICIAL-X | — | PAGE |
| Roadmap | https://xprnetwork.org/roadmap | "In development" vs "core development" items, no dates except mainnet May 2020 | OFFICIAL-X | page stamp 2026-09-23; re-read 2026-10-18, same items ("2025 and beyond", WebAuth Fiat Ramp "In development"); the stamp is not in the fetched text | PAGE |
| Blog | https://xprnetwork.org/blog | guides + announcements (e.g. Introducing XPR Agents, staking guide, DappRadar as BP) | OFFICIAL-X | irregular; list shows no dates | PAGE + SITEMAP https://xprnetwork.org/sitemap_en.xml (index at /sitemap.xml; no RSS found) |
| Developer docs | https://docs.xprnetwork.org | getting started, tutorials, CLI, Web SDK, client SDKs, contract SDK | OFFICIAL-X | as edited | PAGE (already covered by the dev skill) |
| Explorer | https://explorer.xprnetwork.org | accounts, tx, producers, tokens | OFFICIAL-X | live | PAGE; for facts prefer the chain tools |
| Help centre | https://help.xprnetwork.org/hc/en-us | user support articles | OFFICIAL-X | as edited | PAGE |
| Governance portal | https://gov.xprnetwork.org | governance / voting UI | OFFICIAL-X | live | JS app — PAGE fetch returned only a title; use chain reads (`eosio` producers table) instead |
| Bounties | https://github.com/XPRNetwork/bounties | **program archived:** the last commit (2026-09-01) is "Archive bounty program and remove stale listings" (read 2026-10-18). ~~open developer bounties~~ superseded 2026-10-18 | OFFICIAL-X | last push 2026-09-01 | GH |
| Grant framework | https://github.com/XPRNetwork/grant-framework | how grants work | OFFICIAL-X | rare | GH |
| X | https://x.com/XPRNetwork | official announcements | OFFICIAL-X | daily | X |
| Telegram (community) | https://t.me/XPRNetwork | main chat; announcements pinned; admins never DM | OFFICIAL-X | live | Telegram public preview https://t.me/s/XPRNetwork where enabled |
| Telegram (announcements, legacy name) | https://t.me/s/xprannouncements | announcement channel (older "Proton" name) | OFFICIAL-X | irregular | public preview page |
| Whitepaper | https://xprnetwork.org/whitepaper | protocol design | OFFICIAL-X | rare | PAGE |

## 3. Products and ecosystem sites

| Source | URL | Covers | Publisher | Update rate | How to read |
|---|---|---|---|---|---|
| WebAuth | https://webauth.com ; https://metallicus.com/individuals/webauth ; https://xprnetwork.org/wallet | self-custody passkey/biometric wallet, multi-chain | OFFICIAL-M | app releases | PAGE (webauth.com is a JS shell — fetch the metallicus page instead); App Store id1594500069, Play `com.metallicus.webauth` |
| Metal X | https://metalx.com ; app https://app.metalx.com ; docs https://docs.metalx.com ; API https://api.dex.docs.metalx.com | on-chain order-book DEX, swaps, lending, LP, bridge, fiat ramp; operator Metallicus Inc. (NMLS 2057807 as read 2026-09-28; the ID was not shown on metallicus.com product pages on 2026-10-15, so check NMLS Consumer Access before citing it) | OFFICIAL-M | live | PAGE / API |
| XPR Agents | https://xpragents.com ; https://xpragents.com/llms.txt ; indexer https://indexer.xpragents.com/api | agent registry, escrow job board, reputation; contracts agentcore/agentfeed/agentvalid/agentescrow | OFFICIAL-X (repo XPRNetwork/xpr-agents, MIT) | llms.txt reflects contracts as of 2026-09-02 (unchanged, re-read 2026-10-18) | llms.txt + API (already covered by the xpr-agents skill) |
| SimpleDEX | https://simpledex.fun ; https://simpledex.fun/llms.txt (+ llms-trading/-launches/-reference/-analytics/-setup/-testnet/-full) | AMM + bonding-curve launches; analytics API https://indexer.protonnz.com | COMMUNITY-BP (Proton NZ, Paul Grey) | versions stamped in each file | llms.txt (already covered) |
| Proton NZ | https://protonnz.com ; blog https://protonnz.com/blog | BP "protonnz"; 14 projects (SimpleDEX, XPR Tax, Private Transactions, XPR Agents, Shellbook…); incident write-ups | COMMUNITY-BP (Paul Grey, also Metallicus BD manager and XPR Consortium member per his site) | several posts/month in Aug–Sep 2026 | **RSS https://protonnz.com/feed.xml** (verified RSS 2.0) |
| Private Transactions | https://private.protonnz.com | confidential transfers, contract `xprconf` | COMMUNITY-BP | — | PAGE + chain |
| Shellbook | https://shellbook.io ; repo github.com/paulgnz/shellbook | social network for AI agents, XPR identity | COMMUNITY-BP (Paul Grey) | live | PAGE; agents have shellbook tools in the xpr-agents runner |
| Charlie Bot | https://charliebot.dev ; blog https://blog.charliebot.dev ; x402 https://x402.charliebot.dev ; X @charliebot87 ; GH charliebot87 | autonomous OpenClaw agent on XPR (account `charliebot`): machine payments (x402/MPP), receipts, CHARLIE token | COMMUNITY (agent, with Paul Grey) | irregular | PAGE / GH |
| PulseVM | https://pulsevm.dev ; repo MetalBlockchain/pulsevm ; docs repo paulgnz/pulsevm-docs | Antelope account/contract model on Metal Blockchain — the "A-Chain" XPR is moving to | OFFICIAL-M code; site built from Paul Grey's docs repo | active (daily commits Sep 2026) | PAGE + GH |
| KSTO | https://ksto.world ; X @Keep_Snipping ; Telegram KSTOX | KSTO community token, staking, governance, "Vetted Tokens" list; operated by Mimi Mesh, LLC | COMMUNITY | irregular | PAGE |

## 4. Metal Blockchain, Metal L2, Metal DAO

| Source | URL | Covers | Publisher | Update rate | How to read |
|---|---|---|---|---|---|
| Metal Blockchain | https://metalblockchain.org | Layer-0 for institutions: A-Chain (Antelope), C-Chain (EVM), P-Chain (validators/subnets), X-Chain (assets) | OFFICIAL-M | — | PAGE |
| Metal Blockchain news | https://www.metalblockchain.org/blog | news & insights (latest: "BTCVM, LTCVM and DogecoinVM Are Now in Alpha Testing on Metal Blockchain", 2026-09-29, read 2026-10-18; ~~latest seen: BitcoinVM, 2026-02-06~~ superseded 2026-10-18) | OFFICIAL-M | slow in 2026 | PAGE |
| Metal Blockchain docs | https://docs.metalblockchain.org | node, subnets, staking | OFFICIAL-M | as edited | PAGE |
| Metal Blockchain explorer | https://explorer.metalblockchain.org | chain data | OFFICIAL-M | live | PAGE |
| Metal L2 | https://metall2.com ; news https://metall2.com/news-insights ; explorer https://explorer.metall2.com ; bridge https://bridge.metall2.com | Ethereum L2 (OP Stack today) moving to a Metal Blockchain subnet | OFFICIAL-M | a few posts/yr | PAGE |
| MIP-002 Homecoming | https://metalhomecoming.com | Metal DAO proposal: Metal L2 → Metal Blockchain subnet, MTL as gas, XMD multichain | Metal DAO / Metallicus | — | PAGE |

## 5. GitHub — what is being built (pushes re-read 2026-10-18; first read 2026-09-28)

| Org / user | URL | What recent pushes show |
|---|---|---|
| XPRNetwork | https://github.com/XPRNetwork | 2026-10-18: proton-resources (10-17), xpr-agents and xpr-network-dev-skill (both 10-16), proton.contracts (10-06), vert (10-02), proton-web-sdk (09-17), bounties (09-01, archived), proton-cli (08-28) |
| XPRNetwork | https://github.com/XPRNetwork | ~~xpr-network-dev-skill and xpr-agents (both pushed 2026-09-28), proton.contracts (09-24), vert test library, proton-web-sdk, bounties, proton-cli (08-28), xpr-loan-liquidation-bot~~ superseded 2026-10-18 (read 2026-09-28) |
| MetalBlockchain | https://github.com/MetalBlockchain | 2026-10-18: pulsevm (10-16; v1.0.0 tag 10-13), hyperion-rs and pulsevm-js (10-14), dogecoin-vm (10-12), btc-vm (09-27), metalgo (09-22), libevm (09-18), pulse-cdt-rust (08-12), mtl-migration-public (07-20) |
| MetalBlockchain | https://github.com/MetalBlockchain | ~~pulsevm (09-24), hyperion-rs (Rust Hyperion, 09-28), btc-vm and dogecoin-vm (09-27), metalgo node, libevm, pulse-cdt-rust, pulsevm-js, mtl-migration-public (07-20)~~ superseded 2026-10-18 (read 2026-09-28) |
| paulgnz (Paul Grey) | https://github.com/paulgnz | 2026-10-18: pulse-cutover (10-16, v0.5.0-rc.32), a pulsevm fork (10-15), dogecoin-vm-wallet (10-02), metalgo-setup (09-27), bridge-operator and btcvm (09-26), pulsevm-docs (09-24), pulse-cli-ts (09-23), pulse-privacy (09-22) |
| paulgnz (Paul Grey) | https://github.com/paulgnz | ~~pulse-cutover ("Antelope→PulseVM cutover agent", rehearsed against XPR testnet state), pulse-cli-ts, pulse-privacy, btcvm, bridge-operator, metalgo-setup, dogecoin-vm-wallet, pulsevm-docs — all pushed 2026-09-22…09-29~~ superseded 2026-10-18 (read 2026-09-28) |
| charliebot87 | https://github.com/charliebot87 | mpp-xpr, x402-demo, xpr-account-trust-cli (09-09; unchanged, re-read 2026-10-18) |
| "metallicus" | https://github.com/metallicus | **NOT Metallicus** — an unrelated user (a 2013 OpenCV fork). Never cite it. |

## 6. Market data and press

| Source | URL | Notes |
|---|---|---|
| CoinGecko XPR | https://www.coingecko.com/en/coins/xpr-network | price/supply; API `api.coingecko.com/api/v3/coins/xpr-network` |
| CoinMarketCap XPR | coinmarketcap.com/currencies/proton (named, not fetched: its terms forbid crawling, checked 2026-10-15) | CMC slug is still "proton"; its "CMC AI" update pages are machine summaries — not a source |
| CoinGecko MTL | https://www.coingecko.com/en/coins/metal-dao | Metal DAO token |
| CoinMarketCap MTL | coinmarketcap.com/currencies/metal (named, not fetched) | |
| CoinGecko XMD | https://www.coingecko.com/en/coins/metal-dollar | |
| AMBCrypto, 2026-09-13 | https://ambcrypto.com/xpr-network-suffers-9m-proton-swaps-exploit-can-confidence-recover/ | proton.swaps exploit coverage (numbers differ from the primary post-mortem — prefer protonnz.com) |
| KuCoin news "Metallicus Weekly Recap" | e.g. https://www.kucoin.com/news/insight/BTC/6ab9c40874fd460007c5c49e | **community-written** recaps republished by KuCoin; a lead, never a source |
| CoinDesk, 2025-09-10 | https://www.coindesk.com/business/2025/09/10/minnesota-credit-union-to-launch-stablecoin-claims-to-be-first-in-u-s | St. Cloud Financial CU stablecoin with Metallicus |
| American Banker | https://www.americanbanker.com/payments/news/minnesota-credit-union-is-launching-its-own-stablecoin | same story; paywalled |
| CU Today | https://www.cutoday.info/Fresh-Today/Metallicus-InvestiFi-Partner-To-Bring-Stablecoin-Capabilities-Directly-Into-Credit-Union-and-Community-Bank-Apps | InvestiFi alliance |

## Reliability rules for this map
1. Chain beats every page. Official beats community; community beats press; aggregator AI summaries are never sources.
2. When two sources disagree, say both and name them (example: the proton.swaps drain is "~2.1B XPR" in the Proton NZ post-mortem and "1.56B XPR" in some press).
3. A handle or URL that only appears in a community post is UNVERIFIED until fetched from the official site.

---

## 7. Wider sources: press, data, regulators, credit unions, community (read 2026-10-15)

**How each tier is worded in an answer:**

| Tier | How the guide words it |
|---|---|
| PRIMARY-RECORD (government, court, registry, a partner's own announcement) | State what the record says. Name the agency, the document number and the date. |
| OFFICIAL (Metallicus / XPR's own pages) | "Metallicus says…" |
| PR-WIRE (company-written release, reposted) | "A press release from <company> says…" — the company's claim, not a fact. |
| PRESS | "<Outlet> reported on <date> that…" |
| RESEARCH (regulators' research, VCs, research firms) | Context only: "The BIS said in a 2026-08-28 speech…". Never an XPR fact on its own. |
| DATA | Cite the page and the time read. Never merge numbers from two sites; they disagree (see 7f). |
| COMMUNITY-LEAD | Check it against a higher tier first. Never cite it alone. |
| NOT-A-SOURCE | Read only to see what is circulating. Never quote it as fact. |

**Name-collision filter (these produce wrong hits):**
- XRP (Ripple) is not XPR.
- ProtonMail / Proton AG (the Swiss privacy company) is not Proton chain.
- Metallica (the band) is not Metallicus.
- Metallus Inc. (SEC, steel, CIK 1598428) is not Metallicus.
- METALLICUS LIMITED (UK furniture, dissolved 2017) is not Metallicus.
- `github.com/metallicus` is not the company.
- Old slugs still in use for XPR: "proton" on Messari, Decrypt, Coinbase and CMC.
- Keyword set for news filters: "XPR Network", "Metallicus", "Metal Blockchain", "Metal Pay", "WebAuth", "XMD", "proton.swaps". Exclude XRP and ProtonMail.

### 7a. Major crypto press, data and regulators

| # | Source | XPR / Metallicus coverage (evidence, date) | How to read | Tier |
|---|---|---|---|---|
| 1 | CoinDesk https://www.coindesk.com | Yes, light: Metal L2 on the OP Superchain (coindesk.com/tech/2024/05/09/protocol-village); the St. Cloud CU stablecoin (2025-09-10, §6) | RSS `coindesk.com/arc/outboundfeeds/rss/?outputType=xml` (UNVERIFIED) | PRESS |
| 2 | The Block https://www.theblock.co | Yes, archival (2020 items) | RSS `theblock.co/rss.xml` (confirmed) | PRESS |
| 3 | Blockworks https://blockworks.com | Yes: interview with the Metallicus founder, "Crypto's problems were 'avoidable'" (date UNVERIFIED) | `blockworks.com/feed` (UNVERIFIED) | PRESS |
| 4 | Decrypt https://decrypt.co | Yes (2019–2021 items); price page `/price/proton` | `decrypt.co/feed` (UNVERIFIED) | PRESS |
| 5 | The Defiant https://thedefiant.io | No XPR coverage found. Useful for general DeFi context | RSS UNVERIFIED | PRESS |
| 6 | Protos https://protos.com | No XPR coverage found. Useful for scam and investigation patterns | `protos.com/feed/` (UNVERIFIED) | PRESS |
| 7 | Messari https://messari.io | Profile `messari.io/project/proton` (+ `/project/proton-loan`), search result only | API; free tier UNVERIFIED | RESEARCH / DATA |
| 8 | a16z crypto https://a16zcrypto.com | No XPR coverage found. Industry and policy context (State of Crypto) | page | RESEARCH |
| 9 | Electric Capital https://www.developerreport.com | No XPR on the homepage. Open data at github.com/electric-capital/crypto-ecosystems; whether XPR is listed is UNVERIFIED | GitHub | RESEARCH |
| 10 | Ethereum Foundation Blog https://blog.ethereum.org | No XPR coverage. Marginal: Metal L2 is OP Stack on Ethereum | RSS `blog.ethereum.org/en/feed.xml` (confirmed) | RESEARCH |
| 11 | Chainalysis Blog https://www.chainalysis.com/blog | No XPR coverage. Drainers, scam typologies, stablecoin regulation | RSS `chainalysis.com/feed/` (UNVERIFIED) | RESEARCH |
| 12 | DefiLlama https://defillama.com | **Yes, strong:** `defillama.com/chain/xpr-network` showed TVL $51.58M on 10-15 (MetalX $50.78M, Alcor $465K, SimpleDEX $180K). Hacks DB: no proton.swaps entry | free API `api.llama.fi` | DATA |
| 13 | Dune https://dune.com | No XPR found (no Antelope chain named; the full catalog was not fetched) | page / API (paid tiers) | DATA |
| 14 | Glassnode https://glassnode.com | **No XPR.** Supported chains are BTC, ETH, SOL, TRX, BNB, DOGE, ARB, TON and XRP | paid API | DATA |
| 15 | Coin Metrics https://coinmetrics.io | No XPR found (full list UNVERIFIED) | free Community API | DATA |
| 16 | Token Terminal https://tokenterminal.com | Not in the top 50; below that UNVERIFIED | paid API | DATA |
| 17 | CoinGecko Research https://www.coingecko.com/research | Coin pages yes: XPR, XMD, LOAN, Metal X. No XPR research report found | Atom feed on `/research` (confirmed); API | DATA / RESEARCH |
| 18 | SEC https://www.sec.gov | Metallicus filings UNVERIFIED (EDGAR search blocked; do not claim either way) | RSS `sec.gov/news/pressreleases.rss` (confirmed); EDGAR full-text search | PRIMARY-RECORD |
| 19 | CFTC https://www.cftc.gov | No XPR. Tokenized-collateral guidance cites the GENIUS Act (cftc.gov/csl/25-39/download, 2025-12-08) | RSS `cftc.gov/RSS/RSSGP/rssgp.xml` (confirmed) | PRIMARY-RECORD |
| 20 | BIS https://www.bis.org | No XPR. Stablecoins vs tokenised deposits speech (bis.org/speeches/20260828-…, 2026-08-28), relevant to Metallicus's CU pitch | RSS `bis.org/doclist/bis_fsi_publs.rss` (confirmed) | RESEARCH (official sector) |

### 7e. Added 2026-10-16: regulators, betting odds, reference data (each loaded and its robots.txt and terms read 2026-10-15/16)

| # | Source | XPR / Metallicus coverage (evidence, date) | How to read | Tier |
|---|---|---|---|---|
| 21 | Polymarket https://polymarket.com (agent guide https://polymarket.com/llms.txt; data https://gamma-api.polymarket.com/public-search?q=XPR) | **No market about XPR, Metallicus, Metal Pay or DogecoinVM** (searched 2026-10-15). Only quote a market that is actually about the ecosystem | public read-only data; its own llms.txt invites agents and says never present a price as a fixed fact | **ODDS: crowd betting odds, not facts and not forecasts. Never advice. polymarket.com is not open to US residents (they use Polymarket US); many countries are blocked or close-only. Never point anyone to trading** |
| 22 | FDIC https://www.fdic.gov + BankFind https://api.fdic.gov/banks/institutions | Metallicus is not a bank (BankFind "Metallicus": 0, 2026-10-15, as expected). Use it to check whether a named bank partner is FDIC-insured | free JSON API | REGULATOR. Never imply the FDIC endorses Metallicus |
| 23 | Federal Reserve https://www.federalreserve.gov/supervisionreg.htm | No Metallicus item found. Supervision letters on bank crypto activity, context for the bank/credit-union business | page | REGULATOR |
| 24 | OCC https://www.occ.gov | No Metallicus item found. Interpretive letters on bank crypto custody and stablecoins; charter decisions | page; cite letter number + date | REGULATOR |
| 25 | FinCEN https://www.fincen.gov | Metallicus / Metal Pay money-services registration **unverified** (the registrant search is a form a person has to run) | page | REGULATOR |
| 26 | ESMA MiCA register https://www.esma.europa.eu | No white paper or licensed provider for XPR Network or Metallicus (weekly CSVs, last update 2026-10-07, read 2026-10-15) | CSV files, weekly | REGULATOR (EU) |
| 27 | SEC EDGAR full-text search https://efts.sec.gov/LATEST/search-index?q=%22Metallicus%22 | No filing by or about Metallicus; the only hits are a passing mention in an unrelated company's filings (2026-10-15). Never quote a private person's biography | free JSON API (SEC asks for a contact User-Agent) | PRIMARY-RECORD |
| 28 | Federal Register https://www.federalregister.gov/api/v1/documents.json?conditions[term]=Metallicus | 0 documents mention Metallicus (2026-10-15). Dated federal rules on stablecoins and bank/credit-union crypto | free JSON API | PRIMARY-RECORD |
| 29 | Kaiko reference data https://reference-data-api.kaiko.io/v1/assets | Lists XPR as "Proton" with the BNB Chain address; `mtl` there is an unrelated older "Metal" token (a name trap) | free reference data only; market data is paid and may not be passed on | DATA (reference only; the chain wins) |
| 30 | Santiment https://api.santiment.net/graphql | Lists XPR as "Proton", meaning the Ethereum ERC-20 copy, not XPR Network's own chain | project names only; its terms limit data to private use, so don't quote its metrics | DATA (low value) |

**Named, never fetched** (a person can open them; the connector doesn't read them):
- **Terms ban AI or automated use:** Etherscan (etherscan.io) and BscScan (bscscan.com). XPR's token addresses on those chains are on-chain facts; read them from the chain. Also CoinMarketCap (coinmarketcap.com), Artemis, Nansen, Tokenomist / Token Unlocks (which has no XPR page anyway).
- **robots.txt refuses all bots:** Reuters and Bloomberg (Bloomberg blocks Anthropic's crawlers by name).
- **Cloudflare blocks every automated read:** CryptoRank, FATF (fatf-gafi.org) and NMLS Consumer Access (state money-transmitter licences, the Metal Pay angle). For FATF, cite a named publication with its date. For NMLS, a person runs the search and the guide cites the dated result.

### 7b. Credit-union, banking and fintech sources (often report Metallicus partnerships before or beside Metallicus)

| Source | Evidence naming Metallicus (date) | How to read | Tier |
|---|---|---|---|
| CUInsight https://www.cuinsight.com | Daland (2025-08-05), Cornerstone League (2025-10-10), FedNow RfP certification (2026-02-25) | `cuinsight.com/feed` (UNVERIFIED) | PR-WIRE |
| CU Broadcast https://www.cubroadcast.com | Stablecoin pilot (2025-06-16); TechOME25 interview with Metallicus execs (2025-10-05); GAC 2026 studio lounge sponsor | `cubroadcast.com/2/feed` (UNVERIFIED) | PRESS (episodes) / PR-WIRE (reposts) |
| Credit Union Times https://www.cutimes.com | 2025 Luminaries finalists page (2025-08-28; fetch blocked) | UNVERIFIED | PRESS |
| CreditUnions.com (Callahan) | St. Cloud feature (2026-05-11) | page | PRESS |
| CU Today https://www.cutoday.info | Metallicus + InvestiFi (§6) | page | PRESS |
| PYMNTS https://www.pymnts.com | Velera Digital Asset Lab, Metallicus first platform partner (2025-08-20) | page | PRESS |
| Retail Banker International | Payfinia deal (2025-02-26) | page | PRESS |
| Fintech Futures | Payfinia release (2025-02-25) | page | PR-WIRE |
| American Banker https://www.americanbanker.com | St. Cloud stablecoin (§6) | paywalled | PRESS |
| Co-operative News (UK) https://www.thenews.coop | St. Cloud "Cloud Dollar" (2025-09-12), four days before Metallicus's own post | page | PRESS |
| CUSO Magazine https://cusomag.com | NCUA vs America's Credit Unions on the stablecoin rule (2026-04-14) | page | PRESS |
| GEO https://geo.coop | Critical opinion on crypto firms courting CUs (2025-09-13) | page | COMMUNITY-LEAD |
| Business Wire https://www.businesswire.com | Payfinia (2025-02-25); Metal Pay API (2022-09-20) | page | PR-WIRE |
| ACCESS Newswire https://www.accessnewswire.com | CrossState pilot with 50 CUs (2026-05-14); MD\|DC CU Association (2025-05-07) | page | PR-WIRE |
| Newswire.com | CrossState (2026-05-14); newsroom `newswire.com/newsroom/metallicus` (UNVERIFIED) | page | PR-WIRE |
| Velera (CUSO) https://www.velera.com | 2025 release named Metallicus. | page | PRIMARY-RECORD |
| GoWest Association | Metallicus listed as a CUSO partner (gowestassociation.org/partner/metallicus/) | page | PRIMARY-RECORD |
| Doeren Mayhew | Metallicus acquires Bonifii (2025-01-03); "Metal CUSO" | page | PRESS |
| Arizona Tech Council | OneAZ CU joins (2024-06-13) | page | PRESS |
| Federal Reserve FedNow Innovator Exchange https://www.frbservices.org | Metallicus / Metal Pay listing (frbservices.org/?p=18354). The certified service-provider list is not checked | page | PRIMARY-RECORD |
| NCUA / govinfo https://www.govinfo.gov | Proposed rule on CU-owned stablecoin issuers, FR 2026-02868 (2026-02-12). Final rule status UNVERIFIED | Federal Register | PRIMARY-RECORD |
| America's Credit Unions https://www.americascreditunions.org | NCUA comment letter (2026-07-20); runs TechOME | page | PRIMARY-RECORD |
| Cornerstone League https://www.cornerstoneleague.coop | NCUA stablecoin statement (2026-05-20) | page | PRIMARY-RECORD |
| Not found naming Metallicus (still allowed) | Finextra, Payments Dive, Banking Dive, Bank Automation News, Tearsheet, Finovate, BAI, ABA Banking Journal, The Financial Brand, Filene, PR Newswire, GlobeNewswire, ICBA, Money20/20, Consensus | — | — |

### 7d. Crypto press, Antelope, community and data

| Source | Evidence (date) | How to read | Tier |
|---|---|---|---|
| Yellow.com https://yellow.com | proton.swaps exploit write-up (2026-09-14) | page | PRESS |
| Benzinga https://www.benzinga.com | price filler naming Metallicus (2026-10-07) | page | COMMUNITY-LEAD |
| Cointelegraph https://cointelegraph.com | old Metal Pay items only; tag page UNVERIFIED | page | PRESS |
| CryptoSlate, U.Today, CoinGape, ZyCrypto | coin page / 2020 archive only | page | NOT-A-SOURCE for current facts (archive OK) |
| BeInCrypto price prediction | template page with "$0.00" placeholders | — | NOT-A-SOURCE |
| crypto.news, Bitcoinist, NewsBTC, CryptoPotato, The Crypto Basic, Bitcoin.com News | only XRP / ProtonMail hits | — | UNVERIFIED |
| Coinbase price page | "0 news articles" | — | NOT-A-SOURCE |
| imToken Security Monthly | support.token.im, report #51 (2026-09-24): fake "Vaulta conversion" account stealing XPR | monthly page | PRESS (security) |
| AntelopeIO/spring https://github.com/AntelopeIO/spring/releases | v1.2.2 Latest; v2.0.0-dev1.3 | `releases.atom` | OFFICIAL (node software XPR runs) |
| EOS Network / Vaulta blog https://eosnetwork.com | Spring releases | page | COMMUNITY-LEAD |
| WAX Sweden https://waxsweden.org/tag/antelope | Antelope security patch (2023) | page | COMMUNITY-BP |
| protonnz "State of XPR BPs" | protonnz.com/blog/state-of-xpr-block-producers (2026-09-08): protonnz is the only producer with a blog | `protonnz.com/feed.xml` | COMMUNITY-BP |
| protonnz YouTube | `youtube.com/feeds/videos.xml?channel_id=UCqNT7sTd-T9MQ-6UaIYDQFQ` | RSS | COMMUNITY-BP |
| Saltant (BP) | medium.com/@saltantxpr (2025-03-07); runs a Hyperion endpoint | Medium | COMMUNITY-BP |
| Alvosec (BP) | alvosec.com/block-producer/ | page | COMMUNITY-BP |
| DappRadar https://dappradar.com | blog tag xpr-network (1 post); dapp/simpledex (filed under "Proton") | page | DATA / COMMUNITY-BP |
| Alcor https://alcor.exchange/v/xpr/ | live markets | page | DATA |
| r/XPRNetwork | linked from xprnetwork.org/faq; activity UNVERIFIED | `old.reddit.com/r/XPRNetwork/.rss` | COMMUNITY-LEAD |
| XPR Discord | discord.gg/G7E8qggYEQ (via xprnetwork.org/faq) | login | COMMUNITY-LEAD |
| nft.xprnetwork.org | official NFT market | page | OFFICIAL |
| Official endpoint list | docs.xprnetwork.org/client-sdks/endpoints ("last verified January 2026"): 17 API endpoints, 2 Hyperion | page | OFFICIAL |
| Testnet explorer | testnet.explorer.xprnetwork.org | page | OFFICIAL |
| protonnz status | protonnz.com/status (UNVERIFIED) | page | COMMUNITY-BP |
| The Grid | thegrid.id/profiles/xpr_network (has API + MCP) | API | COMMUNITY-LEAD |
| xprpy (PyPI) | 1.0.1, maintainer paulgnz | PyPI | DATA |
| XPR Live YouTube | channel UCbKWnJWSiu8v3YMv4w8_GKA ("XPR Labs"; not confirmed official) | RSS | COMMUNITY-LEAD |
| IQ.wiki | iq.wiki/wiki/xpr-network (2026-07-17) | page | COMMUNITY-LEAD |
| "XPR Official" / "XPR" YouTube | two channels with these names are unrelated (a devotional channel and a cartoon channel) | — | NOT-A-SOURCE (name trap) |
| Chainabuse | does not support XPR / EOS | — | NOT-A-SOURCE for XPR |
| Substack/beehiiv buy-call newsletters | affiliate promotion | — | NOT-A-SOURCE |
