# Roulette Sequence And Match Reset

## Socratic Dialogue

- Question: Should match reset delete only match artifacts or also participant submissions?
- AI Recommendation: Follow the explicit user request and clear participant submissions too, while preserving the master event roster.
- User Answer: "매칭결과 초기화를 누르면 참가자 목록까지 전부 초기화되게 해줘."
- Decision: Match reset deletes match/vote/evaluation artifacts and participant submissions, but not `event_participants`.

- Question: Should roulette participants come from application submissions or the master roster?
- AI Recommendation: Add a roulette-specific participant list sourced from the master roster, because the user wants search/add/exclude independent of regular event applications.
- User Answer: The user requested adding participants by searching registered participant roster.
- Decision: Add `roulette_participants` and let results target that table.

- Question: How should timer sequencing work without a resident server?
- AI Recommendation: Keep the existing serverless polling model and generate missing sequence results whenever `/api/roulette` or admin roulette API is polled after the scheduled time.
- User Answer: Accepted implicitly by continuing from the existing Netlify architecture.
- Decision: Store selected item IDs and sequence timestamps; polling APIs progress one item per 8 seconds until all selected items have results.

## Scope

- Make admin match reset clear participant submissions as well as match artifacts.
- Add DB migration for roulette-specific participants and sequential draw settings.
- Update roulette admin UI to select multiple draw items, search/add/exclude roster participants, and show participant/result state together.
- Update public roulette page with dynamic wheel, item orbit, 8-second sequential draws, winner popups, and final celebration state.

## Out of Scope

- Do not delete the master participant roster.
- Do not change MBTI/saju matching scoring logic.
- Do not use LLMWiki/SwarmVault.

## Verification

- `node --check scripts/manse-web.js`
- `node --check scripts/moras/pages/admin-page.js`
- `node --check scripts/moras/pages/roulette-page.js`
- `node --check netlify/functions/moras.mjs`
- `npm run build:netlify`

## LLMWiki

temporarily disabled
