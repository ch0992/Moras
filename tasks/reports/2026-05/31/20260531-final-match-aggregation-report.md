# 2026-05-31 Moras 투표 마감 후 상호 매칭 집계 완료 보고

## 구현 결과

- 매칭 실행은 관리자 수동 실행으로 유지했다.
- `/api/results` 조회 시 최신 완료 매칭 run의 `vote_deadline_at`이 지난 경우 자동으로 최종 집계를 수행하도록 했다.
- 썸 매칭에서 투표하지 않은 참가자는 자동으로 `selection = no`로 보정된다.
- 각 썸 매칭에 `maleSelection`, `femaleSelection`, `isMutual`, `finalStatus`를 포함해 내려주도록 했다.
- 결과 페이지 상단에 `상호 매칭 결과` 섹션을 추가했다.
- 마감 후에는 `매칭 투표하러 가기` CTA를 숨기고, 각 참가자의 최종 선택을 `O 선택` / `X 선택`으로 보여준다.
- 친목 매칭은 투표/상호 매칭 집계 대상에서 제외했다.

## 검증

- `node --check scripts/manse-web.js`
- `node --check scripts/moras/pages/results-page.js`
- `npm run build:netlify`
- `npx netlify deploy --prod --build`
- 프로덕션 `/results` HTTP 200 확인.
- 프로덕션 `/api/results`에서 `finalSummary.finalized = true`, `totalRomanceMatches = 13`, `mutualCount = 0`, `sections = 썸 매칭:13, 친목 매칭:6` 확인.
- 프로덕션 결과 페이지 HTML에 `상호 매칭 결과`, `미투표는 자동으로 X` 문구 포함 확인.

## 배포

- Production URL: `https://moras-event-matching.netlify.app`
- Unique deploy URL: `https://6a1c50dc129c47f0a782668d--moras-event-matching.netlify.app`

## NStack 피드백

- 마감 후 집계는 별도 cron보다 `/api/results`의 lazy finalization이 현재 운영 부담이 낮다.
- 추후 정확한 시각에 선제 확정이 필요하면 Netlify Scheduled Function으로 같은 finalization 함수를 호출하는 구조로 확장하면 된다.

## LLMWiki

- temporarily disabled
