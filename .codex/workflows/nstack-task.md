---
command: nstack-task
description: Codex-oriented NStack task workflow for Moras.
---

# NStack Task Workflow for Codex

Use this workflow for meaningful Moras work that should validate NStack.

## Steps

1. Read `AGENTS.md` and the relevant planning docs.
2. Run Socratic alignment before drafting a work order.
3. For each important uncertainty, record `AI Recommendation`, `User Answer`, and `Decision`.
4. Create or update a work order under `tasks/orders/YYYY-MM/DD/` only after the Socratic Gate is resolved or the user explicitly accepts the risk.
5. Include the Socratic dialogue summary in the work order.
6. Implement the smallest durable change that satisfies the approved scope.
7. Verify with the relevant local checks.
8. Write a completion report under `tasks/reports/YYYY-MM/DD/` only after implementation and verification.
9. Mark `LLMWiki: temporarily disabled` in the completion report.
10. Note any NStack process issue discovered while doing the work.

## Socratic Entry Format

```md
### Q{n}. {question}
AI Recommendation: {recommended answer and reason}
User Answer: {answer}
Decision: {decision used by the work order}
```

## Issue Timing

Do not create detailed GitHub implementation issues during the Socratic Gate.
Create or update issues after the work order defines the executable scope.
An epic issue may be created earlier only when the user explicitly approves it.

## Codex Difference

Codex can implement directly in the current workspace. This workflow should not assume a separate Antigravity execution agent.
