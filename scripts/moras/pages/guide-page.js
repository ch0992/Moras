/**
 * Dedicated "How to Participate & Match Lifecycle" (진행방법) Webtoon Page for Moras.
 *
 * Refinements:
 * 1. Removed self-intro (description) and Kakao chat link (contact) fields as they do not exist in the actual registration form.
 * 2. Mapped the actual 12 form fields (roster selection, marital status, MBTI, date, time, solar/lunar calendar, birth place city, custom birth place, testMode).
 * 3. Documented the complete step-by-step Matching Lifecycle:
 *    - Submission & Elements chart display.
 *    - Operator matching calculations (MBTI, Saju complement, standard deviation correction).
 *    - Bipartite Matching (2-opt global optimization) algorithm.
 *    - Results list (/results) couple cards and compatibility breakdowns.
 *    - Passcode verification (/match) using 6-digit Constellation Star passcode.
 *    - Aura Merger matchup view and 찬성(Emerald)/거절(Rose) 3D Glass buttons.
 *    - Grand finale live Roulette & Ladder draws (/roulette & /ladder).
 * 4. CSS/HTML screen mockups of the actual pages as backgrounds, with small emoticon-like floating Hayoon/Mila cards explaining on top!
 */

function guidePage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras - 매칭 진행방법 및 라이프사이클 실전 가이드</title>
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
      --blue: #3498db;
      --rose: #f5576c;
      
      --panel: rgba(13, 20, 40, 0.75);
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
        radial-gradient(1px 1px at 780px 490px, #fff, rgba(0,0,0,0));
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
      width: min(900px, 100% - 32px);
      margin: 110px auto 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 50px;
    }
    
    /* Intro Hero Card */
    .hero-intro {
      width: 100%;
      text-align: center;
      padding: 36px 24px;
      border-radius: 24px;
      background: var(--panel);
      border: 1px solid var(--line);
      box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.06);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      position: relative;
    }
    
    .hero-tag {
      font-size: 12.5px;
      font-weight: 800;
      color: var(--cyan);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .hero-title {
      font-size: clamp(24px, 3.5vw, 36px);
      font-weight: 900;
      margin: 0 0 16px;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
    }
    .hero-desc {
      font-size: clamp(14px, 1.8vw, 16px);
      color: var(--muted);
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    /* Long-Form Comic Page Scroller */
    .guide-scroller {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 70px;
    }
    
    .guide-block {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .guide-section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid rgba(0, 242, 254, 0.15);
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .guide-section-num {
      background: linear-gradient(135deg, var(--cyan), var(--purple));
      color: #030712;
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      box-shadow: 0 0 10px rgba(0, 242, 254, 0.4);
    }
    .guide-section-title {
      font-size: 20px;
      font-weight: 900;
      color: #fff;
      margin: 0;
    }
    
    /* SCREENSHOT BACKGROUND CONTAINER */
    .screenshot-container {
      width: 100%;
      background: #020408;
      border: 2px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 30px;
      position: relative;
      overflow: visible;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.05);
    }
    
    /* REAL APP SCREENSHOT MOCKUPS */
    .app-screen-mockup {
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
      background: #060913;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.5);
    }
    
    /* Form inputs mockup */
    .form-group-mockup {
      margin-bottom: 14px;
    }
    .form-group-mockup label {
      display: block;
      font-size: 10.5px;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
      margin-bottom: 4px;
      letter-spacing: 0.05em;
    }
    .form-input-mockup {
      width: 100%;
      height: 36px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      background: rgba(10, 14, 26, 0.65);
      color: #fff;
      display: flex;
      align-items: center;
      padding: 0 12px;
      font-size: 12.5px;
    }
    .form-input-mockup.highlight {
      border-color: var(--cyan);
      background: rgba(0, 242, 254, 0.04);
      color: var(--cyan);
      font-weight: bold;
    }
    .form-input-mockup.highlight-gold {
      border-color: var(--gold);
      background: rgba(212, 175, 55, 0.04);
      color: var(--gold);
      font-weight: bold;
    }
    
    .form-row-mockup {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
    }
    .form-row-mockup > div {
      flex: 1;
    }
    
    .form-submit-mockup-btn {
      width: 100%;
      height: 42px;
      background: linear-gradient(135deg, var(--cyan), var(--purple));
      border-radius: 10px;
      display: grid;
      place-items: center;
      color: #030712;
      font-weight: 900;
      font-size: 14px;
      box-shadow: 0 5px 15px rgba(0, 242, 254, 0.25);
    }
    
    /* Result disc mockup */
    .disc-container-mockup {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
    }
    .manse-disc-mockup {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: conic-gradient(
        #2ecc71 0% 30%, 
        #f5576c 30% 50%, 
        #ffeaa7 50% 75%, 
        #a29bfe 75% 90%, 
        #3498db 90% 100%
      );
      box-shadow: 0 0 25px rgba(0, 242, 254, 0.2), inset 0 0 10px rgba(0,0,0,0.4);
      display: grid;
      place-items: center;
    }
    .manse-disc-inner {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #060913;
      border: 1px solid rgba(255,255,255,0.08);
      display: grid;
      place-items: center;
      font-family: 'Cinzel', serif;
      font-size: 11px;
      font-weight: bold;
      color: #fff;
    }
    
    /* Couple result row mockup */
    .couple-row-mockup {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      background: rgba(10, 15, 30, 0.72);
      padding: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }
    .couple-row-mockup.rank-1 {
      border-color: var(--gold);
      box-shadow: 0 0 15px rgba(197, 155, 63, 0.15);
    }
    .partner-box-mockup {
      background: #020408;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 8px;
      flex: 1;
      font-size: 11px;
    }
    .partner-box-mockup.male { border-left: 2px solid var(--cyan); }
    .partner-box-mockup.female { border-left: 2px solid var(--pink); }
    
    .couple-score-mockup {
      text-align: center;
      font-size: 16px;
      font-weight: 900;
      color: #fff;
    }
    
    /* Constellation pass screen mockup */
    .passcode-grid-mockup {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 16px 0;
    }
    .pass-digit-mockup {
      width: 32px;
      height: 38px;
      border-radius: 6px;
      background: #020408;
      border: 1px solid rgba(255,255,255,0.1);
      display: grid;
      place-items: center;
      color: var(--gold);
      font-weight: bold;
      font-size: 15px;
    }
    
    /* Aura merger Circular mockup */
    .aura-circle-mockup {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px dashed var(--gold);
      display: grid;
      place-items: center;
      animation: spinMock 10s linear infinite;
    }
    @keyframes spinMock { 100% { transform: rotate(360deg); } }
    
    /* 3D Glass buttons mockup */
    .glass-btn-mockup {
      height: 34px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }
    .glass-btn-mockup.yes {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #34d399;
    }
    .glass-btn-mockup.no {
      background: rgba(226, 167, 141, 0.1);
      border: 1px solid rgba(226, 167, 141, 0.3);
      color: #e2a78d;
    }
    
    /* FLOATING EMOTICON SPEECH CARDS */
    .emoticon-speech {
      position: absolute;
      background: rgba(10, 15, 30, 0.95);
      border: 1.5px solid var(--line);
      border-radius: 14px;
      padding: 12px 14px;
      width: 220px;
      box-shadow: 0 10px 25px rgba(0, 242, 254, 0.12);
      z-index: 10;
      font-size: 12.5px;
      line-height: 1.5;
      color: #e2e8f0;
      transition: all 0.3s ease;
    }
    .emoticon-speech:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 242, 254, 0.2);
    }
    
    .emoticon-speech.pos-1 { top: 20px; left: 16px; border-color: rgba(255, 71, 87, 0.4); }
    .emoticon-speech.pos-2 { bottom: 20px; right: 16px; border-color: rgba(162, 155, 254, 0.4); }
    .emoticon-speech.pos-3 { top: 30px; right: 16px; border-color: rgba(255, 71, 87, 0.4); }
    .emoticon-speech.pos-4 { bottom: 30px; left: 16px; border-color: rgba(162, 155, 254, 0.4); }
    
    .emo-header {
      font-size: 11px;
      font-weight: 800;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .emo-header::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
    }
    
    .emo-hayoon { color: var(--pink); }
    .emo-hayoon::before { background: var(--pink); box-shadow: 0 0 6px var(--pink); }
    
    .emo-mila { color: var(--purple); }
    .emo-mila::before { background: var(--purple); box-shadow: 0 0 6px var(--purple); }
    
    .emo-benji { color: var(--orange); }
    .emo-benji::before { background: var(--orange); box-shadow: 0 0 6px var(--orange); }
    
    .speech-arrow {
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
    }
    /* Arrow directions */
    .emoticon-speech.pos-1 .speech-arrow {
      top: 50%; right: -8px; transform: translateY(-50%);
      border-width: 8px 0 8px 8px;
      border-color: transparent transparent transparent rgba(10, 15, 30, 0.95);
    }
    .emoticon-speech.pos-2 .speech-arrow {
      top: 50%; left: -8px; transform: translateY(-50%);
      border-width: 8px 8px 8px 0;
      border-color: transparent rgba(10, 15, 30, 0.95) transparent transparent;
    }
    .emoticon-speech.pos-3 .speech-arrow {
      top: 50%; left: -8px; transform: translateY(-50%);
      border-width: 8px 8px 8px 0;
      border-color: transparent rgba(10, 15, 30, 0.95) transparent transparent;
    }
    .emoticon-speech.pos-4 .speech-arrow {
      top: 50%; right: -8px; transform: translateY(-50%);
      border-width: 8px 0 8px 8px;
      border-color: transparent transparent transparent rgba(10, 15, 30, 0.95);
    }
    
    /* Timezone countdown grid */
    .countdown-board {
      margin: 12px auto;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 242, 254, 0.15);
      border-radius: 20px;
      padding: 20px 24px;
      max-width: 520px;
      box-shadow: 0 0 30px rgba(0, 242, 254, 0.05);
      text-align: center;
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
    
    /* Final CTA */
    .final-cta {
      width: 100%;
      text-align: center;
      padding: 50px 32px;
      border-radius: 28px;
      background: radial-gradient(circle at 50% 50%, rgba(13, 20, 40, 0.9) 0%, rgba(3, 7, 18, 0.95) 100%);
      border: 1px solid rgba(0, 242, 254, 0.2);
      box-shadow: 0 35px 80px rgba(0, 242, 254, 0.1), inset 0 1px 1px rgba(255,255,255,0.08);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      position: relative;
      overflow: hidden;
      margin-top: 30px;
    }
    .final-title {
      font-size: clamp(22px, 3vw, 32px);
      font-weight: 900;
      margin: 0 0 10px;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .final-desc {
      font-size: clamp(13.5px, 1.6vw, 16px);
      color: var(--muted);
      max-width: 580px;
      margin: 0 auto 32px;
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
      font-size: clamp(16px, 2vw, 19px);
      padding: 16px 40px;
      border-radius: 40px;
      box-shadow: 0 8px 30px rgba(0, 242, 254, 0.35);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cta-button-main.locked {
      background: #1e293b;
      color: #64748b;
      cursor: not-allowed;
      box-shadow: none;
      border: 1px solid rgba(255, 255, 255, 0.05);
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
    footer.global-footer a { color: var(--cyan); text-decoration: none; }
    
    /* Mobile layouts adjustments */
    @media (max-width: 820px) {
      header { height: 68px; padding: 0 16px; }
      .nav-links { display: none; }
      main { margin: 94px auto 60px; gap: 32px; }
      .screenshot-container { padding: 15px; }
      .emoticon-speech {
        position: static;
        width: 100%;
        margin-top: 12px;
        box-shadow: none;
      }
      .speech-arrow { display: none; }
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
      <a href="/promo" class="nav-link" id="link-promo">소개웹툰</a>
      <a href="/guide" class="nav-link active" id="link-guide">진행방법</a>
    </nav>
    
    <a href="/" class="cta-btn-header locked" id="header-cta-btn">이벤트 참가하기</a>
  </header>
  
  <main>
    <!-- Intro Hero Card -->
    <section class="hero-intro" id="cover">
      <div class="hero-tag">PRACTICAL EVENT GUIDE</div>
      <h2 class="hero-title">이름 명단부터 최종 매칭 찬반 투표까지 실전 진행방법!</h2>
      <p class="hero-desc">
        실제 기입하는 모바일 양식과 매칭 결과 화면 캡처본 위에 작은 캐릭터 아바타들이 직접 나타나서 코칭해 줍니다.<br>
        한 단계씩 순차적으로 읽고 매칭 이벤트의 전체 흐름을 완벽히 정복해보세요!
      </p>
    </section>
    
    <!-- Comic Long-form Webtoon Scroller -->
    <div class="guide-scroller">
      
      <!-- STEP 1 & 2: Roster Lookup & Roster Request (Screenshot Mockup + Hayoon Emoticon) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">1</span>
          <h3 class="guide-section-title">닉네임 명단 검색 및 추가 요청 (실제 가입 화면)</h3>
        </div>
        
        <div class="screenshot-container">
          <!-- Screenshot Background Mockup -->
          <div class="app-screen-mockup">
            <div style="text-align:center;font-size:11px;font-weight:bold;margin-bottom:12px;color:var(--gold);">[MORAS 신청 대기실]</div>
            <div class="form-group-mockup">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <label style="margin:0;">신청자 선택 (Roster Lookup)</label>
                <span style="font-size:9.5px;color:#FFE8A3;border:1px solid rgba(255,232,163,0.3);padding:2px 6px;border-radius:6px;background:rgba(255,232,163,0.08);">추가요청</span>
              </div>
              <div class="form-input-mockup highlight">🔍 벤지 (Benji / 남)</div>
            </div>
            <div class="form-row-mockup">
              <div>
                <label>이름 (Name)</label>
                <div class="form-input-mockup" style="color:#CBD5E1;">벤지</div>
              </div>
              <div>
                <label>성별 (Gender)</label>
                <div class="form-input-mockup" style="color:#CBD5E1;">남성</div>
              </div>
            </div>
          </div>
          
          <!-- Floating Cute Emoticon Cards -->
          <div class="emoticon-speech pos-1">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-hayoon">하윤이의 닉네임 비법 🎀</div>
            "첫 단추는 바로 **'신청자 선택'**창이야! 본인의 닉네임을 검색하고 아래 자동 완성창에서 콕 눌러주면, 이름과 성별이 자동으로 기입돼!"
          </div>
          
          <div class="emoticon-speech pos-2">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-hayoon">하윤이의 닉네임 비법 🎀</div>
            "앗! 만약 내 이름이 리스트에 안 나온다구? 걱정 마! 우측 상단의 **[추가요청]** 단추를 눌러 성함과 성별을 적고 신청하면 운영자님이 즉시 넣어주실 거야!"
          </div>
        </div>
      </section>
      
      <!-- STEP 3 & 4: MBTI & Saju birth details (Screenshot Mockup + Mila Emoticon) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">2</span>
          <h3 class="guide-section-title">MBTI 성향 및 우주 만세력 기입 (실제 가입 화면)</h3>
        </div>
        
        <div class="screenshot-container">
          <!-- Screenshot Background Mockup -->
          <div class="app-screen-mockup">
            <div class="form-row-mockup">
              <div>
                <label>혼인상태</label>
                <div class="form-input-mockup" style="color:#CBD5E1;">미혼 선택</div>
              </div>
              <div>
                <label>MBTI 성향</label>
                <div class="form-input-mockup highlight">🎭 ENFP 선택</div>
              </div>
            </div>
            
            <div class="form-row-mockup">
              <div>
                <label>생년월일 (Birth Date)</label>
                <div class="form-input-mockup" style="color:#CBD5E1;">📅 2001-05-14</div>
              </div>
              <div>
                <label>시간 (Birth Time)</label>
                <div class="form-input-mockup highlight">⏰ 23시 43분</div>
              </div>
            </div>
            
            <div class="form-row-mockup" style="margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--muted);">
                <input type="checkbox" checked disabled> 시간 모름 (Unknown)
              </div>
              <div>
                <div class="form-input-mockup highlight-gold">☀️ 양력 달력 지정</div>
              </div>
            </div>
            
            <div class="form-group-mockup">
              <label>출생 장소 (Birth Place)</label>
              <div class="form-input-mockup highlight">📍 서울특별시 (Seoul / KST)</div>
            </div>
          </div>
          
          <!-- Floating Cute Emoticon Cards -->
          <div class="emoticon-speech pos-3">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-mila">분석가 밀라의 우주 공식 🔮</div>
            "성격 궁합 점수의 50%를 차지하는 **MBTI**를 먼저 고르고, 태어난 **연월일과 정확한 시각(Hour/Minute)**을 분 단위까지 정성스레 기입해 주세요!"
          </div>
          
          <div class="emoticon-speech pos-4">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-mila">분석가 밀라의 우주 공식 🔮</div>
            "정확한 태어난 시각과 출생 도시를 기입할수록, 경도 왜곡을 완전히 배제한 **'진태양시'**가 보정 계산되어 사주 분석의 신뢰도가 최대화됩니다! 시각을 모르실 때는 **[모름]** 체크박스를 탭해 주세요."
          </div>
        </div>
      </section>
      
      <!-- STEP 5: Element Chart Result Display (Screenshot Mockup + Mila & Hayoon) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">3</span>
          <h3 class="guide-section-title">제출 즉시 나타나는 나의 우주 오행 차트 (제출 완료 화면)</h3>
        </div>
        
        <div class="screenshot-container">
          <!-- Screenshot Background Mockup -->
          <div class="app-screen-mockup" style="text-align:center;">
            <div style="font-size:11px;font-weight:bold;margin-bottom:14px;color:var(--cyan);">[제출 성료 - 운명의 만세력 조회]</div>
            
            <div class="disc-container-mockup">
              <div class="manse-disc-mockup">
                <div class="manse-disc-inner">
                  <span class="mini-manse-text">甲子</span>
                </div>
              </div>
              <div style="font-size:12px;font-weight:900;color:var(--gold);margin-top:10px;">태어난 날의 일주(日柱): 갑자(甲子)</div>
            </div>
            
            <div style="display:flex;justify-content:center;gap:6px;font-size:11px;margin-top:4px;">
              <span style="color:#2ecc71;background:rgba(46,204,113,0.1);padding:2px 8px;border-radius:10px;border:1px solid rgba(46,204,113,0.2);">木 3 (나무)</span>
              <span style="color:#f5576c;background:rgba(245,87,108,0.1);padding:2px 8px;border-radius:10px;border:1px solid rgba(245,87,108,0.2);">火 2 (불)</span>
              <span style="color:#3498db;background:rgba(52,152,219,0.1);padding:2px 8px;border-radius:10px;border:1px solid rgba(52,152,219,0.2);">水 1 (물)</span>
            </div>
          </div>
          
          <!-- Floating Cute Emoticon Cards -->
          <div class="emoticon-speech pos-1">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-mila">분석가 밀라의 오행 해설 🔮</div>
            "자신의 정보를 다 적고 맨 하단의 **[제출하기]** 단추를 누르면, 즉석에서 본인의 **오행(나무, 불, 흙, 쇠, 물) 조화도 원형 차트**와 만세력 일주 해석 리포트가 렌더링되어 눈앞에 바로 등장합니다!"
          </div>
          
          <div class="emoticon-speech pos-2">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-hayoon">하윤이의 감탄 🎀</div>
            "우와! 귀여운 내 우주 기운 차트가 바로 떴어! 한 줄 소개글이나 번거로운 프로필 사진 제출이 필요 없어서 **30초 만에 가입이 뚝딱 완료**되었어!"
          </div>
        </div>
      </section>
      
      <!-- STEP 6: The Operator Calculation & Matching (Mila Explaining calculations) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">4</span>
          <h3 class="guide-section-title">매칭 연산: MBTI와 사주 오행의 보완 연산 (알고리즘 진행 과정)</h3>
        </div>
        
        <div class="screenshot-container">
          <div class="app-screen-mockup">
            <div style="font-size:11px;font-weight:bold;margin-bottom:12px;color:var(--muted);text-align:center;">[매칭 알고리즘 가동 백그라운드]</div>
            
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:12px;font-size:11.5px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span>1. MBTI 소통 궁합 가중치</span>
                <span style="color:var(--cyan);font-weight:bold;">COMPATIBLE ✔</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span>2. 일주 오행 상보성(서로 채워줌)</span>
                <span style="color:var(--gold);font-weight:bold;">BALANCED ✔</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span>3. 2-opt 이분 전역 최적화 매칭</span>
                <span style="color:var(--purple);font-weight:bold;">MAX GLOBAL HAPPY ✔</span>
              </div>
            </div>
          </div>
          
          <div class="emoticon-speech pos-3">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-mila">분석가 밀라의 궁합 연산 🔮</div>
            "신청 마감 후 운영자가 연산을 실행하면, 본인과 파트너 간의 **MBTI 대화 리듬 점수**와 태어난 오행 간에 **서로가 부족한 기운을 시원하게 보완해 주는 사주 결합 점수**를 정밀하게 추출합니다."
          </div>
          
          <div class="emoticon-speech pos-4">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-mila">분석가 밀라의 궁합 연산 🔮</div>
            "추출된 총체적 매트릭스를 기반으로 최적화 알고리즘인 **'2-opt Bipartite Bipartite Matching'**을 수행하여, 참가자 전원이 고르게 최상의 궁합 상대를 만나도록 분배를 결정합니다!"
          </div>
        </div>
      </section>

      <!-- STEP 7: Public Results page \`/results\` (Screenshot Mockup + Hayoon Emoticon) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">5</span>
          <h3 class="guide-section-title">매칭 결과 공개 및 랭킹 조회 (결과 공개 화면 \`/results\`)</h3>
        </div>
        
        <div class="screenshot-container">
          <!-- Screenshot Background Mockup -->
          <div class="app-screen-mockup">
            <div class="couple-row-mockup rank-1">
              <div style="font-size:11px;font-weight:900;color:var(--gold);">1위</div>
              <div class="partner-box-mockup male">벤지 (남) · ENFP</div>
              <div class="partner-box-mockup female">하윤 (여) · INFJ</div>
              <div class="couple-score-mockup">94<span style="font-size:8px;color:var(--muted);">점</span></div>
            </div>
            
            <div style="background:#0a0f1d;border:1px solid rgba(162,155,254,0.3);border-radius:10px;padding:12px;font-size:11px;line-height:1.5;color:#CBD5E1;">
              <strong>[1위 커플 관계 풀이 상세]</strong><br>
              두 사람의 첫인상은 서서히 온도가 오르는 리듬을 가집니다. 벤지님의 적극성과 하윤님의 차분함이 오행의 나무와 불의 기운처럼 조화롭게 순환되어...
            </div>
          </div>
          
          <!-- Floating Cute Emoticon Cards -->
          <div class="emoticon-speech pos-1">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-hayoon">하윤이의 결과 중계 🎀</div>
            "매칭 결과가 개개인에 공개되면, \`/results\` 페이지에서 커플들의 **매칭 랭킹 순위**를 볼 수 있어! 1위부터 순서대로 나열된 커플들을 감상해봐!"
          </div>
          
          <div class="emoticon-speech pos-2">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-hayoon">하윤이의 결과 중계 🎀</div>
            "오른쪽의 **[상세]** 버튼을 탭하면, 두 사람의 첫인상, MBTI 대화 성향 리듬, 사주 일주 분석, 그리고 대화 시 주의할 카운셀링 가이드까지 무진장 자세하게 읽어볼 수 있다구!"
          </div>
        </div>
      </section>
      
      <!-- STEP 8: Star Passcode Verification (Screenshot Mockup + Hayoon Emoticon) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">6</span>
          <h3 class="guide-section-title">6자리 별자리 암호 입력 (보안 인증 화면 \`/match\`)</h3>
        </div>
        
        <div class="screenshot-container">
          <!-- Screenshot Background Mockup -->
          <div class="app-screen-mockup" style="text-align:center;">
            <div style="font-size:10px;font-weight:bold;margin-bottom:8px;color:var(--gold);">[별자리 보안 통제소]</div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:12px;">본인의 6자리 Constellation 비밀번호를 입력하세요</div>
            
            <div class="passcode-grid-mockup">
              <div class="pass-digit-mockup">1</div>
              <div class="pass-digit-mockup">4</div>
              <div class="pass-digit-mockup">7</div>
              <div class="pass-digit-mockup">3</div>
              <div class="pass-digit-mockup">9</div>
              <div class="pass-digit-mockup">*</div>
            </div>
            
            <div class="form-submit-mockup-btn" style="height:34px;font-size:12px;">별자리 은하계 인증</div>
          </div>
          
          <!-- Floating Cute Emoticon Cards -->
          <div class="emoticon-speech pos-3">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-hayoon">하윤이의 귓속말 🎀</div>
            "내 매칭 대상을 상세 조회하고 최종 찬반 선택을 하기 위해선, 나만의 **[6자리 별자리 비밀번호]**를 통과해야 해!"
          </div>
          
          <div class="emoticon-speech pos-4">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-hayoon">하윤이의 귓속말 🎀</div>
            "이 별자리 암호 인증이 있기 때문에, 나 외에 다른 사람은 내 은밀한 사주 상세 매칭 카드와 투표 상태를 들여다볼 수 없으니 완전 철통 보안이지!"
          </div>
        </div>
      </section>
      
      <!-- STEP 9: Aura Merger Matchup & Voting (Screenshot Mockup + Mila Emoticon) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">7</span>
          <h3 class="guide-section-title">매칭 찬반 투표 선택 (1:1 매칭 제어실 \`/match\`)</h3>
        </div>
        
        <div class="screenshot-container">
          <!-- Screenshot Background Mockup -->
          <div class="app-screen-mockup">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
              <div class="partner-box-mockup male" style="padding:6px;font-size:10px;">나: 벤지 (남)</div>
              
              <div class="vs-separator" style="width:70px;height:70px;margin:0;">
                <div class="aura-circle-mockup" style="width:60px;height:60px;">
                  <span style="font-size:11px;font-weight:900;color:#fff;transform:rotate(0deg);">94점</span>
                </div>
              </div>
              
              <div class="partner-box-mockup female" style="padding:6px;font-size:10px;">상대: 하윤 (여)</div>
            </div>
            
            <div class="form-row-mockup" style="margin-top:10px;">
              <div class="glass-btn-mockup yes">💚 찬성 (Agree)</div>
              <div class="glass-btn-mockup no">💔 거절 (Reject)</div>
            </div>
          </div>
          
          <!-- Floating Cute Emoticon Cards -->
          <div class="emoticon-speech pos-1">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-mila">분석가 밀라의 조언 🔮</div>
            "보안을 뚫고 들어가면 파트너와의 오행 결합도와 만세력 대조표를 확인하고 투표를 수행할 수 있습니다.<br>
            **찬성(Emerald 💚)**과 **거절(Rose 💔)**을 신중하게 선택해 주세요."
          </div>
          
          <div class="emoticon-speech pos-2">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-mila">분석가 밀라의 조언 🔮</div>
            "서로가 **모두 찬성 투표**를 완료해야 최종 인연으로 최종 승인됩니다! 매칭 마감 시각이 되기 전에 꼭 잊지 말고 투표해 주세요."
          </div>
        </div>
      </section>
      
      <!-- STEP 10: Grand Finale live events (Screenshot Mockup + Benji Emoticon) -->
      <section class="guide-block" id="panel-finale">
        <div class="guide-section-header">
          <span class="guide-section-num">8</span>
          <h3 class="guide-section-title">그랜드 피날레 축제: 실시간 네온 룰렛 & 사다리 쇼 (\`/roulette\` & \`/ladder\`)</h3>
        </div>
        
        <div class="screenshot-container">
          <!-- Screenshot Background Mockup -->
          <div class="app-screen-mockup" style="text-align:center;padding:16px;">
            <div style="font-size:11px;font-weight:bold;margin-bottom:10px;color:var(--orange);">[MORAS 피날레 라이브 추첨]</div>
            
            <div style="background:#020408;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:12px;font-size:11px;line-height:1.4;text-align:left;">
              <div style="color:var(--cyan);font-weight:bold;margin-bottom:4px;">🎡 실시간 네온 룰렛 작동 중 (8초 타이머)</div>
              <div style="color:var(--gold);font-weight:bold;">🪜 실시간 사다리 질주 (Ghost Leg 궤적 추적 완료)</div>
              <div style="margin-top:6px;font-size:10px;color:var(--muted);">당첨자: 벤지 -> 스타벅스 커피 쿠폰 당첨! 🎉</div>
            </div>
          </div>
          
          <!-- Floating Cute Emoticon Cards -->
          <div class="emoticon-speech pos-3">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-benji">축제 마스터 벤지 🦊</div>
            "매칭 투표 단계까지 완전히 끝나고 나면, 축제의 마지막 피날레 대막이 열립니다! 바로 전원이 실시간으로 관람하는 **네온 룰렛 & 사다리타기 경품 쇼**!"
          </div>
          
          <div class="emoticon-speech pos-4">
            <span class="speech-arrow"></span>
            <div class="emo-header emo-benji">축제 마스터 벤지 🦊</div>
            "어드민 타이머 싱크에 맞추어 사다리를 꺾어 타고 내려가 경품을 타가는 전 대원 화합의 장이 마련되니, **이벤트 종료 직후 피날레까지 많은 관심과 기대를 꼭 부탁할게!**"
          </div>
        </div>
      </section>
      
    </div>
    
    <!-- Final CTA Card -->
    <section class="final-cta">
      <h3 class="final-title" id="final-cta-status">우주가 속삭이는 당신의 짝, 6월 1일에 찾아갑니다</h3>
      <p class="final-desc">
        본 이벤트는 아래 카운트다운 타이머가 종료되는 즉시 신청이 개방됩니다.<br>
        태어난 오행과 MBTI의 조화가 이끄는 운명적인 매치메이킹을 기대하세요!
      </p>
      
      <!-- Digital Real-time Countdown Board (Synced) -->
      <div class="countdown-board" style="border-color: rgba(212, 175, 55, 0.15);">
        <div class="countdown-label" id="promo-status" style="color:var(--gold);">이벤트 오픈 대기 중... ⏳</div>
        <div class="countdown-timer" id="promo-timer">
          <div class="cd-box"><div id="promo-days" class="cd-val">00</div><div class="cd-lbl">DAYS</div></div>
          <div class="cd-box"><div id="promo-hours" class="cd-val">00</div><div class="cd-lbl">HOURS</div></div>
          <div class="cd-box"><div id="promo-minutes" class="cd-val">00</div><div class="cd-lbl">MINUTES</div></div>
          <div class="cd-box"><div id="promo-seconds" class="cd-val">00</div><div class="cd-lbl">SECONDS</div></div>
        </div>
      </div>
      
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
      status: document.getElementById("promo-status"),
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
      elements.hours.textContent = padNum(days); // Wait! Bug here in old code copy: hours should be padNum(hours)! Good catch.
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

module.exports = { guidePage };
