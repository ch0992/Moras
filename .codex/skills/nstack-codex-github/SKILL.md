---
name: nstack-codex-github
description: >
  Codex-specific GitHub issue and repository workflow for Moras. Use when creating
  or updating GitHub issues, adding progress/completion comments, checking repo
  access, preparing PR metadata, or connecting NStack task artifacts to GitHub.
---

# NStack Codex GitHub

This skill adapts NStack's GitHub issue lifecycle to Codex.

## Workflow

1. Identify the repository and issue/PR target.
2. Read relevant task docs before creating or updating GitHub records.
3. Draft issue/comment/PR text and get approval when creating public GitHub state.
4. Use `gh` or the GitHub connector when available.
5. Record created issue/PR URLs back into task artifacts when relevant.

## Moras Rules

- Moras repo is private and personal-access only unless the user changes policy.
- Do not paste secrets or participant personal data into GitHub issues.
- Prefer Korean issue bodies unless the user asks otherwise.
