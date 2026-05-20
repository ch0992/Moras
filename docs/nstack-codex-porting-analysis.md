# NStack Antigravity 자산의 Codex 전환 분석

작성일: 2026-05-18  
대상 프로젝트: Moras  
기준 NStack: `/Users/yg/workspace/NStack`

## 1. 목적

Moras는 제품 개발 프로젝트이면서 NStack 검증용 파일럿 애플리케이션이다. 따라서 Moras에서 Codex를 사용할 때도 NStack의 핵심 흐름이 유지되어야 한다.

이번 분석의 목적은 NStack에 이미 구성된 Antigravity용 `skill`, `workflow`, `rule`을 확인하고, Codex에서 어떤 형태로 옮겨야 하는지 결정하는 것이다.

현재 한 사이클 테스트에서는 LLMWiki/SwarmVault 연동을 임시 비활성으로 둔다. 관련 스킬과 workflow는 placeholder로 유지하되, 사용자가 재연결을 명시하기 전까지 실행하지 않는다.

## 2. Antigravity 구성 모델

Google Antigravity 공식 Codelab 기준으로 Antigravity의 커스터마이징 단위는 다음과 같다.

| 구분 | 역할 | 스코프 | 위치 |
|---|---|---|---|
| Rule | 에이전트의 상시 행동 기준. 시스템 지침에 가까움 | Global | `~/.gemini/GEMINI.md` |
| Rule | 특정 워크스페이스의 상시 행동 기준 | Workspace | `<workspace>/.agents/rules/` |
| Workflow | 사용자가 `/`로 호출하는 저장된 절차 프롬프트 | Global | `~/.gemini/antigravity/global_workflows/*.md` |
| Workflow | 특정 워크스페이스의 호출형 절차 | Workspace | `<workspace>/.agents/workflows/` |
| Skill | 요청이 description과 맞을 때 로딩되는 전문 지식/절차 패키지 | Global | `~/.gemini/antigravity/skills/<skill>/SKILL.md` |
| Skill | 특정 워크스페이스 전용 전문 지식/절차 패키지 | Workspace | `<workspace>/.agents/skills/<skill>/SKILL.md` |

사용자가 말한 “Antigravity rule 두 종류”는 실무적으로 `Global Rule`과 `Workspace Rule`로 해석하는 것이 맞다. NStack은 프로젝트별 표준을 강제해야 하므로 주 대상은 Workspace Rule이다.

## 3. NStack에서 확인된 Antigravity 자산

### 3.1 Rules

| 파일/폴더 | 상태 | 의미 |
|---|---|---|
| `/Users/yg/workspace/NStack/.antigravity/rules` | 존재하지만 비정상적으로 큼, 약 101GB | 구버전 또는 별도 방식의 Antigravity 룰 번들로 보임. 전체 복사 금지 |
| `/Users/yg/workspace/NStack/.agents/rules/swarmvault.md` | 정상 | 공식 Codelab 경로와 맞는 Workspace Rule |
| `/Users/yg/workspace/NStack/AGENTS.md` | 정상 | Codex/Claude 계열에서 읽기 쉬운 저장소 지침 |
| `/Users/yg/workspace/NStack/.claude/rules.md` | 정상 | Claude 전용 rule mirror |

중요 판단:

- `.antigravity/rules`는 `setup` 스크립트가 그대로 읽어 대상 프로젝트에 붙이는 구조인데, 현재 원본 크기가 비정상적이다.
- Codex 전환에서는 `.antigravity/rules`를 직접 신뢰하지 않고, 안전하게 읽은 앞부분과 `AGENTS.md`, `.agents/rules/swarmvault.md`, `docs/flows/*`를 기준으로 룰을 재구성해야 한다.
- Moras에는 이미 `AGENTS.md`가 존재하며 NStack 지식 탐색, SwarmVault, Moras 제품 맥락, NStack 파일럿 검증 기준이 들어가 있다.

### 3.2 Workflows

| 파일 | 역할 |
|---|---|
| `/Users/yg/workspace/NStack/.agents/workflows/swarmvault.md` | `swarmvault init/ingest/compile/query/lint` 절차를 `/swarmvault` 호출형 워크플로우로 정의 |
| `/Users/yg/workspace/NStack/docs/skills/workflow-antigravity.md` | Antigravity 단독 개발 플로우 설명 |
| `/Users/yg/workspace/NStack/docs/skills/workflow-combined.md` | Claude + Antigravity 협업 플로우 설명 |
| `/Users/yg/workspace/NStack/docs/flows/*.md` | NStack 전체 표준 플로우 문서 |

Codex에는 Antigravity식 `.agents/workflows/*.md` slash workflow가 그대로 자동 호출되는 모델이 아니다. Codex에서는 워크플로우를 다음 둘 중 하나로 바꾸는 것이 자연스럽다.

