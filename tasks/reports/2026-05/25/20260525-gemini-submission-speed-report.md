# Completion Report: Gemini 신청 결과 속도 개선

## Summary

- 신청 직후 Gemini 분석을 긴 풀 리포트 우선 생성에서 빠른 요약 리포트 우선 생성으로 변경했다.
- 빠른 리포트는 `gemini-2.5-flash-lite`와 축소된 JSON 스키마를 사용한다.
- 빠른 리포트가 실패할 때만 기존 풀 리포트 경로로 폴백한다.
- 실패 상태 분석 카드는 공개 결과 화면에 표시하지 않도록 유지했다.

## Follow-up Correction

- 빠른 요약 리포트 방식은 기존 분석 품질을 훼손하므로 철회했다.
- 기존 긴 리포트 품질과 프롬프트는 복구했다.
- 대신 신청 API를 `/api/manse/start`와 `/api/manse/analyze`로 분리했다.
- `/api/manse/start`는 입력 검증, 중복 확인, 만세력 계산만 수행하고 빠르게 `analysisRequest`를 반환한다.
- `/api/manse/analyze`는 Gemini 긴 리포트 생성과 최종 신청 저장만 담당한다.
- 프론트는 신청 화면에 머무르며 애니메이션을 보여주고, 리포트가 완성된 경우에만 결과 화면으로 이동한다.
- 분석 실패 또는 timeout 시 입력값은 유지되고 신청자는 다시 신청 버튼을 눌러 재시도할 수 있다.

## Changed Files

- `scripts/moras/gemini.js`
- `scripts/moras/pages/participant-page.js`
- `tasks/orders/2026-05/25/20260525-gemini-submission-speed.md`

## Verification

- 실제 Gemini 호출 경로 측정: `3653ms`, `status=ok`, `model=gemini-2.5-flash-lite`
- `node --check scripts/moras/gemini.js`
- `node --check scripts/moras/manse-service.js`
- `node --check scripts/moras/pages/participant-page.js`
- `npm run build:netlify`
- Production deploy complete: `https://6a148bec2cfcdbacf4c159dc--moras-event-matching.netlify.app`
- Production `/health`: `{"ok":true}`
- Netlify production env에서 `GEMINI_FAST_MODEL` 존재 확인
- Follow-up production deploy: `https://6a149981ad367b04f2793d5c--moras-event-matching.netlify.app`
- Production `/api/manse/start` smoke test: `200`, `280ms`, `analysisRequest=true`, `pending`

## Notes

- 기존에 저장된 긴 리포트/실패 리포트 데이터는 자동으로 재작성하지 않는다.
- 더 큰 속도 개선은 신청 저장과 Gemini 분석을 완전히 분리하는 비동기 큐/재분석 구조가 필요하다.

## LLMWiki

temporarily disabled
