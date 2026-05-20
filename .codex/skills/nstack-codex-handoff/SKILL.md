---
name: nstack-codex-handoff
description: >
  Codex-specific next-session and handoff workflow for Moras. Use when ending a
  session, preparing continuation notes, handing work to another agent/tool, or
  creating a restart prompt for future Codex sessions.
---

# NStack Codex Handoff

## Workflow

1. Check current git status and recent commits.
2. List active work orders, reports, and unresolved tasks.
3. Identify the single best next action.
4. Write a concise handoff under `tasks/next-session/next-session.md` when requested.
5. Include enough file paths and decisions for the next session to restart quickly.

## Codex Rule

Do not assume Claude + Antigravity as the default execution model. For Moras Codex work, describe the next step in Codex terms unless another tool is explicitly involved.
