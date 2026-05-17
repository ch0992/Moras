# Moras LLMWiki 운영 정책

## 목적

Moras의 LLMWiki는 두 가지 목적을 가진다.

1. Moras 제품 개발 지식과 의사결정을 축적한다.
2. Moras가 NStack 파일럿 애플리케이션으로서 지시서, 보고서, 검증, 지식화 흐름을 제대로 수행하는지 증거를 남긴다.

문서가 어떤 경로와 저장소를 거쳐 통합되는지는 [Moras 문서 통합 플로우](./llmwiki-document-flow.md)를 기준으로 한다.

## 저장소에 커밋하는 것

GitHub private repo에는 사람이 작성한 원천 지식과 설정만 커밋한다.

| 경로 | 커밋 여부 | 이유 |
|---|---|---|
| `llmwiki/content/` | 커밋 | 사람이 작성한 지식 원본 |
| `llmwiki/swarmvault.config.json` | 커밋 | vault 재현에 필요한 설정 |
| `llmwiki/swarmvault.schema.md` | 커밋 | Moras 지식 구조 규칙 |
| `llmwiki/wiki/` | 제외 | SwarmVault가 생성하는 출력물 |
| `llmwiki/raw/` | 제외 | ingest 과정에서 생성되는 중간 원본 |
| `llmwiki/state/` | 제외 | graph, retrieval, session 등 로컬 상태 |

## 현재 커밋된 LLMWiki 소스

| 문서 | 역할 |
|---|---|
| `llmwiki/content/readiness-test.md` | NStack/SwarmVault 준비성 테스트 |
| `llmwiki/content/01-Logs/tasks/2026-05-16-moras-product-definition.md` | Moras 제품 정의 |
| `llmwiki/content/01-Logs/tasks/2026-05-16-moras-project-plan.md` | Moras 프로젝트 계획과 NStack 파일럿 기준 |

## 작업 후 기록 원칙

중요 작업이 끝나면 다음 중 하나를 수행한다.

- 새 LLMWiki 문서를 `llmwiki/content/01-Logs/tasks/` 아래에 작성한다.
- 이미 같은 내용이 존재하면 기존 문서를 업데이트한다.
- 지식화가 필요 없으면 보고서에 skip 사유를 명시한다.

각 문서에는 다음 내용을 포함하는 것을 권장한다.

- 작업 배경
- 결정 사항
- 구현 또는 검증 결과
- 다음 작업에 필요한 맥락
- NStack 파일럿 관점의 발견점

## 로컬 검증 절차

LLMWiki 변경 후 다음 명령으로 검증한다.

```bash
cd /Users/yg/workspace/Moras/llmwiki
swarmvault ingest content/01-Logs/tasks/{문서명}.md --no-guide
swarmvault compile
swarmvault doctor
swarmvault query "{확인할 질문}"
```

검증 기준:

- ingest가 source id를 반환한다.
- compile이 성공한다.
- doctor에서 graph와 retrieval이 OK여야 한다.
- query 결과에 방금 작성한 문서가 검색되어야 한다.

candidate review warning은 현재 허용한다. 이는 SwarmVault가 생성한 후보 concept/entity 검토가 남아 있다는 의미이며, 기능 실패는 아니다.

## upstream NSoft-LLMWiki 통합 정책

Moras 로컬 repo는 개인 private repo로 유지한다.

NSoft 통합 지식체계에 반영하는 것을 기본값으로 한다. 단, 개인정보, 참가자 데이터, 비밀값, 민감한 운영 정보는 그대로 반영하지 않는다.

통합 흐름은 다음과 같다.

1. Moras 로컬 `llmwiki/content/`에 먼저 기록한다.
2. 로컬 ingest/compile/query로 검증한다.
3. upstream `NSoft-LLMWiki` 임시 sparse checkout에서 같은 문서를 테스트한다.
4. 통합 검색에서 기존 NStack/Graphify/LLMWiki 문서와 함께 잡히는지 확인한다.
5. 민감 정보가 없거나 정제된 문서만 upstream에 별도 PR 또는 push로 반영한다.

주의:

- Moras private repo 전체를 upstream LLMWiki에 병합하지 않는다.
- 개인정보, 참가자 데이터, 민감한 운영 정보는 upstream에 올리지 않는다.
- 민감 정보가 섞인 작업 문서는 정제본을 만들어 통합한다.
- 정제해도 통합할 수 없는 경우 완료 보고서에 skip 사유를 명시한다.
- upstream ingest 중 기존 문서 frontmatter 오류가 발견될 수 있다. 이는 Moras 통합 실패와 구분해서 기록한다.

## NStack 파일럿 검증 항목

LLMWiki 관점에서 Moras는 다음을 검증한다.

- 새 프로젝트의 지식 원본 구조가 재현 가능한가
- SwarmVault ingest/compile/query가 매 작업 후 안정적으로 동작하는가
- 생성물과 원천 문서를 명확히 분리할 수 있는가
- 작업 보고서와 지식 문서가 다음 구현에 실제로 도움이 되는가
- upstream 통합 시 어떤 품질 문제가 드러나는가
