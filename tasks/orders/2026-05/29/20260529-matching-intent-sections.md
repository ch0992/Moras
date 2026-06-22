# Moras Matching Intent Sections

## Socratic Dialogue

### Q1. Should friendship matching stay as male/female matching?
AI Recommendation: Keep friendship as male/female matching for this task, because it reuses the existing bipartite engine and keeps scope focused on intent grouping.
User Answer: 친목도 우선 남녀매칭으로 가.
Decision: Friendship matching remains male/female matching.

### Q2. Should existing participant/result data be preserved?
AI Recommendation: Do not spend effort on legacy compatibility if the event will collect fresh submissions.
User Answer: 기존데이터는 필요없어 다 지워버리고 이벤트날 새롭게 받을거야. 현재 결과로 나온 데이터들은 지우고 작업시작.
Decision: Clear current generated matching result data and implement for fresh event submissions.

### Q3. Should friendship matches require voting?
AI Recommendation: Only romance matches should support voting; friendship should be a public fun result section.
User Answer: 친목은 매칭투표를 굳이할 필요가 없이 재미로 보도록.
Decision: Romance has voting. Friendship has no vote CTA or vote status.

## Scope

- Add a required matching intent choice to the participant application flow: romance (`썸`) or friendship (`친목`).
- Persist matching intent on participant submissions and final match results.
- Run the existing male/female matching engine independently for romance and friendship groups.
- Render public results as `썸 매칭` first and `친목 매칭` second.
- Restrict match voting/detail flows to romance matches.
- Clear existing generated matching result data and old participant submissions before event-day fresh intake.

## Out of Scope

- Gender-neutral friendship matching.
- Legacy data migration beyond safe defaults for schema compatibility.
- Redesigning scoring logic.
- Re-enabling LLMWiki or SwarmVault.

## Verification

- Run syntax/build checks for changed Node modules.
- Run the deterministic matching engine locally where possible.
- Verify public result payload can represent both sections.
- Verify friendship matches do not expose voting UI.

## LLMWiki

temporarily disabled
