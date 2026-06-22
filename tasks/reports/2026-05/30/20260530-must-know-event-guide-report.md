# 2026-05-30 Moras 필독안내 페이지 완료 보고

## 구현 결과

- `/must-know` 필독안내 페이지를 추가했다.
- 헤더 메뉴의 가장 왼쪽에 `필독안내` 링크를 추가했다.
- 페이지 본문에 다음 내용을 간결하게 구성했다.
  - 썸/친목 분리 진행
  - 참가자가 해야 할 두 가지 행동
  - 신청, 매칭 결과 공개, 썸 투표, 상호 매칭 확인 프로세스
  - 룰렛 이벤트 참가 조건과 특별 상품 안내
- 하윤 대신 빛나, 밀라 안내 캐릭터 카드를 사용했다.
- Netlify 함수 라우팅과 로컬 서버 라우팅에 `/must-know`를 연결했다.
- 안내문과 기존 CTA 잠금 시간이 어긋나지 않도록 이벤트 오픈 시각을 `2026-05-31T16:00:00Z`로 동기화했다.

## 검증

- `node -e`로 `mustKnowPage()` 렌더 결과에 `필독안내`, `빛나`, `밀라`, `6월 1일 01:00(KST)`가 포함되는지 확인했다.
- 로컬 서버 `http://localhost:4173/must-know`에서 필수 문구와 헤더 첫 링크 노출을 확인했다.
- `npm run build:netlify` 성공.
- `npx netlify deploy --prod --build` 성공.
- 프로덕션 `https://moras-event-matching.netlify.app/must-know` HTTP 200 확인.
- 프로덕션 HTML에서 `필독안내`, `빛나`, `밀라`, `6월 1일 01:00(KST)` 및 왼쪽 첫 메뉴 순서 확인.
- `2026-05-31T16:00:00Z`가 `5월 31일 11:00(CDT) / 6월 1일 01:00(KST)`에 해당함을 확인했다.

## 배포

- Production URL: `https://moras-event-matching.netlify.app`
- Unique deploy URL: `https://6a1b8ecb7c3f69cf146d3705--moras-event-matching.netlify.app`

## NStack 피드백

- 기존 안내 페이지들이 헤더 마크업을 중복 보유하고 있어 메뉴 추가 시 여러 파일을 동시에 수정해야 했다.
- 이벤트 직전 운영성 변경이 잦은 영역이므로, 추후 공통 헤더 렌더러로 분리하면 실수 가능성을 낮출 수 있다.

## LLMWiki

- temporarily disabled
