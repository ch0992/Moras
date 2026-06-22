/**
 * Matching Score Explanation Page (알고리즘 및 점수 안내) for Moras.
 *
 * Responsibilities:
 * - Render an engaging, high-end comic scroller explaining MBTI, Saju, Marital filters, and 2-opt Bipartite global matching.
 * - Match design tokens, typography, cosmic starfield background, and countdown lock of info-page.js exactly.
 */

function matchingInfoPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras - 매칭 알고리즘 & 점수 산출 가이드 ✨</title>
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
      gap: 40px;
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
      margin-bottom: 20px;
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
      font-size: clamp(28px, 4vw, 40px);
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
    
    /* Storyboard Scroller */
    .storyboard-scroller {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    
    .info-card {
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .info-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.08);
    }
    
    /* Neon border left accents */
    .card-cyan { border-left: 5px solid var(--cyan); }
    .card-gold { border-left: 5px solid var(--gold); }
    .card-purple { border-left: 5px solid var(--purple); }
    .card-pink { border-left: 5px solid var(--pink); }
    .card-orange { border-left: 5px solid var(--orange); }
    
    .mbti-matrix-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.12) 0%, rgba(162, 155, 254, 0.12) 100%);
      border: 1px solid rgba(0, 242, 254, 0.35);
      color: #fff;
      text-decoration: none;
      font-weight: 800;
      font-size: 14.5px;
      padding: 12px 24px;
      border-radius: 30px;
      box-shadow: 0 4px 15px rgba(0, 242, 254, 0.1);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      margin-top: 16px;
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
    }
    .mbti-matrix-btn:hover {
      transform: translateY(-2px);
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.22) 0%, rgba(162, 155, 254, 0.22) 100%);
      border-color: var(--cyan);
      box-shadow: 0 6px 20px rgba(0, 242, 254, 0.25);
    }
    
    /* EMPHASIZED Section 5 styles */
    .info-card.emphasized {
      background: linear-gradient(135deg, rgba(20, 20, 48, 0.8) 0%, rgba(13, 20, 40, 0.8) 100%);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-left: 5px solid var(--gold);
      position: relative;
    }
    .info-card.emphasized::after {
      content: 'CORE SOLVER 🏆';
      position: absolute;
      top: -12px;
      right: 28px;
      background: linear-gradient(135deg, var(--gold), var(--orange));
      color: #030712;
      font-size: 11px;
      font-weight: 900;
      padding: 4px 12px;
      border-radius: 20px;
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
      letter-spacing: 0.05em;
    }
    
    .card-header-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-badge {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 16px;
      font-weight: 900;
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 50%;
    }
    .card-cyan .card-badge { color: var(--cyan); border-color: rgba(0, 242, 254, 0.2); }
    .card-gold .card-badge { color: var(--gold); border-color: rgba(212, 175, 55, 0.2); }
    .card-purple .card-badge { color: var(--purple); border-color: rgba(162, 155, 254, 0.2); }
    .card-pink .card-badge { color: var(--pink); border-color: rgba(255, 71, 87, 0.2); }
    .card-orange .card-badge { color: var(--orange); border-color: rgba(255, 159, 67, 0.2); }
    
    .card-title {
      font-size: clamp(17px, 2.2vw, 20px);
      font-weight: 800;
      color: #fff;
      margin: 0;
    }
    
    /* Speech Bubble Layout */
    .speech-bubble-layout {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }
    
    .char-avatar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    
    .char-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      background: rgba(255, 255, 255, 0.03);
      border: 2px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .char-avatar:hover {
      transform: scale(1.1) rotate(6deg);
    }
    
    /* Overlapping Stack for Section 5 */
    .avatar-stack {
      position: relative;
      display: inline-flex;
      width: 92px;
      height: 64px;
    }
    .avatar-stack .stack-benji {
      position: absolute;
      left: 0;
      z-index: 2;
    }
    .avatar-stack .stack-hayoon {
      position: absolute;
      left: 28px;
      z-index: 1;
      transform: rotate(-5deg);
    }
    .avatar-stack:hover .stack-benji {
      transform: scale(1.05) rotate(4deg);
    }
    .avatar-stack:hover .stack-hayoon {
      transform: translate(6px, -2px) scale(1.05) rotate(8deg);
      z-index: 3;
    }
    
    .char-name {
      font-size: 12.5px;
      font-weight: 800;
      color: var(--muted);
      letter-spacing: 0.02em;
    }
    .speaker-mila { color: var(--purple); }
    .speaker-hayoon { color: var(--pink); }
    .speaker-benji { color: var(--orange); }
    .speaker-combo { color: #f8fafc; }
    
    /* Specific Avatar Borders and Aura Glows */
    .avatar-benji {
      background: radial-gradient(circle, rgba(255, 159, 67, 0.15) 0%, rgba(13, 20, 40, 0.85) 100%);
      border-color: rgba(255, 159, 67, 0.35);
      box-shadow: 0 0 15px rgba(255, 159, 67, 0.15);
    }
    .avatar-mila {
      background: radial-gradient(circle, rgba(162, 155, 254, 0.15) 0%, rgba(13, 20, 40, 0.85) 100%);
      border-color: rgba(162, 155, 254, 0.35);
      box-shadow: 0 0 15px rgba(162, 155, 254, 0.15);
    }
    .avatar-hayoon {
      background: radial-gradient(circle, rgba(255, 71, 87, 0.15) 0%, rgba(13, 20, 40, 0.85) 100%);
      border-color: rgba(255, 71, 87, 0.35);
      box-shadow: 0 0 15px rgba(255, 71, 87, 0.15);
    }
    
    .speech-bubble {
      flex-grow: 1;
      position: relative;
      background: rgba(10, 15, 30, 0.85);
      border-radius: 18px;
      padding: 20px 24px;
      border: 1px solid var(--line);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }
    
    .speech-bubble::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 22px;
      border-width: 10px 10px 10px 0;
      border-style: solid;
      border-color: transparent rgba(10, 15, 30, 0.85) transparent transparent;
      display: block;
      width: 0;
      z-index: 2;
    }
    .speech-bubble::after {
      content: '';
      position: absolute;
      left: -11px;
      top: 21px;
      border-width: 11px 11px 11px 0;
      border-style: solid;
      border-color: transparent var(--line) transparent transparent;
      display: block;
      width: 0;
      z-index: 1;
    }
    
    .dialogue-text {
      font-size: 15px;
      line-height: 1.7;
      color: #cbd5e1;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .dialogue-text strong {
      color: #fff;
      font-weight: 800;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
    }
    .dialogue-text em {
      font-style: normal;
      color: var(--cyan);
      font-weight: bold;
    }
    
    /* Technical Info Card (Displaying Formula weights) */
    .tech-card {
      margin-top: 16px;
      background: rgba(4, 6, 12, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      padding: 18px 20px;
      display: grid;
      gap: 12px;
    }
    
    .tech-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13.5px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      padding-bottom: 8px;
    }
    .tech-row:last-child {
      border: none;
      padding: 0;
    }
    
    .tech-label {
      font-weight: bold;
      color: #94a3b8;
    }
    .tech-value {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      color: var(--cyan);
      text-shadow: 0 0 8px rgba(0, 242, 254, 0.3);
    }
    .tech-value.pink {
      color: var(--pink);
      text-shadow: 0 0 8px rgba(255, 71, 87, 0.3);
    }
    .tech-value.gold {
      color: var(--gold);
      text-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
    }
    
    .tech-formula {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      color: #94a3b8;
      background: rgba(0, 0, 0, 0.4);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 14px;
      text-align: center;
      word-break: break-all;
    }
    .tech-formula strong {
      color: #fff;
    }
    
    /* Bottom CTA Panel */
    .final-cta {
      width: 100%;
      text-align: center;
      padding: 54px 40px;
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
      font-size: clamp(24px, 3.5vw, 34px);
      font-weight: 900;
      margin: 0 0 14px;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.01em;
    }
    .final-desc {
      font-size: clamp(14px, 1.8vw, 16.5px);
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
      font-size: clamp(16px, 2vw, 19px);
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
    
    /* Secondary links grid */
    .secondary-links-row {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      gap: 24px;
    }
    .secondary-link {
      color: var(--muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      transition: all 0.25s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      opacity: 0.8;
      border-bottom: 1px solid transparent;
    }
    .secondary-link:hover {
      color: var(--cyan);
      opacity: 1;
      border-bottom-color: rgba(0, 242, 254, 0.3);
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
      header { height: auto; flex-wrap: wrap; padding: 10px 16px 0; gap: 0; }
      .nav-links {
        display: flex; order: 3; width: 100%;
        overflow-x: auto; flex-wrap: nowrap; gap: 4px;
        padding: 8px 0 10px; -webkit-overflow-scrolling: touch; scrollbar-width: none;
      }
      .nav-links::-webkit-scrollbar { display: none; }
      .nav-link { font-size: 11.5px; padding: 5px 11px; white-space: nowrap; flex-shrink: 0; }
      main {
        margin: 118px auto 60px;
        gap: 32px;
      }
      .hero-intro {
        padding: 28px 18px;
      }
      .info-card {
        padding: 24px 20px;
        border-radius: 20px;
      }
      .speech-bubble-layout {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
      }
      .char-avatar-container {
        width: 100%;
      }
      .speech-bubble {
        width: 100%;
        padding: 16px 18px;
      }
      .speech-bubble::before, .speech-bubble::after {
        display: none;
      }
      .dialogue-text {
        text-align: left;
      }
      .avatar-stack {
        width: 80px;
        height: 52px;
      }
      .avatar-stack .stack-benji {
        width: 52px;
        height: 52px;
        font-size: 24px;
      }
      .avatar-stack .stack-hayoon {
        width: 52px;
        height: 52px;
        font-size: 24px;
        left: 24px;
      }
      .tech-card {
        padding: 14px;
      }
      .tech-row {
        font-size: 12.5px;
      }
      .final-cta {
        padding: 40px 20px;
      }
      .secondary-links-row {
        flex-direction: column;
        align-items: center;
        gap: 12px;
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
      <div class="nav-dropdown" id="dd-notice">
        <button class="nav-dropdown-btn" id="dd-notice-btn" aria-haspopup="true" aria-expanded="false">공지사항 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
        <div class="nav-dropdown-menu" id="dd-notice-menu" role="menu">
          <a href="/roulette-prizes" class="nav-dropdown-item" role="menuitem">🎁 룰렛상품안내</a>
        </div>
      </div>
      <a href="/must-know" class="nav-link" id="link-must-know">필독안내</a>
      <a href="/promo" class="nav-link" id="link-promo">소개웹툰</a>
      <a href="/guide" class="nav-link" id="link-guide">진행방법</a>
      <a href="/info" class="nav-link" id="link-info">안심가이드</a>
      <a href="/matching-info" class="nav-link active" id="link-matching-info">알고리즘</a>
      <a href="/mbti-matrix" class="nav-link" id="link-mbti-matrix">MBTI궁합표</a>
    </nav>
    
    <a href="/" class="cta-btn-header locked" id="header-cta-btn">이벤트 신청하기</a>
  </header>
  
  <main>
    <!-- Intro Hero Card -->
    <section class="hero-intro">
      <div class="hero-tag">Moras Scientific Matching Engine</div>
      <h2 class="hero-title">수학이 찾아내는 완벽한 궁합 ✨</h2>
      <p class="hero-desc">
        성격의 조화(MBTI)와 동양 철학(사주 오행)이 융합된 정밀 스코어링 공식부터<br>
        전체 참가자의 행복을 극대화하는 전역 최적화 알고리즘까지 투명하게 공개합니다!
      </p>
    </section>
    
    <!-- Storyboard Scroller -->
    <div class="storyboard-scroller">
      
      <!-- Panel 1: Overview (Orange) -->
      <article class="info-card card-orange">
        <div class="card-header-row">
          <span class="card-badge">📊</span>
          <h3 class="card-title">MORAS 점수 결합의 핵심원리</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="char-avatar avatar-benji">🦊</div>
            <div class="char-name speaker-benji">벤지</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "안녕! 난 분위기 메이커 벤지야! MORAS 매칭 엔진은 <strong>성격(MBTI) 호환성 30%</strong>와 <strong>기운(사주 오행) 보완성 70%</strong>를 기반으로 작동해!<br>
              한쪽 기준에만 치우친 커플 매칭이 되지 않도록, 두 점수의 극단적 편차를 바로잡는 <em>'편차 편중 보정 공식'</em>을 더해 최종 점수가 정밀하게 조율된단 말씀! 🦊"
            </p>
            <div class="tech-card">
              <div class="tech-formula">
                최종 점수 = <strong>(기본 가중 점수) × 0.88 + (편차 일치도) × 0.12</strong><br>
                <span style="font-size:11px;color:var(--muted);">(기본 가중 점수 = MBTI 점수 × 0.3 + 사주 점수 × 0.7)</span>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      <!-- Panel 2: MBTI score (Purple) -->
      <article class="info-card card-purple">
        <div class="card-header-row">
          <span class="card-badge">🧠</span>
          <h3 class="card-title">MBTI 친화도 점수 계산 공식</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="char-avatar avatar-mila">🔮</div>
            <div class="char-name speaker-mila">밀라</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "MBTI 성격 연산은 대중적으로 가장 잘 알려진 <strong>16x16 MBTI 표준 관계 궁합표</strong>를 기준으로 정밀하게 계산됩니다.<br>
              두 사람이 만났을 때의 호환성 등급에 따라 <em>🔵 천생연분부터 🔴 파국(최악)까지 총 5단계</em>의 점수 맵핑을 거쳐 최종 성격 케미 점수가 결정됩니다."
            </p>
            <div style="margin-top: 16px; margin-bottom: 8px; text-align: center;">
              <a href="/mbti-matrix" class="mbti-matrix-btn">📊 16x16 MBTI 표준 궁합표 한눈에 보기 🔵</a>
            </div>
            <div class="tech-card">
              <div class="tech-row">
                <span class="tech-label">🔵 천생연분 (최고의 궁합 - Level 5)</span>
                <span class="tech-value">100 점</span>
              </div>
              <div class="tech-row">
                <span class="tech-label">🟢 아주 좋음 (친해지기 쉬움 - Level 4)</span>
                <span class="tech-value">90 점</span>
              </div>
              <div class="tech-row">
                <span class="tech-label">🟡 보통/무난 (서로 무난함 - Level 3)</span>
                <span class="tech-value">80 점</span>
              </div>
              <div class="tech-row">
                <span class="tech-label">🟠 그닥 (노력이 필요함 - Level 2)</span>
                <span class="tech-value">70 점</span>
              </div>
              <div class="tech-row">
                <span class="tech-label">🔴 최악/상극 (파국 관계 - Level 1)</span>
                <span class="tech-value pink">60 점</span>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      <!-- Panel 3: Saju score (Pink) -->
      <article class="info-card card-pink">
        <div class="card-header-row">
          <span class="card-badge">🔮</span>
          <h3 class="card-title">사주 오행 상호 보완 & 일주 조화 연산</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="char-avatar avatar-mila">🔮</div>
            <div class="char-name speaker-mila">밀라</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "동양 사상에 기초한 사주 연산은 상호 기운의 시너지를 연산합니다.<br>
              내가 가진 오행 중 <strong>약하거나 결핍된 오행을 상대방이 강하게 채워주는 보완 기운(최대 +16점)</strong>, 그리고 태어난 날짜의 하늘 기운인 <strong>일간 상생(최대 +20점)</strong>과 땅의 기운인 <strong>일지 삼합 조율(최대 +15점)</strong>을 조합하여 <em>최소 50점에서 최대 100점</em> 사이의 우주 궁합을 도출합니다!"
            </p>
            <div class="tech-card">
              <div class="tech-row">
                <span class="tech-label">결핍 오행 보완 (내 약한 오행 ↔ 상대 강한 오행)</span>
                <span class="tech-value">+3.2 점 (개당 최대 +16점)</span>
              </div>
              <div class="tech-row">
                <span class="tech-label">하늘의 운명 연결 (일간 상생/생함)</span>
                <span class="tech-value">+20 점</span>
              </div>
              <div class="tech-row">
                <span class="tech-label">땅의 흐름 연결 (일지 삼합/합함)</span>
                <span class="tech-value">+15 점</span>
              </div>
              <div class="tech-row">
                <span class="tech-label">일지 충돌 발생 (상극)</span>
                <span class="tech-value pink">-8 점 감점</span>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      <!-- Panel 4: Marital filter (Cyan) -->
      <article class="info-card card-cyan">
        <div class="card-header-row">
          <span class="card-badge">🔒</span>
          <h3 class="card-title">혼인상태 범위에 따른 철저한 후보 제외</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="char-avatar avatar-hayoon">🎀</div>
            <div class="char-name speaker-hayoon">하윤</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "매칭에서 가장 중요한 것은 본인이 동의한 파트너의 기준입니다!<br>
              태어난 사주나 성격 궁합이 100점에 가깝도록 높게 도출되었을지라도, 본인이 설정한 <strong>상대 혼인상태 범위(싱글/돌싱 등)를 벗어나는 매칭 대상은 1순위에서 즉각 제외</strong>됩니다.<br>
              한쪽의 선호도가 무시되는 매칭은 원천 불가능하도록 설계되어 있으니 안심하세요! 🔒"
            </p>
            <div class="tech-card">
              <div class="tech-formula">
                <strong>(내 설정 범위 외) OR (상대 설정 범위 외) ➔ 매칭 가능군에서 즉시 제외 (Score Matrix ➔ undefined)</strong>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      <!-- Panel 5: 2-opt Solver (Gold / Emphasized) -->
      <article class="info-card emphasized">
        <div class="card-header-row">
          <span class="card-badge">🏆</span>
          <h3 class="card-title">행복 총량을 극대화하는 2-opt 전역 매칭</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="avatar-stack">
              <div class="char-avatar avatar-benji stack-benji">🦊</div>
              <div class="char-avatar avatar-hayoon stack-hayoon">🎀</div>
            </div>
            <div class="char-name speaker-combo">벤지 & 하윤</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "개별 점수 연산이 끝나면 최종적으로 <strong>2-opt 이분 그래프 전역 매칭 최적화 알고리즘</strong>을 가동해!<br>
              특정 한 사람만 100점 혜택을 보고 나머지는 낮은 점수에 배치되는 불공평한 구조가 아니라, <strong>참가자 전체의 궁합 점수 합(행복지수 총량)이 가장 높은 전역 균형 상태</strong>를 찾을 때까지 매칭 관계를 계속 꼬리 물어 스왑(Swap)하며 최종 커플 목록을 완성한답니다! 🏆"
            </p>
            <div class="tech-card">
              <div class="tech-row">
                <span class="tech-label">전역 최적화 알고리즘</span>
                <span class="tech-value gold">Bipartite Greedy + 2-opt Swap Optimization</span>
              </div>
              <div class="tech-row">
                <span class="tech-label">최종 매칭 성공 기준</span>
                <span class="tech-value gold">그룹 내 궁합 평균점수 & 전체 행복도 극대화</span>
              </div>
            </div>
          </div>
        </div>
      </article>
      
    </div>
    
    <!-- Final CTA Card -->
    <section class="final-cta">
      <h3 class="final-title" id="final-cta-status">우주가 속삭이는 당신의 짝, 6월 1일에 찾아갑니다</h3>
      <p class="final-desc">
        성격의 친화성과 사주 오행의 균형이 만들어 내는 정밀한 시스템 속에서<br>
        나에게 최고의 시너지를 선물해 줄 특별한 연분을 탐색하세요!
      </p>
      
      <a href="/" class="cta-button-main locked" id="final-cta-btn">
        <span id="btn-text">이벤트 신청 대기 중...</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      
      <div class="secondary-links-row">
        <a href="/guide" class="secondary-link">
          <span>진행방법 보기</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
        <a href="/info" class="secondary-link">
          <span>안심 가이드 보기</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>
    </section>
    
  </main>
  
  <footer class="global-footer">
    <p>&copy; 2026 MORAS. All rights reserved.</p>
    <p>재미와 조화로운 커뮤니티 연결을 목표로 합니다. 결정론적인 운명 해석은 피해주세요. | <a href="/admin">어드민 로그인</a></p>
  </footer>
  
  <script>
    // Countdown Target: 2026-05-31T16:00:00Z (Matches promo-page.js exactly)
    const eventStartTime = new Date("2026-05-31T16:00:00Z").getTime();
    
    const elements = {
      finalStatus: document.getElementById("final-cta-status"),
      headerBtn: document.getElementById("header-cta-btn"),
      finalBtn: document.getElementById("final-cta-btn"),
      btnText: document.getElementById("btn-text")
    };
    
    function updateCountdown() {
      const remaining = eventStartTime - Date.now();
      
      if (remaining <= 0) {
        if (elements.finalStatus) elements.finalStatus.textContent = "우주의 문이 열렸습니다! 지금 참여하세요!";
        
        if (elements.headerBtn) {
          elements.headerBtn.classList.remove("locked");
          elements.headerBtn.href = "/";
          elements.headerBtn.textContent = "지금 신청하기 🌌";
        }
        
        if (elements.finalBtn) {
          elements.finalBtn.classList.remove("locked");
          elements.finalBtn.href = "/";
        }
        if (elements.btnText) {
          elements.btnText.textContent = "지금 운명 등록하기 (이벤트 오픈!)";
        }
        return;
      }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    (function() { var btn=document.getElementById("dd-notice-btn"),menu=document.getElementById("dd-notice-menu"); if(!btn||!menu)return; btn.addEventListener("click",function(e){e.stopPropagation();var o=menu.classList.toggle("open");btn.classList.toggle("open",o);btn.setAttribute("aria-expanded",o);}); document.addEventListener("click",function(){menu.classList.remove("open");btn.classList.remove("open");btn.setAttribute("aria-expanded",false);}); })();
  </script>
</body>
</html>`;
}

module.exports = { matchingInfoPage };
