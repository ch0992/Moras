# Moras 문서 통합 플로우

## 요약

Moras의 문서는 제품 개발 문서, NStack 작업 문서, LLMWiki 지식 원본, SwarmVault 생성물, upstream 통합 후보로 구분한다.

사람이 작성한 원천 문서는 Moras private repo `https://github.com/yeonggyuchoi-usa/Moras`에 커밋한다. SwarmVault가 생성하는 `llmwiki/wiki/`, `llmwiki/raw/`, `llmwiki/state/`는 로컬 생성물로 제외한다.

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

## 통합 원칙

- 민감 정보, 참가자 데이터, 비밀값은 upstream에 반영하지 않는다.
- 공유 가능한 지식만 upstream `NSoft-LLMWiki`에 선별 반영한다.
- upstream 반영 전 임시 checkout에서 ingest, compile, query를 검증한다.
- LLMWiki 검증 명령은 병렬 실행하지 않고 `ingest -> compile -> doctor -> query` 순서로 실행한다.
