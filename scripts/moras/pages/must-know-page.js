/**
 * Must-Know Event Guide Page (필독안내) for Moras.
 *
 * Responsibilities:
 * - Give participants a concise last-minute summary before the event.
 * - Present the guide as sequential cards without character framing.
 */

function mustKnowPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras - 필독안내</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@300;400;500;700;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #030712;
      --text: #f8fafc;
      --muted: #94a3b8;
      --cyan: #00f2fe;
      --gold-gradient: linear-gradient(135deg, #ffe8a3 0%, #c59b3f 50%, #ffe8a3 100%);
      --line: rgba(255, 255, 255, 0.08);
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 12% 18%, rgba(0, 242, 254, 0.12), transparent 28%),
        radial-gradient(circle at 82% 10%, rgba(255, 108, 171, 0.10), transparent 26%),
        radial-gradient(circle at 50% 80%, rgba(212, 175, 55, 0.08), transparent 30%),
        var(--bg);
      color: var(--text);
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        radial-gradient(1px 1px at 30px 40px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 180px 120px, rgba(0,242,254,0.65), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 360px 260px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 620px 440px, rgba(212,175,55,0.6), rgba(0,0,0,0));
      background-size: 760px 540px;
      opacity: 0.28;
      pointer-events: none;
    }

    header {
      position: fixed;
      top: 0; left: 0; width: 100%;
      min-height: 76px;
      background: rgba(3, 7, 18, 0.78);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      gap: 18px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .logo-container h1 {
      margin: 0;
      font-family: 'Cinzel', serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 0.12em;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 15px rgba(197, 155, 63, 0.3);
    }
    .logo-badge {
      background: linear-gradient(135deg, #ff4757, #a29bfe);
      color: #fff;
      font-size: 10px;
      font-weight: 900;
      padding: 3px 8px;
      border-radius: 20px;
      letter-spacing: 0.05em;
      box-shadow: 0 0 10px rgba(255, 71, 87, 0.4);
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
      margin: 0 auto;
    }
    .nav-link {
      color: var(--muted);
      text-decoration: none;
      font-weight: 800;
      font-size: 15px;
      white-space: nowrap;
    }
    .nav-link:hover, .nav-link.active { color: var(--cyan); }
    .nav-link.active {
      padding: 10px 18px;
      border-radius: 14px;
      background: rgba(0, 242, 254, 0.09);
      border: 1px solid rgba(0, 242, 254, 0.18);
    }
    .nav-dropdown { position: relative; }
    .nav-dropdown-btn { color: var(--muted); background: none; border: 1px solid transparent; font-size: 14px; font-weight: 700; padding: 8px 14px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all .25s; font-family: inherit; white-space: nowrap; }
    .nav-dropdown-btn:hover, .nav-dropdown-btn.open { color: var(--text); background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.08); }
    .nav-dropdown-btn svg { transition: transform .2s; }
    .nav-dropdown-btn.open svg { transform: rotate(180deg); }
    .nav-dropdown-menu { position: absolute; top: calc(100% + 6px); left: 0; min-width: 160px; background: rgba(14,16,26,.96); border: 1px solid rgba(255,255,255,.12); border-radius: 14px; padding: 6px; box-shadow: 0 16px 48px rgba(0,0,0,.6); opacity: 0; pointer-events: none; transform: translateY(-8px); transition: opacity .18s, transform .18s; z-index: 200; }
    .nav-dropdown-menu.open { opacity: 1; pointer-events: auto; transform: translateY(0); }
    .nav-dropdown-item { display: block; color: var(--muted); text-decoration: none; font-size: 13px; font-weight: 700; padding: 8px 14px; border-radius: 10px; transition: all .2s; white-space: nowrap; }
    .nav-dropdown-item:hover { color: #FFE8A3; background: rgba(255,232,163,.08); }
    .cta-btn-header {
      flex-shrink: 0;
      background: rgba(148, 163, 184, 0.2);
      color: #94a3b8;
      text-decoration: none;
      font-weight: 900;
      padding: 12px 24px;
      border-radius: 999px;
    }
    .cta-btn-header:not(.locked) {
      background: var(--gold-gradient);
      color: #10121a;
    }

    main {
      position: relative;
      z-index: 1;
      width: min(940px, calc(100% - 32px));
      margin: 0 auto;
      padding: 128px 0 64px;
    }

    .hero, .guide-card {
      background: linear-gradient(180deg, rgba(13, 20, 40, 0.88), rgba(8, 12, 24, 0.92));
      border: 1px solid var(--line);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
    }
    .hero {
      border-radius: 24px;
      padding: 34px;
      margin-bottom: 18px;
    }
    .eyebrow {
      margin-bottom: 12px;
      color: #ffe8a3;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .hero-title {
      margin: 0;
      font-size: clamp(34px, 5vw, 58px);
      line-height: 1.08;
      letter-spacing: 0;
      font-weight: 900;
    }
    .hero-title span {
      background: linear-gradient(135deg, #fff 0%, #ffe8a3 48%, #b9f7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      margin: 16px 0 0;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.7;
      word-break: keep-all;
    }

    .guide-stack {
      display: grid;
      gap: 18px;
    }
    .guide-card {
      border-radius: 24px;
      padding: 28px;
    }
    .guide-head {
      display: grid;
      grid-template-columns: 48px 1fr;
      gap: 14px;
      align-items: start;
      margin-bottom: 18px;
    }
    .guide-num {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      background: rgba(212, 175, 55, 0.14);
      border: 1px solid rgba(255, 232, 163, 0.24);
      color: #ffe8a3;
      font-size: 18px;
      font-weight: 900;
    }
    .guide-label {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 0 12px;
      margin-bottom: 8px;
      border-radius: 999px;
      background: rgba(0, 242, 254, 0.08);
      color: var(--cyan);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.06em;
    }
    .guide-title {
      margin: 0;
      font-size: 26px;
      line-height: 1.28;
      letter-spacing: 0;
    }
    .guide-desc {
      margin: 0;
      color: #cbd5e1;
      line-height: 1.7;
      word-break: keep-all;
    }

    .split-list, .actions-list, .steps {
      display: grid;
      gap: 12px;
    }
    .split-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .split-item, .action-item, .step, .notice-box {
      padding: 16px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.07);
    }
    .split-item strong, .action-item strong {
      display: block;
      margin-bottom: 6px;
      color: #fff;
      font-size: 18px;
      font-weight: 900;
    }
    .split-item span, .action-item span {
      color: #cbd5e1;
      line-height: 1.6;
      word-break: keep-all;
    }
    .action-item {
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 14px;
      background: rgba(0, 242, 254, 0.06);
      border-color: rgba(0, 242, 254, 0.12);
    }
    .action-num {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: rgba(0, 242, 254, 0.14);
      color: var(--cyan);
      font-weight: 900;
    }

    .step {
      display: grid;
      grid-template-columns: 44px 1fr;
      gap: 14px;
      align-items: start;
    }
    .step-index {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: rgba(212, 175, 55, 0.14);
      color: #ffe8a3;
      font-weight: 900;
    }
    .step-title {
      margin: 0 0 6px;
      font-size: 18px;
      font-weight: 900;
    }
    .step-desc {
      margin: 0;
      color: #cbd5e1;
      line-height: 1.6;
      word-break: keep-all;
    }
    .notice-box {
      background: rgba(212, 175, 55, 0.08);
      border-color: rgba(255, 232, 163, 0.18);
    }

    footer {
      position: relative;
      z-index: 1;
      padding: 32px 20px 44px;
      text-align: center;
      color: rgba(148, 163, 184, 0.75);
      font-size: 13px;
      border-top: 1px solid var(--line);
    }
    footer a { color: #cbd5e1; text-decoration: none; }

    @media (max-width: 980px) {
      header {
        height: auto;
        flex-wrap: wrap;
        padding: 14px 16px;
      }
      .nav-links {
        order: 3;
        width: 100%;
        overflow-x: auto;
        justify-content: flex-start;
        gap: 16px;
        padding-bottom: 4px;
      }
      main { padding-top: 148px; }
      .split-list { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .logo-container h1 { font-size: 22px; }
      .logo-badge { display: none; }
      .cta-btn-header { padding: 10px 14px; font-size: 13px; }
      .hero, .guide-card {
        border-radius: 18px;
        padding: 20px;
      }
      .hero-desc { font-size: 16px; }
      .guide-head, .action-item, .step {
        grid-template-columns: 1fr;
      }
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
        <button class="nav-dropdown-btn" id="dd-notice-btn" aria-haspopup="true" aria-expanded="false">공지사항 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
        <div class="nav-dropdown-menu" id="dd-notice-menu" role="menu">
          <a href="/roulette-prizes" class="nav-dropdown-item" role="menuitem">🎁 룰렛상품안내</a>
        </div>
      </div>
      <a href="/must-know" class="nav-link active" id="link-must-know">필독안내</a>
      <a href="/promo" class="nav-link" id="link-promo">소개웹툰</a>
      <a href="/guide" class="nav-link" id="link-guide">진행방법</a>
      <a href="/info" class="nav-link" id="link-info">안심가이드</a>
      <a href="/matching-info" class="nav-link" id="link-matching-info">알고리즘</a>
      <a href="/mbti-matrix" class="nav-link" id="link-mbti-matrix">MBTI궁합표</a>
    </nav>

    <a href="/" class="cta-btn-header locked" id="header-cta-btn">이벤트 신청하기</a>
  </header>

  <main>
    <section class="hero">
      <div class="eyebrow">MORAS Must Know</div>
      <h2 class="hero-title"><span>이벤트 전</span><br>이것만 확인!</h2>
      <p class="hero-desc">
        아래 순서대로만 확인하면 됩니다. 썸과 친목은 따로 진행되고,
        참가자는 신청 후 필요한 경우에만 커플 여부를 선택합니다.
      </p>
    </section>

    <div class="guide-stack">
      <section class="guide-card" aria-label="이벤트 구분">
        <div class="guide-head">
          <div class="guide-num">1</div>
          <div>
            <span class="guide-label">이벤트 구분</span>
            <h3 class="guide-title">썸과 친목은 따로 진행됩니다</h3>
          </div>
        </div>
        <div class="split-list">
          <div class="split-item">
            <strong>썸</strong>
            <span>썸 참가자끼리 매칭됩니다. 결과 공개 후 커플 여부를 선택합니다.</span>
          </div>
          <div class="split-item">
            <strong>친목</strong>
            <span>친목 참가자별로 재미로 보는 나와 잘 맞는 이성친구를 최대 3명까지 확인합니다.</span>
          </div>
        </div>
      </section>

      <section class="guide-card" aria-label="참가자가 할 일">
        <div class="guide-head">
          <div class="guide-num">2</div>
          <div>
            <span class="guide-label">참가자 할 일</span>
            <h3 class="guide-title">해야 할 일은 두 가지입니다</h3>
          </div>
        </div>
        <div class="actions-list">
          <div class="action-item">
            <div class="action-num">1</div>
            <div>
              <strong>이벤트 신청</strong>
              <span>참여 목적을 고르고 정보를 입력합니다.</span>
            </div>
          </div>
          <div class="action-item">
            <div class="action-num">2</div>
            <div>
              <strong>결과에 따라 선택</strong>
              <span>썸 매칭 커플로 공개된 경우 24시간 안에 커플 여부를 투표합니다.</span>
            </div>
          </div>
        </div>
      </section>

      <section class="guide-card" aria-label="이벤트 진행 순서">
        <div class="guide-head">
          <div class="guide-num">3</div>
          <div>
            <span class="guide-label">진행 순서</span>
            <h3 class="guide-title">이 순서대로 진행됩니다</h3>
          </div>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-index">1</div>
            <div>
              <p class="step-title">신청 시작</p>
              <p class="step-desc">5월 31일 11:00(CDT) / 6월 1일 01:00(KST)에 시작해 24시간 동안 신청을 받습니다.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-index">2</div>
            <div>
              <p class="step-title">매칭 결과 공개</p>
              <p class="step-desc">신청 마감 12시간 후, 매칭 알고리즘에 따라 결과가 공개됩니다.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-index">3</div>
            <div>
              <p class="step-title">썸 참가자 투표</p>
              <p class="step-desc">썸 매칭 커플로 공개된 참가자는 결과 공개 후 24시간 안에 커플 여부를 선택합니다.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-index">4</div>
            <div>
              <p class="step-title">상호 매칭 확인</p>
              <p class="step-desc">투표 마감 후 공개되는 상호 매칭 결과를 확인하면 이벤트 참여가 마무리됩니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="guide-card" aria-label="룰렛 이벤트">
        <div class="guide-head">
          <div class="guide-num">4</div>
          <div>
            <span class="guide-label">룰렛 이벤트</span>
            <h3 class="guide-title">참가자만 참여할 수 있습니다</h3>
          </div>
        </div>
        <div class="notice-box">
          <p class="guide-desc">
            이번 룰렛은 이벤트 참가자만 참여할 수 있습니다.
            또한 이번 이벤트에서만 제공되는 특별 상품이 준비될 예정입니다.
          </p>
        </div>
      </section>
    </div>
  </main>

  <footer>
    <p>&copy; 2026 MORAS. All rights reserved.</p>
    <p>재미와 조화로운 커뮤니티 연결을 목표로 합니다. 결정론적인 운명 해석은 피해주세요. | <a href="/admin">어드민 로그인</a></p>
  </footer>

  <script>
    const eventStartTime = new Date("2026-05-31T16:00:00Z").getTime();
    const headerBtn = document.getElementById("header-cta-btn");

    function updateCountdown() {
      if (eventStartTime - Date.now() <= 0 && headerBtn) {
        headerBtn.classList.remove("locked");
        headerBtn.href = "/";
        headerBtn.textContent = "지금 신청하기";
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
    (function() { var btn=document.getElementById("dd-notice-btn"),menu=document.getElementById("dd-notice-menu"); if(!btn||!menu)return; btn.addEventListener("click",function(e){e.stopPropagation();var o=menu.classList.toggle("open");btn.classList.toggle("open",o);btn.setAttribute("aria-expanded",o);}); document.addEventListener("click",function(){menu.classList.remove("open");btn.classList.remove("open");btn.setAttribute("aria-expanded",false);}); })();
  </script>
</body>
</html>`;
}

module.exports = { mustKnowPage };
