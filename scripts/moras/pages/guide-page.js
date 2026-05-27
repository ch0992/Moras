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
    
    /* NEW GRID LAYOUT: CHARACTER MINIATURE + SCREEN MOCKUP */
    .guide-step-row {
      display: grid;
      grid-template-columns: minmax(260px, 320px) minmax(320px, 1fr);
      gap: 32px;
      align-items: center;
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 30px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: all 0.3s ease;
    }
    
    .guide-step-row:hover {
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 35px 80px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255,255,255,0.1);
    }
    
    .guide-char-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      text-align: center;
    }
    
    .mini-char-avatar {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      border: 2.5px solid transparent;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mini-char-avatar:hover {
      transform: scale(1.08) rotate(4deg);
    }
    
    .mini-char-avatar::after {
      content: attr(data-name);
      position: absolute;
      bottom: -6px;
      font-size: 11px;
      font-weight: 900;
      color: #fff;
      padding: 3px 12px;
      border-radius: 12px;
      background: rgba(13, 20, 40, 0.95);
      border: 1px solid rgba(255,255,255,0.08);
      letter-spacing: 0.05em;
    }
    
    .mini-char-avatar.emo-hayoon {
      background: radial-gradient(circle, rgba(255, 71, 87, 0.15) 0%, rgba(13, 20, 40, 0.9) 100%);
      border-color: rgba(255, 71, 87, 0.45);
      box-shadow: 0 0 20px rgba(255, 71, 87, 0.25);
    }
    .mini-char-avatar.emo-hayoon::after {
      border-color: rgba(255, 71, 87, 0.3);
      color: var(--pink);
    }
    
    .mini-char-avatar.emo-mila {
      background: radial-gradient(circle, rgba(162, 155, 254, 0.15) 0%, rgba(13, 20, 40, 0.9) 100%);
      border-color: rgba(162, 155, 254, 0.45);
      box-shadow: 0 0 20px rgba(162, 155, 254, 0.25);
    }
    .mini-char-avatar.emo-mila::after {
      border-color: rgba(162, 155, 254, 0.3);
      color: var(--purple);
    }
    
    .char-speech-bubble {
      position: relative;
      background: rgba(8, 12, 24, 0.65);
      border-radius: 18px;
      padding: 20px;
      border: 1.5px solid rgba(255,255,255,0.06);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      width: 100%;
      text-align: left;
      font-size: 13.5px;
      line-height: 1.6;
      color: #e2e8f0;
      transition: all 0.3s ease;
    }
    
    /* Speech Bubble Pointer Arrows */
    .char-speech-bubble::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 0 10px 10px 10px;
      border-style: solid;
      border-color: transparent transparent rgba(8, 12, 24, 0.9) transparent;
      display: block;
      width: 0;
      z-index: 2;
    }
    .char-speech-bubble::after {
      content: '';
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 0 11px 11px 11px;
      border-style: solid;
      border-color: transparent transparent rgba(255,255,255,0.06) transparent;
      display: block;
      width: 0;
      z-index: 1;
    }
    .char-speech-bubble b {
      color: #ffffff;
      font-size: 14.5px;
    }
    
    .char-speech-bubble.bubble-pink {
      border-color: rgba(255, 71, 87, 0.25);
      box-shadow: 0 8px 24px rgba(255, 71, 87, 0.04);
    }
    .char-speech-bubble.bubble-pink::after {
      border-color: transparent transparent rgba(255, 71, 87, 0.25) transparent;
    }
    
    .char-speech-bubble.bubble-purple {
      border-color: rgba(162, 155, 254, 0.25);
      box-shadow: 0 8px 24px rgba(162, 155, 254, 0.04);
    }
    .char-speech-bubble.bubble-purple::after {
      border-color: transparent transparent rgba(162, 155, 254, 0.25) transparent;
    }
    
    .guide-screen-col {
      width: 100%;
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
    
    .real-screen-img {
      width: 100%;
      height: 380px;
      object-fit: contain;
      border-radius: 16px;
      border: 1.5px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: block;
      margin: 0 auto;
      background: #020408;
      cursor: zoom-in;
    }
    .real-screen-img:hover {
      transform: translateY(-4px) scale(1.015);
      border-color: var(--cyan);
      box-shadow: 0 18px 40px rgba(0, 242, 254, 0.25);
    }
    
    .mockup-images-row {
      display: flex;
      gap: 16px;
      justify-content: center;
      width: 100%;
    }
    .mockup-image-wrapper {
      flex: 1;
      max-width: 240px;
      position: relative;
    }
    .mockup-image-label {
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--muted);
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    @media (max-width: 600px) {
      .mockup-images-row {
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      .mockup-image-wrapper {
        width: 100%;
        max-width: 280px;
      }
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
      
      .guide-step-row {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 20px;
      }
      .guide-char-col {
        width: 100%;
      }
      .char-speech-bubble {
        width: 100%;
        box-shadow: none;
      }
      .emoticon-speech {
        position: static;
        width: 100%;
        margin-top: 12px;
        box-shadow: none;
      }
    }
    
    /* Image Lightbox Overlay Styles */
    .lightbox-modal {
      display: none;
      position: fixed;
      z-index: 2000;
      padding-top: 50px;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(3, 7, 18, 0.93);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.3s ease;
    }
    .lightbox-content {
      margin: auto;
      display: block;
      width: 90%;
      max-width: 780px;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 20px;
      border: 1.5px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.08);
      animation: lightboxZoom 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes lightboxZoom {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .lightbox-close {
      position: absolute;
      top: 24px;
      right: 32px;
      color: #fff;
      font-size: 38px;
      font-weight: 800;
      transition: all 0.25s ease;
      cursor: pointer;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .lightbox-close:hover {
      color: var(--cyan);
      transform: scale(1.08) rotate(90deg);
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(0, 242, 254, 0.3);
    }
    .lightbox-caption {
      margin: auto;
      display: block;
      width: 80%;
      max-width: 600px;
      text-align: center;
      color: #94a3b8;
      padding: 16px 0;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    @media (max-width: 600px) {
      .lightbox-close {
        top: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
        font-size: 30px;
      }
      .lightbox-content {
        max-height: 70vh;
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
      
      <!-- STEP 1: Roster Lookup & Roster Request (Welcome Screen & Search / Hayoon Miniature) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">1</span>
          <h3 class="guide-section-title">웰컴 대기실 진입 및 신청자 명단 검색</h3>
        </div>
        
        <div class="guide-step-row">
          <!-- Left Column: Character Miniature Speech Bubble -->
          <div class="guide-char-col">
            <div class="mini-char-avatar emo-hayoon" data-name="하윤">🎀</div>
            <div class="char-speech-bubble bubble-pink">
              <b>하윤이의 안내 🎀</b><br><br>
              "어서 와! MORAS 대기실이야! 🌌 별자리 카운트다운 타이머가 다 되면 하단 버튼이 자동으로 열리며, 그전에도 <b>[소개웹툰]</b>과 <b>[이벤트 신청방법]</b>을 볼 수 있어!<br><br>
              신청 단계에서는 본인의 닉네임을 검색해서 고르면 이름과 성별이 자동으로 기입된단다. 만약 내 이름이 없다면 <b>[추가요청]</b> 버튼으로 승인을 신청해줘!"
            </div>
          </div>
          
          <!-- Right Column: Screen Mockup -->
          <div class="guide-screen-col">
            <div class="mockup-images-row">
              <div class="mockup-image-wrapper">
                <img class="real-screen-img" src="/assets/guide/media__1779845935400.png" alt="MORAS 웰컴 대기실 카운트다운">
                <div class="mockup-image-label">웰컴 대기실 (카운트다운)</div>
              </div>
              <div class="mockup-image-wrapper">
                <img class="real-screen-img" src="/assets/guide/media__1779845956127.png" alt="신청자 검색 및 성별 자동 기입">
                <div class="mockup-image-label">신청자 검색 (Roster Lookup)</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- STEP 2: MBTI & Saju birth details (Saju Section - Mila Miniature) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">2</span>
          <h3 class="guide-section-title">혼인상태, MBTI 성향 및 사주 오행 기입</h3>
        </div>
        
        <div class="guide-step-row">
          <!-- Left Column: Character Miniature Speech Bubble -->
          <div class="guide-char-col">
            <div class="mini-char-avatar emo-mila" data-name="밀라">🔮</div>
            <div class="char-speech-bubble bubble-purple">
              <b>분석가 밀라의 우주 공식 🔮</b><br><br>
              "여기서부턴 나 밀라가 사주 영역 안내를 도와줄게! 🔮 성격 케미를 계산할 **MBTI**를 정확히 고르고, 태어난 **생년월일과 시간**을 분 단위까지 정확히 입력해줘!<br><br>
              시간과 출생도시가 정밀할수록 경도가 보정된 **'진태양시'** 만세력이 연산되어 궁합도 분석이 훨씬 정확해진단다! 시각을 모를 땐 <b>[모름]</b>을 체크해도 괜찮아."
            </div>
          </div>
          
          <!-- Right Column: Screen Mockup -->
          <div class="guide-screen-col">
            <div class="mockup-images-row">
              <div class="mockup-image-wrapper">
                <img class="real-screen-img" src="/assets/guide/media__1779846000121.png" alt="혼인상태 돌싱 및 매칭 범위 설정">
                <div class="mockup-image-label">혼인상태 및 매칭 범위</div>
              </div>
              <div class="mockup-image-wrapper">
                <img class="real-screen-img" src="/assets/guide/media__1779846012326.png" alt="생년월일 및 출생장소 기입 완료">
                <div class="mockup-image-label">사주 및 출생정보 입력</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- STEP 3: Element Chart Result Display (Saju Section - Mila Miniature) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">3</span>
          <h3 class="guide-section-title">제출 즉시 나타나는 나의 우주 오행 차트 (사주 결과 화면)</h3>
        </div>
        
        <div class="guide-step-row">
          <!-- Left Column: Character Miniature Speech Bubble -->
          <div class="guide-char-col">
            <div class="mini-char-avatar emo-mila" data-name="밀라">🔮</div>
            <div class="char-speech-bubble bubble-purple">
              <b>분석가 밀라의 오행 해설 🔮</b><br><br>
              "맨 하단의 <b>[이벤트 신청]</b> 단추를 누르면, 즉석에서 본인의 <b>오행(나무, 불, 흙, 쇠, 물) 조화도 원형 차트</b>와 만세력 일주 해석 리포트가 렌더링되어 눈앞에 바로 등장합니다!<br><br>
              나를 상징하는 우주 기운 차트를 통해 내가 어떤 기운이 강하고 어떤 상대가 내 부족한 기운을 채워줄지 미리 분석해 볼 수 있지요."
            </div>
          </div>
          
          <!-- Right Column: Screen Mockup -->
          <div class="guide-screen-col">
            <div class="app-screen-mockup" style="text-align:center;">
              <div style="font-size:11px;font-weight:bold;margin-bottom:14px;color:var(--cyan);">[제출 성료 - 나의 오행 밸런스]</div>
              
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
          </div>
        </div>
      </section>
      
      <!-- STEP 4: The Operator Calculation & Matching (Saju Section - Mila Miniature) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">4</span>
          <h3 class="guide-section-title">매칭 연산: MBTI와 사주 오행의 보완 연산 (알고리즘 진행 과정)</h3>
        </div>
        
        <div class="guide-step-row">
          <!-- Left Column: Character Miniature Speech Bubble -->
          <div class="guide-char-col">
            <div class="mini-char-avatar emo-mila" data-name="밀라">🔮</div>
            <div class="char-speech-bubble bubble-purple">
              <b>분석가 밀라의 궁합 연산 🔮</b><br><br>
              "신청 완료 후 운영자가 연산을 실행하면, 본인과 파트너 간의 **MBTI 대화 리듬 점수**와 태어난 오행 간에 **서로가 부족한 기운을 시원하게 보완해 주는 사주 결합 점수**를 정밀하게 추출합니다.<br><br>
              추출된 총체적 매트릭스를 기반으로 최적화 알고리즘인 **'2-opt 전역 매칭 최적화'**를 수행하여, 모든 대원이 최고의 궁합을 만날 수 있게 조율한답니다."
            </div>
          </div>
          
          <!-- Right Column: Screen Mockup -->
          <div class="guide-screen-col">
            <div class="mockup-images-row">
              <div class="mockup-image-wrapper" style="max-width:320px;">
                <img class="real-screen-img" src="/assets/guide/media__1779846024716.png" alt="사주 분석 및 매칭 리포트 생성 중">
                <div class="mockup-image-label">분석 리포트 생성 중</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- STEP 5: Public Results page \`/results\` (Hayoon Miniature) -->
      <section class="guide-block">
        <div class="guide-section-header">
          <span class="guide-section-num">5</span>
          <h3 class="guide-section-title">매칭 결과 공개 및 랭킹 조회 (결과 공개 화면 \`/results\`)</h3>
        </div>
        
        <div class="guide-step-row">
          <!-- Left Column: Character Miniature Speech Bubble -->
          <div class="guide-char-col">
            <div class="mini-char-avatar emo-hayoon" data-name="하윤">🎀</div>
            <div class="char-speech-bubble bubble-pink">
              <b>하윤이의 결과 중계 🎀</b><br><br>
              "매칭 결과가 개개인에 공개되면, \`/results\` 페이지에서 커플들의 **매칭 랭킹 순위**를 볼 수 있어! 1위부터 순서대로 나열된 커플들을 감상해봐!<br><br>
              오른쪽의 **[상세]** 버튼을 탭하면, 두 사람의 첫인상, MBTI 대화 성향 리듬, 사주 일주 분석, 그리고 대화 시 주의할 카운셀링 가이드까지 무진장 자세하게 읽어볼 수 있다구!"
            </div>
          </div>
          
          <!-- Right Column: Screen Mockup -->
          <div class="guide-screen-col">
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
      elements.hours.textContent = padNum(hours);
      elements.minutes.textContent = padNum(minutes);
      elements.seconds.textContent = padNum(seconds);
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Image Lightbox zoom logic
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");

    document.querySelectorAll(".real-screen-img").forEach(img => {
      img.addEventListener("click", function() {
        lightbox.style.display = "block";
        lightboxImg.src = this.src;
        lightboxCaption.textContent = this.alt;
        document.body.style.overflow = "hidden"; // Disable background scrolling when lightbox is open
      });
    });

    function closeLightbox() {
      lightbox.style.display = "none";
      document.body.style.overflow = ""; // Restore background scrolling
    }

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function(e) {
      if (e.target !== lightboxImg) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && lightbox.style.display === "block") {
        closeLightbox();
      }
    });
  </script>

  <!-- Image Lightbox Overlay Modal -->
  <div id="image-lightbox" class="lightbox-modal">
    <span class="lightbox-close">&times;</span>
    <img class="lightbox-content" id="lightbox-img" alt="확대 이미지">
    <div id="lightbox-caption" class="lightbox-caption"></div>
  </div>
</body>
</html>`;
}

module.exports = { guidePage };
