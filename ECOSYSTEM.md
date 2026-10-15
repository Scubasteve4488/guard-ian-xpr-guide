# The Metallicus / XPR Network ecosystem: directory

Everything we have found and checked, in one place: products, dApps, DeFi, tokens, live data feeds, governance, agents, games, NFTs, tools, communities and the GitHub code. **Read 2026-10-15** unless a row gives another date. The daily update adds new projects as they appear.

**Status key:**
- **LIVE**: the site loaded and showed activity, or a dated primary source lists it as live.
- **UNCLEAR**: it exists, but activity couldn't be confirmed.
- **QUIET**: no recent activity seen.
- **UNVERIFIED**: named by someone, but not confirmed at its own site.

**Source keys:**
- **[PJ]** is Proton NZ's projects page, https://www.protonnz.com/projects
- **[BP]** is Proton NZ's "State of XPR Block Producers" post, 2026-09-08: https://www.protonnz.com/blog/state-of-xpr-block-producers. Proton NZ is a block producer and ranks itself there, so treat its counts as COMMUNITY-BP.

**Disclosure:** StandGuard, Guard.IAN and the GUARD token belong to this guide's builder. They are listed for completeness and get no special treatment.

**Rules for using this list:**
- A token is its **symbol plus its contract**. Copies of popular symbols on other contracts are everywhere, so always check the contract (see section 8).
- Inclusion here is not an endorsement. Nothing here is financial advice.
- Check a project's own site before relying on it.

---

## 1. Metallicus core products (official)

| Name | What it is | Link | Status |
|---|---|---|---|
| Metal X | On-chain order-book exchange with swaps, pools, farms, lending, staking, OTC and streaming, gas-free. Run by Metallicus, Inc. | https://metalx.com · app https://app.metalx.com · docs https://docs.metalx.com | LIVE |
| Metal X Swap (formerly Proton Swap) | AMM swaps; contract `proton.swaps` | https://app.metalx.com/swap | LIVE. A Sept 2026 incident is covered in Proton NZ's post-mortem (its title says the pools were "100% restored"): https://protonnz.com/blog/proton-swaps-heist |
| Metal X Lending / LOAN Protocol | Over-collateralised lending and borrowing; LOAN is the governance and rewards token | https://app.metalx.com/lending · https://metallicus.com/loan-protocol · https://xprnetwork.org/loan | LIVE |
| Metal X Bridge | Brings outside coins (BTC, ETH, XRP, SOL and others) onto XPR as X-tokens. Identity check required (Metal X FAQ) | https://app.metalx.com/bridge | LIVE |
| Metal Pay | Card on-ramp to buy crypto; XPR in the US, Australia and New Zealand | https://www.metalpay.com · how to buy XPR https://www.metalpay.com/how-to-buy/xpr-network · help https://help.metalpay.com/hc/en-us | LIVE |
| WebAuth | The official XPR Network wallet: self-custody, biometric signing, staking and voting | https://webauth.com · https://metallicus.com/individuals/webauth | LIVE |
| Metal Dollar (XMD) | Dollar stablecoin backed by a basket of stablecoins. Metal X's quote currency; expanded to Ethereum in Sept 2026 (Q3 report) | https://metaldollar.com | LIVE |
| Metal Blockchain | Layer 0 for institutions | https://metalblockchain.org · docs https://docs.metalblockchain.org · explorer https://explorer.metalblockchain.org | LIVE |
| Metal L2 | Ethereum L2 on the OP Stack; MTL is moving to it as gas ("Homecoming") | https://metall2.com | LIVE |
| PulseVM | Metallicus engine for running XPR-style contracts on Metal Blockchain. **No cutover date has been announced** | code https://github.com/MetalBlockchain/pulsevm · docs (community, by Paul Grey) https://pulsevm.dev · StandGuard summary https://standguard.net/projects/pulsevm | Code LIVE; network not live |
| BTCVM / LTCVM / DogecoinVM | Bitcoin, Litecoin and Dogecoin chains running on Metal Blockchain. **Alpha** per Metallicus's Q3 2026 report | https://github.com/MetalBlockchain/btcvm · https://www.metallicus.com/blog/metallicus---2026-q3-report | Alpha |
| XPR Network NFT Market | Gasless NFT market from the Metallicus team, priced in XUSDC | https://nft.xprnetwork.org | UNCLEAR (no listings visible) |
| XPR Network Explorer | Accounts, tokens, block producers, voting (formerly bloks.io) | https://explorer.xprnetwork.org · testnet https://testnet.explorer.xprnetwork.org | LIVE |
| FedNow listing | Metallicus in the Federal Reserve's FedNow explorer / Innovator Exchange | https://explore.fednow.org/explore-the-city?id=10&postId=121&vendor=metallicus-inc | LIVE |
| Stablecoin pilot for credit unions | Metallicus's white-label stablecoin programme | https://metallicus.com/institutions/stablecoin-pilot | LIVE |
| Quarterly reports | CEO's quarterly summaries | https://metallicus.com/news · Q3 2026: https://www.metallicus.com/blog/metallicus---2026-q3-report | LIVE |

