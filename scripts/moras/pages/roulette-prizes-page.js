/**
 * Roulette Prizes Info Page for Moras.
 * Comic / speech-bubble webtoon style explaining the 10 roulette prizes.
 */

function roulettePrizesPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>룰렛 상품 안내 | Moras</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@400;600;800;900&family=Noto+Sans+KR:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07080f;
      --panel: rgba(255,255,255,.04);
      --line: rgba(255,255,255,.08);
      --text: #F1F5F9;
      --muted: #94A3B8;
      --cyan: #00f2fe;
      --purple: #a78bfa;
      --pink: #ff4757;
      --gold: #FFE8A3;
      --gold2: #C59B3F;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Outfit','Noto Sans KR', sans-serif; }
    body { padding-bottom: 72px; }

    /* ── HEADER ─────────────────────────── */
    header {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px; height: 56px;
      background: rgba(7,8,15,.92); backdrop-filter: blur(18px);
      border-bottom: 1px solid var(--line);
    }
    .logo-container { display: flex; align-items: center; gap: 8px; text-decoration: none; }
    .logo-container h1 { font-family:'Cinzel',serif; font-size: 22px; font-weight:800; letter-spacing:.1em;
      background: linear-gradient(135deg,#FFE8A3,#C59B3F,#FFE8A3); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .logo-badge { background: linear-gradient(135deg,#ff4757,#a78bfa); color:#fff; font-size:10px; font-weight:900; padding:3px 8px; border-radius:20px; letter-spacing:.05em; }

    .nav-links { display: flex; gap: 4px; align-items: center; }
    .nav-link { color: var(--muted); text-decoration:none; font-size:14px; font-weight:700; padding:8px 14px; border-radius:12px; transition:all .25s; border:1px solid transparent; white-space:nowrap; }
    .nav-link:hover { color:var(--text); background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.08); }
    .nav-link.active { color:var(--cyan); background:rgba(0,242,254,.06); border-color:rgba(0,242,254,.15); }

    /* Dropdown */
    .nav-dropdown { position: relative; }
    .nav-dropdown-btn { color:var(--muted); background:none; border:1px solid transparent; font-size:14px; font-weight:700; padding:8px 14px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:5px; transition:all .25s; font-family:inherit; white-space:nowrap; }
    .nav-dropdown-btn:hover, .nav-dropdown-btn.open { color:var(--text); background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.08); }
    .nav-dropdown-btn.active { color:var(--gold); background:rgba(255,232,163,.07); border-color:rgba(255,232,163,.18); }
    .nav-dropdown-btn svg { transition: transform .2s; }
    .nav-dropdown-btn.open svg { transform: rotate(180deg); }
    .nav-dropdown-menu { position:absolute; top:calc(100% + 6px); left:0; min-width:160px; background:rgba(14,16,26,.96); border:1px solid rgba(255,255,255,.12); border-radius:14px; padding:6px; box-shadow:0 16px 48px rgba(0,0,0,.6); opacity:0; pointer-events:none; transform:translateY(-8px); transition:opacity .18s,transform .18s; z-index:200; }
    .nav-dropdown-menu.open { opacity:1; pointer-events:auto; transform:translateY(0); }
    .nav-dropdown-item { display:block; color:var(--muted); text-decoration:none; font-size:13px; font-weight:700; padding:8px 14px; border-radius:10px; transition:all .2s; white-space:nowrap; }
    .nav-dropdown-item:hover { color:var(--gold); background:rgba(255,232,163,.08); }
    .nav-dropdown-item.active { color:var(--gold); background:rgba(255,232,163,.1); }

    .cta-btn-header { background:linear-gradient(135deg,var(--cyan),var(--purple)); color:#030712; font-size:13px; font-weight:900; padding:8px 18px; border-radius:12px; text-decoration:none; white-space:nowrap; transition:opacity .2s; }
    .cta-btn-header:hover { opacity:.85; }
    .cta-btn-header.locked { opacity:.5; pointer-events:none; }

    /* ── MAIN ───────────────────────────── */
    main { width: min(860px, calc(100vw - 32px)); margin: 0 auto; padding-top: 40px; }

    /* Hero */
    .prizes-hero { text-align:center; margin-bottom: 48px; }
    .prizes-hero .tag { display:inline-block; background:rgba(255,232,163,.12); border:1px solid rgba(255,232,163,.3); color:var(--gold); font-size:11px; font-weight:900; letter-spacing:.12em; padding:4px 14px; border-radius:20px; margin-bottom:16px; }
    .prizes-hero h2 { font-size:clamp(28px,5vw,44px); font-weight:900; line-height:1.15; margin-bottom:12px; }
    .prizes-hero h2 span { background:linear-gradient(135deg,var(--gold),var(--gold2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .prizes-hero p { color:var(--muted); font-size:16px; line-height:1.7; }
    .prizes-notice {
      display: inline-flex; flex-direction: column; gap: 8px;
      margin-top: 20px; padding: 16px 24px;
      background: rgba(255,232,163,.08); border: 1px solid rgba(255,232,163,.3);
      border-radius: 16px; text-align: left; max-width: 560px; width: 100%;
    }
    .prizes-notice-row { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; line-height: 1.6; color: var(--text); }
    .prizes-notice-row .ni { flex-shrink: 0; font-size: 16px; }
    .prizes-notice-row strong { color: var(--gold); }
    .prizes-notice-row a { color: var(--cyan); font-weight: 700; text-decoration: none; word-break: break-all; }
    .prizes-notice-row a:hover { text-decoration: underline; }

    /* Comic grid */
    .comic-grid { display: flex; flex-direction: column; gap: 32px; }

    /* Each prize panel */
    .prize-panel {
      display: grid;
      grid-template-columns: 72px 1fr;
      gap: 0 20px;
      align-items: start;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 24px 24px 24px 20px;
      position: relative;
      overflow: hidden;
      transition: border-color .25s, box-shadow .25s;
    }
    .prize-panel:hover { border-color: rgba(255,232,163,.22); box-shadow: 0 8px 32px rgba(255,232,163,.07); }
    .prize-panel::before {
      content: "";
      position: absolute; top:0; left:0; right:0; height:3px;
      background: var(--accent, linear-gradient(90deg,var(--cyan),var(--purple)));
      border-radius: 20px 20px 0 0;
    }

    /* Character avatar */
    .char-avatar {
      width: 72px; height: 72px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 34px;
      background: rgba(255,255,255,.06);
      border: 2px solid rgba(255,255,255,.1);
      flex-shrink: 0;
      position: relative;
    }
    .char-avatar .num-badge {
      position: absolute; bottom: -4px; right: -4px;
      width: 22px; height: 22px;
      background: var(--gold); color: #000;
      font-size: 11px; font-weight: 900;
      border-radius: 50%;
      display: flex; align-items:center; justify-content:center;
      border: 2px solid var(--bg);
    }

    /* Speech bubble */
    .bubble-wrap { display: flex; flex-direction: column; gap: 10px; }
    .prize-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .prize-num { font-size: 11px; font-weight: 900; letter-spacing: .1em; color: var(--muted); text-transform: uppercase; }
    .prize-title { font-size: 18px; font-weight: 900; color: var(--gold); }
    .prize-count { background: rgba(255,232,163,.12); border: 1px solid rgba(255,232,163,.25); color: var(--gold); font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }

    .speech-bubble {
      position: relative;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 0 16px 16px 16px;
      padding: 14px 18px;
      color: var(--text);
      font-size: 14.5px;
      line-height: 1.75;
    }
    .speech-bubble::before {
      content: "";
      position: absolute;
      top: 0; left: -10px;
      width: 0; height: 0;
      border-top: 10px solid rgba(255,255,255,.1);
      border-left: 10px solid transparent;
    }
    .speech-bubble strong { color: var(--cyan); }
    .speech-bubble .highlight { color: var(--gold); font-weight: 700; }

    /* Accent colors per prize */
    .prize-panel:nth-child(1)  { --accent: linear-gradient(90deg,#00f2fe,#4facfe); }
    .prize-panel:nth-child(2)  { --accent: linear-gradient(90deg,#f093fb,#f5576c); }
    .prize-panel:nth-child(3)  { --accent: linear-gradient(90deg,#FFE8A3,#C59B3F); }
    .prize-panel:nth-child(4)  { --accent: linear-gradient(90deg,#ff4757,#ff6b81); }
    .prize-panel:nth-child(5)  { --accent: linear-gradient(90deg,#a78bfa,#c084fc); }
    .prize-panel:nth-child(6)  { --accent: linear-gradient(90deg,#fd79a8,#e84393); }
    .prize-panel:nth-child(7)  { --accent: linear-gradient(90deg,#55efc4,#00b894); }
    .prize-panel:nth-child(8)  { --accent: linear-gradient(90deg,#fdcb6e,#e17055); }
    .prize-panel:nth-child(9)  { --accent: linear-gradient(90deg,#74b9ff,#0984e3); }
    .prize-panel:nth-child(10) { --accent: linear-gradient(90deg,#ff7675,#d63031); }

    /* Comic "POW" decoration per panel */
    .comic-deco { position:absolute; top:12px; right:16px; font-size:11px; font-weight:900; letter-spacing:.08em; opacity:.18; text-transform:uppercase; }

    @media (max-width:520px) {
      .prize-panel { grid-template-columns: 56px 1fr; gap: 0 14px; padding: 18px 16px 18px 14px; }
      .char-avatar { width:56px; height:56px; font-size:26px; }
      .speech-bubble { font-size:13.5px; }
      .prize-title { font-size:16px; }
    }
  </style>
</head>
<body>
  <header>
    <a href="/" class="logo-container" aria-label="MORAS 홈으로 이동">
      <h1>MORAS</h1>
      <span class="logo-badge">Matching</span>
    </a>
    <nav class="nav-links">
      <div class="nav-dropdown" id="dd-notice">
        <button class="nav-dropdown-btn active" id="dd-notice-btn" aria-haspopup="true" aria-expanded="false">
          공지사항
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu" id="dd-notice-menu" role="menu">
          <a href="/roulette-prizes" class="nav-dropdown-item active" role="menuitem">🎁 룰렛상품안내</a>
        </div>
      </div>
      <a href="/must-know" class="nav-link" id="link-must-know">필독안내</a>
      <a href="/promo" class="nav-link" id="link-promo">소개웹툰</a>
      <a href="/guide" class="nav-link" id="link-guide">진행방법</a>
      <a href="/info" class="nav-link" id="link-info">안심가이드</a>
      <a href="/matching-info" class="nav-link" id="link-matching-info">알고리즘</a>
      <a href="/mbti-matrix" class="nav-link" id="link-mbti-matrix">MBTI궁합표</a>
    </nav>
    <a href="/" class="cta-btn-header" id="header-cta-btn">이벤트 참가하기</a>
  </header>

  <main>
    <div class="prizes-hero">
      <div class="tag">🎰 ROULETTE PRIZES</div>
      <h2>두근두근 <span>룰렛 상품</span> 안내</h2>
      <p>룰렛에서 당첨되면 아래 특별한 권한 중 하나를 갖게 됩니다!<br>어떤 권한이 나올지 기대하세요 ✨</p>
      <div class="prizes-notice">
        <div class="prizes-notice-row">
          <span class="ni">⏰</span>
          <span><strong>모든 상품은 당첨 후 24시간 이내에 사용 완료</strong>해야 합니다. 기간 내 미사용 시 자동 소멸됩니다.</span>
        </div>
        <div class="prizes-notice-row">
          <span class="ni">🏆</span>
          <span>당첨 결과 확인 및 상품 사용은 아래 페이지에서 진행하세요.<br>
            <a href="https://moras-event-matching.netlify.app/prize-results" target="_blank">https://moras-event-matching.netlify.app/prize-results</a>
          </span>
        </div>
      </div>
    </div>

    <div class="comic-grid">

      <!-- 1. 1:1 대화권 -->
      <div class="prize-panel">
        <div class="comic-deco">CHAT!</div>
        <div class="char-avatar">💬<div class="num-badge">1</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 01</span>
            <span class="prize-title">1:1 대화권 1시간</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "드디어 찬스가 생겼어! 🎉<br>
            <strong>원하는 이성 혹은 동성 1명</strong>을 골라서<br>
            <span class="highlight">1시간 동안 1:1 오픈채팅</span>을 독점할 수 있어.<br>
            지금 궁금했던 그 사람… 바로 지목해봐! 😏"
          </div>
        </div>
      </div>

      <!-- 2. 썸상 인터뷰권 -->
      <div class="prize-panel">
        <div class="comic-deco">INTERVIEW!</div>
        <div class="char-avatar">🎤<div class="num-badge">2</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 02</span>
            <span class="prize-title">썸상 인터뷰권</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "나만의 미니 인터뷰 쇼를 진행할 수 있어! 🎙️<br>
            <strong>원하는 참가자 1명</strong>을 지목하고<br>
            <span class="highlight">준비된 질문 또는 자유 질문 3개</span>로<br>
            그 사람의 진짜 모습을 파헤쳐봐~ 🕵️"
          </div>
        </div>
      </div>

      <!-- 3. 자기소개 상단 고정 -->
      <div class="prize-panel">
        <div class="comic-deco">TOP!</div>
        <div class="char-avatar">📌<div class="num-badge">3</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 03</span>
            <span class="prize-title">자기소개 상단 고정 1시간</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "잠깐, 내가 주인공이 될 시간이야! ⭐<br>
            <span class="highlight">1시간 동안 내 자기소개가 공지 최상단</span>에 고정돼!<br>
            모든 참가자가 내 소개를 보게 되는 거야.<br>
            이 기회를 놓치면 안 되지~ 😎"
          </div>
        </div>
      </div>

      <!-- 4. 강제 얼공지목권 -->
      <div class="prize-panel">
        <div class="comic-deco">FACE!</div>
        <div class="char-avatar">📸<div class="num-badge">4</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 04</span>
            <span class="prize-title">강제 얼공 지목권</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "궁금한 그 사람의 얼굴을 드디어 볼 수 있어! 👀<br>
            <strong>원하는 참가자 1명</strong>을 지목하면<br>
            <span class="highlight">얼공(얼굴 공개) 미션</span>을 수행해야 해!<br>
            누굴 지목할지 두근두근~ 💓"
          </div>
        </div>
      </div>

      <!-- 5. 강제 노래지목권 -->
      <div class="prize-panel">
        <div class="comic-deco">MUSIC!</div>
        <div class="char-avatar">🎵<div class="num-badge">5</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 05</span>
            <span class="prize-title">강제 노래지목권</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "드디어 라이브 무대가 펼쳐진다! 🎤<br>
            <strong>원하는 참가자 1명</strong>을 지목하면<br>
            <span class="highlight">보이스룸에서 노래를 직접 불러야 해!</span><br>
            그 목소리, 기대되는걸~ 🎵🔥"
          </div>
        </div>
      </div>

      <!-- 6. 사생팬 지목권 -->
      <div class="prize-panel">
        <div class="comic-deco">FAN!</div>
        <div class="char-avatar">💗<div class="num-badge">6</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 06</span>
            <span class="prize-title">사생팬 지목권</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "내 전담 팬이 생기는 거야! 🌟<br>
            <strong>원하는 참가자 1명</strong>을 지목하면<br>
            <span class="highlight">1시간 동안 열혈 팬</span>이 되어<br>
            칭찬·응원·리액션을 아낌없이 퍼부어줘야 해! 🙌<br>
            <em style='color:var(--muted);font-size:13px;'>자신을 지목할 수도 있어요 😏</em>"
          </div>
        </div>
      </div>

      <!-- 7. 엄마아빠 지목권 -->
      <div class="prize-panel">
        <div class="comic-deco">FAMILY!</div>
        <div class="char-avatar">👨‍👩‍👧<div class="num-badge">7</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 07</span>
            <span class="prize-title">엄마아빠 지목권</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "오늘 하루만큼은 내 부모님을 직접 만들어! 😂<br>
            한 사람을 <strong>'엄마' 또는 '아빠'</strong>로 지목하면<br>
            <span class="highlight">1시간 동안</span> 그 역할을 충실히 수행해야 해!<br>
            잔소리도, 칭찬도 다 받아줘야 한다는 거~~ 🏠"
          </div>
        </div>
      </div>

      <!-- 8. Pet 지목권 -->
      <div class="prize-panel">
        <div class="comic-deco">PET!</div>
        <div class="char-avatar">🐾<div class="num-badge">8</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 08</span>
            <span class="prize-title">Pet 지목권</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "주인님이 될 기회! 왕관을 써보자~ 👑<br>
            <strong>원하는 참가자 1명</strong>에게 미션을 부여하면<br>
            <span class="highlight">1시간 동안 나를 '주인님'</span>이라고 공손하게 불러야 해!<br>
            고양이상? 강아지상? 누가 어울릴까~ 🐱🐶"
          </div>
        </div>
      </div>

      <!-- 9. AI 지목권 -->
      <div class="prize-panel">
        <div class="comic-deco">AI!</div>
        <div class="char-avatar">🤖<div class="num-badge">9</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 09</span>
            <span class="prize-title">AI 지목권</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "나만의 AI 어시스턴트를 만들 수 있어! 🧠<br>
            <strong>원하는 참가자 1명을 AI로 지정</strong>하면<br>
            <span class="highlight">1시간 동안 모든 대화를 AI처럼</span> 응대해야 해!<br>
            "안녕하세요, 저는 AI입니다. 어떻게 도와드릴까요?" 😄"
          </div>
        </div>
      </div>

      <!-- 10. 상품도둑권 -->
      <div class="prize-panel">
        <div class="comic-deco">STEAL!</div>
        <div class="char-avatar">🦝<div class="num-badge">10</div></div>
        <div class="bubble-wrap">
          <div class="prize-title-row">
            <span class="prize-num">PRIZE 10</span>
            <span class="prize-title">상품도둑권</span>
            <span class="prize-count">× 1</span>
          </div>
          <div class="speech-bubble">
            "남의 상품이 탐나? 그럼 그냥 가져와! 😈<br>
            <strong>다른 참가자의 어떤 룰렛 상품이든 1개</strong>를<br>
            <span class="highlight">내 것으로 가져올 수 있어!</span><br>
            저 사람의 Pet지목권… 탐난다~ 👀💨"
          </div>
        </div>
      </div>

    </div><!-- /comic-grid -->
  </main>

  <script>
    // Dropdown toggle
    const ddBtn = document.getElementById("dd-notice-btn");
    const ddMenu = document.getElementById("dd-notice-menu");
    ddBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      const open = ddMenu.classList.toggle("open");
      ddBtn.classList.toggle("open", open);
      ddBtn.setAttribute("aria-expanded", open);
    });
    document.addEventListener("click", function() {
      ddMenu.classList.remove("open");
      ddBtn.classList.remove("open");
      ddBtn.setAttribute("aria-expanded", false);
    });

    // CTA button open gate
    (function() {
      const openAt  = new Date("2026-06-01T03:00:00Z").getTime();
      const closeAt = new Date("2026-06-02T03:00:00Z").getTime();
      const btn = document.getElementById("header-cta-btn");
      const now = Date.now();
      if (now < openAt || now >= closeAt) {
        btn.classList.add("locked");
        btn.textContent = now >= closeAt ? "신청 마감" : "이벤트 오픈 전";
      }
    })();
  </script>
</body>
</html>`;
}

module.exports = { roulettePrizesPage };
