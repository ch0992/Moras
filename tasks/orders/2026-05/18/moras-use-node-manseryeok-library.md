# 작업 지시서: Node.js 만세력 라이브러리 사용 결정 반영

작성일: 2026-05-18 20:47:09 CDT  
작업 유형: 제품/아키텍처 스펙 변경  
LLMWiki: 임시 비활성

## 배경

Moras MVP에서 사용자가 포스텔러 캡처를 업로드하는 방식보다, 생년월일시를 입력받아 Node.js/TypeScript 라이브러리로 만세력을 직접 계산하는 방향이 더 단순하고 자연스럽다고 판단했다.

후보 라이브러리 `@fullstackfamily/manseryeok`는 커뮤니티 검증은 크지 않지만 TypeScript 기반, MIT 라이선스, KASI 데이터 기반, 최근 수정 이력이 있어 MVP에서 검증하며 사용할 후보로 정한다.

## 목표

문서에서 만세력 처리 1순위를 “캡처 업로드 + Gemini Vision”에서 “생년월일시 입력 + `@fullstackfamily/manseryeok` 서버 측 계산”으로 변경한다.

## 수정 대상

- `docs/product/moras-event-flow-spec.md`
- `docs/project-plan.md`
- `docs/product/moras-product-brief.md`

## 작업 내용

1. 참가자 입력 흐름에서 만세력 캡처 필수 업로드를 제거한다.
2. 생년월일시, 양력/음력, 출생 지역/경도 옵션을 입력받아 만세력을 계산하도록 정리한다.
3. `@fullstackfamily/manseryeok`를 MVP 1순위 만세력 계산 라이브러리로 명시한다.
4. 포스텔러 캡처 업로드와 Gemini Vision은 검증/대체용 fallback으로 낮춘다.
5. Gemini API의 역할을 만세력 계산이 아니라 MBTI/사주 결과 기반 상호 점수와 이유 생성으로 조정한다.
6. 검증 리스크에 라이브러리 정확도 검증을 추가한다.

## 완료 기준

- 문서상 MVP 1순위 만세력 방식이 Node.js 라이브러리 기반 자체 계산으로 바뀐다.
- 캡처 업로드는 필수가 아닌 fallback으로 정리된다.
- `@fullstackfamily/manseryeok` 검증 필요성이 명시된다.
- LLMWiki는 실행하지 않고 `LLMWiki: 임시 비활성`으로 보고한다.
