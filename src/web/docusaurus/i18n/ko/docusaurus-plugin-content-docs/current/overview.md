---
sidebar_position: 0
---

import StarField from '@site/src/components/StarField';

# Telescope 개요

## 기여자들

Telescope의 완성은 아래에 있는 이 모든 훌륭한 사람들 (그리고 로봇들)이 다 함께 노력한 덕분입니다.

<StarField />

## 소개

세네카 대학의 오픈 소스 참여의 핵심 특징 중 하나는 우리가 하는 일을 공유하고, 블로그를 통해 가르치고 또 배우는 것 입니다.
오픈 소스 커뮤니티에 참여하는 방법을 배우는 것에 있어서 가장 보람있는 부분 중 하나는
한 사람이 웹의 일부가 되고 목소리를 내며 팔로잉을 구축할 수 있다는 것을 발견하는 것 입니다.
우리는 또한 서로의 블로그 글을 읽는 것이 중요하다고 생각합니다.
동료들의 블로그 글에서 우리는 일이 잘 되도록 노력하는 사람이 우리만이 아니라는 것, 다양한 주제에 대한 우리의 관심,
그리고 내 능력을 의심하는 것이 '나'에게만 고유한 것은 아니라는 것을 발견합니다.
우리 커뮤니티 내에서 블로그를 발견할 수 있도록 하기 위해 우리는
오픈 소스 블로그 [플래닛](<https://en.wikipedia.org/wiki/Planet_(software)>)을 설치했습니다:
세네카 교수진과 학생들의 블로그 글을 집계하여 하나의 페이지에서 제공합니다.

## Planet이란 무엇인가?

> Planet은 인터넷 커뮤니티 회원들의 블로그에서 글을 수집하고 이를 한 페이지에서 보여주기 위해 설계된 피드 집계 애플리케이션입니다.
> 플래닛은 웹 서버에서 실행됩니다. 이는 최신 글을 먼저 보여주는 시간 순으로 기존 피드에서 항목을 가져와 페이지를 생성합니다. - [위키백과](<https://en.wikipedia.org/wiki/Planet_(software)>)

2000년대 초기, 트위터와 페이스북과 같은 소셜 미디어 앱이 등장하기 전, Planet은 자유롭고 오픈 소스 커뮤니티에서 중요한 문제를 해결했습니다.
이는 다양한 "피드" 기술(RSS, Atom, CDF)을 사용하여 다른 플랫폼의 블로그 글을 집계하여
특정 커뮤니티 내의 사람들이 작성한 최신 글이 지속적으로 업데이트되는 단일 페이지로 제공했습니다.

Jeff Waugh와 Scott James Remnant가 Python으로 작성한 Planet은 블로그 피드 목록과 HTML 템플릿을 구성할 수 있었습니다.
이를 사용하여 지정된 피드에서 시간 순서대로 글을 동적으로 생성하는 사이트를 만들었습니다.

## 새 Planet을 찾아서

현재 우리 플래닛은 쇠퇴하고 있습니다. 사용 중인 소프트웨어의 마지막 업데이트는 13년 전입니다.
기반 코드는 더 오래된 상태이지만 우리의 필요성은 앞으로 더 나아가고 있습니다.
특히 세네카에서 오픈 소스에 참여하는 학생 수가 많아져 기존 시스템을 유지하는 것은 너무 어려워졌습니다.
현재 사이트는 자주 고장이 나며 정기적인 개발자의 개입이 필요합니다.
앞으로는 우리가 집이라고 부를 새로운 Planet이 필요합니다.

2020년을 맞이하며 새로운 시스템으로 전환을 고려할 시기가 된 것으로 결정했습니다.
불행하게도, Planet을 대체하기 위해 나온 거의 모든 시스템이 지원되지 않는 상태가 되었습니다.

기존 솔루션을 찾는 대신 우리는 새로운 솔루션을 만들어보기로 결정했습니다.
이 소프트웨어가 필요하기 때문에 우리는 직접 만들고 유지할 필요성이 있다고 느낍니다.
또한, 우리가 오픈 소스를 통해 함께 한 결과를 위해 Planet이 필요하다고 생각하기 때문에,
_오픈 소스 함께 하기_ 를 만드는 것이 가장 바람직한 길이라고 생각합니다.

## 우리의 Planet을 정의하려는 노력

지난 10년 동안 우리만의 Planet을 운영하면서 여러 가지를 배웠습니다.
또한 소셜 미디어와 현대 기술이 이러한 시스템이 어떻게 될 것이며 어떻게 되어야 하는지에 대한 우리의 기대를 재정립하는 것을 지켜보았습니다.
이러한 경험이 우리의 새로운 프로젝트인 Telescope의 디자인과 구현에 반영되었습니다.

현재 디자인에 대한 더 완전한 그림은 [아키텍처](architecture.md)를 참조하세요.

## Telescope는 무엇을 하는 것인가?

기본적으로, Telescope는 [RSS](https://en.wikipedia.org/wiki/RSS) [블로그 글 피드](https://rss.com/blog/rss-feed-for-blog/)를
가져와 이를 HTML로 다시 구성하고 단일 웹 페이지에 모아 표시합니다.
이는 코드 블록이나 내장된 비디오와 같은 다양한 서식을 처리할 수 있습니다.
또한 Telescope는 이러한 글에 대한 데이터를 [대시보드](https://api.telescope.cdot.systems/v1/status/)에서 수집합니다.
Telescope의 블로그 글은 Telescope 기여자들에게서 옵니다.
그러므로 웹사이트의 개발 과정을 웹사이트 자체에서 따라갈 수 있습니다!

## 프로젝트의 역사

- [Telescope 1.0](https://blog.humphd.org/telescope-1-0-0-or-dave-is-once-again-asking-for-a-blog/) (4월 2020)
- [Telescope 2.0](https://blog.humphd.org/telescope-2-0/) (4월 2021)
- [Telescope 3.0](https://blog.humphd.org/toward-telescope-3-0/) (진행중, 4월 2022)

### 1.0

[Telescope 1.0](https://github.com/Seneca-CDOT/telescope/releases/tag/1.0.0)는 초기 목표들 중 많은 것을 실현했습니다:

- REST API 및 GraphQL을 제공하는 단일 Node.js 백엔드 웹 서버
- 병렬 피드 처리를 위한 Node.js 큐 서비스
- 완전히 새롭게 디자인된 UI
- Material UI React 구성 요소를 사용한 GatsbyJS 프론트엔드 웹 앱
- 초기 SAML2 기반의 단일 로그인 인증
- Docker/Docker Compose를 기반으로 한 컨테이너 관리
- CircleCI와 Travis CI를 사용한 CI/CD 파이프라인
- Zeit Now를 사용한 Pull Request 미리보기
- 피드와 글을 캐싱하기 위한 Redis 데이터베이스
- 글의 전체 텍스트 검색을 위한 Elasticsearch 데이터베이스
- Nginx 리버스 프록시 및 HTTP 캐시 서버
- Let’s Encrypt로 SSL 인증서를 관리하기 위한 Certbot
- GitHub 푸시 이벤트를 기반으로 자동으로 배포를 관리하기 위한 Node.js 기반의 GitHub 웹훅 서비스
- 스테이징 (<https://dev.telescope.cdot.systems/>) 및 프로덕션 (<https://telescope.cdot.systems/>) 배포

### 2.0

[Telescope 2.0](https://github.com/Seneca-CDOT/telescope/releases/tag/2.0.0)은 현재 디자인을 개선하고 확장하였습니다:

- 스냅샷, 엔드 투 엔드 및 단위 테스트를 포함한 테스트 인프라 개선
- GitHub Actions로의 CI/CD 재작업
- SEO 개선
- 사용자 정보의 백엔드 데이터 저장소로 Firebase 추가
- SAML 기반 인증, JWT 권한 부여 및 사용자 가입 흐름 보안 개선
- 새로운 UI 디자인, 로고, CSS 및 테마
- 접근성 및 사용자 경험 개선
- 모놀리식 백엔드를 마이크로서비스로 이전 (90% 완료) 및 Traefik을 사용한 API 게이트웨이 도입
- Elasticsearch와 Redis 개선
- GatsbyJS에서 Next.js로의 전면 포팅
- 프론트엔드의 TypeScript 재작성
- 수동 및 자동 종속성 업데이트 및 유지 보수 (Dependabot)
- 버그 수정 및 기술 부채 상환
- PWA (Progressive Web App) 및 모바일 UI 지원
- Docker 개선
- 자동화 및 도구 수정, 업데이트 및 개선
- nginx, 캐싱 및 인증서 관리 개선
- 문서 업데이트
- 크로스 플랫폼 차이에 대한 수정을 포함한 개발자 경험 개선

### 3.0

진행중