## 2. DEXs, launchpads and DeFi

| Name | What it is | Link | Run by (as stated) | Status |
|---|---|---|---|---|
| Alcor Exchange | Multi-chain DEX (XPR, WAX, Vaulta, Telos), with XPR pools, order books and farms | https://alcor.exchange/v/xpr · https://proton.alcor.exchange | Alcor (own team) | LIVE |
| SimpleDEX | AMM swaps plus bonding-curve token launches (contracts `simpledex`, `simplelaunch`) | https://simpledex.fun · docs https://simpledex.fun/llms.txt | Proton NZ | LIVE |
| BlastPad ($BLPAD) | Token launches, airdrops, staking pools | https://blastpad.io | homebloksbp [BP] | LIVE |
| XPredicting | Prediction market | https://xpredicting.com | homebloksbp [BP] | UNCLEAR |
| Price Battle | Price-prediction game | https://proton.link/battle | Proton NZ [PJ] | LIVE |

DefiLlama tracks three XPR protocols (read 10-15): Metal X about $49.3M, Alcor about $432K, SimpleDEX about $180K TVL. Source: https://defillama.com/chain/xpr-network. Figures move; cite the page and the time.

## 3. Social and community platforms

| Name | What it is | Link | Run by (as stated) | Status |
|---|---|---|---|---|
| Snipverse | SocialFi platform for creators; SNIPS token; version 2.0 launched March 2025 | https://snipverse.com | snipverse BP; Frostic, LLC per its grant application | LIVE (854 users in 6 months [BP]) |
| Vibrr | "Proof of engagement" social hub: earn VIBRR through posts, quests and games | https://vibrr.ai | homebloksbp [BP] | LIVE (4,553 users in 6 months [BP]) |
| Shellbook | Social network for AI agents, with XPR identity and an s/xpr forum | https://shellbook.io · code https://github.com/paulgnz/shellbook | Paul Grey / Proton NZ | LIVE (low volume) |

## 4. AI agents