- 상시 프로젝트 지침: `AGENTS.md`
- 필요 시 로딩되는 절차: `.agents/skills/<skill>/SKILL.md`

### 3.3 Skills

NStack의 주요 스킬은 `/Users/yg/workspace/NStack/.agents/skills/nsoft/*/SKILL.md`에 있다. Moras에는 `/Users/yg/workspace/Moras/.agents/skills/nsoft`가 연결되어 있어 현재 Codex 세션에서도 NStack 스킬이 일부 인식된다.

| 스킬 | 현재 의도 | Codex 전환 판단 |
|---|---|---|
| `task` | 지시서 작성, 승인, 이슈 생성, 구현, 보고, 아카이브 | Codex용 핵심 스킬로 유지하되 Codex 직접 구현 방식에 맞춰 문구 조정 필요 |
| `task-auto` | 승인 없이 지시서부터 구현까지 연속 실행 | 위험도가 있으므로 Codex에서는 명시 요청 시에만 |
| `scope` | 구현 전 범위 검증 | 유지 |
| `investigate` | 버그 근본 원인 분석 | 유지 |
| `qa` | 테스트 명세 생성 | 유지 |
| `ship` | 정적 분석, diff review, PR/배포 | 유지 |
| `workflow` | Git 브랜치, 커밋, 롤백 규칙 | 유지하되 Codex 브랜치 prefix 정책과 조정 필요 |
| `llmwiki-writer` | 작업 결과를 LLMWiki 지식으로 자산화 | 현재 한 사이클 테스트에서는 임시 비활성 |
| `retro` | 회고 후 rule/skill 개선 제안 | 유지 |
| `harness` | 멀티 에이전트 분리 실행 | Codex에서는 사용자가 명시적으로 하위 에이전트/병렬 에이전트를 요청할 때만 |
| `devlog-writer` | 개발 일지 작성 | 유지 |
| `noffice-writer` | 공식 업무일지 작성 | 유지 |
| `next-session-writer` | 다음 세션 인계 작성 | 유지 |
| `github-issue-*` | GitHub 이슈 작성/운영 | 유지 |
| `antigravity-workflow` | Codex 계획 + Antigravity 실행 협업 | Codex 전용으로는 직접 사용하지 않고 `codex-task-flow`로 재해석 |
| `plan`, `review` | Claude/Antigravity 조합에서 설계/검수 | Codex에선 `task`, `ship`, code review 응답 규칙으로 흡수 가능 |

## 4. Codex 대응 모델

Codex에서 NStack을 적용할 때의 대응 관계는 다음과 같다.

| Antigravity 개념 | NStack 파일 | Codex 대응 |
|---|---|---|
| Global Rule | `~/.gemini/GEMINI.md` | 개인/전역 Codex 지침. 이번 Moras repo에는 직접 추가하지 않음 |
| Workspace Rule | `.agents/rules/*.md`, `.antigravity/rules` | `.codex/rules/*.md`에 Codex 전용 원본을 두고 `AGENTS.md`에서 참조 |
| Workspace Workflow | `.agents/workflows/*.md` | `.codex/workflows/*.md` 또는 `.codex/skills/*/SKILL.md`로 변환 |
| Workspace Skill | `.agents/skills/*/SKILL.md` | 기존 호환으로 유지하되 Codex 전용 신규 스킬은 `.codex/skills`에 작성 |
| Hook | `.codex/hooks.json` | 선택적. SwarmVault graph-first 힌트처럼 안전한 read-only hook만 사용 |
| Artifacts/Walkthrough | Antigravity 완료 보고 | `tasks/reports/YYYY-MM/DD/*.md` + 최종 응답 + 검증 로그로 대체 |

## 5. Codex 전환 시 핵심 리스크

| 리스크 | 내용 | 대응 |
|---|---|---|
| 비정상 `.antigravity/rules` | NStack 원본 파일이 약 101GB로 확인됨 | 직접 복사 금지. 정상 문서와 샘플만 기준으로 재작성 |
| 승인 게이트 충돌 | Antigravity 룰은 “승인 전 구현 금지”가 강하지만 Codex 기본 작업 방식은 요청받으면 실행 | Moras에서는 큰 작업은 지시서/승인, 작은 명시 요청은 직접 실행으로 운영 원칙 명확화 |
| 하네스 충돌 | NStack harness는 멀티 에이전트 분리 실행을 전제 | Codex에서는 사용자가 명시적으로 하위 에이전트 작업을 요청할 때만 활성화 |
| Git 브랜치 규칙 차이 | NStack은 `feat/`, Codex 앱은 기본 `codex/` prefix 선호 | Moras용 workflow에 `codex/{type}-{slug}` 또는 사용자 지정 브랜치 정책 명시 필요 |
| LLMWiki 경로 불일치 | NStack 문서 일부는 archive 경로가 서로 다르게 설명됨 | Moras의 `docs/llmwiki-document-flow.md`를 기준으로 통일 |
| 민감 정보 | Moras 참가자 정보, 생년월일, 연락처 등이 LLMWiki로 올라갈 수 있음 | LLMWiki에는 비식별/요약/설계 지식만 업스트림 |

