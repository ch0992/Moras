---
name: nstack-codex-scope
description: >
  Codex-specific scope validation workflow for Moras. Use when a new feature,
  product idea, architecture change, or NStack process change needs narrowing
  before implementation.
---

# NStack Codex Scope

This skill is a Socratic Gate. Do not turn a product idea or technical concern
into a work order until the Socratic answers are explicit enough to define the
smallest useful task.

## Required Output Shape

For each important uncertainty, write the dialogue in this form:

```md
### Q{n}. {question}
AI Recommendation: {the recommended choice and why}
User Answer: {the user's answer, or `Pending`}
Decision: {final decision, or `Pending`}
```

## Socratic Questions

1. Is this needed for the current Moras/NStack pilot milestone?
2. What is the smallest version that delivers the core value?
3. What can reuse existing docs, code, or services?
4. What is the verifiable completion condition?
5. What is explicitly out of scope?
6. Can the task be stated in one sentence?

## Gate Rules

- Ask at least one Socratic question before defining a meaningful task.
- Include an `AI Recommendation` with each Socratic question, not only the question.
- Capture the user's answer before treating the scope as approved.
- If the user answers partially, mark unresolved items as `Pending` and do not hide the uncertainty.
- A scope is complete only when each blocking question has a `Decision`.
- GitHub issues should normally be deferred until after the work order is drafted from the approved scope.
- LLMWiki remains temporarily disabled unless the user explicitly reconnects it.
