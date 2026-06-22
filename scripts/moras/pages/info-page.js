/**
 * Participant Reassurance Page (안심 가이드 / 자주 묻는 질문) for Moras.
 *
 * Responsibilities:
 * - Render reassurance cards explaining privacy, choice of matching, purpose, accuracy, and future event cycles.
 * - Match typography and aesthetic tokens of promo-page.js exactly.
 * - Sync countdown lock mechanism for the header and footer CTA buttons.
 */

function infoPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras - 안심하고 신청하세요 (참가 전 꼭 알아둘 사항) ✨</title>
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
    .nav-dropdown-item:hover { color: var(--gold, #FFE8A3); background: rgba(255,232,163,.08); }
    
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
    
    /* Reassurance List Scroller */
    .reassurance-scroller {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    
    .info-card {
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      gap: 20px;
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
    
    /* EMPHASIZED Section 4 styles */
    .info-card.emphasized {
      background: linear-gradient(135deg, rgba(20, 20, 48, 0.8) 0%, rgba(13, 20, 40, 0.8) 100%);
      border: 1px solid rgba(255, 71, 87, 0.25);
      border-left: 5px solid var(--pink);
      position: relative;
    }
    .info-card.emphasized::after {
      content: 'MUST READ 🔮';
      position: absolute;
      top: -12px;
      right: 28px;
      background: linear-gradient(135deg, var(--pink), var(--purple));
      color: #fff;
      font-size: 11px;
      font-weight: 900;
      padding: 4px 12px;
      border-radius: 20px;
      box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
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
      width: 32px;
      height: 32px;
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
      margin-top: 6px;
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
    .info-card:hover .speech-bubble {
      border-color: rgba(255, 255, 255, 0.1);
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
    
    /* Section 4 Glowing Callout Box */
    .glowing-callout {
      margin-top: 18px;
      padding: 16px 20px;
      border-radius: 12px;
      background: rgba(255, 71, 87, 0.05);
      border: 1px solid rgba(255, 71, 87, 0.25);
      color: var(--text);
      font-weight: 700;
      font-size: 13.5px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 0 15px rgba(255, 71, 87, 0.05);
      animation: pulseGlow 3s infinite ease-in-out;
    }
    
    @keyframes pulseGlow {
      0%, 100% {
        box-shadow: 0 0 12px rgba(255, 71, 87, 0.04);
        border-color: rgba(255, 71, 87, 0.25);
        background: rgba(255, 71, 87, 0.05);
      }
      50% {
        box-shadow: 0 0 22px rgba(255, 71, 87, 0.15);
        border-color: rgba(255, 71, 87, 0.4);
        background: rgba(255, 71, 87, 0.08);
      }
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
    
    /* Secondary Link Styling */
    .secondary-link-container {
      margin-top: 20px;
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
        display: none; /* remove pointer on mobile stack layout */
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
      <div class="nav-dropdown" id="dd-notice">
        <button class="nav-dropdown-btn" id="dd-notice-btn" aria-haspopup="true" aria-expanded="false">공지사항 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
        <div class="nav-dropdown-menu" id="dd-notice-menu" role="menu">
          <a href="/roulette-prizes" class="nav-dropdown-item" role="menuitem">🎁 룰렛상품안내</a>
        </div>
      </div>
      <a href="/must-know" class="nav-link" id="link-must-know">필독안내</a>
      <a href="/promo" class="nav-link" id="link-promo">소개웹툰</a>
      <a href="/guide" class="nav-link" id="link-guide">진행방법</a>
      <a href="/info" class="nav-link active" id="link-info">안심가이드</a>
      <a href="/matching-info" class="nav-link" id="link-matching-info">알고리즘</a>
      <a href="/mbti-matrix" class="nav-link" id="link-mbti-matrix">MBTI궁합표</a>
    </nav>
    
    <a href="/" class="cta-btn-header locked" id="header-cta-btn">이벤트 신청하기</a>
  </header>
  
  <main>
    <!-- Intro Hero Card -->
    <section class="hero-intro">
      <div class="hero-tag">Moras Participant Reassurance</div>
      <h2 class="hero-title">참가 전 꼭 알아두세요 ✨</h2>
      <p class="hero-desc">
        Moras 이벤트 신청과 진행 과정에서 궁금해하시는 부분이나<br>
        걱정하시는 내용을 꼼꼼하게 정리해 드립니다. 안심하고 즐겁게 구경해 보세요!
      </p>
    </section>
    
    <!-- Reassurance List Scroller -->
    <div class="reassurance-scroller">
      
      <!-- Section 1 — 🔒 개인정보 걱정 없어요 -->
      <article class="info-card card-cyan">
        <div class="card-header-row">
          <span class="card-badge">🔒</span>
          <h3 class="card-title">개인정보 걱정 없어요</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="char-avatar avatar-mila">🔮</div>
            <div class="char-name speaker-mila">밀라</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "입력하신 생년월일은 <strong>절대 저장되지 않아요.</strong><br>
              생년월일을 바탕으로 계산된 만세력 데이터(천간·지지·오행)만 저장되며,<br>
              원래 날짜는 즉시 버려집니다."
            </p>
          </div>
        </div>
      </article>
      
      <!-- Section 2 — 💌 매칭 결과는 내가 선택해요 -->
      <article class="info-card card-gold">
        <div class="card-header-row">
          <span class="card-badge">💌</span>
          <h3 class="card-title">매칭 결과는 내가 선택해요</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="char-avatar avatar-hayoon">🎀</div>
            <div class="char-name speaker-hayoon">하윤</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "매칭이 이루어졌다고 해서 무조건 진행되는 건 아니에요.<br>
              <strong>결과를 보고 원하지 않으면 거절할 수 있어요.</strong><br>
              현재 커플인 친구가 다른 사람과 매칭되더라도 거절하면 그만이에요 — 아무 걱정 마세요!"
            </p>
          </div>
        </div>
      </article>
      
      <!-- Section 3 — 🌌 커플 만들기가 목적이 아니에요 -->
      <article class="info-card card-purple">
        <div class="card-header-row">
          <span class="card-badge">🌌</span>
          <h3 class="card-title">커플 만들기가 목적이 아니에요</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="char-avatar avatar-benji">🦊</div>
            <div class="char-name speaker-benji">벤지</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "Moras는 <strong>'나와 잘 맞는 사람'을 탐색하는 플랫폼</strong>이에요.<br>
              연애 강요? 없어요. 그냥 사주 궁합으로 '이 친구랑 나 잘 맞네?' 발견하는 재미죠.<br>
              부담 없이 구경만 해도 괜찮아요 🦊"
            </p>
          </div>
        </div>
      </article>
      
      <!-- Section 4 — 🔮 사주가 생각보다 진짜 잘 맞아요 (EMPHASIZED) -->
      <article class="info-card emphasized">
        <div class="card-header-row">
          <span class="card-badge">🔮</span>
          <h3 class="card-title">사주가 생각보다 진짜 잘 맞아요</h3>
        </div>
        <div class="speech-bubble-layout">
          <div class="char-avatar-container">
            <div class="char-avatar avatar-mila">🔮</div>
            <div class="char-name speaker-mila">밀라</div>
          </div>
          <div class="speech-bubble">
            <p class="dialogue-text">
              "믿거나 말거나였던 밀라도 인정했어요. 꽤나 정확해요.<br>
              이벤트 참여하면 <strong>내 사주 분석 결과도 함께 볼 수 있어요</strong> — 오늘의 운세, 성격 유형, 강점까지.<br>
              재미 삼아 보는 사주치고는 퀄리티가 남달라요 🔮"
            </p>
            <div class="glowing-callout">
              <span>✨ 사주 결과는 이벤트 신청과 동시에 바로 확인 가능!</span>
            </div>
          </div>
        </div>
      </article>
      
      <!-- Section 5 — 🚀 Moras는 계속됩니다 -->
      <article class="info-card card-orange">
        <div class="card-header-row">
          <span class="card-badge">🚀</span>
          <h3 class="card-title">Moras는 계속됩니다</h3>
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
              "이번 한 번으로 끝나는 이벤트가 아니에요.<br>
              Moras는 <strong>주기적으로 새로운 이벤트</strong>를 준비하고 있어요.<br>
              이번 이벤트가 맞지 않아도 — 다음 이벤트에서 또 만나요 🎀"
            </p>
          </div>
        </div>
      </article>
      
    </div>
    
    <!-- Final CTA Card -->
    <section class="final-cta">
      <h3 class="final-title" id="final-cta-status">우주가 속삭이는 당신의 짝, 6월 1일에 찾아갑니다</h3>
      <p class="final-desc">
        이벤트 신청 기간에 생년월일과 MBTI를 기반으로<br>
        나와 시너지가 맞는 놀라운 조화의 매칭 상대를 발견해 보세요!
      </p>
      
      <a href="/" class="cta-button-main locked" id="final-cta-btn">
        <span id="btn-text">이벤트 신청 대기 중...</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      
      <div class="secondary-link-container">
        <a href="/guide" class="secondary-link">
          <span>진행방법 자세히 보기</span>
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

module.exports = { infoPage };