## 6. Moras에 우선 적용할 Codex 스킬 후보

### 6.1 `nstack-codex-task`

역할:

- Moras에서 기능 요청이 들어오면 범위 확인, 작업 지시서 작성, 구현, 검증, 보고서, LLMWiki 기록까지 하나의 Codex 실행 흐름으로 관리한다.

핵심 차이:

- Antigravity에게 넘기는 지시서가 아니라 Codex가 직접 실행할 수 있는 지시서가 되어야 한다.
- 사용자 승인 게이트는 위험도에 따라 적용한다.

### 6.2 `nstack-codex-llmwiki` — 임시 비활성

역할:

- 추후 LLMWiki를 다시 연결할 때 작업 지시서, 완료 보고서, 지식 문서를 Moras 로컬 `llmwiki/content/`에 기록하고, 검증 후 통합 LLMWiki repo `NSoft-America-Inc/NSoft-LLMWiki`로 보낼 준비를 한다.
- 현재 한 사이클 테스트에서는 실행하지 않고 완료 보고서에 `LLMWiki: 임시 비활성`만 남긴다.

필수 정책:

- 참가자 개인정보와 이벤트 운영 민감 정보는 업스트림 금지.
- 문서화 skip은 명시 사유를 남긴다.

### 6.3 `nstack-codex-ship`

역할:

- 정적 분석, 테스트, diff 검토, Netlify/Supabase 관련 검증, GitHub push/PR 준비를 Codex 방식으로 수행한다.

### 6.4 `nstack-codex-retro`

역할:

- Moras 개발 과정에서 반복되는 문제를 NStack 개선 제안으로 바꾼다.
- 개선 제안은 LLMWiki와 NStack repo 양쪽에 남길 수 있어야 한다.

## 7. 권장 구현 순서

1. **분석 문서 확정**
   - 이 문서를 기준으로 “Codex 전환 범위”를 사용자와 합의한다.
2. **Moras `AGENTS.md` 보강**
   - 이미 존재하는 NStack 지침에 Codex 전용 실행 원칙을 추가한다.
3. **Codex용 핵심 스킬 세트 작성**
   - `nstack-codex-task`
   - `nstack-codex-llmwiki`
   - `nstack-codex-github`
   - `nstack-codex-workflow`
   - `nstack-codex-ship`
   - `nstack-codex-retro`
   - `nstack-codex-handoff`
   - `nstack-codex-devlog`
   - `nstack-codex-noffice`
   - `nstack-codex-scope`
   - `nstack-codex-qa`
   - `nstack-codex-investigate`
   - `nstack-codex-harness`
4. **기존 NStack 스킬과 충돌 점검**
   - `task`, `llmwiki-writer`, `ship`, `workflow`, `harness`의 설명이 Codex 세션에서 오작동하지 않는지 확인한다.
5. **Moras 파일럿 태스크로 검증**
   - 예: “Moras MVP 요구사항 정의 → 작업지시서 → 구현 준비 → 보고서 → LLMWiki 기록”까지 dry run.
6. **NStack 개선 피드백 생성**
   - `.antigravity/rules` 비정상 크기
   - setup의 `.antigravity/rules` 복사 방식
   - Codex/Antigravity/Claude별 설치 산출물 분리 필요

## 8. 현재 결론

Moras는 이미 NStack 기반 프로젝트로 초기화되어 있고, Codex에서도 NStack 스킬 일부가 인식된다. 그러나 Antigravity 자산을 그대로 쓰기에는 다음 문제가 있다.

- Antigravity 전용 승인/실행 모델이 Codex의 직접 구현 모델과 다르다.
- `.antigravity/rules` 원본이 비정상적으로 커서 안전하게 이식할 수 없다.
- LLMWiki 통합 정책은 Moras에서 이미 더 구체화되어 있으므로, Codex 스킬은 Moras 정책을 우선해야 한다.

따라서 다음 단계는 “복사”가 아니라 “Codex용 NStack 실행층 추가”다. Codex도 Antigravity/Claude처럼 `.codex/` 아래에 물리적으로 분리된 rule, workflow, skill 원본을 가져야 한다. `task`, `llmwiki`뿐 아니라 GitHub, Git workflow, ship, retro, handoff, devlog, noffice, scope, qa, investigate, harness까지 Codex 전용 스킬 세트로 분리한 뒤 Moras의 첫 실제 개발 태스크에 적용해서 NStack 파일럿으로 검증하는 것이 가장 안전하다.
