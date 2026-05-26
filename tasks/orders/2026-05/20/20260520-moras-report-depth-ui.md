# Work Order: Moras 리포트 깊이와 카드 UI 보강

## Socratic Dialogue

- Question: 신규 페이지를 만들 것인가, 기존 결과 페이지를 개선할 것인가?
- AI Recommendation: 기존 결과 페이지 구조를 유지하고, Gemini 출력 구조와 카드 렌더링만 보강한다.
- User Answer: 신규 페이지가 아니라 현재 결과 페이지를 고급 심리 리포트 형태로 개선한다.
- Decision: 기존 결과 페이지 내부 개선으로 진행한다.

- Question: 사주 서비스처럼 보일 것인가, 심리 리포트처럼 보일 것인가?
- AI Recommendation: 예언/단정 표현을 줄이고 사주+MBTI 기반 자기 이해, 관계 리듬, 감정 흐름 중심으로 구성한다.
- User Answer: 점술보다 심리 분석, 예언보다 자기 이해, 단정보다 흐름 해석을 원한다.
- Decision: 프롬프트와 UI 문구를 심리 리포트 톤으로 조정한다.

## Scope

- `scripts/moras/gemini.js` 상세 리포트 schema/prompt 확장
- `scripts/moras/pages/participant-page.js` 기존 결과 페이지 카드 UI 개선
- 기존 만세력 표, 제출 흐름, 저장 구조 유지

## Out of Scope

- 신규 페이지 생성
- DB schema 변경
- 관리자 기능 변경
- 매칭 엔진 변경
- 배포

## Verification

- Node syntax check
- Netlify bundle build
- 로컬 서버 최신 코드 재시작 확인

## LLMWiki

temporarily disabled
