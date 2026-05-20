# 완료 보고서: Moras MVP 인증 제거 반영

작성일: 2026-05-18 20:16:38 CDT  
작업 지시서: `tasks/orders/2026-05/18/moras-remove-auth-from-mvp-plan.md`  
LLMWiki: 임시 비활성

## 완료된 작업

- [x] Moras MVP에서 인증을 사용하지 않는다는 결정을 계획 문서에 반영
- [x] 운영자 화면을 별도 로그인 없는 공개 접근 전제로 변경
- [x] 권장 아키텍처에서 Supabase Auth/관리자 패스코드 항목 제거
- [x] 개인정보 원칙을 인증 없는 MVP에 맞춰 최소 수집과 민감정보 노출 최소화 중심으로 수정
- [x] 미정 사항에서 관리자 인증 방식 제거
- [x] 리스크 항목을 “인증 없는 운영자 화면” 기준으로 수정

## 수정된 파일

| 파일 | 변경 내용 |
|---|---|
| `docs/project-plan.md` | 인증/로그인/패스코드 전제 제거, 공개 접근 MVP 원칙 반영 |
| `docs/product/moras-product-brief.md` | 인증 없는 공개 웹앱 원칙 추가, 관리자 인증 미정 항목 제거 |
| `tasks/orders/2026-05/18/moras-remove-auth-from-mvp-plan.md` | 작업 지시서 추가 |
| `tasks/index.md` | 작업 인덱스 업데이트 |

## 검증

실행한 확인:

```bash
rg -n "인증|로그인|패스코드|접근 제한|Auth|관리자 접근" docs/project-plan.md docs/product/moras-product-brief.md
```

결과:

- Supabase Auth, 관리자 패스코드, 관리자 접근 제한을 권장하는 문구는 제거됨.
- 남은 “인증” 표현은 이번 결정 자체를 설명하거나 GitHub/Netlify 계정 인증 상태를 설명하는 문맥임.

## 발견된 이슈

- 인증이 없는 운영자 화면은 참가자 정보 노출 리스크가 있다.
- 문서에는 이를 MVP 의도에 맞춰 “공개 가능한 정보만 표시하고 민감정보 수집과 노출을 최소화”하는 방향으로 반영했다.

## NStack 피드백

- 간단한 문서 변경 작업에는 `작업 지시서 -> 구현 -> 검증 -> 완료 보고서` 흐름이 과하지 않게 적용 가능했다.
- LLMWiki를 임시 비활성으로 두니 첫 사이클 검증이 가벼워졌다.

## 미완료 항목

- 없음
