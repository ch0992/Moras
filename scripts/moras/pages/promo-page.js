/**
 * Promotional Cartoon (Webtoon) Page for Moras - Clean Refined Version.
 *
 * Responsibilities:
 * - Render an engaging, highly colorful webtoon storyboard.
 * - Introduce the Moras concept, characters (Benji, Hayoon, Mila), and easy matching engine logic.
 * - Navigation links in the header split into: 소개웹툰 (active) and 진행방법.
 * - Countdown lock synchronization.
 */

function promoPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras - 우주와 성격의 운명적 만남 (소개 웹툰)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@300;400;500;700;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #030712;
      --bg-gradient: radial-gradient(circle at 50% 20%, #0d1527 0%, #030712 70%, #010205 100%);
      --text: #f8fafc;
      --muted: #94a3b8;
      
      /* Neon Accent Colors */
      --cyan: #00f2fe;
      --pink: #ff4757;
      --gold: #d4af37;
      --gold-gradient: linear-gradient(135deg, #ffe8a3 0%, #c59b3f 50%, #ffe8a3 100%);
      --purple: #a29bfe;
      --orange: #ff9f43;
      
      --panel: rgba(13, 20, 40, 0.75);
      --panel-glow: rgba(0, 242, 254, 0.05);
      --line: rgba(255, 255, 255, 0.06);
    }
    
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg-gradient);
      color: var(--text);
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
      overflow-x: hidden;
      position: relative;
    }
    
    /* Cosmic Background Effects */
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: 
        radial-gradient(1px 1px at 30px 40px, #fff, rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 160px 120px, rgba(0, 242, 254, 0.8), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 280px 290px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 410px 180px, rgba(255, 71, 87, 0.6), rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 600px 380px, rgba(212, 175, 55, 0.6), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 780px 490px, #fff, rgba(0,0,0,0)),
        radial-gradient(2.5px 2.5px at 980px 240px, rgba(162, 155, 254, 0.7), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 1200px 580px, #fff, rgba(0,0,0,0));
      background-size: 1300px 850px;
      opacity: 0.35;
      z-index: -2;
      pointer-events: none;
      animation: spaceSlowDrift 90s linear infinite;
    }
    
    @keyframes spaceSlowDrift {
      from { background-position: 0 0; }
      to { background-position: 1300px 850px; }
    }
    
    /* Glimmering Aura Glows */
    .nebula-glow-1 {
      position: fixed;
      top: -20%; left: -20%;
      width: 70vw; height: 70vh;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.06) 0%, transparent 60%);
      z-index: -1;
      pointer-events: none;
    }
    .nebula-glow-2 {
      position: fixed;
      bottom: -20%; right: -20%;
      width: 70vw; height: 70vh;
      background: radial-gradient(circle, rgba(255, 71, 87, 0.05) 0%, transparent 60%);
      z-index: -1;
      pointer-events: none;
    }
    
    /* Header Navigation */
    header {
      position: fixed;
      top: 0; left: 0; width: 100%;
      height: 76px;
      background: rgba(3, 7, 18, 0.75);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
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
      background: linear-gradient(135deg, var(--pink), var(--purple));
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
      gap: 16px;
    }
    .nav-link {
      color: var(--muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 12px;
      transition: all 0.25s ease;
      border: 1px solid transparent;
    }
    .nav-link:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
    }
    .nav-link.active {
      color: var(--cyan);
      background: rgba(0, 242, 254, 0.06);
      border-color: rgba(0, 242, 254, 0.15);
    }
    
    .cta-btn-header {
      background: linear-gradient(135deg, var(--cyan), var(--purple));
      color: #030712;
      text-decoration: none;
      font-weight: 800;
      font-size: 13.5px;
      padding: 10px 22px;
      border-radius: 30px;
      box-shadow: 0 4px 15px rgba(0, 242, 254, 0.25);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cta-btn-header.locked {
      background: #1e293b;
      color: #64748b;
      cursor: not-allowed;
      box-shadow: none;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Main Layout */
    main {
      width: min(920px, 100% - 32px);
      margin: 110px auto 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 60px;
    }
    
    /* Intro Hero Card */
    .hero-intro {
      width: 100%;
      text-align: center;
      padding: 44px 28px;
      border-radius: 28px;
      background: var(--panel);
      border: 1px solid var(--line);
      box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.06);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden;
    }
    .hero-intro::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at 50% -20%, rgba(0, 242, 254, 0.12) 0%, transparent 60%);
      pointer-events: none;
    }
    
    .hero-tag {
      font-size: 13px;
      font-weight: 800;
      color: var(--cyan);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 12px;
      text-shadow: 0 0 10px rgba(0, 242, 254, 0.3);
    }
    .hero-title {
      font-size: clamp(28px, 4vw, 42px);
      font-weight: 900;
      margin: 0 0 20px;
      background: linear-gradient(135deg, #fff 40%, #a29bfe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
    }
    .hero-desc {
      font-size: clamp(14.5px, 1.8vw, 17px);
      color: var(--muted);
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    /* Timezone Multi-card Layout */
    .timezone-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      width: 100%;
      max-width: 820px;
      margin: 24px auto;
    }
    .timezone-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 16px;
      text-align: center;
      transition: all 0.3s ease;
    }
    .timezone-card:hover {
      border-color: rgba(0, 242, 254, 0.2);
      background: rgba(255, 255, 255, 0.04);
      transform: translateY(-2px);
    }
    .tz-flag {
      font-size: 24px;
      margin-bottom: 6px;
    }
    .tz-name {
      font-size: 13px;
      font-weight: 800;
      color: var(--muted);
      letter-spacing: 0.05em;
    }
    .tz-time {
      font-size: 15px;
      font-weight: 900;
      color: var(--text);
      margin-top: 4px;
    }
    
    /* Floating Digital Countdown Board */
    .countdown-board {
      margin: 28px auto 12px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 242, 254, 0.15);
      border-radius: 20px;
      padding: 20px 24px;
      max-width: 520px;
      box-shadow: 0 0 30px rgba(0, 242, 254, 0.05);
    }
    .countdown-label {
      font-size: 12px;
      font-weight: 800;
      color: var(--cyan);
      letter-spacing: 0.1em;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .countdown-timer {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .cd-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 10px 0;
    }
    .cd-val {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 900;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }
    .cd-lbl {
      font-size: 10px;
      font-weight: 700;
      color: var(--muted);
      margin-top: 4px;
      letter-spacing: 0.05em;
    }
    
    /* Comic Webtoon Scroller */
    .webtoon-scroller {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 80px;
    }
    
    .comic-card {
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .comic-card:hover {
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 35px 80px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1);
    }
    
    .panel-header {
      padding: 24px 28px;
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.02);
    }
    .panel-number {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 900;
      color: #030712;
      background: var(--gold-gradient);
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(197, 155, 63, 0.4);
    }
    .panel-title {
      font-size: 19px;
      font-weight: 700;
      color: var(--text);
      margin: 0;
    }
    .panel-narrator {
      margin-left: auto;
      font-size: 12.5px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 20px;
    }
    .narrator-benji {
      background: rgba(255, 159, 67, 0.15);
      color: var(--orange);
      border: 1px solid rgba(255, 159, 67, 0.3);
    }
    .narrator-hayoon {
      background: rgba(255, 71, 87, 0.15);
      color: var(--pink);
      border: 1px solid rgba(255, 71, 87, 0.3);
    }
    .narrator-mila {
      background: rgba(162, 155, 254, 0.15);
      color: var(--purple);
      border: 1px solid rgba(162, 155, 254, 0.3);
    }
    
    /* Graphic Wrapper */
    .comic-img-container {
      width: 100%;
      position: relative;
      background: #02040a;
      overflow: hidden;
      aspect-ratio: 1;
    }
    .comic-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      display: block;
    }
    .comic-card:hover .comic-img {
      transform: scale(1.02);
    }
    
    /* Cover Banner Image Overlay for correcting baked-in date */
    .cover-overlay-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 16.5%;
      background: #02040a; /* Covers the old baked-in date perfectly */
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 5;
    }
    
    .overlay-center {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    
    .overlay-date {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(14px, 2.3vw, 22px);
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.05em;
      line-height: 1.1;
    }
    
    .overlay-sub {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(8px, 1.4vw, 11px);
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1.1;
    }
    
    .overlay-sub .cyan-text {
      color: var(--cyan);
      text-shadow: 0 0 8px rgba(0, 242, 254, 0.4);
    }
    
    .overlay-right {
      position: absolute;
      right: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.85;
    }
    
    .overlay-logo-icon {
      color: #ffffff;
    }
    
    .overlay-logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 8px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.1;
      text-align: left;
      letter-spacing: 0.05em;
    }
    
    @media (max-width: 540px) {
      .overlay-right {
        display: none;
      }
      .cover-overlay-bar {
        padding: 0 12px;
        height: 18%;
      }
    }
    
    /* Narrative & Speech Bubbles */
    .comic-dialogue-area {
      padding: 32px 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: rgba(0, 0, 0, 0.2);
    }
    
    .bubble {
      position: relative;
      background: rgba(10, 15, 30, 0.85);
      border-radius: 18px;
      padding: 20px 24px;
      border: 1px solid var(--line);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      max-width: 85%;
      align-self: flex-start;
      transition: all 0.3s ease;
    }
    
    .bubble-right {
      align-self: flex-end;
    }
    
    .speaker {
      font-size: 13.5px;
      font-weight: 800;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .speaker::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .speaker-benji { color: var(--orange); }
    .speaker-benji::before { background: var(--orange); box-shadow: 0 0 8px var(--orange); }
    .bubble-benji {
      border-left: 4px solid var(--orange);
      box-shadow: 0 10px 25px rgba(255, 159, 67, 0.05);
    }
    
    .speaker-hayoon { color: var(--pink); }
    .speaker-hayoon::before { background: var(--pink); box-shadow: 0 0 8px var(--pink); }
    .bubble-hayoon {
      border-left: 4px solid var(--pink);
      box-shadow: 0 10px 25px rgba(255, 71, 87, 0.05);
    }
    
    .speaker-mila { color: var(--purple); }
    .speaker-mila::before { background: var(--purple); box-shadow: 0 0 8px var(--purple); }
    .bubble-mila {
      border-left: 4px solid var(--purple);
      box-shadow: 0 10px 25px rgba(162, 155, 254, 0.05);
    }
    
    .dialogue-text {
      font-size: 15px;
      line-height: 1.6;
      color: #e2e8f0;
      margin: 0;
      letter-spacing: -0.01em;
    }
    
    .dialogue-text em {
      font-style: normal;
      font-weight: 800;
      color: #fff;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
    }
    
    .dialogue-tip {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed rgba(255,255,255,0.06);
      font-size: 13px;
      color: var(--muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .dialogue-tip svg {
      flex-shrink: 0;
      color: var(--gold);
    }
    
    /* Final Call To Action */
    .final-cta {
      width: 100%;
      text-align: center;
      padding: 60px 40px;
      border-radius: 28px;
      background: radial-gradient(circle at 50% 50%, rgba(13, 20, 40, 0.9) 0%, rgba(3, 7, 18, 0.95) 100%);
      border: 1px solid rgba(0, 242, 254, 0.2);
      box-shadow: 0 35px 80px rgba(0, 242, 254, 0.1), inset 0 1px 1px rgba(255,255,255,0.08);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      position: relative;
      overflow: hidden;
      margin-top: 40px;
    }
    
    .final-title {
      font-size: clamp(24px, 3.5vw, 36px);
      font-weight: 900;
      margin: 0 0 12px;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.01em;
    }
    
    .final-desc {
      font-size: clamp(14px, 1.8vw, 17px);
      color: var(--muted);
      max-width: 580px;
      margin: 0 auto 36px;
      line-height: 1.6;
    }
    
    .cta-button-main {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, var(--cyan), var(--purple));
      color: #030712;
      text-decoration: none;
      font-weight: 900;
      font-size: clamp(16px, 2vw, 20px);
      padding: 18px 44px;
      border-radius: 40px;
      box-shadow: 0 8px 30px rgba(0, 242, 254, 0.35), 0 0 0 1px rgba(255,255,255,0.1);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      z-index: 10;
    }
    
    .cta-button-main.locked {
      background: #1e293b;
      color: #64748b;
      cursor: not-allowed;
      box-shadow: none;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .cta-button-main::after {
      content: '';
      position: absolute;
      inset: -3px;
      background: linear-gradient(135deg, var(--cyan), var(--purple));
      border-radius: 43px;
      z-index: -1;
      opacity: 0;
      filter: blur(6px);
      transition: opacity 0.3s ease;
    }
    .cta-button-main.locked::after {
      display: none;
    }
    
    .cta-button-main:not(.locked):hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 242, 254, 0.5);
      filter: brightness(1.05);
    }
    
    .cta-button-main:not(.locked):hover::after {
      opacity: 0.6;
    }
    
    /* Footer */
    footer.global-footer {
      width: 100%;
      text-align: center;
      padding: 40px 24px;
      border-top: 1px solid var(--line);
      background: rgba(3, 7, 18, 0.9);
      margin-top: 80px;
      color: var(--muted);
      font-size: 13px;
    }
    footer.global-footer p { margin: 6px 0; }
    footer.global-footer a {
      color: var(--cyan);
      text-decoration: none;
    }
    footer.global-footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      header {
        height: 68px;
        padding: 0 16px;
      }
      .nav-links {
        display: none;
      }
      main {
        margin: 94px auto 60px;
        gap: 40px;
      }
      .hero-intro {
        padding: 28px 18px;
      }
      .comic-card {
        border-radius: 20px;
      }
      .panel-header {
        padding: 16px 20px;
      }
      .comic-dialogue-area {
        padding: 20px 16px;
      }
      .bubble {
        max-width: 95%;
        padding: 16px 18px;
      }
      .final-cta {
        padding: 40px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="nebula-glow-1"></div>
  <div class="nebula-glow-2"></div>
  
  <header>
    <a href="/" class="logo-container" aria-label="MORAS 홈으로 이동">
      <h1>MORAS</h1>
      <span class="logo-badge">Matching</span>
    </a>
    
    <nav class="nav-links">
      <a href="/promo" class="nav-link active" id="link-promo">소개웹툰</a>
      <a href="/guide" class="nav-link" id="link-guide">진행방법</a>
    </nav>
    
    <a href="/" class="cta-btn-header locked" id="header-cta-btn">이벤트 참가하기</a>
  </header>
  
  <main>
    <!-- Intro Hero Card -->
    <section class="hero-intro" id="cover">
      <div class="hero-tag">COSMIC DESTINY MATCHING</div>
      <h2 class="hero-title">MORAS : 운명의 만남!</h2>
      <p class="hero-desc">
        본인의 <strong>MBTI</strong>와 <strong>우주적 사주 오행</strong>이 직조해내는 신비로운 조화!<br>
        글로벌 주요 대륙별 시작 일정을 확인하시고 카운트다운 완료 즉시 운명적인 매치메이킹에 동참하세요.
      </p>
      
      <!-- Timezone Global Grid -->
      <div class="timezone-grid">
        <div class="timezone-card">
          <div class="tz-flag">🇺🇸</div>
          <div class="tz-name">북미 (EDT/CDT/PDT)</div>
          <div class="tz-time">5월 31일 밤 11:00 / 10:00 / 8:00</div>
        </div>
        <div class="timezone-card">
          <div class="tz-flag">🇰🇷</div>
          <div class="tz-name">한국 (KST)</div>
          <div class="tz-time">6월 1일 낮 12:00</div>
        </div>
        <div class="timezone-card">
          <div class="tz-flag">🇦🇺</div>
          <div class="tz-name">호주 (AEST)</div>
          <div class="tz-time">6월 1일 낮 1:00</div>
        </div>
        <div class="timezone-card">
          <div class="tz-flag">🇪🇺</div>
          <div class="tz-name">유럽 (CEST)</div>
          <div class="tz-time">6월 1일 새벽 5:00</div>
        </div>
      </div>
      
      <!-- Digital Real-time Countdown Board -->
      <div class="countdown-board">
        <div class="countdown-label" id="countdown-status">이벤트 오픈 대기 중... ⏳</div>
        <div class="countdown-timer" id="promo-timer">
          <div class="cd-box">
            <div id="promo-days" class="cd-val">00</div>
            <div class="cd-lbl">DAYS</div>
          </div>
          <div class="cd-box">
            <div id="promo-hours" class="cd-val">00</div>
            <div class="cd-lbl">HOURS</div>
          </div>
          <div class="cd-box">
            <div id="promo-minutes" class="cd-val">00</div>
            <div class="cd-lbl">MINUTES</div>
          </div>
          <div class="cd-box">
            <div id="promo-seconds" class="cd-val">00</div>
            <div class="cd-lbl">SECONDS</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Comic Webtoon Scroller -->
    <div class="webtoon-scroller">
      
      <!-- COVER BANNER PANEL -->
      <article class="comic-card">
        <div class="panel-header">
          <span class="panel-number">★</span>
          <h3 class="panel-title">MORAS: 성격과 우주의 특별한 시너지</h3>
          <span class="panel-narrator narrator-benji">Benji</span>
        </div>
        <div class="comic-img-container">
          <img class="comic-img" src="/assets/marketing/promo/cover.png" alt="Moras Promotional Webtoon Cover Banner Illustration">
          <div class="cover-overlay-bar">
            <div class="overlay-center">
              <div class="overlay-date">2026.06.01 | MON | 12:00 | SEOUL</div>
              <div class="overlay-sub">FIND YOUR DESTINY WITH <span class="cyan-text">MBTI & SAJU!</span></div>
            </div>
            <div class="overlay-right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="overlay-logo-icon"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <div class="overlay-logo-text">MBTI &<br>SAJU</div>
            </div>
          </div>
        </div>
        <div class="comic-dialogue-area">
          <div class="bubble bubble-benji">
            <div class="speaker speaker-benji">벤지</div>
            <p class="dialogue-text">
              "안녕! 난 분위기 메이커 벤지야! 세상에 수많은 소개팅과 데이팅 매칭이 있지만,<br>
              가장 중요한 건 역시 <em>나와 소통 성향이 통하는 사람</em>, 그리고 <em>태어난 기운이 나와 보완 관계인 사람</em> 아니겠어?"
            </p>
          </div>
          
          <div class="bubble bubble-benji bubble-right">
            <div class="speaker speaker-benji">벤지</div>
            <p class="dialogue-text">
              "MBTI 성격 궁합과 동양의 오행 철학을 정교한 알고리즘으로 설계한 **MORAS 매칭 이벤트**!<br>
              수학적으로 완벽한 이분 매칭 엔진이 어떻게 인연을 엮어 주는지 쉽게 알려줄게!"
            </p>
          </div>
        </div>
      </article>
      
      <!-- PANEL 2: MILA & EASY ENGINE -->
      <article class="comic-card" id="panel-engine">
        <div class="panel-header">
          <span class="panel-number">1</span>
          <h3 class="panel-title">밀라의 해설: MBTI와 사주 오행의 균형 연산 (아주 쉽게!)</h3>
          <span class="panel-narrator narrator-mila">Mila</span>
        </div>
        <div class="comic-img-container">
          <img class="comic-img" src="/assets/marketing/promo/panel_b.png" alt="Mila explaining Saju and MBTI balancing logic simply">
        </div>
        <div class="comic-dialogue-area">
          <div class="bubble bubble-mila">
            <div class="speaker speaker-mila">밀라 (분석 전문가)</div>
            <p class="dialogue-text">
              "어려운 수학은 잊어주세요! 저희 매칭 엔진은 딱 <em>두 가지만</em> 집중해서 봅니다.<br><br>
              첫째는 **MBTI 성격 소통 궁합**! 서로의 대화 방식이나 성향적 케미가 잘 맞물리는지를 연산해요.<br>
              둘째는 **태어난 날짜의 사주 오행 조화**! 내가 나무(木)의 기운이 부족하고 금(金)이 가득한데,<br>
              상대방이 마침 나무가 넘치고 금이 필요하다면? <em>서로 부족한 기운을 가득 채워주는 것</em>을 수치화하는 것이죠."
            </p>
          </div>
          
          <div class="bubble bubble-mila bubble-right">
            <div class="speaker speaker-mila">밀라 (분석 전문가)</div>
            <p class="dialogue-text">
              "이 두 점수를 합산하여, 한 명만 잘 되는 게 아니라 **참가자 전원이 최고의 궁합 파트너를 만나도록**<br>
              이분 그래프 매칭 엔진이 전체적인 밸런스를 수학적으로 재조율하여 최고의 연분을 골라 준답니다."
            </p>
            <div class="dialogue-tip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>어렵고 복잡한 연산은 MORAS 엔진이 도맡아 하니, 여러분은 오행의 조화로운 결과만 즐겨주시면 됩니다.</span>
            </div>
          </div>
        </div>
      </article>
      
      <!-- PANEL C: FINALE ROUTLETTE & LADDER GAME -->
      <article class="comic-card" id="panel-finale">
        <div class="panel-header">
          <span class="panel-number">2</span>
          <h3 class="panel-title">피날레 파티: 매칭이 끝나고 펼쳐지는 대형 룰렛 & 사다리 쇼!</h3>
          <span class="panel-narrator narrator-benji">Benji & Hayoon</span>
        </div>
        <div class="comic-img-container">
          <img class="comic-img" src="/assets/marketing/promo/panel_c.png" alt="Grand finale roulette and ladder game illustration">
        </div>
        <div class="comic-dialogue-area">
          <div class="bubble bubble-benji">
            <div class="speaker speaker-benji">벤지</div>
            <p class="dialogue-text">
              "자, 최고의 하이라이트는 지금부터야! 모든 매칭 결과 확정이 완료되면,<br>
              참가자 전원이 함께 감상하며 즐길 수 있는 **실시간 대형 네온 룰렛 쇼**와 **네온 사다리타기(Ghost Leg)**가 구동돼!"
            </p>
          </div>
          
          <div class="bubble bubble-hayoon bubble-right">
            <div class="speaker speaker-hayoon">하윤</div>
            <p class="dialogue-text">
              "맞아! 매칭이 끝난 직후 피날레 축제로 구동되는 만큼, 풍성한 기프티콘과 풍성한 커피 쿠폰 등<br>
              다양한 경품 추첨 쇼가 화려한 불꽃놀이 연출과 함께 펼쳐질 테니, **마지막 피날레까지 많은 관심과 기대를 부탁할게!** 🌌🎡💖"
            </p>
          </div>
        </div>
      </article>
      
    </div>
    
    <!-- Final CTA Card -->
    <section class="final-cta">
      <h3 class="final-title" id="final-cta-status">우주가 속삭이는 당신의 짝, 6월 1일에 찾아갑니다</h3>
      <p class="final-desc">
        본 이벤트는 아래 카운트다운 타이머가 종료되는 즉시 신청이 개방됩니다.<br>
        태어난 오행과 MBTI의 조화가 이끄는 운명적인 매치메이킹을 기대하세요!
      </p>
      
      <a href="/" class="cta-button-main locked" id="final-cta-btn">
        <span id="btn-text">이벤트 신청 대기 중...</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </section>
    
  </main>
  
  <footer class="global-footer">
    <p>&copy; 2026 MORAS. All rights reserved.</p>
    <p>재미와 조화로운 커뮤니티 연결을 목표로 합니다. 결정론적인 운명 해석은 피해주세요. | <a href="/admin">어드민 로그인</a></p>
  </footer>
  
  <script>
    // Countdown Target: 2026-06-01T03:00:00Z
    const eventStartTime = new Date("2026-06-01T03:00:00Z").getTime();
    
    const elements = {
      days: document.getElementById("promo-days"),
      hours: document.getElementById("promo-hours"),
      minutes: document.getElementById("promo-minutes"),
      seconds: document.getElementById("promo-seconds"),
      status: document.getElementById("countdown-status"),
      finalStatus: document.getElementById("final-cta-status"),
      headerBtn: document.getElementById("header-cta-btn"),
      finalBtn: document.getElementById("final-cta-btn"),
      btnText: document.getElementById("btn-text")
    };
    
    function padNum(n) {
      return String(n).padStart(2, "0");
    }
    
    function updateCountdown() {
      const remaining = eventStartTime - Date.now();
      
      if (remaining <= 0) {
        elements.days.textContent = "00";
        elements.hours.textContent = "00";
        elements.minutes.textContent = "00";
        elements.seconds.textContent = "00";
        
        elements.status.innerHTML = "이벤트가 오픈되었습니다! 지금 바로 신청하세요! 🚀";
        elements.status.style.color = "var(--cyan)";
        elements.finalStatus.textContent = "우주의 문이 열렸습니다! 지금 참여하세요!";
        
        elements.headerBtn.classList.remove("locked");
        elements.headerBtn.href = "/";
        elements.headerBtn.textContent = "지금 신청하기 🌌";
        
        elements.finalBtn.classList.remove("locked");
        elements.finalBtn.href = "/";
        elements.btnText.textContent = "지금 운명 등록하기 (이벤트 오픈!)";
        
        return;
      }
      
      const totalSec = Math.floor(remaining / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      
      elements.days.textContent = padNum(days);
      elements.hours.textContent = padNum(hours);
      elements.minutes.textContent = padNum(minutes);
      elements.seconds.textContent = padNum(seconds);
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  </script>
</body>
</html>`;
}

module.exports = { promoPage };
