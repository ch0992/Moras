# Admin Match Result Names Report

## Summary

Fixed the admin match results display bug where matched participant cards showed only MBTI values and omitted names after loading Supabase-backed results.

## Implementation Result

- Added a shared `matchPerson` normalizer in `scripts/manse-web.js`.
- Normalized `/api/admin/matches` participants from Supabase snake_case fields into the camelCase shape expected by the admin UI.
- Reused the same normalizer for public results to keep result payloads consistent.
- Added defensive normalization in `scripts/moras/pages/admin-page.js` so admin rendering handles both `displayName` and `display_name`.

## Verification

- `node --check scripts/manse-web.js`
- `node --check scripts/moras/pages/admin-page.js`
- `node --check netlify/functions/moras.mjs`
- `npm run build:netlify`

## Notes

- Local server started successfully, but local completed match data was empty, so live local rendering with an existing match set was not available.
- Production admin login with the provided handoff password was rejected, so production API sampling could not be completed from this session.
- No production data was reset or modified.

## LLMWiki

temporarily disabled

## NStack Feedback

The issue was a classic API shape mismatch between Supabase `display_name`/`manse_result` and UI `displayName`/`manse`. A small response normalizer near the route boundary kept the fix durable without touching matching logic or DB state.
