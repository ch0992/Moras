---
name: nstack-codex-ship
description: >
  Codex-specific quality gate and shipping workflow for Moras. Use when preparing
  a PR, push, Netlify deploy, production readiness check, or final verification
  after implementation.
---

# NStack Codex Ship

## Workflow

1. Identify the active work order and completion criteria when available.
2. Run relevant static analysis, type checks, tests, or build checks.
3. Review the diff for scope creep, debug code, secrets, and privacy risks.
4. Check deployment-specific requirements for Netlify/Supabase when relevant.
5. Summarize readiness as `Ship`, `Hold`, or `Needs user test`.
6. Prepare PR/push/deploy only after checks pass or risks are accepted.

## Moras Deployment Notes

- Frontend hosting target: Netlify.
- Database/auth/storage target: Supabase project `xzlwcfmdbjxhiycywtmi`.
- Never expose Supabase service role keys or participant personal data.
