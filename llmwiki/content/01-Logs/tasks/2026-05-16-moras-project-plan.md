# Moras 프로젝트 계획

## 요약

Moras는 Netlify에 호스팅되는 Next.js 웹 애플리케이션으로 구축하고, Supabase를 백엔드 데이터베이스로 사용한다. 제품은 MBTI와 단순화된 사주 기반 궁합 점수를 활용해 오픈채팅 이벤트 매칭을 지원한다.

Moras는 동시에 NStack을 실제 제품 개발에 적용해 검증하는 파일럿 애플리케이션이다. 따라서 기능 구현뿐 아니라 지시서, 보고서, 검증, LLMWiki 지식화 흐름이 실전에서 작동하는지 확인한다.

## 현재 리소스

- NStack 설치 및 검증 완료
- LLMWiki/SwarmVault 로컬 및 upstream 통합 검증 완료
- GitHub CLI 인증 완료
- Supabase Moras 프로젝트 생성 완료: `xzlwcfmdbjxhiycywtmi`
- Supabase URL: `https://xzlwcfmdbjxhiycywtmi.supabase.co`
- Netlify 계정 인증 완료
- Moras Netlify 프로젝트는 아직 생성 전

## MVP 단계

1. 계획과 준비
2. 앱 골격 생성
3. 데이터베이스 기반
4. 참가자 제출 흐름
5. 운영자 참가자 관리
6. 매칭 엔진
7. Netlify 배포
8. 첫 이벤트 준비
9. NStack 파일럿 회고

## 아키텍처

- 앱: Next.js
- 호스팅: Netlify
- 데이터베이스: Supabase Postgres
- 스타일: Tailwind CSS
- 입력 검증: Zod
- 인증: Supabase Auth 또는 MVP 관리자 패스코드

## 주요 리스크

- 사주 결과 과신
- 개인정보 처리
- 관리자 경로 노출
- 매칭 공정성에 대한 의문
- 이벤트 트래픽 대비
- NStack 절차가 실제 개발 속도와 맞지 않을 가능성
- 지식화 누락으로 파일럿 검증 근거가 부족해질 가능성

## NStack 파일럿 검증 항목

- 작업 지시서 작성 여부
- 완료 보고서 작성 여부
- SwarmVault/LLMWiki 기록 여부
- 기능 검증과 배포 검증 기록 여부
- 다음 프로젝트에 재사용 가능한 절차 도출 여부

## 다음 단계

Phase 1로 넘어가 `Next.js + Tailwind + Supabase` 앱 골격을 만들고, 첫 데이터베이스 migration을 준비한다.
