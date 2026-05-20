---
command: swarmvault
description: Disabled placeholder. Do not use until Moras LLMWiki/SwarmVault integration is reconnected.
---

# SwarmVault Workflow for Codex

Status: temporarily disabled.

Do not run this workflow during the first Moras NStack cycle test unless the user explicitly asks to reconnect LLMWiki/SwarmVault.

Use this workflow only after LLMWiki/SwarmVault integration is re-enabled.

## Steps

1. Confirm the user explicitly re-enabled LLMWiki/SwarmVault integration.
2. If `llmwiki/wiki/graph/report.md` exists, read it before broad searches.
3. For task history or decisions, query from `llmwiki/`.
4. For new task knowledge, ingest only the relevant task files rather than all `content/`.
5. Run SwarmVault operations sequentially: `ingest`, `compile`, `doctor`, `query`.
6. Save high-value results as task documentation or LLMWiki content when useful.
