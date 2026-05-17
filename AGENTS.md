# Moras 에이전트 지침

## graphify

- **graphify** (`~/.Codex/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
- When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

## NStack 지식 탐색

이 프로젝트는 `/Users/yg/workspace/NStack`을 기준으로 초기화되었고 NStack workflow baseline을 따른다.

Moras는 제품 개발 프로젝트이면서 NStack 검증용 파일럿 애플리케이션이다. 모든 주요 작업은 기능 구현 결과와 함께 NStack 흐름 자체의 유효성도 남겨야 한다.

### SwarmVault Vault

| Vault | 위치 | 대상 | 용도 |
|---|---|---|---|
| LLMWiki vault | `llmwiki/` | `content/` | Knowledge, docs, task history |
| Project vault | project root | Code files | Code structure and symbol search |

규칙:

- 아키텍처나 코드베이스 질문에 답하기 전 `llmwiki/wiki/graph/report.md`가 있으면 먼저 읽고, 없으면 `llmwiki/wiki/index.md`에서 시작한다.
- 작업 히스토리, 의사결정, 버그 패턴은 vault가 빌드되어 있을 때 `cd llmwiki && swarmvault query "{keyword}"`로 찾는다.
- 코드 구조는 project vault가 빌드되어 있을 때 프로젝트 루트에서 `swarmvault graph query "{keyword}"`로 찾는다.
- 의미 있는 코드 변경 후 SwarmVault indexing이 활성화되어 있으면 `swarmvault ingest .`를 실행한다.

## 코딩 행동 원칙

- **구현 전 사고**: 애매한 부분과 tradeoff를 먼저 정리한다.
- **단순성 우선**: 요청 문제를 해결하는 가장 작은 durable change를 선호한다.
- **외과적 변경**: 작업과 관련된 파일만 수정하고 기존 스타일을 유지한다.
- **목표 기반 실행**: 성공 기준을 정하고 검증한 뒤 보고한다.

## 제품 맥락

Moras는 오픈채팅 커뮤니티 이벤트용 웹 애플리케이션이다.

- 목적: MBTI와 사주 기반 궁합 점수로 남녀 참가자를 매칭한다.
- 톤: 재미있고 상징적이며 이벤트 친화적으로 유지한다. 운명에 대한 결정론적 표현은 피한다.
- 참가자 흐름: 이벤트 접속, 프로필 입력, MBTI 선택, 사주 관련 출생 정보 입력, 동의, 제출.
- 운영자 흐름: 참가자 검토, 점수 계산, 점수 상세 확인, 최종 매칭 확정.
- 제품 브리프: `docs/product/moras-product-brief.md`.
- 프로젝트 계획: `docs/project-plan.md`.

## NStack 파일럿 검증 기준

각 주요 작업은 다음을 남기는 것을 원칙으로 한다.

- 작업 전 지시서
- 구현 결과
- 실행한 검증
- 완료 보고서
- LLMWiki 지식 기록 또는 명시적 skip 사유
- NStack 흐름에서 발견한 개선점
