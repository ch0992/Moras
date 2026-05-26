/**
 * Public roulette show page for Moras.
 *
 * Responsibilities:
 * - Render a public, unauthenticated roulette show view.
 * - Poll public roulette state and animate sequential item winners.
 * - Keep admin actions, storage, and auth out of this file.
 */

function roulettePage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 룰렛</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #03070e;
      --panel: rgba(255,255,255,.042);
      --line: rgba(255,255,255,.10);
      --gold: #FFE8A3;
      --gold-g: linear-gradient(135deg,#FFE8A3 0%,#F4C35E 50%,#FFE8A3 100%);
      --muted: rgba(255,255,255,.52);
    }
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html, body { min-height:100vh; background:var(--bg); color:#fff; font-family:'Noto Sans KR',sans-serif; }
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

    /* ── CLOUD ZONE (orbit items) ───────────────── */
    .cloud-zone { position:relative; height:110px; margin:6px 0 14px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .cloud-chip { position:absolute; left:50%; top:50%; padding:7px 13px; border-radius:999px; background:rgba(255,255,255,.11); border:1px solid rgba(255,255,255,.18); color:#fff; font-weight:900; font-size:13px; box-shadow:0 6px 16px rgba(0,0,0,.32); will-change:transform; white-space:nowrap; pointer-events:none; transition:background .3s, border-color .3s, color .3s, opacity .5s; }
    .cloud-chip.lit { background:rgba(255,232,163,.26); border-color:rgba(255,232,163,.55); color:var(--gold); box-shadow:0 0 22px rgba(255,232,163,.35); }
    .cloud-chip.vanish { opacity:0; transform:scale(1.5) !important; transition:opacity .5s ease, transform .5s ease; }
    /* Flash text in cloud zone when item is drawn */
    .cloud-flash-text { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) scale(1); font-family:'Cinzel',serif; font-size:clamp(26px,5vw,52px); font-weight:800; color:var(--gold); text-shadow:0 0 32px rgba(255,232,163,.85); white-space:nowrap; pointer-events:none; z-index:10; opacity:0; }
    .cloud-flash-text.pop { animation:cf-pop 2.4s cubic-bezier(.34,1.1,.64,1) forwards; }
    @keyframes cf-pop { 0%{opacity:0;transform:translate(-50%,-50%) scale(.3)} 18%{opacity:1;transform:translate(-50%,-50%) scale(1.1)} 40%{opacity:1;transform:translate(-50%,-50%) scale(1)} 75%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(.85)} }

    /* ── STAGE LAYOUT ───────────────────────────── */
    .stage { display:flex; justify-content:center; }
    .wheel-panel { border:1px solid var(--line); border-radius:22px; background:var(--panel); padding:22px 22px 16px; display:flex; flex-direction:column; align-items:center; gap:12px; width:100%; }

    /* ── WHEEL AREA ─────────────────────────────── */
    .wheel-wrap { position:relative; width:min(780px,92vw); aspect-ratio:1; display:grid; place-items:center; }

    /* Fixed pointer / flapper at top */
    .ptr { position:absolute; top:-4px; left:50%; transform:translateX(-50%); width:22px; z-index:20; display:flex; flex-direction:column; align-items:center; transition:transform .06s ease-out; transform-origin:50% 100%; }
    .ptr-body { width:22px; height:38px; border-radius:5px 5px 0 0; background:linear-gradient(to bottom,#7B4A15,#C8854A,#7B4A15); box-shadow:0 0 12px rgba(200,133,74,.5); }
    .ptr-tip { width:0; height:0; border-left:11px solid transparent; border-right:11px solid transparent; border-top:20px solid #9A5C28; filter:drop-shadow(0 4px 6px rgba(0,0,0,.5)); }
    .ptr.hit { animation:ptr-hit .15s ease-in-out; }

    /* Spinning wheel */
    .wheel { position:absolute; inset:0; border-radius:50%; border:9px solid rgba(255,232,163,.28); box-shadow:inset 0 0 60px rgba(0,0,0,.55),0 0 50px rgba(255,232,163,.16); transition:transform 12s cubic-bezier(.04,.82,.05,1); will-change:transform; }
    .wheel.fast-glow { border-color:rgba(255,232,163,.65); box-shadow:inset 0 0 60px rgba(0,0,0,.55),0 0 90px rgba(255,232,163,.45); }

    /* ── SEGMENT NAMES ──────────────────────────── */
    /* .snw = zero-size rotation wrapper positioned at wheel center */
    .snw { position:absolute; left:50%; top:50%; width:0; height:0; pointer-events:none; }
    /* .sni = name pill, absolutely positioned inside the rotated wrapper */
    .sni { position:absolute; left:0; transform:translate(-50%,-50%); background:rgba(3,7,14,.82); border:1px solid rgba(255,255,255,.26); border-radius:999px; padding:3px 7px; font-weight:900; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,1); white-space:nowrap; line-height:1.2; }

    /* Divider lines between segments */
    .seg-div { position:absolute; left:calc(50% - 1px); top:0; width:2px; height:50%; background:rgba(0,0,0,.4); transform-origin:50% 100%; transform:rotate(var(--da)); }

    /* Edge pins at segment boundaries (rotate with wheel) */
    .epin { position:absolute; left:50%; top:50%; width:9px; height:24px; margin:-12px 0 0 -4.5px; border-radius:3px 3px 6px 6px; background:linear-gradient(to right,#5C2E0A,#BE7B3A,#5C2E0A); box-shadow:0 2px 7px rgba(0,0,0,.65),inset 0 1px 2px rgba(255,200,100,.3); transform:rotate(var(--pa)) translateY(var(--pr)); transform-origin:50% 50%; z-index:5; }

    /* Center disc */
    .center { position:relative; z-index:8; width:40%; aspect-ratio:1; border-radius:50%; display:grid; place-items:center; text-align:center; padding:12px; color:var(--gold); background:radial-gradient(circle,rgba(8,18,36,.97) 60%,rgba(3,7,18,.92) 100%); border:2px solid rgba(255,232,163,.28); font-size:clamp(18px,2.6vw,34px); font-weight:900; text-shadow:0 0 14px rgba(255,232,163,.3); box-shadow:0 0 30px rgba(0,0,0,.7),inset 0 0 16px rgba(255,232,163,.06); }

    /* Status bar */
    .status-bar { width:100%; text-align:center; font-size:14px; font-weight:700; color:rgba(255,255,255,.7); min-height:22px; }

    /* ── LIST PANEL (removed from stage, now below) ── */
    .panel-hd { font-family:'Cinzel',serif; font-size:13px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; margin-bottom:12px; }
    .p-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:7px; }
    .p-row { padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); font-size:12px; }
    .p-row .nm { font-weight:900; font-size:13px; }
    .p-row .pr { margin-top:3px; }
    .pill { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:700; background:rgba(255,255,255,.09); color:var(--muted); }
    .pill.won { background:rgba(255,232,163,.22); color:var(--gold); border:1px solid rgba(255,232,163,.3); }
    /* ── DRAW SECTION (participants + results at bottom) ─ */
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
    @keyframes ptr-hit { 0%{transform:translateX(-50%) rotate(0deg)} 25%{transform:translateX(-50%) rotate(-22deg)} 65%{transform:translateX(-50%) rotate(8deg)} 82%{transform:translateX(-50%) rotate(-5deg)} 100%{transform:translateX(-50%) rotate(0deg)} }
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

    /* ── JOIN PANEL ─────────────────────────────── */
    .join-panel { margin:22px 0 0; border:1px solid rgba(255,232,163,.28); border-radius:18px; background:linear-gradient(135deg,rgba(255,232,163,.07),rgba(8,12,26,.92)); padding:20px 22px; }
    .join-panel h2 { margin:0 0 14px; font-family:'Cinzel',serif; font-size:16px; color:var(--gold); letter-spacing:.05em; }
    .join-search { display:flex; gap:10px; margin-bottom:12px; }
    .join-search input { flex:1; min-width:0; height:42px; border-radius:10px; border:1px solid var(--line); background:rgba(5,8,17,.72); color:#fff; padding:0 14px; font-family:inherit; font-size:14px; font-weight:700; }
    .join-search input:focus { outline:none; border-color:rgba(255,232,163,.5); }
    .join-search button { height:42px; padding:0 20px; border:0; border-radius:10px; background:var(--gold-g); color:#03070e; font-family:inherit; font-weight:900; font-size:14px; cursor:pointer; white-space:nowrap; }
    .join-results { display:flex; flex-direction:column; gap:7px; max-height:260px; overflow:auto; }
    .join-row { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:9px 12px; border:1px solid rgba(255,255,255,.07); border-radius:10px; background:rgba(255,255,255,.03); }
    .join-row .j-name { font-weight:900; font-size:14px; }
    .join-row .j-gender { font-size:12px; color:var(--muted); margin-left:4px; }
    .join-row button { height:32px; padding:0 14px; border:1px solid rgba(255,232,163,.35); border-radius:8px; background:rgba(255,232,163,.1); color:var(--gold); font-family:inherit; font-weight:800; font-size:12px; cursor:pointer; white-space:nowrap; transition:background .2s; }
    .join-row button:hover { background:rgba(255,232,163,.2); }
    .join-row button:disabled { opacity:.5; cursor:default; }
    .join-msg { margin-top:10px; font-size:13px; font-weight:700; min-height:20px; color:var(--gold); }

    /* ── RESPONSIVE ─────────────────────────────── */
    @media (max-width:860px) {
      .show-head { grid-template-columns:1fr 1fr; gap:8px; }
      .show-title-wrap { grid-column:1 / -1; order:3; }
      .show-side.right { order:4; }
      .show-side.stats { gap:14px; }
      .seg-name { font-size:9px; max-width:66px; margin-left:-33px; }
      main { padding-top:10px; }
      .wheel-wrap { width:min(94vw,640px); }
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
        <h1 id="event-title">Moras 룰렛 이벤트</h1>
      </div>
      <div class="show-side right">
        <div class="lbl">Status</div>
        <div id="status" style="margin-top:6px;font-weight:900;font-size:13px;line-height:1.5;color:var(--gold);text-align:center">대기 중</div>
      </div>
    </section>

    <!-- Cloud zone: selected raffle items orbit here; flash text appears when item drawn -->
    <div class="cloud-zone" id="cloud-zone">
      <div class="cloud-flash-text" id="cloud-flash-text"></div>
    </div>

    <section class="stage">
      <div class="wheel-panel">
        <div class="wheel-wrap" id="wheel-wrap">
          <!-- Fixed pointer/flapper at top -->
          <div class="ptr" id="ptr">
            <div class="ptr-body"></div>
            <div class="ptr-tip"></div>
          </div>
          <!-- Spinning wheel (segments, dividers, edge-pins all rotate together) -->
          <div class="wheel" id="wheel"></div>
          <!-- Center disc (fixed) -->
          <div class="center" id="center">READY</div>
        </div>
        <div class="status-bar" id="status-bar">대기 중</div>
      </div>
    </section>
  </main>

  <!-- Countdown popup (shown 5s before each spin) -->
  <div class="cd-pop" id="cd-pop">
    <div class="cd-card">
      <div class="cd-label">🎯 다음 추첨 항목</div>
      <div class="cd-prize" id="cd-prize">추첨 항목</div>
      <div class="cd-num" id="cd-num">5</div>
    </div>
  </div>

  <!-- Winner popup -->
  <div class="w-pop" id="w-pop">
    <div class="w-card">
      <div class="w-sublabel">🎉 당첨</div>
      <div class="w-prize" id="w-item">추첨 항목</div>
      <div class="w-name" id="w-name">당첨자</div>
      <div class="w-emoji">🎊</div>
    </div>
  </div>
  <!-- Fireworks layer -->
  <div class="fw-layer" id="fw-layer"></div>

  <!-- Self-registration + participants + results -->
  <main>
    <section class="join-panel" id="join-panel">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <h2 style="margin:0;">🎟️ 룰렛 참가신청하기</h2>
        <button type="button" id="btn-roulette-request" title="목록에 신규 사용자 추가 요청" style="height:30px;padding:0 12px;border:1px solid rgba(255,232,163,0.28);border-radius:8px;background:rgba(255,232,163,0.1);color:var(--gold);font-family:inherit;font-size:11px;font-weight:900;letter-spacing:0.06em;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='rgba(255,232,163,0.18)'" onmouseout="this.style.background='rgba(255,232,163,0.1)'">추가요청</button>
      </div>
      <div class="join-search">
        <input id="join-input" placeholder="내 이름을 검색하세요..." autocomplete="off">
        <button id="join-search-btn" type="button">검색</button>
      </div>
      <div class="join-results" id="join-results">
        <div style="color:var(--muted);font-size:13px;padding:8px 4px;">이름을 입력하고 검색 버튼을 누르세요.</div>
      </div>
      <div class="join-msg" id="join-msg"></div>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.3);font-size:11.5px;">* 목록에서 검색이 되지 않는 경우 우측 상단의 추가요청 버튼을 눌러 정보를 입력하여 운영자에게 요청해주세요.</p>
    </section>

  <!-- 추가요청 Modal -->
  <div id="roulette-request-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:200;align-items:center;justify-content:center;padding:24px;">
    <div style="width:min(420px,100%);background:#0a0f1e;border:1px solid rgba(255,232,163,0.28);border-radius:22px;padding:30px 26px;box-shadow:0 40px 100px rgba(0,0,0,0.7);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;">
        <div style="color:var(--gold);font-size:18px;font-weight:900;">목록 추가 요청</div>
        <button type="button" id="roulette-request-close" style="width:34px;height:34px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.05);color:var(--muted);font-size:17px;cursor:pointer;">✕</button>
      </div>
      <form id="roulette-request-form">
        <label style="display:block;margin:0 0 6px;color:var(--muted);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">이름 <span style="color:#f5576c">*</span></label>
        <input id="rrr-name" type="text" required placeholder="실명을 입력해주세요" style="width:100%;height:44px;border:1px solid rgba(255,255,255,0.1);border-radius:12px;background:rgba(5,8,17,0.72);color:#fff;padding:0 16px;font-size:14.5px;box-sizing:border-box;margin-bottom:14px;font-family:inherit">
        <label style="display:block;margin:0 0 6px;color:var(--muted);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">성별 <span style="color:#f5576c">*</span></label>
        <select id="rrr-gender" required style="width:100%;height:44px;border:1px solid rgba(255,255,255,0.1);border-radius:12px;background:rgba(5,8,17,0.72);color:#fff;padding:0 16px;font-size:14.5px;box-sizing:border-box;margin-bottom:14px;font-family:inherit;appearance:auto">
          <option value="" disabled selected>성별 선택</option>
          <option value="남">남</option>
          <option value="여">여</option>
        </select>
        <div id="rrr-error" style="color:#f5576c;font-size:13px;font-weight:600;min-height:18px;margin-bottom:8px;text-align:center"></div>
        <button type="submit" style="width:100%;height:46px;border:0;border-radius:12px;background:linear-gradient(135deg,#FFE8A3 0%,#C59B3F 50%,#FFE8A3 100%);color:#03070e;font-family:inherit;font-weight:900;font-size:15px;cursor:pointer;">추가 요청하기</button>
      </form>
    </div>
  </div>

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
    const statusEl   = document.getElementById("status");
    const statusBar  = document.getElementById("status-bar");
    const eventTitle = document.getElementById("event-title");
    const targetCount= document.getElementById("target-count");
    const viewerCount= document.getElementById("viewer-count");
    const cloudZone  = document.getElementById("cloud-zone");
    const wheelEl    = document.getElementById("wheel");
    const centerEl   = document.getElementById("center");
    const ptr        = document.getElementById("ptr");
    const wPop       = document.getElementById("w-pop");
    const wItem      = document.getElementById("w-item");
    const wName      = document.getElementById("w-name");
    const fwLayer    = document.getElementById("fw-layer");
    const cdPop   = document.getElementById("cd-pop");
    const cdPrize = document.getElementById("cd-prize");
    const cdNumEl = document.getElementById("cd-num");
    /* cloudFlashText is queried fresh each use since rebuildCloud resets innerHTML */
    function getCloudFlash() { return document.getElementById("cloud-flash-text"); }

    /* ── 추가요청 모달 ─────────────────────────────── */
    const rrModal = document.getElementById("roulette-request-modal");
    document.getElementById("btn-roulette-request").addEventListener("click", () => {
      rrModal.style.display = "flex";
      document.getElementById("rrr-name").focus();
    });
    document.getElementById("roulette-request-close").addEventListener("click", () => {
      rrModal.style.display = "none";
    });
    rrModal.addEventListener("click", (e) => { if (e.target === rrModal) rrModal.style.display = "none"; });
    document.getElementById("roulette-request-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("rrr-error");
      errEl.textContent = "";
      const submitBtn = e.target.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "요청 중...";
      try {
        const res = await fetch("/api/roster/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: document.getElementById("rrr-name").value.trim(),
            gender: document.getElementById("rrr-gender").value,
          }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "요청에 실패했습니다.");
        rrModal.style.display = "none";
        document.getElementById("rrr-name").value = "";
        document.getElementById("rrr-gender").value = "";
        alert("추가 요청이 접수되었습니다. 운영자 승인 후 목록에 추가됩니다.");
      } catch (error) {
        errEl.textContent = error.message;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "추가 요청하기";
      }
    });

    /* ── State ────────────────────────────────────── */
    let seenResults   = new Set();
    let firstLoad     = true;
    let rotation      = 0;
    let animating     = false;
    let participants  = [];
    let lastPCount    = -1;
    let cloudRaf      = null;
    let cloudItems    = [];
    let liveTrackRaf  = null;
    let latestResults = []; /* full DB result list, updated on every poll */

    /* ── Live pointer tracking ── reads CSS computed transform every rAF */
    function startLiveTracking(N, people) {
      stopLiveTracking();
      const segDeg = 360 / N;
      function track() {
        try {
          const mat = window.getComputedStyle(wheelEl).transform;
          if (mat && mat !== "none") {
            const vals = mat.slice(7, -1).split(","); /* "matrix(a,b,...)" → ["a","b",...] */
            const cosV = parseFloat(vals[0]);
            const sinV = parseFloat(vals[1]);
            const angleDeg = Math.atan2(sinV, cosV) * 180 / Math.PI;
            /* conic-gradient starts at "from -90deg" (= 9 o'clock).
               At CSS rotation R the pointer (12 o'clock) sees gradient angle (-R + 90) mod 360. */
            const A = ((-angleDeg + 90) % 360 + 360) % 360;
            const idx = Math.floor(A / segDeg) % N;
            const p = people[idx];
            if (p) centerEl.textContent = p.display_name || p.displayName || "?";
          }
        } catch (e) { /* ignore matrix parse errors during transition start */ }
        liveTrackRaf = requestAnimationFrame(track);
      }
      liveTrackRaf = requestAnimationFrame(track);
    }
    function stopLiveTracking() {
      if (liveTrackRaf) { cancelAnimationFrame(liveTrackRaf); liveTrackRaf = null; }
    }

    const viewerSessionId = getViewerSessionId();
    sendPresenceHeartbeat();
    loadState();
    setInterval(loadState, 1200);
    setInterval(sendPresenceHeartbeat, 10000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) sendPresenceHeartbeat();
    });

    /* ── Data loading ─────────────────────────────── */
    async function loadState() {
      try {
        const res  = await fetch("/api/roulette", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "룰렛 상태를 불러오지 못했습니다.");
        renderState(data);
      } catch (e) {
        statusEl.textContent = e.message;
      }
    }

    async function sendPresenceHeartbeat() {
      try {
        const res = await fetch("/api/roulette", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "heartbeat", sessionId: viewerSessionId }),
          keepalive: true,
        });
        const data = await res.json();
        if (data && typeof data.activeViewerCount === "number") {
          viewerCount.textContent = String(data.activeViewerCount);
        }
      } catch (e) {
        /* Presence is best-effort; polling will keep the show running. */
      }
    }

    function getViewerSessionId() {
      const key = "moras_roulette_view_session";
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
      const settings     = data.settings || {};
      const items        = data.items    || [];
      const results      = data.results  || [];
      participants       = data.participants || [];
      const selectedIds  = new Set(settings.selected_item_ids || settings.selectedItemIds || []);
      const selectedItems= items.filter(it => selectedIds.has(it.id));

      eventTitle.textContent = settings.event_name || settings.eventName || "Moras 룰렛 이벤트";
      targetCount.textContent = participants.length;
      viewerCount.textContent = String(data.activeViewerCount ?? 1);

      /* Cloud: display selected items minus already-drawn ones */
      const drawnItemIds = new Set(results.map(r => r.item?.id).filter(Boolean));
      const allDisplay = selectedItems.length ? selectedItems : items;
      const displayItems = allDisplay.filter(it => !drawnItemIds.has(it.id));
      const newIds = displayItems.map(i => i.id).join(",");
      const curIds = cloudItems.map(i => i.id).join(",");
      if (newIds !== curIds && !animating) {
        cloudItems = displayItems;
        rebuildCloud(cloudItems);
      }

      /* Wheel: rebuild only when participant count changes */
      if (participants.length !== lastPCount) {
        lastPCount = participants.length;
        buildWheel(participants);
      }

      latestResults = results; /* always keep latest for runQueue to reference */

      /* During animation, renderResults is driven by runQueue (one-by-one reveal).
         Only update the DOM from polling when NOT animating. */
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
        updateWaiting(settings, selectedItems, results);
        return;
      }
      if (newResults.length && !animating) {
        runQueue(newResults, selectedItems.length, results.length);
      } else if (!animating) {
        updateWaiting(settings, selectedItems, results);
      }
    }

    /* ── Cloud orbit (JS requestAnimationFrame ellipse) ── */
    function rebuildCloud(items) {
      if (cloudRaf) { cancelAnimationFrame(cloudRaf); cloudRaf = null; }
      /* Always keep the flash-text div */
      const flashDiv = '<div class="cloud-flash-text" id="cloud-flash-text"></div>';
      if (!items.length) {
        cloudZone.innerHTML = flashDiv;
        return;
      }
      cloudZone.innerHTML = flashDiv
        + items.map((it, i) => '<div class="cloud-chip" data-label="' + escapeHtml(it.label) + '" data-idx="' + i + '">' + escapeHtml(it.label) + '</div>').join("");
      startOrbit();
    }

    function startOrbit() {
      const chips  = Array.from(cloudZone.querySelectorAll(".cloud-chip"));
      const N      = chips.length;
      if (!N) return;
      const period = 11000; // ms per full revolution
      let   t0     = null;

      function tick(ts) {
        if (!t0) t0 = ts;
        const elapsed = ts - t0;
        /* Ellipse: rx = 40% of cloud-zone width, ry = 26px */
        const zw = cloudZone.offsetWidth || 820;
        const RX = Math.min(zw * 0.39, 330);
        const RY = 26;
        chips.forEach((chip, i) => {
          const phase = (2 * Math.PI * i / N) + (elapsed / period) * 2 * Math.PI;
          const x = RX * Math.cos(phase);
          const y = RY * Math.sin(phase);
          chip.style.transform  = "translate(calc(-50% + " + x.toFixed(1) + "px), calc(-50% + " + y.toFixed(1) + "px))";
          /* Back of ellipse (y > 0) appears slightly behind */
          chip.style.zIndex   = Math.sin(phase) > 0 ? 1 : 3;
          chip.style.opacity  = (0.55 + 0.45 * (Math.sin(phase) + 1) / 2).toFixed(2);
        });
        cloudRaf = requestAnimationFrame(tick);
      }
      cloudRaf = requestAnimationFrame(tick);
    }

    /* ── Wheel builder ────────────────────────────── */
    function buildWheel(pts) {
      const people  = pts.length ? pts : [{ display_name: "READY" }];
      const N       = people.length;
      const segDeg  = 360 / N;
      const COLORS  = ["#164E63","#B45309","#9F1239","#3730A3","#0F766E","#7C2D12","#1E3A5F","#713F12","#065F46","#92400E","#4C1D95","#1E3A5F"];

      /* Conic gradient background */
      wheelEl.style.background = "conic-gradient(from -90deg," +
        people.map((_, i) => COLORS[i % COLORS.length] + " " + (i * 100 / N).toFixed(2) + "% " + ((i+1) * 100 / N).toFixed(2) + "%").join(",") + ")";

      const ww    = document.getElementById("wheel-wrap").offsetWidth || 780;
      const R     = ww / 2;
      /* Name pill sits at 66% radius; pin sits at 90% radius */
      const nameR = "-" + Math.round(R * 0.66) + "px";
      const pinR  = "-" + Math.round(R * 0.90) + "px";
      /* Font size scales with segment count */
      const fs = N > 44 ? "9px" : N > 34 ? "10px" : N > 24 ? "11px" : "12px";

      let html = "";

      /* ── Segment name pills (two-div: rotation wrapper + centered pill) ── */
      people.forEach((person, i) => {
        const a = -90 + (i + 0.5) * segDeg;
        const name = escapeHtml((person.display_name || person.displayName || "?").slice(0, 4));
        /* .snw rotates to segment angle; .sni is centered at nameR distance from center */
        html += '<div class="snw" style="transform:rotate(' + a + 'deg)">'
          + '<div class="sni" style="top:' + nameR + ';font-size:' + fs + '">' + name + '</div>'
          + '</div>';
      });

      /* Segment dividers + edge pins at each boundary */
      for (let i = 0; i < N; i++) {
        const da = -90 + i * segDeg;
        html += '<div class="seg-div" style="--da:' + da + 'deg"></div>';
        /* Show pins only when N ≤ 40 to avoid visual clutter */
        if (N <= 40) {
          html += '<div class="epin" style="--pa:' + da + 'deg;--pr:' + pinR + '"></div>';
        }
      }

      wheelEl.innerHTML = html;
    }

    /* ── Participant + results render ─────────────── */
    function renderParticipants(pts, results) {
      /* Only show wins whose animation has already played (in seenResults) */
      const revealed = results.filter(r => seenResults.has(r.id));
      const won = new Map(revealed.map(r => [r.roulette_participant_id || r.participant?.id, r]));
      document.getElementById("p-grid").innerHTML = pts.map(p => {
        const row = won.get(p.id);
        return '<div class="p-row">'
          + '<div class="nm">' + escapeHtml(p.display_name || p.displayName || "?") + '</div>'
          + '<div class="pr"><span class="pill' + (row ? " won" : "") + '">'
          + escapeHtml(row?.item?.label || "대기") + '</span></div>'
          + '</div>';
      }).join("") || '<div class="muted" style="padding:12px 0;grid-column:1/-1;text-align:center">룰렛 참가자 대기 중</div>';
    }

    function renderResults(results) {
      /* Only show wins whose animation has already played (in seenResults) */
      const revealed = results.filter(r => seenResults.has(r.id));
      const el = document.getElementById("results");
      if (!revealed.length) {
        el.innerHTML = '<div class="res-row"><span class="muted" style="font-size:12px">아직 당첨 결과 없음</span></div>';
        return;
      }
      /* Prepend newest result with highlight animation */
      el.innerHTML = revealed.map((row, idx) => {
        const p = row.participant || {};
        const isNew = idx === revealed.length - 1 && animating; /* newest = last in list, only highlight during queue */
        return '<div class="res-row' + (isNew ? " res-row-new" : "") + '">'
          + '<strong>' + escapeHtml(p.display_name || p.displayName || "이름 없음") + '</strong>'
          + '<span class="pill won">' + escapeHtml(row.item?.label || "당첨") + '</span>'
          + '</div>';
      }).join("");
    }

    /* ── Animation queue ──────────────────────────── */
    async function runQueue(queue, totalItems, curCount) {
      animating = true;
      for (const result of queue) {
        await showCountdown(result.item?.label || "추첨");
        await animateWinner(result);
        /* ← Mark as seen AFTER animation so render only reveals after win */
        seenResults.add(result.id);
        /* Immediately update the Draw Results and Participants panels */
        renderResults(latestResults);
        renderParticipants(participants, latestResults);
        /* Remove drawn item from orbiting cloud */
        const drawnLabel = (result.item?.label || "").trim();
        cloudItems = cloudItems.filter(it => it.label.trim() !== drawnLabel);
        rebuildCloud(cloudItems);
        await sleep(700);
      }
      animating = false;
      if (totalItems && curCount >= totalItems) showFireworks(queue);
    }

    /* ── 5-second countdown before each spin ─────── */
    function showCountdown(itemLabel) {
      return new Promise(function(resolve) {
        cdPrize.textContent = itemLabel || "추첨";
        cdPop.classList.add("show");
        var count = 5;
        cdNumEl.textContent = String(count);
        /* restart CSS animation */
        cdNumEl.style.animation = "none";
        cdNumEl.offsetHeight; // force reflow
        cdNumEl.style.animation = "";
        statusEl.textContent  = itemLabel + " 추첨 시작 준비 중...";
        statusBar.textContent = "5초 후 룰렛이 돌아갑니다";

        SFX.countdownBeep(count);
        var tick = setInterval(function() {
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
            statusBar.textContent = count + "초 후 룰렛이 돌아갑니다";
          }
        }, 1000);
      });
    }

    function animateWinner(result) {
      const person  = result.participant || {};
      const item    = result.item    || {};
      const N       = participants.length || 1;
      const segDeg  = 360 / N;

      /* ---- Find winner's segment index ---- */
      const winnerId  = result.roulette_participant_id || person.id;
      const winnerIdx = participants.findIndex(p => p.id === winnerId);

      /* ---- Calculate exact rotation to land winner at top ----
         Segment i center is at (i+0.5)*segDeg degrees clockwise from top (at rotation=0).
         With total rotation R: that center is at [(i+0.5)*segDeg + R] mod 360 from top.
         For it to be at 0 (top = pointer): R ≡ -(i+0.5)*segDeg  (mod 360)
         i.e. targetMod = (360 - (i+0.5)*segDeg % 360) % 360                         */
      const idx        = winnerIdx >= 0 ? winnerIdx : 0;
      const centerDeg  = (idx + 0.5) * segDeg;
      /* Segment center in wheel local coords = -90 + centerDeg degrees from 12 o'clock.
         After rotation R it appears at (-90 + centerDeg + R) on screen.
         For it to be at the pointer (0°): R = 90 - centerDeg (mod 360). */
      const targetMod  = ((90 - (centerDeg % 360)) + 360) % 360;
      const currentMod = ((rotation % 360) + 360) % 360;
      const adjust     = (targetMod - currentMod + 360) % 360;
      const extraSpins = (7 + Math.floor(Math.random() * 3)) * 360;
      rotation        += extraSpins + adjust;

      /* ---- Highlight the matching cloud chip during spin (don't vanish yet) ---- */
      cloudZone.querySelectorAll(".cloud-chip").forEach(chip => {
        if (chip.dataset.label === (item.label || "").trim()) {
          chip.classList.add("lit");
          chip.classList.remove("vanish");
        } else {
          chip.classList.remove("lit");
        }
      });

      /* ---- Start spinning ---- */
      SFX.spinStart();
      SFX.fadeBgm(0.03, 1.5); /* 배경음 살짝 낮춤 */
      SFX.startTick(220);      /* 틱틱 소리 시작 */
      statusBar.textContent    = "빠르게 회전 중...";
      statusEl.textContent     = "순차 추첨 진행 중";
      wheelEl.style.transition = "transform 12s cubic-bezier(.04,.82,.05,1)";
      wheelEl.classList.add("fast-glow");
      wheelEl.style.transform  = "rotate(" + rotation + "deg)";
      /* Live tracking: update center disc with segment under pointer every frame */
      startLiveTracking(N, participants);

      return new Promise(resolve => {
        /* ---- Pointer bounce effects near end ---- */
        let bouncesDone = 0;
        const BOUNCE_START = 9000; /* ms after spin start */
        const BOUNCE_INTERVAL = 280;
        let bounceTimer = setTimeout(function doBounce() {
          if (bouncesDone < 5) {
            ptr.classList.add("hit");
            SFX.pinHit();
            setTimeout(() => ptr.classList.remove("hit"), 150);
            bouncesDone++;
            bounceTimer = setTimeout(doBounce, BOUNCE_INTERVAL - bouncesDone * 20);
          }
        }, BOUNCE_START);

        setTimeout(() => { statusBar.textContent = "핀에 걸리는 중..."; }, 10000);

        setTimeout(() => {
          clearTimeout(bounceTimer);
          stopLiveTracking();
          SFX.stopTick();
          SFX.fadeBgm(0.09, 2); /* 배경음 복구 */
          wheelEl.classList.remove("fast-glow");
          /* Final pointer hit */
          ptr.classList.add("hit");
          SFX.pinHit();
          setTimeout(() => ptr.classList.remove("hit"), 150);

          const name = person.display_name || person.displayName || "당첨자";
          centerEl.textContent  = name;
          statusBar.textContent = name + " 님 당첨! 🎉";
          statusEl.textContent  = "당첨: " + name;
          SFX.fanfare();

          /* ---- Now vanish the chip and flash its label in the cloud zone ---- */
          cloudZone.querySelectorAll(".cloud-chip").forEach(chip => {
            if (chip.dataset.label === (item.label || "").trim()) {
              chip.classList.add("vanish");
            }
          });
          const cft = getCloudFlash();
          if (cft) {
            cft.textContent = item.label || "추첨";
            cft.classList.remove("pop");
            cft.offsetHeight; /* reflow to restart animation */
            cft.classList.add("pop");
          }

          wItem.textContent = item.label || "당첨";
          wName.textContent = name;
          wPop.classList.add("show");

          /* Remove popup and cloud highlight after display */
          setTimeout(() => {
            wPop.classList.remove("show");
            cloudZone.querySelectorAll(".cloud-chip").forEach(c => c.classList.remove("lit"));
            resolve();
          }, 2400);
        }, 12000);
      });
    }

    function updateWaiting(settings, selectedItems, results) {
      const startVal   = settings.starts_at || settings.startsAt;
      const drawMode   = settings.draw_mode  || settings.drawMode  || "instant";
      const completedAt= settings.sequence_completed_at || settings.auto_spin_executed_at || settings.autoSpinExecutedAt;
      if (completedAt && selectedItems.length && results.length >= selectedItems.length) {
        statusEl.textContent  = "모든 추첨 완료 🎊";
        statusBar.textContent = "모든 추첨 완료";
        return;
      }
      if (drawMode === "timer" && startVal) {
        const diff = new Date(startVal).getTime() - Date.now();
        if (diff > 0) {
          const msg = "시작까지 " + formatCountdown(diff);
          statusEl.textContent = statusBar.textContent = msg;
        } else {
          statusEl.textContent = statusBar.textContent = "순차 추첨 진행 중";
        }
        return;
      }
      statusEl.textContent  = "관리자 실행 대기 중";
      statusBar.textContent = "대기 중";
    }

    /* ── Fireworks ────────────────────────────────── */
    function showFireworks(queue) {
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
      wItem.textContent = "🎊 전체 추첨 완료";
      wName.textContent = "축하합니다!";
      wPop.classList.add("show");
      setTimeout(() => {
        wPop.classList.remove("show");
        setTimeout(() => { fwLayer.classList.remove("show"); fwLayer.innerHTML = ""; }, 1200);
      }, 3200);
    }

    /* ══════════════════════════════════════════════════════════
       🔊  SOUND ENGINE  (Web Audio API – no external files)
       ══════════════════════════════════════════════════════════ */
    const SFX = (() => {
      let ctx = null;
      let bgmNodes = null; /* { osc, gainNode } for background music */
      let tickNodes = null;
      let muted = false;

      function getCtx() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        return ctx;
      }

      /* ── tiny helper: play a single sine/square note ── */
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

      /* ── noise burst (for bounce / hit) ── */
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
        /* 🎵 배경음악: 경쾌한 픽셀 아케이드 반복 루프 */
        startBgm() {
          if (muted || bgmNodes) return;
          const c = getCtx();
          /* Simple chiptune melody: looping via ScriptProcessor-free approach with scheduled notes */
          const TEMPO = 0.18; /* seconds per 16th note */
          const melody = [
            [523,1],[659,1],[784,1],[1047,2],[784,1],[659,1],
            [523,1],[440,2],[523,1],[659,1],[784,1],[880,2],[784,1],[659,1],
            [784,1],[698,1],[659,1],[587,1],[523,2],[392,1],[440,1],
            [523,1],[659,2],[523,1],[440,1],[392,2],[330,2]
          ];
          const bass = [
            [131,4],[165,4],[196,4],[220,4],[131,4],[165,4],[175,4],[196,4]
          ];

          const masterGain = c.createGain();
          masterGain.gain.value = 0.09;
          masterGain.connect(c.destination);

          let melOffsets = []; let t = 0;
          melody.forEach(([f, len]) => { melOffsets.push([f, t, len * TEMPO * 0.85]); t += len * TEMPO; });
          const loopDur = t;

          let bassOffsets = []; t = 0;
          bass.forEach(([f, len]) => { bassOffsets.push([f, t, len * TEMPO * 0.85]); t += len * TEMPO; });

          let stopped = false;

          function scheduleLoop(startAt) {
            if (stopped) return;
            melOffsets.forEach(([f, off, dur]) => {
              const o = c.createOscillator(); const g = c.createGain();
              o.type = "square"; o.frequency.value = f;
              const s = startAt + off;
              g.gain.setValueAtTime(0, s);
              g.gain.linearRampToValueAtTime(0.4, s + 0.01);
              g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
              o.connect(g); g.connect(masterGain);
              o.start(s); o.stop(s + dur + 0.02);
            });
            bassOffsets.forEach(([f, off, dur]) => {
              const o = c.createOscillator(); const g = c.createGain();
              o.type = "triangle"; o.frequency.value = f;
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

        /* 🎡 카운트다운 삑삑 소리 */
        countdownBeep(n) {
          if (muted) return;
          const freq = n === 1 ? 880 : 660;
          note(freq, 0.18, 0.22, "sine");
        },

        /* 🎡 룰렛 시작 "woosh" */
        spinStart() {
          if (muted) return;
          const c = getCtx();
          const t = c.currentTime;
          /* rising sweep */
          const o = c.createOscillator(); const g = c.createGain();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(120, t);
          o.frequency.exponentialRampToValueAtTime(1200, t + 0.6);
          g.gain.setValueAtTime(0.15, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 0.8);
          /* drum hit */
          noise(0.15, 0.12);
        },

        /* 🪡 핀 튕기는 틱틱 소리 (spin 중 주기적으로) */
        startTick(intervalMs) {
          if (muted || tickNodes) return;
          let alive = true;
          function doTick() {
            if (!alive) return;
            note(1200 + Math.random() * 200, 0.04, 0.1, "square");
            noise(0.025, 0.06);
          }
          let id = setInterval(doTick, intervalMs);
          tickNodes = { stop() { alive = false; clearInterval(id); tickNodes = null; } };
        },

        stopTick() {
          if (tickNodes) { tickNodes.stop(); }
        },

        /* 🏆 핀에 걸릴 때 둔탁한 타격음 */
        pinHit() {
          if (muted) return;
          note(180, 0.18, 0.25, "triangle");
          noise(0.08, 0.15);
        },

        /* 🎉 당첨 팡파레 */
        fanfare() {
          if (muted) return;
          const melody = [[523,0],[659,0.1],[784,0.2],[1047,0.34],[880,0.5],[1047,0.65]];
          melody.forEach(([f, when]) => note(f, 0.22, 0.2, "square", when));
          /* 박수 소리: noise bursts */
          for (let i = 0; i < 8; i++) {
            setTimeout(() => noise(0.06 + Math.random() * 0.04, 0.07 + Math.random() * 0.04), 300 + i * 110);
          }
        },

        /* 🎊 전체완료 빅 팡파레 */
        bigFanfare() {
          if (muted) return;
          const seq = [523,659,784,1047,1319,1568,2093];
          seq.forEach((f, i) => note(f, 0.3, 0.18, "square", i * 0.09));
          seq.forEach((f, i) => note(f * 0.5, 0.35, 0.12, "triangle", i * 0.09 + 0.04));
          for (let i = 0; i < 16; i++) {
            setTimeout(() => noise(0.05 + Math.random() * 0.05, 0.06 + Math.random() * 0.05), i * 90);
          }
        },

        /* 🔕 뮤트 토글 */
        toggleMute() {
          muted = !muted;
          if (muted) this.stopBgm();
          return muted;
        },
        isMuted() { return muted; }
      };
    })();

    /* ── 🔊 Mute button ─────────────────────────────── */
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

    /* ── Self-registration ────────────────────────── */
    document.getElementById("join-search-btn").addEventListener("click", doJoinSearch);
    document.getElementById("join-input").addEventListener("keydown", function(e) {
      if (e.key === "Enter") doJoinSearch();
    });

    async function doJoinSearch() {
      var q = document.getElementById("join-input").value.trim();
      if (!q) return;
      var resultsEl = document.getElementById("join-results");
      var msgEl = document.getElementById("join-msg");
      msgEl.textContent = "";
      resultsEl.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px 4px;">검색 중...</div>';
      try {
        var res = await fetch("/api/roulette", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "search", query: q }),
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || "검색 실패");
        if (!data.results || !data.results.length) {
          resultsEl.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px 4px;">검색 결과가 없습니다. 관리자에게 명단 등록을 요청하세요.</div>';
          return;
        }
        resultsEl.innerHTML = data.results.map(function(p) {
          return '<div class="join-row">'
            + '<div><span class="j-name">' + escapeHtml(p.displayName) + '</span>'
            + '<span class="j-gender">' + escapeHtml(p.gender || "") + '</span></div>'
            + '<button type="button" data-id="' + escapeHtml(p.id) + '" data-name="' + escapeHtml(p.displayName) + '">참가신청</button>'
            + '</div>';
        }).join("");
        resultsEl.querySelectorAll("button[data-id]").forEach(function(btn) {
          btn.addEventListener("click", function() {
            doJoin(btn.dataset.id, btn.dataset.name, btn);
          });
        });
      } catch(e) {
        resultsEl.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px 4px;">' + escapeHtml(e.message) + '</div>';
      }
    }

    async function doJoin(rosterId, displayName, btn) {
      var msgEl = document.getElementById("join-msg");
      btn.disabled = true;
      btn.textContent = "신청 중...";
      msgEl.textContent = "";
      try {
        var res = await fetch("/api/roulette", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "join", rosterId: rosterId }),
        });
        var data = await res.json();
        if (data.already) {
          msgEl.textContent = displayName + " 님은 이미 룰렛에 참가신청되어 있습니다.";
          btn.textContent = "이미 참가";
          return;
        }
        if (!res.ok) throw new Error(data.error || "신청 실패");
        msgEl.textContent = displayName + " 님 참가신청 완료! 🎉 룰렛 참가자 목록에 추가되었습니다.";
        btn.textContent = "신청 완료 ✓";
        btn.style.color = "var(--gold)";
        btn.style.borderColor = "rgba(255,232,163,.6)";
      } catch(e) {
        msgEl.textContent = e.message;
        btn.disabled = false;
        btn.textContent = "다시 시도";
      }
    }
  </script>
</body>
</html>`;
}

module.exports = { roulettePage };
