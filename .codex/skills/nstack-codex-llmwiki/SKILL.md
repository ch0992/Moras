---
name: nstack-codex-llmwiki
description: >
  Disabled placeholder for Moras LLMWiki integration. Do not use during the
  first NStack cycle test unless the user explicitly asks to reconnect or run
  LLMWiki/SwarmVault documentation.
---

# NStack Codex LLMWiki

Status: temporarily disabled.

Do not use this skill during the first Moras NStack cycle test. The active cycle should record `LLMWiki: temporarily disabled` in the completion report instead.

This skill adapts NStack's LLMWiki assetization flow to Codex and Moras.

## Inputs

- Work order: `tasks/orders/YYYY-MM/DD/{slug}.md`
- Completion report: `tasks/reports/YYYY-MM/DD/{slug}.md`
- Knowledge document: `llmwiki/content/01-Logs/tasks/YYYY-MM-DD-{slug}.md`

## Workflow

0. Confirm that the user explicitly re-enabled LLMWiki/SwarmVault integration.
1. Read the relevant work order and completion report.
2. Extract only reusable decisions, patterns, verification notes, and process findings.
3. Remove secrets, participant data, birth data, contact data, and private operations.
4. Write or update local LLMWiki content under `llmwiki/content/`.
5. Run SwarmVault steps sequentially when available: `ingest`, `compile`, `doctor`, `query`.
6. Mark whether the content is safe for unified upstream.
7. If skipping documentation, record the explicit skip reason.

## Unified LLMWiki Rule

The unified upstream repository is `NSoft-America-Inc/NSoft-LLMWiki`. Moras private project details stay in Moras unless sanitized.
