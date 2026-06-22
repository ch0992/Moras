# 2026-05-31 Moras 친목 TOP 3 추천 결과 완료 보고

## 구현 결과

- Supabase에 `friendship_recommendations` 테이블을 추가했다.
- 친목 참가자는 더 이상 1:1 독점 매칭으로 저장하지 않고, 개인별 반대 성별 TOP 3 추천으로 계산한다.
- 결과 페이지 친목 섹션 제목을 `재미로 보는 나와 잘 맞는 이성친구`로 변경했다.
- 친목 결과는 `한 참가자 = 카드 하나` 구조로 보여주며, 카드 안에 최대 3명의 추천 이성친구를 표시한다.
- 각 추천 항목마다 `상세` 버튼을 두고 MBTI 케미, 사주/오행 케미, 추천 대화 포인트를 짧게 제공한다.
- 기존 테스트 run처럼 새 테이블에 추천 데이터가 없는 경우에는 과거 친목 match_results를 1순위 추천 형태로 fallback 표시한다.
- 새로 매칭 엔진을 실행하는 run부터는 `friendship_recommendations`에 TOP 3가 저장된다.

## 검증

- Supabase 운영 DB에서 `friendship_recommendations` 테이블 생성 및 조회 확인.
- `node --check scripts/moras/match-service.js`
- `node --check scripts/manse-web.js`
- `node --check scripts/moras/pages/results-page.js`
- `node --check scripts/moras/pages/must-know-page.js`
- `npm run build:netlify`
- 로컬 `/api/results`에서 친목 섹션 제목 및 카드 구조 확인.
- `npx netlify deploy --prod --build`
- 프로덕션 `/api/results`에서 `재미로 보는 나와 잘 맞는 이성친구` 섹션 확인.
- 프로덕션 `/results` HTTP 200 및 친목 카드/상세보기 UI 문구 포함 확인.

## 배포

- Production URL: `https://moras-event-matching.netlify.app`
- Results URL: `https://moras-event-matching.netlify.app/results`
- Unique deploy URL: `https://6a1c5360fc772ef671f2f454--moras-event-matching.netlify.app`

## 운영 메모

- 현재 프로덕션 테스트 run은 새 친목 추천 테이블 생성 전 데이터라 fallback으로 1명 추천만 표시된다.
- 다음에 관리자가 매칭 엔진을 실행하면 친목 참가자별 최대 3명 추천이 새로 계산되어 표시된다.

## NStack 피드백

- `match_results`에 친목 추천을 억지로 저장하지 않고 별도 테이블로 분리한 판단이 향후 화면/통계 확장에 유리하다.
- 기존 결과와 새 결과를 모두 보여주기 위해 fallback 레이어가 필요했다.

## LLMWiki

- temporarily disabled
