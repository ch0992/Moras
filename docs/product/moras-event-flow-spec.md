# Moras 이벤트 매칭 플로우 스펙

작성일: 2026-05-18

## 1. 제품 방향

Moras MVP는 이벤트 진행에 필요한 기능만 제공한다. 별도 랜딩 페이지, 마케팅 페이지, 복잡한 계정 시스템은 만들지 않는다.

핵심 목표는 다음과 같다.

- 참가자가 안내에 따라 빠르게 정보를 입력한다.
- 운영자가 전체 참가자 입력 완료 후 일괄 매칭을 실행한다.
- Node.js 만세력 라이브러리가 생년월일시 입력값으로 사주/만세력 정보를 계산한다.
- 생년월일시 원본 입력값은 공개 화면에 노출하지 않고 관리자 화면에서만 조회하며, 매칭에는 MBTI와 계산된 만세력 결과를 사용한다.
- Gemini API가 MBTI와 계산된 사주/만세력 정보를 기반으로 방향성 점수와 매칭 이유를 생성한다.
- 시스템은 모든 참가자를 점수 기반으로 1:1 매칭한다.
- 결과 페이지에서 평균 점수와 상세 이유를 보여준다.
- 각 매칭 상세 페이지 하단에서 남녀가 각각 비밀 투표를 한다.

## 2. 페이지 구성

MVP 페이지는 꼭 필요한 화면만 둔다.

| 페이지 | 경로 예시 | 목적 |
|---|---|---|
| 참가자 입력 | `/` | 참가자 선택, MBTI 입력, 생년월일시 입력, 만세력 계산, 제출 |
| 제출 완료 | `/submitted` | 입력 완료 안내 |
| 운영자 진행 | `/admin` | 참가자 입력 상태 확인, 일괄 매칭 실행 |
| 매칭 결과 | `/matches` | 전체 매칭 결과와 평균 점수 확인 |
| 매칭 상세 | `/matches/{matchId}` | 남녀 방향성 점수, 이유, 비밀 투표 |

참가자 화면에는 회원가입/로그인을 넣지 않는다. 운영자 페이지는 별도 `/admin` 화면으로 두고, 최소한의 관리자 패스코드 또는 운영자 전용 접근 키로 보호한다. 참가자 공개 화면에는 민감정보를 표시하지 않는다.

## 3. 참가자 입력 흐름

1. 사용자가 Moras에 접속한다.
2. DB에 미리 등록된 참가자 목록에서 본인을 드롭다운으로 선택한다.
3. MBTI를 직접 입력하거나 선택한다.
4. 생년월일, 출생시간, 양력/음력, 출생 지역 또는 경도 등 사주 계산에 필요한 기본 정보를 입력한다.
5. 서버에서 `@fullstackfamily/manseryeok`로 만세력을 계산한다.
6. 계산 결과를 참가자에게 요약 표시하고, 개인정보/이벤트 이용 동의 후 제출한다.
7. DB에는 입력 원본과 계산 결과를 저장하되, 생년월일시 원본은 관리자 화면에서만 조회하고 공개 화면에는 노출하지 않는다.

드롭다운은 `participants` 또는 별도 `event_invitees` 테이블에서 가져온다. MVP에서는 운영자가 사전에 참가자 표시 이름과 성별을 등록해둔다.

## 4. 만세력 처리 방식

### 4.1 MVP 1순위: Node.js 라이브러리 자체 계산

MVP에서는 포스텔러 캡처를 필수로 받지 않는다. 참가자가 생년월일시를 입력하면 서버 측에서 `@fullstackfamily/manseryeok`로 만세력을 계산한다. 입력 원본은 공개 화면에 노출하지 않고 관리자 화면에서만 조회한다.

이 방식의 장점:

- 사용자가 별도 사이트에서 캡처를 만들 필요가 없다.
- Next.js/Netlify 서버 route 또는 function에서 바로 계산할 수 있다.
- 포스텔러 캡처 업로드로 인한 참여 이탈 리스크를 줄일 수 있다.
- 계산 결과가 구조화 데이터로 바로 저장된다.

현재 확인한 `@fullstackfamily/manseryeok` 신호:

| 항목 | 확인 결과 |
|---|---:|
| GitHub Stars | 35 |
| Forks | 17 |
| Open Issues | 0 |
| npm 다운로드 last week | 861 |
| npm 다운로드 last month | 3,789 |
| 라이선스 | MIT |
| 언어 | TypeScript |

