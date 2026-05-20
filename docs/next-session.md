# Next Session 인계 파일
> 작성일: 2026-05-19

## 현재 상태 요약

### 배포된 서비스
- **URL:** https://moras-event-matching.netlify.app
- **플랫폼:** Netlify (프로젝트명: moras-event-matching)
- **repo:** https://github.com/yeonggyuchoi-usa/Moras
- **branch:** main (최신 커밋: `bf1fd23`)

### 오늘 완료한 작업
1. **개인정보 default값 제거** (`scripts/manse-web.js`)
   - 이름 `value="최영규"` 제거
   - 생년월일 `value="1982-01-21"` 제거
   - 출생시간 `value="15:20"` 제거
2. **버튼 텍스트 변경**: `저장하고 만세력 조회` → `만세력 조회`
3. **안내 문구 변경** (`buildViewModel`의 `notice` 필드):
   - 기존: "입력한 생년월일시, 출생지, MBTI, 만세력 결과는 관리자 검수와 매칭 계산을 위해 저장됩니다."
   - 변경: "MBTI, 만세력 결과는 관리자 검수와 매칭 계산을 위해 저장됩니다."
4. **프로덕션 배포 완료** (`netlify deploy --prod`)

### 파일 구조 핵심
```
Moras/
├── scripts/manse-web.js     ← 메인 서버 + HTML 페이지 (모두 여기에)
├── netlify/functions/moras.mjs  ← Netlify Function 진입점
├── netlify-build/functions/ ← 빌드 결과물
├── netlify.toml             ← Netlify 설정
└── public/index.html        ← 정적 fallback (내용 없음)
```

### 알려진 사항
- `scripts/manse-web.js`에 `upcomingEventPage` 함수가 추가된 것으로 보임 (module.exports에 포함됨) — 아직 라우팅 미연결 상태일 수 있음
- 관리자 페이지: https://moras-event-matching.netlify.app/admin
- Supabase 연동 설정 시 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 환경변수 필요

## 다음 세션에서 할 일 (미확인)
- `upcomingEventPage` 라우팅 연결 여부 확인
- 추가 UI/기능 작업 지시 대기
