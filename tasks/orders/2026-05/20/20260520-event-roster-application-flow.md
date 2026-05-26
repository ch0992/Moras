# 2026-05-20 Moras event roster application flow

## Socratic Dialogue

- User request: 이벤트 신청자 목록에 남녀 카운트를 추가하고, 전체 참가자 명단을 관리자 페이지에서 관리하며, 신청 화면은 명단 선택 기반으로 바꾼다.
- AI Recommendation: 명단 선택은 프론트에서 편의 제공, 서버에서 필수 검증, DB에서 unique index로 중복 방지까지 3단으로 처리한다.
- User Answer: 진행하자.
- Decision: 공개 신청은 `event_participants` 명단 ID를 기준으로 접수하고, 이름/성별은 명단에서 자동 입력한다. 삭제는 신청 이력 보호를 위해 비활성 처리한다.

## Scope

- 공개 신청 폼에 참가자 검색/선택과 이름/성별 자동 입력 추가.
- 신청자 목록에 총 신청 수, 남자 수, 여자 수 표시.
- 관리자 페이지에 전체 참가자 명단 CRUD 탭 추가.
- Supabase `event_participants` 테이블과 `participant_submissions.roster_participant_id` 중복 방지 인덱스 추가.
- 이미지에서 확인한 참가자 46명을 명단에 시드한다.

## Out of Scope

- 실제 운영 신청 데이터 삭제.
- 매칭 알고리즘 변경.
- LLMWiki/SwarmVault 기록.

## Verification

- `node --check` for touched JS modules.
- `/api/roster`, `/api/applicants`, `/api/admin/roster` local curl checks.
- Supabase SQL count check for active roster and gender totals.
- `npm run build:netlify`.

## LLMWiki

temporarily disabled
