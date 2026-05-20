---
name: nstack-codex-workflow
description: >
  Codex-specific Git workflow for Moras. Use when creating branches, committing,
  pushing, merging, rolling back, or deciding how NStack branch conventions should
  work inside Codex.
---

# NStack Codex Workflow

## Workflow

1. Check `git status` before branch or commit actions.
2. Keep unrelated user changes intact.
3. Use Codex branch prefix `codex/` unless the user requests another convention.
4. Use clear commit messages with NStack task or issue reference when available.
5. Before push or merge, run relevant verification and summarize the diff.

## Guardrails

- Do not use destructive Git commands unless explicitly requested.
- Do not force push without explicit user approval.
- Do not revert unrelated changes.
