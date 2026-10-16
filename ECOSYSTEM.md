# The Metallicus / XPR Network ecosystem: directory

Everything we have found and checked, in one place: products, dApps, DeFi, tokens, live data feeds, governance, agents, games, NFTs, tools, communities and the GitHub code. **Read 2026-10-15** unless a row gives another date. The daily update adds new projects as they appear.

**Expanded 2026-10-15 (evening):** the Cypher Gang ecosystem (CYPHR.Market, Cypher Brawls, MarketPulse, Tip Bot, Bid & Win, $CYPHR), the live NFT collection list, and every active block producer read from the chain. More projects are being checked at their own sites and are added as each one is confirmed.

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
| Metal X | On-chain order-book exchange with swaps, pools, farms, lending, staking, OTC and streaming, gas-free. Run by Metallicus, Inc. **Listing is not open to anyone:** a project asks through Metal X's listing application form, and the team reviews each request; if an asset qualifies, they may ask for more information (official help article "Listing New Assets on Metal X", updated 2026-06-30, read 10-16) | https://metalx.com · app https://app.metalx.com · docs https://docs.metalx.com · listing article https://help.xprnetwork.org/hc/en-us/articles/26569573786391-Listing-New-Assets-on-Metal-X (readable via https://help.xprnetwork.org/api/v2/help_center/en-us/articles/26569573786391.json) | LIVE |
| Metal X Swap (formerly Proton Swap) | AMM swaps; contract `proton.swaps` | https://app.metalx.com/swap | LIVE. A Sept 2026 incident is covered in Proton NZ's post-mortem (its title says the pools were "100% restored"): https://protonnz.com/blog/proton-swaps-heist |
| Metal X Lending / LOAN Protocol | Over-collateralised lending and borrowing; LOAN is the governance and rewards token. **Contracts: lending runs on `lending.loan` (not `lending`), L-token shares on `shares.loan`, LOAN on `loan.token`** (XPR dev skill `loan-protocol.md`; borrow limits and liquidation in §12b) | https://app.metalx.com/lending · https://metallicus.com/loan-protocol · https://xprnetwork.org/loan | LIVE |
| Metal X Bridge | Brings outside coins (BTC, ETH, XRP, SOL and others) onto XPR as X-tokens. Identity check required (Metal X FAQ) | https://app.metalx.com/bridge | LIVE |
| Metal Pay | Card on-ramp to buy crypto; XPR in the US, Australia and New Zealand | https://www.metalpay.com · how to buy XPR https://www.metalpay.com/how-to-buy/xpr-network · help https://help.metalpay.com/hc/en-us | LIVE |
| WebAuth | The official XPR Network wallet, made by Metallicus: self-custody, biometric signing, staking and voting | https://webauth.com · https://metallicus.com/individuals/webauth | LIVE |
| Metal Dollar (XMD) | Dollar stablecoin backed by a basket of stablecoins, minted and redeemed 1:1. Metal X's quote currency. **On XPR: `XMD@xmd.token`, 6 decimals, issuer `xmd.treasury`** (developer token registry and chain, read 10-16). **On Ethereum since 2026-09-26** (official announcement): contract `0xA6707A8A00E94d1834cCdA2856C9Cf948941078d`, with USDC, PYUSD, USDP and RLUSD as its reserve assets there. Read on Ethereum 10-15: name "Metal Dollar", XMD, 6 decimals, supply 142.247121. The two official pages disagree: metaldollar.com/networks (read 10-15) still says the Ethereum contract "should be published" later, while the announcement publishes it. Both are Metallicus pages; the announcement is the newer | https://metaldollar.com · Ethereum announcement https://metaldollar.com/blog/metal-dollar-on-ethereum · Ethereum app https://eth.metaldollar.metalx.com/mint-n-redeem · networks https://metaldollar.com/networks | LIVE |
| Metal Blockchain | Layer 0 for institutions | https://metalblockchain.org · docs https://docs.metalblockchain.org · explorer https://explorer.metalblockchain.org | LIVE |
| Metal L2 | Ethereum L2 on the OP Stack; MTL is moving to it as gas ("Homecoming") | https://metall2.com | LIVE |
| PulseVM | Metallicus engine for running XPR-style contracts on Metal Blockchain. **No cutover date has been announced** | code https://github.com/MetalBlockchain/pulsevm · docs (community, by Paul Grey) https://pulsevm.dev · StandGuard summary https://standguard.net/projects/pulsevm | Code LIVE; network not live |
| BTCVM / LTCVM / DogecoinVM | Bitcoin, Litecoin and Dogecoin chains running on Metal Blockchain, each pegged 1:1 to the real coin through a bridge (its own site). **Alpha** per Metallicus's Q3 2026 report. **DogecoinVM's own README (MetalBlockchain/dogecoin-vm @ cfb9dad, 2026-10-13):** "the code has not been audited, the chain has one validator, and one operator holds every peg signer key. Keep amounts small." Deposits capped at 100 DOGE, at most 4,200 DOGE circulating | DogecoinVM https://metaldoge.com · BTCVM https://metalbtc.com · LTCVM https://metalltc.com · code https://github.com/MetalBlockchain/dogecoin-vm · https://github.com/MetalBlockchain/btcvm · Q3 report https://www.metallicus.com/blog/metallicus---2026-q3-report | Alpha (sites load, 10-16) |
| XPR Network NFT Market | Gasless NFT market from the Metallicus team, priced in XUSDC | https://nft.xprnetwork.org | UNCLEAR (no listings visible) |
| XPR Network Explorer | Accounts, tokens, block producers, voting (formerly bloks.io) | https://explorer.xprnetwork.org · testnet https://testnet.explorer.xprnetwork.org | LIVE |
| FedNow listing | Metallicus in the Federal Reserve's FedNow explorer / Innovator Exchange | https://explore.fednow.org/explore-the-city?id=10&postId=121&vendor=metallicus-inc | LIVE |
| Stablecoin pilot for credit unions | Metallicus's white-label stablecoin programme | https://metallicus.com/institutions/stablecoin-pilot | LIVE |
| Quarterly reports | CEO's quarterly summaries | https://metallicus.com/news · Q3 2026: https://www.metallicus.com/blog/metallicus---2026-q3-report | LIVE |

## 2. DEXs, launchpads and DeFi

