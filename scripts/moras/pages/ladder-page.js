/**
 * Public ladder climb (Ghost Leg) page for Moras.
 *
 * Responsibilities:
 * - Render an unauthenticated, fully-responsive premium Ladder show view.
 * - Retrieve and display selected roulette prizes at the top as gorgeous glowing neon chips.
 * - Draw a highly-aesthetic interactive Neon Cyberpunk Ghost Leg Canvas.
 * - Match physical ladder paths deterministically to backend-allocated prizes.
 * - Synthesize chiptune sound waves for movement slide ticks, countdowns, and win fanfares.
 */

function ladderPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 사다리타기</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #03070e;
      --panel: rgba(255,255,255,.04);
      --line: rgba(255,255,255,.1);
      --gold: #FFE8A3;
      --gold-g: linear-gradient(135deg,#FFE8A3 0%,#F4C35E 50%,#FFE8A3 100%);
      --muted: rgba(255,255,255,.52);
      --neon-blue: #06B6D4;
      --neon-pink: #EC4899;
      --neon-green: #10B981;
    }
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html, body { min-height:100vh; background:var(--bg); color:#fff; font-family:'Noto Sans KR',sans-serif; overflow-x:hidden; }
    body { padding-bottom:48px; }

    /* ── HEADER ─────────────────────────────────── */
    .logo { display:block; text-align:center; padding:22px 0 0; font-family:'Cinzel',serif; font-size:clamp(26px,4vw,50px); font-weight:800; background:var(--gold-g); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; text-decoration:none; letter-spacing:.08em; }
    main { width:min(100vw - 32px, 960px); margin:0 auto; padding-top:14px; }

    /* ── SHOW HEAD ──────────────────────────────── */
    .show-head { display:grid; grid-template-columns:200px 1fr 200px; gap:12px; align-items:center; margin:16px 0 10px; }
    .show-side { padding:12px 16px; border:1px solid var(--line); border-radius:14px; background:var(--panel); }
    .show-side.right { text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; }
    .show-side.stats { display:flex; gap:0; align-items:stretch; padding:0; }
    .show-side.stats .stat-item { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; padding:12px 16px; }
    .show-side.stats .stat-divider { width:1px; background:var(--line); flex-shrink:0; margin:12px 0; }
    .show-title-wrap { padding:16px 28px; border:1px solid rgba(255,232,163,.34); border-radius:16px; background:linear-gradient(135deg,rgba(255,232,163,.14),rgba(8,12,26,.9)); box-shadow:0 0 28px rgba(255,232,163,.2),inset 0 0 32px rgba(255,232,163,.07); position:relative; overflow:hidden; }
    .show-title-wrap::before { content:""; position:absolute; inset:-60%; background:conic-gradient(from 0deg,transparent,rgba(255,255,255,.22),transparent 28%); animation:glint 2.2s linear infinite; }
    .show-title-wrap h1 { position:relative; margin:0; color:var(--gold); font-size:clamp(20px,3.2vw,44px); line-height:1.1; text-align:center; text-shadow:0 0 16px rgba(255,232,163,.44); word-break:keep-all; }
    .lbl { font-size:10px; font-weight:700; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; }
    .big-num { font-size:clamp(20px,3.5vw,38px); font-weight:900; color:var(--gold); line-height:1.15; }

    /* ── NEON FLOATING PRIZE ZONE ──────────────── */
    .prize-orbit-zone { position:relative; min-height:86px; margin:6px 0 14px; display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:center; padding:10px; border:1px dashed rgba(255,232,163,.2); border-radius:18px; background:rgba(255,232,163,.02); overflow:hidden; }
    .prize-chip { padding:6px 14px; border-radius:12px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.1); color:#fff; font-weight:800; font-size:13px; box-shadow:0 4px 10px rgba(0,0,0,.25); transition:all 0.4s ease; display:flex; align-items:center; gap:6px; animation:float-chip 3s ease-in-out infinite; animation-delay:var(--delay); }
    .prize-chip.active { border-color:rgba(255,232,163,.55); color:var(--gold); background:rgba(255,232,163,.09); box-shadow:0 0 15px rgba(255,232,163,.2); transform:scale(1.05); }
    .prize-chip.drawn { opacity:0.4; filter:grayscale(100%); text-decoration:line-through; animation:none; }
    
    @keyframes float-chip {
      0%, 100% { transform:translateY(0px) rotate(0deg); }
      50% { transform:translateY(-5px) rotate(1deg); }
    }

    /* ── STAGE LAYOUT ───────────────────────────── */
    .stage { display:flex; justify-content:center; }
    .ladder-panel { border:1px solid var(--line); border-radius:22px; background:var(--panel); padding:24px; display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; position:relative; }
    
    /* ── CANVAS AREA ────────────────────────────── */
    .canvas-wrap { position:relative; width:100%; max-width:860px; background:radial-gradient(circle at center, #060b18 0%, #03060d 100%); border-radius:16px; border:1px solid rgba(255,255,255,.05); overflow:hidden; box-shadow:inset 0 0 30px rgba(0,0,0,0.8); }
    canvas { display:block; width:100%; height:480px; }

    .status-bar { width:100%; text-align:center; font-size:14px; font-weight:700; color:rgba(255,255,255,.7); min-height:22px; }

    /* ── LIST PANELS ────────────────────────────── */
    .panel-hd { font-family:'Cinzel',serif; font-size:13px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; margin-bottom:12px; }
    .p-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:7px; }
    .p-row { padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); font-size:12px; }
    .p-row .nm { font-weight:900; font-size:13px; }
    .p-row .pr { margin-top:3px; }
    .pill { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:700; background:rgba(255,255,255,.09); color:var(--muted); }
    .pill.won { background:rgba(255,232,163,.22); color:var(--gold); border:1px solid rgba(255,232,163,.3); }

    .draw-section { margin-top:20px; display:grid; grid-template-columns:1fr minmax(260px,.5fr); gap:16px; align-items:start; }
    .draw-card { border:1px solid var(--line); border-radius:18px; background:var(--panel); padding:18px; }
    .res-row { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:8px 12px; border-radius:9px; border:1px solid rgba(255,255,255,.06); background:rgba(255,255,255,.025); font-size:13px; margin-bottom:6px; }

    /* ── WINNER POPUP ───────────────────────────── */
    .w-pop { position:fixed; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.6); opacity:0; pointer-events:none; z-index:60; transition:opacity .22s ease; }
    .w-pop.show { opacity:1; pointer-events:auto; }
    .w-card { min-width:min(480px,86vw); padding:40px 44px; border-radius:26px; border:2px solid rgba(255,232,163,.5); background:linear-gradient(135deg,rgba(255,232,163,.2),rgba(8,12,26,.97)); text-align:center; box-shadow:0 0 90px rgba(255,232,163,.42),0 0 0 1px rgba(255,232,163,.08); transform:scale(.78); transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
    .w-pop.show .w-card { transform:scale(1); }
    .w-sublabel { font-size:12px; font-weight:700; letter-spacing:.12em; color:var(--muted); text-transform:uppercase; margin-bottom:8px; }
    .w-prize { font-size:clamp(24px,5vw,50px); font-weight:900; color:var(--gold); text-shadow:0 0 22px rgba(255,232,163,.6); margin-bottom:4px; }
    .w-name { font-family:'Cinzel',serif; font-size:clamp(36px,7vw,78px); font-weight:800; background:var(--gold-g); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.12; }
    .w-emoji { font-size:clamp(28px,4.5vw,52px); margin-top:10px; }

    /* ── FIREWORKS ──────────────────────────────── */
    .fw-layer { position:fixed; inset:0; pointer-events:none; opacity:0; z-index:55; }
    .fw-layer.show { opacity:1; animation:fw-fade 3.5s ease-out forwards; }
    .fwp { position:absolute; width:7px; height:7px; border-radius:50%; }

    /* ── KEYFRAMES ──────────────────────────────── */
    @keyframes glint { to { transform:rotate(360deg); } }
    @keyframes fw-fade { 0%{opacity:0} 10%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
    @keyframes fw-burst { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--fx),var(--fy)) scale(0.1);opacity:0} }

    /* ── COUNTDOWN POPUP ───────────────────────── */
    .cd-pop { position:fixed; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.82); opacity:0; pointer-events:none; z-index:70; transition:opacity .22s ease; }
    .cd-pop.show { opacity:1; pointer-events:auto; }
    .cd-card { padding:44px 56px; border-radius:28px; border:2px solid rgba(255,232,163,.55); background:linear-gradient(135deg,rgba(255,232,163,.18),rgba(8,12,26,.97)); text-align:center; box-shadow:0 0 100px rgba(255,232,163,.45); }
    .cd-prize { font-size:clamp(18px,3.5vw,34px); font-weight:900; color:var(--gold); text-shadow:0 0 20px rgba(255,232,163,.6); margin-bottom:14px; letter-spacing:.02em; }
    .cd-label { font-size:12px; font-weight:700; letter-spacing:.12em; color:var(--muted); text-transform:uppercase; margin-bottom:8px; }
    .cd-num { font-family:'Cinzel',serif; font-size:clamp(80px,18vw,150px); font-weight:800; background:var(--gold-g); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; animation:cd-pop-in .32s cubic-bezier(.34,1.56,.64,1); }
    @keyframes cd-pop-in { 0%{transform:scale(.35);opacity:0} 100%{transform:scale(1);opacity:1} }

    /* ── RESPONSIVE ─────────────────────────────── */
    @media (max-width:860px) {
      .show-head { grid-template-columns:1fr 1fr; gap:8px; }
      .show-title-wrap { grid-column:1 / -1; order:3; }
      .show-side.right { order:4; }
      .show-side.stats { gap:14px; }
      main { padding-top:10px; }
      .draw-section { grid-template-columns:1fr; }
    }
    @media (max-width:480px) {
      .show-head { grid-template-columns:1fr 1fr; }
      .big-num { font-size:22px; }
      .p-grid { grid-template-columns:repeat(auto-fill,minmax(90px,1fr)); }
    }
  </style>
