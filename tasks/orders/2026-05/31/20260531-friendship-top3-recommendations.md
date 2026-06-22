# 2026-05-31 Moras 친목 TOP 3 추천 결과

## Socratic Dialogue

- Question: 친목도 썸처럼 1:1 독점 매칭으로 유지할 것인가?
- AI Recommendation: 친목은 커플 성사가 아니라 재미로 보는 친구 추천이므로 참가자별 TOP 3 추천으로 분리한다.
- User Answer: `재미로 보는 나와 잘 맞는 이성친구` 표현을 사용하고, 개인별 3순위까지 보여준다. 카드 섹션 하나에 한 사람당 3명의 결과를 보여준다.
- Decision: 썸은 기존 1:1 매칭 유지, 친목은 `friendship_recommendations` 테이블에 참가자별 최대 3명 추천을 저장하고 결과 페이지에서 카드형으로 보여준다.

## Scope

- 친목 추천 저장용 Supabase 테이블 추가.
- 매칭 엔진에서 `friendship` 참가자는 독점 매칭이 아닌 개인별 반대 성별 TOP 3 추천으로 계산.
- 결과 페이지에서 `재미로 보는 나와 잘 맞는 이성친구` 섹션을 카드형으로 표시.
- 각 친목 추천 1~3위에 짧은 상세보기 제공.
- 기존 스타일과 결과 화면 톤을 최대한 유지.

## Out of Scope

- 썸 매칭 알고리즘 변경.
- 관리자 매칭 실행 자동화.
- 기존 운영/테스트 데이터 삭제.

## Verification

- Supabase 테이블 생성 확인.
- `node --check`로 변경 파일 문법 확인.
- `npm run build:netlify`.
- 로컬 `/api/results`와 프로덕션 `/api/results`에서 친목 추천 섹션 확인.
- 프로덕션 `/results`에서 친목 카드/상세 UI 포함 확인.

## LLMWiki

- temporarily disabled
