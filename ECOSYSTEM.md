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
| Metal Pay | Card on-ramp to buy crypto; XPR in the US, Australia and New Zealand. Fees, identity check and Metal Pay Connect: §1c | https://www.metalpay.com · how to buy XPR https://www.metalpay.com/how-to-buy/xpr-network · help https://help.metalpay.com/hc/en-us | LIVE |
| WebAuth | The official XPR Network wallet, made by Metallicus: self-custody, biometric signing, staking and voting | https://webauth.com · https://metallicus.com/individuals/webauth · what the app loads: §12c | LIVE |
| Metal Dollar (XMD) | Dollar stablecoin backed by a basket of stablecoins, minted and redeemed 1:1. Metal X's quote currency. **On XPR: `XMD@xmd.token`, 6 decimals, issuer `xmd.treasury`** (developer token registry and chain, read 10-16). **On Ethereum since 2026-09-26** (official announcement): contract `0xA6707A8A00E94d1834cCdA2856C9Cf948941078d`, with USDC, PYUSD, USDP and RLUSD as its reserve assets there. Read on Ethereum 10-15: name "Metal Dollar", XMD, 6 decimals, supply 142.247121. The two official pages disagree: metaldollar.com/networks (read 10-15) still says the Ethereum contract "should be published" later, while the announcement publishes it. Both are Metallicus pages; the announcement is the newer. How minting works, the live treasury and governance: §1c | https://metaldollar.com · Ethereum announcement https://metaldollar.com/blog/metal-dollar-on-ethereum · Ethereum app https://eth.metaldollar.metalx.com/mint-n-redeem · networks https://metaldollar.com/networks | LIVE |
| Metal Blockchain | Layer 0 for institutions. Metallicus's developer page (read 10-16) lists: EVM-compatible contracts (Solidity), **sovereign subnets** with their own membership rules and token economics, **"Up to 4,500 TPS per subnet"**, and proof-of-stake validators. It is pitched for private blockchains, digital identity and on-chain records. Mainnet live since Oct 18, 2022 (newsroom) | https://metalblockchain.org · docs https://docs.metalblockchain.org · explorer https://explorer.metalblockchain.org · developer page https://metallicus.com/developers/metal-blockchain · whitepaper https://cdn.metalblockchain.org/MB%20Whitepaper-compressed.pdf | LIVE |
| Metal L2 | Ethereum L2 on the OP Stack (chain 1750, public RPC https://rpc.metall2.com per docs.metall2.com/chain/networks; live reads with the connector's `evm_chains` tool); MTL is moving to it as gas ("Homecoming"). Metallicus's developer page (read 10-16): EVM-equivalent and "Built on the Superchain using the OP Stack". ETH and ERC-20 bridging, with deposit and withdrawal flows. Its whitepaper says it connects Ethereum chains to TDBN (§1a) | https://metall2.com · explorer https://explorer.metall2.com · docs https://docs.metall2.com · developer page https://metallicus.com/developers/metal-l2 | LIVE |
| PulseVM | Metallicus engine for running XPR-style contracts on Metal Blockchain. **No cutover date has been announced** | code https://github.com/MetalBlockchain/pulsevm · docs (community, by Paul Grey) https://pulsevm.dev · StandGuard summary https://standguard.net/projects/pulsevm | Code LIVE; network not live |
| BTCVM / LTCVM / DogecoinVM | Bitcoin, Litecoin and Dogecoin chains running on Metal Blockchain, each pegged 1:1 to the real coin through a bridge (its own site). **Alpha** per Metallicus's Q3 2026 report. **DogecoinVM's own README (MetalBlockchain/dogecoin-vm @ cfb9dad, 2026-10-13):** "the code has not been audited, the chain has one validator, and one operator holds every peg signer key. Keep amounts small." Deposits capped at 100 DOGE, at most 4,200 DOGE circulating. **Deposit credit:** after 6 to 20 Dogecoin confirmations depending on size, never fewer than 6 on mainnet; at most 10 DOGE in total is credited before full confirmation (README.md:56; metaldoge.com/docs). **Pause:** each signer can be paused locally. A signed remote pause is built into the signer software but needs transport pins the live signer set does not carry yet, so it is not usable today; and a pause stops the software, not someone who holds the keys (docs/RUNBOOK.md:54-71 @ cfb9dad). **Paying a `D...` address (DIP-21, docs/dip-0021.md:80-82):** `dogecoin:` means Dogecoin, `dogecoinvm:` means DogecoinVM, the same address can be valid on both, and for a bare address with no scheme a wallet that supports both must ask which chain and never guess | DogecoinVM https://metaldoge.com · BTCVM https://metalbtc.com · LTCVM https://metalltc.com · code https://github.com/MetalBlockchain/dogecoin-vm · https://github.com/MetalBlockchain/btcvm · Q3 report https://www.metallicus.com/blog/metallicus---2026-q3-report | Alpha (sites load, 10-16) |
| XPR Network NFT Market | Gasless NFT market from the Metallicus team, priced in XUSDC | https://nft.xprnetwork.org | UNCLEAR (no listings visible) |
| XPR Network Explorer | Accounts, tokens, block producers, voting (formerly bloks.io) | https://explorer.xprnetwork.org · testnet https://testnet.explorer.xprnetwork.org | LIVE |
| FedNow listing | Metallicus in the Federal Reserve's FedNow explorer / Innovator Exchange | https://explore.fednow.org/explore-the-city?id=10&postId=121&vendor=metallicus-inc | LIVE |
| Stablecoin pilot for credit unions | Metallicus's programme for an institution to issue and test its own branded stablecoin (the page doesn't use the word white-label; §1c) | https://metallicus.com/institutions/stablecoin-pilot | LIVE |
| Quarterly reports | CEO's quarterly summaries | https://metallicus.com/news · Q3 2026: https://www.metallicus.com/blog/metallicus---2026-q3-report | LIVE |

### 1a. Metallicus, the company (its own pages, read 2026-10-16)
- **What it is:** Metallicus says it "builds infrastructure for real-time money movement" for financial institutions, developers and individuals. It is the company behind Metal Pay, Metal Dollar, WebAuth, Metal X, XPR Network, Metal Blockchain and Metal L2. Mission statement: "To empower global access to traditional banking and digital assets." The team works fully remote. Sources: https://metallicus.com/llms.txt · https://metallicus.com/company
- **Leadership (team page):** https://metallicus.com/company/meet-the-team
  - Marshall Hayner, Co-Founder & CEO. The page says he built the first Facebook Bitcoin wallet and sits on the Dogecoin Foundation board.
  - Glenn Mariën, Co-Founder & CTO. Creator of Dogechain.info.
  - Irina Berkon, CFO.
  - Karen McHenry, VP of Product.
  - Maura Wilder, VP of Engineering.
  - John Ainsworth, General Manager. Former President and CEO of Bonifii, which Metallicus acquired.
  - Ozgur Baykara, Head of Regulatory Compliance.
  - Frank Mazza, Director of Blockchain for Institutions & Fintechs.
  - Paul Grey, Business Development Manager. He also runs Proton NZ (§2, §10).
  - **Advisory board:** Mark Carawan (former Citigroup Chief Compliance Officer), Sergio Rodriguera Jr (former AI consultant to the Federal Reserve Bank of Boston) and Marc F. Joseph (former Managing Counsel at BNY Mellon).
- **For banks and credit unions:**
  - Metal Pay Enterprise and Metal Pay Connect: digital-asset infrastructure and embedded Metal Pay.
  - Metal Identity.
  - An Innovation Program and the Stablecoin Pilot (§1).
  - **MemberPass®:** biometric identity built for credit unions. The page says CULedger (Bonifii) was acquired by Metallicus. https://metallicus.com/memberpass
  - **CrossState program:** "Innovation Program 2.0" with the CrossState Credit Union Association. It offers education, a stablecoin sandbox and pilots for member credit unions. https://metallicus.com/crossstate
  - Product index: https://metallicus.com/llms.txt