</head>
<body>
  <a class="logo" href="/">MORAS</a>
  <main>
    <section class="show-head">
      <div class="show-side stats">
        <div class="stat-item">
          <div class="lbl">Target</div>
          <div class="big-num" id="target-count">–</div>
          <div class="lbl" style="margin-top:2px">대상 인원</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="lbl">Online</div>
          <div class="big-num" id="viewer-count">–</div>
          <div class="lbl" style="margin-top:2px">접속중인 인원</div>
        </div>
      </div>
      <div class="show-title-wrap">
        <h1 id="event-title">Moras 사다리타기</h1>
      </div>
      <div class="show-side right">
        <div class="lbl">Status</div>
        <div id="status" style="margin-top:6px;font-weight:900;font-size:13px;line-height:1.5;color:var(--gold);text-align:center">대기 중</div>
      </div>
    </section>

    <!-- Prize Orbit Zone: display selected raffle items from roulette with floating neon glows -->
    <div class="prize-orbit-zone" id="prize-orbit-zone">
      <div style="color:var(--muted);font-size:13px;">룰렛에서 선택된 추첨 상품을 가져오고 있습니다...</div>
    </div>

    <section class="stage">
      <div class="ladder-panel">
        <div class="canvas-wrap" id="canvas-wrap">
          <canvas id="ladder-canvas"></canvas>
        </div>
        <div class="status-bar" id="status-bar">대기 중</div>
      </div>
    </section>
  </main>

  <!-- Countdown popup -->
  <div class="cd-pop" id="cd-pop">
    <div class="cd-card">
      <div class="cd-label">🪜 다음 사다리 타기</div>
      <div class="cd-prize" id="cd-prize">참가자</div>
      <div class="cd-num" id="cd-num">5</div>
    </div>
  </div>

  <!-- Winner popup -->
  <div class="w-pop" id="w-pop">
    <div class="w-card">
      <div class="w-sublabel">🪜 사다리 도달 완료</div>
      <div class="w-name" id="w-name">당첨자</div>
      <div style="color:var(--muted);font-size:13px;margin:8px 0 2px;">당첨 상품</div>
      <div class="w-prize" id="w-item">상품</div>
      <div class="w-emoji">⚡</div>
    </div>
  </div>

  <!-- Fireworks layer -->
  <div class="fw-layer" id="fw-layer"></div>

  <!-- Roster and Results panel below the stage -->
  <main>
    <div class="draw-section">
      <div class="draw-card">
        <div class="panel-hd">Participants</div>
        <div class="p-grid" id="p-grid"></div>
      </div>
      <div class="draw-card">
        <div class="panel-hd">Results</div>
        <div id="results"></div>
      </div>
    </div>
  </main>

  <script>
    /* ── DOM refs ─────────────────────────────────── */
    const statusEl      = document.getElementById("status");
    const statusBar     = document.getElementById("status-bar");
    const eventTitle    = document.getElementById("event-title");
    const targetCount   = document.getElementById("target-count");
    const viewerCount   = document.getElementById("viewer-count");
    const prizeZone     = document.getElementById("prize-orbit-zone");
    const canvas        = document.getElementById("ladder-canvas");
    const ctx           = canvas.getContext("2d");
    const canvasWrap    = document.getElementById("canvas-wrap");
    
    const wPop          = document.getElementById("w-pop");
    const wItem         = document.getElementById("w-item");
    const wName         = document.getElementById("w-name");
    const fwLayer       = document.getElementById("fw-layer");
    const cdPop         = document.getElementById("cd-pop");
    const cdPrize       = document.getElementById("cd-prize");
    const cdNumEl       = document.getElementById("cd-num");

    /* ── State ────────────────────────────────────── */
    let seenResults     = new Set();
    let firstLoad       = true;
    let animating       = false;
    let participants    = [];
    let lastPCount      = -1;
    let latestResults   = [];
    let roulettePrizes  = { items: [], selectedItemIds: [] };

    // Canvas & Ladder details
    let columns = [];
    let horizontalLines = [];
    let activePath = null; // { col, segmentIndex, x, y, progress }
    let runner = null; // anim details

    /* ── Sound & Polling Init ── */
    const viewerSessionId = getViewerSessionId();
    sendPresenceHeartbeat();
    loadState();
    setInterval(loadState, 1200);
    setInterval(sendPresenceHeartbeat, 10000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) sendPresenceHeartbeat();
    });

    // Resize canvas
    function resizeCanvas() {
      canvas.width = canvasWrap.clientWidth;
      canvas.height = 480;
      drawLadder();
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    /* ── Data loading ─────────────────────────────── */
    async function loadState() {
      try {
        const res  = await fetch("/api/ladder", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "사다리 상태를 불러오지 못했습니다.");
        renderState(data);
      } catch (e) {
        statusEl.textContent = e.message;
      }
    }

    async function sendPresenceHeartbeat() {
      try {
        const res = await fetch("/api/ladder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "heartbeat", sessionId: viewerSessionId }),
          keepalive: true,
        });
        const data = await res.json();
        if (data && typeof data.activeViewerCount === "number") {
          viewerCount.textContent = String(data.activeViewerCount);
        }
      } catch (e) {}
    }

    function getViewerSessionId() {
      const key = "moras_ladder_view_session";
      try {
        const existing = localStorage.getItem(key);
        if (existing) return existing;
        const next = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
        localStorage.setItem(key, next);
        return next;
      } catch {
        return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
      }
    }

    function renderState(data) {
      const settings = data.settings || {};
      participants = data.participants || [];
      const results = data.results || [];
      roulettePrizes = data.roulettePrizes || { items: [], selectedItemIds: [] };

      eventTitle.textContent = settings.event_name || "Moras 사다리타기";
      targetCount.textContent = participants.length;
      viewerCount.textContent = String(data.activeViewerCount ?? 1);

      // Render Selected prizes from Roulette at the top
      renderPrizeOrbitZone(results);

      // Rebuild ladder mapping if participant count changes
      if (participants.length !== lastPCount) {
        lastPCount = participants.length;
        buildLadderMap(participants);
        resizeCanvas();
      }

      latestResults = results;

      if (!animating) {
        renderParticipants(participants, results);
        renderResults(results);
      }

      const newResults = results.filter(r => !seenResults.has(r.id)).reverse();
      if (firstLoad) {
        results.forEach(r => seenResults.add(r.id));
        firstLoad = false;
        renderParticipants(participants, results);
        renderResults(results);
        updateWaiting(settings, results);
        return;
      }

      if (newResults.length && !animating) {
        runQueue(newResults, results.length);
      } else if (!animating) {
        updateWaiting(settings, results);
      }
    }

    /* ── Render roulette prizes at the top ── */
    function renderPrizeOrbitZone(results) {
      const selectedIds = new Set(roulettePrizes.selectedItemIds || []);
      const activeItems = (roulettePrizes.items || []).filter(it => selectedIds.has(it.id));
      const drawnItemIds = new Set(results.map(r => r.item_id).filter(id => id !== "default-loss"));

      if (!activeItems.length) {
        prizeZone.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px 0;">룰렛 페이지에서 추첨 상품을 선택해주세요.</div>';
        return;
      }

      prizeZone.innerHTML = activeItems.map((it, idx) => {
        const isDrawn = drawnItemIds.has(it.id);
        const delay = (idx * 0.25).toFixed(2) + "s";
        return '<div class="prize-chip' + (isDrawn ? ' drawn' : ' active') + '" style="--delay:' + delay + '">'
          + '🎁 ' + escapeHtml(it.label)
          + '</div>';
      }).join("");
    }

    /* ── deterministic ladder map generation based on size ── */
    function buildLadderMap(pts) {
      const N = pts.length || 2;
      columns = [];
      for (let i = 0; i < N; i++) {
        columns.push({
          index: i,
          displayName: pts[i] ? pts[i].display_name : ("Col " + (i+1)),
          participantId: pts[i] ? pts[i].id : null
        });
      }

      // Generate random horizontal bridges between lines
      // seed or hash is deterministic per size to prevent ladder jumping on refresh
      horizontalLines = [];
      const numBridges = Math.max(8, N * 3);
      const levels = 12; // vertical levels for bridges

      // Distribute deterministic random bridges
      let seed = N * 17;
      function pseudoRand() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      }

      for (let level = 1; level < levels; level++) {
        const yRatio = level / levels;
        // add bridges randomly
        for (let col = 0; col < N - 1; col++) {
          if (pseudoRand() < 0.58) {
            horizontalLines.push({
              yRatio: yRatio + (pseudoRand() * 0.04 - 0.02),
              fromCol: col,
              toCol: col + 1
            });
            // skip next column to prevent overlap
            col++;
          }
        }
      }

      // Sort bridges by top-down level (yRatio)
      horizontalLines.sort((a, b) => a.yRatio - b.yRatio);
    }

    /* ── Render HTML Canvas Ladder ── */
    function drawLadder() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const N = columns.length;
      if (N < 2) return;

      const paddingX = Math.min(80, canvas.width / (N + 1));
      const startY = 64;
      const endY = canvas.height - 70;
      const stepX = (canvas.width - paddingX * 2) / (N - 1);

      // 1. Draw horizontal bridges
      ctx.strokeStyle = "rgba(255,255,255, 0.16)";
      ctx.lineWidth = 4;
      horizontalLines.forEach(line => {
        const x1 = paddingX + line.fromCol * stepX;
        const x2 = paddingX + line.toCol * stepX;
        const y = startY + line.yRatio * (endY - startY);
        
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      });

      // 2. Draw vertical rails
      columns.forEach((col, i) => {
        const x = paddingX + i * stepX;
        
        // draw rail glow
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();

        // draw core rail
        ctx.strokeStyle = "rgba(255,255,255, 0.35)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();

        // draw participant names at the top
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px 'Noto Sans KR', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(col.displayName.slice(0, 4), x, startY - 24);

        // draw circle node at top
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath();
        ctx.arc(x, startY, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // draw bottom node
        ctx.fillStyle = "rgba(255,232,163,0.1)";
        ctx.beginPath();
        ctx.arc(x, endY, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,232,163,0.4)";
        ctx.stroke();

        // draw prize tags at bottom (assigned dynamically according to who hits it)
        const prizeLabel = col.assignedPrize ? col.assignedPrize.slice(0, 6) : "?";
        ctx.fillStyle = col.assignedPrize ? "var(--gold)" : "rgba(255,255,255,0.3)";
        ctx.font = "900 11px 'Noto Sans KR', sans-serif";
        ctx.fillText(prizeLabel, x, endY + 28);
      });

      // 3. Draw active running neon beam
      if (runner && runner.running) {
        ctx.shadowBlur = 18;
        ctx.shadowColor = "var(--neon-blue)";
        ctx.strokeStyle = "var(--neon-blue)";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";

        ctx.beginPath();
        const pts = runner.trailPoints;
        if (pts.length > 0) {
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.stroke();
        }

        // draw running beam head
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(runner.curX, runner.curY, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    /* ── trace paths and figure out where participants end up ── */
    function solveGhostLeg(startCol) {
      const N = columns.length;
      const paddingX = Math.min(80, canvas.width / (N + 1));
      const startY = 64;
      const endY = canvas.height - 70;
      const stepX = (canvas.width - paddingX * 2) / (N - 1);

      let curCol = startCol;
      let curY = startY;
      
      // Save full coordinate trajectory for canvas laser drawer
      const pathPoints = [{ x: paddingX + curCol * stepX, y: curY }];

      // We go top-down level by level, checking if we intersect with horizontal lines
      // Let's sweep levels
      const bridgeCount = horizontalLines.length;
      const traversedBridges = new Set();

      while (curY < endY) {
        // find next closest bridge below current Y that involves curCol
        let nextBridge = null;
        let nextBridgeY = endY;

        for (let i = 0; i < bridgeCount; i++) {
          const bridge = horizontalLines[i];
          const bY = startY + bridge.yRatio * (endY - startY);
          if (bY > curY + 1 && (bridge.fromCol === curCol || bridge.toCol === curCol)) {
            nextBridge = bridge;
            nextBridgeY = bY;
            break; // sorted top-to-bottom so first is closest
          }
        }

        // move down to next bridge Y
        curY = nextBridgeY;
        pathPoints.push({ x: paddingX + curCol * stepX, y: curY });

        if (nextBridge) {
          // move horizontally
          const targetCol = nextBridge.fromCol === curCol ? nextBridge.toCol : nextBridge.fromCol;
          curCol = targetCol;
          pathPoints.push({ x: paddingX + curCol * stepX, y: curY });
        }
      }

      return {
        endCol: curCol,
        points: pathPoints
      };
    }

    /* ── Render Participant cards & Result logs ──────── */
    function renderParticipants(pts, results) {
      const revealed = results.filter(r => seenResults.has(r.id));
      const won = new Map(revealed.map(r => [r.ladder_participant_id || r.participant?.id, r]));
      document.getElementById("p-grid").innerHTML = pts.map(p => {
        const row = won.get(p.id);
        return '<div class="p-row">'
          + '<div class="nm">' + escapeHtml(p.display_name) + '</div>'
          + '<div class="pr"><span class="pill' + (row ? " won" : "") + '">'
          + escapeHtml(row?.prize_label || "대기") + '</span></div>'
          + '</div>';
      }).join("") || '<div class="muted" style="padding:12px 0;grid-column:1/-1;text-align:center">참가자 대기 중</div>';
    }

    function renderResults(results) {
      const revealed = results.filter(r => seenResults.has(r.id));
      const el = document.getElementById("results");
      if (!revealed.length) {
        el.innerHTML = '<div class="res-row"><span class="muted" style="font-size:12px">아직 결과 없음</span></div>';
        return;
      }
      el.innerHTML = revealed.map((row, idx) => {
        const p = row.participant || {};
        const isNew = idx === revealed.length - 1 && animating;
        return '<div class="res-row' + (isNew ? " res-row-new" : "") + '">'
          + '<strong>' + escapeHtml(p.display_name || "이름 없음") + '</strong>'
          + '<span class="pill won">' + escapeHtml(row.prize_label || "완료") + '</span>'
          + '</div>';
      }).join("");
    }

    /* ── Animation queue ── */
    async function runQueue(queue, curCount) {
      animating = true;
      for (const result of queue) {
        const pName = result.participant?.display_name || "참가자";
        await showCountdown(pName);
        await animateLadderClimb(result);
        seenResults.add(result.id);
        
        renderResults(latestResults);
        renderParticipants(participants, latestResults);
        await sleep(700);
      }
      animating = false;
      
      const activeIds = new Set(participants.map(p => p.id));
      const activeRevealed = latestResults.filter(r => activeIds.has(r.ladder_participant_id) && seenResults.has(r.id));
      if (activeRevealed.length >= participants.length && participants.length > 0) {
        showFireworks();
      } else {
        updateWaiting(latestResults.settings || {}, latestResults);
      }
    }

    /* ── 5-second countdown popup before each run ── */
    function showCountdown(pName) {
      return new Promise(function(resolve) {
        cdPrize.textContent = pName;
        cdPop.classList.add("show");
        let count = 5;
        cdNumEl.textContent = String(count);
        cdNumEl.style.animation = "none";
        cdNumEl.offsetHeight; // reflow
        cdNumEl.style.animation = "";
        statusEl.textContent = pName + " 사다리 준비 중...";
        statusBar.textContent = "5초 후 사다리타기가 시작됩니다";

        SFX.countdownBeep(count);
        let tick = setInterval(function() {
          count--;
          if (count <= 0) {
            clearInterval(tick);
            cdPop.classList.remove("show");
            setTimeout(resolve, 230);
          } else {
            SFX.countdownBeep(count);
            cdNumEl.textContent = String(count);
            cdNumEl.style.animation = "none";
            cdNumEl.offsetHeight;
            cdNumEl.style.animation = "";
            statusBar.textContent = count + "초 후 사다리타기가 시작됩니다";
          }
        }, 1000);
      });
    }

    /* ── HTML5 Canvas Ghost Leg Neon Run Animation ── */
    function animateLadderClimb(result) {
      return new Promise(resolve => {
        const startId = result.ladder_participant_id;
        const startIdx = columns.findIndex(col => col.participantId === startId);
        
        const solved = solveGhostLeg(startIdx >= 0 ? startIdx : 0);
        const traj = solved.points;
        const finalColIndex = solved.endCol;

        // Assign the backend prize to this specific bottom column tag for visuals!
        columns[finalColIndex].assignedPrize = result.prize_label;

        // Set up runner state
        runner = {
          running: true,
          points: traj,
          curSeg: 0,
          curX: traj[0].x,
          curY: traj[0].y,
          segProgress: 0,
          trailPoints: [{ x: traj[0].x, y: traj[0].y }]
        };

        SFX.spinStart();
        SFX.fadeBgm(0.03, 1.5);
        SFX.startTick(75);
        statusBar.textContent = result.participant?.display_name + " 님 사다리 활주 중...";
        statusEl.textContent = "실시간 사다리 추첨 진행 중";

        let lastTickTime = Date.now();
        const speed = 0.095; // segment traverse step

        function animate() {
          if (!runner || !runner.running) return;

          const p1 = runner.points[runner.curSeg];
          const p2 = runner.points[runner.curSeg + 1];

          if (!p2) {
            // Reached destination!
            runner.running = false;
            stopClimb();
            return;
          }

          // Interpolate coordinate between segment endpoints
          runner.segProgress += speed;
          if (runner.segProgress >= 1) {
            runner.segProgress = 0;
            runner.curSeg++;
            runner.curX = p2.x;
            runner.curY = p2.y;
            runner.trailPoints.push({ x: p2.x, y: p2.y });
            
            // Bridge cross tick sound
            SFX.pinHit();
          } else {
            runner.curX = p1.x + (p2.x - p1.x) * runner.segProgress;
            runner.curY = p1.y + (p2.y - p1.y) * runner.segProgress;
            // update last trail point to keep it fluid
            if (runner.trailPoints.length > runner.curSeg + 1) {
              runner.trailPoints[runner.curSeg + 1] = { x: runner.curX, y: runner.curY };
            } else {
              runner.trailPoints.push({ x: runner.curX, y: runner.curY });
            }
          }

          drawLadder();
          requestAnimationFrame(animate);
        }

        function stopClimb() {
          SFX.stopTick();
          SFX.fadeBgm(0.09, 2);
          drawLadder();

          const name = result.participant?.display_name || "참가자";
          statusBar.textContent = name + " 님 도달! 🎉 상품: " + result.prize_label;
          statusEl.textContent = "도달: " + name;
          SFX.fanfare();

          wItem.textContent = result.prize_label;
          wName.textContent = name;
          wPop.classList.add("show");

          setTimeout(() => {
            wPop.classList.remove("show");
            // Clear current runner trails
            runner = null;
            drawLadder();
            resolve();
          }, 3500);
        }

        requestAnimationFrame(animate);
      });
    }

    function showFireworks() {
      fwLayer.innerHTML = "";
      const COLORS = ["#FFE8A3","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#10B981","#F97316","#EC4899","#FBBF24"];
      for (let i = 0; i < 100; i++) {
        const el    = document.createElement("div");
        el.className= "fwp";
        const angle = (i / 100) * 2 * Math.PI;
        const dist  = 100 + Math.random() * 220;
        const fx    = (dist * Math.cos(angle)).toFixed(0) + "px";
        const fy    = (dist * Math.sin(angle) - 80).toFixed(0) + "px";
        el.style.cssText = [
          "left:"       + (10 + Math.random() * 80) + "%",
          "top:"        + (15 + Math.random() * 65) + "%",
          "background:" + COLORS[i % COLORS.length],
          "width:"      + (4 + Math.random() * 5)   + "px",
          "height:"     + (4 + Math.random() * 5)   + "px",
          "--fx:"       + fx,
          "--fy:"       + fy,
          "animation:fw-burst " + (0.7 + Math.random() * 1.4) + "s ease-out " + (Math.random() * 0.6) + "s forwards"
        ].join(";");
        fwLayer.appendChild(el);
      }
      fwLayer.classList.add("show");

      SFX.bigFanfare();
      wItem.textContent = "⚡ 전체 사다리 매칭 완료";
      wName.textContent = "모두 축하합니다!";
      wPop.classList.add("show");
      setTimeout(() => {
        wPop.classList.remove("show");
        setTimeout(() => { fwLayer.classList.remove("show"); fwLayer.innerHTML = ""; }, 1200);
      }, 3500);
    }

    function updateWaiting(settings, results) {
      if (settings.draw_mode === "timer" && settings.starts_at && !settings.sequence_completed_at) {
        const diff = new Date(settings.starts_at).getTime() - Date.now();
        if (diff > 0) {
          statusEl.textContent  = "타이머 대기 중";
          statusBar.textContent = "사다리타기 자동 시작까지 " + formatCountdown(diff) + " 남음";
          return;
        }
      }
      if (animating) return;
      
      const activeIds = new Set(participants.map(p => p.id));
      const activeRevealed = results.filter(r => activeIds.has(r.ladder_participant_id) && seenResults.has(r.id));
      
      if (activeRevealed.length >= participants.length && participants.length > 0) {
        statusEl.textContent  = "사다리 완료";
        statusBar.textContent = "모든 추첨이 완료되었습니다. 결과 확인 바랍니다.";
        return;
      }
      statusEl.textContent  = "관리자 실행 대기 중";
      statusBar.textContent = "대기 중";
    }

    /* ══════════════════════════════════════════════════════════
       🔊  SOUND ENGINE  (Web Audio API Synthesized waves)
       ══════════════════════════════════════════════════════════ */
    const SFX = (() => {
      let ctxAudio = null;
      let bgmNodes = null;
      let tickNodes = null;
      let muted = false;

      function getCtx() {
        if (!ctxAudio) ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
        if (ctxAudio.state === "suspended") ctxAudio.resume();
        return ctxAudio;
      }

      function note(freq, dur, vol = 0.18, type = "sine", when = 0, attack = 0.01) {
        const c = getCtx();
        const t = c.currentTime + when;
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + dur + 0.05);
      }

      function noise(dur, vol = 0.08) {
        const c = getCtx();
        const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
        const src = c.createBufferSource();
        src.buffer = buf;
        const g = c.createGain();
        g.gain.setValueAtTime(vol, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
        const flt = c.createBiquadFilter();
        flt.type = "bandpass"; flt.frequency.value = 800;
        src.connect(flt); flt.connect(g); g.connect(c.destination);
        src.start(); src.stop(c.currentTime + dur);
      }

      return {
        startBgm() {
          if (muted || bgmNodes) return;
          const c = getCtx();
          const TEMPO = 0.20; // seconds per note
          const melody = [
            [587,1],[659,1],[698,1],[784,2],[698,1],[659,1],
            [587,1],[523,2],[587,1],[659,1],[698,1],[784,2],[698,1],[659,1],
            [698,1],[587,1],[659,1],[523,1],[587,2],[392,1],[440,1],
            [523,1],[587,2],[523,1],[440,1],[392,2],[349,2]
          ];
          const bass = [
            [147,4],[165,4],[175,4],[196,4],[147,4],[165,4],[131,4],[196,4]
          ];

          const masterGain = c.createGain();
          masterGain.gain.value = 0.07;
          masterGain.connect(c.destination);

          let melOffsets = []; let t = 0;
          melody.forEach(([f, len]) => { melOffsets.push([f, t, len * TEMPO * 0.85]); t += len * TEMPO; });
          const loopDur = t;

          let bassOffsets = []; t = 0;
          bass.forEach(([f, len]) => { bassOffsets.push([f, t, len * TEMPO * 0.85]); t += len * TEMPO; });

          let loopCount = 0;
          let stopped = false;

          function scheduleLoop(startAt) {
            if (stopped || loopCount++ > 120) return;
            melOffsets.forEach(([f, off, dur]) => {
              const o = c.createOscillator(); const g = c.createGain();
              o.type = "triangle"; o.frequency.value = f;
              const s = startAt + off;
              g.gain.setValueAtTime(0, s);
              g.gain.linearRampToValueAtTime(0.4, s + 0.01);
              g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
              o.connect(g); g.connect(masterGain);
              o.start(s); o.stop(s + dur + 0.02);
            });
            bassOffsets.forEach(([f, off, dur]) => {
              const o = c.createOscillator(); const g = c.createGain();
              o.type = "sine"; o.frequency.value = f;
              const s = startAt + off;
              g.gain.setValueAtTime(0.3, s);
              g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
              o.connect(g); g.connect(masterGain);
              o.start(s); o.stop(s + dur + 0.02);
            });
            setTimeout(() => scheduleLoop(startAt + loopDur), (loopDur - 0.3) * 1000);
          }

          scheduleLoop(c.currentTime + 0.05);
          bgmNodes = { gain: masterGain, stop() { stopped = true; masterGain.gain.setTargetAtTime(0, c.currentTime, 0.3); } };
        },
        stopBgm() {
          if (bgmNodes) { bgmNodes.stop(); bgmNodes = null; }
        },
        fadeBgm(targetVol, durationSec) {
          if (!bgmNodes) return;
          const c = getCtx();
          bgmNodes.gain.gain.setTargetAtTime(targetVol, c.currentTime, durationSec / 3);
        },
        countdownBeep(n) {
          if (muted) return;
          const freq = n === 1 ? 987 : 659;
          note(freq, 0.18, 0.22, "sine");
        },
        spinStart() {
          if (muted) return;
          const c = getCtx();
          const t = c.currentTime;
          const o = c.createOscillator(); const g = c.createGain();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(200, t);
          o.frequency.exponentialRampToValueAtTime(1400, t + 0.8);
          g.gain.setValueAtTime(0.12, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 1.0);
          noise(0.18, 0.1);
        },
        startTick(intervalMs) {
          if (muted || tickNodes) return;
          let alive = true;
          function doTick() {
            if (!alive) return;
            // frequency modulates slightly downwards as the laser travels down
            const factor = runner ? (runner.curY / canvas.height) : 0.5;
            const freq = 1500 - (factor * 900) + Math.random() * 100;
            note(freq, 0.02, 0.07, "square");
          }
          let id = setInterval(doTick, intervalMs);
          tickNodes = { stop() { alive = false; clearInterval(id); tickNodes = null; } };
        },
        stopTick() {
          if (tickNodes) { tickNodes.stop(); }
        },
        pinHit() {
          if (muted) return;
          note(380, 0.08, 0.18, "sine");
        },
        fanfare() {
          if (muted) return;
          const melody = [[587,0],[659,0.1],[698,0.2],[880,0.34],[784,0.5],[880,0.65]];
          melody.forEach(([f, when]) => note(f, 0.25, 0.2, "triangle", when));
          for (let i = 0; i < 8; i++) {
            setTimeout(() => noise(0.07 + Math.random() * 0.04, 0.06 + Math.random() * 0.04), 300 + i * 110);
          }
        },
        bigFanfare() {
          if (muted) return;
          const seq = [587,698,880,1174,1396,1760,2349];
          seq.forEach((f, i) => note(f, 0.35, 0.18, "square", i * 0.08));
          for (let i = 0; i < 16; i++) {
            setTimeout(() => noise(0.06 + Math.random() * 0.06, 0.05 + Math.random() * 0.05), i * 95);
          }
        },
        toggleMute() {
          muted = !muted;
          if (muted) this.stopBgm();
          return muted;
        }
      };
    })();

    /* ── SFX Mute button ── */
    (function() {
      const btn = document.createElement("button");
      btn.id = "sfx-mute-btn";
      btn.title = "사운드 켜기/끄기";
      btn.textContent = "🔊";
      btn.style.cssText = "position:fixed;bottom:18px;right:18px;z-index:9999;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(30,30,60,.72);color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);box-shadow:0 2px 12px rgba(0,0,0,.35);transition:opacity .2s;";
      btn.addEventListener("click", () => {
        const m = SFX.toggleMute();
        btn.textContent = m ? "🔇" : "🔊";
        btn.style.opacity = m ? "0.5" : "1";
        if (!m) SFX.startBgm();
      });
      document.body.appendChild(btn);
      document.addEventListener("click", function startOnce() {
        SFX.startBgm();
        document.removeEventListener("click", startOnce);
      }, { once: true });
    })();

    /* ── Helpers ──────────────────────────────────── */
    function formatCountdown(ms) {
      const s = Math.max(0, Math.floor(ms / 1000));
      return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    }
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    function escapeHtml(v) {
      return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    }
  </script>
</body>
</html>`;
}

module.exports = { ladderPage };
