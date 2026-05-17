# Moras External Services Connection Check <br> Moras 외부 서비스 연결 점검

**Date:** 2026-05-16  
**Scope:** Supabase, Netlify, local Moras configuration  
**Mode:** Read-only check

## Summary / 요약

Supabase and Netlify plugin authentication are both working.
Supabase와 Netlify 플러그인 인증은 모두 정상 동작한다.

Moras-specific Supabase project has now been created. Moras-specific Netlify project has not been created yet.
Moras 전용 Supabase 프로젝트는 생성 완료되었다. Moras 전용 Netlify 프로젝트는 아직 생성 전이다.

## Supabase / Supabase 연결

| Check | Result |
|---|---|
| Authentication | OK |
| Organizations | 1 organization found |
| Organization | `yeonggyuchoi` (`pgttghcnxhjtgjsqivup`) |
| Plan | Free |
| Existing projects | `Scanio_Prod`, `Scanio_Dev` |
| Moras project | Created |

Existing Supabase projects:

| Project | ID | Region | Status | Database |
|---|---|---|---|---|
| Scanio_Prod | `flanoqbbwiguqyemozit` | `us-east-1` | `INACTIVE` | Postgres 17 |
| Scanio_Dev | `zeedygjxtsobzmycbfcs` | `us-east-2` | `INACTIVE` | Postgres 17 |
| Moras | `xzlwcfmdbjxhiycywtmi` | `us-east-2` | `ACTIVE_HEALTHY` | Postgres 17 |

DB-level checks for tables and migrations timed out because both existing projects are inactive.
기존 프로젝트 2개는 `INACTIVE` 상태라 table/migration 조회가 database connection timeout으로 실패했다.

Edge Functions:

- `Scanio_Prod`: none
- `Scanio_Dev`: none
- `Moras`: none

Moras Supabase details:

| Item | Value |
|---|---|
| Project ID | `xzlwcfmdbjxhiycywtmi` |
| API URL | `https://xzlwcfmdbjxhiycywtmi.supabase.co` |
| Region | `us-east-2` |
| Status | `ACTIVE_HEALTHY` |
| Public schema tables | none yet |
| Migrations | none yet |
| Publishable key | available |
| Security advisors | no lints |
| Performance advisors | no lints |

## Netlify / Netlify 연결

| Check | Result |
|---|---|
| Authentication | OK |
| User email | `ktma82@gmail.com` |
| Team | `ktma82's team` |
| Team slug | `ktma82` |
| Plan | Free |
| Moras project search | Not found |

Existing Netlify project:

| Project | Site ID | URL | Deploy State | Forms |
|---|---|---|---|---|
| `unrivaled-muffin-c302d6` | `21e2118e-bad9-41aa-a49e-252f3dcf4bf6` | `http://unrivaled-muffin-c302d6.netlify.app` | ready | not enabled |

## Local Config / 로컬 설정

No local app or deployment configuration exists yet.
아직 Moras 로컬에는 앱/배포 설정 파일이 없다.

Checked for:

- `package.json`
- `netlify.toml`
- `.env*`
- `supabase/**`
- `next.config.*`
- `vite.config.*`

No files were found.

## Readiness Verdict / 준비성 판정

Moras can proceed with Netlify + Supabase architecture. A Moras-specific Supabase project is ready; a Moras-specific Netlify project should be created when the app is scaffolded.

Moras는 Netlify + Supabase 아키텍처로 진행 가능하다. Moras 전용 Supabase 프로젝트는 준비되었고, Moras 전용 Netlify 프로젝트는 앱 스캐폴딩 후 생성하는 것이 좋다.

Recommended next infrastructure steps:

1. Scaffold the web app locally.
2. Create or link a new Netlify project for Moras.
3. Add Supabase environment variables.
4. Design and apply the first Moras database migration.
