---
name: nstack-codex-task
description: >
  Codex-specific NStack task workflow for Moras. Use when implementing meaningful
  Moras product work or NStack pilot work that needs a work order, verification,
  completion report, and NStack pilot feedback. Do not use for tiny one-off answers.
---

# NStack Codex Task

This skill adapts NStack's instruction-centric task flow to Codex.

## Use When

- The user asks to implement a Moras feature.
- The work affects product architecture, database design, deployment, or NStack validation.
- The work should leave traceable task artifacts.

## Workflow

1. Read `AGENTS.md` and relevant docs before planning.
2. Run the Socratic Gate before writing a work order.
3. For each blocking uncertainty, provide `AI Recommendation`, capture `User Answer`, and write the resulting `Decision`.
4. Create a work order in `tasks/orders/YYYY-MM/DD/` only after the Socratic Gate is resolved or the user explicitly approves the remaining risk.
5. Include the Socratic dialogue summary in the work order.
6. Implement directly in the current workspace.
7. Run relevant verification.
8. Create a completion report in `tasks/reports/YYYY-MM/DD/`.
9. Mark `LLMWiki: temporarily disabled` in the completion report.
10. Report what changed, what was verified, and any NStack process feedback.

## Work Order Requirements

Each work order must include:

- `Socratic Dialogue`: questions, AI recommendations, user answers, and decisions.
- `Scope`: the smallest approved task.
- `Out of Scope`: what must not be implemented in this task.
- `Verification`: concrete checks to run.
- `LLMWiki`: `temporarily disabled`.

## Guardrails

- Do not assume Antigravity is the executor.
- Do not use multi-agent harness unless the user explicitly asks for sub-agents or parallel agent work.
- Do not use LLMWiki/SwarmVault until the user explicitly reconnects it.
- Keep changes scoped to the approved/requested task.
- Do not create a completion report before implementation and verification are actually complete.
