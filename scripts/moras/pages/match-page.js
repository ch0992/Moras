/**
 * Match results and voting page for participants.
 * Premium Web Design with Rich Aesthetics (Midnight Celestial theme, Constellation 6-digit input, Aura Merger view).
 */

function matchPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras - 당신의 운명적인 인연</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #020306;
      --bg-gradient: radial-gradient(circle at 50% 30%, #111A35 0%, #060913 60%, #020306 100%);
      --panel: rgba(10, 15, 30, 0.72);
      --line: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --muted: #94A3B8;
      --gold: #FFE8A3;
      --gold-dark: #C59B3F;
      --gold-gradient: linear-gradient(135deg, #FFE8A3 0%, #C59B3F 50%, #FFE8A3 100%);
      --gold-glow: rgba(197, 155, 63, 0.4);
      --male-glow: rgba(0, 242, 254, 0.45);
      --female-glow: rgba(245, 87, 108, 0.45);
      
      /* 오행 컬러 스키마 - 포스터와 100% 매칭 */
      --wood: #2ecc71;
      --fire: #f5576c;
      --earth: #ffeaa7;
      --metal: #a29bfe;
      --water: #3498db;
      
      --font-outfit: 'Outfit', 'Noto Sans KR', sans-serif;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg-gradient);
      color: var(--text);
      font-family: var(--font-outfit);
      line-height: 1.6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 112px 20px 32px;
      overflow-x: hidden;
      position: relative;
    }
    .global-home-logo {
      position: absolute;
      top: 28px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 30;
      font-family: 'Cinzel', serif;
      font-size: clamp(34px, 5vw, 58px);
      font-weight: 800;
      letter-spacing: 0.16em;
      line-height: 1;
      text-decoration: none;
      background: var(--gold-gradient, linear-gradient(135deg, #FFE8A3 0%, #C59B3F 50%, #FFE8A3 100%));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 25px rgba(197, 155, 63, 0.5), 0 4px 8px rgba(0, 0, 0, 0.9);
      filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.48));
    }

    /* 포스터 별무리 오라 및 우주 기운 재현 */
    body::before {
      content: '';
      position: fixed;
      top: -15%; left: -15%;
      width: 60vw; height: 60vw;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%);
      z-index: -1;
      pointer-events: none;
      animation: auraPulse 10s ease-in-out infinite alternate;
    }
    body::after {
      content: '';
      position: fixed;
      bottom: -15%; right: -15%;
      width: 60vw; height: 60vw;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.08) 0%, transparent 70%);
      z-index: -1;
      pointer-events: none;
      animation: auraPulse 10s ease-in-out infinite alternate-reverse;
    }
    
    @keyframes auraPulse {
      0% { transform: scale(1) translate(0, 0); opacity: 0.6; }
      100% { transform: scale(1.15) translate(3%, 3%); opacity: 0.95; }
    }

    /* 잔잔한 우주 먼지 효과 */
    .space-dust {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: 
        radial-gradient(1px 1px at 30px 40px, #fff, rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 140px 180px, rgba(255,255,255,0.85), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 380px 290px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 580px 140px, rgba(212, 175, 55, 0.7), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 850px 420px, #fff, rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 1100px 220px, rgba(255,255,255,0.6), rgba(0,0,0,0));
      background-size: 1300px 850px;
      opacity: 0.35;
      z-index: -2;
      pointer-events: none;
      animation: starMove 150s linear infinite;
    }
    @keyframes starMove {
      from { background-position: 0 0; }
      to { background-position: 1300px 850px; }
    }

    /* Container (Celestial Glassmorphism) */
    .container {
      width: 100%;
      max-width: 720px;
      backdrop-filter: blur(20px) saturate(120%);
      -webkit-backdrop-filter: blur(20px) saturate(120%);
      background: var(--panel);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 24px;
      padding: 40px 32px;
      box-shadow: 0 35px 80px rgba(0, 0, 0, 0.65), 
                  inset 0 1px 1px rgba(255, 255, 255, 0.08),
                  0 0 25px rgba(212, 175, 55, 0.05);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    h1, h2, h3 {
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.02em;
    }

    /* 로고 메탈릭 골드 엠보싱 효과 */
    .logo-cinzel {
      font-family: 'Cinzel', serif;
      font-weight: 800;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 12px rgba(197, 155, 63, 0.4), 
                   0 2px 4px rgba(0, 0, 0, 0.9);
      letter-spacing: 0.05em;
    }

    .title-gradient {
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Passcode Form View */
    #auth-view {
      text-align: center;
    }

    #auth-view p {
      color: var(--muted);
      font-size: 14.5px;
      line-height: 1.6;
      margin: 12px auto 28px;
      max-width: 480px;
    }

    /* 별자리 은하선 인터랙션 */
    .constellation-container {
      margin: 15px auto 25px;
      width: 320px;
      height: 85px;
      position: relative;
    }
    .constellation-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .constellation-active-line {
      transition: stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .star-node {
      fill: rgba(255, 255, 255, 0.15);
      stroke: rgba(255, 255, 255, 0.08);
      stroke-width: 2;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .star-node.active {
      fill: #FFE8A3;
      stroke: #C59B3F;
      stroke-width: 3;
      r: 6.5;
      filter: url(#starGlow);
      animation: starTwinkle 1.5s infinite alternate;
    }
    @keyframes starTwinkle {
      0% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(255, 232, 163, 0.6)); }
      100% { transform: scale(1.15); filter: drop-shadow(0 0 12px rgba(255, 232, 163, 1)); }
    }
    .constellation-container.completed {
      animation: pulseConstellation 1.2s ease-out;
    }
    @keyframes pulseConstellation {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); filter: brightness(1.3); }
      100% { transform: scale(1); opacity: 1; }
    }

    .passcode-inputs {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .passcode-digit {
      width: 54px;
      height: 64px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: rgba(10, 14, 26, 0.65);
      color: var(--gold);
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      font-family: var(--font-outfit);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .passcode-digit:focus {
      outline: none;
      border-color: #C59B3F;
      box-shadow: 0 0 12px rgba(197, 155, 63, 0.45);
      background: rgba(10, 14, 26, 0.9);
    }

    .btn {
      width: 100%;
      height: 50px;
      border: none;
      border-radius: 12px;
      background: var(--gold-gradient);
      color: #020306;
      font-weight: 900;
      font-size: 16px;
      letter-spacing: 0.08em;
      cursor: pointer;
      box-shadow: 0 8px 22px rgba(197, 155, 63, 0.25);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(197, 155, 63, 0.4);
      filter: brightness(1.08);
    }

    .btn:active {
      transform: translateY(1px);
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-msg {
      margin-top: 16px;
      color: #f5576c;
      font-size: 13.5px;
      font-weight: 600;
      min-height: 20px;
    }

    /* Result Detailed View */
    #result-view {
      display: none;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .result-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .badge-rank {
      display: inline-flex;
      align-items: center;
      background: rgba(197, 155, 63, 0.12);
      border: 1px solid var(--gold-dark);
      color: var(--gold);
      border-radius: 99px;
      padding: 5px 16px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 14px;
    }

    .badge-rank.top {
      background: linear-gradient(135deg, rgba(197, 155, 63, 0.22) 0%, rgba(197, 155, 63, 0.08) 100%);
      border-color: var(--gold);
      box-shadow: 0 0 15px rgba(197, 155, 63, 0.3);
      animation: badgePulse 2s infinite alternate;
    }
    
    @keyframes badgePulse {
      0% { transform: scale(1); box-shadow: 0 0 8px rgba(197, 155, 63, 0.2); }
      100% { transform: scale(1.03); box-shadow: 0 0 20px rgba(197, 155, 63, 0.55); }
    }

    /* 두 연분의 오라 융합 matchup-container 가로형 3열 구성 */
    .matchup-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin: 32px 0;
      position: relative;
    }

    .profile-card {
      flex: 1;
      background: rgba(10, 15, 30, 0.65);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 24px 16px;
      text-align: center;
      position: relative;
      overflow: hidden;
      z-index: 1;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }
    
    /* 포스터 연동형 남성(청록)/여성(보라) 넘실거리는 빛무리 아우라 효과 */
    .profile-card.male {
      border-color: rgba(0, 242, 254, 0.3);
    }
    .profile-card.male::before {
      content: '';
      position: absolute;
      width: 160px; height: 160px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.14) 0%, transparent 70%);
      top: -40px; left: -40px;
      z-index: -1;
    }
    
    .profile-card.female {
      border-color: rgba(245, 87, 108, 0.3);
    }
    .profile-card.female::before {
      content: '';
      position: absolute;
      width: 160px; height: 160px;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.14) 0%, transparent 70%);
      top: -40px; right: -40px;
      z-index: -1;
    }

    .profile-name {
      font-size: 20px;
      font-weight: 800;
      color: #fff;
    }

    .profile-gender-mbti {
      font-size: 13px;
      margin-top: 4px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .profile-card.male .profile-gender-mbti { color: #00F2FE; text-shadow: 0 0 8px rgba(0, 242, 254, 0.3); }
    .profile-card.female .profile-gender-mbti { color: #F5576C; text-shadow: 0 0 8px rgba(245, 87, 108, 0.3); }

    /* 미니 만세력 차트 디자인 */
    .mini-manse-chart {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
      margin-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 12px;
    }
    .mini-manse-col {
      display: flex;
      flex-direction: column;
      gap: 4px;
      border: 1px solid rgba(255,255,255,0.03);
      border-radius: 8px;
      padding: 4px;
      background: rgba(0,0,0,0.15);
      position: relative;
    }
    .mini-manse-col.day-highlight {
      border: 1px solid rgba(254, 232, 163, 0.6) !important;
      box-shadow: 0 0 10px rgba(254, 232, 163, 0.25);
    }
    .mini-manse-col.day-highlight::after {
      content: '日';
      position: absolute;
      top: -6px;
      right: -6px;
      background: #FFE8A3;
      color: #020306;
      font-size: 8px;
      font-weight: 900;
      width: 11px;
      height: 11px;
      display: grid;
      place-items: center;
      border-radius: 50%;
    }
    .mini-manse-label {
      font-size: 9.5px;
      color: var(--muted);
      font-weight: 700;
      text-align: center;
      margin-bottom: 2px;
    }
    .mini-manse-slot {
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 800;
      color: #fff;
      position: relative;
      overflow: hidden;
    }
    .mini-manse-slot.unknown {
      background: rgba(255,255,255,0.02);
      color: var(--muted);
      font-size: 11px;
    }
    .mini-manse-text {
      z-index: 1;
      font-family: 'Cinzel', 'Noto Sans KR', sans-serif;
    }
    
    /* 5대 오행별 스타일 */
    .mini-manse-slot.elem-wood { 
      color: var(--wood); 
      background: rgba(46, 204, 113, 0.08); 
      text-shadow: 0 0 8px rgba(46, 204, 113, 0.5);
    }
    .mini-manse-slot.elem-fire { 
      color: var(--fire); 
      background: rgba(245, 87, 108, 0.08); 
      text-shadow: 0 0 8px rgba(245, 87, 108, 0.5);
    }
    .mini-manse-slot.elem-earth { 
      color: var(--earth); 
      background: rgba(255, 234, 167, 0.08); 
      text-shadow: 0 0 8px rgba(255, 234, 167, 0.5);
    }
    .mini-manse-slot.elem-metal { 
      color: var(--metal); 
      background: rgba(162, 155, 254, 0.08); 
      text-shadow: 0 0 8px rgba(162, 155, 254, 0.5);
    }
    .mini-manse-slot.elem-water { 
      color: var(--water); 
      background: rgba(52, 152, 219, 0.08); 
      text-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
    }
    
    .mini-elem-svg {
      position: absolute;
      width: 22px;
      height: 22px;
      opacity: 0.12;
      pointer-events: none;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 0;
      color: currentColor;
    }

    /* 중앙 vs-separator에 태양 서큘러 게이지를 품는 아우라 배치 */
    .vs-separator {
      flex-shrink: 0;
      position: relative;
      width: 160px;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }

    /* Celestial Sun Ring - 회전하는 황금빛 아우라 궤도 링 */
    .vs-separator::before {
      content: '';
      position: absolute;
      top: -4px; left: -4px; right: -4px; bottom: -4px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(254, 232, 163, 0) 40%, rgba(254, 232, 163, 0.45) 50%, rgba(197, 155, 63, 0) 60%);
      animation: spinRing 4.5s linear infinite;
      pointer-events: none;
      z-index: 0;
    }
    @keyframes spinRing {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Score Ring (Circular Progress) */
    .score-circle-container {
      position: relative;
      width: 146px;
      height: 146px;
      z-index: 1;
    }

    .score-circle-svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }

    .score-circle-bg {
      fill: rgba(10, 15, 30, 0.75);
      stroke: rgba(255, 255, 255, 0.05);
      stroke-width: 9;
    }

    .score-circle-bar {
      fill: none;
      stroke: url(#goldGradient);
      stroke-width: 9;
      stroke-linecap: round;
      stroke-dasharray: 414.69;
      stroke-dashoffset: 414.69; /* Dynamic values via script, radius 66, circ = 414.69 */
      transition: stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1);
      filter: drop-shadow(0 0 6px rgba(197, 155, 63, 0.5));
    }

    .score-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: var(--font-outfit);
      font-size: 38px;
      font-weight: 900;
      color: #fff;
      z-index: 2;
      text-align: center;
      line-height: 1;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .score-text span {
      font-size: 16px;
      font-weight: 500;
      color: var(--muted);
      margin-left: 1px;
    }
    
    .score-label {
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--gold);
      margin-top: 2px;
      font-weight: 800;
      display: block;
      text-shadow: 0 0 8px rgba(254, 232, 163, 0.4);
    }

    /* Keywords */
    .keywords-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin-bottom: 28px;
    }

    .keyword-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 99px;
      padding: 5px 14px;
      font-size: 12.5px;
      color: #F8FAFC;
      font-weight: 600;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      transition: all 0.2s;
    }
    .keyword-pill:hover {
      border-color: rgba(254, 232, 163, 0.4);
      background: rgba(254, 232, 163, 0.05);
    }

    /* Compatibility details text cards */
    .eval-card {
      background: rgba(10, 15, 30, 0.45);
      border: 1px solid rgba(212, 175, 55, 0.18);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 32px;
      position: relative;
      box-shadow: inset 0 0 15px rgba(212, 175, 55, 0.02);
    }

    .eval-card::before {
      content: '"';
      position: absolute;
      top: 6px;
      left: 16px;
      font-family: var(--font-outfit);
      font-size: 64px;
      color: rgba(254, 232, 163, 0.06);
      line-height: 1;
      font-weight: 900;
    }

    .eval-title {
      font-size: 15px;
      font-weight: 800;
      color: var(--gold);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .eval-body {
      font-size: 14.5px;
      line-height: 1.75;
      color: #cbd5e1;
    }
    .eval-body p {
      margin: 0;
    }

    /* Vote UI */
    .profile-vote-area { margin-top: 12px; text-align: center; }
    .vote-form { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .vote-select {
      appearance: none; background: rgba(10,15,30,0.8);
      border: 1.5px solid rgba(255,232,163,0.4); border-radius: 10px;
      color: #FFE8A3; font-size: 14px; font-weight: 700;
      padding: 8px 14px; cursor: pointer; font-family: inherit; min-width: 140px;
      text-align: center; text-align-last: center;
    }
    .vote-select:focus { outline: none; border-color: #FFE8A3; }
    .btn-vote-submit {
      background: var(--gold-gradient); color: #0a0a0a; border: none;
      border-radius: 10px; padding: 8px 22px; font-size: 13px; font-weight: 800;
      cursor: pointer; transition: opacity 0.15s; font-family: inherit;
    }
    .btn-vote-submit:hover { opacity: 0.85; }
    .btn-vote-submit:disabled { opacity: 0.4; }
    .vote-status {
      font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; margin-top: 8px; display: inline-block;
    }
    .vote-status.my-done { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .vote-status.waiting { background: rgba(255,255,255,0.06); color: var(--muted); }
    .vote-status.partner-done { background: rgba(255,232,163,0.12); color: var(--gold); }
    .vote-status.expired { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
    .vote-prompt { font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 2px; }
    .vote-warning { font-size: 11px; color: #f87171; margin-top: 2px; }
    .vote-selection-text { font-size: 13px; font-weight: 700; min-height: 36px; line-height: 1.6; text-align: center; transition: color 0.2s; }
    .vote-selection-text.yes { color: #4ade80; }
    .vote-selection-text.no { color: #f87171; }
        .vote-panel {
      border-top: 1px solid var(--line);
      padding-top: 32px;
      text-align: center;
    }

    .vote-panel h3 {
      font-size: 20px;
      margin-bottom: 8px;
      color: #fff;
      letter-spacing: -0.01em;
    }

    .vote-panel p {
      font-size: 13.5px;
      color: var(--muted);
      margin: 0 auto 24px;
      max-width: 500px;
      line-height: 1.6;
    }

    .vote-buttons {
      display: flex;
      gap: 16px;
      max-width: 520px;
      margin: 0 auto;
    }

    /* 3D Glass 버튼 디자인 */
    .btn-vote {
      flex: 1;
      height: 52px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.03);
      color: #fff;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
    }
    
    /* 찬성 3D 에메랄드 우주 펄 글래스 */
    .btn-vote.yes {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.08) 100%);
      border: 1.5px solid rgba(16, 185, 129, 0.5);
      color: #34d399;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.15), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.15);
      text-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    }
    .btn-vote.yes:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.22) 100%);
      border-color: #10b981;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    /* 거절 로즈골드 메탈릭 3D Glass */
    .btn-vote.no {
      background: linear-gradient(135deg, rgba(226, 167, 141, 0.13) 0%, rgba(154, 90, 68, 0.04) 100%);
      border: 1.5px solid rgba(226, 167, 141, 0.32);
      color: #e2a78d;
      box-shadow: 0 6px 20px rgba(226, 167, 141, 0.05),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08);
      text-shadow: 0 0 8px rgba(226, 167, 141, 0.4);
    }
    .btn-vote.no:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(226, 167, 141, 0.22) 0%, rgba(154, 90, 68, 0.12) 100%);
      border-color: #e2a78d;
      box-shadow: 0 10px 25px rgba(226, 167, 141, 0.2), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
      color: #fff;
    }
    
    .btn-vote:active:not(:disabled) {
      transform: translateY(1px);
    }
    .btn-vote:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .vote-success-anim {
      display: none;
      animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      text-align: center;
      padding: 15px 0;
    }

    .vote-success-icon {
      font-size: 44px;
      color: var(--gold);
      margin-bottom: 12px;
      filter: drop-shadow(0 0 10px var(--gold-glow));
    }

    /* Keyframes */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleUp {
      from { transform: scale(0.85); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 680px) {
      .container {
        padding: 32px 20px;
      }
      .matchup-container {
        flex-direction: column;
        gap: 16px;
      }
      .vs-separator {
        margin: 10px 0;
      }
      .profile-card {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <a class="global-home-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
  <div class="space-dust"></div>
  <div class="container">
    <!-- SVG Gradients Definition -->
    <svg style="position: absolute; width: 0; height: 0;" width="0" height="0">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE8A3" />
          <stop offset="50%" stop-color="#C59B3F" />
          <stop offset="100%" stop-color="#FFE8A3" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Name Search Form View -->
    <div id="auth-view">
      <h2 style="font-size: 28px; color: #fff;"><span class="logo-cinzel">나의 인연 확인하기</span></h2>
      <p style="color:var(--muted);font-size:14px;margin-bottom:28px;">참가자 명단에 등록된 이름을 입력하여 매칭 결과를 확인하세요.</p>
      <div style="display:flex;gap:10px;width:100%;max-width:340px;">
        <input id="name-input" type="text" placeholder="이름 입력" maxlength="30" autocomplete="off"
          style="flex:1;height:52px;background:rgba(10,15,30,0.72);border:1.5px solid rgba(255,255,255,0.12);border-radius:12px;color:#F8FAFC;font-size:16px;font-weight:600;padding:0 16px;font-family:inherit;outline:none;transition:border-color 0.2s;"
          onfocus="this.style.borderColor='rgba(255,232,163,0.6)'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'">
        <button id="btn-submit-code" class="btn" style="white-space:nowrap;padding:0 22px;height:52px;border-radius:12px;">조회</button>
      </div>
      <div id="auth-error" class="error-msg" style="margin-top:12px;"></div>
    </div>

    <!-- Match detailed Result View -->
    <div id="result-view">
      <div class="result-header">
        <div id="rank-badge" class="badge-rank">MATCH RANK</div>
        <h2 style="font-size: 28px; color: #fff;"><span class="logo-cinzel">두 사람의 인연</span></h2>
      </div>

      <div class="keywords-box" id="keywords-container">
        <!-- Render Keywords -->
      </div>

      <!-- 좌청록(남) - 우보라(여) - 중앙 궁합 게이지 융합 구도 -->
      <div class="matchup-container">
        <!-- Male Participant Profile -->
        <div class="profile-card male" id="profile-male">
          <div class="profile-name" id="male-name">남자</div>
          <div class="profile-gender-mbti" id="male-mbti">남성 · MBTI</div>
          <div class="saju-brief" id="male-saju">사주 정보</div>
          <div id="male-vote-area" class="profile-vote-area"></div>
        </div>

        <!-- 중앙 궁합 서큘러 게이지 바 (Celestial Sun Ring) -->
        <div class="vs-separator">
          <div class="score-circle-container">
            <svg class="score-circle-svg" viewBox="0 0 150 150">
              <circle class="score-circle-bg" cx="75" cy="75" r="66"></circle>
              <circle id="score-bar" class="score-circle-bar" cx="75" cy="75" r="66"></circle>
            </svg>
            <div class="score-text">
              <span id="score-num">0</span><span>점</span>
              <span class="score-label">Synergy</span>
            </div>
          </div>
        </div>

        <!-- Female Participant Profile -->
        <div class="profile-card female" id="profile-female">
          <div class="profile-name" id="female-name">여자</div>
          <div class="profile-gender-mbti" id="female-mbti">여성 · MBTI</div>
          <div class="saju-brief" id="female-saju">사주 정보</div>
          <div id="female-vote-area" class="profile-vote-area"></div>
        </div>
      </div>

      <!-- Compatibility Reason Text Card -->
      <div class="eval-card">
        <div class="eval-title">
          <span>✨ Gemini 사주 & MBTI 종합 오솔길 분석</span>
        </div>
        <div class="eval-body" id="match-analysis-reason">
          상대방과 나의 오행과 MBTI 시너지가 밝은 빛을 내고 있습니다.
        </div>
      </div>

      <!-- Deadline Notice -->
      <div id="deadline-notice" style="display:none;margin-top:16px;padding:10px 18px;border-radius:10px;background:rgba(255,232,163,0.08);border:1px solid rgba(255,232,163,0.2);font-size:13px;color:var(--gold);text-align:center;"></div>
    </div>
  </div>

  <script>
    let currentMatchData = null;

    const nameInput = document.getElementById('name-input');
    const submitBtn = document.getElementById('btn-submit-code');
    const authError = document.getElementById('auth-error');

    nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitBtn.click(); });

    submitBtn.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      if (!name) { authError.textContent = '이름을 입력해주세요.'; return; }
      authError.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = '조회 중...';
      try {
        const res = await fetch('/api/match/detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (!res.ok) {
          const baseMessage = data.error || '조회에 실패했습니다.';
          authError.textContent = baseMessage + ' 오타일 수 있으니 결과창에 표시된 이름을 복사해서 붙여넣어주세요.';
          submitBtn.disabled = false;
          submitBtn.textContent = '조회';
          return;
        }
        renderMatchResult(data);
      } catch {
        authError.textContent = '서버 통신 오류가 발생했습니다.';
        submitBtn.disabled = false;
        submitBtn.textContent = '조회';
      }
    });

    function createMiniManseHtml(manse) {
      if (!manse || !manse.pillars) {
        return '<div class="saju-missing" style="color:var(--muted);font-size:12.5px;margin-top:10px;font-weight:500;">사주 정보 비공개</div>';
      }
      var order = ["hour", "day", "month", "year"];
      var labels = { hour: "시", day: "일", month: "월", year: "년" };
      var pillars = manse.pillars;
      var getElementClass = function(el) {
        if (!el) return "";
        if (el.indexOf("木") >= 0 || el.indexOf("목") >= 0) return "elem-wood";
        if (el.indexOf("火") >= 0 || el.indexOf("화") >= 0) return "elem-fire";
        if (el.indexOf("土") >= 0 || el.indexOf("토") >= 0) return "elem-earth";
        if (el.indexOf("金") >= 0 || el.indexOf("금") >= 0) return "elem-metal";
        if (el.indexOf("水") >= 0 || el.indexOf("수") >= 0) return "elem-water";
        return "";
      };
      var getElementSvg = function(el) {
        if (!el) return "";
        if (el.indexOf("木") >= 0 || el.indexOf("목") >= 0) return '<svg class="mini-elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C11.5 2 10 5 10 8C10 11 11.5 12 12 12C12.5 12 14 11 14 8C14 5 12.5 2 12 2Z M12 12C9 12 7 14 7 17C7 20 12 22 12 22C12 22 17 20 17 17C17 14 15 12 12 12Z"/></svg>';
        if (el.indexOf("火") >= 0 || el.indexOf("화") >= 0) return '<svg class="mini-elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C12 2 17 7 17 11C17 15.5 13.5 18 12 22C10.5 18 7 15.5 7 11C7 7 12 2 12 2Z M12 8C12 8 14.5 11 14.5 13C14.5 15 13 16 12 18C11 16 9.5 15 9.5 13C9.5 11 12 8 12 8Z"/></svg>';
        if (el.indexOf("土") >= 0 || el.indexOf("토") >= 0) return '<svg class="mini-elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 18H22L12 2Z M12 6L18.5 16H5.5L12 6Z M12 10L15 15H9L12 10Z"/></svg>';
        if (el.indexOf("金") >= 0 || el.indexOf("금") >= 0) return '<svg class="mini-elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L4 12L12 22L20 12L12 2Z M12 6L17 12L12 18L7 12L12 6Z"/></svg>';
        if (el.indexOf("水") >= 0 || el.indexOf("수") >= 0) return '<svg class="mini-elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12C2 12 5 9 8 12C11 15 13 15 16 12C19 9 22 12 22 12M2 17C2 17 5 14 8 17C11 20 13 20 16 17C19 14 22 17 22 17"/></svg>';
        return "";
      };
      var html = '<div class="mini-manse-chart">';
      for (var i = 0; i < order.length; i++) {
        var key = order[i];
        var label = labels[key];
        var p = pillars[key];
        var isDay = (key === "day");
        var highlightClass = isDay ? ' day-highlight' : '';
        if (!p) {
          html += '<div class="mini-manse-col' + highlightClass + '"><div class="mini-manse-label">' + label + '</div><div class="mini-manse-slot unknown">모름</div><div class="mini-manse-slot unknown">모름</div></div>';
          continue;
        }
        var stemText = p.stem.hangul + p.stem.hanja;
        var branchText = p.branch.hangul + p.branch.hanja;
        var stemClass = getElementClass(p.stem.element);
        var branchClass = getElementClass(p.branch.element);
        var stemSvg = getElementSvg(p.stem.element);
        var branchSvg = getElementSvg(p.branch.element);
        html += '<div class="mini-manse-col' + highlightClass + '"><div class="mini-manse-label">' + label + '</div><div class="mini-manse-slot ' + stemClass + '">' + stemSvg + '<span class="mini-manse-text">' + stemText + '</span></div><div class="mini-manse-slot ' + branchClass + '">' + branchSvg + '<span class="mini-manse-text">' + branchText + '</span></div></div>';
      }
      html += '</div>';
      return html;
    }

    function renderVoteArea(areaEl, isMine, data) {
      if (data.deadlinePassed) {
        areaEl.innerHTML = '<div class="vote-status expired">선택기간 종료</div>';
        return;
      }
      if (!isMine) {
        areaEl.innerHTML = data.partnerHasVoted
          ? '<div class="vote-status partner-done">투표 완료</div>'
          : '<div class="vote-status waiting">투표 대기중...</div>';
        return;
      }
      if (data.hasVoted) {
        areaEl.innerHTML = '<div class="vote-status my-done">내 투표 접수됨 ✓</div>';
        return;
      }
      areaEl.innerHTML = '<div class="vote-form">' +
        '<div class="vote-prompt">매칭 여부를 선택해주세요.</div>' +
        '<select id="vote-select" class="vote-select">' +
        '<option value="" style="text-align:center;">선택하세요</option>' +
        '<option value="yes" style="text-align:center;">　　O　　</option>' +
        '<option value="no" style="text-align:center;">　　X　　</option>' +
        '</select>' +
        '<div id="vote-selection-text" class="vote-selection-text"></div>' +
        '<button id="vote-confirm-btn" class="btn-vote-submit">확인</button>' +
        '<div class="vote-warning">⚠ 선택한 결과는 변경할 수 없습니다</div>' +
        '<div id="vote-inline-error" class="error-msg" style="margin-top:4px;font-size:12px;"></div>' +
        '</div>';
      document.getElementById('vote-select').addEventListener('change', function() {
        const textEl = document.getElementById('vote-selection-text');
        if (this.value === 'yes') {
          textEl.className = 'vote-selection-text yes';
          textEl.innerHTML = '소중한 인연으로서<br>맞이하고 싶습니다';
        } else if (this.value === 'no') {
          textEl.className = 'vote-selection-text no';
          textEl.innerHTML = '지금은 받아들이기<br>어렵습니다';
        } else {
          textEl.className = 'vote-selection-text';
          textEl.textContent = '';
        }
      });
      document.getElementById('vote-confirm-btn').addEventListener('click', () => submitVote(data));
    }

    async function submitVote(data) {
      const selectEl = document.getElementById('vote-select');
      const errorEl = document.getElementById('vote-inline-error');
      const selection = selectEl.value;
      if (!selection) { errorEl.textContent = 'O 또는 X를 선택해주세요.'; return; }
      errorEl.textContent = '';
      document.getElementById('vote-confirm-btn').disabled = true;
      document.getElementById('vote-confirm-btn').textContent = '처리 중...';
      try {
        const res = await fetch('/api/match/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchResultId: data.matchResultId,
            participantId: data.me.id,
            selection,
          }),
        });
        const result = await res.json();
        if (!res.ok) {
          errorEl.textContent = result.error || '투표 등록 실패';
          document.getElementById('vote-confirm-btn').disabled = false;
          document.getElementById('vote-confirm-btn').textContent = '확인';
          return;
        }
        // Seal: show locked state without revealing vote
        const myGender = data.me.gender;
        const areaId = myGender === '남' ? 'male-vote-area' : 'female-vote-area';
        document.getElementById(areaId).innerHTML = '<div class="vote-status my-done">내 투표 접수됨 ✓</div>';
      } catch {
        errorEl.textContent = '서버 통신 오류';
        document.getElementById('vote-confirm-btn').disabled = false;
        document.getElementById('vote-confirm-btn').textContent = '확인';
      }
    }

    function renderMatchResult(data) {
      currentMatchData = data;
      document.getElementById('auth-view').style.display = 'none';
      const resultView = document.getElementById('result-view');
      resultView.style.display = 'block';

      // Rank badge
      const rankBadge = document.getElementById('rank-badge');
      rankBadge.textContent = 'MATCH RANK ' + (data.compatibility.rank || '?');
      if (data.compatibility.isTop) {
        rankBadge.classList.add('top');
        rankBadge.textContent = '🏆 1위 운명의 커플 🏆';
      }

      // Score circle
      const score = Math.round(data.compatibility.averageScore);
      document.getElementById('score-num').textContent = score;
      const strokeOffset = 414.69 - (414.69 * score) / 100;
      setTimeout(() => { document.getElementById('score-bar').style.strokeDashoffset = strokeOffset; }, 150);

      // Profiles
      const male = data.partner.gender === '남' ? data.partner : data.me;
      const female = data.partner.gender === '여' ? data.partner : data.me;
      document.getElementById('male-name').textContent = male.displayName;
      document.getElementById('male-mbti').textContent = '남성 · ' + (male.mbti || 'MBTI 비공개');
      document.getElementById('male-saju').innerHTML = createMiniManseHtml(male.manse);
      document.getElementById('female-name').textContent = female.displayName;
      document.getElementById('female-mbti').textContent = '여성 · ' + (female.mbti || 'MBTI 비공개');
      document.getElementById('female-saju').innerHTML = createMiniManseHtml(female.manse);

      // Vote areas
      const isMale = data.me.gender === '남';
      renderVoteArea(document.getElementById('male-vote-area'), isMale, data);
      renderVoteArea(document.getElementById('female-vote-area'), !isMale, data);

      // Deadline notice
      const noticeEl = document.getElementById('deadline-notice');
      if (data.voteDeadline) {
        const dl = new Date(data.voteDeadline);
        const fmt = dl.getFullYear() + '-' + String(dl.getMonth()+1).padStart(2,'0') + '-' + String(dl.getDate()).padStart(2,'0') + ' ' + String(dl.getHours()).padStart(2,'0') + ':' + String(dl.getMinutes()).padStart(2,'0');
        noticeEl.style.display = 'block';
        noticeEl.textContent = data.deadlinePassed ? '선택 기간이 종료되었습니다.' : '매칭 선택 마감: ' + fmt;
      }

      // Keywords
      const kc = document.getElementById('keywords-container');
      kc.innerHTML = '';
      let kws = [];
      if (data.compatibility.myPerspective?.keywords) kws.push(...data.compatibility.myPerspective.keywords);
      if (data.compatibility.partnerPerspective?.keywords) kws.push(...data.compatibility.partnerPerspective.keywords);
      const unique = [...new Set(kws)].slice(0, 5);
      (unique.length ? unique : ['오행의조화', 'MBTI케미', '찰떡궁합']).forEach(kw => {
        const el = document.createElement('span');
        el.className = 'keyword-pill';
        el.textContent = '#' + kw;
        kc.appendChild(el);
      });

      // Reasoning
      let html = '';
      if (data.compatibility.myPerspective?.reason) html += '<p><strong>나의 궁합 관점:</strong><br>' + esc(data.compatibility.myPerspective.reason) + '</p>';
      if (data.compatibility.partnerPerspective?.reason) html += '<p style="margin-top:14px;"><strong>상대방의 궁합 관점:</strong><br>' + esc(data.compatibility.partnerPerspective.reason) + '</p>';
      if (!html) html = '두 분의 사주 정보와 MBTI를 토대로 상호 배려하며 따뜻하게 공감할 수 있는 훌륭한 시너지가 나타나는 궁합입니다.';
      document.getElementById('match-analysis-reason').innerHTML = html;
    }

    function esc(str) {
      return String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
  </script>
</body>
</html>`;
}

module.exports = { matchPage };
