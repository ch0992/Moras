/**
 * Public prize winners and claim tracking dashboard for Moras.
 * Matches stellar theme and provides client-facing redemption buttons.
 */

function prizeResultsPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 추첨게임 당첨결과 및 상품 조회</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@400;600;800;900&family=Noto+Sans+KR:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #060913;
      --panel: rgba(10, 15, 30, 0.74);
      --line: rgba(255, 255, 255, 0.08);
      --gold: #D4AF37;
      --gold-soft: #FFE8A3;
      --text: #F8FAFC;
      --muted: #94A3B8;
      --blue: #22D3EE;
      --rose: #EC4899;
      --purple: #8B5CF6;
      --emerald: #10B981;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 18% 16%, rgba(139, 92, 246, 0.10), transparent 34%),
        radial-gradient(circle at 85% 80%, rgba(6, 182, 212, 0.10), transparent 36%),
        radial-gradient(circle at 50% 30%, #0d122b 0%, #060913 58%, #020306 100%);
      color: var(--text);
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1.5px 1.5px at 220px 150px, rgba(255,232,163,0.7), transparent),
        radial-gradient(1.5px 1.5px at 890px 240px, rgba(236,72,153,0.5), transparent),
        radial-gradient(1px 1px at 1120px 460px, rgba(6,182,212,0.6), transparent);
      background-size: 1200px 760px;
      opacity: 0.45;
    }
    main {
      width: min(960px, calc(100vw - 24px));
      margin: 0 auto;
      padding: 118px 0 80px;
      position: relative;
    }
    .global-home-logo {
      position: absolute;
      top: 28px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 30;
      font-family: 'Cinzel', serif;
      font-size: clamp(34px, 5vw, 52px);
      font-weight: 800;
      letter-spacing: 0.16em;
      line-height: 1;
      text-decoration: none;
      background: linear-gradient(135deg, #FFE8A3 0%, #C59B3F 50%, #FFE8A3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 25px rgba(197, 155, 63, 0.5), 0 4px 8px rgba(0, 0, 0, 0.9);
      filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.48));
    }
    .hero {
      margin-bottom: 24px;
      padding: 34px;
      border-radius: 22px;
      border: 1px solid rgba(255, 232, 163, 0.16);
      background: linear-gradient(135deg, rgba(255, 232, 163, 0.08), rgba(10, 15, 30, 0.72));
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.36);
      text-align: center;
    }
    .brand {
      margin: 0 0 10px;
      font-family: 'Cinzel', serif;
      color: var(--gold-soft);
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.15em;
    }
    h1 {
      margin: 0;
      color: var(--text);
      font-size: clamp(24px, 4.5vw, 36px);
      line-height: 1.25;
      font-weight: 900;
    }
    .summary {
      margin: 14px auto 0;
      color: #CBD5E1;
      font-size: 15px;
      line-height: 1.6;
      max-width: 620px;
      word-break: keep-all;
    }

    /* Search & Filter Roster */
    .filter-panel {
      padding: 24px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(10, 15, 30, 0.65);
      margin-bottom: 20px;
      backdrop-filter: blur(8px);
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.25);
    }
    .search-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      margin-bottom: 16px;
    }
    .search-input-wrap {
      position: relative;
    }
    .search-input-wrap::after {
      content: '🔍';
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      opacity: 0.6;
    }
    .search-input-wrap input {
      width: 100%;
      height: 48px;
      padding: 0 16px 0 46px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.04);
      color: var(--text);
      font-size: 15px;
      font-weight: 600;
      outline: none;
      transition: all 0.2s;
    }
    .search-input-wrap input:focus {
      border-color: rgba(255, 232, 163, 0.45);
      background: rgba(255,255,255,0.07);
      box-shadow: 0 0 14px rgba(255, 232, 163, 0.15);
    }
    .btn-search {
      height: 48px;
      padding: 0 24px;
      border-radius: 12px;
      border: 1px solid rgba(255, 232, 163, 0.35);
      background: linear-gradient(135deg, rgba(197, 155, 63, 0.24) 0%, rgba(10,15,30,0.8) 100%);
      color: var(--gold-soft);
      font-size: 14px;
      font-weight: 900;
      cursor: pointer;
      transition: all 0.25s;
    }
    .btn-search:hover {
      background: linear-gradient(135deg, rgba(197, 155, 63, 0.35) 0%, rgba(197, 155, 63, 0.12) 100%);
      border-color: rgba(255, 232, 163, 0.55);
      transform: translateY(-1px);
    }
    
    .filters-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr) auto;
      gap: 12px;
      align-items: center;
    }
    .filter-item select {
      width: 100%;
      height: 42px;
      padding: 0 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.04);
      color: #E2E8F0;
      font-size: 13.5px;
      font-weight: 600;
      outline: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-item select:focus {
      border-color: rgba(255, 232, 163, 0.3);
      background: rgba(255,255,255,0.06);
    }

    /* Page size tabs control */
    .limit-tabs {
      display: flex;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 3px;
    }
    .limit-btn {
      height: 34px;
      padding: 0 14px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--muted);
      font-size: 12.5px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s;
    }
    .limit-btn.active {
      background: rgba(255, 232, 163, 0.14);
      color: var(--gold-soft);
      border: 1px solid rgba(255, 232, 163, 0.22);
    }

    /* Starry Winners Grid */
    .winners-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .winner-card {
      display: grid;
      grid-template-columns: 50px 1.5fr 1fr 1fr 1.2fr auto;
      gap: 12px;
      align-items: center;
      padding: 20px 24px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(10, 15, 30, 0.62);
      box-shadow: 0 12px 34px rgba(0, 0, 0, 0.18);
      transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    }
    .winner-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 232, 163, 0.18);
      box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
    }
    .badge-icon {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-size: 18px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .badge-icon.roulette {
      border-color: rgba(236, 72, 153, 0.25);
      background: rgba(236, 72, 153, 0.06);
    }
    .badge-icon.ladder {
      border-color: rgba(6, 182, 212, 0.25);
      background: rgba(6, 182, 212, 0.06);
    }
    .badge-icon.gachapon {
      border-color: rgba(139, 92, 246, 0.25);
      background: rgba(139, 92, 246, 0.06);
    }

    .card-label {
      display: block;
      margin-bottom: 4px;
      color: var(--muted);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .card-value {
      color: var(--text);
      font-size: 15px;
      font-weight: 900;
      line-height: 1.3;
    }
    .prize-highlight {
      color: #FFE8A3;
      text-shadow: 0 0 8px rgba(255, 232, 163, 0.25);
    }
    .state-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      padding: 0 12px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.02em;
    }
    .state-badge.unused {
      background: rgba(236, 72, 153, 0.1);
      border: 1px solid rgba(236, 72, 153, 0.28);
      color: var(--rose);
    }
    .state-badge.used {
      background: rgba(16, 185, 129, 0.09);
      border: 1px solid rgba(16, 185, 129, 0.28);
      color: var(--emerald);
    }

    .btn-claim {
      height: 38px;
      padding: 0 16px;
      border-radius: 10px;
      border: 1px solid rgba(16, 185, 129, 0.35);
      background: rgba(16, 185, 129, 0.08);
      color: #34D399;
      font-size: 12.5px;
      font-weight: 900;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-claim:hover {
      background: rgba(16, 185, 129, 0.18);
      border-color: rgba(16, 185, 129, 0.55);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
    }
    .btn-claim:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Pagination controls */
    .pagination-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 32px;
    }
    .page-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: var(--muted);
      font-size: 13.5px;
      font-weight: 800;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.16);
      color: #fff;
    }
    .page-btn.active {
      background: rgba(255, 232, 163, 0.14);
      color: var(--gold-soft);
      border-color: rgba(255, 232, 163, 0.25);
    }
    .page-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .empty-wrapper {
      padding: 60px 24px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(10, 15, 30, 0.65);
      color: var(--muted);
      text-align: center;
      font-size: 15px;
      font-weight: 800;
    }

    /* Back Home Button link styling */
    .btn-back-home {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
      padding: 10px 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
      color: var(--text);
      font-size: 13.5px;
      font-weight: 800;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-back-home:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .prize-info-banner {
      margin-top: 28px;
      padding: 22px 28px;
      border-radius: 18px;
      border: 1px solid rgba(255, 232, 163, 0.35);
      background: rgba(255, 232, 163, 0.07);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      text-align: center;
    }
    .prize-info-banner .notice-label {
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .12em;
      color: var(--gold-soft);
      text-transform: uppercase;
    }
    .prize-info-banner .deadline-countdown {
      font-size: clamp(36px, 7vw, 64px);
      font-weight: 900;
      color: #fff;
      letter-spacing: .06em;
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    .prize-info-banner .deadline-countdown.expired { color: var(--muted); font-size: clamp(22px,4vw,36px); }
    .prize-info-banner .tz-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .prize-info-banner .tz-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      min-width: 110px;
    }
    .prize-info-banner .tz-city {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .08em;
      color: var(--muted);
      text-transform: uppercase;
    }
    .prize-info-banner .tz-time {
      font-size: 18px;
      font-weight: 900;
      color: var(--gold-soft);
    }
    .prize-info-banner .tz-date {
      font-size: 11px;
      color: var(--muted);
    }
    .btn-prize-guide {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      border-radius: 14px;
      border: 1px solid rgba(255, 232, 163, 0.4);
      background: rgba(255, 232, 163, 0.1);
      color: var(--gold-soft);
      font-size: 16px;
      font-weight: 900;
      text-decoration: none;
      transition: all 0.2s;
      letter-spacing: .04em;
    }
    .btn-prize-guide:hover {
      background: rgba(255, 232, 163, 0.18);
      border-color: rgba(255, 232, 163, 0.6);
      transform: translateY(-2px);
    }

    @media (max-width: 820px) {
      main { width: min(100vw - 24px, 540px); padding-top: 104px; }
      .filters-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .limit-tabs {
        justify-content: center;
      }
      .winner-card {
        grid-template-columns: 42px 1fr;
        gap: 12px 14px;
        padding: 18px;
      }
      .winner-card > div:not(.icon-wrap) {
        grid-column: 2;
      }
      .icon-wrap {
        grid-row: 1 / span 5;
        align-self: flex-start;
      }
    }
  </style>
</head>
<body>
  <a class="global-home-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
  <main>
    <section class="hero">
      <div class="brand">Celestial Draw</div>
      <h1>추첨게임 상품 당첨결과</h1>
      <p class="summary">🌌 룰렛, 사다리, 가차폰 게임을 통해 우주의 조화를 만끽한 당첨자 명단입니다.<br><strong>본인의 이름을 검색</strong>하여 당첨 물품을 조회하고 상품을 사용 처리해 보세요.</p>
      
      <a class="btn-back-home" href="https://moras-event-matching.netlify.app/">🪐 MORAS 대문으로 가기</a>

      <div class="prize-info-banner">
        <div class="notice-label">⏰ 상품 사용 마감까지</div>
        <div class="deadline-countdown" id="prize-deadline-countdown">--:--:--</div>
        <div class="tz-row" id="prize-tz-row"></div>
        <div style="font-size:13px;color:var(--muted);line-height:1.6;">
          모든 상품은 <strong style="color:var(--gold-soft);">24시간 이내</strong> 사용 완료해야 합니다.<br>기간 내 미사용 시 자동 소멸됩니다.
        </div>
        <a class="btn-prize-guide" href="/roulette-prizes" target="_blank">🎁 룰렛 상품 안내 바로가기</a>
      </div>
    </section>

    <!-- Roster Search Panel -->
    <section class="filter-panel">
      <div class="search-row">
        <div class="search-input-wrap">
          <input type="text" id="input-search" placeholder="당첨자 이름 또는 상품명을 입력하세요..." autocomplete="off">
        </div>
        <button type="button" class="btn-search" id="btn-trigger-search">조회하기</button>
      </div>
      <div class="filters-row">
        <div class="filter-item">
          <select id="select-game">
            <option value="all">⚡ 모든 추첨 게임</option>
            <option value="roulette">🔮 운명의 룰렛</option>
            <option value="ladder">🪜 은하수 사다리</option>
            <option value="gachapon">🪐 기적의 캡슐</option>
          </select>
        </div>
        <div class="filter-item">
          <select id="select-state">
            <option value="all">🎫 모든 상품 사용상태</option>
            <option value="false">🎁 미사용 (대기중)</option>
            <option value="true">🔒 사용 완료</option>
          </select>
        </div>
        <div class="filter-item">
          <select id="select-sort">
            <option value="created_at">⏰ 최신 당첨순</option>
            <option value="prize_name">🎁 상품 가나다순</option>
            <option value="participant_name">👤 당첨자 가나다순</option>
            <option value="is_used">🎫 사용상태순</option>
          </select>
        </div>
        
        <!-- Limit Control Tabs -->
        <div class="limit-tabs">
          <button type="button" class="limit-btn active" data-limit="10">10개씩</button>
          <button type="button" class="limit-btn" data-limit="20">20개</button>
          <button type="button" class="limit-btn" data-limit="50">50개</button>
        </div>
      </div>
    </section>

    <!-- Starry Winners Container -->
    <section class="winners-list" id="winners-container">
      <div class="empty-wrapper">당첨 데이터를 불러오는 중...</div>
    </section>

    <!-- Pagination -->
    <div class="pagination-row" id="pagination-container"></div>
  </main>

  <script>
    // State management
    let currentSearch = "";
    let currentGameType = "all";
    let currentIsUsed = "all";
    let currentSortBy = "created_at";
    let currentLimit = 10;
    let currentPage = 1;

    const winnersContainer = document.querySelector("#winners-container");
    const paginationContainer = document.querySelector("#pagination-container");
    const inputSearch = document.querySelector("#input-search");
    const selectGame = document.querySelector("#select-game");
    const selectState = document.querySelector("#select-state");
    const selectSort = document.querySelector("#select-sort");

    // Event listeners
    document.querySelector("#btn-trigger-search").addEventListener("click", () => {
      currentSearch = inputSearch.value.trim();
      currentPage = 1;
      loadPrizeWins();
    });

    inputSearch.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        currentSearch = inputSearch.value.trim();
        currentPage = 1;
        loadPrizeWins();
      }
    });

    selectGame.addEventListener("change", () => {
      currentGameType = selectGame.value;
      currentPage = 1;
      loadPrizeWins();
    });

    selectState.addEventListener("change", () => {
      currentIsUsed = selectState.value;
      currentPage = 1;
      loadPrizeWins();
    });

    selectSort.addEventListener("change", () => {
      currentSortBy = selectSort.value;
      currentPage = 1;
      loadPrizeWins();
    });

    document.querySelectorAll(".limit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".limit-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentLimit = parseInt(btn.dataset.limit, 10);
        currentPage = 1;
        loadPrizeWins();
      });
    });

    // Boot
    loadPrizeWins();

    async function loadPrizeWins() {
      winnersContainer.innerHTML = '<div class="empty-wrapper">당첨 데이터를 로드하고 있습니다...</div>';
      paginationContainer.innerHTML = "";

      let url = "/api/prize-wins?page=" + currentPage + "&limit=" + currentLimit + "&sortBy=" + currentSortBy;
      
      if (currentSearch) {
        url += "&search=" + encodeURIComponent(currentSearch);
      }
      if (currentGameType !== "all") {
        url += "&gameType=" + encodeURIComponent(currentGameType);
      }
      if (currentIsUsed !== "all") {
        url += "&isUsed=" + encodeURIComponent(currentIsUsed);
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "결과 조회를 로딩하는 데 실패했습니다.");
        renderWins(data);
      } catch (error) {
        winnersContainer.innerHTML = '<div class="empty-wrapper" style="color:#FCA5A5">' + escapeHtml(error.message) + '</div>';
      }
    }

    function renderWins(payload) {
      const wins = payload.wins || [];
      if (wins.length === 0) {
        winnersContainer.innerHTML = '<div class="empty-wrapper">조회된 조건에 맞는 당첨 결과 내역이 없습니다.</div>';
        return;
      }

      winnersContainer.innerHTML = wins.map((win) => renderCard(win)).join("");
      renderPagination(payload.page, payload.totalPages);
    }

    function renderCard(win) {
      let icon = "🔮";
      let gameLabel = "룰켓";
      let iconClass = "roulette";

      if (win.game_type === "ladder") {
        icon = "🪜";
        gameLabel = "은하수 사다리";
        iconClass = "ladder";
      } else if (win.game_type === "gachapon") {
        icon = "🪐";
        gameLabel = "기적의 캡슐";
        iconClass = "gachapon";
      }

      const formattedTime = formatDateTime(win.created_at);
      const isUsed = !!win.is_used;
      const statusBadgeHtml = isUsed 
        ? '<span class="state-badge used">🔒 사용 완료</span>'
        : '<span class="state-badge unused">🎁 미사용</span>';

      const actionBtnHtml = isUsed
        ? '<button class="btn-claim" disabled style="opacity:0.35;border-color:rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:var(--muted)">🔒 사용불가</button>'
        : '<button class="btn-claim" onclick="claimPrize(\\'' + escapeHtml(win.id) + '\\', \\'' + escapeHtml(win.prize_name) + '\\')" type="button">🎟️ 사용하기</button>';

      return '<article class="winner-card">' +
        '<div class="icon-wrap"><div class="badge-icon ' + iconClass + '" title="' + gameLabel + '">' + icon + '</div></div>' +
        '<div><span class="card-label">상품명</span><div class="card-value prize-highlight">' + escapeHtml(win.prize_name) + '</div></div>' +
        '<div><span class="card-label">당첨자</span><div class="card-value">' + escapeHtml(win.participant_name) + '</div></div>' +
        '<div><span class="card-label">게임종류</span><div class="card-value">' + gameLabel + '</div></div>' +
        '<div><span class="card-label">추첨일시</span><div class="card-value" style="font-size:13.5px;color:var(--muted)">' + formattedTime + '</div></div>' +
        '<div>' + statusBadgeHtml + '</div>' +
        '<div>' + actionBtnHtml + '</div>' +
        '</article>';
    }

    function renderPagination(current, total) {
      if (total <= 1) return;

      let html = '';
      
      // Prev Button
      html += '<button type="button" class="page-btn" ' + (current === 1 ? 'disabled' : '') + ' onclick="changePage(' + (current - 1) + ')">◀</button>';

      for (let i = 1; i <= total; i++) {
        html += '<button type="button" class="page-btn ' + (current === i ? 'active' : '') + '" onclick="changePage(' + i + ')">' + i + '</button>';
      }

      // Next Button
      html += '<button type="button" class="page-btn" ' + (current === total ? 'disabled' : '') + ' onclick="changePage(' + (current + 1) + ')">▶</button>';

      paginationContainer.innerHTML = html;
    }

    window.changePage = function(pageNumber) {
      currentPage = pageNumber;
      loadPrizeWins();
    };

    window.claimPrize = async function(winId, prizeName) {
      const confirmMsg = "정말로 [ " + prizeName + " ] 상품을 사용 완료 처리하시겠습니까?\\n사용 처리 후에는 더 이상 변경할 수 없으며 운영자 서버에 즉시 업데이트됩니다.";
      if (!confirm(confirmMsg)) return;

      try {
        const response = await fetch("/api/prize-wins/use", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ winId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "사용 처리에 실패하였습니다.");
        alert("성공적으로 상품 사용 완료 처리가 완료되었습니다. 🎫");
        loadPrizeWins();
      } catch (error) {
        alert("에러 발생: " + error.message);
      }
    };

    function formatDateTime(value) {
      if (!value) return "-";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      
      const pad = (n) => String(n).padStart(2, "0");
      return date.getFullYear() + "-" + 
             pad(date.getMonth() + 1) + "-" + 
             pad(date.getDate()) + " " + 
             pad(date.getHours()) + ":" + 
             pad(date.getMinutes()) + ":" + 
             pad(date.getSeconds());
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char]));
    }

    // Prize deadline countdown: 2026-06-04 23:30 EDT = 2026-06-05T03:30:00Z
    (function() {
      var deadlineUTC = new Date("2026-06-04T03:30:00Z").getTime();
      var tzList = [
        { label: "미 동부 (EDT)", tz: "America/New_York" },
        { label: "서울 (KST)", tz: "Asia/Seoul" },
        { label: "호주 시드니", tz: "Australia/Sydney" },
      ];
      var tzRow = document.getElementById("prize-tz-row");
      var countEl = document.getElementById("prize-deadline-countdown");

      // Render timezone blocks
      var d = new Date(deadlineUTC);
      tzList.forEach(function(t) {
        var opts = { timeZone: t.tz, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, year: "numeric" };
        var parts = new Intl.DateTimeFormat("en-US", opts).formatToParts(d);
        var get = function(type) { return (parts.find(function(p) { return p.type === type; }) || {}).value || ""; };
        var block = document.createElement("div");
        block.className = "tz-block";
        block.innerHTML = '<div class="tz-city">' + t.label + '</div>'
          + '<div class="tz-time">' + get("month") + "/" + get("day") + " " + get("hour") + ":" + get("minute") + '</div>';
        tzRow.appendChild(block);
      });

      function pad(v) { return String(v).padStart(2, "0"); }
      function tick() {
        var diff = deadlineUTC - Date.now();
        if (diff <= 0) {
          countEl.textContent = "마감됨";
          countEl.classList.add("expired");
          clearInterval(timer);
          return;
        }
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        countEl.textContent = (h >= 24 ? Math.floor(h/24) + "일 " + pad(h%24) : pad(h)) + ":" + pad(m) + ":" + pad(s);
      }
      tick();
      var timer = setInterval(tick, 1000);
    })();
  </script>
</body>
</html>`;
}

module.exports = { prizeResultsPage };
