# 완료 보고서: Moras 이벤트 매칭 스펙 정리

작성일: 2026-05-18 20:34:05 CDT  
작업 지시서: `tasks/orders/2026-05/18/moras-event-matching-spec-gemini-manse.md`  
LLMWiki: 임시 비활성

## 완료된 작업

- [x] Moras MVP를 “필수 기능만 있는 Netlify 공개 이벤트 웹앱”으로 정리
- [x] Gemini API 기반 만세력 캡처 구조화와 양방향 궁합 점수 생성 반영
- [x] 포스텔러 공개 API는 확인되지 않아 캡처 업로드 + Gemini Vision 추출을 MVP 권장안으로 정리
- [x] Ablecity 같은 상용 만세력/사주 API를 대안으로 기록
- [x] 평균 점수 기반 1:1 강제 매칭 알고리즘 정리
- [x] 성비 불일치 시 적은 성별 기준으로 매칭하는 규칙 반영
- [x] 결과 페이지, 1등 하이라이트, 상세 이유, 비밀 투표 흐름 반영
- [x] 데이터 모델과 구현 우선순위 갱신

## 수정된 파일

| 파일 | 변경 내용 |
|---|---|
| `docs/product/moras-event-flow-spec.md` | 신규 이벤트 매칭 플로우 스펙 작성 |
| `docs/project-plan.md` | Gemini, 만세력 캡처, 매칭 알고리즘, 데이터 모델, 구현 단계 반영 |
| `docs/product/moras-product-brief.md` | 제품 정의와 MVP 흐름 갱신 |
| `tasks/orders/2026-05/18/moras-event-matching-spec-gemini-manse.md` | 작업 지시서 추가 |
| `tasks/index.md` | 작업 인덱스 업데이트 |

## 외부 확인

- 포스텔러 만세력 앱/웹은 확인됨: `https://pro.forceteller.com/app/`
- 포스텔러 서비스 목록에 만세력 서비스는 확인됨: `https://forceteller.com/profile`
- 공개 검색 기준 포스텔러 공식 개발자용 만세력 API 문서는 확인되지 않음
- Ablecity 만세력/사주 API 문서 확인: `https://ablecity.kr/api`
- Gemini API 이미지 이해 문서 확인: `https://ai.google.dev/gemini-api/docs/vision`
- Gemini API 구조화 출력 문서 확인: `https://ai.google.dev/gemini-api/docs/structured-output`

## 검증

실행한 확인:

```bash
rg -n "Gemini API|포스텔러|Ablecity|만세력|비밀 투표|최적 매칭|탐욕" docs/project-plan.md docs/product/moras-product-brief.md docs/product/moras-event-flow-spec.md
```

결과:

- Gemini API 사용 위치가 제품 브리프, 프로젝트 계획, 신규 스펙 문서에 반영됨
- 만세력 처리 방식이 캡처 업로드 우선으로 정리됨
- 매칭/상세/투표 흐름이 신규 스펙 문서와 기존 계획 문서에 반영됨

## 발견된 이슈

- 인증 없이 비밀 투표를 완전히 보호하기는 어렵다.
- MVP 권장안은 “로그인은 없지만 개인용 짧은 코드로 중복 투표를 줄이는 방식”이다.
- 포스텔러 API가 공식 공개 문서로 확인되지 않아 직접 연동을 전제로 하면 일정 리스크가 크다.

## NStack 피드백

- 요구사항이 길어질수록 별도 스펙 문서를 만들고 기존 계획/브리프에서는 참조하는 방식이 문서 유지에 좋다.
- LLMWiki 비활성 상태에서도 작업 지시서와 완료 보고서만으로 한 사이클 추적은 가능했다.

## 미완료 항목

- 실제 Gemini API prompt/schema 설계
- Supabase migration 작성
- 만세력 캡처 업로드 UI 구현
- 매칭 알고리즘 구현 방식 최종 결정