| Name | What it is | Link | Run by (as stated) | Status |
|---|---|---|---|---|
| Alcor Exchange | Multi-chain DEX (XPR, WAX, Vaulta, Telos), with XPR pools, order books and farms | https://alcor.exchange/v/xpr · https://proton.alcor.exchange | Alcor (own team) | LIVE |
| SimpleDEX | AMM swaps plus bonding-curve token launches (contracts `simpledex`, `simplelaunch`). **Not a Metallicus product:** it is one of Proton NZ's projects, and Proton NZ is a block producer operating through Proton NZ LTD in New Zealand (protonnz.com, read 10-16) | https://simpledex.fun · docs https://simpledex.fun/llms.txt · https://protonnz.com | Proton NZ (block producer; not Metallicus) | LIVE |
| BlastPad ($BLPAD) | Token launches, airdrops, staking pools | https://blastpad.io | homebloksbp [BP] | LIVE |
| XPredicting | Prediction market | https://xpredicting.com | homebloksbp [BP] | UNCLEAR |
| A-DEX | Multi-chain Antelope DEX (swap, analytics, whale signals, a price oracle) with an XPR front end | https://xpr.a-dex.io | A-DEX (producer `bpadex`) | LIVE (read 10-15) |
| Price Battle | Price-prediction game | https://proton.link/battle | Proton NZ [PJ] | LIVE |
| MarketPulse | On-chain UP/DOWN prediction rounds on XPR/USD, BTC/USD and ETH/USD, staked in XPR, settled by an on-chain price oracle after 24 h. Fee 10% of winnings (3% for Cypher Gang NFT holders) goes to buying back and burning CYPHR. The site says the contract was audited by Bloxprod BP and calls itself experimental. **Its own risk notice (read 10-16): "You may lose the XPR you stake"; predictions are final (no cancelling or switching sides); draws and one-sided rounds are refunded.** Daily rounds lock at 16:00 UTC | https://cyphergang.com/predictions · X @MarketPulseXPR | Cypher Gang | LIVE (read 10-15) |

DefiLlama tracks three XPR protocols (read 10-15): Metal X about $49.3M, Alcor about $432K, SimpleDEX about $180K TVL. Source: https://defillama.com/chain/xpr-network. Figures move; cite the page and the time.

## 2b. Getting XPR: where it trades, wallets, moving it

Read 2026-10-15. This answers "where does XPR trade and how do I move it safely". It is not advice to buy anything.

- **Where XPR trades: two sources, neither complete.**
  - **XPR's help center, "What Exchanges support XPR Network Mainnet?"** (last updated 2025-05-24) lists six places that accept XPR on XPR Network itself, with the deposit account to send to: Metal Pay `@metalpay.com`, KuCoin `@kucoindotxpr`, Bithumb `@bithumbxprr1`, Gate.io `@gatedeposit`, HitBTC `@hitbtcxprins`, CoinEx `@coinex2zmoon`. It says to check the exchange's account has the verified checkmark, because transfers can't be undone. https://help.xprnetwork.org/hc/en-us/articles/4417597596439
  - **An older help article, "Where Can I Buy XPR Network (XPR)?"** (updated 2025-04-05) lists 16 places, including Uniswap and PancakeSwap (the Ethereum and BNB Chain tokens below) and Liquid. https://help.xprnetwork.org/hc/en-us/articles/4417459294615-Where-Can-I-Buy-XPR-Network-XPR
  - **CoinGecko's live market list** (read 2026-10-16 00:21 UTC) showed 14 XPR markets: KuCoin, Metal X, Gate, MEXC, BloFin, Ourbit, DigiFinex, Bithumb, KCEX and Hibt, plus Uniswap pools for the Ethereum and BNB Chain tokens, one of them flagged stale. HitBTC and CoinEx were not on it. CoinGecko doesn't say which chain an exchange uses for deposits. Market list: CoinGecko `xpr-network`, CoinMarketCap `proton`.