주의점:

- 신생 라이브러리라 커뮤니티 검증은 아직 약하다.
- 절기, 월주, 오행 관련 중요 버그 수정 이력이 있으므로 샘플 검증이 필요하다.
- 포스텔러 등 외부 만세력 결과와 최소 20개 이상 샘플 비교 후 사용 범위를 확정한다.

### 4.2 포스텔러 API 여부

현재 공개 검색 기준으로 포스텔러 만세력의 공식 공개 API 문서는 확인되지 않았다. 포스텔러는 만세력 앱/웹 서비스를 제공하지만, 개발자용 만세력 API를 공개 문서로 제공한다고 보기 어렵다.

따라서 MVP에서는 포스텔러 API 직접 연동을 전제로 하지 않는다.

참고:

- 포스텔러 만세력 앱/웹: `https://pro.forceteller.com/app/`
- 포스텔러 서비스 목록: `https://forceteller.com/profile`

### 4.3 MVP 검증: 포스텔러 비교

포스텔러 캡처 업로드는 MVP 참가자 흐름에 넣지 않는다. 캡처를 요구하면 참여 마찰이 커지므로, 우선 운영자가 테스트 샘플로 `@fullstackfamily/manseryeok` 결과를 포스텔러 만세력 결과와 직접 비교한다.

첫 검증은 운영자의 실제 생년월일시 샘플로 진행한다. 정확도가 충분하면 라이브러리 계산 방식을 유지하고, 정확도가 낮으면 그때 포스텔러 기반 입력 또는 다른 만세력 API/라이브러리로 전환을 검토한다.

검증 대상:

- 연/월/일/시 기둥
- 일간
- 오행 분포
- 절기 기준 월주
- 음력/양력 처리 결과

### 4.4 대안

상용 만세력/사주 API가 필요하면 별도 API 제공업체를 검토한다. 예를 들어 Ablecity는 만세력 API와 사주 관련 API 문서를 공개하고 있다. 다만 API 비용, 응답 품질, 사용권, 데이터 처리 조건을 별도로 확인해야 한다.

참고:

- Ablecity 만세력/사주 API 문서: `https://ablecity.kr/api`

## 5. Gemini API 사용 방식

Gemini API는 만세력을 직접 계산하는 도구가 아니라, 계산된 만세력/사주 결과와 MBTI를 바탕으로 궁합 점수와 이유를 생성하는 도구로 사용한다.

### 5.1 만세력 캡처 구조화

MVP에서는 만세력 캡처 이미지 구조화를 구현하지 않는다. `@fullstackfamily/manseryeok` 정확도가 부족하다고 판단될 때만 후속 대안으로 검토한다.

후속 대안 입력:

- 만세력 캡처 이미지
- 참가자가 제출 직전에 입력한 생년월일/출생시간/양력·음력

후속 대안 출력:

- 일간
- 연/월/일/시 기둥
- 오행 분포
- 기질 키워드
- 추출 신뢰도
- 추출 실패/불확실 항목

Gemini는 후속 대안 상황에서 이미지 이해와 구조화 출력에 사용할 수 있다. 응답은 JSON schema 형태로 제한하고, 서버에서 Zod로 재검증한다.

이 대안을 쓰더라도 생년월일시 원본은 저장하지 않는다. 저장 대상은 캡처 이미지 경로, 추출된 만세력 구조화 결과, 추출 신뢰도다.

참고:

- Gemini API 이미지 이해 문서: `https://ai.google.dev/gemini-api/docs/vision`
- Gemini API 구조화 출력 문서: `https://ai.google.dev/gemini-api/docs/structured-output`

### 5.2 방향성 점수와 매칭 이유 생성

Gemini 점수는 개인의 관점에서 반대 성별 전체 대상을 하나씩 평가하는 방향성 점수로 생성한다. 남자 A와 여자 B의 최종 조합 점수는 `남자 A -> 여자 B` 평가와 `여자 B -> 남자 A` 평가를 묶어 평균낸다.

입력:

- 평가자 MBTI
- 평가 대상 MBTI
- 평가자 만세력 계산 결과
- 평가 대상 만세력 계산 결과
- 이벤트 톤과 금지 표현

