# Moras Matching Intent Sections Report

## Summary

Implemented matching intent grouping for Moras event matching.

- Participants now choose `썸` or `친목` during application.
- Matching runs independently inside each intent group.
- Public and admin results are sectioned as `썸 매칭` first and `친목 매칭` second.
- `썸` results keep voting behavior.
- `친목` results are displayed for fun without vote status or vote CTA.
- Existing participant submissions and generated matching result data were cleared for fresh event-day intake.

## Implementation Result

- Added `matching_intent` schema columns to:
  - `participant_submissions`
  - `match_results`
  - `unmatched_participants`
- Applied the Supabase migration to project `xzlwcfmdbjxhiycywtmi`.
- Added matching intent persistence through submission save/read paths.
- Updated the batch matching engine to run the current male/female solver per group.
- Updated public `/api/results` and admin `/api/admin/matches` payloads with `sections`.
- Restricted `/api/match/detail` and `/api/match/vote` to romance matches.
- Removed local `data/dev-submissions.json`, `data/dev-match-results.json`, and `data/operator-passcodes.json`.
- Cleared remote `participant_submissions`, `match_votes`, `match_results`, `unmatched_participants`, `compatibility_evaluations`, and `match_runs`.
- Follow-up adjustment: friendship (`친목`) applications no longer require marital status/range input, store no marital range, and skip the marital range filter during matching. Romance (`썸`) still uses marital range as an exclusion filter before score ranking.

## Verification

- `node -c` passed for changed server/page modules.
- `npm run build:netlify` completed successfully.
- Participant page inline browser script parse check passed.
- Production test seed and matching run completed against registered roster:
  - Test submissions created: 46
  - `썸 매칭`: 13 couples
  - `친목 매칭`: 6 couples
  - Unmatched: 8
  - Friendship test rows confirmed `maritalStatus: null` and `matchingMaritalRange: []`.
- Supabase REST confirmed `matching_intent` is selectable on all three changed tables.
- Local matching engine was run once with Supabase disabled and produced a valid section-ready result.
- Local `/api/results` returned `sections` with `romance` and `friendship`.
- Remote row counts confirmed cleared state:
  - `participant_submissions`: 0
  - `match_votes`: 0
  - `match_results`: 0
  - `unmatched_participants`: 0
  - `compatibility_evaluations`: 0
  - `match_runs`: 0

## LLMWiki

temporarily disabled

## NStack Pilot Feedback

- The Socratic gate helped lock the important product distinction: `썸` is vote-backed, `친목` is display-only.
- Supabase CLI availability differed between global and `npx`; using the Supabase connector was the cleanest path for remote DDL.
- For future work, a small reusable “sectioned match result” helper module would reduce duplication between public/admin result handlers.
