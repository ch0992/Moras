/**
 * Public Neon Gachapon Capsule Machine page for Moras.
 *
 * Responsibilities:
 * - Render an unauthenticated, fully-responsive premium Neon Gachapon show view.
 * - Draw a highly-aesthetic interactive 3D-like Neon Glass Dome and bouncing capsule collider.
 * - Support physical collision simulation at 60fps.
 * - Synchronize audio synth SFX for mechanical lever pull, rattling balls, whooshing dispense, and capsule popping.
 * - Link selected roulette prizes automatically.
 */

function gachaponPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 네온 가차폰</title>
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
      --neon-purple: #8B5CF6;
    }
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html, body { min-height:100vh; background:var(--bg); color:#fff; font-family:'Noto Sans KR',sans-serif; overflow-x:hidden; }
    body { padding-bottom:48px; }

    /* ── HEADER ─────────────────────────────────── */
    .logo { display:block; text-align:center; padding:22px 0 0; font-family:'Cinzel',serif; font-size:clamp(26px,4vw,50px); font-weight:800; background:var(--gold-g); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; text-decoration:none; letter-spacing:.08em; }
    main { width:min(100vw - 24px, 1800px); margin:0 auto; padding-top:14px; }

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
    .gachapon-panel { border:1px solid var(--line); border-radius:22px; background:var(--panel); padding:24px; display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; position:relative; }
    
    /* ── CANVAS AREA ────────────────────────────── */
    .canvas-wrap { position:relative; width:100%; max-width:850px; background:radial-gradient(circle at center, #060b18 0%, #03060d 100%); border-radius:20px; border:1px solid rgba(255,255,255,.05); overflow:visible; box-shadow:inset 0 0 30px rgba(0,0,0,0.8); cursor:pointer; }
    canvas { display:block; width:100%; height:620px; }

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
    .w-pop { position:fixed; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.65); opacity:0; pointer-events:none; z-index:60; transition:opacity .22s ease; }
    .w-pop.show { opacity:1; pointer-events:auto; }
    .w-card { min-width:min(480px,86vw); padding:40px 44px; border-radius:26px; border:2px solid rgba(255,232,163,.5); background:linear-gradient(135deg,rgba(255,232,163,.2),rgba(8,12,26,.97)); text-align:center; box-shadow:0 0 90px rgba(255,232,163,.42),0 0 0 1px rgba(255,232,163,.08); transform:scale(.78); transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
    .w-pop.show .w-card { transform:scale(1); }
    .w-sublabel { font-size:12px; font-weight:700; letter-spacing:.12em; color:var(--muted); text-transform:uppercase; margin-bottom:8px; }
    .w-prize { font-size:clamp(24px,5vw,50px); font-weight:900; color:var(--gold); text-shadow:0 0 22px rgba(255,232,163,.6); margin-bottom:4px; }
    .w-name { font-family:'Cinzel',serif; font-size:clamp(36px,7vw,78px); font-weight:800; background:var(--gold-g); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.12; }
    .w-emoji { font-size:clamp(28px,4.5vw,52px); margin-top:10px; }

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
        <h1 id="event-title">Moras 네온 가차폰</h1>
      </div>
      <div class="show-side right">
        <div class="lbl">Status</div>
        <div id="status" style="margin-top:6px;font-weight:900;font-size:13px;line-height:1.5;color:var(--gold);text-align:center">대기 중</div>
      </div>
    </section>

    <!-- Prize Orbit Zone -->
    <div class="prize-orbit-zone" id="prize-orbit-zone">
      <div style="color:var(--muted);font-size:13px;">가차폰 상품 목록을 구성하고 있습니다...</div>
    </div>

    <section class="stage">
      <div class="gachapon-panel">
        <div class="canvas-wrap" id="canvas-wrap">
          <canvas id="gachapon-canvas"></canvas>
        </div>
        <div class="status-bar" id="status-bar">대기 중</div>
      </div>
    </section>
  </main>

  <!-- Countdown popup -->
  <div class="cd-pop" id="cd-pop">
    <div class="cd-card">
      <div class="cd-label">🎁 다음 가차 캡슐 상품</div>
      <div class="cd-prize" id="cd-prize">상품명</div>
      <div class="cd-num" id="cd-num">5</div>
    </div>
  </div>

  <!-- Winner popup -->
  <div class="w-pop" id="w-pop">
    <div class="w-card">
      <div class="w-sublabel">🔮 가차 캡슐 개봉 완료</div>
      <div class="w-name" id="w-name">당첨자</div>
      <div style="color:var(--muted);font-size:13px;margin:8px 0 2px;">당첨 상품</div>
      <div class="w-prize" id="w-item">상품</div>
      <div class="w-emoji">⚡</div>
    </div>
  </div>

  <!-- Roster and Results panel below the stage -->
  <main>
    <div class="draw-section">
      <div class="draw-card">
        <div class="panel-hd">Participants</div>
        <div class="p-grid" id="p-grid"></div>
      </div>
      <div class="draw-card">
        <div class="panel-hd">Draw Results</div>
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
    const canvas        = document.getElementById("gachapon-canvas");
    const ctx           = canvas.getContext("2d");
    const canvasWrap    = document.getElementById("canvas-wrap");
    
    const wPop          = document.getElementById("w-pop");
    const wItem         = document.getElementById("w-item");
    const wName         = document.getElementById("w-name");
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

    // Canvas Physics Details
    let spheres = [];
    let physicsIntervalId = null;
    let leverAngle = 0;
    let drawingGoldenSphere = null; // { x, y, r, targetX, targetY, scale, progress, phase }
    let explosions = [];

    const MACHINE_CENTER = { x: 425, y: 250 };
    const DOME_RADIUS = 185;
    const DISPENSE_TUBE_PATH = [
      { x: 425, y: 435 },
      { x: 425, y: 490 },
      { x: 380, y: 520 },
      { x: 280, y: 540 },
      { x: 200, y: 535 },
      { x: 190, y: 540 }
    ];

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
      // Gachapon coordinates are normalized to 850 x 620
      canvas.width = 850;
      canvas.height = 620;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    /* ── Data loading ─────────────────────────────── */
    async function loadState() {
      try {
        const res  = await fetch("/api/gachapon", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "가차폰 상태를 불러오지 못했습니다.");
        renderState(data);
      } catch (e) {
        statusEl.textContent = e.message;
      }
    }

    async function sendPresenceHeartbeat() {
      try {
        const res = await fetch("/api/gachapon", {
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
      const key = "moras_gachapon_view_session";
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

      eventTitle.textContent = settings.event_name || "Moras 네온 가차폰";
      targetCount.textContent = participants.length;
      viewerCount.textContent = String(data.activeViewerCount ?? 1);

      renderPrizeOrbitZone(results);

      // Rebuild physical spheres if list size changes
      if (participants.length !== lastPCount) {
        lastPCount = participants.length;
        syncSpheres(participants, results);
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

    /* ── Sync physical spheres state ── */
    function syncSpheres(pts, results) {
      const activeDrawnIds = new Set(results.map(r => r.gachapon_participant_id));
      const activePts = pts.filter(p => !activeDrawnIds.has(p.id));
      
      const newSpheres = [];
      const colors = ["#06B6D4", "#EC4899", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#F97316"];
      
      activePts.forEach((p, idx) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (DOME_RADIUS - 40);
        
        newSpheres.push({
          id: p.id,
          name: p.display_name,
          initial: p.display_name.slice(0, 1),
          x: MACHINE_CENTER.x + Math.cos(angle) * dist,
          y: MACHINE_CENTER.y + Math.sin(angle) * dist - 20,
          vx: (Math.random() * 2 - 1) * 1.5,
          vy: (Math.random() * 2 - 1) * 1.5,
          r: Math.max(12, Math.min(22, 280 / Math.sqrt(activePts.length + 5))),
          color: colors[idx % colors.length]
        });
      });
      spheres = newSpheres;
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

    /* ── Physics Engine ── */
    function runPhysics(isSwirling = false) {
      const damp = 0.99;
      const gravity = 0.18;
      const domeR = DOME_RADIUS - 12;

      spheres.forEach(s => {
        // Gravitational fall
        if (!isSwirling) {
          s.vy += gravity;
        } else {
          // Swirling vortex force
          const dx = s.x - MACHINE_CENTER.x;
          const dy = s.y - (MACHINE_CENTER.y - 20);
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 5) {
            // Tangential force
            const tx = -dy / dist;
            const ty = dx / dist;
            const swirlStrength = 3.5 + Math.random() * 2.5;
            s.vx += tx * swirlStrength * 0.12;
            s.vy += ty * swirlStrength * 0.12;
            
            // Inward float pull
            s.vx -= (dx / dist) * swirlStrength * 0.05;
            s.vy -= (dy / dist) * swirlStrength * 0.05;
          }
          // Micro rumble noise vibration
          s.vx += (Math.random() * 2 - 1) * 0.6;
          s.vy += (Math.random() * 2 - 1) * 0.6;
        }

        s.x += s.vx;
        s.y += s.vy;
        s.vx *= damp;
        s.vy *= damp;

        // Circular Dome boundaries
        const dx = s.x - MACHINE_CENTER.x;
        const dy = s.y - MACHINE_CENTER.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = domeR - s.r;

        if (dist > maxDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          s.x = MACHINE_CENTER.x + nx * maxDist;
          s.y = MACHINE_CENTER.y + ny * maxDist;
          
          // Elastic reflection
          const dot = s.vx * nx + s.vy * ny;
          s.vx = (s.vx - 2 * dot * nx) * 0.7;
          s.vy = (s.vy - 2 * dot * ny) * 0.7;
        }
      });

      // Sphere-to-Sphere elastic collisions
      for (let i = 0; i < spheres.length; i++) {
        for (let j = i + 1; j < spheres.length; j++) {
          const s1 = spheres[i];
          const s2 = spheres[j];
          const dx = s2.x - s1.x;
          const dy = s2.y - s1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = s1.r + s2.r;

          if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            // Push apart
            s1.x -= nx * overlap * 0.5;
            s1.y -= ny * overlap * 0.5;
            s2.x += nx * overlap * 0.5;
            s2.y += ny * overlap * 0.5;

            // Compute relative normal velocity
            const rvx = s2.vx - s1.vx;
            const rvy = s2.vy - s1.vy;
            const velNormal = rvx * nx + rvy * ny;

            if (velNormal < 0) {
              const impulse = -(1.5 * velNormal) / (1 / s1.r + 1 / s2.r); // Mass proportional to radius
              const ix = nx * impulse;
              const iy = ny * impulse;
              
              s1.vx -= ix / s1.r;
              s1.vy -= iy / s1.r;
              s2.vx += ix / s2.r;
              s2.vy += iy / s2.r;
            }
          }
        }
      }
    }

    /* ── Physics Main Loop ── */
    let frameId = null;
    function loopPhysics() {
      const isSwirl = animating && drawingGoldenSphere && drawingGoldenSphere.phase === "swirl";
      runPhysics(isSwirl);
      drawMachine();
      
      // Update golden capsule if drawing
      if (drawingGoldenSphere) {
        updateGoldenSphere();
      }

      // Update particle explosions
      updateExplosions();

      frameId = requestAnimationFrame(loopPhysics);
    }
    loopPhysics();

    /* ── Render HTML5 Gachapon Canvas ── */
    function drawMachine() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = MACHINE_CENTER.x;
      const cy = MACHINE_CENTER.y;

      // 1. Draw Winding Neon Dispenser Tube
      ctx.strokeStyle = "rgba(6, 182, 212, 0.22)";
      ctx.lineWidth = 44;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      DISPENSE_TUBE_PATH.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      ctx.strokeStyle = "var(--neon-blue)";
      ctx.lineWidth = 4;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "var(--neon-blue)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw inside border core line
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Draw physical capsules (spheres)
      spheres.forEach(s => {
        ctx.save();
        const grad = ctx.createRadialGradient(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.1, s.x, s.y, s.r);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(0.3, s.color);
        grad.addColorStop(1, "rgba(3, 7, 14, 0.95)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Neon Glow Ring border
        ctx.strokeStyle = s.color + "cc";
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Translucent sheen split cap arc
        ctx.strokeStyle = "rgba(255, 255, 255, 0.32)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.85, Math.PI * 1.1, Math.PI * 1.7);
        ctx.stroke();

        // Initials text centered
        ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
        ctx.font = "bold " + Math.max(9, Math.floor(s.r * 0.9)) + "px 'Noto Sans KR', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.initial, s.x, s.y);
        ctx.restore();
      });

      // 3. Draw Translucent Cyber Dome Glass Cover
      ctx.save();
      const glassGrad = ctx.createRadialGradient(cx - DOME_RADIUS * 0.25, cy - DOME_RADIUS * 0.25, DOME_RADIUS * 0.25, cx, cy, DOME_RADIUS);
      glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      glassGrad.addColorStop(0.7, "rgba(6, 182, 212, 0.02)");
      glassGrad.addColorStop(0.95, "rgba(6, 182, 212, 0.18)");
      glassGrad.addColorStop(1, "rgba(6, 182, 212, 0.38)");

      ctx.fillStyle = glassGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, DOME_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Dome Ring Outlines
      ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "var(--neon-blue)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dome glint shine curves
      ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, DOME_RADIUS * 0.94, Math.PI * 1.25, Math.PI * 1.6);
      ctx.stroke();
      ctx.restore();

      // 4. Draw Mechanical Gachapon Base Frame
      ctx.save();
      const baseGrad = ctx.createLinearGradient(cx - 210, cy + 180, cx + 210, cy + 280);
      baseGrad.addColorStop(0, "#080c1b");
      baseGrad.addColorStop(0.5, "#141f3e");
      baseGrad.addColorStop(1, "#080c1b");

      ctx.fillStyle = baseGrad;
      ctx.strokeStyle = "var(--neon-pink)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "var(--neon-pink)";

      // Draw custom trapezoid frame base
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy + 155);
      ctx.lineTo(cx + 150, cy + 155);
      ctx.lineTo(cx + 200, cy + 280);
      ctx.lineTo(cx - 200, cy + 280);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Draw Mechanical Lever
      // Lever rotation pivots at (cx + 250, cy + 210)
      const lx = cx + 200;
      const ly = cy + 210;
      const leverLen = 78;
      const tipX = lx + Math.cos(leverAngle) * leverLen;
      const tipY = ly + Math.sin(leverAngle) * leverLen;

      // Lever shaft
      ctx.strokeStyle = "#8593a6";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      // Lever tip neon sphere
      ctx.fillStyle = "var(--neon-pink)";
      ctx.shadowBlur = 14;
      ctx.shadowColor = "var(--neon-pink)";
      ctx.beginPath();
      ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pivot disk
      ctx.fillStyle = "#2d3855";
      ctx.strokeStyle = "#8593a6";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(lx, ly, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 6. Draw Winner Dispense Port & Golden Capsule inside base frame
      const dispensePort = { x: 190, y: 540 };
      ctx.fillStyle = "#03060c";
      ctx.strokeStyle = "rgba(255, 232, 163, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dispensePort.x, dispensePort.y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw dispensed golden capsule
      if (drawingGoldenSphere && drawingGoldenSphere.phase !== "swirl") {
        drawGoldenCapsule();
      }

      // Draw particles sparks
      drawExplosions();
      ctx.restore();
    }

    /* ── Render dispensed golden capsule ── */
    function drawGoldenCapsule() {
      const s = drawingGoldenSphere;
      ctx.save();
      ctx.shadowBlur = s.r * 0.8;
      ctx.shadowColor = "#F4C35E";

      const grad = ctx.createRadialGradient(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.1, s.x, s.y, s.r);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(0.35, "#F4C35E");
      grad.addColorStop(0.95, "rgba(255, 232, 163, 0.85)");
      grad.addColorStop(1, "rgba(8, 12, 26, 0.98)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#FFE8A3";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw premium glass splitting line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 0.88, Math.PI * 1.1, Math.PI * 1.7);
      ctx.stroke();

      // Winning user name text centered if scale is large enough
      if (s.phase === "popOpen") {
        ctx.fillStyle = "#03070e";
        ctx.font = "bold " + Math.floor(s.r * 0.35) + "px 'Noto Sans KR', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Draw golden ribbon backdrop inside
        ctx.fillText(s.name, s.x, s.y);
      }
      ctx.restore();
    }

    /* ── Golden sphere update sequence ── */
    function updateGoldenSphere() {
      const s = drawingGoldenSphere;
      
      if (s.phase === "swirl") {
        s.progress += 0.012;
        if (s.progress >= 1) {
          s.phase = "slide";
          s.progress = 0;
          SFX.whoosh();
        }
      } else if (s.phase === "slide") {
        s.progress += 0.024;
        const totalPoints = DISPENSE_TUBE_PATH.length;
        const t = s.progress * (totalPoints - 1);
        const idx = Math.floor(t);
        const ratio = t - idx;
        
        if (idx < totalPoints - 1) {
          const p1 = DISPENSE_TUBE_PATH[idx];
          const p2 = DISPENSE_TUBE_PATH[idx + 1];
          s.x = p1.x + (p2.x - p1.x) * ratio;
          s.y = p1.y + (p2.y - p1.y) * ratio;
        } else {
          // Reached dispense slot
          s.phase = "zoom";
          s.progress = 0;
          s.vx = 2.8;
          s.vy = -1.2;
        }
      } else if (s.phase === "zoom") {
        s.progress += 0.016;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12; // slight gravity arc
        s.r = s.baseR + s.progress * 64; // scale up in viewport perspective
        
        if (s.progress >= 1 || s.x > 425) {
          s.phase = "popOpen";
          s.progress = 0;
          triggerCapsulePopExplosion();
        }
      }
    }

    function triggerCapsulePopExplosion() {
      SFX.pop();
      // Generate sparks particles
      const sparkCount = 80;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8.5 + 2.5;
        explosions.push({
          x: drawingGoldenSphere.x,
          y: drawingGoldenSphere.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 3.5 + 1.5,
          color: "hsla(" + (42 + Math.floor(Math.random() * 20)) + ", 100%, 75%, 1)",
          alpha: 1,
          decay: 0.012 + Math.random() * 0.016
        });
      }

      // Display the winner popup immediately
      wItem.textContent = drawingGoldenSphere.prize;
      wName.textContent = drawingGoldenSphere.name;
      wPop.classList.add("show");
      
      // Keep canvas animating fireworks
      triggerFireworks();

      // Complete draw animation sequence after 6 seconds
      setTimeout(() => {
        wPop.classList.remove("show");
        drawingGoldenSphere = null;
        animating = false;
        
        // Render final lists
        renderParticipants(participants, latestResults);
        renderResults(latestResults);
        
        // Execute next item in draw queue
        if (drawQueue.length > 0) {
          const next = drawQueue.shift();
          processDrawResult(next.result, next.totalCount);
        } else {
          statusEl.textContent = "추첨 완료";
          statusBar.textContent = "추첨이 성황리에 종료되었습니다.";
        }
      }, 6000);
    }

    /* ── Sparks explosion updates ── */
    function updateExplosions() {
      explosions = explosions.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.alpha -= p.decay;
        return p.alpha > 0;
      });
    }

    function drawExplosions() {
      explosions.forEach(p => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#F4C35E";
        ctx.fill();
        ctx.restore();
      });
    }

    /* ── Fullscreen Canvas Fireworks Effect ──────────────── */
    function triggerFireworks() {
      return new Promise(function(resolveFireworks) {
        let canvas = document.getElementById("fireworks-canvas");
        if (!canvas) {
          canvas = document.createElement("canvas");
          canvas.id = "fireworks-canvas";
          canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999999;";
          document.body.appendChild(canvas);
        }
        
        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const handleResize = () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        
        let particles = [];
        let fireworks = [];
        let active = true;
        
        function Firework() {
          this.x = Math.random() * width;
          this.y = height;
          this.targetX = Math.random() * width;
          this.targetY = Math.random() * (height * 0.5) + (height * 0.15);
          this.speed = 3 + Math.random() * 4;
          const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
          this.vx = Math.cos(angle) * this.speed;
          this.vy = Math.sin(angle) * this.speed;
          this.hue = Math.floor(Math.random() * 360);
          this.trail = [];
        }
        Firework.prototype.update = function() {
          this.trail.push({ x: this.x, y: this.y });
          if (this.trail.length > 5) this.trail.shift();
          
          this.x += this.vx;
          this.y += this.vy;
          
          if (this.vy >= 0 || Math.abs(this.y - this.targetY) < 10) {
            explode(this.x, this.y, this.hue);
            return false;
          }
          return true;
        };
        Firework.prototype.draw = function() {
          ctx.beginPath();
          ctx.strokeStyle = "hsla(" + this.hue + ", 100%, 70%, 1)";
          ctx.lineWidth = 3;
          if (this.trail.length) {
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            ctx.lineTo(this.x, this.y);
          }
          ctx.stroke();
        };
        
        function Spark(x, y, hue) {
          this.x = x;
          this.y = y;
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 8.5 + 2.5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed - 1.8;
          
          this.isGlitter = Math.random() < 0.28;
          if (this.isGlitter) {
            this.hue = 42 + Math.floor(Math.random() * 8);
            this.saturation = 100;
            this.lightness = 90;
            this.decay = 0.015 + Math.random() * 0.015;
          } else {
            this.hue = hue + Math.floor(Math.random() * 100) - 50;
            this.saturation = 100;
            this.lightness = 65;
            this.decay = 0.007 + Math.random() * 0.007;
          }
          
          this.alpha = 1;
          this.gravity = 0.06;
          this.size = 1.5 + Math.random() * 2.5;
        }
        Spark.prototype.update = function() {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += this.gravity;
          this.alpha -= this.decay;
          return this.alpha > 0;
        };
        Spark.prototype.draw = function() {
          ctx.beginPath();
          const sparkleSize = this.size * this.alpha * (0.75 + Math.random() * 0.4);
          ctx.arc(this.x, this.y, Math.max(0.1, sparkleSize), 0, Math.PI * 2);
          if (this.isGlitter) {
            ctx.fillStyle = "hsla(" + this.hue + ", " + this.saturation + "%, " + this.lightness + "%, " + this.alpha + ")";
          } else {
            ctx.fillStyle = "hsla(" + this.hue + ", 100%, 65%, " + this.alpha + ")";
          }
          ctx.fill();
        };
        
        function explode(x, y, hue) {
          const count = 60 + Math.floor(Math.random() * 20);
          for (let i = 0; i < count; i++) {
            particles.push(new Spark(x, y, hue));
          }
        }
        
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            if (active) fireworks.push(new Firework());
          }, i * 250);
        }
        
        const launchInterval = setInterval(() => {
          if (active && fireworks.length < 5) {
            fireworks.push(new Firework());
          }
        }, 500);
        
        setTimeout(() => {
          clearInterval(launchInterval);
          setTimeout(() => {
            active = false;
            window.removeEventListener("resize", handleResize);
            canvas.remove();
            resolveFireworks();
          }, 2000);
        }, 4000);
        
        function loop() {
          if (!active && !particles.length && !fireworks.length) return;
          
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
          ctx.fillRect(0, 0, width, height);
          ctx.globalCompositeOperation = "lighter";
          
          fireworks = fireworks.filter(fw => {
            const keep = fw.update();
            if (keep) fw.draw();
            return keep;
          });
          
          particles = particles.filter(p => {
            const keep = p.update();
            if (keep) p.draw();
            return keep;
          });
          
          requestAnimationFrame(loop);
        }
        
        loop();
      });
    }

    /* ── Drawing animations queue handler ── */
    let drawQueue = [];
    function runQueue(newResults, totalCount) {
      if (animating) {
        newResults.forEach(r => drawQueue.push({ result: r, totalCount }));
        return;
      }
      const first = newResults[0];
      processDrawResult(first, totalCount);
      newResults.slice(1).forEach(r => drawQueue.push({ result: r, totalCount }));
    }

    function processDrawResult(result, totalCount) {
      animating = true;
      seenResults.add(result.id);
      
      const prizeName = result.prize_label || "참가 상품";
      const winnerName = result.participant?.display_name || "행운아";
      
      // Remove drawn user sphere instantly from domestic pile to prevent duplication
      spheres = spheres.filter(s => s.id !== result.gachapon_participant_id);

      // 1. Show countdown dialog block
      cdPrize.textContent = prizeName;
      cdNumEl.textContent = "5";
      cdPop.classList.add("show");
      SFX.countdownBeep(5);
      
      let count = 5;
      const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
          cdNumEl.textContent = count;
          SFX.countdownBeep(count);
        } else {
          clearInterval(countInterval);
          cdPop.classList.remove("show");
          
          // 2. Trigger Mechanical Lever Down rattle sequence
          pullLeverDown();
        }
      }, 1000);
    }

    function pullLeverDown() {
      SFX.leverPull();
      statusBar.textContent = "가차폰 래틀을 회전하고 있습니다...";
      
      let rotation = 0;
      const animateLever = () => {
        rotation += 0.12;
        leverAngle = Math.sin(rotation) * (Math.PI / 3); // oscillate lever pivot
        
        if (rotation < Math.PI) {
          requestAnimationFrame(animateLever);
        } else {
          leverAngle = 0;
          
          // Start swirling rattling capsules
          SFX.rumbleStart();
          drawingGoldenSphere = {
            x: MACHINE_CENTER.x,
            y: MACHINE_CENTER.y + 40,
            r: 16,
            baseR: 16,
            name: wName.textContent,
            prize: wItem.textContent,
            progress: 0,
            phase: "swirl"
          };

          // Sway vigorously for 3.2 seconds
          setTimeout(() => {
            SFX.rumbleStop();
          }, 3200);
        }
      };
      
      requestAnimationFrame(animateLever);
    }

    /* ── Render Bottom HUD lists ── */
    function renderParticipants(pts, results) {
      const pGrid = document.getElementById("p-grid");
      const drawnMap = new Map(results.map(r => [r.gachapon_participant_id, r.prize_label]));
      
      if (!pts.length) {
        pGrid.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:8px 0;">가차폰에 등록된 참가자가 없습니다.</div>';
        return;
      }

      pGrid.innerHTML = pts.map(p => {
        const prize = drawnMap.get(p.id);
        const cellClass = prize ? 'p-row' : 'p-row';
        const displayLabel = prize ? '<div class="pr"><span class="pill won">🎁 당첨 완료</span></div>' : '<div class="pr"><span class="pill">대기 중</span></div>';
        
        return '<div class="' + cellClass + '">'
          + '<div class="nm">' + escapeHtml(p.display_name) + ' (' + escapeHtml(p.gender || '?') + ')</div>'
          + displayLabel
          + '</div>';
      }).join("");
    }

    function renderResults(results) {
      const rContainer = document.getElementById("results");
      if (!results.length) {
        rContainer.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:8px 0;">아직 추첨 결과가 없습니다.</div>';
        return;
      }
      rContainer.innerHTML = results.map(r => {
        const name = r.participant?.display_name || "행운아";
        return '<div class="res-row">'
          + '<span>👤 ' + escapeHtml(name) + '</span>'
          + '<span style="color:var(--gold);font-weight:900;">🎁 ' + escapeHtml(r.prize_label) + '</span>'
          + '</div>';
      }).join("");
    }

    function updateWaiting(settings, results) {
      if (results.length >= participants.length && participants.length > 0) {
        statusEl.textContent = "추첨 완료";
        statusBar.textContent = "모든 상품 가차폰 추첨이 완료되었습니다!";
      } else {
        statusEl.textContent = "추첨 대기";
        statusBar.textContent = "관리자의 가차 레버 실행을 기다리는 중...";
      }
    }

    function escapeHtml(str) {
      if (!str) return "";
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    /* ══════════════════════════════════════════════════════════
       🔊  SOUND ENGINE  (Web Audio API Synthesized waves)
       ══════════════════════════════════════════════════════════ */
    const SFX = (() => {
      let ctxAudio = null;
      let rumbleNodes = null;
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
        countdownBeep(n) {
          if (muted) return;
          const freq = n === 1 ? 987 : 659;
          note(freq, 0.18, 0.22, "sine");
        },
        leverPull() {
          if (muted) return;
          note(260, 0.15, 0.35, "sawtooth");
          setTimeout(() => note(120, 0.1, 0.25, "triangle"), 80);
        },
        rumbleStart() {
          if (muted || rumbleNodes) return;
          const c = getCtx();
          let alive = true;
          
          function tick() {
            if (!alive) return;
            const f = 110 + Math.random() * 160;
            note(f, 0.08, 0.12, "triangle");
            if (Math.random() < 0.35) {
              note(800 + Math.random() * 600, 0.02, 0.05, "sine"); // plastic ball clacks
            }
            setTimeout(tick, 45 + Math.random() * 35);
          }
          tick();
          rumbleNodes = { stop() { alive = false; rumbleNodes = null; } };
        },
        rumbleStop() {
          if (rumbleNodes) { rumbleNodes.stop(); }
        },
        whoosh() {
          if (muted) return;
          const c = getCtx();
          const t = c.currentTime;
          const o = c.createOscillator();
          const g = c.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(800, t);
          o.frequency.exponentialRampToValueAtTime(250, t + 0.65);
          g.gain.setValueAtTime(0.18, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 0.75);
        },
        pop() {
          if (muted) return;
          note(240, 0.3, 0.4, "sine");
          noise(0.35, 0.22);
          
          // Victory fanfare sparks
          const seq = [523, 659, 784, 1046, 1318];
          seq.forEach((f, i) => note(f, 0.24, 0.15, "square", i * 0.06));
        }
      };
    })();
  </script>
</body>
</html>`;
}

module.exports = { gachaponPage };
