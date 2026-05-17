# Moras 문서 통합 플로우

## 요약

Moras의 문서는 제품 개발 문서, NStack 작업 문서, LLMWiki 지식 원본, SwarmVault 생성물, upstream 통합 후보로 구분한다.

사람이 작성한 원천 문서는 Moras private repo `https://github.com/yeonggyuchoi-usa/Moras`에 커밋한다. SwarmVault가 생성하는 `llmwiki/wiki/`, `llmwiki/raw/`, `llmwiki/state/`는 로컬 생성물로 제외한다.

NStack 기반 프로젝트의 작업 문서는 최종적으로 통합 LLMWiki인 `NSoft-America-Inc/NSoft-LLMWiki`에 모이는 것을 기본값으로 한다. 단, 개인정보, 비밀값, 민감한 운영 정보는 정제하거나 제외한다.

## 주요 대상

- Moras 로컬 작업 폴더: `/Users/yg/workspace/Moras`
- Moras private GitHub repo: `https://github.com/yeonggyuchoi-usa/Moras`
- Moras 로컬 LLMWiki: `/Users/yg/workspace/Moras/llmwiki`
- upstream 통합 LLMWiki repo: `NSoft-America-Inc/NSoft-LLMWiki`
- upstream 임시 테스트 checkout: `/private/tmp/moras-llmwiki-upstream-test`

## 문서 종류

- 제품 브리프: `docs/product/`
- 프로젝트 계획과 정책: `docs/`
- 작업 지시서: `tasks/orders/`
- 완료 보고서: `tasks/reports/`
- LLMWiki 지식 원본: `llmwiki/content/01-Logs/tasks/`
- 홍보 자산: `assets/marketing/`
- SwarmVault 생성물: `llmwiki/wiki/`, `llmwiki/raw/`, `llmwiki/state/`

## NStack 표준 3파일 세트

- 지시서: `content/01-Logs/archive/YYYY-MM/{slug}/order.md`
- 완료 보고서: `content/01-Logs/archive/YYYY-MM/{slug}/report.md`
- 작업 지식 문서: `content/01-Logs/tasks/YYYY-MM-DD-{slug}.md`

## 통합 원칙

- 각 프로젝트의 공유 가능한 작업 지식은 upstream `NSoft-LLMWiki`에 통합한다.
- 민감 정보, 참가자 데이터, 비밀값은 upstream에 반영하지 않는다.
- 민감 정보가 포함된 문서는 정제본을 만들어 통합한다.
- upstream 반영 전 임시 checkout에서 ingest, compile, query를 검증한다.
- LLMWiki 검증 명령은 병렬 실행하지 않고 `ingest -> compile -> doctor -> query` 순서로 실행한다.
