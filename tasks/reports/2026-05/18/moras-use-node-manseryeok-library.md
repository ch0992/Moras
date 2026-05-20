# 완료 보고서: Node.js 만세력 라이브러리 사용 결정 반영

작성일: 2026-05-18 20:47:09 CDT  
작업 지시서: `tasks/orders/2026-05/18/moras-use-node-manseryeok-library.md`  
LLMWiki: 임시 비활성

## 완료된 작업

- [x] Moras MVP 만세력 처리 1순위를 캡처 업로드에서 Node.js 라이브러리 자체 계산으로 변경
- [x] `@fullstackfamily/manseryeok`를 생년월일시 기반 서버 측 만세력 계산 후보로 명시
- [x] 참가자 입력 흐름을 “본인 선택 + MBTI + 생년월일시 + 양력/음력 + 출생 지역/경도” 중심으로 정리
- [x] 포스텔러 캡처 업로드와 Gemini Vision은 검증/예외 fallback으로 낮춤
- [x] Gemini API 역할을 만세력 계산이 아니라 MBTI/만세력 결과 기반 양방향 점수와 이유 생성으로 조정
- [x] 라이브러리 정확도 검증 리스크와 샘플 비교 기준을 문서에 반영

## 수정된 파일

| 파일 | 변경 내용 |
|---|---|
| `docs/product/moras-event-flow-spec.md` | 만세력 처리 방식을 `@fullstackfamily/manseryeok` 우선으로 변경 |
| `docs/project-plan.md` | 아키텍처, 데이터 모델, 구현 순서, 리스크 갱신 |
| `docs/product/moras-product-brief.md` | 제품 정의와 참가자 흐름 갱신 |
| `tasks/orders/2026-05/18/moras-use-node-manseryeok-library.md` | 작업 지시서 추가 |
| `tasks/index.md` | 작업 인덱스 업데이트 |

## 검증

실행한 확인:

```bash
rg -n "캡처 업로드 우선|Gemini Vision 추출 우선|@fullstackfamily/manseryeok|fallback|검증" docs/project-plan.md docs/product/moras-product-brief.md docs/product/moras-event-flow-spec.md
```

결과:

- “캡처 업로드 + Gemini Vision”이 MVP 1순위로 남아있는 문구는 제거됨.
- `@fullstackfamily/manseryeok` 기반 서버 측 계산이 MVP 1순위로 반영됨.
- 캡처 업로드는 fallback/검증 보조자료로만 남음.

## 발견된 이슈

- `@fullstackfamily/manseryeok`는 신생 라이브러리라 커뮤니티 검증이 강하지 않다.
- 포스텔러 등 외부 만세력 결과와 최소 20개 이상 샘플 비교가 필요하다.

## NStack 피드백

- 요구사항 변경이 생겼을 때 신규 스펙 문서를 기준으로 잡고, 프로젝트 계획/제품 브리프를 동기화하는 방식이 안정적이었다.
- LLMWiki 없이도 작업 지시서와 보고서만으로 변경 의도와 검증 결과가 추적 가능했다.

## 미완료 항목

- `@fullstackfamily/manseryeok` 설치 및 실제 계산 함수 구현
- 샘플 20개 기준 검증 데이터 작성
- Gemini 점수 생성 prompt/schema 설계
