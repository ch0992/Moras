# Work Order: Gemini 신청 결과 속도 개선

## Socratic Dialogue

- Question: 이벤트 신청 직후 사용자가 기다리는 시간을 줄이려면 Gemini 분석을 비동기로 분리할지, 즉시 표시용 분석을 짧게 만들지 결정이 필요하다.
- AI Recommendation: 현재 Netlify Function 구조에서는 백그라운드 작업 보장보다 짧은 즉시 리포트를 먼저 생성하는 방식이 가장 작은 변경이다.
- User Answer: "현재 이벤트 신청 후 사주분석까지 너무 느려 속도 개선이 필요해"
- Decision: 공개 신청 결과는 빠른 리포트 프롬프트를 우선 사용하고, 실패 시에만 더 긴 폴백을 사용한다.

## Scope

- Gemini 신청 분석의 기본 응답량과 재시도 순서를 속도 우선으로 조정한다.
- 기존 UI가 기대하는 JSON 필드 구조는 유지한다.
- 실패 결과를 저장하지 않는 기존 정책은 유지한다.

## Out of Scope

- 별도 큐/스케줄러/백그라운드 함수 도입
- 관리자 재분석 기능
- 매칭 상세 Gemini 분석 로직 변경

## Verification

- 실제 Gemini 호출 경로로 응답 시간과 JSON 파싱 확인
- `node --check scripts/moras/gemini.js`
- `node --check scripts/moras/manse-service.js`
- `npm run build:netlify`

## LLMWiki

temporarily disabled