방향성 평가 출력:

- `score`: 평가자 관점에서 본 대상과의 궁합 점수
- `reason`: 평가자 관점의 상세 이유
- `reason_keywords`: 요약 키워드

조합 집계 출력:

- `male_to_female_score`: 남자 기준에서 여자와의 궁합 점수
- `female_to_male_score`: 여자 기준에서 남자와의 궁합 점수
- `average_score`: 두 점수의 평균
- `reason_summary`: 공개용 요약
- `operator_notes`: 운영자 검토용 참고

Gemini 결과는 그대로 신뢰하지 않고, 앱에서 점수 범위와 JSON 스키마를 검증한다.

## 6. 매칭 알고리즘

### 6.1 기본 원칙

전체 참가자를 대상으로 1:1 매칭을 강제로 만든다.

- 남녀 수가 같으면 모든 참가자를 매칭한다.
- 성비가 다르면 적은 쪽 인원 수만큼만 1:1 매칭한다.
- 예: 남자 10명, 여자 7명이면 7쌍 생성, 남자 3명은 미매칭 처리.

### 6.2 점수 계산

각 남녀 조합마다 다음 점수를 계산한다.

```text
average_score = (male_to_female_score + female_to_male_score) / 2
```

매칭은 평균 점수가 가장 높은 조합을 우선한다. 단, 한 참가자는 한 번만 매칭된다.

### 6.3 매칭 선택 방식

MVP는 최적 매칭 방식으로 구현한다.

- 모든 남녀 조합의 `average_score`를 만든다.
- 전체 매칭 쌍의 평균 점수 합이 최대가 되도록 bipartite matching을 수행한다.
- 성비가 다르면 적은 성별 인원 수만큼만 매칭하고, 남는 참가자는 `unmatched_participants`에 저장한다.
- 동일 참가자는 한 번만 최종 매칭된다.

구현은 참가자 수가 작은 첫 이벤트에서는 완전탐색 또는 DP로 시작할 수 있다. 참가자 수가 커지면 Hungarian algorithm 또는 min-cost max-flow 기반 구현으로 교체한다. 외부에 보여주는 기준은 항상 “전체 평균 점수 합 최대화”로 유지한다.

## 7. 결과 표시

매칭 결과 페이지에는 다음을 보여준다.

- 순위
- 남자 표시 이름
- 여자 표시 이름
- 평균 점수
- 남자 기준 점수
- 여자 기준 점수
- 상세보기 버튼

1등 매칭은 특별하게 하이라이트한다. 예를 들어 상단 고정, 강조 색상, 배지 등을 사용한다.

## 8. 상세 페이지와 비밀 투표

상세 페이지에는 다음을 보여준다.

- 남녀 참가자
- 평균 점수
- 양방향 점수
- Gemini가 생성한 매칭 이유
- 운영자용 참고 메모

하단에는 남자와 여자 각각의 선택 버튼을 둔다.

| 투표 대상 | 버튼 예시 |
|---|---|
| 남자 참가자 | `선택하기` |
| 여자 참가자 | `선택하기` |

투표는 공개 결과 페이지에 바로 노출하지 않는다. 추후 운영자가 결과를 공개한다.

참가자 로그인은 없지만 비밀 투표 코드는 투표 당사자와 운영자만 알아야 한다.

- 운영자는 관리자 페이지에서 참가자별 투표 코드를 생성한다.
- 코드는 당사자에게만 개별 전달한다.
- DB에는 코드 원문을 저장하지 않고 `vote_code_hash`만 저장한다.
- 운영자가 코드를 잃어버리면 관리자 페이지에서 해당 참가자의 코드를 재생성한다.
- 투표 제출 시 참가자 선택값과 코드가 일치해야 저장한다.

이것은 참가자 계정 인증은 아니지만, 투표 당사자와 운영자만 아는 코드로 중복/오남용을 줄이는 최소 운영 안전장치다.

## 9. 데이터 모델 추가/변경

### event_invitees

운영자가 사전에 등록한 참가자 후보 목록이다.

- `id`
- `event_id`
- `display_name`
- `gender`
- `sort_order`
- `created_at`

### participants

참가자 제출 정보다.

