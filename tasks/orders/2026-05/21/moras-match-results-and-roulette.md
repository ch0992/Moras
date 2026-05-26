# Moras 매칭 결과 및 추첨 기능 작업 지시서

## Socratic Dialogue

- Question: 매칭 점수는 어떤 수준까지 복잡하게 설계할 것인가?
- AI Recommendation: 현재 수집 데이터로 안정적으로 계산 가능한 MBTI 상호 궁합, 사주 상호 궁합, 두 점수의 편차 보정만 사용한다.
- User Answer: 매칭점수는 아주 단순하게 MBTI, 사주, 편차값 세 가지로 한다.
- Decision: 1차 구현은 단순 점수 공식 기반으로 진행하고 Gemini 기반 방향성 점수는 사용하지 않는다.

- Question: 편차값은 어떻게 환산할 것인가?
- AI Recommendation: 전체 후보 조합의 최대 편차를 기준으로 비율화하고, 매칭에는 편차가 작을수록 높은 보정 점수로 뒤집어 사용한다.
- User Answer: 전체 인원의 최대치를 기준으로 비율 환산한다.
- Decision: `consistencyScore = 100 - (abs(mbtiScore - sajuScore) / maxDeviation * 100)` 공식을 사용한다.

- Question: 관리자 결과 화면은 어디에 붙일 것인가?
- AI Recommendation: 기존 관리자 대시보드의 일괄 매칭 실행 및 매칭 결과 탭을 확장해 운영자가 한 화면에서 실행, 확인, 상세 보기, PDF 저장을 할 수 있게 한다.
- User Answer: 진행 승인.
- Decision: 기존 관리자 흐름을 유지하되 매칭 결과 UI를 한 줄 커플 리스트와 상세 패널로 개선한다.

## Scope

- 단순 공식 기반 매칭 점수 엔진으로 전환한다.
- 매칭 결과에 MBTI 점수, 사주 점수, 편차 보정 점수, 최종 점수, 관계 타입, 설명을 저장/표시한다.
- 관리자 매칭 결과 탭을 커플별 한 줄 리스트와 상세 결과 패널로 개선한다.
- 상세 패널에서 남녀 만세력 표와 점수 설명을 확인하고 브라우저 PDF 저장이 가능하게 한다.

## Out of Scope

- 공개 사용자용 매칭 결과 페이지 고도화.
- 룰렛 추첨 기능의 전체 DB 설계 및 운영 UI 완성.
- Gemini를 활용한 커플별 긴 궁합 리포트 생성.
- LLMWiki/SwarmVault 기록.

## Verification

- `node --check`로 수정 JS 구문 검증.
- `npm run build:netlify`로 Netlify 번들 검증.
- 로컬 관리자 API/화면 수동 확인.

## LLMWiki

temporarily disabled
