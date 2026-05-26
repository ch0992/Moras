# Admin Match Result Names

## Socratic Dialogue

- Question: Should this task change matching logic or only repair result display?
- AI Recommendation: Keep scope to the display/API shape bug because the screenshot shows scores and pair count are present, while participant names and manse details are missing.
- User Answer: The user asked to fix the missing names after matching on the admin page.
- Decision: Normalize admin match result payloads so existing result rows render participant names and manse information.

## Scope

- Fix `/api/admin/matches` response shape for Supabase-backed match results.
- Preserve existing matching algorithm, database schema, and visual layout.
- Add a small defensive client fallback only if needed.

## Out of Scope

- Do not rerun or reset production match data.
- Do not clear test participant submissions.
- Do not change public `/results` behavior unless required by shared code.

## Verification

- Run syntax checks for changed server/page files.
- Run `npm run build:netlify`.
- If practical, inspect the normalized API path locally without exposing secrets.

## LLMWiki

temporarily disabled