- `id`
- `event_id`
- `invitee_id`
- `display_name`
- `gender`
- `mbti`
- `manse_calculated`
- `manse_library`
- `manse_library_version`
- `manse_calculated_at`
- `consent_accepted`
- `vote_code_hash`
- `vote_code_generated_at`
- `submitted_at`
- `created_at`

주의:

- 생년월일, 출생시간, 양력/음력, 출생 지역 원본은 공개 화면에 노출하지 않고 관리자 화면에서만 조회한다.
- 만세력 캡처 이미지 경로나 추출 결과는 MVP 저장 모델에 포함하지 않는다.
- 투표용 코드는 원문을 저장하지 않고 해시만 저장한다.

### match_runs

매칭 계산 실행 단위다.

- `id`
- `event_id`
- `status`
- `prompt_version`
- `gemini_model`
- `started_at`
- `completed_at`
- `error_message`
- `created_at`

### compatibility_evaluations

개인 한 명의 관점에서 반대 성별 대상 한 명을 평가한 Gemini 방향성 점수다.

- `id`
- `event_id`
- `match_run_id`
- `scorer_participant_id`
- `target_participant_id`
- `score`
- `reason`
- `reason_keywords`
- `prompt_version`
- `gemini_model`
- `raw_gemini_response`
- `created_at`

예시:

- 남자 A -> 여자 B 점수 84점
- 여자 B -> 남자 A 점수 76점

### compatibility_pairs

두 방향성 평가를 묶은 남녀 조합별 집계 결과다.

- `id`
- `event_id`
- `match_run_id`
- `male_participant_id`
- `female_participant_id`
- `male_to_female_evaluation_id`
- `female_to_male_evaluation_id`
- `male_to_female_score`
- `female_to_male_score`
- `average_score`
- `reason_summary`
- `operator_notes`
- `created_at`

### match_results

최종 매칭 결과다.

- `id`
- `event_id`
- `match_run_id`
- `male_participant_id`
- `female_participant_id`
- `compatibility_pair_id`
- `average_score`
- `rank`
- `is_top_match`
- `confirmed_by_operator`
- `operator_notes`
- `created_at`

### unmatched_participants

성비가 맞지 않아 최종 매칭에서 제외된 참가자를 저장한다.

- `id`
- `event_id`
- `match_run_id`
- `participant_id`
- `reason`
- `created_at`

### match_votes

상세 페이지 하단의 비밀 투표 결과다.

- `id`
- `match_result_id`
- `participant_id`
- `selection`
- `vote_code_hash`
- `revealed_at`
- `created_at`

## 10. Netlify/Supabase 구조

MVP에서 클라이언트가 Gemini API 키를 직접 갖지 않는다.

| 기능 | 구현 위치 |
|---|---|
| 참가자 입력 화면 | Next.js page |
| 만세력 계산 | Netlify Function 또는 Next.js server route + `@fullstackfamily/manseryeok` |
| 만세력 이미지 저장 | MVP 제외, 정확도 부족 시 후속 검토 |
| 만세력 이미지 구조화 | MVP 제외, 정확도 부족 시 Gemini Vision 후속 검토 |
| Gemini 점수 계산 | Netlify Function 또는 Next.js server route |
| 매칭 최적화 실행 | Netlify Function 또는 server route |
| 결과 조회 | Next.js page + Supabase |
| 투표 저장 | server route에서 `vote_code_hash` 검증 후 저장 |
| 운영자 페이지 | `/admin`, 관리자 패스코드 또는 운영자 전용 접근 키 |

Gemini API 키와 Supabase service role key는 서버 환경변수에만 둔다. `@fullstackfamily/manseryeok` 계산도 서버 측에서 수행해 결과를 저장한다.

## 11. 구현 우선순위

1. Supabase 테이블 정의
2. 참가자 후보 목록 seed
3. 참가자 입력 화면
4. `@fullstackfamily/manseryeok` 기반 만세력 계산
5. 만세력 계산 결과 검증 샘플 작성
6. Gemini 기반 양방향 점수 생성
7. 일괄 매칭 실행
8. 결과 페이지
9. 상세 페이지
10. 관리자 페이지 보호
11. 비밀 투표 코드 생성/검증
12. 비밀 투표

## 12. 남은 결정

- `@fullstackfamily/manseryeok` 검증 기준 샘플 수와 기준 사이트
- 결과 상세 이유를 참가자에게도 공개할지, 운영자만 볼지
