# 2026-05-20 Moras event roster application flow completion

## Summary

- Added the `event_participants` master roster model and linked submissions through `roster_participant_id`.
- Added duplicate prevention before Gemini analysis and at the database level with a partial unique index.
- Updated the public form to search/select a participant from the roster and auto-fill name/gender.
- Added admin roster management for create, edit, and soft delete.
- Updated the public applicants page to show total, male, and female applicant counts and removed the return link.

## Seed Data

- Supabase roster seeded with 46 active participants extracted from the provided screenshots.
- Verified `나나` is stored as `여`.
- Local development roster mirrors the same 46 participants.
- Local dummy applicant list was reduced to 3 rows: 벤지, 나나, 하늘.

## Verification

- `node --check scripts/moras/storage.js`
- `node --check scripts/moras/manse-service.js`
- `node --check scripts/manse-web.js`
- `node --check netlify/functions/moras.mjs`
- `node --check scripts/moras/pages/participant-page.js`
- `node --check scripts/moras/pages/admin-page.js`
- `node --check scripts/moras/pages/applicants-page.js`
- `curl http://localhost:4174/api/roster`: 46 participants, submitted flags applied locally.
- `curl http://localhost:4174/api/applicants`: 3 local dummy applicants, male 2, female 1.
- `curl http://localhost:4174/api/admin/roster` with admin cookie: 46 participants.
- Supabase SQL verification: 46 active participants, 27 male, 19 female.
- `npm run build:netlify`: passed.

## Notes

- `npm test` is still a placeholder that exits with failure, so it was not useful as a product verification gate.
- Admin delete currently soft-deletes roster participants so existing submissions and matching history are not broken.
- LLMWiki: temporarily disabled.