- **Memo IDs.** XRP, XLM, HBAR and Stellar USDC need a Memo ID (tag) when you deposit them to or withdraw them from WebAuth; a missing or wrong memo can lose the funds for good (help article, updated 2026-06-22: https://help.xprnetwork.org/hc/en-us/articles/30861793921687).
- **Reading the help center.** Its web pages block automated readers, but its public API returns each article in full: list https://help.xprnetwork.org/api/v2/help_center/en-us/articles.json (paged), one article https://help.xprnetwork.org/api/v2/help_center/en-us/articles/ARTICLE_ID.json (the number in the article's URL). 141 articles on 10-16.
- **XPR on other chains (read on those chains 10-15).** XPR also exists as an ERC-20 token on Ethereum (`0xd7efb00d12c2c13131fd319336fdf952525da2af`) and a BEP-20 token on BNB Chain (`0x5de3939b2f811a61d830e6f52d13b066881412ab`). These are the contracts the help article links for Uniswap and PancakeSwap. Both contracts report name "Proton", symbol XPR, 4 decimals and a total supply of 10,000,000,000. They are tokens on other chains, not native XPR.
- **Moving XPR to a WebAuth wallet.** The withdrawal address is your WebAuth username without the "@", and there are no gas fees (help article, updated 2026-06-08: https://help.xprnetwork.org/hc/en-us/articles/4410313664407-How-do-I-withdraw-XPR-to-my-WebAuth-Wallet-from-an-exchange-over-XPR-Network). A WebAuth address is an @name, not a 0x address, so the withdrawal has to go out on XPR Network itself, not as the Ethereum or BNB Chain token.
- **Wallets.**
  - **WebAuth** (§1) is the official wallet for XPR Network and Metal Blockchain. It is non-custodial: keys stay on your device, and Metal's support cannot recover a lost key (help article, updated 2025-10-12). The browser wallet can sign with Face/Touch ID, a YubiKey or Google Titan key, or an Ethereum wallet (help article, updated 2025-01-31).
    - **Backing up (official help article "How do I backup my private key in the WebAuth Wallet?", updated 2026-10-05):** in the app, open Settings, then "Backup Wallet". You type "I will never give my private key to anyone else" before the key is shown. Then save it, ideally on a device that isn't online, and keep more than one copy. XPR, Metal Blockchain and Ethereum each have their own private key. For new accounts, the seed phrase backup restores both wallets. Article: https://help.xprnetwork.org/hc/en-us/articles/4410313687703 (readable via https://help.xprnetwork.org/api/v2/help_center/en-us/articles/4410313687703.json)
    - **Restoring (official help article "How do I restore an account using a private key or seed phrase on the WebAuth mobile wallet?", updated 2026-10-05):** tap "Login", then "Import Account", then enter your private key or your **12-word mnemonic phrase** (lower case, one space between words). An XPR key restores only the XPR account and a Metal key only the Metal account, but "the 12-word seed phrase mnemonic can recover both accounts". Metal Client Services cannot see or recover your key. Article: https://help.xprnetwork.org/hc/en-us/articles/4409647374487 (readable via https://help.xprnetwork.org/api/v2/help_center/en-us/articles/4409647374487.json)
    - **Never share your private key or 12-word phrase with anyone:** not support, not this guide, not any AI. No one legitimate asks for it. If you ever pasted it into a chat, a form or a website, treat it as exposed and move your funds to a new wallet now.
  - **Anchor** (Greymass) lists Proton, XPR's chain ID `384da888…f437e0`, as a supported network on desktop and mobile (Greymass support page, modified 2021-12-02). The XPR explorer's own docs have an Anchor login guide.
  - **Explorer docs:** https://docs.bloks.io documents explorer.xprnetwork.org, including transfers, staking and login guides for WebAuth, Anchor, Ledger, Trezor, cleos and several older EOS-era wallets. Whether each older wallet is still maintained: UNCLEAR.
  - **Trezor, KeepKey and OneKey** pages mention XPR but don't make clear whether they mean native XPR or the Ethereum/BNB token: UNCLEAR. Confirm the network before sending.
- **Bridges.** The Metal X Bridge (§1) brings outside coins onto XPR as X-tokens, with an identity check. Alcor's bridge indexer appeared on GitHub on 2026-10-15 (§12, CODE only).

## 3. Social and community platforms

| Name | What it is | Link | Run by (as stated) | Status |
|---|---|---|---|---|
| Snipverse | SocialFi platform for creators; SNIPS token; version 2.0 launched March 2025 | https://snipverse.com | snipverse BP; Frostic, LLC per its grant application | LIVE (854 users in 6 months [BP]) |
| Vibrr | "Proof of engagement" social hub: earn VIBRR through posts, quests and games | https://vibrr.ai | homebloksbp [BP] | LIVE (4,553 users in 6 months [BP]) |
| Shellbook | Social network for AI agents, with XPR identity and an s/xpr forum | https://shellbook.io · code https://github.com/paulgnz/shellbook | Paul Grey / Proton NZ | LIVE (low volume) |
| XPR Hub | Community hub: beginner tutorials and videos, AskHub Q&A, a monthly "BP of the Month" vote, and a checker for votes going to inactive producers (it says 18.46% of staked XPR votes for inactive ones, read 10-15). Version 1.0 rebuilt | https://xprhub.org | artwebin (producer) | LIVE (read 10-15) |

## 4. AI agents

| Name | What it is | Link | Status |
|---|---|---|---|
| XPR Agents | On-chain registry for AI agents: identity, reviews, validation and escrowed jobs (contracts `agentcore`, `agentfeed`, `agentvalid`, `agentescrow`). **Built by Proton NZ:** listed as one of its live projects on protonnz.com (read 10-16); the code sits in the XPRNetwork GitHub org (MIT) | https://xpragents.com · llms https://xpragents.com/llms.txt · stats https://indexer.xpragents.com/api/stats · code https://github.com/XPRNetwork/xpr-agents | LIVE: 73 agents (68 active), 48 completed jobs, 10-15 |
| Charlie Bot | Autonomous agent with paid services, machine-payment demos (x402 / MPP on XPR) and the CHARLIE token | https://charliebot.dev · code https://github.com/charliebot87 | LIVE |
| Guard.IAN (this guide's builder) | Agent that buys into SimpleDEX launches and writes Utility Forge reports | https://standguard.net/ian · https://xpragents.com/agent/safeguard5 | LIVE |
| Goldminer | Registered agent that says it teaches XPR users "how to mine gold" using flex-token features, or does it for them for a fee (see the flex tokens, §8). Its listed site, goldminer.info, forwards to a page on another host with no XPR content (10-16); its contact is a Telegram group | https://xpragents.com/agent/goldminer | UNCLEAR |
| Other registered agents (names from the registry, self-described, unchecked) | AI Toolkit Agent, PX Computer, Jacob, Chiru, The Keeper, Heisenbot, Grey Agent | https://xpragents.com | UNVERIFIED |
| Memeverse | "AI pets" with personalities that think, vote in a council and build software; NFTs on XPR, Solana or WAX. 14 of its agents are registered on XPR Agents. Its $MEMECHAOS token is on pump.fun (Solana), not XPR | https://memechaos.com | LIVE (read 10-15) |
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
| Cypher Brawls | Tactical hex-grid campaign and PvP game: your Cypher Gang NFT is your fighter (or a 1,000 XPR "Base Recruit"); shop in CYPHR; earn CYPHR and XPR. Pre-alpha (app v2026.09.16; its wiki says about 11% built: campaign, PvP, shop) | https://app.cypherbrawls.com · guide https://cyphergang.com/wiki | Cypher Gang | LIVE, pre-alpha (was UNCLEAR; confirmed 10-15) |
| Degen Hoopers | NFT basketball league: 3,000 "hoopers" (1,045 minted, the rest sealed in packs, read 10-15). Arcade games (3-point shoot-out, 3v3, the Buckets card game) and weekend leagues paying NUTMEG and NFT prizes. Playing needs one of its NFTs and a WebAuth wallet. Tokens: NUTMEG (traded on Alcor; contract not checked here) and BOOTNUT (SimpleDEX 68, used for "Bootleg" primary sales) | https://degenhoopers.com | Degen Hoopers team | LIVE (read 10-15) |
| Atomic Ramjet | Arcade space shooter. Each run costs RAMJET (SimpleDEX 323; the site writes "RJ"), 20 to 450 depending on difficulty and pack. A weekly pot is paid to the top 20 pilots | https://atomicramjet.com | Atomic Ramjet team | LIVE (read 10-15) |
| THC Arcade | Grow, Yard and City games for THC holders (SimpleDEX 254). You claim THC with WebAuth, capped at 50,000 per wallet per day. The site says 18+ and calls itself an independent community site | https://thcarcade.fun | community | LIVE (read 10-15) |
| XPRGAMES | Wager XG or XPR on Keno, Dice Roll, Coin Flip and Multi Dice (the site says on-chain RNG, about 96% RTP). XG staking is "coming soon". Also runs GiftBot, a Telegram tipping bot (GIFT, SimpleDEX 361). XG is SimpleDEX 145 | https://www.xprgames.app | XPRGAMES | LIVE (read 10-15) |

## 6. NFTs

| Name | What it is | Link | Status |
|---|---|---|---|
| AtomicAssets / AtomicMarket | The NFT standard and sale contracts used on XPR | https://explorer.xprnetwork.org/account/atomicmarket | LIVE |
| CYPHR.Market | NFT marketplace for every XPR collection (an AtomicMarket front end; fees 1% maker + 1% taker set by the contract, plus each collection's royalty). Shows XPR's full NFT trade history since 2021 (106,018 trades, $4.64M settled, read 10-15), rankings, auctions, a Studio for minting, and music NFTs playable in the browser. Promotion slots are paid in CYPHR and half of each payment is burned to `token.burn` in the same transaction. Launched Aug 2026 | https://cyphr.market · collections https://cyphr.market/collections · fees and burn https://cyphr.market/fees · X @CYPHRMARKET · on-chain account `cyphermarket` (created 2026-08-13) | LIVE |
| Soon.Market | NFT marketplace (AtomicAssets) | https://soon.market | LIVE (collection pages load, 10-15; was UNCLEAR) |
| NeftyBlocks XPR market | NeftyBlocks' former XPR marketplace (its producer `guild.nefty` last claimed 2026-04-28) | proton.neftyblocks.com returned "page not found" on 10-15 | ENDED: don't send people there |
| NFT Packs | Packs that each mint one random NFT | https://nftpacks.io (bloxprod) | LIVE |
| NFT Claim Hub | Where community NFT rewards are claimed | https://nftclaimhub.io (bloxprod) | LIVE |
| GLBDEX | Market for 3D-model NFTs, with AR/VR viewing | https://glbdex.com (Proton NZ) | UNCLEAR |
| Cypher Gang | Long-running NFT community and the CYPHR ecosystem: the 1,777-cap collection (7 rarity tiers, Common to Mythic) pays holders CYPHR every month by rarity and "era" (rewards halve each era). Mint count: its own site says 900 (10-15); CYPHR.Market shows 927 on chain. Secondary royalty 15%, half of it buys back and burns CYPHR. Timeline per its site: Cypher Gang 8-bit (2021), Cypher #1 (Feb 2022), Brawls and Bid & Win (2024), CYPHR (Apr 2025), Tip Bot (Dec 2025), CYPHR.Market (Aug 2026) | https://cyphergang.com · start https://cyphergang.com/start · Soon.Market https://soon.market/collection/zvapir55jvu4 · X @CypherGangNFT · Telegram https://t.me/CypherGang · on-chain accounts `cyphergang`, `cypherbrawls` | LIVE |
| Cypher Gang 8-bit / Synthwave Music NFTs | Cypher Gang's first collection (2021) and its music NFTs | https://cyphr.market/collections | LIVE |
| Bid & Win | Cypher Gang's auctions: new Cyphers open at 1 XPR, each bid earns a ticket for a 1,000,000 CYPHR prize draw; 50% of proceeds go to the CYPHR/XPR pool on Alcor | https://cyphergang.com/bid-and-win | LIVE (no active auction on 10-15) |
| All XPR NFT collections (live list) | **Warning first: anyone can mint a collection with any name, so check the creator account, not just the name.** CYPHR.Market ranks every collection with market activity: 524 on 10-15, 426 of them abandoned (no sale in 180+ days). Badges there mark team collections, e.g. Proton DEX Keys (◆ XPRNetwork Team), Jelli Genesis (◆ ProtonNZ Team), Cypher Gang (◆ CYPHR Team). Other active names on 10-15 include Element Companions, Royal Owls Club, Metal Blockies, Metal Mini Mart, Degen Hoopers, BUILDERS OF THE XPR NETWORK™, KSTO Snippy – Genesis Drop, LOAN Season, Aetherian Farm and The Dingleberries. | https://cyphr.market/collections | LIVE |
| FunkyFVerse, "Genesis of Funk" | NFT collection `genesisofunk`, "powered by the KSTO ecosystem" | X @funkyfVerse · https://snipverse.com/funkyf | LIVE |
| Grid Runners | 1/1 Genesis NFTs (`gridrunnersx`), $GRID | X @xpr_gridrunners · https://gridrunners.netlify.app | UNCLEAR |
| Snippy NFTs | KSTO mascot collection (sold out per standguard.net) | https://standguard.net/community/snippy | LIVE |
| The Guardians of the Citadel | 300 "Genesis Cyber-Knights" NFTs themed on protecting XPR Network (also has an agent on XPR Agents) | https://guardiansofcitadel.carrd.co | LIVE (read 10-15) |
| AtomicHub | Large AtomicAssets marketplace. Its front page on 10-15 offered only WAX Mainnet; XPR support was not shown, so don't point XPR users there without checking | https://atomichub.io | UNCLEAR for XPR |
| Aetherian Farm / Aetherian Seedrealm | Two NFT collections, read 10-15. "Aetherian Farm" (collection `241131353334`, 73 items, created about a year ago) calls its Aetherians "AI created web critters" living in a cosmic farm sanctuary. A newer collection, `aetheranfarm` ("The Butterfly Sanctuary"), gives each butterfly a name, an origin and an ancestry tied to a real historical moment. It was made by the agent "The Keeper — Aetherian Seedrealm" (XPR Agents registry), which describes "a living game world on XPR" and offers lore and on-chain storytelling. No game site or website found: the agent lists no endpoint, and the collection links only a Snipverse referral and a Telegram group | https://cyphr.market/c/241131353334 | Collections LIVE; game UNCLEAR (no site, 10-15) |

## 7. Tools, security, analytics and payments

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| XPR Pulse | Live XPR dashboard: multi-account portfolio, token prices (from proton.swaps reserves, every 30 s), snapshots, news, an AI research assistant; Pro tier paid by an XMD stream (7.50 XMD / 30 days) | https://xprpulse.com · /tokens · /tools · /news | Not named on the site | LIVE |
| XPR Tax | Full-history tax exports (Koinly, CoinTracking and others) | https://tax.protonnz.com | Proton NZ | LIVE |
| Private Transactions | Transfers that hide the amount, with a viewing key for an auditor (contract `xprconf`). Early access with caps; no third-party audit yet | https://privatexpr.com ([PJ]) and private.protonnz.com (blog). The two sources disagree on the URL | Proton NZ | LIVE (early access) |
| XPR Auth Cleanup | Removes wallet-drainer permissions from an account in one signed transaction | https://cleanup.protonnz.com · https://github.com/paulgnz/xpr-auth-cleanup | Proton NZ | LIVE |
| Xprotect | Phishing and domain scanner, Web3 DNS, block-producer monitor | https://xprotect.org | alvosec | LIVE |
| XPR Radar | Voter intelligence, inactive-producer tracker, msig app | https://xpr.voterintelligence.blocksindia.com | protonind | UNCLEAR |
| XPR Network Dashboard / Whale Watcher / XPRDATA Sentinel | Chain analytics and supply metrics; real-time large-transaction tracking (web and Telegram); Telegram price alerts that also track SimpleDEX launch tokens; a benchmark page | https://xprdata.org/dashboard · https://xprdata.org/whale-watcher · https://xprdata.org/benchmark | xprdata (producer) | LIVE (read 10-15) |
| XPR Whales Alert | Telegram channel posting large on-chain moves above a dollar threshold (transfers, staking, swaps, lending) | https://brotonbp.com | Broton BP | LIVE (read 10-15) |
| Storex | Online shop that takes crypto, with cashback and escrow; its blog has "Integrating the Proton Ecosystem". Newest blog post Jan 2024 | https://storex.io | Storex (producer `storexbp`) | UNCLEAR (shop loads, blog quiet) |
| MetalXPR / EnergyBP | Kryptallon (California) says its MetalSolar, XPRSolar and SunCommons clean-energy products run on Metal Blockchain and XPR, with $ENERGY, $SOLAR and $CHARGE tokens (contracts not stated on the page) | https://metalxpr.com/energybp | Kryptallon, dba MetalXPR (producer `energybp`) | UNCLEAR (claims on its own page) |
| TotalProton e-invoicing | Describes an on-chain e-invoice project (invoices stored on IPFS, payment and tax notification); no product link | https://totalproton.tech | TotalProton (producer) | UNCLEAR |
| madblocks Pulse | Block-producer health tool | https://madblocks.tech | madblocks | UNCLEAR |
| GeneroX | On-chain donation campaigns | https://generox.org | alvosec | LIVE |
| CYPHR Tip Bot | Telegram bot for tipping, "rain", games (dice, Mafia, slots) and a daily XPR price call, across about 50 XPR tokens. Custodial: you deposit to `cyphrtipbot` with your memo, and withdrawals cost 1% (0% for Cypher Gang NFT holders). Running since 2025-12-04; site says 1,212+ users. Groups and token listings are reviewed by hand | https://cyphergang.com/tipbot · Telegram @cyphr_tip_bot | Cypher Gang | LIVE |
| XPR Checkout / Wookey | WooCommerce / WordPress checkout plugin for XPR | https://xprnetwork.org/wookey-woocommerce-plugin · https://github.com/XPRNetwork/xpr-checkout-wp | XPR Network | UNCLEAR |
| ProtonLive | Network analytics, being rebuilt | https://protonlive.io | protonuk | QUIET |
| Proton Link | Wallet-linking tools for apps | https://proton.link | Proton NZ | LIVE |
| Proton NZ developer services | Public API, testnet, daily snapshots | https://protonnz.com/developers | Proton NZ | LIVE |
| Public endpoints | 17 mainnet API endpoints, 2 Hyperion history endpoints | https://docs.xprnetwork.org/client-sdks/endpoints | Various producers | LIVE ("verified January 2026") |
| Oracle price pusher | Tool for producers to push prices to `delphioracle` | https://github.com/paulgnz/xpr-oracle | Proton NZ | UNCLEAR |
| CryptoCurrencyShops (CCS) | Hub for a set of XPR tools, with its own tokens VEX and FRAGG (§8). **XPRyield** (v0.6.2, read 10-15): a yield dashboard "for XPR Network and Metal blockchain" (LP rebalancing, validator and delegator earnings, DCA plans, forecasts). It needs no wallet connection: you type any @name, and your settings stay in your browser. Its terms forbid automated tools, so open it yourself: xpryield.cryptocurrencyshops.com. **VEXgate** (https://vexgate.cryptocurrencyshops.com, read 10-16) is a swap app for XPR Network tokens; the hub calls it a "non-custodial cross-chain DEX aggregator". The hub also lists **FRAGGpulse** (on-chain analytics with wallet labels, unlocked by holding FRAGG and VEX), and a merch store marked "Coming Soon" | https://cryptocurrencyshops.com | CryptoCurrencyShops LLC (Wyoming, per XPRyield's terms) | XPRyield LIVE (10-15). VEXgate LIVE (10-16). FRAGGpulse UNCLEAR (not opened). Store not open |
| StandGuard (this guide's builder) | Account lookup, launch records, beginner guides, credit-union explainer, DeFi Forge calculators | https://standguard.net · /learn · /learn/ecosystem · /learn/credit-unions · /tools/account-check · /launches | @Scubasteve4488 | LIVE |

## 8. Tokens: always symbol + contract

| Token | What it is | Contract (decimals) | Data page |
|---|---|---|---|
| XPR | Native gas-free chain token | `eosio.token` (4) | CoinGecko `proton` / `xpr-network` |
| XMD | Metal Dollar stablecoin. On Ethereum it is a separate ERC-20 contract (§1) | `xmd.token` (6) on XPR · `0xA6707A8A00E94d1834cCdA2856C9Cf948941078d` (6) on Ethereum | CoinGecko `metal-dollar` |
| LOAN | LOAN Protocol governance token | `loan.token` (4) | CoinGecko `proton-loan` |
| XMT | XPR version of **MTL**, the Metal DAO governance token | `xtokens` (8) | CoinGecko `metal` (MTL) |
| METAL | Bridged native token of Metal Blockchain. Not MTL, and not Metal X | `xtokens` (8) | CoinGecko `metal-blockchain` |
| X-tokens (Metal X DEX) | Wrapped outside coins: XUSDC, XUSDT, XDOGE, XHBAR, XSOL, XXRP, XXLM, XADA (6); XBTC, XETH, XLTC (8); XDC (4) | `xtokens` | per underlying coin |
| More X-tokens (Swap pools) | XBNB, XBCH, XEOS, XUNI, XLUNR | `xtokens` | — |
| KSTO | KSTO community governance token. On chain (10-15): KSTO@tokencreate exists, supply = max = 900,000,000, issuer `kstoken`. **When answering, always add that no KSTO-run page states the contract.** The link to the community comes from Alcor and community token lists, not from KSTO itself | `tokencreate` (6), per Alcor and community token lists (not stated on ksto.world) | — |
| VIBRR | Vibrr's token | `tokencreate` (8), per the same lists | — |
| SNIPS | Snipcoins (linked to Snipverse per its grant application) | `snipcoins` (4) | — |
| SHARD | Chain Runner's token | `chainrunshd` (4) | — |
| CHARLIE | Charlie Bot's SimpleDEX token | `simpletoken`, token 2 | https://simpledex.fun/token/2 |
| BLPAD | BlastPad's token. On chain (10-15): supply = max = 12,000,000,000, issuer `tokencreate`; Alcor flags it `is_trusted` | `tokencreate` (6) | https://blastpad.io |
| Flex tokens: EASY, GRAMS, WON, MEME | Tokens with a transfer tax that is paid out to holders ("reflection"), sometimes plus a burn; holders can pick which token their rewards arrive in. Taxes as the project's own docs state: EASY 2% reflection; WON 2.2% reflection + 0.8% team; MEME 1% reflection + 1% burn. GRAMS is described as "generational gold" for Paxos Gold, with inheritance to any account. Some contract actions opt you out of the tax and the rewards for good (`noflexzone`, `optoutoftax`); the docs say to check the contract before signing. **On chain (10-15):** EASY supply = max = 21,000,000, issuer `mon3y`; GRAMS supply = max = 1,000,000,000, issuer `gold.mon3y`; WON supply = max = 1,000,000, issuer `w3won`; MEME about 9.98T of a 10T max, issuer `m3m3`. Alcor flags EASY, WON and MEME `is_trusted` and gives GRAMS no flag. Goldminer's registered agent says "Hold EASY, get GRAMS reflections" and "GRAMS is backed by XPAGX", most likely a typo for XPAXG, the Paxos Gold X-token. XPAXG@xtokens exists: supply 50 of a 35,436.642 max, read 10-15. The backing itself is not verified | EASY `mon3y` (6) · GRAMS `gold.mon3y` (6) · WON `w3won` (6) · MEME `m3m3` (4) | docs https://github.com/dougbutner/EASY-Website (flex-tokens.md) |
| NDAO | NeuroDAO / NFTitle DAO token, a default in Ubitquity's XPR Telegram tip bot. On chain (10-15): supply = max = 111,111,111, issuer `nftitledao` | `tokencreate` (4) | https://github.com/ubitquity/telegram_tip_bot_xpr_network |
| CYPHR | Cypher Gang's token. **On chain (10-15): supply = max supply = 4,206,942,069, issuer `cypherxpr`**; its site says fully issued Apr 2025, no new minting. Earned by holding Cypher NFTs, Brawls, auctions and marketplace rewards; spent on CYPHR.Market, the game shop, promotion and tipping; staked on BlastPad, farmed on Alcor (Alcor flags it `is_trusted`) | `tokencreate` (8) | https://explorer.xprnetwork.org/tokens/CYPHR-proton-tokencreate |
| VEX / FRAGG | CryptoCurrencyShops' SimpleDEX tokens: VEX "Vexar" (token 157) and FRAGG "Fraggleton" (token 370; its launch text calls it CCS's "first pure memecoin"). Both graduated (DEX pools 166 and 1082). **On chain (10-15), each with a 1,000,000,000 max and issuer `simplelaunch`: VEX supply 707,435,559.8536; FRAGG supply 767,219,391.6432.** Alcor lists VEX with no flag; FRAGG's Alcor listing could not be read (403) | `simpletoken` (4), tokens 157 and 370 | https://simpledex.fun/token/157 · https://simpledex.fun/token/370 |
| KSTO vetted tokens | SNIPPY 161, MARSH 5, HEAL 426, PBR 160, LBUG 43, SNIP 419, LADY 18, PAPA 115, BENDER 55, STRAZ 100, GUARD 172 (SimpleDEX token IDs, all graduated) | `simpletoken` | https://simpledex.fun/token/ID · https://ksto.world/vetted_tokens.html |

**Watch out:**
- **XRP is not XPR.** Ripple's XRP on XPR is XXRP (double X).
- **Copies are everywhere.** Alcor's list held 426 tokens copying these symbols on other contracts, and flagged 405 of them as scams (10-15). SimpleDEX also has lookalikes, such as a "METAL" and a "BTC" that are not the real ones.
- **FOOBAR@xtokens** is a demo token per XPR's own repos (`foobar-faucet`). Don't treat it as an asset.
- **Same symbol, different tokens:** BEAR exists at least as `BEAR@tokencreate` (5.89B, read 10-15) and `BEAR@simpletoken`. The SimpleDEX one (token 227) is Beartallicus's (§8b). NDAO also exists on both `tokencreate` and `simpletoken`. Always name the contract.

### 8b. SimpleDEX tokens that run their own website

Read 2026-10-15 from each launch's `simplelaunch::community` record (the creator fills in a website field), then opened in a browser. The site's claims are the site's own; nothing here checks that a product works as described. Games are in §5 (BOOTNUT 68, XG 145, THC 254, RAMJET 323, GIFT 361); CryptoCurrencyShops (VEX 157, FRAGG 370) is in §7.

| Token (SimpleDEX ID) | What its site says | Site | Status |
|---|---|---|---|
| BEAR (227) | Beartallicus: "$BEAR belongs on TDBN". A hub with swap links (SimpleDEX, Alcor, Vibrr) and pages for governance, treasury, NFTs and community rooms. Its footer calls it a tribute to a community member | https://beartallicus.com | LIVE |
| DEXIDX (290) | Built By Jacob. Says it now runs an active XPR/XMD grid trading bot on Metal X and is no longer a top-10 index. Holding 1M, 2M or 5M DEXIDX unlocks more views of the bot. Trading results not verified | https://dex10index.vercel.app | LIVE |
| BPT (445) | BodyF1RST BodyPointToken. Workouts, meals and streaks in the BodyF1RST fitness app earn BPT, which can be redeemed in the app or traded on SimpleDEX | https://bodyf1rst.com/bpt/ | LIVE |
| NDAOXPR (308) | nDAO's community token: lock pools, an "airdrop arcade", and a stated burn of 11M on 2026-03-26 | https://ndao.org/NDAOXPR | LIVE |
| CRICKET (215), PEGG (288) | Crypto Crickets, a crypto apparel shop. Every purchase earns 10,000 PEGG, airdropped by hand after you put your WebAuth @name in the order notes | https://cryptocrickets.biz | LIVE |
| AVEY (93) | Meme site ("the people's avocado"). It says the supply is fixed at 1 billion | https://aveyxpr.xyz | LIVE (meme) |
| HOV (420) | House of Validators: its launch text describes a private community for Metal Blockchain node operators. The linked site is a game, "Dragon Dash", development build v0.1 | https://dragon-dash-production.up.railway.app | UNCLEAR (dev build) |
| LFQP (465) | The linked site is a sign-in page for its own "Leafquip Superledger / T3-NET". It doesn't say what the XPR token is used for | https://lfqp.grok.me | UNCLEAR |
| LOANSKI (3), GENIE (458) | Their sites are site-builder placeholders: "Launching Soon" (loanski.xyz) and a template page (geniexpr.com) | — | NOT LIVE (10-15) |
| XBULL (162), MTLXBOT (191), PANDA (452) | protonbull.com, metalxbot.com and pandaxpr.com did not load (browser error page, 10-15) | — | DOWN (10-15) |
| PEPE (91) | Meme site. It mentions WebAuth and zero gas, staking on BlastPad, and an NFT collection with minting "coming soon" (read 10-16) | https://pepeonxpr.com | LIVE (meme) |
| TRAMP (286) | Community meme token. Per a 10-16 read of the site, it claims no dev tax and no buy/sell tax, and its swap link points to `simpletoken`. SimpleDEX's own trading fees are separate (§12b) | https://tramponxpr.xyz | LIVE (meme) |
| TIMECAP (135) | "XPR Time Cap", time-locked messages on the blockchain. Only the title was readable (10-16). Its launch text says you don't need the token to use it | https://xprtimecap.com | UNCLEAR |
| LOVE (35), BENDER (55), YEN (65), SEED (116) | KSTO-community tokens. They link keepsnipping.com, KSTO's old address, which has moved to ksto.world (per the guide's builder, 10-15; see KSTO.md) | https://ksto.world | LIVE (as ksto.world) |

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
| https://cyphr.market/collections | Every XPR NFT collection with market activity, with floor, volume, holders and age (a web page that builds in the browser, not JSON) |

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

### All 37 active block producers, read from the chain
**"Active" means two different things. Give both numbers when asked how many producers are active:** (1) **21 produce blocks at any moment.** That is the live schedule, from the `xpr_producers` tool. (2) **The registered accounts marked `is_active=1`** in the `eosio` `producers` table: 37 of 104 on 10-15. This count changes, so read it live with `xpr_table` (code `eosio`, scope `eosio`, table `producers`, paging until `more` is false) or say it is the 10-15 figure.

Source: `eosio` `producers` table, read 2026-10-15 21:36 UTC via the GUARD.IAN connector. 104 accounts are registered; 37 have `is_active=1`. The URL is whatever each producer set on chain. The projects column lists only what has been confirmed so far; blank does not mean they run nothing.

| Producer | URL (as set on chain) | Projects confirmed so far |
|---|---|---|
| `alvosec` | https://alvosec.com | Xprotect, GeneroX; Consortium member |
| `artwebin` | https://bp.artwebin.com | XPR Hub (xprhub.org) |
| `blocksforge` | https://www.blocksforge.com | XPROLL dice |
| `bloxprod` | https://bloxprod.io | NFT Packs, NFT Claim Hub; named as MarketPulse's contract auditor |
| `bpadex` | https://xpr.a-dex.io | A-DEX |
| `brotonbp` | https://mainnet.brotonbp.com | XPR Whales Alert (Telegram) |
| `cafe` | https://metallicus.com/cafe | Metallicus's own producer |
| `catsvote` | https://cats.vote | site returned error 525 on 10-15 |
| `cerebroai` | https://cerebro.host | Cerebro AI. Its site (read 10-16) says it runs infrastructure on XPR, Metal Blockchain (two validators), Akash and Decred, and publishes open-source templates for running and monitoring a Metal Blockchain validator on Akash |
| `chaininfra` | https://www.chaininfra.net | ChainInfra Arcade, vote tool |
| `cindronet` | https://cindro.net | also a Metal Blockchain validator (its site, 10-15) |
| `cryptolions` | https://cryptolions.io | Consortium member. A Web3 development studio that runs Jungle, the Vaulta (EOS) testnet (its site, 10-15). Serves an XPR API node (proton.cryptolions.io, listed in the XPR dev skill's endpoint table) |
| `danemarkbp` | https://danemarkbp.com |  |
| `energybp` | https://metalxpr.com/energybp | MetalXPR (Kryptallon) clean-energy tokens |
| `eosamsterdam` | https://proton.eosamsterdam.net | Consortium member. A founding EOS producer in the Netherlands that also produces for WAX, XPR, FIO, Telos, Europechain, Libre and Metal, with other services through Zaisan.io (https://eosamsterdam.net, read 10-16). The on-chain URL now forwards to that main site |
| `eosarabianet` | https://eosarabia.net |  |
| `eosiodetroit` | https://detroitledger.tech |  |
| `eosrio` | https://eosrio.io/proton/ | Independent producer in Rio de Janeiro. Its menu links Hyperion's GitHub and its SimplEOS wallet, and EOSUSA's site credits EOS Rio with developing the Hyperion history tool (both read 10-15). Its XPR page returned 403 on 10-15 |
| `eosusa` | https://eosusa.io/bp/proton/ | Public API + Hyperion endpoint. Its site (read 10-15) also lists DelphiOracle price feeds, chain backups/snapshots and IPFS services on the chains it serves |
| `genereos` | https://genereos.io | Consortium member; its site now brands as Genpool (multi-network staking) |
| `homebloksbp` | https://homebloksbp.com | BlastPad, Vibrr, XPredicting |
| `ledgerwiseio` | https://ledgerwise.io/proton | Site not readable in the browser used for this check (10-15) |
| `luminaryvisn` | https://luminaryvisn.com | Hyperion endpoint |
| `madblocks` | https://madblocks.tech | games, Pulse BP tool |
| `protonind` | https://proton.blocksindia.com | Blocks India: XPR Casino, XPR Radar |
| `protonmadrid` | https://eosiomadrid.io/proton | public API endpoint |
| `protonnz` | https://protonnz.com | SimpleDEX, XPR Agents, Shellbook and more; Consortium member |
| `protonuk` | https://protonuk.io | ProtonLive |
| `rockeronebp` | https://bp.rockerone.io | RockerOne, a developer and producer in Belgium. Its site (https://rockerone.io, read 10-16) shows products it builds: Railgun (sign once, then no wallet pop-up on every action), SignBox (an on-chain wallet for AI agents, ruled by a policy you own), Neard (music streaming that pays the artist on-chain every second) and, as work in progress, XPR-pos (point-of-sale crypto settlement) and FutureFresh (an NFT + AI social app). It says it runs public testnet and mainnet APIs. Runs the registered agent `rockerclaw` (XPR Agents registry, chain read 10-15). The on-chain URL now forwards to the main site |
| `saltant` | https://proton.saltant.io | public API, snapshots |
| `snipverse` | https://snipverse.io | Snipverse |
| `storexbp` | https://storex.io | Storex shop |
| `totalproton` | https://totalproton.tech | describes an e-invoicing project |
| `turtlebp` | https://turtlebp.online |  |
| `xprcore` | https://xprcore.com |  |
| `xprdata` | https://xprdata.org | XPR Network Dashboard, Whale Watcher, XPRDATA Sentinel; XPR Hub's BP of the Month for 2026-09 |
| `xprnodeonebp` | https://www.nodeone.io |  |

Recently stopped producing: `xprlabs` (last claim 2026-09-03), `simpleblock` (2026-08-24), `guild.nefty` (2026-04-28), `dappradar` (2025-11-26).

**The sources disagree twice:**
- The Consortium page says 40 active producers; Proton NZ counted 37 on 09-08.
- The governance docs say to submit grants on GitHub first, while the grant-framework README says the dashboard is the only route.

## 11. Communities and official channels

| Name | Type | Links |
|---|---|---|
| XPR Network | Official | X https://x.com/XPRNetwork · Telegram https://t.me/XPRNetwork (admins never DM) · Discord https://discord.gg/G7E8qggYEQ · Reddit https://reddit.com/r/XPRNetwork · news https://xprnetwork.org/news · help https://help.xprnetwork.org |
| Metallicus | Official | X https://x.com/MetallicusTDBN · https://linkedin.com/company/metallicus · https://youtube.com/@metallicusTDBN · Vimeo https://vimeo.com/metallicus |
| Metal X | Official | X https://twitter.com/MetalXApp · Reddit https://reddit.com/r/MetalXOfficial |
| KSTO ("Kulture Speaks Truth Onchain", per its FAQ) | Community: events, X Spaces, Snipverse and a vetted-token list | https://ksto.world · X https://x.com/Keep_Snipping · Telegram https://t.me/KSTOX · https://snipverse.com/kstoken · summary [KSTO.md](KSTO.md) |
| FunkyFVerse | Community (KSTO ecosystem) | X https://x.com/funkyfVerse |
| Cypher Gang | NFT community and CYPHR ecosystem | https://cyphergang.com · X https://x.com/CypherGangNFT · Telegram https://t.me/CypherGang · CYPHR.Market X https://x.com/CYPHRMARKET · MarketPulse X https://x.com/MarketPulseXPR |
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
| Official developer project list | XPR's docs page "Built with XPR Network": SDKs (Web, Swift, Kotlin), contract tools (TS contracts, IDE, Vert), core contracts (cron, RNG, oracle, long staking, resources) and demo apps (voting, document signing, Taskly). Some repos still carry old "proton-" names | https://docs.xprnetwork.org/built-with-xpr-network |
| ⚠ `github.com/metallicus` | **Not the company**: an unrelated personal account | — |

### Code found on GitHub, not confirmed as a live mainnet product
These repos mention XPR Network (GitHub search, 10-15). **Code existing is not a product being live:** check each one before relying on it.

| Project | What the code says | Link | Status |
|---|---|---|---|
| madblocks Metal Wallet | Windows wallet for Bitcoin/BTCVM and Dogecoin/DogecoinVM and the bridges between them, by the madblocks producer | https://github.com/Ambrotd/madblocks-Metal-Wallet | CODE (new 2026-10) |
| Alcor bridge indexer | Indexer for Alcor's bridge (created 2026-10-15) | https://github.com/alcorexchange/alcor-bridge-indexer | CODE |
| Tetra Grids projects | HUMAN (news boards, TRUE token), The Channel, Pure Liquid DEX (perps on Antelope), Hedgewaters (EASY-backed loans), XPR App Forge, speakEASY | https://github.com/TetraGrids · https://github.com/dougbutner | CODE |
| Ubitquity XPR tools | Telegram tip bot (UBITQUITY and nDAO defaults), XPR account verifier, token swap tool, UBQTY token. The company site's home page doesn't mention XPR | https://github.com/ubitquity · https://ubitquity.io | CODE / UNCLEAR |
| GCSC (Global Construction Smart Contract) | Construction-industry DAO, 14 contracts **deployed to XPR testnet only** | https://github.com/Melxisedek75/gcsc-website | TESTNET |
| ProtonPunkz | Pixel-art NFTs; Polygon first, XPR "secondary" | https://github.com/protonpunkz/ProtonPunkz | CODE / UNCLEAR |
| Dingleberry ($DINGLE) | Brand assets; the collection "The Dingleberries" trades on CYPHR.Market | https://github.com/dingleberrycoin/dingle-assets | NFTs LIVE; token contract not confirmed |
| ReLocke | Agentic ABIs, WebAuthn and GraphQL tools for Antelope chains | https://github.com/relocke | CODE |
| Arena escrow contract | XPR escrow contract for arena match settlements | https://github.com/hashstacking-maker/xpr-escrow-contract | CODE |
| Saltant tools | XPR Peer Probe (node diagnostics), AntelopeIO tools | https://github.com/Saltant | CODE |
| chaininfra courses | EVM-to-XPR migration course, key refresh, delegation demo | https://github.com/chaininfra | CODE |

## 12b. How things work: key facts (read at the official source 2026-10-15)
Live numbers can change: read the chain or the linked page before stating one, and give the time read.

**Zero gas fees and who pays:** users pay no gas. They get free CPU, NET and RAM for normal use. Block producers provide the capacity and are paid in XPR from inflation (21 active producers plus standby). Power users and dApps can buy RAM or rent CPU/NET at https://resources.xprnetwork.org, and dApps can stake resources for their users. Source: https://xprnetwork.org/blog/how-xpr-network-achieves-zero-gas-fees

**Network blocklist (official contract code, merged 2026-10-06).** XPR's token contract `eosio.token` now checks a shared, network-wide list kept by the `blocklist` contract, the same list `xtokens` already uses. A listed account **cannot send**; receiving is not blocked, and core system accounts (`eosio`, `eosio.token`, staking and fee accounts and others) are always exempt. Source: https://github.com/XPRNetwork/proton.contracts/commit/1e4132fb41a150403206f745de736ca67eb47f95 (PR #9). Whether the live mainnet contract already runs this code: not verified here. Live list: table `blocklist` on contract `blocklist` (47 accounts on 10-16). Being on the list says the network blocked the account, nothing more; this guide doesn't label anyone.

**Staking:** source https://xprnetwork.org/blog/xpr-network-staking-guide
- **Short staking:** WebAuth only, no minimum. You vote for up to 4 producers (the guide says you must pick 4 to claim rewards). Unstaking returns your XPR after a 24-hour lockup.
- **Long staking:** Explorer only, minimum 100 XPR, 90 or 365 days. The reward is tied to XPR's value in Bitcoin satoshis, not a fixed APY.
  - 90-day: extra XPR only if that value fell.
  - 365-day: extra XPR if it stays below 106% of the staked value.

**SimpleDEX launches** (Proton NZ). Source: https://simpledex.fun/llms-launches.txt (header v1.11; table updated for 10-15)
- **Token and fees:** 1,000,000,000 max supply per token, 80% on the bonding curve and 20% for the DEX pool. Buy fee 1% and sell fee 1%; the creator gets 50% of fees and the treasury 50%. **Creators get no token allocation.**
- **Creation fee:** 20,000 XPR (live: `simplelaunch` table `fees`).
- **Anti-snipe windows:** creator-only for the first **120 seconds** (changed from 60 on 2026-10-15; live: `simplelaunch` table `antisnipe`, field `creatorOnlyPeriodSec`). Then 5 minutes capped at 5,000 XPR per buy, then open. The doc's field notes still say "default 60"; the chain read 120 on 10-15. The chain wins.
- **Graduation:** at 50,000 XPR on the curve, after a 5-minute cooldown; anyone can trigger it. It creates a pool seeded with the XPR and the 20%. Buyers then `claim`. **Measured by GUARD.IAN, not stated in the official docs:** if sells drop the curve back under 50,000 XPR during the cooldown, the countdown starts over (the token's `simplelaunch::gradready` row is cleared and set again on the next crossing; seen on mainnet launches since 2026-09-15). Read `gradready` live before quoting a graduation time.
- **Supply after graduation:** unsold curve tokens are never minted and there is no admin mint, so most graduated tokens circulate 700–750M, not 1B. Burns go to `token.burn`.

**LOAN lending.** Source: https://raw.githubusercontent.com/XPRNetwork/xpr-network-dev-skill/main/skill/loan-protocol.md
- **Contracts:** main contract `lending.loan` (not `lending`). L-token shares on `shares.loan`. LOAN token on `loan.token` (4 decimals).
- **Collateral factors** include XPR 40%, XUSDC 80%, XMD 90%. The health factor below 1.0 is liquidatable. Liquidation incentive 10% and close factor 10% (global).
- **LOAN max supply is unbounded** (max_supply 0); about 114.2 billion circulated in Sept 2026. An older doc said 100M and was corrected. Read live with get_currency_stats on `loan.token`.

**Metal Dollar (XMD) backing.** Source: https://metaldollar.com and https://dollar.metalx.com/treasury-cryptos
- **How it works:** minted and redeemed 1:1 against basket stablecoins (USDC, PYUSD, USDP) on XPR, Ethereum and Metal Blockchain. The Metal DAO reviews basket assets.
- **Treasury snapshot** shown on 10-15 (block 400,002,261, Aug 25): XUSDC about 96.47% of the treasury against a 60% target; PYUSD and USDP about 0%. Check the live treasury page for current figures.

## 13. Named elsewhere, not yet confirmed at their own site (UNVERIFIED)
These are from [BP]. Check before citing:
- ~~A-DEX (bpadex)~~ → confirmed 10-15, section 2
- ~~Storex (storexbp)~~ → read 10-15, section 7 (UNCLEAR)
- XPR Escrow and Crypto Travel Deals (homebloksbp)
- Neard music streaming and a session protocol called Railgun, which is not the Ethereum RAILGUN (rockeronebp)
- ~~XPR Dashboard and Whale Watcher (xprdata)~~ → confirmed 10-15, section 7
- ~~XPR Whales Alert (brotonbp)~~ → confirmed 10-15, section 7
- XPR Tax Time Machine (danemarkbp): danemarkbp.com showed only server specs on 10-15
- ~~XPR Hub (artwebin)~~ → confirmed 10-15, section 3
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
- **"Cypher Market" is also the name of an unrelated darknet market.** Most web results for that name are about it. Cypher Gang's marketplace is **CYPHR.Market** (cyphr.market).
- CYPHR (`CYPHR@tokencreate`, Cypher Gang) is not "Cypher" / CYPR listed on CoinMarketCap.