- **TDBN** = "The Digital Banking Network": Metallicus's name for its network of financial institutions. Metal L2 connects Ethereum-based chains to it (whitepapers page).
- **Recent official news (newsroom):** SOC 2 Type I assessment completed (Aug 18, 2026). 2026 Q2 report (Jul 6, 2026). "Full-stack digital-dollar infrastructure for banks and credit unions" (Jun 23, 2026). https://metallicus.com/news
- **Whitepapers** (https://metallicus.com/company/whitepapers):
  - **XPR Network v2.0**, which calls it "a layer 1 delegated proof-of-stake (DPoS) blockchain": https://cdn.metallicus.com/XPR_Network_Whitepaper_v2.0.pdf
  - **Metal DAO v1.0**: founded 2017 per this page, run by MTL holders (the paper itself says MTL was founded in 2016; §1c). https://cdn.metallicus.com/Metal_DAO_Whitepaper_v1.0.pdf
  - **Metal Dollar v1.1**: basket of USDC, PYUSD and USDP, governed by the Metal DAO. https://cdn.metallicus.com/Metal_Dollar_Whitepaper_v1.1.pdf
  - **Metal L2 v1.0**: OP Stack. https://cdn.metallicus.com/Metal_L2_Whitepaper_v1.0.pdf
    - What the paper says (undated, read 2026-10-16): an Ethereum layer 2 built as an optimistic rollup on the Optimism stack, aiming to join the Optimism Superchain; MTL "could be used" for gas; WebAuth signing, Metal X, decentralized identity and Metal Pay on Metal L2.
    - Its token section is a **proposal**: raise MTL from 66,588,888 to 78,588,888 through three 6,000,000 MTL grants (an L2 incentive paid in three tranches, a one-time sequencer grant, and 6,000,000 MTL every year to the elected core developer), with first-year inflation of 7.634%, falling each year. Whether this was adopted is not verified here.
    - It gives the MTL v2 Ethereum contract as `0x709c999b4Bc5d19B5a2EE30297129D5aB4AAe454` (v2 audit at migrate.metall2.com) and an OpenZeppelin audit for v1. Later direction: the MIP-002 Homecoming proposal (SOURCES.md §4).
  - **Metal Blockchain v1.2**: layer 0. https://cdn.metallicus.com/Metal_Blockchain_Whitepaper_v1.2.pdf
    - What the paper says (undated; the PDF is over 10 MB, so this connector can't open it; read 2026-10-16 through a summarising page reader, so check the PDF for exact wording): a permissionless layer 0 built on Avalanche's Snow consensus family, with an A-Chain (Antelope, XPR Network), C-Chain (EVM), P-Chain (validators and subnets) and X-Chain (assets). METAL is hard-capped at 666,666,666: Metal Foundation 142,333,333, founders 71,000,000, MTL conversion 120,000,000, staking rewards 333,333,333. Fees are burned.
    - Staking per the paper: validators at least 2,000 METAL for 14 to 365 days, delegators at least 25 METAL, rewards need 80% uptime.
    - **The live chain agrees on the minimums** (`metal_blockchain`, read 2026-10-16): validator 2,000 METAL, delegator 25 METAL; total staked 129,019,075 METAL; the node's supply upper bound is 375,692,052 METAL.
    - The paper contradicts itself in two places: the conversion allocation is 120,000,000 METAL, but the conversion text caps it at 60,000,000 MTL; and it gives both 80% and 81% for the validator share a hard fork needs.

- **Timeline from the newsroom headlines** (https://metallicus.com/news, read 10-16; each line is the headline and its date):
  - **2022:** "(Re) Introducing Metallicus" (Aug 3). Advisory board introduced (Aug 4). LunarCrush expands to XPR Network (Aug 29). Metal Pay API launched (Sep 20). **Metal Blockchain mainnet live (Oct 18).** Checkout.com partnership (Dec 15).
  - **2023:** partnership with Swiss market maker flovtec (May 15). Metal Blockchain, WebAuth and the Metal Pay API on Temenos Exchange (Sep 7). Metal Blockchain joins the Jack Henry Vendor Integration Program (Sep 12). Card and ACH processing with Fiserv technology (Oct 4).
  - **2024:**
    - Vibrant, FAIRWINDS and Meritrust credit unions join Metal Blockchain's Banking Innovation Program (Mar–May).
    - Metal Blockchain joins the U.S. Faster Payments Council (Oct 2).
    - Metallicus supports the FedNow® Service (Oct 22).
    - **Metallicus acquires Bonifii, "Connecting 70+ Credit Unions" (Dec 21).**
  - **2025:**
    - Payfinia partnership (Feb 25). MD|DC Credit Union Association joins the innovation program (May 7).
    - **Stablecoin Pilot Program for credit unions launched (Jun 16).** Daland CUSO partnership (Aug 5).
    - First platform partner in Velera's Digital Asset Lab (Aug 20).
    - **St. Cloud Financial Credit Union "to Launch First Credit Union Stablecoin" (Sep 16).**
    - Cornerstone League partnership (Oct 9). InvestiFi alliance (Nov 3).
    - One Nevada (Nov 25) and Arizona Financial (Dec 4) credit unions join the stablecoin pilot.
  - **2026:** FedNow Request for Payment (RFP) certification (Feb 27). **CrossState pilot with 50 credit unions (May 14).** Digital-dollar infrastructure update (Jun 23). **SOC 2 Type I completed (Aug 18).** Q3 report (Oct 5).
  - Quarterly reports run from 2023 Q1 to 2026 Q3.

### 1b. XPR Network's official roadmap ("2025 and beyond", read 2026-10-16)
Source: https://xprnetwork.org/roadmap. The page gives no dates.
- **Only one item shows a status:** "WebAuth – Fiat Ramp", **"In development"**. It is a card on-ramp inside WebAuth, starting in the US, Australia and New Zealand.
- **The other items carry only a "CORE DEV" label, with no status:**
  - WebAuth: Portfolio View, UX improvements, in-app DeFi features, a new wallet connection flow.
  - **Biometric Key Recovery.**
  - **A-Chain Upgrade.**
  - AI Tools.
  - **Futures Trading.**
  - More trading pairs on Metal X.
  - A new block explorer.
  - Stablecoin POCs.
  - XPR Network Invoicing.
  - Expanded fiat ramps.
  - An ISO 20022 compliance demo.
  - An Ethereum NFT bridge.
  - "The New Home of XPR Network".
  - The governance dashboard.
- **One bounty item:** WooKey (WebAuth for WooCommerce).
- **"A-Chain" is on the official roadmap, with no date.** That makes this the official source for the name. For the PulseVM side, see §1 PulseVM and §12b.
- **An older official page** (governance docs, "last updated 3 years ago") claims 4,000 transactions per second, and describes WebAuth, Metal X, lending and the original "XPR Network Market" NFT market. https://gov.docs.xprnetwork.org/xpr-network/xpr-network-and-ecosystem

### 1c. Metal Dollar, Metal DAO, Metal Pay and the institution pages: the details (read 2026-10-16)

**Metal Dollar (XMD): how it works**
- **Minting is not buying.** You deposit a supported reserve asset into the Metal Dollar treasury and get XMD at a fixed 1:1 protocol rate. Redeeming returns XMD for an available reserve asset, also 1:1. Buying XMD on a market is a separate trade at the market price. Availability, account verification and network support still apply. Source: https://metaldollar.com/how-it-works (page undated).
- **Networks:** Ethereum, XPR Network and Metal Blockchain (https://metaldollar.com, undated). The Ethereum contract is in §1.
- **The live XPR treasury: contract `xmd.treasury`, table `tokens`, read 2026-10-16.**
  - It holds four reserve assets. Minting and redeeming are switched on for all four, and the mint fee and the redemption fee are both 0.
  - Each asset has a maximum share of the treasury and a `minSupply` setting:

    | Reserve asset | Max share of the treasury | `minSupply` |
    |---|---|---|
    | `XUSDC@xtokens` (USD Coin) | 60% | 10,000,000 |
    | `XPYUSD@xtokens` (PayPal USD) | 15% | 1,000,000 |
    | `XPAX@xtokens` (Pax Dollar, USDP) | 15% | 1,000,000 |
    | `MPD@mpd.token` | 2% | 100,000 |
  - **XPAX is USDP.** It keeps USDP's old name, Paxos Standard (PAX), and is not Pax Gold, PAXG (https://metaldollar.com/reserves, undated).
  - ~~**What MPD is: unverified.**~~ (superseded 2026-10-16) The Metal Dollar article of 2026-08-28 mentions "a separate MPD reserve line" and doesn't explain it. On the chain, MPD@mpd.token has a supply of 100,008 and its issuer is `mpd.token`. It is not in XPR's developer token registry.
  - **What MPD is (read 2026-10-16):** the **Metal Pay Dollar**. Metallicus's Q2 2025 quarterly report calls it an internal prototype for managing liquidity across the Metallicus ecosystem, added to the Metal Dollar basket and "held exclusively by Metallicus wallets" during a controlled rollout. Source: https://cdn.metallicus.com/Q2_2025_Metallicus_Report.pdf (page 7). Newer reports (2026 Q1, Q2) don't mention it; the Q1 2026 PDF has no readable text.
    - The official XMD agent skill lists MPD (contract `mpd.token`) as collateral with a 2% treasury cap, oracle feed MPD/USD, mint and redeem (XPRNetwork/xpr-agents @ a7410e9, `openclaw/skills/xmd/SKILL.md`, line 24).
    - On the chain (2026-10-16): the `oracles` feed MPD/USD (index 20) has one price provider, last updated 2025-07-03. The `mpd.token` contract has a pause switch (`pausempd`; `global` table: not paused) and a `claimtoken` action.
  - **Contract settings (table `xmdglobals`):**
    - the contract is not paused;
    - the fee account is `fee.metal`;
    - `minOraclePrice` is 0.995. None of the sources read explain what this setting does.
- **Read balances live; don't copy old figures.**
  - Read `xmd.treasury`'s token balances and the XMD supply (`xmd.token`) live.
  - metaldollar.com's reserve box is a "Verified preview snapshot" from block 400,002,261 on Aug 25, not a live feed.
  - On 2026-10-16 the chain showed an XMD supply of 2,829,944.72 (live at that moment).
- **Reserve assets Metal DAO has voted on** (https://metaldollar.com/governance, undated):
  - A yes vote only approves the next stage. Technical work, checks and readiness come before an asset goes live.
  - **Live:** PYUSD (proposal #138, Aug 2023).
  - **Addition approved, not live:** RLUSD (#221, Dec 2024) and GUSD (#286, Nov 2025).
  - **Evaluation approved, not live** (proposals #321 to #327, Jun to Aug 2026):
    - MoneyGram's MGUSD
    - SoFi Bank's SOFID
    - Fidelity Digital Assets' FIDD
    - Open Standard's OUSD
    - Fiserv's FIUSD
    - Western Union / Anchorage Digital's USDPT
  - On XPR, RLUSD is not in the live treasury (chain, 10-16). The Ethereum announcement does name RLUSD as a reserve asset on Ethereum (§1).
- **Older documents name a different basket and rules.** Newest first; the chain wins:
  1. **Live chain and metaldollar.com (2026):** USDC, PYUSD and USDP, plus the MPD line on the chain.
  2. **Metal Dollar whitepaper v1.1 (undated):**
     - Its abstract names USDC, PYUSD and PAX, but its sections 3.1 and 4.1 name USDC, TUSD and PAX.
     - It says a proposal needs a 40% quorum.
     - It describes no reserve attestation or audit, and no plan if a basket stablecoin loses its peg.
     - Link: https://cdn.metallicus.com/Metal_Dollar_Whitepaper_v1.1.pdf
  3. **Metal DAO whitepaper v1.0 (undated):** it names "USDC, TUSD, PAX, and USDT" as examples of basket stablecoins, and gives a 3% quorum. https://cdn.metallicus.com/Metal_DAO_Whitepaper_v1.0.pdf

**Metal DAO**
- **What it is:** MTL holders decide on Metal Dollar. On XPR the token is `XMT@xtokens` (§8). Votes happen at https://gov.xprnetwork.org (community 4). The Metal DAO whitepaper says there is no governance on Ethereum.
- **Live rules, from the chain** (`gov` contract, table `communities`, row 4 "Metal DAO", read 2026-10-16):
  - voting strategy `xmt-balances`: one XMT is one vote;
  - publishing a proposal costs 100 XMT;
  - quorum 300, meaning 3%. The server's governance tool reads this field as hundredths of a percent, per the official XPR Agents governance skill.
- **The governance docs agree with the chain:** 100 XMT a proposal, 3% quorum (changeable by vote), one XMT one vote. Source: https://gov.docs.xprnetwork.org/communities/metal-dao (last updated about a year ago).
- **What a proposal can change** (same docs):
  - add or remove basket stablecoins (Metallicus runs a compliance review on each new one);
  - the minimum supply per stablecoin;
  - a swap fee (none today);
  - the 50,000 XMT admission fee, which goes to the `xprtreasury` account.
  - Changes to the smart contract itself are out of scope.
- **From the Metal DAO whitepaper v1.0 (undated):**
  - **Supply:** MTL's maximum is 66,588,888, "hard-capped" and fully handed out.
  - **History:**
    - Metal Pay launched in 2018 and paid MTL rewards ("Proof-of-Processed-Payments"); that ended in September 2021.
    - The XPR token became XMT in 2020.
    - Metal Dollar launched on XPR in July 2022.
    - The governance platform launched in June 2023.
  - **Founding date, two Metallicus sources disagree:** the whitepaper says MTL was founded in 2016. The whitepapers page (https://metallicus.com/company/whitepapers, undated) says Metal DAO was "Founded in 2017".

**Metal Pay and Metal Pay Connect** (official help center: https://help.xprnetwork.org/hc/en-us/sections/33629400773143-Metal-Pay-Connect)
- **What Connect is:** a one-step card on-ramp. You buy crypto by card and receive it straight to an XPR Network @name.
  - Signing up through Connect also creates a Metal Pay account (article dated 2025-07-22).
  - Metal L2's docs call it a "plug & play" fiat on-ramp connected to TDBN (§1a): https://docs.metall2.com/builders/metal-pay-connect. Its developer docs are at connect-docs.metalpay.com (not opened here).
- **Where it works:** the United States and its territories, Australia and New Zealand (article updated 2025-07-22).
- **Fees** (help articles dated 2025-07-22; check the app for today's fees):
  - **Trading fee:** 2% to buy or sell most coins. The article gives these rates for buying (it doesn't say what selling them costs):
    - BTC: 0.5%
    - MTL, XPR, LOAN and METAL: 0.5%
    - USDC: 0%
    - LTC, HBAR, XLM and XRP: 3%
  - **Holding MTL lowers the trading fee:** 2,000 MTL gives 25% off, 4,000 gives 50% off, and 10,000 means no trading fee. The Metal DAO whitepaper gives the same tiers.
  - **Card processing, charged on top:**
    - United States: debit 2.5%, credit 3.5%.
    - Everywhere else: 4.5% on both.
- **Identity check** (article dated 2025-07-22). You give:
  - card details and a billing address;
  - your legal name and a phone number that gets a text code;
  - your Social Security Number;
  - a photo of a government ID or passport;
  - a live selfie;
  - then six questions.
- **Not allowed:** VOIP phone numbers, VPNs or proxies, more than one account, prepaid debit cards, and handing an account to someone else. Only US customers can link a VISA card.
- **Tax documents (new section 2026-09-22, 11 articles, updated to 2026-10-09):** Metal Pay may send US customers **Form 1099-DA** for digital-asset sales from 2025 on: 2025 forms show gross proceeds without cost basis; cost basis can follow for 2026 and later. Metal Pay works with TaxBit, uses FIFO for cost basis, and asks users to certify a W-9 (US persons) or W-8BEN (foreign persons). Receiving the form doesn't by itself mean tax is owed; Metal Pay gives no tax advice. Source: https://help.metalpay.com/hc/en-us/sections/43679786096407-Tax-Information-Documents
- **One name, two products.** The help center's "Metal Pay Connect" is this consumer on-ramp. Metallicus's institutions page uses the same name for payment routing between banks' existing rails and blockchains (https://metallicus.com/institutions/metal-pay-connect, undated).

**The institution pages** (metallicus.com, all undated, read 2026-10-16)
- **Banks and credit unions** get the same offer:
  - **Five parts:**
    - Metal Pay Enterprise, a white-label API;
    - Metal Blockchain;
    - the Stablecoin Pilot;
    - optional wallet and identity layers;
    - optional trading and lending.
  - **Five rollout stages**, from a discovery session to go-live.
  - **What's missing:** no prices and no customer results. Compliance is mentioned only in general words; no regulator, licence or audit is named on these pages. The SOC 2 Type I news is in §1a.
  - Pages: https://metallicus.com/institutions/banks · https://metallicus.com/institutions/credit-unions
- **Credit unions whose logos are shown** (logos only, no case details):
  - **Institutions page:** Fairwinds, OneAZ, Excite, GreenState, Directions, TDECU, Vibrant, Cornerstone, MDDC and the GoWest Credit Union Association. https://metallicus.com/institutions
  - **Innovation Program and Stablecoin Pilot pages:** Sound, One Nevada, Gesa, Bay Federal, Desert Financial, Cornerstone, CrossState, MDDC and GoWest.
- **Innovation Program:** education, a sandbox and use-case work on payments, identity, stablecoins and AI. No cost is stated. https://metallicus.com/institutions/innovation-program
- **Stablecoin Pilot:** an institution issues and tests its own branded stablecoin in a controlled setting. It covers mint and burn, payment flows and wallet connections. No chain, reserve custodian or cost is named. https://metallicus.com/institutions/stablecoin-pilot
- **Stablecoins page:** institution-branded stablecoins, mint and burn controls, links to reserve custody providers (none named) and public, private or hybrid networks. https://metallicus.com/institutions/stablecoins
- **FedNow Integration:** real-time payments through a direct FedNow connection. The page names no certification. The newsroom separately lists a FedNow Request for Payment certification (Feb 27, 2026; §1a), and Metallicus is in the Federal Reserve's FedNow explorer (§1). https://metallicus.com/institutions/fednow
- **Metal Identity:** identity for users, systems and AI agents. This page doesn't mention MemberPass. https://metallicus.com/institutions/metal-identity

## 2. DEXs, launchpads and DeFi

| Name | What it is | Link | Run by (as stated) | Status |
|---|---|---|---|---|
| Alcor Exchange | Multi-chain DEX (XPR, WAX, Vaulta, Telos), with XPR pools, order books and farms | https://alcor.exchange/v/xpr · https://proton.alcor.exchange | Alcor (own team) | LIVE |
| SimpleDEX | AMM swaps plus bonding-curve token launches (contracts `simpledex`, `simplelaunch`). **Not a Metallicus product:** it is one of Proton NZ's projects, and Proton NZ is a block producer operating through Proton NZ LTD in New Zealand (protonnz.com, read 10-16). Proton NZ's Paul Grey is also listed on Metallicus's team page as its Business Development Manager (read 10-16). **Audit:** SimpleDEX's own reference says "Audited Feb & Mar 2026" with guardian monitoring and auto-pause on unusual pool drains; it names no firm and links no report (https://simpledex.fun/llms-reference.txt, v1.11, read 10-16). For the report itself, ask Proton NZ | https://simpledex.fun · docs https://simpledex.fun/llms.txt · https://protonnz.com | Proton NZ (block producer; not Metallicus) | LIVE |
| BlastPad ($BLPAD) | Token launches, airdrops, staking pools | https://blastpad.io | homebloksbp [BP] | LIVE |
| XPredicting | Prediction market | https://xpredicting.com | homebloksbp [BP] | UNCLEAR |
| A-DEX | Multi-chain Antelope DEX (swap, analytics, whale signals, a price oracle) with an XPR front end | https://xpr.a-dex.io | A-DEX (producer `bpadex`) | LIVE (read 10-15) |
| Price Battle | Price-prediction game | https://proton.link/battle | Proton NZ [PJ] | LIVE |
| MarketPulse | On-chain UP/DOWN prediction rounds on XPR/USD, BTC/USD and ETH/USD, staked in XPR, settled by an on-chain price oracle after 24 h. Fee 10% of winnings (3% for Cypher Gang NFT holders) goes to buying back and burning CYPHR. The site says the contract was audited by Bloxprod BP and calls itself experimental. **Its own risk notice (read 10-16): "You may lose the XPR you stake"; predictions are final (no cancelling or switching sides); draws and one-sided rounds are refunded.** Daily rounds lock at 16:00 UTC | https://cyphergang.com/predictions · X @MarketPulseXPR | Cypher Gang | LIVE (read 10-15) |

DefiLlama tracks three XPR protocols (read 10-15): Metal X about $49.3M, Alcor about $432K, SimpleDEX about $180K TVL. Source: https://defillama.com/chain/xpr-network. Figures move; cite the page and the time.

### 2a. Who actually uses what (Proton NZ's on-chain census, snapshot 10 Sep 2026)
From Proton NZ's post "The State of XPR Network Block Producers" (8 Sep 2026), https://www.protonnz.com/blog/state-of-xpr-block-producers. **Proton NZ ranks its own projects in this post**, which it discloses. The table counts the distinct accounts that used each dApp's contract over the six months to 10 Sep 2026: a full census of 10.9 million actions.

| dApp | Run by (producer account) | Distinct users, 6 months |
|---|---|---|
| Metal X swaps | `cafe` (Metallicus) | 5,638 |
| Vibrr | `homebloksbp` | 4,553 |
| LOAN lending | `cafe` | 4,196 |
| Metal X order book | `cafe` | 2,366 |
| Chain Runner Game | `protonnz` | 1,725 |
| Snipverse | `snipverse` | 854 |
| SimpleDEX | `protonnz` | 755 |
| BlastPad | `homebloksbp` | 715 |
| XPR Casino | `protonind` | 85 |
| XPR Agents | `protonnz` | 30 |

- The same post counted shipped XPR dApps per producer: `protonnz` 12; `cafe` and `homebloksbp` 5 each; `alvosec` 4; `protonind` 3; `madblocks`, `rockeronebp`, `bloxprod`, `xprdata` and `chaininfra` 2 each. It says 18 of the 36 producers other than Proton NZ ship at least one.
- **Read-only tools** (trackers, tax tools, alert bots) don't show up in contract counts.
- Its GeneroX example: 33 on-chain actions, yet about US$59,000 in donations from 68 people. Counts aren't value.
- **Announced but not working on 8 Sep:** cindronet's WezaPay and ledgerwise's tools subdomain.
- ChainInfra's arcade game is named "Blockchain Pop" (match-3, daily XPR prizes, arcade.chaininfra.net), and its vote-delegation tool is at vote.chaininfra.net.

## 2b. Getting XPR: where it trades, wallets, moving it

Read 2026-10-15. This answers "where does XPR trade and how do I move it safely". It is not advice to buy anything.

- **Where XPR trades: two sources, neither complete.**
  - **XPR's help center, "What Exchanges support XPR Network Mainnet?"** (last updated 2025-05-24) lists six places that accept XPR on XPR Network itself, with the deposit account to send to: Metal Pay `@metalpay.com`, KuCoin `@kucoindotxpr`, Bithumb `@bithumbxprr1`, Gate.io `@gatedeposit`, HitBTC `@hitbtcxprins`, CoinEx `@coinex2zmoon`. It says to check the exchange's account has the verified checkmark, because transfers can't be undone. https://help.xprnetwork.org/hc/en-us/articles/4417597596439
  - **An older help article, "Where Can I Buy XPR Network (XPR)?"** (updated 2025-04-05) lists 16 places, including Uniswap and PancakeSwap (the Ethereum and BNB Chain tokens below) and Liquid. https://help.xprnetwork.org/hc/en-us/articles/4417459294615-Where-Can-I-Buy-XPR-Network-XPR
  - **CoinGecko's live market list** (read 2026-10-16 00:21 UTC) showed 14 XPR markets: KuCoin, Metal X, Gate, MEXC, BloFin, Ourbit, DigiFinex, Bithumb, KCEX and Hibt, plus Uniswap pools for the Ethereum and BNB Chain tokens, one of them flagged stale. HitBTC and CoinEx were not on it. CoinGecko doesn't say which chain an exchange uses for deposits. Market list: CoinGecko `xpr-network`, CoinMarketCap `proton`.
- **Memo IDs.** XRP, XLM, HBAR and Stellar USDC need a Memo ID (tag) when you deposit them to or withdraw them from WebAuth; a missing or wrong memo can lose the funds for good (help article, updated 2026-06-22: https://help.xprnetwork.org/hc/en-us/articles/30861793921687).
- **Reading the help center.** Its web pages block automated readers, but its public API returns each article in full: list https://help.xprnetwork.org/api/v2/help_center/en-us/articles.json (paged), one article https://help.xprnetwork.org/api/v2/help_center/en-us/articles/ARTICLE_ID.json (the number in the article's URL). 141 articles on 10-16.
- **XPR on other chains (read on those chains 10-15; readable live with the connector's `evm_chains` tool since 2026-10-16).** XPR also exists as an ERC-20 token on Ethereum (`0xd7efb00d12c2c13131fd319336fdf952525da2af`) and a BEP-20 token on BNB Chain (`0x5de3939b2f811a61d830e6f52d13b066881412ab`). These are the contracts the help article links for Uniswap and PancakeSwap. Both contracts report name "Proton", symbol XPR, 4 decimals and a total supply of 10,000,000,000. They are tokens on other chains, not native XPR.
- **Moving XPR to a WebAuth wallet.** The withdrawal address is your WebAuth username without the "@", and there are no gas fees (help article, updated 2026-06-08: https://help.xprnetwork.org/hc/en-us/articles/4410313664407-How-do-I-withdraw-XPR-to-my-WebAuth-Wallet-from-an-exchange-over-XPR-Network). A WebAuth address is an @name, not a 0x address, so the withdrawal has to go out on XPR Network itself, not as the Ethereum or BNB Chain token.
- **Wallets.**
  - **WebAuth** (§1) is the official wallet for XPR Network and Metal Blockchain. It is non-custodial: keys stay on your device, and Metal's support cannot recover a lost key (help article, updated 2025-10-12). The browser wallet can sign with Face/Touch ID, a YubiKey or Google Titan key, or an Ethereum wallet (help article, updated 2025-01-31).
    - **Backing up (official help article "How do I backup my private key in the WebAuth Wallet?", updated 2026-10-05):** in the app, open Settings, then "Backup Wallet". You type "I will never give my private key to anyone else" before the key is shown. Then save it, ideally on a device that isn't online, and keep more than one copy. XPR, Metal Blockchain and Ethereum each have their own private key. For new accounts, the seed phrase backup restores both wallets. Article: https://help.xprnetwork.org/hc/en-us/articles/4410313687703 (readable via https://help.xprnetwork.org/api/v2/help_center/en-us/articles/4410313687703.json)
    - **Restoring (official help article "How do I restore an account using a private key or seed phrase on the WebAuth mobile wallet?", updated 2026-10-05):** tap "Login", then "Import Account", then enter your private key or your **12-word mnemonic phrase** (lower case, one space between words). An XPR key restores only the XPR account and a Metal key only the Metal account, but "the 12-word seed phrase mnemonic can recover both accounts". Metal Client Services cannot see or recover your key. Article: https://help.xprnetwork.org/hc/en-us/articles/4409647374487 (readable via https://help.xprnetwork.org/api/v2/help_center/en-us/articles/4409647374487.json)
    - **Never share your private key or 12-word phrase with anyone:** not support, not this guide, not any AI. No one legitimate asks for it. If you ever pasted it into a chat, a form or a website, treat it as exposed and move your funds to a new wallet now.
  - **Anchor** (Greymass) lists Proton, XPR's chain ID `384da888…f437e0`, as a supported network on desktop and mobile (Greymass support page, modified 2021-12-02). The XPR explorer's own docs have an Anchor login guide.
  - **Explorer docs:** https://docs.bloks.io documents explorer.xprnetwork.org, including transfers, staking and login guides for WebAuth, Anchor, Ledger, Trezor, cleos and several older EOS-era wallets. Whether each older wallet is still maintained: UNCLEAR.
  - **Explorer + Ledger:** the explorer docs' Ledger guide uses Ledger's **EOS app** (not an XPR app) with the explorer's own "Ledger" sign-in, over USB or Bluetooth; it does not mention Ledger Live (https://docs.bloks.io/desktop-wallets/ledger, undated). Whether the explorer still offers that sign-in today: UNVERIFIED (the explorer builds in the browser).
  - **Trezor, KeepKey and OneKey hold the Ethereum/BNB Chain XPR token, not native XPR** (each vendor's own XPR page, read 2026-10-16). Each page lists only **Ethereum and BNB Smart Chain** as networks; none lists XPR Network itself. KeepKey names the Ethereum contract `0xd7efb00d12c2c13131fd319336fdf952525da2af`, the same one read on Ethereum above (KeepKey Desktop App). Trezor uses Trezor Suite on Safe 3/5/7; OneKey its app and hardware. Pages: https://trezor.io/coins/wallet/proton · https://keepkey.com/assets/proton · https://onekey.so/cryptos/xpr-network-7443d2/ . Native XPR and these tokens are on different networks: confirm the network before sending (see "Moving XPR to a WebAuth wallet" above). ~~Earlier line (10-15): "pages mention XPR but don't make clear whether they mean native XPR or the Ethereum/BNB token: UNCLEAR."~~ Superseded 2026-10-16.
  - **The official wallet page** (https://xprnetwork.org/wallet, read 2026-10-16) names only **WebAuth** (web, iOS, Android); it doesn't list Anchor or any hardware wallet.
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
| XPR Agents | On-chain registry for AI agents: identity, reviews, validation and escrowed jobs (contracts `agentcore`, `agentfeed`, `agentvalid`, `agentescrow`). **Built by Proton NZ:** listed as one of its live projects on protonnz.com (read 10-16); the code sits in the XPRNetwork GitHub org (MIT) | https://xpragents.com · llms https://xpragents.com/llms.txt · stats https://indexer.xpragents.com/api/stats · code https://github.com/XPRNetwork/xpr-agents · contracts and hosts the site uses: §12c | LIVE: 73 agents (68 active), 48 completed jobs, 10-15; site showed 68 active, 77 jobs posted, 165,222 XPR paid, 10-17 |
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
| NeftyBlocks XPR market | NeftyBlocks' former XPR marketplace (its producer `guild.nefty` last claimed 2026-04-28) | proton.neftyblocks.com returned "page not found" on 10-15; its robots.txt and terms page loaded on 10-17, and the terms bar robots and data mining (§12c) | ENDED: don't send people there |
| NFT Packs | Packs that each mint one random NFT | https://nftpacks.io (bloxprod) | LIVE |
| NFT Claim Hub | Where community NFT rewards are claimed | https://nftclaimhub.io (bloxprod) | LIVE |
| GLBDEX | Market for 3D-model NFTs, with AR/VR viewing | https://glbdex.com (Proton NZ) | UNCLEAR |
| Cypher Gang | Long-running NFT community and the CYPHR ecosystem: the 1,777-cap collection (7 rarity tiers, Common to Mythic) pays holders CYPHR every month by rarity and "era" (rewards halve each era). Mint count: its own site says 900 (10-15); CYPHR.Market shows 927 on chain. Secondary royalty 15%, half of it buys back and burns CYPHR. Timeline per its site: Cypher Gang 8-bit (2021), Cypher #1 (Feb 2022), Brawls and Bid & Win (2024), CYPHR (Apr 2025), Tip Bot (Dec 2025), CYPHR.Market (Aug 2026) | https://cyphergang.com · start https://cyphergang.com/start · Soon.Market https://soon.market/collection/zvapir55jvu4 · X @CypherGangNFT · Telegram https://t.me/CypherGang · on-chain accounts `cyphergang`, `cypherbrawls` · contracts and hosts its pages use: §12c | LIVE |
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
| **Official status pages** | Live outage pages. **Read 2026-10-19:** XPR Network shows two open incidents since 2026-10-17 (UTC): "Metal X Lending Service Disruption" (03:57) and "XPR Network Withdrawals Temporarily Paused" (04:19); Major Outage for dApps, Metal X Lending, the Bridge, Deposits and Withdrawal; Degraded for XPR Network and Transactions; WebAuth, Metal X swap/DEX, staking and the explorer Operational. Metal Pay: "Metal Pay Withdrawals Temporarily Paused" since 2026-10-16 21:20 PDT, crypto deposits and withdrawals Major Outage, fiat Operational. Metal L2: all Operational. The cause is not stated on the status pages; a third-party KuCoin community post (2026-10-17, citing an X account) calls it an exploit, unverified by Metallicus at the time of writing. Always read the page live before answering | https://status.xprnetwork.org · https://status.metalpay.com · https://status.metall2.com | Metallicus | LIVE (read 2026-10-19) |
| XPR Operator counterfeit-token API ("Sentinel") | Checks whether a token (contract + symbol) is genuine, counterfeit, predates the official one, or unknown; lists genuine issuers, all registered counterfeits (also CSV), Alcor pools that contain a counterfeit, newly flagged counterfeits since a time, and exchange deposit wallets. Endpoints `/v1/check?contract=&symbol=`, `/v1/canonical`, `/v1/counterfeits`, `/v1/alcor/pools`, `/v1/events?since=`, `/v1/exchanges`, `/v1/health`. Whether it needs a key is not stated | https://sentinel.protonnz.com · same service at https://operator.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| Official help centers | Metal X, Metal Blockchain and Metal L2 help centers (alongside help.xprnetwork.org and help.metalpay.com) | https://help.metalx.com · https://help.metalblockchain.org/hc/en-us · https://help.metall2.com | Metallicus | LIVE (sweep 2026-10-19) |
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
- **The `tokencreate` contract: what the chain shows (read 2026-10-17, its ABI, tables and account).** It holds 850+ tokens, including CYPHR, KSTO, BLPAD, VIBRR and NDAO, so these facts apply to all of them.
  - **Actions:** `create`, `issue`, `retire`, `transfer` (as in `eosio.token`), plus `burn`, `distribute` (creates a token, with a `creation_fee` field), `freeze` and `unfreeze`. It has no `open`/`close`.
  - **`freeze` and `unfreeze` take only a token symbol**, so they act on a whole token, not on one holder. Who may call them is not visible in the ABI. On 10-17 its `frozen` table was empty: no token was frozen.
  - **Issuing:** each token's `stat` row holds supply, max supply and issuer. CYPHR read supply = max supply = 4,206,942,069 with issuer `cypherxpr`, which matches its site's "fully issued, no new minting": there is no room left under the max. The ABI has no action that changes a max supply; whether the code allows one cannot be told from the ABI alone.
  - **Transfers:** the `transfer` action has no fee field. A fee taken inside the code cannot be ruled out without reading the code.
  - **Who can change the code:** the `tokencreate` account's owner and active permissions are each one single key, threshold 1 (plus `eosio.code` on active), with no multisig. The code was last set on 2026-09-15 (earlier: 2025-04-14). So whoever holds that key can change the rules for every token on this contract, with no on-chain delay. Who holds it is not stated anywhere this guide has found.
  - Code hash (10-17): `e3e319da628187f86414108f531442f5edcd68aa3cb7047d787ad314a5a68628`. If it changes, the code has changed.
- **EASY (`mon3y`): what the chain shows (read 2026-10-17).** Facts only; GUARD.IAN gives no verdict (RULES §3).
  - **Control:** the `mon3y` contract (created 2025-03-19) is controlled by one key (owner and active, threshold 1, no multisig). Its code was set **33 times** between 2025-05-31 and **2026-10-13**. `gold.mon3y` (GRAMS) and `hands.mon3y` are controlled the same way.
  - **Identity:** none of `mon3y`, `gold.mon3y` or `hands.mon3y` is KYC-verified on XPR (`eosio.proton` usersinfo `verified` = 0).
  - **What the owner can change:** `setconfig` sets the reflection and burn rates (now 2% reflection, 0% burn); the ABI shows no upper limit. `noflexzone` takes an account and a `ban_status`. `setflexpool` / `setflextoken` change which pools and tokens rewards use.
  - **Supply:** 21,000,000 EASY, all issued (supply = max). 1,457 accounts hold some.
  - **Where the supply sits:** about 75% is in Alcor (`swap.alcor`). Five pools hold about 3.16M EASY each, paired with only about 13,700–14,300 of XUSDT, XUSDC, XMD, XPYUSD and XPAX. In each, 95–100% of the liquidity belongs to `hands.mon3y` (same key as `mon3y`), locked in Alcor: XUSDT until 2030-01-06, XUSDC until 2028-06-01, XPYUSD until 2031-08-11, XPAX until 2033-03-18, and **XMD only until 2026-10-24**. After a lock ends, its owner can withdraw that position.
  - **GRAMS "gold":** 1,000,000,000 GRAMS issued by `gold.mon3y`. On 10-17 `gold.mon3y` and `mon3y` held no XPAXG (Paxos Gold) and `hands.mon3y` held 0.0003 XPAXG, so no gold backing is visible in these accounts. XPAXG's total supply on XPR is 50.
  - **The project's own docs** (flex.report `smart-contracts/easy.md`, read 10-17, https://github.com/dougbutner/flex.report): `setconfig` allows reflection + burn rates "sum ≤100%" (so the owner may set a tax of up to 100% per transfer); `noflexzone` bans or unbans an account from fees and rewards, "self-ban allowed; unban requires contract auth"; day one, 4,200,000 EASY went into each of the five stable pools from `hands.mon3y` (100% of supply), which matches the chain. The contract's source code was not found in the builder's public GitHub repos (10-17).
  - **The deployed code, read 2026-10-17** (builder's REA Lab; code hash `086a97b8…cb43140` matches the chain; full report in GUARD-Project `REA/reports/lab-job-4-2026-10-17.md`):
    - **Matches the docs:** the tax is capped in code (reflection ≤ 100%, burn ≤ 100%, both together ≤ 100%) and only the contract account can change it; `noflexzone` works as documented (you can opt yourself out but not back in; the contract can ban or unban any account); only the holder can move their tokens (no approve/allowance action); no minting past the max supply; the max supply cannot change.
    - **Not in the docs:** `distribute` credits fixed cuts of each payout to three accounts before holders: **0.2% to `nyra`**, **0.05% to `printmoney`** and 0.05% to `reflections`. `printmoney` was created 3 minutes after `mon3y` by `m3m3` and has the same owner key as `mon3y`; `nyra` is a separate contract (created 2024 by another account, different key). These credits are written straight into balances, so they don't show up as normal transfers. Transfers from `swap.alcor`, `alcor` and `bridge.strx` are also fee-free, which the docs don't list.
    - `distribute` can be triggered by anyone (no permission check). The system functions imported by the code are never called.
  - **Not known:** who holds the key; whether backing sits elsewhere. The code reading is decoded machine code, not the original source.

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
| Governance portal | Gasless proposals and votes. Communities: XPR Network, Metal X, LOAN Protocol, XPR Grants, Metal DAO | https://gov.xprnetwork.org · docs https://gov.docs.xprnetwork.org · 7 communities shown 10-17, including D.O.G.E. Community and SimpleDEX (§12c) |
| XPR Grants | Paid from the `xprgrants` account. Individuals up to $1,000 (open source $2,500), small teams and companies more. Per milestone, Consortium-verified, community vote | https://github.com/XPRNetwork/grant-framework |
| Metal DAO | XMT holders vote on the XMD basket. Live rules (3% quorum, 100 XMT a proposal) and the assets voted on: §1c | https://gov.docs.xprnetwork.org/communities/metal-dao |
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
These repos mention XPR Network (GitHub search, 10-15). **Code existing is not a product being live:** check each one before relying on it. "Last commit" = the default branch's newest commit, read 2026-10-16.

| Project | What the code says | Link | Status (checked 2026-10-16) |
|---|---|---|---|
| madblocks Metal Wallet | Windows wallet for Bitcoin/BTCVM and Dogecoin/DogecoinVM and the bridges between them, by the madblocks producer. Its README says "public beta" and ships Windows releases | https://github.com/Ambrotd/madblocks-Metal-Wallet | PUBLIC BETA per its README (last commit 2026-10-06) |
| Alcor bridge indexer | Indexer for Alcor's bridge; its README's example settings point at Telos, WAX and Vaulta (EOS) nodes | https://github.com/alcorexchange/alcor-bridge-indexer | CODE (one commit, 2026-10-15) |
| Tetra Grids app templates | Pure Liquid DEX, Hedgewaters, XPR App Forge, speakEASY, Peoples House, Dayrise Kingdom, EASY-Website: the READMEs call them templates ("Template positioning credits EASY / Flextokens" and say to verify links and claims) | https://github.com/dougbutner | TEMPLATES, not live products (last commits 2026-04-30 → 2026-09-13) |
| HUMAN (Tetra Grids) | News boards with tips; the code sends tips to `humanpay::tip` | https://github.com/dougbutner/HUMAN-by-Tetra-Grids | CODE: `humanpay` has **no contract on mainnet** (live check 2026-10-16) |
| The Channel (Tetra Grids) | A protocol whitepaper plus Antelope node source; companion paper "Pure Liquid" by Tetra Grids, LLC | https://github.com/TetraGrids/The-Channel | CODE / PAPER (last commit 2026-09-23) |
| flex.report (new) | The docs for EASY and the other flex tokens (onboarding, arbitrage, buybacks, launching your own), built with GitBook; the app it points to is flex.town | https://github.com/dougbutner/flex.report · https://flex.report · https://flex.town | DOCS (repo created 2026-10-15; the sites themselves not opened here yet) |
| ibo.garden (in EASY-Website) | A one-page site for **IBO, a Solana token** | https://github.com/dougbutner/EASY-Website | NOT XPR (lead closed 2026-10-16) |
| Ubitquity XPR tools | Telegram tip bot (UBITQUITY and nDAO defaults), XPR account verifier, token swap tool, UBQTY token. The company site's home page doesn't mention XPR | https://github.com/ubitquity · https://ubitquity.io | CODE / UNCLEAR (last commits 2026-03-11 → 2026-08-26) |
| GCSC (Global Construction Smart Contract) | Construction-industry DAO; its README says the contracts are **deployed to XPR testnet only** | https://github.com/Melxisedek75/gcsc-website | TESTNET (last commits 2026-08-15 site, 2026-09-06 contracts) |
| ProtonPunkz | Pixel-art NFTs; Polygon first, XPR "secondary" | https://github.com/protonpunkz/ProtonPunkz | CODE / UNCLEAR, quiet (last commit 2026-02-08) |
| Dingleberry ($DINGLE) | Brand assets; the collection "The Dingleberries" trades on CYPHR.Market | https://github.com/dingleberrycoin/dingle-assets | NFTs LIVE; token contract not confirmed (last commit 2026-07-24) |
| ReLocke | Agentic ABIs, WebAuthn and GraphQL tools for Antelope chains | https://github.com/relocke | CODE (last commit 2026-08-17) |
| Arena escrow contract | XPR escrow contract for arena match settlements | https://github.com/hashstacking-maker/xpr-escrow-contract | CODE (last commit 2026-09-08) |
| Saltant tools | XPR Peer Probe (node diagnostics), AntelopeIO tools | https://github.com/Saltant | CODE (Peer Probe 2026-09-08; AntelopeIO-Tools 2025-06-07) |
| chaininfra courses | EVM-to-XPR migration course, key refresh, delegation demo, Metal validator guide and monitor | https://github.com/chaininfra | CODE / GUIDES (last commits 2025-10-06 → 2026-05-26) |
| xprdata bench | Benchmarks from the xprdata producer | https://github.com/xprdata/xprdatabench | CODE (last commit 2026-09-29) |
| RockerOne / SuperstrongBE tools | signbox, xpr_abi_2_ts_types (TypeScript types from an XPR ABI) | https://github.com/SuperstrongBE | CODE (2026-08-13; 2026-02-24) |
| Dapptoken, RTHC Protocol, ProtonFarming bot | Token-plus-liquidity creator (via Alcor), a protocol repo, an auto-compound farming bot | https://github.com/forkonlyone/Dapptoken · https://github.com/mwasi39-gif/RTHC-Protocol · https://github.com/Panda404NotFound/ProtonFarming | CODE, quiet (last commits 2025-12-13 → 2026-04-23) |

## 12b. How things work: key facts (read at the official source 2026-10-15)
- **XPR token economics, from the XPR Network whitepaper v2.0** (undated; https://cdn.metallicus.com/XPR_Network_Whitepaper_v2.0.pdf, read 10-16; quotes are the paper's own words):
  - **Supply:** "Initial total supply: 10,000,000,000 XPR". "Max supply: ∞ (4% inflation per year that can be adjusted by BP vote)". **Live on chain 10-16: 32,600,054,991 XPR issued, no max set** (`eosio.token`).
  - **Phoenix Proposal (§5):** "14 billion non circulating tokens will be added", bringing non-circulating supply to 28 billion. The split: block producers 500M, community 2B, marketing 1.5B, "Core Developer (Metallicus): 10 billion XPR", each "to be put into circulation within 3 years".
  - **Inflation (§5.1):** "The block reward is set at 4% per annum, awarded on a 1/365 ratio, daily". The split is 1% block producers, 1% accounts that stake and vote, 1% the governing consortium, 1% yield farming. **Whether those rates still apply today is not checked here.**
  - **Burns (§3.3, §5.2):** XPR spent on network resources by businesses and developers is burned. "For every NFT minted, 10% of the XPR used is burned". "0.1% of all fees generated from XPR Network Swap are burned". Burns happen at the end of each quarter.
  - **Consensus (§3.6–3.8):** dPoS. A block "exactly every 0.5 seconds". "21 active Block Producers" plus "24 Block Producers on standby". A 2/3 + 1 producer majority gives "3-minute finality". "over 4,000 transactions per second (TPS)". **How fast is a transaction final? Both words are used, for two different things:**
    - **Inclusion (fast):** blocks every 0.5 s. Metallicus's XPR developer page (read 10-16) says "Sub-second finality". The current XPR dev skill (`XPRNetwork/xpr-network-dev-skill` @ main, `payment-patterns.md`, read 10-16) says "~2 second first-block confirmation".
    - **Irreversible (about 3 minutes, today):** the same dev skill says "full LIB finality ~3 minutes", and tells payment apps not to release goods until a payment is past the last irreversible block (LIB). **Measured live on 10-16, three reads:** LIB was 327–332 blocks behind head, about 2.7–2.8 minutes (`xpr_chain_info`, server v5.0.3). The whitepaper's "3-minute finality" matches this, so it isn't only an old number.
    - **Answer like this:** "A transaction lands in a block in about a second; it becomes irreversible after about 3 minutes (read live: compare `head_block_num` and `last_irreversible_block_num`)."
    - The faster "~1 s" finality on community PulseVM docs is for the future A-Chain, not today's chain.
    - That developer page also links an older whitepaper, v1.1: https://cdn.xprnetwork.org/xprnetwork_whitepaper_v1_1.pdf
  - **Consortium (§3.10):** "5 independent members", voted in unanimously by current members, 2-year terms. **Out of date:** today's Consortium page lists 6 members (§10).
  - **Audits named (§8.3):** Kudelski Security (voluntary assessment), PeckShield (Swap and Yield Farming), Blockmancer (LOAN staking).
Live numbers can change: read the chain or the linked page before stating one, and give the time read.

**Zero gas fees and who pays:** users pay no gas. They get free CPU, NET and RAM for normal use. Block producers provide the capacity and are paid in XPR from inflation (21 active producers plus standby). Power users and dApps can buy RAM or rent CPU/NET at https://resources.xprnetwork.org, and dApps can stake resources for their users. Source: https://xprnetwork.org/blog/how-xpr-network-achieves-zero-gas-fees

**RAM price (read the chain, not the Bancor formula):** on XPR, RAM has a fixed price per byte in table `eosio::globalram` (`ram_price_per_byte` 0.0020 XPR and `ram_fee_percent` 1000 = 10 %, read 2026-10-16). The fee comes out of the payment: cost = bytes x price / (1 - 0.10), so 10,000 bytes = 22.2222 XPR. The `eosio::rammarket` table exists but is not what XPR charges. The XPR dev skill says so in rpc-queries.md ("RAM is NOT priced by the rammarket bancor curve on XPR Network", about line 1238 @ b7d9f1f), while its resources.md:202 and staking-governance.md:387 still describe Bancor.

**Network blocklist (official contract code, merged 2026-10-06).** XPR's token contract `eosio.token` now checks a shared, network-wide list kept by the `blocklist` contract, the same list `xtokens` already uses. A listed account **cannot send**; receiving is not blocked, and core system accounts (`eosio`, `eosio.token`, staking and fee accounts and others) are always exempt. Source: https://github.com/XPRNetwork/proton.contracts/commit/1e4132fb41a150403206f745de736ca67eb47f95 (PR #9). **Live on mainnet:** the deployed `eosio.token` code was last updated 2026-10-12 11:34:26 UTC (block 408228360), and the deployed wasm contains the error "Sender is blocklisted" (chain read 2026-10-16: `get_account` `last_code_update` + `get_raw_code_and_abi`). Live list: table `blocklist` on contract `blocklist` (47 accounts on 10-16). Being on the list says the network blocked the account, nothing more; this guide doesn't label anyone.

**Metal X `dex` deposits need an EMPTY memo.** Any other memo (e.g. "deposit") is accepted but NOT credited: no `balances` row, nothing tradeable, and the contract has no path back (`withdraw` reads only `balances`, no admin refund action); only a manual transfer by the Metal X operators can return it. Contact support with the transaction id. Source: XPR dev skill metalx-dex.md:30-41 @ b7d9f1f ("verified against 17 real cases on mainnet").

**Metal X `order_min` is order VALUE in the quote (ask) token, in raw units**, not a quantity of the base token: on XPR/XMD and XBTC/XMD the on-chain `order_min` 1,000,000 = 1 XMD per order (XMD has 6 decimals; the markets API shows `order_min` 1). Source: XPRNetwork/dex-bot @ 3e2b570 test/strategies/marketmaker.test.ts:65-79 (an order's quantity x the ask token multiplier must be at least `order_min`).

**XPR Agents validation fee (October 2026).** `agentvalid` now charges a validation fee (live `validation_fee` 100000 = 10 XPR): a `valfee:<validator>` transfer must be in the same transaction as `validate`, so a bare validate fails; openclaw 0.8.7 pays it automatically (`validateWithFee`). Validators stake at least 5,000 XPR; an upheld challenge slashes 10 %. Source: XPRNetwork/xpr-agents PR #97 (merge 614d88c); live `agentvalid::config`.

**Agent keys: "Pillar 1" and "Pillar 2"** (XPR Agents security guide). Pillar 1: the agent's `active` key lives in the proton CLI keychain, so the agent process never holds it. Pillar 2: the agent account's `owner` is a separate, human-controlled account, so a leaked `active` key can spend the agent's funds but cannot take the account; the human replaces `active`. Neither stops spending with a stolen `active` key, so keep agent balances small. Source: XPRNetwork/xpr-agents @ 69adfab docs/SECURITY.md:29-68.

**Your WebAuth key signs your transactions; an agent needs its own key.** When you sign, WebAuth asks your phone and you approve with face or fingerprint: that key (`PUB_WA_...`) is hardware-bound, cannot be exported, and "Cannot be used from CLI - only through WebAuth wallet". An autonomous agent signs unattended on a server, so it uses its own K1 key in the proton CLI keychain, and your WebAuth account should be the agent's owner (Pillar 2). Source: XPR dev skill accounts-permissions.md:392-399 @ b7d9f1f; xpr-agents docs/SECURITY.md (Flow A).

**Looking things up like the explorer:** the XPR Network Explorer (explorer.xprnetwork.org) builds its pages in the browser. Its data comes from Hyperion and the chain, which this guide's connector reads directly: `xpr_actions` (history), `xpr_transaction`, `xpr_block`, `xpr_abi`, each with an explorer link.

**XPR Agents A2A default:** #64 (19 Sep 2026) made `A2A_TOOL_MODE=readonly` the runner's code default, but every installer (`start.sh`, `bootstrap.sh`, `.env.example`, both compose files) still wrote `full` until #77, which made every shipped config `readonly` and requires A2A callers to be registered, active agents by default. Check an install's own `.env`, not only the code default. Source: XPRNetwork/xpr-agents docs/SECURITY_AUDIT.md:655-664 @ 69adfab.

**Hyperion "total: 10000" and empty old history:** 10,000 is Elasticsearch's offset-paging cap, not a limit on history; page with cursors (`before=` the oldest timestamp, descending). Hyperion v4 returns empty results for `sort=asc` queries reaching back more than 90 days by default (`api.max_asc_window_days: 90`); descending queries return the data. Source: XPR dev skill hyperion-operations-caveats.md §9-10 (lines 194-212 @ b7d9f1f).

**Staking:** source https://xprnetwork.org/blog/xpr-network-staking-guide
- **Short staking:** WebAuth only, no minimum. You vote for up to 4 producers (the guide says you must pick 4 to claim rewards). Unstaking returns your XPR after a 24-hour lockup. **If it never arrives:** the old automatic refund was a deferred transaction, and deferred transactions don't run on Leap 5+, so a matured refund may sit until someone calls `eosio::refundxpr` for that account. XPRNetwork/proton.contracts PR #10 (merged 2026-09-23) removed the dead deferred code and made `refundxpr` callable by anyone for a matured refund, so a keeper can deliver it. Whether that build is deployed on mainnet: not verified here.
- **Long staking:** Explorer only, minimum 100 XPR, 90 or 365 days. The reward is tied to XPR's value in Bitcoin satoshis, not a fixed APY.
  - 90-day: extra XPR only if that value fell.
  - 365-day: extra XPR if it stays below 106% of the staked value.
  - **Live contract `longstaking` (chain read 2026-10-16, table `plans`):** two plans take new stakes: 90 days with multiplier 100 and 365 days with multiplier 106, both using price oracle feed 2, which the `oracles` contract describes as tracking the **14-day average** XPR/BTC price (so the start price is a two-week average, not the price that minute). Two older plans (90 days ×105, 365 days ×150) take no new stakes but can still be claimed. The 100 and 106 match the staking guide's "fell" and "106%" rules.
  - The contract has a `claimstake` action (account, stake number) and a `cancelstake` action. The official help article (updated 2025-10-07) says a long stake can't be undone before its unlock date; the staking guide says the XPR is released when the period ends. Who may call `cancelstake`, and whether claiming is automatic, are not stated: https://help.xprnetwork.org/hc/en-us/articles/18031266904599-How-do-I-Long-Stake-my-XPR
  - The contract's code link on the official developer list (github.com/XPRNetwork/proton-longstaking) does not open publicly (checked 2026-10-16), so the exact top-up formula is not verified. Each stake row stores the XPR/BTC oracle price at the start.

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
- **Live check 2026-10-16 (connector tool `loan_protocol`):** 16 markets. Borrow limits match the lines above (XPR 40%, XUSDC 80%, XMD 90%), plus XBTC and XETH 70%, XMT 50%, most others 60%; XUSDT, XUST and XLUNA are 0%, so nothing can be borrowed against them. Close factor and liquidation bonus are both 10% (`globals.cfg`). Rates come from the tool's "apy" view (Metal X API): XMD's 7-day average deposit interest was 13.85% and borrow interest 18.89%; LOAN-reward APYs are separate figures. Past rates, not a forecast.

**Metal Dollar (XMD) backing.** Source: https://metaldollar.com and https://dollar.metalx.com/treasury-cryptos
- **How it works:** minted and redeemed 1:1 against basket stablecoins (USDC, PYUSD, USDP) on XPR, Ethereum and Metal Blockchain. The Metal DAO reviews basket assets.
- **Treasury snapshot** shown on 10-15 (block 400,002,261, Aug 25): XUSDC about 96.47% of the treasury against a 60% target; PYUSD and USDP about 0%. Check the live treasury page for current figures.

## 12c. What the browser-built sites load and talk to (read in the REA Lab browser 2026-10-17)

These sites build themselves in the browser. Each was opened once as an ordinary visitor (no sign-in, no wallet, no clicks) in the builder's isolated REA Lab, and its network requests and JavaScript were recorded. Each site's robots.txt and terms were checked first. Private people's accounts are left out (RULES §3). What a page shows can change at any time; the contract and host lists are what the page used at that moment.

**Cypher Gang** (https://cyphergang.com: /market, /brawls, /wiki, /start, /bid-and-win, /tokenomics; robots.txt allows all but /dashboard; no terms page found)
- Contracts the pages read: `atomicmarket` (table `config`); `tokencreate`, the CYPHR token, with balances of the issuer `cypherxpr` and of `token.burn`; AtomicAssets collection `zvapir55jvu4`; `eosio.token` (XPR, for the Alcor pair).
- Project accounts written into its code: `cyphergang`, `cypherfdn`, and `cyphermarket` (role not traced).
- Hosts: proton.greymass.com (chain); xpr-mainnet-atm-api.bloxprod.io (AtomicAssets/AtomicMarket; fallbacks in the code: atomic-xprmain.blocksforge.com, proton.api.atomicassets.io, aa-xprnetwork-main.saltant.io); proton.alcor.exchange; api.coingecko.com; lightapi.eosamsterdam.net; blastpad.io; wsrv.nl and gateway.pinata.cloud (images).
- Shown at the time: Brawls and Wiki "MVP (Pre-Alpha), PvP Available", 11% progress; /bid-and-win "No active auctions right now"; /tokenomics says 50% of royalties go to buyback-and-burn and 50% of primary proceeds to the Alcor pool. Several live /tokenomics figures showed 0, probably still loading; not re-checked.

**WebAuth** (https://webauth.com, which sends you to /getStarted; terms: XPR Network's WebAuth Terms of Service, effective 2023-09-11, https://xprnetwork.org/webauth-terms, which name Metallicus, Inc. as the provider)
- Build setting `APP_VERSION: "2.1.59"`.
- No contract calls before you sign in, and no contract names in its main code.
- Hosts at load: the official chain list on raw.githubusercontent.com (ProtonProtocol/chain-info); health checks on api-xprnetwork-main.saltant.io, proton.eosusa.io, proton-api.eosiomadrid.io and proton.protonuk.io (all answered) and proton.cryptolions.io (404 at that moment); identity.api.prod.metalx.com; mainnet.infura.io (Ethereum); WalletConnect (api.web3modal.org, verify.walletconnect.com, relay.walletconnect.com).
- The page is drawn on a canvas, so only its short feature list could be read.

**Governance portal** (https://gov.xprnetwork.org; its only terms link is the WebAuth Terms above)
- Shown: "Total: 7 communities": XPR Network, Metal DAO, LOAN Protocol, XPR Grants, Metal X, D.O.G.E. Community, SimpleDEX.
- Data comes from its own API, gov.api.xprnetwork.org (`/api/v1/communities`, `/api/v1/strategies`). No chain calls at load; the contract that receives votes was not identified from the home page.

**XPR Agents** (https://xpragents.com, home and the top-listed agent page; robots.txt allows all and names AI crawlers; no terms page; footer "Open source, MIT")
- Shown: 68 active agents, 77 jobs posted, 30 reviews, 3 validators, 165,222 XPR paid to agents.
- Contracts read: `agentcore` (`agents`), `agentescrow` (`jobs`, `bids`), `agentfeed` (`config`, `agentscores`, `feedback`), `eosio.proton` (`usersinfo`), `oracles` (`data`), and on the agent page `eosio` (`voters`) and `eosio.token` (`accounts`).
- Hosts: api.protonnz.com (chain); indexer.xpragents.com (`/api/agents`, `/api/jobs`, `/api/stats` and more); aa-xprnetwork-main.saltant.io; agent.mypinata.cloud and proton.mypinata.cloud (images).

**Not opened, because their terms forbid it**
- **The Grid** (thegrid.id): its Acceptable Use Policy (v1.0b, effective 2024-11-28) bars data access "through technologies other than those provided or authorised by The Grid", and its Web Services Terms (v1.1b, 2026-01-23) bar reverse engineering "based on our marketmaps or explorer pages".
- **NeftyBlocks** (proton.neftyblocks.com): its terms (https://proton.neftyblocks.com/terms/) bar "data mining, robots or similar data gathering or extraction methods". Its robots.txt and terms page did load on 10-17.

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
- **xprdrop[.]com and xprgrant[.]com are a wallet drainer, not an airdrop** (Proton NZ scam alert, 2026-08-03, with August–September updates: https://www.protonnz.com/blog/xprdrop-scam-warning). A fake "$XPR airdrop" token arrives with a memo link; "claiming" on the site signs a new permission (usually named `claim`) controlled by the attacker, linked to token transfers and sometimes unstaking, so funds keep draining as they arrive. Receiving the token is harmless; signing on the site is the danger. Fix: check and remove the permission with https://cleanup.protonnz.com (remove it before unstaking). Later versions arrive as a QR-code NFT. The token registry also marks the xprdrop token blacklisted (sweep 2026-10-19). These two sites are written without links on purpose: the guide never fetches them.
- **testonramp.xprnetwork.org is a security-training mock of a phishing page** (it labels itself "IR / security mock only", seen 2026-10-19). It is on an official domain but is not a real on-ramp: never send anyone there.
- **alcor-labs[.]com is not a site Alcor links to** (sweep 2026-10-19: it looks like a copy of Alcor). Alcor on XPR is https://proton.alcor.exchange. Treat look-alike domains as unsafe.
- **"XPR Network AI" on Base is not XPR Network.** A token by that name trades on Base (seen on DexScreener and DEXTools, 2026-10-19); its maker is unknown and it has nothing to do with XPR or Metallicus.
- **Old addresses that now redirect:** dex.protonnz.com → simpledex.fun; agents.protonnz.com → xpragents.com; lending.metalx.com → app.metalx.com/lending (sweep 2026-10-19). Official posts may still show the old ones.

## 15. Added by the full coverage sweep (2026-10-19)
Everything below was found by a five-part sweep on 2026-10-19 (official sites and sitemaps, certificate logs, GitHub, on-chain directories, the open web) and was missing from §§1–14. LIVE = opened that day; LISTED = linked from the place named but not opened. Earlier sections stay the main reference; this section fills the gaps. Suspicious or look-alike sites are in §14 and are written without links.

### 15a. Official sites and pages added by the 2026-10-19 sweep

Found by the 2026-10-19 sweep of official sites, their sitemaps and footers, plus certificate records for official subdomains. **LIVE (read 2026-10-19)** means the page was opened and loaded that day. **LISTED** means an official page links to it but it was not opened, so check it before relying on it. "Loads only in a browser" means the page is a JavaScript app: a plain fetch shows only its frame. Hosts already in the guide (status pages, help centers, Sentinel, the redirects in §14) are not repeated here.

**Metallicus**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Metal Identity app | On-chain identity app for XPR Network and Metal Blockchain | https://identity.metallicus.com | Metallicus | LIVE (read 2026-10-19; loads only in a browser) |
| Careers | Careers page. The "join us" link in every XPR / Metal footer serves the same page. Openings come from an embedded TriNet Hire job board | https://metallicus.com/company/careers · https://metallicus.com/join-us · job board https://app.trinethire.com/companies/437042-metallicus-inc/jobs/embed | Metallicus | Careers pages LIVE (read 2026-10-19). Job board LISTED (linked from metallicus.com/company/careers, not opened) |
| Brand guidelines | Brand guidelines page with logo downloads; a public Figma file of the brand guidelines for all 9 Metallicus products; a Google Drive folder of official logos | https://metallicus.com/company/brand-guidelines · Figma https://www.figma.com/design/MUUr9nWjU9Fn0Mg0ENgEC3/Metallicus-Products-Brand-Guidelines--Public-?node-id=299-2 · logos https://drive.google.com/drive/folders/1PCc_P--1YPnEgxc9zqodP9udNkOdGTT7?usp=drive_link | Metallicus | Page LIVE (read 2026-10-19). Figma and Drive LISTED (linked from metallicus.com/company/brand-guidelines, not opened) |
| Integrations | Core-banking integrations (Jack Henry, Temenos) | https://metallicus.com/company/integrations | Metallicus | LIVE (read 2026-10-19) |
| Contact | Contact and sales page | https://metallicus.com/contact-us | Metallicus | LISTED (linked from metallicus.com, not opened) |
| Developers hub | Developer landing page and its XPR Network page (the Metal Blockchain and Metal L2 developer pages are already in §1) | https://metallicus.com/developers · https://metallicus.com/developers/xpr-network | Metallicus | LISTED (linked from metallicus.com and its sitemap, not opened) |
| Pages for individuals | Individuals hub and its supported-assets page | https://metallicus.com/individuals · https://metallicus.com/individuals/assets | Metallicus | LISTED (linked from metallicus.com, not opened) |
| Pages for institutions | Blockchain solutions; investing and wallets; identity; trading and lending | https://metallicus.com/institutions/blockchain-solutions · https://metallicus.com/institutions/investing-and-wallets · https://metallicus.com/institutions/identity · https://metallicus.com/institutions/trading-and-lending | Metallicus | LISTED (linked from metallicus.com, not opened) |
| CFO page | Company bio page for Irina Berkon, CFO (public role, on the team page in §1a) | https://metallicus.com/company/irina-berkon | Metallicus | LISTED (linked from the metallicus.com sitemap, not opened) |
| SOC 2 Type I | Blog post: Metallicus completed a SOC 2 Type I assessment (2026-08-18) | https://metallicus.com/blog/metallicus-completes-soc-2-type-i-assessment | Metallicus | LIVE (read 2026-10-19) |
| Quarterly reports (older) | CEO's quarterly reports: 2026 Q2 (2026-07-06), 2025 Q4, Q3, Q2 and Q1 (Q1 2026 and Q3 2026 are already in §1) | https://metallicus.com/blog/metallicus---2026-q2-report · https://metallicus.com/blog/metallicus---2025-q4-report · https://metallicus.com/blog/metallicus-2025-q3-report · https://metallicus.com/blog/metallicus-2025-q2-report · https://metallicus.com/blog/metallicus-2025-q1-quarterly-report | Metallicus | LISTED (linked from metallicus.com and its sitemap, not opened) |
| Institution news | CrossState pilot with 50 credit unions; FedNow Request for Payment (RfP) certification; engineering team update | https://metallicus.com/blog/crossstate-metallicus-launch-pilot-program-with-50-credit-unions · https://metallicus.com/blog/metallicus-expands-fednow-service-capabilities-with-request-for-payment-rfp-certification · https://metallicus.com/blog/engineering-team-update | Metallicus | LISTED (linked from the metallicus.com sitemap, not opened) |
| Compliance posts | "Committed to compliance" and "Staying compliant with crypto in the United States" | https://metallicus.com/blog/committed-to-compliance · https://metallicus.com/blog/staying-compliant-with-crypto-in-the-united-states | Metallicus | LISTED (linked from the metallicus.com sitemap, not opened) |

**XPR Network**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| FAQ | XPR Network FAQ | https://xprnetwork.org/faq | XPR Network | LIVE (read 2026-10-19) |
| XPR Grants Fund | How to apply for an XPR grant; proposals go to the Grants community on the governance dashboard; the grants treasury is the `xprgrants` account | https://xprnetwork.org/blog/xpr-grants-fund · proposals https://gov.xprnetwork.org/communities/6 · treasury https://explorer.xprnetwork.org/account/xprgrants | XPR Network | Grants post LIVE (read 2026-10-19). Proposals page and treasury LISTED (linked from the grants post, not opened) |
| XPR Checkout for WordPress | Product page for the WordPress checkout plugin (the Wookey page and repo are in §7) | https://xprnetwork.org/xpr-checkout-for-wordpress | XPR Network | LISTED (linked from the xprnetwork.org sitemap, not opened) |
| Account security guides | Blog: how the permissions system works; securing an account with native 2-of-3 multisig; YubiKey as a hardware wallet | https://xprnetwork.org/blog/understanding-the-xpr-network-permissions-system · https://xprnetwork.org/blog/how-to-secure-your-account-with-native-2-of-3-multisig · https://xprnetwork.org/blog/why-yubikey-is-quietly-becoming-the-best-hardware-wallet | XPR Network | LISTED (linked from the xprnetwork.org sitemap, not opened) |
| How-to guides | Blog: create an account; become a block producer; long staking | https://xprnetwork.org/blog/how-to-create-an-xpr-network-account · https://xprnetwork.org/blog/how-to-become-a-block-producer-on-the-xpr-network · https://xprnetwork.org/blog/long-staking-on-xpr-network | XPR Network | LISTED (linked from the xprnetwork.org sitemap, not opened) |
| Programmes and governance posts | Blog: 2025 roadmap update; bounties programme; code of conduct; governance dashboard; DEX rebates | https://xprnetwork.org/blog/xpr-network-roadmap-update-2025 · https://xprnetwork.org/blog/bounties-program · https://xprnetwork.org/blog/code-of-conduct · https://xprnetwork.org/blog/gov-dashboard · https://xprnetwork.org/blog/rebates-dex | XPR Network | LISTED (linked from the xprnetwork.org sitemap, not opened) |
| Partner posts | Blog: DappRadar joins as a block producer; RockerOne joins as Digital Adoption Growth Manager | https://xprnetwork.org/blog/dappradar-joins-xpr-network-as-a-block-producer · https://xprnetwork.org/blog/rockerone-joins-the-xpr-network-as-digital-adoption-growth-manager | XPR Network | LISTED (linked from the xprnetwork.org sitemap, not opened) |
| NFT developer guides | Blog: NFTs on XPR Network for developers, parts 1 and 2 | https://xprnetwork.org/blog/guide-to-nfts-on-xpr-network-for-developers · https://xprnetwork.org/blog/nfts-on-xpr-network-for-developers-part-2 | XPR Network | LISTED (linked from the xprnetwork.org sitemap, not opened) |
| Developer docs index | Sitemap of the developer docs, about 100 pages | https://docs.xprnetwork.org/sitemap.xml | XPR Network | LIVE (read 2026-10-19) |
| Docs: getting started | Introduction; accounts and permissions | https://docs.xprnetwork.org/getting-started/introduction.html · https://docs.xprnetwork.org/getting-started/accounts-and-permissions.html | XPR Network | LISTED (linked from the docs sitemap, not opened) |
| Docs: security and permissions | Smart-contract security; CLI multisig (msig); CLI permissions | https://docs.xprnetwork.org/contract-sdk/security.html · https://docs.xprnetwork.org/documentations/proton-cli/msig.html · https://docs.xprnetwork.org/documentations/proton-cli/permission.html | XPR Network | LISTED (linked from the docs sitemap, not opened) |
| Docs: building | Web SDK; querying tables; user tokens; creating a token; reading chain data; signing and pushing transactions from a backend | https://docs.xprnetwork.org/client-sdks/web.html · https://docs.xprnetwork.org/client-sdks/query-tables.html · https://docs.xprnetwork.org/client-sdks/user-tokens.html · https://docs.xprnetwork.org/guides/create-token.html · https://docs.xprnetwork.org/reading-onchain-data/reading-onchain-data.html · https://docs.xprnetwork.org/signing-and-pushing-transactions/signing-and-pushing-transactions.html | XPR Network | LISTED (linked from the docs sitemap and xprnetwork.org, not opened) |
| Developer code | `@proton` npm organisation; official developer-examples repo; TypeScript smart-contract SDK repo | https://www.npmjs.com/org/proton · https://github.com/XPRNetwork/developer-examples · https://github.com/XPRNetwork/ts-smart-contracts | XPR Network | LISTED (linked from docs.xprnetwork.org, not opened) |
| Resources: RAM and faucet | Buy RAM (storage); testnet faucet | https://resources.xprnetwork.org/storage · https://resources.xprnetwork.org/faucet | XPR Network | LISTED (linked from docs.xprnetwork.org, not opened) |
| Testnet tools | Testnet resources (buy resources and storage, create accounts); testnet NFT market | https://testnet.resources.xprnetwork.org · https://testnet.nft.xprnetwork.org | XPR Network | LIVE (read 2026-10-19) |
| Proton IDE | Browser IDE titled "Proton IDE" | https://ide.xprnetwork.org | XPR Network | LIVE (read 2026-10-19; loads only in a browser) |
| ISO 20022 demo | Page titled "ISO20022 DEMO" | https://iso20022.xprnetwork.org | XPR Network | LIVE (read 2026-10-19; loads only in a browser) |
| Old explorer | Older block explorer ("Fastest Block Explorer and Wallet"); the current one is explorer.xprnetwork.org (§1) | https://old-explorer.xprnetwork.org | XPR Network | LIVE (read 2026-10-19; loads only in a browser) |
| Brand assets | XPR Network brand assets (Figma) | https://www.figma.com/file/5N1UTmMXbE4Tk9EgDrIwVg/XPR-Network-Brand-Assets?type=design&node-id=0%3A1&mode=design&t=62joLtdtUCNTUBFu-1 | XPR Network | LISTED (linked from the xprnetwork.org footer, not opened) |
| Developers Telegram topic | Official XPR developers topic in the XPR Network Telegram group | https://t.me/XPRNetwork/935158 | XPR Network | LISTED (linked from docs.xprnetwork.org, not opened) |

**WebAuth**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| WebAuth get started | WebAuth get-started page | https://webauth.com/getStarted | Metallicus | LISTED (linked from docs.xprnetwork.org, not opened) |
| WebAuth mobile apps | Official app store listings: iOS and Android | https://apps.apple.com/us/app/webauth-com/id1594500069 · https://play.google.com/store/apps/details?id=com.metallicus.webauth | Metallicus | LISTED (linked from xprnetwork.org, not opened) |
| WebAuth short link | Official short link; redirects (302) to webauth.com | https://wauth.co | Metallicus | LIVE (read 2026-10-19; redirect) |
| WebAuth privacy notice | The Metallicus privacy notice, updated 2024-02-05 (the WebAuth terms are already in the guide) | https://xprnetwork.org/webauth-privacy | Metallicus | LIVE (read 2026-10-19) |
| WebAuth testnet wallet | WebAuth Wallet on testnet | https://testnet.webauth.com | Metallicus | LIVE (read 2026-10-19; loads only in a browser) |

**Metal Pay**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Metal Pay mobile apps | Official app store listings: iOS and Android; "Get / Buy Crypto" short link; app deep link | https://apps.apple.com/us/app/metal-pay-buy-bitcoin-and-eth/id1345101178 · https://play.google.com/store/apps/details?id=com.metallicus.metalapp.production · https://m.tl/pay · https://metalpay.app.link/pay | Metallicus | LISTED (linked from metalpay.com; the deep link from metall2.com; not opened) |
| Metal Pay terms (US) | US Terms of Service, updated 2026-10-01 | https://www.metalpay.com/terms | Metallicus | LIVE (read 2026-10-19) |
| Metal Pay privacy notice | "Privacy Notice — Metal Pay", Metallicus, Inc.; effective and last updated 2024-02-05 | https://www.metalpay.com/privacy-notice | Metallicus | LIVE (read 2026-10-19) |
| Other Metal Pay legal pages | Legal disclosures; Australian terms; New Zealand terms | https://www.metalpay.com/terms/legal-disclosures · https://www.metalpay.com/terms-au · https://www.metalpay.com/terms-nz | Metallicus | LISTED (linked from the metalpay.com sitemap, not opened) |
| Metal Pay site pages | FAQs; markets and prices; referral programme; Metal Pay TV | https://www.metalpay.com/faqs · https://www.metalpay.com/markets · https://www.metalpay.com/refer-a-friend · https://www.metalpay.com/tv | Metallicus | LISTED (linked from metalpay.com and its sitemap, not opened) |
| Metal Pay news | News index; about 190 weekly "crypto news" posts are listed in the sitemap | https://www.metalpay.com/news | Metallicus | LISTED (linked from metalpay.com, not opened) |
| Metal Pay blog | Metal blog (for example "Metal Dev Update #1") | https://blog.metalpay.com | Metallicus | LIVE (read 2026-10-19) |
| How to buy | How-to-buy index, and pages for LOAN, Metal Dollar (XMD), Metal DAO (MTL) and Metal Blockchain (METAL); the XPR page is already in §1 | https://www.metalpay.com/how-to-buy · https://www.metalpay.com/how-to-buy/loan · https://www.metalpay.com/how-to-buy/metal-dollar · https://www.metalpay.com/how-to-buy/metal-dao · https://www.metalpay.com/how-to-buy/metal-blockchain | Metallicus | LISTED (linked from metalpay.com and its sitemap, not opened) |
| Metal Pay for business | Metal Pay for Business; Metal Pay Enterprise (institutions page on metallicus.com) | https://www.metalpay.com/metal-pay-for-business · https://metallicus.com/institutions/metal-pay-enterprise | Metallicus | LISTED (linked from metalpay.com and metallicus.com, not opened) |
| Metal Pay Connect (product and help) | On-ramp product page; Metal Pay Connect help section | https://www.metalpay.com/metal-pay-connect · https://help.metalpay.com/hc/en-us/sections/26343604036887-Metal-Pay-Connect | Metallicus | LISTED (linked from docs.metall2.com and the Metal Pay help center, not opened) |
| Metal Pay Connect developer docs | Developer documentation: APIs to add crypto buy and sell to apps; needs an API key. A separate Metal Pay API docs site is password-protected | https://connect-docs.metalpay.com · https://api-docs.metalpay.com | Metallicus | LIVE (read 2026-10-19; API docs site shows only a login) |
| Metal Pay support ticket | The real support path: submit a request through the help center (useful against fake "support" accounts) | https://help.metalpay.com/hc/en-us/requests/new | Metallicus | LIVE (read 2026-10-19) |
| Metal Pay help sections | Registration and verification; account access; funding; crypto deposits and withdrawals; trading; trading-fee structure article | https://help.metalpay.com/hc/en-us/sections/4409167245975-Registration-and-Verification · https://help.metalpay.com/hc/en-us/sections/4409444883863-Account-Access · https://help.metalpay.com/hc/en-us/sections/4409446961687-Funding-Your-Metal-Pay-Account · https://help.metalpay.com/hc/en-us/sections/4409445405719-Crypto-Deposits-Withdrawals · https://help.metalpay.com/hc/en-us/sections/4409445418519-Trading · https://help.metalpay.com/hc/en-us/articles/4409463514391-What-is-the-Trading-Fee-Structure-on-Metal-Pay | Metallicus | LISTED (linked from the Metal Pay help center, not opened) |
| Metal Pay social accounts | X, Telegram, Reddit, Instagram and Facebook from the official footer | https://twitter.com/metalpaysme · https://t.me/metalpaysme · https://www.reddit.com/r/MetalPay/ · https://www.instagram.com/metalpaysme/ · https://www.facebook.com/metalpaysme | Metallicus | LISTED (linked from metalpay.com, not opened) |

**Metal X**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Metal X terms | Terms of Service, Metallicus, Inc. The page gives no updated date (only "© 2024 Metallicus, Inc.") | https://metalx.com/terms | Metallicus | LIVE (read 2026-10-19; page undated) |
| Metal X news | News index | https://metalx.com/news | Metallicus | LIVE (read 2026-10-19) |
| Metal X news: features and LOAN | Complete features guide; LOAN protocol update; LOAN phased reopening announcement | https://metalx.com/news/metal-x-complete-features-guide · https://metalx.com/news/loan-protocol-update · https://metalx.com/news/loan-phased-reopening-announcement | Metallicus | LISTED (linked from metalx.com and its sitemap, not opened) |
| Metal X learn | Learn hub; trading-bot guide; capabilities overview | https://metalx.com/learn · https://metalx.com/learn/trading-bot · https://metalx.com/learn/capabilities | Metallicus | LISTED (linked from metalx.com and its sitemap, not opened) |
| Metal X site pages | Markets; lending | https://metalx.com/markets · https://metalx.com/lending | Metallicus | LISTED (linked from metalx.com and its sitemap, not opened) |
| Metal X get-started guides | Create a wallet; verify identity (KYC); deposit assets; mint Metal Dollar | https://metalx.com/get-started/create-wallet · https://metalx.com/get-started/verify-identity · https://metalx.com/get-started/deposit-assets · https://metalx.com/get-started/metal-dollar | Metallicus | LISTED (linked from metalx.com, not opened) |
| Metal X on metallicus.com | Product pages: Metal X; Metal X Lending; Metal X Staking | https://metallicus.com/individuals/metal-x · https://metallicus.com/individuals/metal-x-lending · https://metallicus.com/individuals/metal-x-staking | Metallicus | LISTED (linked from metallicus.com, not opened) |
| Metal X app sections | DEX trading; liquidity pools; farms; OTC; streaming payments; crypto gift; fiat on-ramp (swap, lending and bridge are already in §1) | https://app.metalx.com/dex · https://app.metalx.com/pools · https://app.metalx.com/farms · https://app.metalx.com/otc · https://app.metalx.com/stream · https://app.metalx.com/gift · https://app.metalx.com/buy | Metallicus | LISTED (linked from metalx.com and xprnetwork.org, not opened) |
| Metal X DEX bot | Official market-maker / grid trading bot (MIT), linked from the "Trading Bot" footer link; its docs page | https://github.com/XPRNetwork/dex-bot · docs https://docs.metalx.com/dex-bot/about.md | Metallicus (XPRNetwork GitHub org) | Repo LIVE (read 2026-10-19). Docs LISTED (linked from docs.metalx.com/llms.txt, not opened) |
| Metal X API reference | API reference start page (footer "API" link) | https://api.dex.docs.metalx.com/reference/what-is-metal-x | Metallicus | LISTED (linked from metalx.com, not opened) |
| Metal X docs: contracts and errors | DEX contract addresses; DEX common errors | https://docs.metalx.com/developers-dex/smart-contract/contract-address.md · https://docs.metalx.com/developers-dex/contract-mappings/common-errors.md | Metallicus | LISTED (linked from docs.metalx.com/llms.txt, not opened) |
| Metal X docs: audits | DEX audit page; swap audit page (dates and auditors not read) | https://docs.metalx.com/developers-dex/audit.md · https://docs.metalx.com/developers-swap/tables/audit.md | Metallicus | LISTED (linked from docs.metalx.com/llms.txt, not opened) |
| Metal X docs: fees | DEX fees and discounts | https://docs.metalx.com/dex/what-is-metal-x/dex-fees-and-discounts.md | Metallicus | LISTED (linked from docs.metalx.com/llms.txt, not opened) |
| Metal X docs short address | Redirects (302) to docs.metalx.com | https://dex.docs.metalx.com | Metallicus | LIVE (read 2026-10-19; redirect) |
| Metal X University | Crypto education platform: courses and guides for Metal X and Metal Pay | https://university.metalx.com | Metallicus | LIVE (read 2026-10-19) |
| Metal X testnet | Metal X on testnet (XPR/XMD trading page) | https://testnet.app.metalx.com | Metallicus | LIVE (read 2026-10-19) |
| Metal X social accounts | Instagram and Facebook from the official footer; Metal X topic in the XPR Network Telegram group | https://www.instagram.com/MetalXApp/ · https://www.facebook.com/MetalXApp · https://t.me/XPRNetwork/931709 | Metallicus | LISTED (linked from metalx.com, not opened) |

**Metal Dollar**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Metal Dollar on metallicus.com | Overview; page for individuals; page for institutions | https://metallicus.com/metal-dollar · https://metallicus.com/individuals/metal-dollar · https://metallicus.com/institutions/metal-dollar | Metallicus | LISTED (linked from metallicus.com, not opened) |
| Metal Dollar site pages | Developers; stablecoin-as-a-service; "XMD in motion" | https://metaldollar.com/developers · https://metaldollar.com/stablecoin-as-a-service · https://metaldollar.com/xmd-in-motion | Metallicus | LISTED (linked from metaldollar.com and its sitemap, not opened) |
| Metal Dollar newsroom | Blog index, and posts on what is in the XMD basket, the proposed stablecoin CIP rules, and the GENIUS Act | https://metaldollar.com/blog · https://metaldollar.com/blog/inside-the-metal-dollar-basket · https://metaldollar.com/blog/proposed-stablecoin-cip-rules-reinforce-the-metal-dollar-model · https://metaldollar.com/blog/the-genius-act-explained-what-new-stablecoin-regulations-mean-for-you | Metallicus | LISTED (linked from metaldollar.com, not opened) |
| Metal Dollar app (XPR) | Metal Dollar app and its mint-and-redeem page on XPR (the treasury page and the Ethereum app are in §1) | https://dollar.metalx.com · https://dollar.metalx.com/mint-n-redeem | Metallicus | LISTED (linked from metaldollar.com, not opened) |
| Metal Dollar testnet | Testnet app ("Decentralized stablecoin basket"); testnet.metaldollar.com redirects (302) to it | https://testnet.dollar.metalx.com · https://testnet.metaldollar.com | Metallicus | LIVE (read 2026-10-19; loads only in a browser) |
| Metal Dollar on X | Official X account | https://x.com/MetalDollarXMD | Metallicus | LISTED (linked from metaldollar.com, not opened) |

**Metal Blockchain**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Site index and news archive | Site sitemap; lists the news archive (about 70 posts beyond those below, mostly credit-union partners) | https://metalblockchain.org/sitemap_en-US.xml | Metallicus | LIVE (read 2026-10-19) |
| Whitepaper page | Whitepaper page from the footer (the PDF is already in §1) | https://metalblockchain.org/whitepaper | Metallicus | LISTED (linked from the metalblockchain.org footer, not opened) |
| Guides | Guides index; how to stake as a validator; node requirements; run a cheap VPS node; staking FAQ; deposit from WebAuth to Metal Wallet | https://metalblockchain.org/guides · https://metalblockchain.org/guides/how-to-stake-as-a-validator · https://metalblockchain.org/guides/node-requirements-for-metal-blockchain · https://metalblockchain.org/guides/run-a-cheap-metal-blockchain-vps-node · https://metalblockchain.org/guides/the-metal-blockchain-staking-faq · https://metalblockchain.org/guides/how-to-deposit-from-webauth-to-metal-wallet | Metallicus | LISTED (linked from metalblockchain.org and its sitemap, not opened) |
| Programmes | Integrations; Banking Innovation Program | https://metalblockchain.org/integrations · https://metalblockchain.org/banking-innovation-program | Metallicus | LISTED (linked from metalblockchain.org and its sitemap, not opened) |
| News: VMs and core development | BTCVM / LTCVM / DogecoinVM live (in alpha); BitcoinVM; core developer update | https://metalblockchain.org/news-insights/btcvm-ltcvm-dogecoinvm-live-on-metal-blockchain · https://metalblockchain.org/news-insights/bitcoinvm-on-metal-blockchain · https://metalblockchain.org/news-insights/core-developer-update | Metallicus | LISTED (linked from metalblockchain.org and its sitemap, not opened) |
| Docs sections | Overview; quick start; nodes and validators; subnets; MetalGo APIs | https://docs.metalblockchain.org/intro · https://docs.metalblockchain.org/quickstart · https://docs.metalblockchain.org/nodes · https://docs.metalblockchain.org/subnets · https://docs.metalblockchain.org/apis/metalgo/apis | Metallicus | LISTED (linked from docs.metalblockchain.org, not opened) |
| Metal Wallet | Self-custody wallet for METAL | https://wallet.metalblockchain.org | Metallicus | LIVE (read 2026-10-19; loads only in a browser) |
| Tahoe testnet tools | Explorer (served on the Tahoe testnet host); testnet faucet; testnet bridge ("Metal Blockchain Bridge") | https://tahoe-explorer.metalblockchain.org · https://faucet.metalblockchain.org · https://bridge-tahoe.metalblockchain.org | Metallicus | LIVE (read 2026-10-19). Faucet and bridge load only in a browser |
| ISO 20022 demo | Page titled "ISO20022 DEMO" | https://iso20022.metalblockchain.org | Metallicus | LIVE (read 2026-10-19; loads only in a browser) |
| Metal Blockchain social and developer channels | X; Telegram; developer Telegram; Discord; Reddit; YouTube | https://x.com/metalblockchain · https://t.me/metalblockchain · https://t.me/metaldevelopers · https://discord.gg/B2QDmgf · https://www.reddit.com/r/MetalBlockchain/ · https://www.youtube.com/channel/UCbB7oW7WQIpk5KIY5gkHJrA | Metallicus | LISTED (linked from metalblockchain.org and docs.metalblockchain.org, not opened) |

**Metal L2**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Metal L2 audit (PDF) | Smart-contract audit by PeckShield, dated 29 Oct 2023 (footer "Audit" link) | https://migrate.metall2.com/Metal_L2_Audit.pdf | Metallicus | LIVE (read 2026-10-19) |
| Metal L2 news | News index, and posts: MIP-002 "Homecoming" (Metal L2 moving to Metal Blockchain); Upgrade 19 hardfork; Metal L2 grant fund; dRPC as an official RPC provider; MTL migration. More posts (upgrades 14 to 17, Velodrome, Ionic, airdrop) are in the sitemap | https://metall2.com/news · https://metall2.com/news-insights/announcing-mip-002-homecoming · https://metall2.com/news-insights/announcing-upgrade-19 · https://metall2.com/news-insights/metal-l2-grant-fund · https://metall2.com/news-insights/drpc-becomes-an-official-rpc-endpoint-provider-for-metal-l2 · https://metall2.com/news-insights/mtl-migration | Metallicus | LISTED (linked from metall2.com and its sitemap, not opened) |
| MIP-002 Homecoming page | Metal DAO proposal page: move Metal L2 to a Metal Blockchain subnet with MTL as gas | https://homecoming.metall2.com | Metallicus | LIVE (read 2026-10-19) |
| Metal DAO (MTL) whitepaper copy | MTL whitepaper PDF hosted on the Metal Dollar app host (the v1.0 PDF on cdn.metallicus.com is in the guide already) | https://dollar.metalx.com/XMT_Whitepaper.pdf | Metallicus | LISTED (linked from metall2.com, not opened) |
| Docs: chain | Networks and RPC endpoints; contract addresses; bridged token list | https://docs.metall2.com/chain/networks · https://docs.metall2.com/chain/addresses · https://docs.metall2.com/chain/tokenlist | Metallicus | LISTED (linked from docs.metall2.com, not opened) |
| Docs: security | Security policy; privileged roles; security model FAQ; audit reports | https://docs.metall2.com/chain/security/security-policy · https://docs.metall2.com/chain/security/privileged-roles · https://docs.metall2.com/chain/security/faq · https://docs.metall2.com/stack/security/audits-report | Metallicus | Security policy LIVE (read 2026-10-19). Others LISTED (linked from docs.metall2.com, not opened) |
| Docs source | Metal L2 docs repository | https://github.com/MetalPay/metal-l2-docs | Metallicus (MetalPay GitHub org) | LISTED (linked from docs.metall2.com, not opened) |
| Metal L2 Safe | Smart-account (multisig) wallet for Metal L2 | https://safe.metall2.com | Metallicus | LIVE (read 2026-10-19) |
| Metal L2 testnet tools | Testnet block explorer (built by Conduit); testnet bridge (Sepolia to Metal L2 Testnet) | https://testnet.explorer.metall2.com · https://testnet.bridge.metall2.com | Metallicus | LIVE (read 2026-10-19) |
| Metal L2 on X | Official X account | https://twitter.com/Metal_L2 | Metallicus | LISTED (linked from metall2.com, not opened) |

**PulseVM**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| PulseVM for AI agents | Machine quickstart for AI agents; llms.txt listing about 60 Markdown pages | https://pulsevm.dev/agents · https://pulsevm.dev/llms.txt | Community docs by Paul Grey (Proton NZ); PulseVM itself is Metallicus's | LIVE (read 2026-10-19) |
| PulseVM full text and sitemap | Full-text llms file; sitemap | https://pulsevm.dev/llms-full.txt · https://pulsevm.dev/sitemap.xml | Community docs by Paul Grey (Proton NZ) | LISTED (linked from pulsevm.dev/agents, not opened) |
| PulseVM guide pages | What PulseVM is; migrating an Antelope chain | https://pulsevm.dev/guide/what-is-pulsevm · https://pulsevm.dev/guide/migrate-antelope-chain.md | Community docs by Paul Grey (Proton NZ) | LISTED (linked from pulsevm.dev and its llms.txt, not opened) |
| PulseVM network pages | Endpoints; network updates; run a validator; upgrade to metalgo 1.14 (Granite) | https://pulsevm.dev/network/endpoints · https://pulsevm.dev/network/updates · https://pulsevm.dev/network/validator · https://pulsevm.dev/network/upgrade-metalgo-1-14 | Community docs by Paul Grey (Proton NZ) | LISTED (linked from pulsevm.dev, not opened) |
| PulseVM build pages | Tutorial: a bot key that can only trade; permissions cookbook | https://pulsevm.dev/build/tutorial-bot-key · https://pulsevm.dev/build/permissions-cookbook | Community docs by Paul Grey (Proton NZ) | LISTED (linked from pulsevm.dev, not opened) |
| PulseVM background | Who is behind PulseVM (a sourced page on Metallicus); comparisons | https://pulsevm.dev/institutions/metallicus · https://pulsevm.dev/compare/ | Community docs by Paul Grey (Proton NZ) | LISTED (linked from pulsevm.dev, not opened) |
| PulseVM code | Docs source repo; XPR-to-PulseVM migration tools repo (its release feed is already in the guide) | https://github.com/paulgnz/pulsevm-docs · https://github.com/paulgnz/pulse-cutover | Paul Grey (Proton NZ) | LISTED (linked from pulsevm.dev and protonnz.com, not opened) |
| PulseVM Telegram | Telegram group linked from the docs site | https://t.me/+N1mAvoUDbtVmNTBh | Community docs by Paul Grey (Proton NZ) | LISTED (linked from pulsevm.dev, not opened) |

**XPR Agents**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| XPR Network AI Agents page | XPR Network's landing page for AI agents | https://xprnetwork.org/agents | XPR Network | LIVE (read 2026-10-19) |
| "Introducing XPR Agents" | Official XPR Network blog post announcing XPR Agents (it still links the old agents.protonnz.com host: see Notes) | https://xprnetwork.org/blog/introducing-xpr-agents | XPR Network | LIVE (read 2026-10-19) |
| XPR Agent Deploy | Launches cloud-hosted AI agents that have their own XPR accounts and bid on the XPR Agents job board | https://deploy.xpragents.com | Proton NZ | LIVE (read 2026-10-19) |
| XPR Agents marketplace pages | Services directory; jobs board; leaderboard; validators; arbitrators | https://xpragents.com/services · https://xpragents.com/jobs · https://xpragents.com/leaderboard · https://xpragents.com/validators · https://xpragents.com/arbitrators | Proton NZ | LISTED (linked from xpragents.com, not opened) |
| XPR Agents onboarding pages | Register an agent; how it works; get started / deploy; dashboard | https://xpragents.com/register · https://xpragents.com/how-it-works · https://xpragents.com/get-started · https://xpragents.com/dashboard | Proton NZ | LISTED (linked from xpragents.com and its sitemap, not opened) |
| XPR Agents specs | Security model; A2A (agent-to-agent) protocol spec | https://github.com/XPRNetwork/xpr-agents/blob/main/docs/SECURITY.md · https://github.com/XPRNetwork/xpr-agents/blob/main/docs/A2A.md | XPRNetwork GitHub org | LISTED (linked from xpragents.com, not opened) |
| XPR Network dev skill repo | The official developer skill's repository page (the guide already links its raw files) | https://github.com/XPRNetwork/xpr-network-dev-skill | XPRNetwork GitHub org | LIVE (read 2026-10-19) |
| XPR Agents contracts | Explorer pages for the four contracts: `agentcore`, `agentfeed`, `agentvalid`, `agentescrow` | https://explorer.xprnetwork.org/account/agentcore · https://explorer.xprnetwork.org/account/agentfeed · https://explorer.xprnetwork.org/account/agentvalid · https://explorer.xprnetwork.org/account/agentescrow | Proton NZ (contracts); explorer by XPR Network | LISTED (linked from xpragents.com, not opened) |

**SimpleDEX**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| SimpleDEX sitemap | Lists about 274 token pages and about 290 launch pages | https://simpledex.fun/sitemap.xml | Proton NZ | LIVE (read 2026-10-19) |
| SimpleDEX terms | "Terms of Use — SimpleDEX". The page gives no date and names no operating company | https://simpledex.fun/terms | Proton NZ | LIVE (read 2026-10-19; page undated) |
| SimpleDEX launchpad | Launch index; create a launch; one page per launch at `/launch/<ID>` (the guide already has the `/token/<ID>` pattern) | https://simpledex.fun/launch · https://simpledex.fun/launch/create · https://simpledex.fun/launch/ID | Proton NZ | LISTED (linked from the simpledex.fun sitemap, not opened) |
| SimpleDEX trading pages | Token list; swap; pools; analytics; history; wallet | https://simpledex.fun/tokens · https://simpledex.fun/swap · https://simpledex.fun/pools · https://simpledex.fun/analytics · https://simpledex.fun/history · https://simpledex.fun/wallet | Proton NZ | LISTED (linked from the simpledex.fun sitemap, not opened) |

**Proton NZ tools**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| LOANWatch | Live analytics for LOAN Protocol: borrowing, lending, health factors, fees, shorts. The site says it does not custody funds | https://loanwatch.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| Vaults (**deposit service**) | "Automated trading on XPR Network": you deposit into a vault and a bot trades a chosen strategy on Metal X. **It takes deposits.** Its own risk terms were not read in the sweep | https://vaults.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| X-Tools | Search and analysis of DEX referrals on XPR Network | https://x-tools.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| GOV Explorer | Governance proposal tracker | https://gov.protonnz.com | Proton NZ | LIVE (read 2026-10-19; showed "0 of 0 proposals" while loading, so it loads only in a browser) |
| Hyperion history API | Hyperion history endpoints: mainnet (version 4.0.8, chain "proton") and testnet (v3.3.10-2, chain proton-test) | https://hyperion-xpr-mainnet.protonnz.com · https://hyperion-testnet.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| Chain API node | XPR chain API node (get_info answers; server v5.0.3) | https://api.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| Simple XPR Block Explorer | Account and block lookup; its API is provided by Saltant | https://account.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| Developer docs copy | A copy of the XPR developer documentation (dApps, contracts, SDK and CLI); the official docs are docs.xprnetwork.org | https://docs.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| NFT manager | FACINGS Creator: AtomicAssets NFT collection manager for XPR | https://nftmanager.protonnz.com | Proton NZ (hosts it) | LIVE (read 2026-10-19) |
| Rewards split | One-click tool that applies Proton NZ's block-producer reward policy on-chain (75% to `xprgrants`) | https://rewards.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| Jelli | Community scroll story promoting XPR, which calls itself unofficial; ends with a free NFT | https://jelli.protonnz.com | Proton NZ | LIVE (read 2026-10-19) |
| Proton NZ node status | Proton NZ's own node status page | https://www.protonnz.com/status | Proton NZ | LIVE (read 2026-10-19) |
| Proton NZ sitemap | Sitemap of protonnz.com (blog and pages) | https://www.protonnz.com/sitemap.xml | Proton NZ | LIVE (read 2026-10-19) |
| Proton NZ company pages | About; contact; terms; privacy; ownership disclosure; code of conduct | https://www.protonnz.com/about · https://www.protonnz.com/contact · https://www.protonnz.com/terms · https://www.protonnz.com/privacy · https://www.protonnz.com/ownership · https://www.protonnz.com/code-of-conduct | Proton NZ | LISTED (linked from protonnz.com, not opened) |
| Proton NZ blog posts | Introducing private transactions; introducing XPR Tax; introducing XPR Agents; how to set up an XPR block producer | https://www.protonnz.com/blog/introducing-private-transactions · https://www.protonnz.com/blog/introducing-xpr-tax · https://www.protonnz.com/blog/introducing-xpr-agents · https://www.protonnz.com/blog/how-to-setup-xpr-network-block-producer | Proton NZ | LISTED (linked from protonnz.com and its sitemap, not opened) |

**Notes**
- **XPR Network's "2023 Development Proposal" PDF does not load.** The xprnetwork.org footer links it as `http://xprnetwork.org/phoenix.pdf`. It failed in the sweep and again over https on 2026-10-19. Don't cite it until it loads.
- **An official post still links an old address.** "Introducing XPR Agents" (xprnetwork.org) links `agents.protonnz.com/llms.txt` and `agents.protonnz.com/jobs`. That host now redirects to xpragents.com (§14), so use xpragents.com/llms.txt (§4) and https://xpragents.com/jobs.
- **The Metal L2 audit sits on a near-empty host.** The front page of migrate.metall2.com shows only the title "Metal L2 Migrate". The audit PDF on it loads.
- **Metal Pay Connect's developer docs have now been opened.** §1c says connect-docs.metalpay.com was "not opened here". It loaded on 2026-10-19 and needs an API key.
- **Legal pages without dates.** The Metal X terms and the SimpleDEX terms give no "updated" date (Metal X shows only "© 2024 Metallicus, Inc."). The SimpleDEX terms name no operating company. Say "page undated" when citing either one.
- **Big archives are summed up, not listed.** The Metallicus blog has about 110 more posts and the xprnetwork.org blog has more posts (comparisons with Ethereum and Solana, ISO 20022, hackathon). Both are in the sitemaps already linked in the guide. Metal Pay has about 190 weekly news posts, Metal Blockchain about 70 news posts, and the XPR docs about 100 pages; the rows above link their index pages.

### 15b. GitHub repos added by the 2026-10-19 sweep

Found with a GitHub search on 2026-10-19. These links were not in the guide before. **Being listed here does not mean the code was audited or is safe, and code existing does not mean a product is live.** Check a repo yourself before you rely on it.

- **Last push** = the repo's `pushed_at` date as GitHub reported it on 2026-10-19. **Stars** = the star count that day.
- **Status:** ACTIVE = pushed in 2026 · QUIET = last pushed in 2025 · OLD = last pushed before 2025 · ARCHIVED = GitHub marks the repo archived (read-only).
- "(fork)" = a copy of another project kept by this owner.
- Some repos below are trading or liquidation bots. They are listed so people know they exist. RULES §5 still applies: GUARD.IAN explains how things work and never builds, tunes or speeds up a bot meant to beat other bots.

#### XPRNetwork (official)

| Repo | What it is | Last push | Stars | Status |
|---|---|---|---|---|
| https://github.com/XPRNetwork/xpr-network-dev-skill | The official XPR dev skill for Claude Code: the repo page itself (the guide had only its raw files) | 2026-10-16 | 11 | ACTIVE |
| https://github.com/XPRNetwork/proton-cli | The `proton` command-line tool | 2026-08-28 | 22 | ACTIVE |
| https://github.com/XPRNetwork/ts-smart-contracts | Write XPR smart contracts in TypeScript (proton-tsc) | 2024-01-04 | 35 | OLD |
| https://github.com/XPRNetwork/ts-smart-contract-docs | Docs site source for the TypeScript contracts | 2026-06-11 | 4 | ACTIVE |
| https://github.com/XPRNetwork/dex-bot | Official Metal X DEX trading bot | 2026-10-19 | 17 | ACTIVE |
| https://github.com/XPRNetwork/xpr-loan-liquidation-bot | LOAN protocol liquidation bot | 2026-06-12 | 9 | ACTIVE |
| https://github.com/XPRNetwork/vert | Testing library for blockchain contracts | 2026-10-02 | 3 | ACTIVE |
| https://github.com/XPRNetwork/proton-resources | Resources app (RAM, CPU, NET) | 2026-10-18 | 8 | ACTIVE |
| https://github.com/XPRNetwork/xpr.start | Start scripts for a mainnet node or block producer | 2026-08-31 | 7 | ACTIVE |
| https://github.com/XPRNetwork/xpr-testnet.start | Start scripts for a testnet node | 2026-08-31 | 9 | ACTIVE |
| https://github.com/XPRNetwork/wharfkit-plugin-webauth | WharfKit wallet plugin for WebAuth | 2026-02-26 | 1 | ACTIVE |
| https://github.com/XPRNetwork/xpr-market | NFT market frontend | 2026-03-30 | 4 | ACTIVE |
| https://github.com/XPRNetwork/xpr-market-template | White-label NFT marketplace template | 2022-11-09 | 42 | OLD |
| https://github.com/XPRNetwork/developer-examples | Developer examples | 2025-01-21 | 4 | QUIET |
| https://github.com/XPRNetwork/xpr-backend-examples | Backend examples for common transactions | 2022-11-09 | 10 | OLD |
| https://github.com/XPRNetwork/XPRNKit | React Native kit | 2024-11-19 | 2 | OLD |
| https://github.com/XPRNetwork/eosio.evm | EOSIO EVM implementation | 2024-10-29 | 93 | OLD |
| https://github.com/XPRNetwork/proton-rng | On-chain random number contract | 2025-04-17 | 2 | QUIET |
| https://github.com/XPRNetwork/proton-oracle | Price oracle contract | 2024-07-18 | 5 | OLD |
| https://github.com/XPRNetwork/chain-info | Chain information metadata | 2025-04-14 | 0 | QUIET |
| https://github.com/XPRNetwork/bloks-docs | Source of the docs.bloks.io docs | 2025-07-04 | 0 | QUIET |
| https://github.com/XPRNetwork/test-walletconnect | WalletConnect test app | 2025-10-17 | 0 | QUIET |
| https://github.com/XPRNetwork/xpr-ide | In-browser IDE for TypeScript contracts | 2023-10-19 | 0 | OLD |
| https://github.com/XPRNetwork/webauth-discourse-plugin | "Log in with WebAuth" for Discourse forums | 2023-08-13 | 1 | OLD |
| https://github.com/XPRNetwork/proton.token | Token contract | 2023-03-06 | 2 | OLD |
| https://github.com/XPRNetwork/proton-mnemonic | Library that makes keys from mnemonic words | 2023-05-05 | 0 | OLD |
| https://github.com/XPRNetwork/consortium | Consortium repo | 2024-05-01 | 0 | OLD |
| https://github.com/XPRNetwork/hyperion-api | Hyperion history API client | 2023-03-05 | 30 | ARCHIVED |
| https://github.com/XPRNetwork/xpr-ai-nft-mint | AI NFT mint demo | 2025-03-24 | 2 | ARCHIVED |
| https://github.com/XPRNetwork/dex-ccxt | CCXT trading library with Metal X DEX support (fork) | 2026-01-15 | 6 | ACTIVE |
| https://github.com/XPRNetwork/ProtonSwift | Old Swift (iOS) SDK from the Proton Chain days | 2021-11-10 | 15 | ARCHIVED |
| https://github.com/XPRNetwork/ProtonKotlin | Old Kotlin (Android) SDK from the Proton Chain days | 2021-10-21 | 12 | ARCHIVED |

#### MetalBlockchain (official)

| Repo | What it is | Last push | Stars | Status |
|---|---|---|---|---|
| https://github.com/MetalBlockchain/btc-vm | BTCVM: a Bitcoin-compatible L1 on Metal, bridged to Bitcoin. A newer repo, separate from `btcvm` (already in the guide) | 2026-09-27 | 0 | ACTIVE |
| https://github.com/MetalBlockchain/hyperion-rs | Hyperion (history API) written in Rust | 2026-10-14 | 2 | ACTIVE |
| https://github.com/MetalBlockchain/pulsevm-js | TypeScript SDK for PulseVM | 2026-10-14 | 1 | ACTIVE |
| https://github.com/MetalBlockchain/pulse-cdt-rust | Rust kit for writing PulseVM contracts | 2026-08-12 | 4 | ACTIVE |
| https://github.com/MetalBlockchain/mtl-migration-public | MTL migration (public). Nearly empty: about 1 KB | 2026-07-20 | 0 | ACTIVE |
| https://github.com/MetalBlockchain/antelopevm | Older Antelope-based VM for Metal | 2023-09-28 | 8 | OLD |
| https://github.com/MetalBlockchain/metal-wallet | The Metal Blockchain web wallet (fork) | 2026-05-27 | 0 | ACTIVE |
| https://github.com/MetalBlockchain/subnet-evm | Launch your own EVM as a Metal subnet (fork) | 2026-07-19 | 1 | ACTIVE |
| https://github.com/MetalBlockchain/coreth | EVM code for the C-Chain (fork) | 2026-06-24 | 1 | ACTIVE |
| https://github.com/MetalBlockchain/metaljs | Metal JavaScript library (fork) | 2025-01-30 | 1 | QUIET |
| https://github.com/MetalBlockchain/metal-network-runner | Run a Metal network locally (fork) | 2026-04-02 | 1 | ACTIVE |
| https://github.com/MetalBlockchain/metal-docs | Metal Blockchain docs source (fork) | 2026-02-04 | 0 | ACTIVE |
| https://github.com/MetalBlockchain/blockscout | EVM block explorer (fork) | 2026-07-23 | 1 | ACTIVE |
| https://github.com/MetalBlockchain/pulsevm-hyperion | Full-history API for PulseVM chains (fork) | 2026-02-06 | 0 | ACTIVE |
| https://github.com/MetalBlockchain/metal-cli | Metal command-line tool (fork) | 2024-06-20 | 0 | OLD |
| https://github.com/MetalBlockchain/ledger-app-metal | Ledger hardware-wallet app for METAL | 2022-10-06 | 0 | OLD |

#### MetalLayer2 (likely official)

Org: https://github.com/MetalLayer2. **The org name and content point to Metal L2; ownership not confirmed** (no link from an official Metal L2 page was found).

| Repo | What it is | Last push | Stars | Status |
|---|---|---|---|---|
| https://github.com/MetalLayer2/metal-l2-docs | Metal L2 docs source (default branch `start_of_rewrite`) | 2025-06-30 | 1 | QUIET |
| https://github.com/MetalLayer2/subnet-evm | Described as "The VM supporting the homecoming proposal" (fork; no pushes seen since it was copied on 2026-05-06) | 2025-12-15 | 0 | QUIET |
| https://github.com/MetalLayer2/safe-wallet-monorepo | Safe smart-account wallet (fork) | 2025-04-10 | 0 | QUIET |

#### Proton NZ / paulgnz (block producer, community)

| Repo | What it is | Last push | Stars | Status |
|---|---|---|---|---|
| https://github.com/paulgnz/pulsevm-docs | Source of the PulseVM docs site (pulsevm.dev) | 2026-10-19 | 0 | ACTIVE |
| https://github.com/paulgnz/pulse-wallet | Native macOS PulseVM wallet (Secure Enclave, YubiKey) | 2026-10-19 | 0 | ACTIVE |
| https://github.com/paulgnz/pulse-cutover | Antelope-to-PulseVM cutover agent. A community cutover proposal, not an official plan | 2026-10-16 | 0 | ACTIVE |
| https://github.com/paulgnz/pulse-cli-ts | PulseVM command-line tool for XPR developers | 2026-10-19 | 0 | ACTIVE |
| https://github.com/paulgnz/dogecoin-vm-wallet | macOS wallet for Dogecoin and DogecoinVM | 2026-10-02 | 0 | ACTIVE |
| https://github.com/paulgnz/metalgo-setup | One-shot Metal node installer, plus the BTCVM, LTCVM and DogecoinVM L1s | 2026-09-27 | 0 | ACTIVE |
| https://github.com/paulgnz/bridge-operator | Node and peg-signer setup for the BTCVM and DogecoinVM bridges | 2026-09-26 | 0 | ACTIVE |
| https://github.com/paulgnz/pulse-privacy | Confidential transfers for PulseVM / XPR (alpha) | 2026-09-22 | 0 | ACTIVE |
| https://github.com/paulgnz/pulsevm-operator-kit | Operator kit for PulseVM / A-Chain block producers | 2026-09-08 | 0 | ACTIVE |
| https://github.com/paulgnz/pulse-explorer | Pulse testnet explorer | 2026-08-20 | 0 | ACTIVE |
| https://github.com/paulgnz/proton-web-sdk-pulse | proton-web-sdk, Pulse edition | 2026-06-13 | 0 | ACTIVE |
| https://github.com/paulgnz/pulse-web-sdk | Pulse web SDK | 2026-06-13 | 0 | ACTIVE |
| https://github.com/paulgnz/protonnz | Proton NZ site / app source | 2026-09-29 | 0 | ACTIVE |
| https://github.com/paulgnz/openclaw-railway | Railway template to deploy an OpenClaw agent for XPR Agents | 2026-02-23 | 0 | ACTIVE |
| https://github.com/paulgnz/xpr-agent-gateway | Reverse proxy for agents.xpragents.com/{agent} | 2026-02-22 | 0 | ACTIVE |
| https://github.com/paulgnz/shellbook-sdk | SDK for Shellbook, the social network for AI agents | 2026-03-16 | 0 | ACTIVE |
| https://github.com/paulgnz/pricebattle-bots | PriceBattle trading and resolver bot | 2026-01-26 | 0 | ACTIVE |
| https://github.com/paulgnz/xpr-transfer | XPR transfer app | 2026-01-04 | 0 | ACTIVE |
| https://github.com/paulgnz/stack-dash-game | Browser game | 2026-02-16 | 0 | ACTIVE |
| https://github.com/paulgnz/ccxt-xpr-examples | Example arbitrage scripts for Metal X through CCXT | 2023-09-06 | 4 | OLD |
| https://github.com/paulgnz/moltworker-xpr | OpenClaw on Cloudflare Workers, XPR variant (fork) | 2026-02-18 | 0 | ACTIVE |
| https://github.com/paulgnz/xprpy | XPR Network Python library for smart contracts (fork) | 2024-10-19 | 0 | OLD |
| https://github.com/protonnz/dex-bot-agent | DEX bot agent, under the older protonnz account (fork) | 2024-12-02 | 1 | OLD |

#### Community

| Repo | What it is | Last push | Stars | Status |
|---|---|---|---|---|
| https://github.com/alcorexchange/alcor-ui | Alcor Exchange web app (several chains, including XPR) | 2026-10-19 | 164 | ACTIVE |
| https://github.com/alcorexchange/alcor-v2-sdk | Alcor v2 swap SDK | 2026-10-11 | 5 | ACTIVE |
| https://github.com/alcorexchange/docs | Alcor docs source (docs.alcor.exchange) | 2026-10-18 | 0 | ACTIVE |
| https://github.com/charliebot87/xpr-agent-sdk | Agent SDK for XPR | 2026-03-15 | 0 | ACTIVE |
| https://github.com/charliebot87/skill-simpledex-trading | SimpleDEX trading skill for agents | 2026-03-15 | 0 | ACTIVE |
| https://github.com/charliebot87/sniper-detector | Launch-sniper detector | 2026-03-15 | 0 | ACTIVE |
| https://github.com/charliebot87/mpp-xpr | XPR payments for the Machine Payments Protocol (MPP) | 2026-09-09 | 0 | ACTIVE |
| https://github.com/charliebot87/x402-demo | x402 machine-payments demo | 2026-09-09 | 1 | ACTIVE |
| https://github.com/charliebot87/mpp-xpr-starter | Starter project for MPP on XPR | 2026-09-09 | 0 | ACTIVE |
| https://github.com/charliebot87/xpr-account-trust-cli | Command-line account trust check | 2026-09-09 | 0 | ACTIVE |
| https://github.com/charliebot87/xpr-hyperion-rotation | Rotates Hyperion endpoints for XPR agents | 2026-02-26 | 0 | ACTIVE |
| https://github.com/charliebot87/metalx-order-bot-v2 | Read-only Telegram alerts for Metal X order fills | 2026-05-24 | 0 | ACTIVE |
| https://github.com/charliebot87/xpr-arb-radar | Arbitrage radar | 2026-05-20 | 0 | ACTIVE |
| https://github.com/charliebot87/xpr-nft-creator | NFT creator | 2026-03-28 | 0 | ACTIVE |
| https://github.com/charliebot87/blog | Source of blog.charliebot.dev | 2026-04-02 | 0 | ACTIVE |
| https://github.com/SuperstrongBE/signbox | Local signing daemon that puts limits on what an AI agent can sign | 2026-08-14 | 0 | ACTIVE |
| https://github.com/SuperstrongBE/xpr_abi_2_ts_types | Turns an XPR contract ABI into TypeScript types | 2026-02-24 | 0 | ACTIVE |
| https://github.com/SuperstrongBE/xprnetwork-guru-site | XPR Network Guru site (Next.js) | 2025-01-31 | 0 | QUIET |
| https://github.com/SuperstrongBE/xpr-guru-bot | XPR Guru help bot | 2025-01-30 | 0 | QUIET |
| https://github.com/SuperstrongBE/block-stream | Block stream (TypeScript) | 2025-08-26 | 0 | QUIET |
| https://github.com/chaininfra/evm-to-xpr-migration | Course: moving EVM contracts to XPR | 2026-05-26 | 1 | ACTIVE |
| https://github.com/chaininfra/metal-validator-guide | Metal validator guide | 2026-05-11 | 0 | ACTIVE |
| https://github.com/chaininfra/xpr-key-refresh | Key refresh tool | 2025-10-16 | 0 | QUIET |
| https://github.com/chaininfra/xpr-delegation-demo | Vote delegation demo (vote.chaininfra.net) | 2025-10-07 | 0 | QUIET |
| https://github.com/Saltant/XPR-Peer-Probe | Diagnostic probe for nodeos peers | 2026-09-07 | 0 | ACTIVE |
| https://github.com/relocke/agentic-abi | Versioned "agentic ABIs" for tokens and contracts | 2026-08-17 | 0 | ACTIVE |
| https://github.com/dougbutner/xpr-app-forge | XPR app template (a template, not a live product: see §12) | 2026-09-13 | 1 | ACTIVE |
| https://github.com/dougbutner/XPR-Tools | Tools for XPR bots; the repo calls itself "Unaudited" | 2026-03-10 | 0 | ACTIVE |
| https://github.com/dougbutner/Flex-Launcher-UI | Flex token launcher UI | 2026-10-15 | 0 | ACTIVE |
| https://github.com/dougbutner/flex-launchpad | Launchpad on the FlexForex engine | 2026-09-16 | 0 | ACTIVE |
| https://github.com/dougbutner/flex-spot-bot | Spot grid bot for EASY/XUSDC, MEME/XPR and INDEX/XPR | 2026-08-05 | 0 | ACTIVE |
| https://github.com/dougbutner/Hedgewaters | EASY-backed loans and flash loans (a template, not a live product: see §12) | 2026-08-28 | 0 | ACTIVE |
| https://github.com/dougbutner/antelope-core-dev-skill | Antelope core development skill | 2026-08-16 | 0 | ACTIVE |
| https://github.com/TetraGrids/Visual-Identity | Tetra Grids logos, brand guide and style guide | 2026-10-17 | 0 | ACTIVE |
| https://github.com/ubitquity/UBQTY | $UBQTY, Ubitquity's utility token on XPR | 2026-08-27 | 0 | ACTIVE |
| https://github.com/ubitquity/UBQ | $UBQ utility token | 2026-06-17 | 1 | ACTIVE |
| https://github.com/ubitquity/XPR-Network-Account-Verifier | Checks whether an XPR account is publicly verified | 2026-05-14 | 0 | ACTIVE |
| https://github.com/ubitquity/UBITQUITY-nDAO-Token-Swap-Tool | Token swap page (Alcor prices, WebAuth login) | 2026-03-11 | 1 | ACTIVE |
| https://github.com/ubitquity/AIRDROP_ARCADE | Airdrop Arcade | 2026-06-09 | 1 | ACTIVE |
| https://github.com/MrAgentSmith26/xmd-interface | "Metal Dollar interface for XPR Network". Unofficial: not a Metallicus repo | 2026-06-15 | 0 | ACTIVE |
| https://github.com/squdgy/xpr-mcp | An MCP server for XPR | 2025-03-28 | 0 | QUIET |
| https://github.com/xprgridrunner/gridrunners | Grid Runners 1/1 Genesis NFT site | 2026-07-18 | 0 | ACTIVE |
| https://github.com/xprcore/XPR-block-producer | Website of the xprcore block producer | 2026-10-19 | 0 | ACTIVE |
| https://github.com/Melxisedek75/gcsc-smart-contractor | GCSC construction escrow app (backend and frontend). The GCSC README says testnet only (§12) | 2026-10-17 | 1 | ACTIVE |
| https://github.com/Melxisedek75/xprclaw | GCSC CLAW, an installable web app | 2026-04-28 | 1 | ACTIVE |
| https://github.com/forkonlyone/alcor-xpr-bot | Arbitrage bot for Alcor on XPR | 2026-05-04 | 0 | ACTIVE |
| https://github.com/chainfeedspace/ChainFeed | Social media platform on XPR | 2026-05-02 | 0 | ACTIVE |
| https://github.com/VirgilBB/Metal-Grafana | Grafana monitoring for Metal validator nodes on Akash | 2025-12-31 | 0 | QUIET |
| https://github.com/Panda404NotFound/GiftForDragons | Off-chain auto-compound bot (same author as ProtonFarming) | 2025-12-13 | 1 | QUIET |

#### Websites set as repo homepages

These sites are named in a repo's homepage field (or, for Alcor docs, its description). "LIVE" means the page answered a fetch on 2026-10-19. Many are apps that need JavaScript, so only the title came back. "DOWN" was a single failed fetch and may be temporary.

| Site | Homepage of | Status |
|---|---|---|
| https://wallet.metalblockchain.org | MetalBlockchain/metal-wallet | LIVE (read 2026-10-19). Title "Redefining Finance \| Metal Wallet"; says it is "a simple, highly secure, non-custodial crypto wallet for storing METAL" |
| https://protonide.com/ | XPRNetwork/xpr-ide | LIVE (read 2026-10-19). Title "Proton IDE"; the repo was last pushed in 2023 |
| sc.protonchain[.]com (no link: old domain, holder not checked) | XPRNetwork/ts-smart-contract-docs | LISTED (repo homepage, not opened: the site's robots.txt blocked the fetch). Old protonchain.com domain |
| https://pulse-privacy-alpha.vercel.app | paulgnz/pulse-privacy | LIVE (read 2026-10-19). Title "Private XPR"; an alpha demo |
| https://pulse-explorer-mocha.vercel.app | paulgnz/pulse-explorer | DOWN (server error, 2026-10-19) |
| https://xpr-transfer.vercel.app | paulgnz/xpr-transfer | LIVE (read 2026-10-19). Title "xpr-transfer" only |
| https://shellbook-sigma.vercel.app | paulgnz/shellbook | LIVE (read 2026-10-19). "Shellbook — The Social Network for AI Agents". The guide's main Shellbook link is shellbook.io |
| https://stack-dash-game.vercel.app | paulgnz/stack-dash-game | LIVE (read 2026-10-19). Title "Neon Dash" |
| https://x402-demo-psi.vercel.app | charliebot87/x402-demo | DOWN (the fetch got a client error, 2026-10-19) |
| https://sniper-detector.vercel.app | charliebot87/sniper-detector | DOWN (server error, 2026-10-19) |
| https://gcsc-builder-ai.vercel.app | Melxisedek75/gcsc-smart-contractor | LIVE (read 2026-10-19). "GCSC Smart Contractor — AI-Powered Construction Escrow & Milestone Payments"; the page doesn't say mainnet or testnet |
| https://docs.alcor.exchange | alcorexchange/docs | LIVE (read 2026-10-19). "Introduction \| Alcor Docs"; docs for the Alcor DEX on WAX, XPR, EOS and Telos |
| protondex[.]com | paulgnz/ccxt-xpr-examples | LISTED (repo homepage, not opened: the site's robots.txt blocked the fetch) |

#### Corrections (found on 2026-10-19)

- **`github.com/metallicus` has no repos of its own.** Its only public repo is a fork of opencv from 2013. Nothing found shows that it is the company, so don't present it as Metallicus on GitHub. The official orgs are XPRNetwork and MetalBlockchain; MetalLayer2 is likely official but not confirmed (above).
- **`github.com/ProtonProtocol` was not found.** GitHub search said no such user or org exists. Don't link it.
- **The `protonnz` GitHub account holds only old demos and forks from 2022 to 2024** (Godot and Unity demos, a dex-bot-agent fork). Current Proton NZ work is under **paulgnz** (table above).
- **The xpr-network-dev-skill repo page is now linked:** https://github.com/XPRNetwork/xpr-network-dev-skill. Before this, the guide linked only its raw files.

### 15c. Ecosystem projects and dApps added by the 2026-10-19 sweep

Found on 2026-10-19 in on-chain records (the token registry `token.proton::tokens`, SimpleDEX launch profiles `simplelaunch::community`, the XPR Agents registry `agentcore::agents`, AtomicAssets collections, the governance site's community records) and on the open web. **LIVE (read 2026-10-19)** means the page itself was opened that day. **LISTED (where)** means the link was only seen in that place and the page was not opened: the project wrote it there itself, and nothing here checks that it works or is still run by that project. Being listed is not an endorsement. A token is still its symbol plus its contract (§8). Projects with no site named here may already be in §2 to §8.

**Directories and developer tools**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| xprstack | Community directory of XPR ecosystem projects (63 entries on 2026-10-19). Also offers a /llms.txt for AI readers | https://www.xprstack.info/ | Community-built (credited on the site; not Metallicus) | LIVE (read 2026-10-19) |
| xprstack schema.json | Machine-readable list of every xprstack entry (name and URL), useful as a feed of new projects. Entries are self-listed: check each one before citing it | https://www.xprstack.info/.well-known/xprstack/schema.json | xprstack | LIVE (read 2026-10-19) |
| Bloks explorer docs, AI-readable | The explorer docs (explorer.xprnetwork.org) in one LLM-friendly file, including the wallet list | https://docs.bloks.io/llms.txt | Bloks | LIVE (read 2026-10-19) |
| xpr-network-dev skill on ClawHub | The OpenClaw skill registry's listing of the official xpr-network-dev skill, v2.0.0, licence MIT-0 | https://clawhub.ai/paulgnz/xpr-network-dev | Paul Grey (paulgnz) | LIVE (read 2026-10-19) |
| xprpy | Python library for XPR Network transactions, v1.0.1 (released 2024-10-19), marked alpha | https://pypi.org/project/xprpy/ · code https://github.com/paulgnz/xprpy | Paul Grey (paulgnz) | LIVE (PyPI page read 2026-10-19); code LISTED (linked from PyPI) |
| @proton/api | npm package for the XPR (Proton) API | https://www.npmjs.com/package/@proton/api | not stated | LISTED (xprstack) |
| Metal X DEX bot | Official code for a Metal X trading bot. This guide explains how such bots work but never helps tune one to beat other traders (RULES §5) | https://github.com/XPRNetwork/dex-bot | XPRNetwork GitHub org | LISTED (linked from metalx.com) |
| TypeScript smart contracts | Official toolkit for writing XPR contracts in TypeScript | https://github.com/XPRNetwork/ts-smart-contracts | XPRNetwork GitHub org | LISTED (official docs; xprstack) |
| NFT market template | White-label NFT marketplace code | https://github.com/XPRNetwork/xpr-market-template | XPRNetwork GitHub org | LISTED (linked from nft.xprnetwork.org/learn-more) |
| WebAuth Discourse plugin | Lets a Discourse forum use WebAuth sign-in | https://github.com/XPRNetwork/webauth-discourse-plugin | XPRNetwork GitHub org | LISTED (linked from xprnetwork.org) |
| mppx-xpr-network | MPP machine payments on XPR | https://github.com/charliebot87/mpp-xpr | Charlie Bot (§4) | LISTED (xprstack) |
| ChainInfra metrics calculator | Validator and block-producer metrics calculator | https://metrics.chaininfra.net/calculator | chaininfra (producer) | LISTED (xprstack) |

**dApps, DeFi and token tools**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| XPRNameSwap | Marketplace for buying and selling XPR @names, with escrow | https://xprnameswap.com | not stated | LIVE (read 2026-10-19) |
| XPRescrow | Escrow dApp. The page showed only its title, so what it does is unconfirmed. It may or may not be the "XPR Escrow" named in §13 | https://xprescrow.com | not stated | UNCLEAR (read 2026-10-19: title only) |
| XPR Checkout | Merchant checkout site (the WordPress plugin repo is in §12) | https://xprcheckout.com | not stated | LISTED (xprstack; the site blocked the automated read) |
| SuchDEX | Peer-to-peer Dogecoin exchange. xprstack files it under XPR, but the page itself names no chain | https://suchdex.com | not stated | LIVE (read 2026-10-19); XPR link not confirmed |
| XPRPS | Says it is a decentralized perpetual-futures exchange on XPR | https://xprps.com | not stated | LISTED (token registry #1002852) |
| BlockHive | No-code token creation, staking and airdrops on XPR | https://www.blockhive.pro/ | not stated | LISTED (token registry #1002978) |
| XPRdrasil (Yggdrasil Protocol) | Liquidity infrastructure, YGG token | https://xprdrasil.vercel.app/ | not stated | LISTED (token registry #1002973) |
| Flex tokens site | Website set for the EASY and HOLOWON flex tokens (flex tokens: §8) | https://flex.forex | not stated | LISTED (token registry #1003004, #1003000) |
| Easy Escrow | EASY / EZSX tokens ("EasyEscrow" is also an old grant title, §13) | https://easyescrow.io/ | not stated | LISTED (token registry #1000165, #1000190) |
| TokenCreate | Site of the token creator behind the `tokencreate` contract (§8), which BlastPad uses | https://tokencreate.io | not stated on the record | LISTED (token registry icon links) |
| Mintify | Token-creation service | https://mintify.space/ | not stated | LISTED (token registry #1000388) |
| Crypto Audit Scanner | TLENS and CAUDIT tokens | https://cryptoauditscanner.com | not stated | LISTED (token registry #1002500, #1002848) |
| CryptoListing | KEYS token | https://cryptolisting.net | Ubitquity (per the registry; Ubitquity tools: §12) | LISTED (token registry #1002531) |
| CipherBPA | Formerly NFTitle Network | https://cipherbpa.com | not stated | LISTED (token registry #1002876) |
| NFTitle DAO (nDAO) | The NDAO token (§8; nDAO's own page is in §8b) | https://nftitledao.org | NFTitle DAO | LISTED (token registry #1000422) |
| HomeBloks | TIPS and MESSAGE tokens | https://homebloks.com | HomeBloks (per the registry) | LISTED (token registry #1000168, #1000297) |
| Snipcoins | SNIPS, Snipverse's utility token (§8) | https://snipcoins.com | not stated | LISTED (token registry #1000081) |
| Frostic | Web hosting, FRO token. Snipverse's grant application names a Frostic, LLC (§3) | https://frostic.net/ | not stated | LISTED (token registry #1000091) |
| SimpleDEX bot companion | Host used for a token logo in the registry; no other detail | https://companion.simpledexbot.us | not stated (not confirmed as Proton NZ) | LISTED (token registry #1002844 icon link) |
| Newer registry tokens with their own sites | NETTWERKED (NETT, #1002963) https://nettwerked.org · Captcha (#1002514) https://captcha.social · ProtonX (PX, #1002850) protonx[.]com · XBOT (#1002537) xbot[.]com (generic domains, may not be the tokens' own sites; no links) | (links in the first column) | not stated | LISTED (token registry; sites not opened) |
| Older registry tokens: utility and services | Sense (XSENSE) https://www.sense.chat · MyJobber (JOBS) https://myjobber.io · Trende Coin (TCX) https://trende.io/ · PorkPay (PORK) https://porkpay.org · Fishtank (MLY/JLY/FSH; also a §13 grant title) https://www.fishtank.ai · Freeos DAO https://freeos.io · Proton Bots (BTS) https://protonbots.io · Amari FM https://www.amari.fm | (links in the first column) | not stated | LISTED (token registry ids 1000014 to 1000448; sites not opened) |

**Agents and bots (endpoints set in the XPR Agents registry)**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| AI Toolkit Agent | Registered agent's service endpoint (agent: §4) | https://toolkitagent.onrender.com | the agent's owner | LISTED (XPR Agents directory) |
| Jacob | Registered agent's endpoint, hosted on OpenClaw | https://api.openclaw.ai/agents/jacobbot | the agent's owner | LISTED (XPR Agents directory) |
| BrobotXPR | Registered agent's endpoint | https://xwlgbucb.agents.pinata.cloud | the agent's owner | LISTED (XPR Agents directory) |
| chattybot | Registered agent's site | https://chattybot.xpragents.com | the agent's owner | LISTED (`agentcore::agents`) |
| Guard.IAN endpoint (this guide's builder) | Guard.IAN's registered endpoint (agent `safeguard5`, §4) | https://agent.standguard.net | this guide's builder | LISTED (`agentcore::agents`) |
| Charlie Bot board | Board for the AGENT token | https://board.charliebot.dev | Charlie Bot (§4) | LISTED (SimpleDEX profile #182) |

**Games**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| NLMT Spin | Daily spin game for NLMT holders; says it pays out BTC, ETH, DOGE or USDC. Links Alcor and BlastPad | https://nlmt.app | not stated | LIVE (read 2026-10-19) |
| Grid Runners app | GRID token's site (the NFT row and the older netlify site are in §6) | https://gridrunners.app/ | not stated | LISTED (token registry #1002957) |
| LuckDrop | NFT staking for the LUCK token | https://luckdrop.fun/ | not stated | LISTED (token registry #1002960) |
| Older registry tokens: games | Proton Keepers (KEEP, 3D game) https://protonkeepers.com/ · Proton Games (GAME/LOTTO) https://www.proton-games.com/ · Proton Spin (SPIN) https://protonspin.live/ · PLAYN (play-to-earn) https://playn.pro · XSTEP (move-to-earn) https://xstep.pro/ · Harju Gaming (HGNT) https://www.harjugaming.net · Versus poker (VS) https://pkrvs.com/ · Metalsea (MLS, fishing) https://metalsea.org · Pixel Heroes (PIXEL/RDM/QST) https://www.pixelheroes.in · SLAM Land https://slam.land · GUESS https://www.guesstoken.org | (links in the first column) | not stated | LISTED (token registry ids 1000036 to 1000560; sites not opened) |

**NFTs and metaverse**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| ProtonMint | One of the oldest XPR NFT marketplaces, MINT token ("protonmint" is also an old grant title, §13) | https://www.protonmint.com | not stated | QUIET? (listed by xprstack and an older ProtonUK newsletter; the site blocked the 2026-10-19 read, so activity is unconfirmed) |
| Proton Pandas: Adventures of Pandania | NFT collection and token | https://pandania.xyz/ · X https://x.com/ProtonPandas | not stated | LISTED (AtomicAssets collection; token registry) |
| Jelli Genesis / Smack Back Badges | Game NFT collection; Jelli Genesis carries the ProtonNZ Team badge on CYPHR.Market (§6) | https://jelli.protonnz.com | Proton NZ | LISTED (AtomicAssets collection) |
| MoonBeasts | NFT collection | https://moonbeasts.surge.sh/ | not stated | LISTED (token registry #1003006) |
| Older registry tokens: NFTs and virtual land | Crystal Frogs (CRYSTAL) https://www.crystalfrogs.com · NeonVerse (NEON) https://neonverse.io · Sights NFT (SIG/MOKUM) https://sights-nft.com · Dragon Token (DRAG) https://dragon-nfts.com · ProtonVerse (PROV) https://protonverse.org · Virtual Land Alliance (VLA) https://vla.properties · Sayari (SPR/DLX) https://planet-sayari.com · LOUNGE https://lounge.land | (links in the first column) | not stated | LISTED (token registry ids 1000038 to 1000249; sites not opened) |

**Community and meme tokens**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Wisteria-Group | SWPHX token's site | https://wisteria-flow-core.base44.app/ | not stated | LISTED (SimpleDEX profile #57) |
| FRAGG pulse page | Page for FRAGG, a CryptoCurrencyShops token (§7, §8) | https://FRAGGpulse.cryptocurrencyshops.com | CryptoCurrencyShops | LISTED (SimpleDEX profile #370) |
| CHAOS | Link page for the CHAOS token | https://heylink.me/CHAOSCNG | not stated | LISTED (SimpleDEX profile #34) |
| Older registry tokens: community and meme | Proton Army (AMMO) https://protonarmy.com · BeQuest Gold (BQG) https://bequest.world · Gratitude Token (GRAT) https://gratitudetoken.world · Liberation (LBTY) https://www.liberateyou.org/ · Astremn https://astremn.org · MAGIC https://magic-ian-metal.com/ · CryptoChinchilla (CRCH) https://cryptochinchilla.fun/ · Proton Dog (DOG) https://protondog.com · CAT https://www.xprcat.com · Proton APE (XAPE) https://protonape.io · Baby Proton (BABYXPR) https://babyproton.io · BUFF https://www.buffcoin.io/ · MEME https://protonmemes.com | (links in the first column) | not stated | LISTED (token registry ids 1000076 to 1000457; sites not opened) |
| Project accounts set in SimpleDEX launch profiles | Broton https://x.com/BrotonXPR · Degen Hoopers (§5) https://x.com/DegenHoopers · https://t.me/DegenVilla · PRICK https://x.com/XLPrick · OG XPR https://x.com/OGXPR · https://t.me/OGXPR · Oni Stacks https://x.com/OniStacksCrew · https://t.me/OniStacksCrew · Beartallicus https://x.com/Beartallicus · THC Arcade (§5) https://x.com/Proton_Valve · https://t.me/ProtonValve · XPR Time Capsule https://x.com/XPRTimeCap · TRAMP https://x.com/TRAMPonXPR · Atomic Ramjet (§5) https://x.com/atomicramjet · nDAO https://x.com/ndaodotorg · https://t.me/ndaoxpr · House of Validators https://x.com/HouseOfValid · https://t.me/HOVCommunity · Panda https://x.com/panda_xpr · Genie https://x.com/Genie_XPR · Leafquip https://x.com/leafquip · https://t.me/leafquip · Metal Monsters https://x.com/METALM0NSTERS · FRAGG https://x.com/FraggletonFRAGG · Charlie Bot https://x.com/charliebot87 · Proton Bull https://x.com/protonbull · MetalX Bot https://x.com/metalxbot · LOANSKI https://x.com/loanskixpr · https://t.me/loanskixprcommunity · Proton Gift Bot (XPRGAMES) https://t.me/proton_gift_bot · KSTO token group https://t.me/Keepsnippingtoken | (links in the first column) | each project | LISTED (`simplelaunch::community`; accounts not opened) |
| Project accounts set in NFT and token records | Element Companions https://x.com/elementcompnft · LoFi Club https://x.com/LoFiClubXPR · Star Dex https://x.com/stardexio · PRYZM https://t.me/pryzm_hub_bot | (links in the first column) | each project | LISTED (AtomicAssets collection; token registry) |

**Metal L2 DeFi (linked from metall2.com)**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Metal L2 on Chainlink's ecosystem page | Chainlink's page for Metal L2 | https://www.chainlinkecosystem.com/ecosystem/metal-l2 | Chainlink | LISTED (linked from metall2.com) |
| Ionic on Metal L2 | Lending market on Metal L2 (chain 1750) | https://app.ionic.money/market?chain=1750&pool=0 | Ionic | LISTED (linked from metall2.com) |
| Velodrome on Metal L2 | Swap into MTL on Metal L2 | https://velodrome.finance/swap?from=eth&to=0xbcfc435d8f276585f6431fc1b9ee9a850b5c00a9&chain0=1750&chain1=1750 | Velodrome | LISTED (linked from metall2.com) |
| Oku | DEX listed as a Metal L2 integration | https://oku.trade/ | Oku | LISTED (linked from metall2.com) |

**Old Proton-era addresses still written on chain**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Legacy domains | Addresses from before the XPR Network and Metal X names, still in on-chain website fields: the governance site's community records (XPR Network, LOAN Protocol, Metal X) and a legacy producer record. Use the current sites (§1) instead | proton[.]org · protonloan[.]com · protondex[.]com · protonchain[.]com (written without links on purpose) | not checked who holds these domains now | QUIET? (legacy addresses, not opened 2026-10-19; they may no longer belong to the project) |

### 15d. Market pages, exchanges, wallets and tax tools

Read 2026-10-19 unless marked LISTED. These pages show prices and markets; they are data sites, not sources of fact about the projects, and **AI summaries on price sites are never sources** (RULES §1). Quote any number as "<site> showed <value> at <time>". None of this is advice to buy, sell or hold. Where XPR trades on XPR Network itself, with deposit accounts: §2b.

**Market data pages**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| CoinMarketCap: XPR Network (XPR) | XPR's CMC page, ID 5350, noted as "rebranded from Proton" | https://coinmarketcap.com/currencies/proton/ | CoinMarketCap | LIVE (read 2026-10-19) |
| CoinMarketCap: Metal Dollar (XMD) | ID 38457, contract `xmd.treasury` | https://coinmarketcap.com/currencies/metal-dollar/ | CoinMarketCap | LIVE (read 2026-10-19) |
| CoinMarketCap: Metal DAO (MTL) | ID 1788 | https://coinmarketcap.com/currencies/metal/ | CoinMarketCap | LIVE (read 2026-10-19) |
| CoinMarketCap: Loan Protocol (LOAN) | LOAN's CMC page | https://coinmarketcap.com/currencies/loan-protocol/ | CoinMarketCap | LISTED (web search) |
| CoinGecko: Loan Protocol (LOAN) | The only market it listed was LOAN/XMD on Metal X. It still gives lending.metalx.com as LOAN's website, which now redirects (§14) | https://www.coingecko.com/en/coins/proton-loan | CoinGecko | LIVE (read 2026-10-19) |
| CoinGecko: Metal Blockchain (METAL) | METAL's CoinGecko page (Slovak-language version, as found) | https://www.coingecko.com/sk/coins/metal-blockchain | CoinGecko | LISTED (web search) |
| CryptoRank: METAL | METAL price page | https://cryptorank.io/price/metal-blockchain/usd | CryptoRank | LISTED (web search) |
| CoinGecko: Metal X exchange | Metal X as a DEX: 14 pairs, top pair XPR/XMD | https://www.coingecko.com/en/exchanges/metalx | CoinGecko | LIVE (read 2026-10-19) |
| CoinMarketCap: Metal X exchange | Metal X's CMC exchange page | https://coinmarketcap.com/exchanges/metal-x/ | CoinMarketCap | LISTED (web search) |
| CoinMarketCap: ProtonSwap | CMC's exchange page for the `proton.swaps` pools (Metal X Swap, §1) | https://coinmarketcap.com/exchanges/protonswap/ | CoinMarketCap | LISTED (web search) |
| Other price and data pages | Trust Wallet price page (it does not show that Trust Wallet supports native XPR) https://trustwallet.com/price/xpr-network · TradingView XPR/USD https://www.tradingview.com/symbols/XPRUSD/ · Bybit price page (a price page; a Bybit listing is not confirmed) https://www.bybit.com/en/price/proton/ · TokenInsight tokenomics https://tokeninsight.com/en/coins/proton/tokenomics · LunarCrush social data https://lunarcrush.com/en/coin/xpr-network-xpr | (links in the first column) | each site | LISTED (web search) |
| Staking Rewards: XPR | XPR staking page | https://www.stakingrewards.com/asset/proton | Staking Rewards | LIVE (read 2026-10-19), but it showed no live data |

**Where to buy: official help pages and the exchange pages they link**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| "Where can I buy METAL?" | Metal Blockchain's help article. It lists Metal Pay, Metal X, Gate.io and MEXC (updated 2025-02-06) | https://help.metalblockchain.org/hc/en-us/articles/9594849942679-Where-can-I-buy-METAL | Metallicus | LIVE (read 2026-10-19) |
| Coinbase: XPR price page | The page says "XPR Network is not tradable on Coinbase", which answers "can I buy XPR on Coinbase?" | https://www.coinbase.com/price/proton | Coinbase | LIVE (read 2026-10-19) |
| Exchange pages linked by the XPR help article | The help article "Where Can I Buy XPR Network (XPR)?" (updated 2025-04-05, §2b) links these. Check that an exchange still lists XPR, and which network it uses, before sending anything: KuCoin https://www.kucoin.com/price/XPR · Gate.io https://www.gate.io/trade/XPR_USDT · OKX (the article links its Turkish-language page) https://www.okx.com/tr/trade-spot/xpr-usdt · Bitrue (generic trade page only) https://www.bitrue.com/trade/ · LATOKEN https://latoken.com/exchange/XPR_USDT · CoinEx https://www.coinex.com/exchange?currency=USDT&dest=XPR · HitBTC https://hitbtc.com/xpr-to-btc · CoinSpot (Australia) https://www.coinspot.com.au/buy/xpr · Easy Crypto (New Zealand) https://easycrypto.com/nz/buy-sell/xpr-proton-chain | (links in the first column) | each exchange | LISTED (XPR help article 4417459294615). CoinGecko's 10-16 market list did not show HitBTC or CoinEx (§2b) |
| Bithumb Global (in the same article) | XPR/USDT page | https://www.bitglobal.com/en-us/spot/trade?q=XPR-USDT | Bithumb Global | QUIET? (still in the article, but the exchange may have closed; not checked) |
| Liquid (in the same article) | XPRUSDT page | https://app.liquid.com/exchange/XPRUSDT?lang=en | Liquid | QUIET? (still in the article; the exchange is believed closed, but that was not verified on 2026-10-19) |
| PancakeSwap: BNB Chain XPR | Info page for the BEP-20 XPR token. It is a token on BNB Chain, not native XPR (§2b) | https://pancakeswap.finance/info/token/0x5de3939b2f811a61d830e6f52d13b066881412ab | PancakeSwap | LISTED (XPR help article 4417459294615) |
| Uniswap v2: Ethereum XPR | Info page for the ERC-20 XPR token (contract `0xd7ef…5da2af`, the same as on CMC). A token on Ethereum, not native XPR (§2b) | https://v2.info.uniswap.org/token/0xd7efb00d12c2c13131fd319336fdf952525da2af | Uniswap | LISTED (XPR help article 4417459294615) |
| MEXC: XPR/USDT | MEXC's XPR market (Philippine-English page, as found). MEXC is also on CoinGecko's list (§2b) | https://www.mexc.com/en-PH/exchange/XPR_USDT | MEXC | LISTED (web search) |
| LCX listing announcement | LCX's post that XPR was being listed on its exchange | https://wp.lcx.com/xpr-token-is-getting-listed-on-the-lcx-exchange/ | LCX | LISTED (web search; date not read) |

**Tax**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Koinly: XPR Network | Tax-tool integration: import by public account name (API) or CSV. Koinly's own page warns about duplicate transactions. For a full-history export, see XPR Tax (§7) | https://koinly.io/integrations/xpr-network/ | Koinly | LIVE (read 2026-10-19) |

**Wallets**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| WebAuth for iPhone | App Store listing of the official wallet (§1, §2b) | https://apps.apple.com/us/app/webauth-com/id1594500069 | Metallicus | LISTED (linked from xprnetwork.org and the governance docs) |
| WebAuth for Android | Google Play listing of the official wallet | https://play.google.com/store/apps/details?id=com.metallicus.webauth | Metallicus | LISTED (linked from xprnetwork.org, metalx.com and the governance docs) |
| WebAuth short link | Short link that metalx.com and the NFT market use for "Get Wallet" | https://wauth.co | Metallicus | LISTED (linked from metalx.com and nft.xprnetwork.org/learn-more) |
| Metal Pay for iPhone | App Store listing | https://apps.apple.com/us/app/metal-pay-buy-bitcoin-and-eth/id1345101178 | Metallicus | LISTED (linked from metalpay.com) |
| Metal Pay for Android | Google Play listing | https://play.google.com/store/apps/details?id=com.metallicus.metalapp.production | Metallicus | LISTED (linked from metalpay.com and metalx.com) |
| Metal Wallet | Non-custodial wallet for METAL on Metal Blockchain | https://wallet.metalblockchain.org | Metallicus | LIVE (read 2026-10-19; the page is script-only, so its content wasn't readable) |
| Anchor | Desktop and mobile wallet that supports XPR (§2b) | https://anchorwallet.io | Greymass | LISTED (XPR dev skill resources.md) |
| Anchor with XPR (explorer docs) | The explorer docs' guide to signing in with Anchor. The same docs list older wallets (Lynx, MEET.ONE, NOVA, TokenPocket, Scatter, SimplEOS, Math/Leaf) and Ledger and Trezor. Whether each older wallet is still maintained: UNCLEAR (§2b) | https://docs.bloks.io/login/mobile-wallets/anchor | Bloks | LISTED (docs.bloks.io/llms.txt) |

### 15e. Official social accounts and media

Only accounts that an official Metallicus page links to. An account's posts are that company's own words: "Metallicus says…" (RULES §2). Official support never asks for a private key or recovery phrase (RULES §5). XPR Network, Metallicus and Metal X's main accounts are in §11.

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Metal Blockchain | Official channels | X https://x.com/metalblockchain · Telegram https://t.me/metalblockchain · Discord https://discord.gg/B2QDmgf · Reddit https://www.reddit.com/r/MetalBlockchain/ · YouTube https://www.youtube.com/channel/UCbB7oW7WQIpk5KIY5gkHJrA | Metallicus | LISTED (linked from metalblockchain.org) |
| Metal Blockchain brand guidelines | Official brand file on Figma | https://www.figma.com/file/M8B3GjftesAHxWAt2l8rZZ/Metal-Blockchain-Brand-Guidelines?type=design&node-id=0%3A1&mode=design&t=1KPTxx7fwLu6095C-1 | Metallicus | LISTED (linked from metalblockchain.org) |
| Metal Pay | Official channels | X https://twitter.com/metalpaysme · Instagram https://www.instagram.com/metalpaysme/ · Facebook https://www.facebook.com/metalpaysme · Telegram https://t.me/metalpaysme · Reddit https://www.reddit.com/r/MetalPay/ | Metallicus | LISTED (linked from metalpay.com; Instagram, Facebook and Telegram also from metall2.com) |
| Metal Pay on Trustpilot | Review page that Metal Pay links to itself. The reviews are customers' own views | https://www.trustpilot.com/review/metalpay.com | Trustpilot (reviews by users) | LISTED (linked from metalpay.com) |
| Metal Pay brand assets | Official brand file on Figma | https://www.figma.com/file/AFu4BgcbMXcauj14ay0RAm/Metal-Pay-Brand-Assets?type=design&node-id=0%3A1&mode=design&t=msGp5q0vQU76vvAf-1 | Metallicus | LISTED (linked from metalpay.com) |
| Metal X | More official channels | Instagram https://www.instagram.com/MetalXApp/ · Facebook https://www.facebook.com/MetalXApp | Metallicus | LISTED (linked from metalx.com) |
| Metal Dollar (XMD) | Official X account | https://x.com/MetalDollarXMD | Metallicus | LISTED (linked from metaldollar.com) |
| Metal L2 | Official X account | https://twitter.com/Metal_L2 | Metallicus | LISTED (linked from metall2.com) |
| Metallicus Client Services+ | Metallicus's support account on X | https://twitter.com/metalhelpsme | Metallicus | LISTED (linked from XPR help article 4417597596439) |
| XPR Network brand assets | Official brand file on Figma | https://www.figma.com/file/5N1UTmMXbE4Tk9EgDrIwVg/XPR-Network-Brand-Assets?type=design&node-id=0%3A1&mode=design&t=62joLtdtUCNTUBFu-1 | XPR Network | LISTED (linked from xprnetwork.org) |

### 15f. Block producers: API, history and NFT endpoints from bp.json

Each producer publishes a bp.json file that lists its public servers. These are the endpoints read from active producers' bp.json files (and the XPR dev skill's endpoint table) on 2026-10-19 that the guide didn't have yet. "API" means the chain API (RPC), "Hyperion" is the history API, and "AtomicAssets API" serves NFT data. Producers change servers often: test an endpoint before relying on it, and read the live producer list (§10). Endpoints are free public services with limits; heavy automated use gets blocked (RULES §5). The X and Telegram accounts are as each producer listed them in bp.json. Producer accounts are fine to name (RULES §3).

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Alvosec | API | https://proton-api.alvosec.com · X https://x.com/alvosec · Telegram https://t.me/alvosec | `alvosec` | LIVE (bp.json read 2026-10-19) |
| BlocksForge | API; AtomicAssets API | https://api-xpr.blocksforge.com · https://atomic-xprmain.blocksforge.com · X https://x.com/blocksforgeXPR | `blocksforge` | LIVE (bp.json read 2026-10-19) |
| BloxProd | API and Hyperion; AtomicAssets API; snapshots | https://xpr-mainnet-api.bloxprod.io · https://xpr-mainnet-atm-api.bloxprod.io · https://snapshots.bloxprod.io/ · Telegram https://t.me/bloxprodio | `bloxprod` | LIVE (bp.json and dev skill, read 2026-10-19) |
| Cats Vote | API | https://api.cats.vote · X https://x.com/catsvoteXPR · Telegram https://t.me/catsvote | `catsvote` | LIVE (bp.json read 2026-10-19) |
| Cerebro AI | API | https://mainnet.cerebro.host · X https://x.com/Cerebro_Agent · Telegram https://t.me/CerebroAgentBot | `cerebroai` | LIVE (bp.json read 2026-10-19) |
| ChainInfra | API; AtomicAssets API | https://api.chaininfra.net · https://xpr-atomic.chaininfra.net · Telegram https://t.me/chaininfra | `chaininfra` | LIVE (bp.json read 2026-10-19) |
| CindroNET | API | https://mainxpr.cindro.net · X https://x.com/cindronet · Telegram https://t.me/cindronet | `cindronet` | LIVE (bp.json read 2026-10-19) |
| CryptoLions | API | https://proton.cryptolions.io | `cryptolions` | LISTED (XPR dev skill resources.md) |
| DanemarkBP | API | https://api-xpr-main.danemarkbp.com · X https://x.com/danemarkbp | `danemarkbp` | LIVE (bp.json read 2026-10-19) |
| EOS Madrid | API and Hyperion | https://proton-api.eosiomadrid.io | `protonmadrid` | LIVE (dev skill endpoint, read 2026-10-19) |
| HomeBloks | API | https://api.homebloksbp.com · X https://x.com/homebloks · Telegram https://t.me/Homebloks | `homebloksbp` | LIVE (bp.json read 2026-10-19) |
| LedgerWise | API | https://protonapi.ledgerwise.io · X https://x.com/ledgerwise · Telegram https://t.me/ledgerwiseio | `ledgerwiseio` | LIVE (bp.json read 2026-10-19) |
| Luminary Visions | API; API and Hyperion | https://api.luminaryvisn.com/ · https://proton-hyperion.luminaryvisn.com · X https://x.com/luminaryvisn · Telegram https://t.me/luminaryvisn | `luminaryvisn` | LIVE (bp.json and dev skill, read 2026-10-19) |
| MadBlocks | API | https://api.madblocks.tech | `madblocks` | LIVE (bp.json read 2026-10-19) |
| NodeONE | API (on port 8344) | https://api-proton.nodeone.network:8344 · X https://x.com/eosnodeoneio · Telegram https://t.me/nodeoneio | `xprnodeonebp` | LIVE (bp.json read 2026-10-19) |
| Proton NZ | API | https://api.protonnz.com · Telegram https://t.me/protonnz | `protonnz` | LIVE (dev skill endpoint, read 2026-10-19) |
| ProtonIND (Blocks India) | API | https://protonapi.blocksindia.com/ · X https://x.com/protonind | `protonind` | LIVE (bp.json read 2026-10-19) |
| ProtonUK | API and Hyperion | https://proton.protonuk.io · X https://x.com/proton_uk · Telegram https://t.me/protonuk | `protonuk` | LIVE (dev skill endpoint, read 2026-10-19) |
| RockerOne | API | https://api.rockerone.io · X https://x.com/rockeronebp | `rockeronebp` | LIVE (bp.json read 2026-10-19) |
| Saltant | API and Hyperion; AtomicAssets API; snapshots | https://api-xprnetwork-main.saltant.io · https://aa-xprnetwork-main.saltant.io · https://snapshots.saltant.io · X https://x.com/SaltantXPR · Telegram https://t.me/saltant_bp | `saltant` | LIVE (bp.json and dev skill, read 2026-10-19) |
| Snipverse | API | https://api.snipverse.io · X https://x.com/snipverse · Telegram https://t.me/snipversexpr | `snipverse` | LIVE (bp.json read 2026-10-19) |
| Storex | API | https://bp-api.storex.io · X https://x.com/storex_io · Telegram https://t.me/storex_io | `storexbp` | LIVE (bp.json read 2026-10-19) |
| Terrapin Block | API; snapshots | https://api-mainnet.turtlebp.online · https://snapshot.turtlebp.online · X https://x.com/turtle_xpr · Telegram https://t.me/turtle_BP | `turtlebp` | LIVE (bp.json read 2026-10-19) |
| TotalProton | API | https://api.totalproton.tech · X https://x.com/protontotal · Telegram https://t.me/totalproton | `totalproton` | LIVE (bp.json read 2026-10-19) |
| ArtWebin | API | https://mainnet-api.artwebin.com · X https://x.com/artwebin · Telegram https://t.me/artwebin | `artwebin` | LIVE (bp.json read 2026-10-19) |
| xprcore | API | https://api-mainnet.xprcore.com · X https://x.com/xprcore · Telegram https://t.me/xprcore | `xprcore` | LIVE (bp.json read 2026-10-19) |
| xprdata | API | https://mainnet-api.xprdata.org · X https://x.com/xpr_data | `xprdata` | LIVE (bp.json read 2026-10-19) |
| GenerEOS | API | https://mainnet.genereos.io · Telegram https://t.me/generEOS | `genereos` | UNCLEAR (bp.json read 2026-10-19, but it names the producer `aus1genereos`, not `genereos`, so it may describe the producer's EOS servers rather than XPR) |
| EOSArabia | API | https://api.eosarabia.net · X https://x.com/eos_arabia · Telegram https://t.me/EOS_Arabia | `eosarabianet` | UNCLEAR (bp.json read 2026-10-19, but it lists EOS-style nodes, so these may not be XPR servers) |
| Producers with only social accounts in bp.json | Detroit Ledger Tech https://x.com/detledgertech · https://t.me/detroitledgertech · BROTON https://x.com/brotonbp · https://t.me/brotonbpgroup · A-DEX https://x.com/a_dex_official · https://t.me/a_dex_official | (links in the first column) | `eosiodetroit`, `brotonbp`, `bpadex` | LISTED (bp.json read 2026-10-19) |
| Standby and backup producer accounts | Sites set by a CryptoLions standby account and an EOSUSA backup account | https://sbp.proton.cryptolions.io · https://bp.eosusa.news/proton/ | CryptoLions; EOSUSA | LISTED (`eosio::producers`; sites not opened) |
| Retired or inactive producers | Sites these producers set on chain: Aloha EOS https://www.alohaeos.com · EOS Argentina https://eosargentina.io · Blockside https://proton.blockside.io · bountyblok https://www.bountyblok.io · EOS Cannon https://eoscannon.io · CryptoBloks https://bp.cryptobloks.io/proton/ · CSX https://proton.csx.io · Dank Dollars https://dankdollars.co/ · DappRadar https://xpr-nodes.dappradar.com/ · Dmail https://dmail.co · Proton Eastern https://protoneastern.cn/ · Edenia https://edenia.com · EOS Africa https://www.eosafrica.com · EOS Barcelona https://eos.barcelona/proton · EOS Dublin https://eosdublin.com · EOSeoul https://eoseoul.io · EOS Korea https://eoskorea.site · EOSphere https://www.eosphere.io · CryptoTribe https://cryptotribe.io · Galaxoid Labs https://galaxoidlabs.com · Greymass https://greymass.com · NeftyBlocks https://bp.neftyblocks.com · Maltablock https://maltablock.org · Pink Network https://bp.pink.gg · Pixelblok https://www.pixelblok.com · protondc https://dc.protongroup.info · protonlondon https://protongroup.info · Proton France https://www.protonfrance.fr/ · Proton GB https://protongb.com/ · protonglobal https://XPRGlobal.com · protonkiwi https://bp.kiwi/ · Proton LATAM https://protonlatam.com/ · protonmt https://bp.protonmt.com · Proton Russia https://protonrussia.online · Proton Tokyo https://protontokyo.xyz · Quantumblok https://quantumblok.com · SimpleBlock https://simpleblock.org/ · Softatom https://softatom.com · EOS Sweden https://eossweden.org · EOS Venezuela https://eosvenezuela.io · Proton Asia https://protonasia.github.io/ProtonAsia/ · EOS Cafe Block https://eoscafeblock.com · XPR Labs https://xprlabs.org · Proton Europe https://protoneurope.github.io/ProtonEurope/ · europemain https://europemain.github.io/protonwebsite | (links in the first column) | each producer | Producer not active, site not checked (`eosio::producers`, 2026-10-19). Recent stops (§10): `xprlabs` 2026-09, `simpleblock` 2026-08, `guild.nefty` 2026-04, `dappradar` 2025-11 |

### 15g. Press, research and exploit coverage

Word each of these as its source: "<Outlet> reported on <date> that…" (RULES §2). Press ranks below the chain and official pages; when an article and an official page disagree, give both and lead with the newer one.

**The September 2026 `proton.swaps` exploit.** The primary source is Proton NZ's post-mortem (§1, Metal X Swap row). The press reports below don't agree on the date, and their figures don't match the post-mortem (SOURCES.md has an AMBCrypto article from 2026-09-13 too). Give each figure with its own source. This is separate from the October 2026 outage on the status pages (§7).

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Yellow.com: "XPR Network bled $9M" | Reports more than $9M drained from `proton.swaps` through a withdraw with a negative value, and says block producers seized about 1.80B XPR. Its page dates the exploit 2026-09-14 | https://yellow.com/news/xpr-network-bled-9m-minus-signs | Yellow.com (press) | LIVE (read 2026-10-19) |
| KuCoin News flash: "XPR Network loses $9M" | Same exploit, dated 2026-09-12; says it was patched at 21:32 UTC and XPR fell about 6.5%. **It disagrees with Yellow.com on the date** (Sept 12 vs Sept 14) | https://www.kucoin.com/news/flash/xpr-network-loses-9m-in-proton-swaps-exploit-price-drops-6-5 | KuCoin News (press) | LIVE (read 2026-10-19) |

**Security documents and official announcements**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Metal L2 audit (PDF) | Audit report for Metal L2, linked from its site's footer. The auditor's name and date were not read here: open the PDF before citing either | https://migrate.metall2.com/Metal_L2_Audit.pdf | Metallicus (it hosts the file) | LISTED (linked from metall2.com) |
| Metallicus: SOC 2 Type I | Metallicus's post on completing a SOC 2 Type I assessment (§1a dates it 2026-08-18) | https://metallicus.com/blog/metallicus-completes-soc-2-type-i-assessment | Metallicus | LISTED (linked from metallicus.com) |
| Metallicus: 2026 Q2 report | The CEO's quarterly report for Q2 2026 (the Q3 report is in §1a) | https://metallicus.com/blog/metallicus---2026-q2-report | Metallicus | LISTED (linked from metallicus.com) |
| Metallicus: InvestiFi stablecoin alliance | Post on a stablecoin alliance with InvestiFi | https://metallicus.com/blog/metallicus-investifi-stablecoin-alliance | Metallicus | LISTED (web search) |
| XPR Network: "Introducing XPR Agents" | The official post introducing XPR Agents (§4) | https://xprnetwork.org/blog/introducing-xpr-agents | XPR Network | LISTED (linked from xprnetwork.org) |
| XPR Network: DappRadar joins as a block producer | Official post. DappRadar's producer has since stopped producing (last claim 2025-11-26, §10) | https://xprnetwork.org/blog/dappradar-joins-xpr-network-as-a-block-producer | XPR Network | LISTED (linked from xprnetwork.org/news) |

**Press that features Metallicus (linked from metalblockchain.org's "Featured In")**

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| Forbes, 2024-05-06 | "How BankSocial and Metallicus are banking on blockchain in 2024" | https://www.forbes.com/sites/jasonbrett/2024/05/06/how-banksocial-and-metallicus-are-banking-on-blockchain-in-2024/ | Forbes | LISTED (linked from metalblockchain.org) |
| Nasdaq | "Behind the scenes of blockchain and crypto", featuring Metallicus | https://www.nasdaq.com/articles/behind-the-scenes-of-blockchain-and-crypto | Nasdaq | LISTED (linked from metalblockchain.org) |
| Fortune, 2022-10-12 | "Safe and secure crypto is closer than we think" | https://fortune.com/crypto/2022/10/12/safe-and-secure-crypto-is-closer-than-we-think/ | Fortune | LISTED (linked from metalblockchain.org) |
| Inc. | "How blockchain fintechs are navigating regulation" | https://www.inc.com/sean-kim/how-blockchain-fintechs-are-navigating-regulation.html | Inc. | LISTED (linked from metalblockchain.org) |

**Other news, explainers and research** (leads; check against an official page before citing)

| Name | What it is | Link | Run by | Status |
|---|---|---|---|---|
| BingX News: Metallicus FedNow certification | News post on Metallicus's FedNow certification (§1a has the official date, 2026-02-27) | https://bingx.com/en/news/post/just-in-xpr-network-is-connected-to-the-fednow-era-through-metallicus-metallicus-is-now-fednow-certified-for-send-receive-liquidity-management-request-for-payment-rfp-and-that-infrastructure-sits-alongside-the-metallicus-blockchain-ecosystem-including-xpr-network-webauth-wallet-digital-identity-stablecoins-defi-and-institutional-digitalasset-infrastructure | BingX News | LISTED (web search) |
| KuCoin News: Metallicus weekly recap, 2–8 March 2026 | A community-written weekly recap that KuCoin republishes: a lead, never a source (SOURCES.md) | https://www.kucoin.com/news/trends/BTC/69adf126ecaf060007724949 | KuCoin News (republished) | LISTED (web search) |
| Messari: XPR Network | Research firm's project page | https://messari.io/project/proton | Messari | LISTED (web search; the page did not load for the sweep) |
| IQ.wiki: Metal Pay | Wiki entry | https://iq.wiki/wiki/metal-pay | IQ.wiki (crowd-edited) | LISTED (web search) |
| IQ.wiki: Marshall Hayner | Wiki entry on Metallicus's CEO | https://iq.wiki/wiki/marshall-hayner | IQ.wiki (crowd-edited) | LISTED (web search) |
| Gate Learn: what is XPR Network | Exchange-written explainer | https://www.gate.com/learn/articles/what-is-xpr-network-xpr/3527 | Gate | LISTED (web search) |
| MEXC News: the Metallicus ecosystem | Exchange-written explainer (XPR Network, Metal Blockchain, WebAuth and more) | https://www.mexc.com/news/metallicus-ecosystem-explained-xpr-network-metal-blockchain-webauth-wallet-more/67791 | MEXC | LISTED (web search) |
| Easy Crypto: XPR explainer | Exchange-written explainer | https://hub.easycrypto.com/proton-xpr | Easy Crypto | LISTED (web search) |
| XPR Community DAO: making NFTs on Proton | Older community how-to from the Proton era; steps may be out of date | https://xprcommunitydao.medium.com/how-to-create-and-sell-nfts-on-proton-blockchain-x-fd8b3eb84f76 | XPR Community DAO | QUIET? (older post) |
| "Metallicus Live" podcast | Podcast feed | https://metallicus.buzzsprout.com/2080317/episodes | Metallicus Live | QUIET? (the page loaded on 2026-10-19 but showed no episodes) |
| Proton blog: "Meet WebAuth" | Legacy Proton-era post introducing WebAuth, still linked from the governance docs | blog.protonchain[.]com/meet-webauth (legacy host, no link) | Proton (legacy) | QUIET? (old host, probably no longer served; not opened) |

### 15h. Token registry projects (token.proton, read in full 2026-10-19)

- Read all 2,775 rows of `token.proton::tokens` (ids 1000001–1003006, live chain, read 2026-10-19); 2,448 have a website/url field filled in, 39 are flagged blacklisted (`blisted=1`), and about 1,641 look like spam/test or joke entries (896 spam/test, 584 of them one auto-generated "Token AAAAAxx" series on `vweb`; 745 joke/impersonation entries pointing at governments, central banks, retailers, other chains or troll pages). 359 more are SimpleDEX launches whose url is just their dex.protonnz.com or simpledex.fun token page (hosts already listed).
- Read note: 6 rows (ids 1001116, 1001527, 1001529, 1001536, 1001537, 1001596) could not be decoded on any node that answered (the chain API returns "Invalid symbol"), so their contents are unknown; any page that includes one fails, and some public nodes return an empty or cut-short page instead of an error, so page with small limits around those ids.

New project websites not in CURRENT-HOSTS and not already in D-onchain (registry text only, sites not opened):

| Token (symbol@contract) | Name | Website | Status |
|---|---|---|---|
| ZFT@3z.xpr | 3ZNFT Token | 3znft.com | LISTED (registry, not opened) |
| AIRK@tokencreate, DPUS@tokencreate | AI Robot Kitty | https://airobotkitty.com | LISTED (registry, not opened) |
| AIVERSE@aiverse | AIVerse | aiverse.io | LISTED (registry, not opened) |
| APEX@tokencreate | APEX | https://www.apexmeme.com | LISTED (registry, not opened) |
| ATOM@tokencreate | ATOM3 | https://www.atom3studio.com/ | LISTED (registry, not opened) |
| ARP@tokencreate, ART@tokencreate | Aurora Rewards | https://aurora4d.com | LISTED (registry, not opened) |
| AUT@autpolo | Aut | https://autpolo.com/ | LISTED (registry, not opened) |
| BCDT@tokencreate | Baby Cadet | https://www.babycadet.com | LISTED (registry, not opened) |
| BBC@tokencreate | Bad Breath Coin | https://bad-breath-coin.com | LISTED (registry, not opened) |
| BAYRA@bayrameta | BAYRA | Bayra.io | LISTED (registry, not opened) |
| BEAR@tokencreate | BEAR XPRoton | https://bearxpr.tilda.ws | LISTED (registry, not opened) |
| BETHER@bether.gm | Betherance | https://betherance.com/ | LISTED (registry, not opened) |
| WBTC@wrapper | wbtc | https://betterwrapper.com | LISTED (registry, not opened) |
| CFT@chainfeed (x2), CFTA@chainfeed | Chainfeed | https://chainfeed.space/ | LISTED (registry, not opened) |
| CHUR@taruntoken | Chur Coin | www.churcoin.com | LISTED (registry, not opened) |
| RC@coinroyale25 | Coin Royale | https://coinroyale.online | LISTED (registry, not opened) |
| MYCC@tokencreate, CONSENT@tokencreate | Consent Coin | https://consentcoin.io | LISTED (registry, not opened) |
| CROS@tokencreate | CROSSET-UP | https://crosset-up.org | LISTED (registry, not opened) |
| XOHM@tokencreate | ophanim | https://cursejourney.com | LISTED (registry, not opened) |
| CAS@tokencreate | Cyber Ad Space | https://CyberAdSpace.com | LISTED (registry, not opened) |
| DKT@tokencreate | DaiKhoToken | https://daikhotoken.io | LISTED (registry, not opened) |
| DEN@tokencreate | Decarbon | www.decarbonthepast.com | LISTED (registry, not opened) |
| DEED@tokencreate | DeedAlert Token | https://www.deedalert.net | LISTED (registry, not opened) |
| CANDLE@tokencreate, WICK@tokencreate, CMAKER@tokencreate | Degen Development Studios Candle Shop | https://degendevelopmentstudios.com | LISTED (registry, not opened) |
| DGG@softclarinet | DigiGold | https://digigoldcoin.rootsociety.nl/ | LISTED (registry, not opened) |
| MAKURA@dogemakura | Dogemakura | Dogemakura.com | LISTED (registry, not opened) |
| GPTN@tokencreate | GreenProton | https://ecologiexp.com | LISTED (registry, not opened) |
| VEC@envisionevc | V E C | https://envisioncharging.com/home | LISTED (registry, not opened) |
| FC@vtoken, F@vtoken | Father Crypto | https://fathercrypto.online | LISTED (registry, not opened) |
| FIK@tokencreate | FIKCOIN | https://fikcoin.blogspot.com | LISTED (registry, not opened) |
| FXC@tokencreate | FlexCoin | https://www.flex-coin.com | LISTED (registry, not opened) |
| GBX@tokencreate | Gift Box | www.gift-box.io | LISTED (registry, not opened) |
| GFC@tokencreate, SHREK@tokencreate | GiftCards | http://giftcards.xo.je | LISTED (registry, not opened) |
| GUMDROP@tokencreate | Gumdrop | http://www.gumdrop.net | LISTED (registry, not opened) |
| XHTTPS@vtoken | $HTTPS | https.meme | LISTED (registry, not opened) |
| IXT@tokencreate | Interesting X | https://inis-world.vercel.app | LISTED (registry, not opened) |
| KST@tokencreate | Keep snipping | https://keesnipping.io | LISTED (registry, not opened) |
| SHK@tokencreate | Shamecoin | https://looknloot.com | LISTED (registry, not opened) |
| LUCE@luce.xpr | LUCE | www.lucestore.io | LISTED (registry, not opened) |
| LUCK@thomashp | Luck | www.luckcoin.info | LISTED (registry, not opened) |
| MLD@tokencreate | MemeLord | https://memelord.gamer.gd | LISTED (registry, not opened) |
| SEA@metalseaxpr, XEA@metalseaxpr, MLS@xeonloyalty | Metalsea (fisheries) | https://metalseaxpr.com | LISTED (registry, not opened) |
| MINK@agac2 | MINK | https://minkcoin.io | LISTED (registry, not opened) |
| LMDC@tokencreate | Moneda Libre | https://MonedaLibre.co | LISTED (registry, not opened) |
| MBRO@motoburro | Motoburro Coin | https://motoburro.com | LISTED (registry, not opened) |
| TGUARD@tokencreate | TitleGuard Token | https://nftitlenetwork.com | LISTED (registry, not opened) |
| NIMBUS@tokencreate | Nimbus Protocol | https://nimbusprotocol.wordpress.com/home | LISTED (registry, not opened) |
| NLMT@tokencreate | No Limits | https://nlmt.app/ | LISTED (registry, not opened) |
| SEED@tokencreate | ONE SEED | https://www.oneseedimpact.com | LISTED (registry, not opened) |
| PEPZ@tokencreate | PepeFree | https://www.pepefree.com | LISTED (registry, not opened) |
| PHXP@tokencreate | Phoenix Prize | https://Phoenixprize.com | LISTED (registry, not opened) |
| ETF@tokencreate | MANOR | https://www.piedmontmanor.com | LISTED (registry, not opened) |
| GIRCHI@girchitoken | GIRCHI | https://pirates.girchi.org | LISTED (registry, not opened) |
| POG@tokencreate | Proton Dog | https://pog.io | LISTED (registry, not opened) |
| PTP@poloptp | poloptp | https://polotecnologicopehuajo.my.canva.site/about | LISTED (registry, not opened) |
| PRKL@tokencreate | Prickle Seeds | https://pricklevalleyfarmstead.blogspot.com | LISTED (registry, not opened) |
| PROTONA@protonai | ProtonAI | protonai.io | LISTED (registry, not opened) |
| PBC@almonds | PBC Token | http://www.protonbee.club/ | LISTED (registry, not opened) |
| CROWN@tokencreate | proton crown | https://protoncrowncoin.blogspot.com | LISTED (registry, not opened) |
| ALPHA@royalcoin | Alpha Coin | https://www.protonmarket.com/ | LISTED (registry, not opened) |
| XPURP@tokencreate, PURPL@tokencreate | Purple Stuff | https://purplepantherphoenixunicorn.com | LISTED (registry, not opened) |
| SEARCH@realestatese | SEARCH | realestatesearch.io | LISTED (registry, not opened) |
| SATS@tokencreate | Saturnalia | https://Saturnalia98.com | LISTED (registry, not opened) |
| SDX@sayarideluxe | SAYIRIDELUXE | https://sayarideluxe.com | LISTED (registry, not opened) |
| SBFC@tokencreate | ScHiZ0 B3rRy Fc | https://schizoberryfanclub.com | LISTED (registry, not opened) |
| SEOM@seomtoken | SEO Maximus | https://seomaximus.ai/token | LISTED (registry, not opened) |
| SHAI@tokencreate | SHAIstrategy | https://shaistrategy.com | LISTED (registry, not opened) |
| SHWOOP@andrewb | Shwoop Coin | https://www.shwoop.co.nz/ | LISTED (registry, not opened) |
| TITLET@tokencreate, SMART@tokencreate | Title Token | https://smartescrow.us | LISTED (registry, not opened) |
| SPLIFF@coinabis | SPLIFF Token | spliffnft.io | LISTED (registry, not opened) |
| SUP@tokencreate | Supameta | https://supezee.com | LISTED (registry, not opened) |
| INIS@inch13 | Inis World | https://tester-lime.vercel.app | LISTED (registry, not opened) |
| CPHR@tokencreate | Cipher Vault | https://theciphervault.carrd.co | LISTED (registry, not opened) |
| TOP@tokencreate | TopAimultiverse | https://TopAimultiverse.org | LISTED (registry, not opened) |
| USDP@worthless | USD Proton | https://usdp.godaddysites.com | LISTED (registry, not opened) |
| USDX@stablexpr | USDX Coin | https://usdx2.godaddysites.com | LISTED (registry, not opened) |
| VAL@valoreum | Valoreum | https://valoreum.notion.site/ (Notion page) | LISTED (registry, not opened) |
| VLUX@vluxpayment | V*Lux | www.VLUXCleaningServicesINC.com | LISTED (registry, not opened) |
| VOTA@votar | votar | https://votavotar.000webhostapp.com/ | LISTED (registry, not opened) |
| VTOKEN@vtokens | Virtual Token | https://vtokens.github.io/ | LISTED (registry, not opened) |
| WAGMI@tokencreate | WAGMI Coin | https://wagmicoin.store | LISTED (registry, not opened) |
| BOKCHOY@tokencreate, CHOYSUM@tokencreate | BOKCHOY | https://wenbokchoychoysum.com | LISTED (registry, not opened) |
| XAGSURF@taruntoken, XAUSURF@tokencreate | XAgSurfer | https://xagsurfer.com | LISTED (registry, not opened) |
| XCG@xweb | Xchange | https://xcgtech.com | LISTED (registry, not opened) |
| XID@tokencreate | XIDCOIN | https://xidcoin.blogspot.com | LISTED (registry, not opened) |
| EVER@tokencreate | Everburn | https://xmagnetic.org/farming/EverBurn | LISTED (registry, not opened) |
| XPL@xplutons, XPU@tokencreate | XPL Token | https://xpluto.xyz | LISTED (registry, not opened) |
| BRETTX@tokencreate | BRETT (XPR) | https://www.xprbrett.com/ | LISTED (registry, not opened) |
| ENERGY@xenergy | ENERGY | https://xprenergy.com | LISTED (registry, not opened) |
| XPRXO@tokencreate | XPR Escrow | https://XPRescrow.com | LISTED (registry, not opened) |
| SIGMA@tokencreate | Sigma | https://xprsigma.org | LISTED (registry, not opened) |
| SOLAR@solarx | SOLAR | https://xprsolar.com | LISTED (registry, not opened) |
| XRPX@tokencreate | XRP 2.0 | https://www.xrpboom.com | LISTED (registry, not opened) |
| XVLR@xvalorian (x2) | xVALORIAN | https://xvalorian.ic.bike | LISTED (registry, not opened) |
| YACHT@tokencreate | Yacht | https://yachtstorm.com/ | LISTED (registry, not opened) |
| YCATU@ytokens | Yodacoin | https://yodacoin.ink/ | LISTED (registry, not opened) |

Also listed but left out of the table as placeholder-style or unverified-looking (55 hosts, mostly one BlastPad creator series of "...xprnetwork..."-named domains; not opened, not linked): MUSCLE, AMERICA, AURA, BOOSTED, RIDE, ONE, HYDRATE, FARE, BEAUTY, WWCU, DIEZER, FOODPAY, WAGON, GYM, EMS, BILLS, HOME, JFT, LEARN, LUST, BRRR, ELDERLY, PAY, PAYUP, SPORTS, CHEF, DOLLAR, BAMBOO, BAT, TRUCK, HELI, RACE, STORM, RICH, XROYCE, RTHCP, SBEL, PCHD, STIMM, SHOP, SHOWER, SIDE, WEALTH, TCB, LSC, UNVAXXD, WAGE, WENMOON, XCASH, XDR, SWOOSH, MEMORY, TRASH, ZION (all @tokencreate); PRDOGE@vtoken; RFC@rangers, RFC@rangersfc.

Blacklisted in the registry: 39 — PVERSE@pverseme.gm, PDOGE@protondoge, XXRP@knightbank, XBCB@bep2, PSAFE@cryptosafe, WIZ@royalcoin, DOGEMTX@btoken, BFC@bfrost, APE@apecointoken, KIBA@kibainu, PIKA@bfrost, KINDER@kinderinu, LUNA@lunatoken, CHIPS@protontokens, BTCI@lastroman, BAYRA@bayramela, BITS@protontokens, SHIB@kibainu, LUNC@lunatoken, STEPN@pverseme.gm, IOTA@protonmeta, DOGEGF@albabank, ALBA@albabank, FREEBTC@protontokens, AGIX@agix, SOL@eosiotokens, AVAX@eosioavax, PORN@xxxtokens, XSHIB@eosiotokens, XLUNC@eosiotokens, VRA@eosiotokens, DICK@metafuture, SDICK@metafuture, BTC@eosiotokens, ETH@eosiotokens, DOGE@eosiotokens, BNB@eosiotokens, CFX@eosiotokens, XPRDROP@xprdrops.
