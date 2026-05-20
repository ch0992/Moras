---
alwaysApply: true
description: NStack rules for Codex in the Moras pilot project.
---

# NStack Rules for Codex

This file is the Codex-specific rule source for Moras.

## Core Rules

- Treat Moras as both a product project and an NStack validation pilot.
- Keep major work traceable through `tasks/orders/`, `tasks/reports/`, and `docs/`.
- Use `AGENTS.md` as the runtime project instruction entry point.
- Use `.codex/skills/` as the Codex-specific skill source of truth.
- Use `.codex/workflows/` for Codex-specific NStack workflow definitions.
- Do not copy `/Users/yg/workspace/NStack/.antigravity/rules` into this project. That file is abnormal in size and is Antigravity-specific.
- LLMWiki and SwarmVault integration is temporarily disabled for the first NStack cycle test.
- Do not use LLMWiki/SwarmVault workflows unless the user explicitly reconnects them.

## NStack Gate

For major tasks, preserve the NStack evidence chain:

1. Socratic dialogue
2. AI recommendation
3. User answer
4. Decision
5. Work order
6. Implementation result
7. Verification result
8. Completion report
9. `LLMWiki: temporarily disabled`
10. NStack pilot feedback

The Socratic dialogue is user-visible. Do not treat it as private reasoning.
For each blocking uncertainty, present an AI recommendation, capture the user's
answer, and record the decision before writing the work order.

Do not create detailed GitHub implementation issues until the approved work
order exists. Epic issues may be created earlier only with explicit user
approval.

For small direct user requests, keep the change scoped and record only what is useful.
