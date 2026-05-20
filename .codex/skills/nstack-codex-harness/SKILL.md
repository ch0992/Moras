---
name: nstack-codex-harness
description: >
  Codex-specific harness planning workflow for Moras. Use only when the user
  explicitly asks for sub-agents, parallel agents, harness execution, or agent
  work splitting.
---

# NStack Codex Harness

## Use Only When

The user explicitly asks for sub-agents, parallel agent work, harness, or agent splitting.

## Evaluation

- Can write scopes be physically separated?
- Are there shared files that would cause conflicts?
- Does one task depend on another task's output?
- Is the split worth the coordination cost?
