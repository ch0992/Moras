/**
 * Interactive 16x16 MBTI Compatibility Matrix Page for Moras.
 *
 * Responsibilities:
 * - Render a fully responsive, interactive 16x16 table of all MBTI relations.
 * - Color-code cells and display compatibility scores (100, 90, 80, 70, 60).
 * - Show a dynamic floating preview card that updates on cell hover or touch.
 * - Keep design tokens, typography, and countdown lock identical to other Moras pages.
 */

function mbtiMatrixPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras - 16x16 MBTI 표준 관계 궁합표 ✨</title>
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
      gap: 36px;
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
      margin-bottom: 12px;
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
    
    /* Interactive Preview Card */
    .preview-card {
      width: 100%;
      background: var(--panel);
      border: 1px solid rgba(0, 242, 254, 0.2);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 15px 35px rgba(0, 242, 254, 0.05), inset 0 1px 1px rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.3s ease;
      min-height: 154px;
      position: relative;
      overflow: hidden;
    }
    .preview-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at 10% -10%, rgba(0, 242, 254, 0.08) 0%, transparent 60%);
      pointer-events: none;
    }
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 10px;
    }
    .preview-types {
      font-size: clamp(18px, 2.5vw, 24px);
      font-weight: 900;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .preview-arrow {
      color: var(--gold);
      animation: pulseArrow 1.5s infinite;
    }
    @keyframes pulseArrow {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 1; }
    }
    .preview-badge {
      font-size: 13.5px;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 30px;
      letter-spacing: 0.02em;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .preview-content {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 20px;
      align-items: center;
    }
    
    .preview-desc {
      font-size: 15px;
      line-height: 1.6;
      color: #cbd5e1;
      margin: 0;
    }
    
    .preview-score-box {
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 10px 20px;
      min-width: 100px;
    }
    .preview-score-label {
      font-size: 10.5px;
      font-weight: bold;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .preview-score-val {
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 900;
      color: var(--cyan);
      text-shadow: 0 0 10px rgba(0, 242, 254, 0.4);
      line-height: 1.1;
    }
    
    /* Interactive 16x16 Table Layout */
    .table-scroll-container {
      width: 100%;
      overflow-x: auto;
      border-radius: 20px;
      border: 1px solid var(--line);
      box-shadow: 0 25px 60px rgba(0,0,0,0.45);
      background: rgba(13, 20, 40, 0.45);
      position: relative;
    }
    
    table.matrix-table {
      border-collapse: collapse;
      width: 100%;
      min-width: 900px;
      text-align: center;
    }
    
    table.matrix-table th, table.matrix-table td {
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
    }
    
    table.matrix-table th {
      padding: 14px 8px;
      font-size: 13.5px;
      font-weight: 800;
      color: var(--muted);
      background: rgba(13, 20, 40, 0.98);
    }
    
    /* Sticky Top Header */
    table.matrix-table thead tr th {
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 2px solid var(--line);
    }
    
    /* Sticky Left Header */
    table.matrix-table tbody th:first-child {
      position: sticky;
      left: 0;
      background: rgba(13, 20, 40, 0.98);
      z-index: 5;
      border-right: 2px solid var(--line);
      color: #fff;
      font-weight: 900;
    }
    
    /* Sticky Intersection top-left cell */
    table.matrix-table thead tr th:first-child {
      position: sticky;
      left: 0;
      top: 0;
      background: rgba(10, 15, 30, 0.99);
      z-index: 15;
    }
    
    /* Table cells td details */
    table.matrix-table td {
      padding: 10px 4px;
      font-size: 13.5px;
      font-weight: 900;
      cursor: pointer;
    }
    
    /* Compatibility cell weights standard styles */
    .cell-level-5 {
      background: rgba(0, 242, 254, 0.18);
      color: var(--cyan);
    }
    .cell-level-4 {
      background: rgba(46, 204, 113, 0.15);
      color: #2ecc71;
    }
    .cell-level-3 {
      background: rgba(162, 155, 254, 0.12);
      color: var(--purple);
    }
    .cell-level-2 {
      background: rgba(243, 156, 18, 0.08);
      color: var(--orange);
    }
    .cell-level-1 {
      background: rgba(255, 71, 87, 0.18);
      color: var(--pink);
    }
    
    /* Matrix Hover Guide Lines (Crosshairs) & Pop-Out Lift */
    table.matrix-table td:hover {
      transform: scale(1.25) translateY(-5px);
      z-index: 8;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), 0 0 15px currentColor;
      border-radius: 8px;
      border-color: currentColor !important;
    }
    
    /* Dynamic active highlights via JavaScript classes */
    table.matrix-table tr.row-active {
      background: rgba(255, 255, 255, 0.02);
    }
    table.matrix-table tr.row-active tbody th:first-child {
      color: var(--cyan);
      text-shadow: 0 0 8px rgba(0, 242, 254, 0.3);
    }
    table.matrix-table th.col-active {
      color: var(--cyan) !important;
      text-shadow: 0 0 8px rgba(0, 242, 254, 0.3);
      background: rgba(20, 30, 60, 0.98) !important;
    }
    
    /* Legends card */
    .legend-card {
      width: 100%;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 18px 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      font-weight: 700;
    }
    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
    }
    
    /* Bottom CTA Card */
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
      margin-top: 20px;
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
        gap: 28px;
      }
      .hero-intro {
        padding: 28px 18px;
      }
      .preview-card {
        padding: 16px;
        min-height: auto;
      }
      .preview-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .preview-content {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .preview-score-box {
        align-self: flex-start;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        width: 100%;
        justify-content: space-between;
      }
      .preview-score-val {
        font-size: 24px;
      }
      table.matrix-table td {
        padding: 8px 2px;
        font-size: 12px;
      }
      .legend-card {
        padding: 12px 16px;
        gap: 12px;
      }
      .legend-item {
        font-size: 12px;
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
    
    /* Cosmic Modal Popup Styles */
    .mbti-modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(3, 7, 18, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 200;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      padding: 20px;
    }
    .mbti-modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    
    .mbti-modal-container {
      width: min(580px, 100%);
      background: rgba(13, 20, 40, 0.95);
      border: 1px solid rgba(0, 242, 254, 0.25);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 25px 60px rgba(0, 242, 254, 0.15), inset 0 1px 1px rgba(255,255,255,0.08);
      position: relative;
      transform: translateY(30px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .mbti-modal-overlay.active .mbti-modal-container {
      transform: translateY(0) scale(1);
    }
    
    .mbti-modal-close {
      position: absolute;
      top: 20px; right: 20px;
      background: none;
      border: none;
      color: var(--muted);
      font-size: 28px;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
      transition: color 0.25s ease;
      z-index: 10;
    }
    .mbti-modal-close:hover {
      color: #fff;
    }
    
    .mbti-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    
    .modal-types {
      font-size: 26px;
      font-weight: 900;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .modal-arrow {
      color: var(--gold);
    }
    
    .modal-badge {
      font-size: 14px;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 30px;
      letter-spacing: 0.02em;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .mbti-modal-body {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: center;
    }
    
    .modal-desc {
      font-size: 15.5px;
      line-height: 1.7;
      color: #cbd5e1;
      margin: 0;
    }
    
    .modal-score-box {
      text-align: center;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 14px 24px;
      min-width: 120px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }
    
    .modal-score-label {
      font-size: 11px;
      font-weight: bold;
      color: var(--muted);
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    
    .modal-score-val {
      font-family: 'Outfit', sans-serif;
      font-size: 38px;
      font-weight: 900;
      line-height: 1.1;
    }
    
    .mbti-modal-footer {
      margin-top: 28px;
      display: flex;
      justify-content: flex-end;
    }
    
    .modal-close-action {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      padding: 10px 24px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .modal-close-action:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    @media (max-width: 576px) {
      .mbti-modal-container {
        padding: 24px;
      }
      .mbti-modal-body {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .modal-score-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
      }
      .modal-score-val {
        font-size: 28px;
      }
      .mbti-modal-footer {
        margin-top: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="nebula-glow-1"></div>
  <div class="nebula-glow-2"></div>
  
  <!-- Cosmic Modal Popup for MBTI Details -->
  <div class="mbti-modal-overlay" id="mbti-modal" aria-hidden="true" role="dialog">
    <div class="mbti-modal-container">
      <button class="mbti-modal-close" id="modal-close-btn" aria-label="Close dialog">&times;</button>
      <div class="mbti-modal-header">
        <div class="modal-types" id="modal-types-label">
          <span>유형</span> <span class="modal-arrow">↔</span> <span>유형</span>
        </div>
        <span class="modal-badge" id="modal-badge">등급</span>
      </div>
      <div class="mbti-modal-body">
        <p class="modal-desc" id="modal-desc">
          상세 내용
        </p>
        <div class="modal-score-box">
          <div class="modal-score-label">MATCH SCORE</div>
          <div class="modal-score-val" id="modal-score-val">--</div>
        </div>
      </div>
      <div class="mbti-modal-footer">
        <button class="modal-close-action" id="modal-close-action-btn">닫기</button>
      </div>
    </div>
  </div>
  
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
      <a href="/matching-info" class="nav-link" id="link-matching-info">알고리즘</a>
      <a href="/mbti-matrix" class="nav-link active" id="link-mbti-matrix">MBTI궁합표</a>
    </nav>
    
    <a href="/" class="cta-btn-header locked" id="header-cta-btn">이벤트 신청하기</a>
  </header>
  
  <main>
    <!-- Intro Hero Card -->
    <section class="hero-intro">
      <div class="hero-tag">16x16 MBTI Compatibility Chart</div>
      <h2 class="hero-title">MBTI 표준 관계 궁합표 📊</h2>
      <p class="hero-desc">
        인터넷에서 널리 활용되는 16x16 표준 성격 관계 매트릭스입니다.<br>
        궁합표의 셀을 터치하거나 마우스를 올리면 각 유형 간의 상세 호환 등급과 점수를 한눈에 보실 수 있습니다.
      </p>
    </section>
    
    <!-- Legend Card -->
    <section class="legend-card">
      <div class="legend-item" style="color: var(--cyan);"><span class="legend-dot"></span><span>🔵 천생연분 (100점)</span></div>
      <div class="legend-item" style="color: #2ecc71;"><span class="legend-dot"></span><span>🟢 아주 좋음 (90점)</span></div>
      <div class="legend-item" style="color: var(--purple);"><span class="legend-dot"></span><span>🟡 보통/무난 (80점)</span></div>
      <div class="legend-item" style="color: var(--orange);"><span class="legend-dot"></span><span>🟠 그닥 (70점)</span></div>
      <div class="legend-item" style="color: var(--pink);"><span class="legend-dot"></span><span>🔴 최악/상극 (60점)</span></div>
    </section>
    
    <!-- Interactive Preview Card -->
    <section class="preview-card" id="interactive-preview">
      <div class="preview-header">
        <div class="preview-types" id="preview-types-label">
          <span>유형을 선택해 보세요</span>
        </div>
        <span class="preview-badge" id="preview-badge" style="background: rgba(255,255,255,0.05); color: #fff;">INFO 🔍</span>
      </div>
      <div class="preview-content">
        <p class="preview-desc" id="preview-desc">
          아래 16x16 궁합 매트릭스 테이블에서 원하시는 유형 간의 교차점에 마우스를 올리거나 탭해 보세요! 상세한 성격 보완 해석과 점수 데이터를 실시간으로 보실 수 있습니다.
        </p>
        <div class="preview-score-box">
          <div class="preview-score-label">MATCH SCORE</div>
          <div class="preview-score-val" id="preview-score-val">--</div>
        </div>
      </div>
    </section>
    
    <!-- Interactive 16x16 Table Layout -->
    <section class="table-scroll-container">
      <table class="matrix-table" id="mbti-matrix-table">
        <thead>
          <tr id="table-header-row">
            <th>MBTI</th>
            <!-- Horizontal MBTI Type list will be generated by script -->
          </tr>
        </thead>
        <tbody id="table-body">
          <!-- Table Rows will be generated by script -->
        </tbody>
      </table>
    </section>
    
    <!-- Final CTA Card -->
    <section class="final-cta">
      <h3 class="final-title" id="final-cta-status">우주가 속삭이는 당신의 짝, 6월 1일에 찾아갑니다</h3>
      <p class="final-desc">
        나의 MBTI와 사주 오행의 흐름이 만나 엮어내는 특별한 시너지!<br>
        서로의 차이를 이해하고 완벽한 오행 조화 속에서 나만의 단 한 사람을 발견해 보세요.
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
        <a href="/matching-info" class="secondary-link">
          <span>알고리즘 연산 보기</span>
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
    // 1. Data Matrix Definition (100% matched with match-service.js)
    const MBTI_TYPES = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
    
    const MATRIX = {
      ISTJ: { ISTJ: 3, ISFJ: 4, INFJ: 2, INTJ: 3, ISTP: 3, ISFP: 3, INFP: 1, INTP: 3, ESTP: 3, ESFP: 3, ENFP: 1, ENTP: 3, ESTJ: 5, ESFJ: 4, ENFJ: 2, ENTJ: 4 },
      ISFJ: { ISTJ: 4, ISFJ: 3, INFJ: 3, INTJ: 2, ISTP: 3, ISFP: 3, INFP: 3, INTP: 1, ESTP: 3, ESFP: 3, ENFP: 3, ENTP: 1, ESTJ: 4, ESFJ: 5, ENFJ: 4, ENTJ: 2 },
      INFJ: { ISTJ: 2, ISFJ: 3, INFJ: 3, INTJ: 4, ISTP: 1, ISFP: 3, INFP: 3, INTP: 3, ESTP: 1, ESFP: 3, ENFP: 4, ENTP: 5, ESTJ: 2, ESFJ: 4, ENFJ: 5, ENTJ: 4 },
      INTJ: { ISTJ: 3, ISFJ: 2, INFJ: 4, INTJ: 3, ISTP: 3, ISFP: 1, INFP: 3, INTP: 3, ESTP: 3, ESFP: 1, ENFP: 5, ENTP: 4, ESTJ: 4, ESFJ: 2, ENFJ: 4, ENTJ: 5 },
      ISTP: { ISTJ: 3, ISFJ: 3, INFJ: 1, INTJ: 3, ISTP: 3, ISFP: 4, INFP: 2, INTP: 3, ESTP: 5, ESFP: 4, ENFP: 2, ENTP: 4, ESTJ: 3, ESFJ: 3, ENFJ: 1, ENTJ: 3 },
      ISFP: { ISTJ: 3, ISFJ: 3, INFJ: 3, INTJ: 1, ISTP: 4, ISFP: 3, INFP: 3, INTP: 2, ESTP: 4, ESFP: 5, ENFP: 4, ENTP: 2, ESTJ: 3, ESFJ: 3, ENFJ: 3, ENTJ: 1 },
      INFP: { ISTJ: 1, ISFJ: 3, INFJ: 3, INTJ: 3, ISTP: 2, ISFP: 3, INFP: 3, INTP: 4, ESTP: 2, ESFP: 4, ENFP: 5, ENTP: 4, ESTJ: 1, ESFJ: 3, ENFJ: 4, ENTJ: 4 },
      INTP: { ISTJ: 3, ISFJ: 1, INFJ: 3, INTJ: 3, ISTP: 3, ISFP: 2, INFP: 4, INTP: 3, ESTP: 4, ESFP: 2, ENFP: 4, ENTP: 5, ESTJ: 3, ESFJ: 1, ENFJ: 3, ENTJ: 4 },
      ESTP: { ISTJ: 3, ISFJ: 3, INFJ: 1, INTJ: 3, ISTP: 5, ISFP: 4, INFP: 2, INTP: 4, ESTP: 3, ESFP: 4, ENFP: 2, ENTP: 3, ESTJ: 3, ESFJ: 3, ENFJ: 1, ENTJ: 3 },
      ESFP: { ISTJ: 3, ISFJ: 3, INFJ: 3, INTJ: 1, ISTP: 4, ISFP: 5, INFP: 4, INTP: 2, ESTP: 4, ESFP: 3, ENFP: 3, ENTP: 2, ESTJ: 3, ESFJ: 3, ENFJ: 3, ENTJ: 1 },
      ENFP: { ISTJ: 1, ISFJ: 3, INFJ: 4, INTJ: 5, ISTP: 2, ISFP: 4, INFP: 5, INTP: 4, ESTP: 2, ESFP: 3, ENFP: 3, ENTP: 4, ESTJ: 1, ESFJ: 3, ENFJ: 4, ENTJ: 4 },
      ENTP: { ISTJ: 3, ISFJ: 1, INFJ: 5, INTJ: 4, ISTP: 4, ISFP: 2, INFP: 4, INTP: 5, ESTP: 3, ESFP: 2, ENFP: 4, ENTP: 3, ESTJ: 3, ESFJ: 1, ENFJ: 3, ENTJ: 4 },
      ESTJ: { ISTJ: 5, ISFJ: 4, INFJ: 2, INTJ: 4, ISTP: 3, ISFP: 3, INFP: 1, INTP: 3, ESTP: 3, ESFP: 3, ENFP: 1, ENTP: 3, ESTJ: 3, ESFJ: 4, ENFJ: 2, ENTJ: 3 },
      ESFJ: { ISTJ: 4, ISFJ: 5, INFJ: 4, INTJ: 2, ISTP: 3, ISFP: 3, INFP: 3, INTP: 1, ESTP: 3, ESFP: 3, ENFP: 3, ENTP: 1, ESTJ: 4, ESFJ: 3, ENFJ: 3, ENTJ: 2 },
      ENFJ: { ISTJ: 2, ISFJ: 4, INFJ: 5, INTJ: 4, ISTP: 1, ISFP: 3, INFP: 4, INTP: 3, ESTP: 1, ESFP: 3, ENFP: 4, ENTP: 3, ESTJ: 2, ESFJ: 3, ENFJ: 3, ENTJ: 4 },
      ENTJ: { ISTJ: 4, ISFJ: 2, INFJ: 4, INTJ: 5, ISTP: 3, ISFP: 1, INFP: 4, INTP: 4, ESTP: 3, ESFP: 1, ENFP: 4, ENTP: 4, ESTJ: 3, ESFJ: 2, ENFJ: 4, ENTJ: 3 }
    };
    
    const LEVEL_MAP = {
      5: { name: "🔵 천생연분", bg: "var(--cyan)", score: 100, desc: "환상적인 소통과 보완성이 조화롭게 어우러진 천생연분 관계입니다. 대화 주제가 풍부하고 에너지가 서로를 생하는 최상의 흐름을 가집니다!" },
      4: { name: "🟢 아주 좋음", bg: "#2ecc71", score: 90, desc: "가치관이 비슷하거나 서로 공감하기 아주 쉬워 빠르게 깊어지는 호감을 느끼는 훌륭한 파트너입니다." },
      3: { name: "🟡 보통/무난", bg: "var(--purple)", score: 80, desc: "큰 충돌 없이 자연스럽게 대화하며 지낼 수 있는 원만한 관계입니다. 평화로운 소통이 이뤄집니다." },
      2: { name: "🟠 노력 필요", bg: "var(--orange)", score: 70, desc: "소통 및 정보 인지 방식에 차이가 있어 갈등을 해소하기 위해 상호 배려와 꾸준한 타협이 필요한 관계입니다." },
      1: { name: "🔴 최악/상극", bg: "var(--pink)", score: 60, desc: "성향과 의사결정 속도, 세계관의 차이가 매우 큽니다. 다름을 존중하는 고도의 인내심과 조율이 있어야 상생이 가능한 주의 유형입니다." }
    };
    
    // 2. Generate Interactive Table DOM Elements
    const headerRow = document.getElementById("table-header-row");
    const tableBody = document.getElementById("table-body");
    const previewTypes = document.getElementById("preview-types-label");
    const previewBadge = document.getElementById("preview-badge");
    const previewDesc = document.getElementById("preview-desc");
    const previewScoreVal = document.getElementById("preview-score-val");
    
    // Create Header Cells
    MBTI_TYPES.forEach((type, colIndex) => {
      const th = document.createElement("th");
      th.textContent = type;
      th.setAttribute("data-col", colIndex);
      headerRow.appendChild(th);
    });
    
    // Create Rows & Cells
    MBTI_TYPES.forEach((rowType, rowIndex) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-row-idx", rowIndex);
      
      // Row Header
      const rHeader = document.createElement("th");
      rHeader.textContent = rowType;
      tr.appendChild(rHeader);
      
      // Column Cells
      MBTI_TYPES.forEach((colType, colIndex) => {
        const td = document.createElement("td");
        const level = MATRIX[rowType][colType];
        const config = LEVEL_MAP[level];
        
        td.textContent = config.score;
        td.className = 'cell-level-' + level;
        td.setAttribute("data-row", rowType);
        td.setAttribute("data-col-type", colType);
        td.setAttribute("data-col-idx", colIndex);
        td.setAttribute("data-level", level);
        
        // Interactive Mouse Over Details Event
        td.addEventListener("mouseenter", () => {
          // Highlight Crosshairs
          tr.classList.add("row-active");
          const headers = headerRow.querySelectorAll("th");
          if (headers[colIndex + 1]) headers[colIndex + 1].classList.add("col-active");
          
          // Update Preview Card
          previewTypes.innerHTML = '<span>' + rowType + '</span> <span class="preview-arrow">↔</span> <span>' + colType + '</span>';
          previewBadge.textContent = config.name;
          previewBadge.style.background = config.bg;
          previewBadge.style.color = level === 5 ? "#030712" : "#fff";
          previewDesc.innerHTML = '<strong>' + rowType + '</strong>님과 <strong>' + colType + '</strong>님은 표준 차트 기준 ' + config.name + ' 등급에 도출됩니다. ' + config.desc;
          previewScoreVal.textContent = config.score;
          previewScoreVal.style.color = config.bg;
          previewScoreVal.style.textShadow = '0 0 10px ' + config.bg;
        });
        
        // Remove Highlights Event
        td.addEventListener("mouseleave", () => {
          tr.classList.remove("row-active");
          const headers = headerRow.querySelectorAll("th");
          if (headers[colIndex + 1]) headers[colIndex + 1].classList.remove("col-active");
        });
        
        // Mobile Tap & Click Popup Support
        td.addEventListener("click", () => {
          // Update Preview Card
          previewTypes.innerHTML = '<span>' + rowType + '</span> <span class="preview-arrow">↔</span> <span>' + colType + '</span>';
          previewBadge.textContent = config.name;
          previewBadge.style.background = config.bg;
          previewBadge.style.color = level === 5 ? "#030712" : "#fff";
          previewDesc.innerHTML = '<strong>' + rowType + '</strong>님과 <strong>' + colType + '</strong>님은 표준 차트 기준 ' + config.name + ' 등급에 도출됩니다. ' + config.desc;
          previewScoreVal.textContent = config.score;
          previewScoreVal.style.color = config.bg;
          previewScoreVal.style.textShadow = '0 0 10px ' + config.bg;
          
          // Update Modal Elements
          const modalTypes = document.getElementById("modal-types-label");
          const modalBadge = document.getElementById("modal-badge");
          const modalDesc = document.getElementById("modal-desc");
          const modalScoreVal = document.getElementById("modal-score-val");
          
          modalTypes.innerHTML = '<span>' + rowType + '</span> <span class="modal-arrow">↔</span> <span>' + colType + '</span>';
          modalBadge.textContent = config.name;
          modalBadge.style.background = config.bg;
          modalBadge.style.color = level === 5 ? "#030712" : "#fff";
          modalDesc.innerHTML = '<strong>' + rowType + '</strong>님과 <strong>' + colType + '</strong>님은 표준 차트 기준 ' + config.name + ' 등급에 도출됩니다. ' + config.desc;
          modalScoreVal.textContent = config.score;
          modalScoreVal.style.color = config.bg;
          modalScoreVal.style.textShadow = '0 0 12px ' + config.bg;
          
          // Open Modal
          const modalEl = document.getElementById("mbti-modal");
          modalEl.classList.add("active");
          modalEl.setAttribute("aria-hidden", "false");
        });
        
        tr.appendChild(td);
      });
      
      tableBody.appendChild(tr);
    });
    
    // 3. Countdown Event Lock Sync (Matches promo-page.js)
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
    
    // 4. Close Modal Logic
    const modalEl = document.getElementById("mbti-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    const closeActionBtn = document.getElementById("modal-close-action-btn");
    
    function closeModal() {
      modalEl.classList.remove("active");
      modalEl.setAttribute("aria-hidden", "true");
    }
    
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (closeActionBtn) closeActionBtn.addEventListener("click", closeModal);
    
    // Close on overlay click
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) {
        closeModal();
      }
    });
    
    // Close on ESC keypress
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl.classList.contains("active")) {
        closeModal();
      }
    });
    (function() { var btn=document.getElementById("dd-notice-btn"),menu=document.getElementById("dd-notice-menu"); if(!btn||!menu)return; btn.addEventListener("click",function(e){e.stopPropagation();var o=menu.classList.toggle("open");btn.classList.toggle("open",o);btn.setAttribute("aria-expanded",o);}); document.addEventListener("click",function(){menu.classList.remove("open");btn.classList.remove("open");btn.setAttribute("aria-expanded",false);}); })();
  </script>
</body>
</html>`;
}

module.exports = { mbtiMatrixPage };
