# 2026-05-31 Moras 투표 마감 후 상호 매칭 집계

## Socratic Dialogue

- Question: 매칭 실행까지 자동화할 것인가?
- AI Recommendation: 매칭 실행은 운영 판단이 필요하므로 관리자 수동 실행을 유지한다.
- User Answer: 매칭을 돌리는 것은 관리자가 수행하도록 하고, 투표 마감 후 자동 집계/공개만 구현한다.
- Decision: `/api/results` 조회 시 투표 마감이 지난 run을 자동 확정하고 상호 `yes/yes` 결과를 공개한다.

## Scope

- 최신 완료 매칭 run의 `vote_deadline_at`이 지난 경우 미투표 썸 참가자를 자동 `no`로 보정한다.
- 각 썸 매칭의 남/녀 선택값과 상호 매칭 여부를 계산한다.
- 결과 페이지 상단에 “상호 매칭 결과” 섹션을 표시한다.
- 친목 매칭은 투표/상호 매칭 집계 대상에서 제외한다.

## Out of Scope

- 관리자 매칭 실행 자동화.
- Supabase cron 또는 Netlify scheduled function 추가.
- 매칭 알고리즘 변경.
- 기존 참가자/매칭 데이터 삭제.

## Verification

- `node --check` 및 `npm run build:netlify`.
- `/api/results` 응답 구조에서 마감 후 final summary가 내려가는지 확인.
- 프로덕션 배포 후 `/results` 접근 확인.

## LLMWiki

- temporarily disabled