| Name | What it is | Link | Status |
|---|---|---|---|
| XPR Agents | On-chain registry for AI agents: identity, reviews, validation and escrowed jobs (contracts `agentcore`, `agentfeed`, `agentvalid`, `agentescrow`) | https://xpragents.com · llms https://xpragents.com/llms.txt · stats https://indexer.xpragents.com/api/stats · code https://github.com/XPRNetwork/xpr-agents | LIVE: 73 agents (68 active), 48 completed jobs, 10-15 |
| Charlie Bot | Autonomous agent with paid services, machine-payment demos (x402 / MPP on XPR) and the CHARLIE token | https://charliebot.dev · code https://github.com/charliebot87 | LIVE |
| Guard.IAN (this guide's builder) | Agent that buys into SimpleDEX launches and writes Utility Forge reports | https://standguard.net/ian · https://xpragents.com/agent/safeguard5 | LIVE |
| Other registered agents (names from the registry, self-described, unchecked) | AI Toolkit Agent, PX Computer, Jacob, Chiru, The Keeper, Heisenbot, Grey Agent | https://xpragents.com | UNVERIFIED |
| Build your own | Official agent runner and SDK | https://www.npmjs.com/package/create-xpr-agent · https://www.npmjs.com/package/@xpr-agents/sdk · https://www.npmjs.com/package/@xpr-agents/openclaw | LIVE |

## 5. Games

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Chain Runner | 3D endless runner, on-chain leaderboard, SHARD rewards, NFT skins | https://chainrunnergame.com | Proton NZ [PJ] | LIVE |
| ChainInfra Arcade | Match-3 and shooter games, daily prizes | https://arcade.chaininfra.net | chaininfra BP | LIVE |
| XPR Casino | Spin and scratch games paying XPR | https://xprcasino.blocksindia.com | protonind (Blocks India) | LIVE |
| XPROLL | Daily dice game | https://dice.blocksforge.com | blocksforge BP | LIVE |
| XPR Slots | Open-source, provably fair slot demo | https://xprslots.com · https://github.com/paulgnz/xpr-slots | Paul Grey | LIVE (demo, low use) |
| MadTower / MadRaffle | Climbing game; raffle for voters | https://madblocks.tech | madblocks BP | UNCLEAR |
| Cypher Gang battle game | The community's own battle game | https://cyphergang.com | Cypher Gang | UNCLEAR |

## 6. NFTs

| Name | What it is | Link | Status |
|---|---|---|---|
| AtomicAssets / AtomicMarket | The NFT standard and sale contracts used on XPR | https://explorer.xprnetwork.org/account/atomicmarket | LIVE |
| Soon.Market | NFT marketplace (AtomicAssets) | https://soon.market | UNCLEAR |
| NFT Packs | Packs that each mint one random NFT | https://nftpacks.io (bloxprod) | LIVE |
| NFT Claim Hub | Where community NFT rewards are claimed | https://nftclaimhub.io (bloxprod) | LIVE |
| GLBDEX | Market for 3D-model NFTs, with AR/VR viewing | https://glbdex.com (Proton NZ) | UNCLEAR |
| Cypher Gang | Long-running NFT community. The collection states 1,777; 927 were minted on chain as of 10-15 | https://cyphergang.com · X @CypherGangNFT · Telegram t.me/CypherGang | LIVE |
| FunkyFVerse, "Genesis of Funk" | NFT collection `genesisofunk`, "powered by the KSTO ecosystem" | X @funkyfVerse · https://snipverse.com/funkyf | LIVE |
| Grid Runners | 1/1 Genesis NFTs (`gridrunnersx`), $GRID | X @xpr_gridrunners · https://gridrunners.netlify.app | UNCLEAR |
| Snippy NFTs | KSTO mascot collection (sold out per standguard.net) | https://standguard.net/community/snippy | LIVE |

## 7. Tools, security, analytics and payments

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| XPR Pulse | Live XPR dashboard: multi-account portfolio, token prices (from proton.swaps reserves, every 30 s), snapshots, news, an AI research assistant; Pro tier paid by an XMD stream (7.50 XMD / 30 days) | https://xprpulse.com · /tokens · /tools · /news | Not named on the site | LIVE |
| XPR Tax | Full-history tax exports (Koinly, CoinTracking and others) | https://tax.protonnz.com | Proton NZ | LIVE |
| Private Transactions | Transfers that hide the amount, with a viewing key for an auditor (contract `xprconf`). Early access with caps; no third-party audit yet | https://privatexpr.com ([PJ]) and private.protonnz.com (blog). The two sources disagree on the URL | Proton NZ | LIVE (early access) |
| XPR Auth Cleanup | Removes wallet-drainer permissions from an account in one signed transaction | https://cleanup.protonnz.com · https://github.com/paulgnz/xpr-auth-cleanup | Proton NZ | LIVE |
| Xprotect | Phishing and domain scanner, Web3 DNS, block-producer monitor | https://xprotect.org | alvosec | LIVE |
| XPR Radar | Voter intelligence, inactive-producer tracker, msig app | https://xpr.voterintelligence.blocksindia.com | protonind | UNCLEAR |
| madblocks Pulse | Block-producer health tool | https://madblocks.tech | madblocks | UNCLEAR |
| GeneroX | On-chain donation campaigns | https://generox.org | alvosec | LIVE |
| XPR Checkout / Wookey | WooCommerce / WordPress checkout plugin for XPR | https://xprnetwork.org/wookey-woocommerce-plugin · https://github.com/XPRNetwork/xpr-checkout-wp | XPR Network | UNCLEAR |
| ProtonLive | Network analytics, being rebuilt | https://protonlive.io | protonuk | QUIET |
| Proton Link | Wallet-linking tools for apps | https://proton.link | Proton NZ | LIVE |
| Proton NZ developer services | Public API, testnet, daily snapshots | https://protonnz.com/developers | Proton NZ | LIVE |
| Public endpoints | 17 mainnet API endpoints, 2 Hyperion history endpoints | https://docs.xprnetwork.org/client-sdks/endpoints | Various producers | LIVE ("verified January 2026") |
| Oracle price pusher | Tool for producers to push prices to `delphioracle` | https://github.com/paulgnz/xpr-oracle | Proton NZ | UNCLEAR |
| StandGuard (this guide's builder) | Account lookup, launch records, beginner guides, credit-union explainer, DeFi Forge calculators | https://standguard.net · /learn · /learn/ecosystem · /learn/credit-unions · /tools/account-check · /launches | @Scubasteve4488 | LIVE |

## 8. Tokens: always symbol + contract

| Token | What it is | Contract (decimals) | Data page |
|---|---|---|---|
| XPR | Native gas-free chain token | `eosio.token` (4) | CoinGecko `proton` / `xpr-network` |
| XMD | Metal Dollar stablecoin | `xmd.token` (6) | CoinGecko `metal-dollar` |
| LOAN | LOAN Protocol governance token | `loan.token` (4) | CoinGecko `proton-loan` |
| XMT | XPR version of **MTL**, the Metal DAO governance token | `xtokens` (8) | CoinGecko `metal` (MTL) |
| METAL | Bridged native token of Metal Blockchain. Not MTL, and not Metal X | `xtokens` (8) | CoinGecko `metal-blockchain` |
| X-tokens (Metal X DEX) | Wrapped outside coins: XUSDC, XUSDT, XDOGE, XHBAR, XSOL, XXRP, XXLM, XADA (6); XBTC, XETH, XLTC (8); XDC (4) | `xtokens` | per underlying coin |
| More X-tokens (Swap pools) | XBNB, XBCH, XEOS, XUNI, XLUNR | `xtokens` | — |
| KSTO | KSTO community governance token | `tokencreate` (6), per Alcor and community token lists (not stated on ksto.world) | — |
| VIBRR | Vibrr's token | `tokencreate` (8), per the same lists | — |
| SNIPS | Snipcoins (linked to Snipverse per its grant application) | `snipcoins` (4) | — |
| SHARD | Chain Runner's token | `chainrunshd` (4) | — |
| CHARLIE | Charlie Bot's SimpleDEX token | `simpletoken`, token 2 | https://simpledex.fun/token/2 |
| KSTO vetted tokens | SNIPPY 161, MARSH 5, HEAL 426, PBR 160, LBUG 43, SNIP 419, LADY 18, PAPA 115, BENDER 55, STRAZ 100, GUARD 172 (SimpleDEX token IDs, all graduated) | `simpletoken` | https://simpledex.fun/token/ID · https://ksto.world/vetted_tokens.html |

**Watch out:**
- **XRP is not XPR.** Ripple's XRP on XPR is XXRP (double X).
- **Copies are everywhere.** Alcor's list held 426 tokens copying these symbols on other contracts, and flagged 405 of them as scams (10-15). SimpleDEX also has lookalikes, such as a "METAL" and a "BTC" that are not the real ones.
- **FOOBAR@xtokens** is a demo token per XPR's own repos (`foobar-faucet`). Don't treat it as an asset.

## 9. Live token and market feeds (JSON, plain GET, read 10-15)

| Feed | What it returns |
|---|---|
| https://dex.api.mainnet.metalx.com/dex/v1/markets/all | Every Metal X market (18), with token code, contract and decimals |
| https://indexer.protonnz.com/api/tokens?fields=compact&limit=1000 | Every SimpleDEX token: ID, symbol, name, graduated, price |
| https://indexer.protonnz.com/api/prices | SimpleDEX prices with contracts |
| https://indexer.protonnz.com/api/pools | SimpleDEX pools, contracts and TVL |
| https://indexer.protonnz.com/api/stats | SimpleDEX totals |
| https://proton.alcor.exchange/api/v2/tokens | Every Alcor XPR token, with contract, price and `is_scam` / `is_trusted` flags |
| https://proton.eosusa.io/v2/state/get_tokens?account=ACCOUNT | Every token an account holds (Hyperion) |
| https://proton.eosusa.io/v2/state/get_top_holders?contract=C&symbol=S | Whether a symbol exists on a contract, and who holds it |
| https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/tokens.json | Community-kept token list (897 XPR entries) |
| https://indexer.xpragents.com/api/stats | XPR Agents totals |

There is no official XPRNetwork token-list repo (checked 10-15).

## 10. Governance

| Name | What it is | Link |
|---|---|---|
| XPR Network Consortium | Six-member steering body. Metallicus (permanent), Crypto Lions, Alvosec, Proton NZ, EOS Amsterdam, GenerEOS; two-year terms | https://xprnetwork.org/blog/the-xpr-network-consortium |
| Governance portal | Gasless proposals and votes. Communities: XPR Network, Metal X, LOAN Protocol, XPR Grants, Metal DAO | https://gov.xprnetwork.org · docs https://gov.docs.xprnetwork.org |
| XPR Grants | Paid from the `xprgrants` account. Individuals up to $1,000 (open source $2,500), small teams and companies more. Per milestone, Consortium-verified, community vote | https://github.com/XPRNetwork/grant-framework |
| Metal DAO | XMT holders vote on the XMD basket | https://gov.docs.xprnetwork.org/communities/metal-dao |
| Block producers | Elected by stakers; 21 in the active schedule. Read the live list with `get_producer_schedule`; names change | https://explorer.xprnetwork.org |
| Staking | Stake and vote in WebAuth; long staking on the explorer | https://xprnetwork.org/blog/xpr-network-staking-guide |
| Bounties | Open developer bounties | https://github.com/XPRNetwork/bounties |

**The sources disagree twice:**
- The Consortium page says 40 active producers; Proton NZ counted 37 on 09-08.
- The governance docs say to submit grants on GitHub first, while the grant-framework README says the dashboard is the only route.

## 11. Communities and official channels

| Name | Type | Links |
|---|---|---|
| XPR Network | Official | X https://x.com/XPRNetwork · Telegram https://t.me/XPRNetwork (admins never DM) · Discord https://discord.gg/G7E8qggYEQ · Reddit https://reddit.com/r/XPRNetwork · news https://xprnetwork.org/news · help https://help.xprnetwork.org |
| Metallicus | Official | X https://x.com/MetallicusTDBN · https://linkedin.com/company/metallicus · https://youtube.com/@metallicusTDBN · Vimeo https://vimeo.com/metallicus |
| Metal X | Official | X https://twitter.com/MetalXApp · Reddit https://reddit.com/r/MetalXOfficial |
| KSTO | Community | https://ksto.world · X https://x.com/Keep_Snipping · Telegram https://t.me/KSTOX · https://snipverse.com/kstoken · summary [KSTO.md](KSTO.md) |
| FunkyFVerse | Community (KSTO ecosystem) | X https://x.com/funkyfVerse |
| Cypher Gang | NFT community | https://cyphergang.com · X https://x.com/CypherGangNFT · Telegram https://t.me/CypherGang |
| Snipverse / Vibrr / Shellbook | Social platforms | sections 3 and 4 |
| Proton Nigerian Hub | Regional education hub (grant application) | X https://x.com/ProtonNigeria |
| Proton NZ | Block producer, builder, educator | https://protonnz.com · feed https://protonnz.com/feed.xml · X https://x.com/protonnz · YouTube https://www.youtube.com/channel/UCqNT7sTd-T9MQ-6UaIYDQFQ |
| BloxProd | Block producer, educator (tutorial videos) | https://bloxprod.io · https://youtube.com/@Bloxprod · X https://x.com/bloxprodio |
| alvosec | Block producer, security | https://alvosec.com · https://xprotect.org |
| madblocks | Block producer, security tools, games | https://madblocks.tech · X https://x.com/madblocksbp |
| protonuk | Block producer | https://protonuk.io |
| saltant | Block producer, public APIs and snapshots | https://saltant.io |
| chaininfra | Block producer, games, vote tool | https://chaininfra.net · https://vote.chaininfra.net |
| GenerEOS | Consortium marketing | X https://x.com/GenerEOSAus |
| StandGuard community pages (builder's own) | KSTO, Snippy, Snipverse, CypherGang | https://standguard.net/community |

## 12. GitHub: where it is built

| Org / user | What's there | Link |
|---|---|---|
| XPRNetwork (official, 62 repos) | Key repos: `xpr-network-dev-skill`, `xpr-agents`, `proton-cli`, `proton-web-sdk`, `proton.contracts`, `ts-smart-contracts` (+ docs), `vert` (test library), `dex-bot`, `xpr-loan-liquidation-bot`, `xpr-market-template` (white-label NFT market), `wharfkit-plugin-webauth`, `XPRNKit` (React Native), `developer-examples`, `grant-framework`, `bounties`, `xpr.start` / `xpr-testnet.start` (node setup), `proton-rng`, `proton-oracle`, `eosio.evm`, `consortium`. Older repos are archived. | https://github.com/XPRNetwork |
| MetalBlockchain (official, 11 repos) | `pulsevm`, `pulsevm-js`, `pulse-cdt-rust`, `hyperion-rs`, `btcvm`, `btc-vm`, `antelopevm`, `mtl-migration-public`, `ledger-app-metal`; the `metalgo` node | https://github.com/MetalBlockchain · https://github.com/MetalBlockchain/metalgo/releases |
| paulgnz (Paul Grey / Proton NZ, community) | `pulse-cutover` (a community cutover proposal, not an official plan), `pulse-wallet`, `pulse-explorer`, `pulsevm-docs`, `pulsevm-operator-kit`, `pulse-privacy`, `metalgo-setup`, `bridge-operator`, `dogecoin-vm-wallet`, `xpr-auth-cleanup`, `xpr-oracle`, `shellbook`, `xpr-slots`, `ccxt-xpr-examples` | https://github.com/paulgnz |
| charliebot87 (Charlie Bot) | `mpp-xpr` (XPR payments for the Machine Payments Protocol; npm `mppx-xpr-network`), `x402-demo`, `xpr-agent-sdk`, `xpr-hyperion-rotation`, `xpr-account-trust-cli`, `skill-simpledex-trading` | https://github.com/charliebot87 |
| AntelopeIO | The node software XPR runs (Spring) | https://github.com/AntelopeIO/spring/releases |
| StandGuard (builder's own) | standguard.net site; this guide | https://github.com/Scubasteve4488/metallicus-guardian-guard · https://github.com/Scubasteve4488/guard-ian-xpr-guide |
| ⚠ `github.com/metallicus` | **Not the company**: an unrelated personal account | — |

## 13. Named elsewhere, not yet confirmed at their own site (UNVERIFIED)
These are from [BP]. Check before citing:
- A-DEX (bpadex)
- Storex (storexbp)
- XPR Escrow and Crypto Travel Deals (homebloksbp)
- Neard music streaming and a session protocol called Railgun, which is not the Ethereum RAILGUN (rockeronebp)
- XPR Dashboard and Whale Watcher (xprdata)
- XPR Whales Alert (brotonbp)
- XPR Tax Time Machine (danemarkbp)
- XPR Hub (artwebin)
- Benchmark Services (saltant)
- XPR AI Assistant and a Metal X trading bot (alvosec)

Older grant-proposal titles with unknown status include Protonext, Fishtank, ProtonFlow, EasyEscrow, DAOScape, Mint Master, protonmint, FuelStack and Proton Crypto Index.

## 14. Name collisions: don't mix these up
- ProtonMail / Proton AG (the Swiss privacy company) is not Proton chain.
- XRP (Ripple) is not XPR.
- Metallica (the band), Metallus Inc. (steel) and METALLICUS LIMITED (UK) are not Metallicus.
- SOON (a Solana project) is not Soon.Market.
- XPredict (XT.com) is not XPredicting.
- PulseVM runs on Metal Blockchain, not on XPR today.
- Alcor is multi-chain, not XPR-only.
