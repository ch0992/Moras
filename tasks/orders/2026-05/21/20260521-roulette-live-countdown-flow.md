# Moras Roulette Live Countdown Flow

## Socratic Dialogue

- Question: Should the roulette page center the prize item or the live event itself?
- AI Recommendation: Treat the page as a live event screen. Show the admin-defined roulette event name as the main title, while prize/item labels remain in accumulated result rows.
- User Answer: The page should show an event name such as "제 1회 룰렛이벤트" instead of the last ticket name.
- Decision: Add admin-managed roulette settings with event name and start time.

- Question: How should the draw feel to viewers?
- AI Recommendation: Animate participant names one by one above the wheel, then append the winner to the result history.
- User Answer: Participants should appear one by one in a popup while the roulette spins, and results should accumulate below.
- Decision: Change the public roulette page to participant-driven live draw presentation.

## Scope

- Add roulette event settings persistence.
- Add admin UI for event name and start time.
- Add admin selection between immediate spin and timer-based automatic spin.
- Update the public roulette page to show event name, countdown, participant popup animation, and accumulated results.
- Deploy to production after local verification.

## Out of Scope

- Full realtime websocket implementation.
- Prize inventory management beyond existing roulette item records.
- Changing participant submission or match-result logic.

## Verification

- `node --check scripts/manse-web.js`
- `node --check scripts/moras/pages/admin-page.js`
- `node --check scripts/moras/pages/roulette-page.js`
- `npm run build:netlify`
- Local `/api/roulette` response check
- Production `/roulette` and `/api/roulette` response check

## LLMWiki

temporarily disabled
