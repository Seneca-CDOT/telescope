---
sidebar_position: 0
---

import StarField from '@site/src/components/StarField';

# Telescope 總覽

## 我們的貢獻者們

Telescope 的成果是感謝於所有這些天賦異稟的人們(和機器人們)的共同作業。

<StarField />

## 簡介

Seneca 的開源軟體開發其中一個關鍵的特色是重視分享我們正在做些甚麼、教育，以及藉由部落格發文來學習。
我們相信學習如何在開源軟體社群中作業最具獎勵的一部分是發現自己能夠成為網路的一份子、找到自己的聲音和建立一些追隨。

我們也相信閱讀彼此的部落格是重要的一件事。在我們同仁的部落格文章中，
我們會發現我們在讓程式運作的掙扎中並不孤單，而我們對於各種題材的興趣和自我否定並不是我們自己獨有的。

為了能夠增加部落格的能見度，我們設立了一個開源部落格[Planet](<https://en.wikipedia.org/wiki/Planet_(software)>):
一個將 Seneca 開源軟體開發的師生所發表的部落格文章化成單頁的集合體。

## Planet 是甚麼?

> Planet 是一個設計成能夠從網路社群中收集網路文章並將它們展示於單一頁的摘要集合程式。Planet 運作在一個網路伺服器上。從最新的摘要項目開始，它利用原本的摘要項目來依照遵從時間順序建立頁面。--[維基百科](<https://en.wikipedia.org/wiki/Planet_(software)>)

在 2000 年代的早期，在像推特和臉書等社群軟體的崛起前，Planet 解決了一個開源軟體社群的重要問題。
它使用各種摘要技術（RSS, Atom, CDF）來讓不同平台的部落文章可以被集合成不斷收錄特定社群的人們所發表的最新文章的單一頁。

由 Jeff Waugh 和 Scott James Remnant 用 Python 撰寫，Planet 能夠被一系列的部落格摘要和 HTML 樣板設定。
它會使用這些去從特定摘要來動態生成一個有依照時間順序的文章的網站。

## 尋找一個新的 Planet

我們現在的 Planet 正在消亡中。我們用的軟體最後更新是 13 年前。當內含的程式碼正在隨著時間流逝成為過去式，
我們的需求依然前進著。特別是因為在 Seneca 參予開源軟體開發的學生數量，維護既有的程式碼變得相當地困難。
我們的網站時常壞掉並且需要經常性地手動介入。在未來，我們需要一個新的 Planet 來作為家。

當我們準備進入 2020 年，我們決定是時候考慮轉移到一個新的系統。不幸地，幾乎所有來取代 Planet 的系統已經不再被維護。

與其嘗試尋找一個既有的解決方案，我們決定創造一個。因為我們需要這個軟體，我們覺得我們需要創造和維護它。
還有，因為我們對於另一個 Planet 的需求來自於我們共同的開源軟體作業，我們認為以開源軟體來共同創造它會是最令人滿意的的前進路線。

## 嘗試定義我們的 Planet

從過去數十年間運作我們自己的 Planet 中，我們學到了一些事情。我們也觀察了社群媒體和現代科技改變了我們對於這樣的系統能夠並應該成為甚麼的期待。
這也影響了對於我們新的 Telescope 計畫的設計和執行。

關於一個對現今設計比較完整的描述，請詳見[程式架構](architecture.md)。

## Telescope 能做些甚麼?

基本上，Telescope 擷取[RSS](https://en.wikipedia.org/wiki/RSS)[部落格文章摘要](https://rss.com/blog/rss-feed-for-blog/)來重建這些部落格文章成 HTML，
並將它們收集成一頁來呈現。它能夠處理各種格式，像是程式碼塊或內嵌式影片。
Telescope 也會在[dashboard](https://api.telescope.cdot.systems/v1/status/)中收集那些文章的資料。
在 Telescope 上的部落格文章來自於 Telescope 的貢獻者們。因此，你可以在這個網站追蹤這個網站本身的研發！

## 計畫歷史

- [Telescope 1.0](https://blog.humphd.org/telescope-1-0-0-or-dave-is-once-again-asking-for-a-blog/) (2020 年四月)
- [Telescope 2.0](https://blog.humphd.org/telescope-2-0/) (2021 年四月)
- [Telescope 3.0](https://blog.humphd.org/toward-telescope-3-0/) (製作中，2022 年四月)

### 1.0

[Telescope 1.0](https://github.com/Seneca-CDOT/telescope/releases/tag/1.0.0)實現了我們許多的初步目標，包含:

- 一個提供 REST APIs 和 GraphQL 的單體式 node.js 後端網路伺服器。
- 一個用於摘要平行處理的 node.js 佇列服務。
- 全面介面重整和設計。
- 一個使用 Material UI React 部件的 GatsbyJS 前端網路伺服器。
- 開始以 SAML2 為基礎的單一登入(SSO)認證。
- Docker/Docker Compose 基礎的容器管理。
- 使用 CircleCI 和 Travis CI 的 CI/CD pipeline。
- 使用 Zeit Now 的拉取請求預覽。
- 用於摘要和文章快取的一個 Redis 資料庫。
- 一個針對文章的進行全文字搜索的 Elasticsearch 資料庫。
- 一個 Nginx 反向代理和 HTTP 快取伺服器。
- 用來管理使用 Let’s Encrypt 的 SSL 憑證的 Certbot。
- 一個 node.js 基礎的 GitHub Webhook 服務來自動管理基於
- GitHub push event 和 webhooks 的部屬，以自動化整裝和生產軟體組建，包含藍綠部署。
- Staging (<https://dev.telescope.cdot.systems/>)和 Production(<https://telescope.cdot.systems/>)部署。

### 2.0

[Telescope 2.0](https://github.com/Seneca-CDOT/telescope/releases/tag/2.0.0)改善和延伸了這個設計:

- 改善測試結構，包含快照、端到端和單元測試。
- 重寫對 GitHub Actions 的 CI/CD。
- SEO 改善。
- 新增 Firebase 為一個使用者資訊的後臺資料庫。
- 改善 SAML 基礎認證、JWT 授權和使用者註冊流程安全性。
- 新的介面設計、Logo、CSS 和 Theming。
- 改善無障礙和使用者體驗。
- 使用 Traefik 遷移單體式後端到 Microservices(90%完成)和 API Gateway。
- 改善 Elasticsearch 和 Redis。
- 從 GatsbyJS 到 next.js 全面轉移前臺。
- 以 TypeScript 重寫前端。
- 手動和自動(Dependabot)更新和維護依賴關係。
- Bug 修正和付清技術負債。
- 漸進式網路應用程式(PWA)和行動介面支援。
- 改善 Docker。
- 對自動化和工具修整的修正、更新和改善。
- 對於 nginx、快取和憑證管理的改善。
- 文件說明更新。
- 改善開發者體驗，包括對跨平台差異的修正。

### 3.0

製作中。
