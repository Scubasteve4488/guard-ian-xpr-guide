# GUARD.IAN XPR Guide 🛡️

**Ask your own AI about XPR Network, Metallicus, WebAuth, SimpleDEX, XPR Agents and KSTO, and get answers that come with sources.**

AI apps don't know the XPR / Metallicus ecosystem deeply, and they guess. This guide gives your AI an index of the official sources, so it can look facts up instead of making them up. It also gives the rules for answering: sources, dates, and "I haven't verified that" when nothing covers it.

- **Free.** No sign-up.
- **Read-only.** No wallet, no keys, it signs nothing.
- **No AI model inside.** Your own Claude, ChatGPT or Grok writes the answer.

## Connect it

Connector URL:

```
https://gitmcp.io/Scubasteve4488/guard-ian-xpr-guide
```

Served by [GitMCP](https://github.com/idosal/git-mcp), a free, open-source service that turns a GitHub repo into a connector.

**Coming next: GUARD.IAN's own server** (code in [`server/`](server/), being deployed). It reads this guide live, so there's no cache delay, and adds read-only live chain tools: account facts, token balances, contract tables, the block-producer list, and **"is this the real token?"** (symbol + contract checked against XPR's developer registry, the chain, Metal X, Alcor and SimpleDEX). Once it's live, its URL will be listed here.

- **Claude** (claude.ai): Customize → Connectors → Add custom connector → paste the URL.
- **Grok** (grok.com): Connectors → New Connector → Custom → paste the URL.
- **ChatGPT:** custom connectors depend on your plan and settings. Check OpenAI's help pages for the current steps.
- **Cursor / VS Code / other MCP apps:** add the URL as a remote MCP server. GitMCP's README has a block for each app.

Then ask, for example: *"Using the GUARD.IAN XPR Guide, how does a SimpleDEX launch graduate?"*

## What's inside
- `llms.txt`: the index the connector reads first. It links to the official docs.
- `RULES.md`: how every answer must be built.
- `SOURCES.md`: the tiered source catalog (official, community, press, data, regulators, credit unions).
- `KSTO.md`: the KSTO community, in our own words, linked to ksto.world.
- `ECOSYSTEM.md`: the ecosystem directory. Metallicus products, DeFi, social platforms, agents, games, NFTs, tools, tokens (symbol + contract), live token feeds, governance, communities and GitHub.
- `CHANGELOG.md`: every change, dated.

## Disclosure
Built by @Scubasteve4488, a KSTO community member who holds XPR. **Not affiliated with, or endorsed by, Metallicus or XPR Network.** Nothing here is financial advice. Found something wrong? Open an issue with the source, and it gets fixed and dated.
