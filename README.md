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

**Recommended: GUARD.IAN's own server (live since 2026-10-15).** It reads this guide live (no cache delay) and adds read-only live chain tools: account facts, token balances, contract tables, the block-producer list, and **"is this the real token?"**. Code: [`server/`](server/).

```
https://guard-ian-guide.rangelt88.workers.dev/mcp
```

The GitMCP URL above also works (docs only, cached).

- **Claude** (claude.ai): Customize → Connectors → Add custom connector → paste the URL.
- **Grok** (grok.com): **Plugins** (bottom left of the sidebar) → Connectors → New Connector → Custom → name + paste the URL → Add Connector. Tested 2026-10-15.
- **ChatGPT** (web): open **chatgpt.com/plugins** → **Add** (top right) → **Add custom MCP server** → name, paste the URL, Authentication **No authentication** → tick "I understand and want to continue" → **Create as a plugin** → **Connect**. Tested on a Pro account 2026-10-15; then just ask in a new chat. OpenAI's [custom MCP server guide](https://developers.openai.com/api/docs/guides/custom-mcp-server.md) gives the same path. Which plans have it: older help said Pro, Business, Enterprise or Edu ([OpenAI help](https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt), read 2026-10-15). The new page doesn't say, so other plans are unverified.
- **Cursor / VS Code / other MCP apps:** add the URL as a remote MCP server. GitMCP's README has a block for each app.

Then ask, for example: *"Using the GUARD.IAN XPR Guide, how does a SimpleDEX launch graduate?"*

## What's inside
- `llms.txt`: the index the connector reads first. It links to the official docs.
- `RULES.md`: how every answer must be built.
- `SOURCES.md`: the tiered source catalog (official, community, press, data, regulators, credit unions).
- `KSTO.md`: the KSTO community, in our own words, linked to ksto.world.
- `ECOSYSTEM.md`: the ecosystem directory. Metallicus products, DeFi, social platforms, agents, games, NFTs, tools, tokens (symbol + contract), live token feeds, governance, communities and GitHub.
- `CHANGELOG.md`: every change, dated.

## Credits
- **Created, directed and operated by @Scubasteve4488**, GUARD.IAN's creator and operator and a KSTO community member. He came up with the idea, set the rules (sources only, no guessing, records worded exactly), and decides what goes in. Routine source updates are made by a daily automated job under those rules, and every change is logged in CHANGELOG.md.
- **Built with Claude Code** (Anthropic's AI coding assistant). Commits say so with a "Co-Authored-By: Claude" line.
- **GUARD.IAN** is the AI agent whose knowledge and rules this guide carries. Next step: GUARD.IAN takes over daily maintenance itself, with its own signed commits.
- **Built on:** XPR Network's developer skill and docs, Metallicus's published sources, Proton NZ's SimpleDEX docs and indexers, [GitMCP](https://github.com/idosal/git-mcp), and Cloudflare's [remote MCP template](https://github.com/cloudflare/ai/tree/main/demos/remote-mcp-authless).

## Disclosure
@Scubasteve4488 holds XPR and the GUARD token. **Not affiliated with, or endorsed by, Metallicus or XPR Network.** Nothing here is financial advice. Found something wrong? Open an issue with the source, and it gets fixed and dated.
