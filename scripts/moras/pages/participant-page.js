/**
 * Participant input page for Moras.
 *
 * Responsibilities:
 * - Render the public submission form and result view.
 * - Keep calculation, storage, auth, and API logic out of this file.
 */

const { CITIES } = require("../manse-service");

function page() {
  const useDevDefaults = shouldUseDevDefaults();
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras - MBTI & 사주 운명 매칭</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@300;400;500;700;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #060913;
      --bg-gradient: radial-gradient(circle at 50% 30%, #111A35 0%, #060913 60%, #020306 100%);
      --panel: rgba(10, 15, 30, 0.72);
      --panel-glow: rgba(255, 255, 255, 0.03);
      --line: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --muted: #94A3B8;
      --gold: #D4AF37;
      --gold-gradient: linear-gradient(135deg, #FFE8A3 0%, #C59B3F 50%, #FFE8A3 100%);
      
      /* 오행 컬러 스키마 - 포스터와 100% 매칭 */
      --wood: #2ecc71;
      --fire: #f5576c;
      --earth: #ffeaa7;
      --metal: #a29bfe;
      --water: #3498db;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg-gradient);
      color: var(--text);
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
      letter-spacing: -0.02em;
      position: relative;
      overflow-x: hidden;
    }
    
    /* 포스터 별무리 오라 및 우주 기운 재현 */
    body::before {
      content: '';
      position: fixed;
      top: -10%; left: -10%;
      width: 60%; height: 60%;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%);
      z-index: -1;
      pointer-events: none;
      animation: auraPulse 8s ease-in-out infinite alternate;
    }
    body::after {
      content: '';
      position: fixed;
      bottom: -10%; right: -10%;
      width: 60%; height: 60%;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.08) 0%, transparent 70%);
      z-index: -1;
      pointer-events: none;
      animation: auraPulse 8s ease-in-out infinite alternate-reverse;
    }
    
    @keyframes auraPulse {
      0% { transform: scale(1) translate(0, 0); opacity: 0.7; }
      100% { transform: scale(1.15) translate(2%, 2%); opacity: 1; }
    }
    
    /* 잔잔한 우주 먼지 효과 */
    .space-dust {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: 
        radial-gradient(1px 1px at 40px 80px, #fff, rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 240px 180px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 400px 350px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 650px 220px, rgba(212, 175, 55, 0.6), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 800px 580px, #fff, rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 1100px 480px, rgba(255,255,255,0.7), rgba(0,0,0,0));
      background-size: 1200px 800px;
      opacity: 0.3;
      z-index: -2;
      pointer-events: none;
    }
    
    main {
      width: min(1200px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 110px 0 80px;
      display: grid;
      grid-template-columns: 380px minmax(0, 1fr);
      gap: 36px;
      align-items: start;
    }
    .global-home-logo {
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 30;
      display: none;
      font-family: 'Cinzel', serif;
      font-size: clamp(34px, 5vw, 58px);
      font-weight: 800;
      letter-spacing: 0.16em;
      line-height: 1;
      text-decoration: none;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 25px rgba(197, 155, 63, 0.5), 0 4px 8px rgba(0, 0, 0, 0.9);
      filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.48));
    }
    .global-home-logo.is-visible {
      display: inline-block;
    }
    
    .control, .result {
      border: 1px solid var(--line);
      background: var(--panel);
      backdrop-filter: blur(20px) saturate(120%);
      -webkit-backdrop-filter: blur(20px) saturate(120%);
      border-radius: 24px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55), 
                  inset 0 1px 1px rgba(255, 255, 255, 0.08);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .control { 
      padding: 32px 28px; 
      position: sticky; 
      top: 32px;
    }
    
    .control:hover {
      border-color: rgba(212, 175, 55, 0.3);
      box-shadow: 0 35px 80px rgba(0, 0, 0, 0.65), 
                  inset 0 1px 1px rgba(255, 255, 255, 0.12),
                  0 0 25px rgba(212, 175, 55, 0.05);
    }
    
    /* 로고 메탈릭 골드 엠보싱 효과 */
    h1 {
      margin: 0 0 28px;
      font-size: 32px;
      font-family: 'Cinzel', serif;
      font-weight: 800;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 15px rgba(197, 155, 63, 0.45), 
                   0 2px 4px rgba(0, 0, 0, 0.9);
      text-align: center;
      letter-spacing: 0.1em;
    }
    
    label {
      display: block;
      margin: 16px 0 6px;
      font-size: 11px;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    input, select {
      width: 100%;
      height: 44px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: rgba(10, 14, 26, 0.65);
      color: var(--text);
      padding: 0 16px;
      font: inherit;
      font-size: 14.5px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: #C59B3F;
      background: rgba(10, 14, 26, 0.9);
      box-shadow: 0 0 12px rgba(197, 155, 63, 0.35);
    }

    input[readonly], input:disabled, select:disabled {
      color: #CBD5E1;
      background: rgba(10, 14, 26, 0.42);
      cursor: not-allowed;
    }

    .roster-note {
      margin: 8px 0 0;
      color: #FFE8A3;
      font-size: 12px;
      line-height: 1.55;
      min-height: 18px;
    }

    .combo {
      position: relative;
    }
    .combo-list {
      position: absolute;
      z-index: 20;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      max-height: 230px;
      overflow-y: auto;
      border: 1px solid rgba(255, 232, 163, 0.22);
      border-radius: 14px;
      background: rgba(8, 12, 24, 0.98);
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55), 0 0 18px rgba(197, 155, 63, 0.12);
      padding: 6px;
    }
    .combo-option {
      width: 100%;
      min-height: 42px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 10px;
      color: var(--text);
      cursor: pointer;
      font-size: 14px;
      font-weight: 800;
    }
    .combo-option:hover,
    .combo-option.active {
      background: rgba(255, 232, 163, 0.10);
      color: #FFE8A3;
    }
    .combo-option.disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .combo-option small {
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }
    
    .hidden { display: none; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    
    .check {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 16px;
      color: var(--text);
      font-size: 13.5px;
      cursor: pointer;
      user-select: none;
      font-weight: 500;
    }
    
    .check input { 
      width: 20px; 
      height: 20px; 
      accent-color: #C59B3F;
      cursor: pointer;
    }
    
    /* 3D 엠보싱 버튼 */
    button {
      width: 100%;
      height: 48px;
      margin-top: 28px;
      border: 0;
      border-radius: 12px;
      background: var(--gold-gradient);
      color: #050811;
      font-weight: 900;
      font-size: 16px;
      letter-spacing: 0.08em;
      cursor: pointer;
      box-shadow: 0 8px 22px rgba(197, 155, 63, 0.25);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(197, 155, 63, 0.4);
      filter: brightness(1.08);
    }
    
    button:active {
      transform: translateY(0);
    }
    
    .hint {
      margin: 20px 0 0;
      color: var(--muted);
      font-size: 11.5px;
      line-height: 1.65;
      text-align: justify;
    }
    .marital-range-wrap {
      margin-top: 14px;
      padding: 16px;
      border: 1px solid rgba(255, 232, 163, 0.18);
      border-radius: 14px;
      background: rgba(255, 232, 163, 0.04);
    }
    .marital-range-label {
      margin: 0 0 12px;
      color: #CBD5E1;
      font-size: 12.5px;
      line-height: 1.55;
      word-break: keep-all;
    }
    .marital-range-label strong { color: #FFE8A3; }
    .marital-range-label span { color: var(--muted); font-size: 11px; }
    .marital-range-btns {
      display: flex;
      gap: 10px;
    }
    .marital-range-btn {
      flex: 1;
      height: 42px;
      margin: 0;
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      color: var(--muted);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: none;
    }
    .marital-range-btn:hover {
      border-color: rgba(255, 232, 163, 0.35);
      color: var(--text);
      transform: none;
    }
    .marital-range-btn.selected {
      border-color: rgba(255, 232, 163, 0.75);
      background: rgba(255, 232, 163, 0.14);
      color: #FFE8A3;
      box-shadow: 0 0 12px rgba(255, 232, 163, 0.18);
    }

    .submit-oracle {
      margin-top: 22px;
      padding: 22px 18px;
      border: 1px solid rgba(255, 232, 163, 0.22);
      border-radius: 18px;
      background:
        radial-gradient(circle at 18% 25%, rgba(0, 242, 254, 0.16), transparent 34%),
        radial-gradient(circle at 84% 18%, rgba(255, 232, 163, 0.18), transparent 32%),
        rgba(5, 8, 17, 0.72);
      box-shadow: 0 18px 52px rgba(0, 0, 0, 0.34), inset 0 0 28px rgba(255, 232, 163, 0.05);
      overflow: hidden;
      position: relative;
    }

    .submit-oracle.hidden {
      display: none;
    }

    .submit-oracle::before {
      content: '';
      position: absolute;
      inset: -45%;
      background: conic-gradient(from 0deg, transparent, rgba(255, 232, 163, 0.22), transparent, rgba(0, 242, 254, 0.16), transparent);
      animation: oracleSpin 6s linear infinite;
      opacity: 0.45;
    }

    .submit-oracle-inner {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 14px;
      justify-items: center;
      text-align: center;
    }

    .oracle-ring {
      width: 74px;
      height: 74px;
      border-radius: 999px;
      border: 2px solid rgba(255, 232, 163, 0.22);
      position: relative;
      display: grid;
      place-items: center;
      box-shadow: 0 0 28px rgba(255, 232, 163, 0.18);
    }

    .oracle-ring::before,
    .oracle-ring::after {
      content: '';
      position: absolute;
      inset: 8px;
      border-radius: inherit;
      border: 2px solid transparent;
      border-top-color: #FFE8A3;
      border-right-color: rgba(0, 242, 254, 0.9);
      animation: oracleSpin 1.35s cubic-bezier(0.5, 0, 0.3, 1) infinite;
    }

    .oracle-ring::after {
      inset: 19px;
      border-top-color: rgba(245, 87, 108, 0.92);
      border-right-color: transparent;
      animation-duration: 2.1s;
      animation-direction: reverse;
    }

    .oracle-core {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: #FFE8A3;
      box-shadow: 0 0 18px rgba(255, 232, 163, 0.9);
    }

    .oracle-title {
      color: #FFE8A3;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 0.02em;
    }

    .oracle-message {
      min-height: 24px;
      color: var(--text);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.7;
    }

    .oracle-progress {
      width: min(100%, 420px);
      height: 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      overflow: hidden;
      box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
    }

    .oracle-progress span {
      display: block;
      width: 42%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #00F2FE, #FFE8A3, #F5576C);
      animation: oracleProgress 1.7s ease-in-out infinite;
    }

    .oracle-note {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.65;
    }

    @keyframes oracleSpin {
      to { transform: rotate(360deg); }
    }

    @keyframes oracleProgress {
      0% { transform: translateX(-105%); }
      50% { transform: translateX(80%); }
      100% { transform: translateX(245%); }
    }
    
    .secondary-link {
      display: inline-flex;
      margin-top: 20px;
      color: #FFE8A3;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
      align-items: center;
      gap: 4px;
    }
    
    .secondary-link:hover {
      color: #C59B3F;
      text-decoration: underline;
    }
    
    .result {
      padding: 40px 36px;
      min-width: 0;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5), 
                  inset 0 1px 1px rgba(255, 255, 255, 0.05);
    }

    .application-success {
      margin: 0 0 20px;
      max-height: 96px;
      overflow: hidden;
      padding: 16px 18px;
      border-radius: 16px;
      border: 1px solid rgba(255, 232, 163, 0.22);
      background: linear-gradient(135deg, rgba(255, 232, 163, 0.11), rgba(255, 255, 255, 0.035));
      color: #FFE8A3;
      font-size: 17px;
      font-weight: 900;
      line-height: 1.45;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24);
      animation: successDisappear 5.2s ease forwards;
    }

    .application-success span {
      display: block;
      margin-top: 4px;
      color: #CBD5E1;
      font-size: 13px;
      font-weight: 700;
    }

    @keyframes successDisappear {
      0%, 68% { opacity: 1; transform: translateY(0); max-height: 96px; margin-bottom: 20px; padding-top: 16px; padding-bottom: 16px; }
      100% { opacity: 0; transform: translateY(-8px); max-height: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; border-width: 0; }
    }

    .result-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 18px;
      align-items: start;
      margin-bottom: 24px;
    }
    
    .profile {
      display: grid;
      grid-template-columns: 72px minmax(0, 1fr);
      gap: 20px;
      align-items: center;
      margin-bottom: 0;
    }

    .pdf-btn {
      width: auto;
      min-width: 132px;
      height: 42px;
      margin-top: 10px;
      padding: 0 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 232, 163, 0.22);
      background: rgba(255, 232, 163, 0.08);
      color: #FFE8A3;
      font-size: 13px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: none;
    }

    .pdf-btn:hover {
      background: rgba(255, 232, 163, 0.13);
      border-color: rgba(255, 232, 163, 0.36);
      transform: translateY(-1px);
    }
    
    .avatar {
      width: 72px;
      height: 72px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(197, 155, 63, 0.18) 0%, rgba(255, 255, 255, 0.03) 100%);
      color: #FFE8A3;
      border: 2px solid rgba(197, 155, 63, 0.4);
      font-size: 30px;
      font-weight: 900;
      text-shadow: 0 0 12px rgba(197, 155, 63, 0.6);
      box-shadow: 0 0 25px rgba(197, 155, 63, 0.2);
    }
    
    .name {
      font-size: 30px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }
    
    .subtitle {
      margin-top: 6px;
      color: #FFE8A3;
      font-size: 15.5px;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    
    .meta {
      margin: 16px 0 24px;
      display: grid;
      gap: 8px;
      color: var(--muted);
      font-size: 13.5px;
      line-height: 1.4;
      padding: 14px 18px;
      background: rgba(10, 14, 26, 0.45);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .meta .solar { color: #f5576c; font-weight: 600; }
    .meta .lunar { color: #3498db; font-weight: 600; }
    .meta .place { color: #ffeaa7; font-weight: 600; }
    
    .notice {
      margin: 0 0 24px;
      padding: 16px 18px;
      border: 1px solid rgba(197, 155, 63, 0.25);
      border-radius: 14px;
      background: rgba(197, 155, 63, 0.07);
      color: #FFE8A3;
      font-size: 14px;
      line-height: 1.65;
    }
    
    .analysis {
      margin: 0 0 28px;
      padding: 22px;
      border: 1px solid rgba(52, 152, 219, 0.2);
      border-radius: 14px;
      background: rgba(10, 15, 30, 0.4);
      color: #E2E8F0;
      font-size: 14.5px;
      line-height: 1.75;
      box-shadow: inset 0 0 20px rgba(52, 152, 219, 0.03);
    }
    
    .analysis strong {
      display: block;
      margin-bottom: 10px;
      color: #FFE8A3;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    
    .chart-wrap {
      display: grid;
      grid-template-columns: 58px minmax(580px, 1fr);
      align-items: end;
      gap: 14px;
      overflow-x: auto;
      padding-bottom: 8px;
      -webkit-overflow-scrolling: touch;
    }
    
    .labels {
      display: grid;
      grid-template-rows: 32px 72px 28px 72px 28px 28px 28px 28px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      align-items: center;
    }
    
    .chart {
      display: grid;
      grid-template-columns: repeat(4, minmax(130px, 1fr));
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      overflow: hidden;
      background: rgba(5, 8, 17, 0.45);
      min-width: 580px;
    }
    
    .col {
      display: grid;
      grid-template-rows: 32px 72px 28px 72px 28px 28px 28px 28px;
      border-left: 1px solid rgba(255,255,255,0.06);
    }
    
    .col:first-child { border-left: 0; }
    
    .slot {
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid rgba(255,255,255,0.06);
      color: #E2E8F0;
      font-size: 14px;
      white-space: nowrap;
      transition: background-color 0.2s;
    }
    
    .slot:first-child {
      border-top: 0;
      background: rgba(10, 14, 26, 0.6);
      color: #FFE8A3;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    
    .big {
      position: relative;
      flex-direction: column;
      gap: 2px;
      background: rgba(10, 14, 26, 0.25);
    }
    
    .stem {
      font-size: 32px;
      font-weight: 900;
      line-height: 1;
      font-family: 'Cinzel', serif;
      z-index: 1;
    }
    
    .branch {
      font-size: 34px;
      font-weight: 900;
      line-height: 1;
      font-family: 'Cinzel', serif;
      z-index: 1;
    }
    
    .element {
      position: absolute;
      right: 10px;
      bottom: 8px;
      font-size: 10.5px;
      font-weight: 700;
      opacity: 0.9;
      z-index: 1;
    }
    
    /* 5대 오행별 포스터 연동형 네온 톤 배경/효과 */
    .elem-wood { 
      color: var(--wood); 
      --glow: rgba(46, 204, 113, 0.35); 
      background: rgba(46, 204, 113, 0.04); 
      text-shadow: 0 0 10px rgba(46, 204, 113, 0.6);
    }
    .elem-fire { 
      color: var(--fire); 
      --glow: rgba(245, 87, 108, 0.35); 
      background: rgba(245, 87, 108, 0.04); 
      text-shadow: 0 0 10px rgba(245, 87, 108, 0.6);
    }
    .elem-earth { 
      color: var(--earth); 
      --glow: rgba(255, 234, 167, 0.35); 
      background: rgba(255, 234, 167, 0.04); 
      text-shadow: 0 0 10px rgba(255, 234, 167, 0.6);
    }
    .elem-metal { 
      color: var(--metal); 
      --glow: rgba(162, 155, 254, 0.35); 
      background: rgba(162, 155, 254, 0.04); 
      text-shadow: 0 0 10px rgba(162, 155, 254, 0.6);
    }
    .elem-water { 
      color: var(--water); 
      --glow: rgba(52, 152, 219, 0.35); 
      background: rgba(52, 152, 219, 0.04); 
      text-shadow: 0 0 10px rgba(52, 152, 219, 0.6);
    }
    
    .slot.big {
      box-shadow: inset 0 0 15px var(--glow, transparent);
    }
    
    /* 룬 워터마크 SVG 스타일 */
    .elem-svg {
      position: absolute;
      width: 44px;
      height: 44px;
      opacity: 0.12;
      pointer-events: none;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 0;
      color: currentColor;
    }
    
    /* 일주(日柱) - 나 자신 강조 (포스터의 빛나는 중심 별처럼) */
    .col.day {
      border: 2px solid #FFE8A3 !important;
      position: relative;
      z-index: 2;
      box-shadow: 0 0 25px rgba(254, 232, 163, 0.45), inset 0 0 15px rgba(254, 232, 163, 0.15);
      animation: pulseGlow 3.5s infinite alternate;
    }
    
    .col.day::after {
      content: '본인(日)';
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      background: #FFE8A3;
      color: #050811;
      font-size: 9.5px;
      font-weight: 900;
      padding: 2px 8px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 4px 10px rgba(0,0,0,0.65);
      letter-spacing: 0.05em;
    }
    
    @keyframes pulseGlow {
      0% {
        border-color: rgba(254, 232, 163, 0.7);
        box-shadow: 0 0 15px rgba(254, 232, 163, 0.3);
      }
      100% {
        border-color: rgba(254, 232, 163, 1);
        box-shadow: 0 0 35px rgba(254, 232, 163, 0.65), inset 0 0 12px rgba(254, 232, 163, 0.2);
      }
    }
    
    .empty {
      min-height: 460px;
      display: grid;
      place-items: center;
      color: var(--muted);
      text-align: center;
      line-height: 1.85;
      font-size: 15px;
      background: rgba(10, 14, 26, 0.2);
      border-radius: 16px;
      border: 1px dashed rgba(255, 255, 255, 0.06);
    }
    
    .error {
      margin-top: 16px;
      color: #f5576c;
      font-size: 14px;
      font-weight: 600;
      min-height: 20px;
      text-align: center;
    }
    
    @media (max-width: 860px) {
      main {
        width: min(100vw - 24px, 600px);
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 104px 0 48px;
      }
      .control { position: static; }
      .result { padding: 32px 24px; }
    }
    @media (max-width: 560px) {
      body {
        background: var(--bg);
      }
      main {
        width: 100%;
        padding: 0 0 40px;
      }
      .control, .result {
        border-left: 0;
        border-right: 0;
        border-radius: 0;
        box-shadow: none;
      }
      .control {
        padding: 24px 18px;
      }
      h1 {
        font-size: 28px;
      }
      .row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      .welcome-stage {
        margin: 48px 14px 80px;
        padding: 42px 20px;
      }
      .welcome-links {
        grid-template-columns: 1fr;
        max-width: 320px;
      }
      input, select, button {
        height: 48px;
        font-size: 15px;
      }
      .check {
        min-height: 40px;
      }
      .result {
        padding: 32px 18px;
      }
      .profile {
        grid-template-columns: 60px minmax(0, 1fr);
        gap: 16px;
        margin: 0 4px 20px;
      }
      .avatar {
        width: 60px;
        height: 60px;
        font-size: 26px;
      }
      .name {
        font-size: 26px;
      }
      .subtitle {
        font-size: 14.5px;
      }
      .meta {
        margin: 14px 4px 20px;
        font-size: 13px;
      }
      .notice {
        margin: 0 4px 20px;
        font-size: 13.5px;
        line-height: 1.55;
      }
      .chart-wrap {
        grid-template-columns: 48px minmax(440px, 1fr);
        gap: 10px;
        padding: 0 0 8px;
      }
      .labels {
        grid-template-rows: 28px 64px 24px 64px 24px 24px 24px 24px;
        font-size: 12px;
      }
      .chart {
        min-width: 440px;
        grid-template-columns: repeat(4, minmax(110px, 1fr));
      }
      .col {
        grid-template-rows: 28px 64px 24px 64px 24px 24px 24px 24px;
      }
      .slot {
        font-size: 13px;
      }
      .stem {
        font-size: 28px;
      }
      .branch {
        font-size: 30px;
      }
      .element {
        right: 8px;
        bottom: 6px;
        font-size: 9.5px;
      }
      .empty {
        min-height: 300px;
        font-size: 14px;
      }
    }

    /* --- 3단계 시퀀스 스테이지용 스타일 --- */
    .welcome-stage, .input-stage, .result-stage {
      transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: translateY(20px);
    }
    .welcome-stage.active, .input-stage.active, .result-stage.active {
      opacity: 1;
      transform: translateY(0);
    }
    .stage-hidden {
      display: none !important;
    }

    /* 웰컴 인트로 스테이지 */
    .welcome-stage {
      max-width: 680px;
      margin: 100px auto 140px;
      text-align: center;
      padding: 60px 40px;
      border: 1px solid var(--line);
      background: var(--panel);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border-radius: 32px;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6), 
                  inset 0 1px 1px rgba(255, 255, 255, 0.08);
    }
    .welcome-logo {
      display: inline-block;
      font-size: 64px;
      font-family: 'Cinzel', serif;
      font-weight: 800;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 25px rgba(197, 155, 63, 0.5), 
                   0 4px 8px rgba(0, 0, 0, 0.9);
      margin-bottom: 24px;
      letter-spacing: 0.15em;
      line-height: 1;
      text-decoration: none;
    }
    .welcome-desc {
      font-size: 18px;
      color: #E2E8F0;
      line-height: 1.8;
      margin-bottom: 40px;
      font-weight: 400;
    }
    .welcome-desc strong {
      color: #FFE8A3;
      font-weight: 700;
    }
    .welcome-btn {
      max-width: 320px;
      height: 56px;
      font-size: 18px;
      margin: 0 auto;
    }
    .welcome-links {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      max-width: 520px;
      margin: 18px auto 0;
    }
    .welcome-link-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 0 18px;
      border: 1px solid rgba(255, 232, 163, 0.26);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.055);
      color: #FFE8A3;
      font-size: 14px;
      font-weight: 900;
      text-decoration: none;
      box-shadow: 0 12px 28px rgba(0,0,0,0.20);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, background 0.25s, box-shadow 0.25s;
    }
    .welcome-link-btn:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 232, 163, 0.48);
      background: rgba(197, 155, 63, 0.12);
      box-shadow: 0 16px 34px rgba(197, 155, 63, 0.16);
    }

    /* 입력 스테이지 중앙 정렬 */
    .input-stage {
      max-width: 580px;
      margin: 116px auto 80px;
    }
    .input-stage .control {
      position: static;
      width: 100%;
    }

    /* 결과 스테이지 전면 웅장 레이아웃 */
    .result-stage {
      max-width: 1100px;
      margin: 0 auto 80px;
      width: 100%;
    }
    .result-stage .result {
      width: 100%;
    }

    /* 3대 우주 서판 (Cosmic Tablets) 스타일 */
    .cosmic-tablet-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
      margin: 36px 0;
    }
    .cosmic-card {
      border-radius: 18px;
      padding: 28px;
      background: linear-gradient(135deg, rgba(11, 17, 36, 0.78), rgba(18, 17, 35, 0.62));
      border: 1px solid rgba(255, 255, 255, 0.075);
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 18px 38px rgba(0, 0, 0, 0.26);
    }
    .cosmic-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    .cosmic-card * {
      position: relative;
      z-index: 1;
    }
    .cosmic-card h3 {
      margin: 0 0 14px;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cosmic-card p {
      margin: 0;
      max-width: 760px;
      font-size: 15px;
      line-height: 1.86;
      color: #CBD5E1;
      text-align: left;
    }
    .report-section-label {
      margin: 34px 0 8px;
      color: #FFE8A3;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: none;
    }
    .card-report {
      padding: 34px;
      border-color: rgba(255, 232, 163, 0.22);
      background:
        radial-gradient(circle at 18% 10%, rgba(162, 155, 254, 0.16), transparent 36%),
        linear-gradient(135deg, rgba(197, 155, 63, 0.11), rgba(10, 15, 30, 0.72));
    }
    .card-report h3 {
      color: #FFE8A3;
      font-size: 22px;
      margin-bottom: 18px;
    }
    .report-lead {
      margin: -6px 0 18px;
      max-width: 780px;
      color: #E9D8A6;
      font-size: 16px;
      line-height: 1.7;
      font-weight: 800;
      word-break: keep-all;
    }
    .card-report p {
      max-width: 820px;
      font-size: 15.5px;
      line-height: 1.92;
    }
    .report-cover-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 24px;
    }
    .report-cover-point {
      padding: 14px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.07);
    }
    .report-cover-point b {
      display: block;
      margin-bottom: 7px;
      color: #FFE8A3;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.08em;
    }
    .report-cover-point span {
      display: block;
      color: #CBD5E1;
      font-size: 13px;
      line-height: 1.55;
      word-break: keep-all;
    }
    .card-core {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      border-color: rgba(52, 152, 219, 0.22);
    }
    .card-core h3 {
      grid-column: 1 / -1;
      color: #93C5FD;
      margin-bottom: 0;
    }
    .report-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }
    .report-icon {
      display: inline-grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.055);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #FFE8A3;
      font-size: 17px;
      flex: 0 0 auto;
    }
    .report-kicker {
      margin-bottom: 4px;
      color: #94A3B8;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.11em;
      text-transform: uppercase;
    }
    .report-title {
      color: #F8FAFC;
      font-size: 18px;
      font-weight: 900;
    }
    .report-summary {
      margin-top: 18px;
      padding: 16px 18px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(255, 232, 163, 0.075), rgba(255, 255, 255, 0.025));
      border: 1px solid rgba(255, 232, 163, 0.12);
      color: #E9D8A6;
      font-size: 15px;
      line-height: 1.72;
      font-weight: 700;
      word-break: keep-all;
      overflow-wrap: anywhere;
    }
    .summary-title {
      display: block;
      margin-bottom: 12px;
      color: #FFE8A3;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: none;
    }
    .report-summary span {
      display: block;
    }
    .report-summary span + span {
      margin-top: 8px;
      color: #D7C7F5;
      font-weight: 600;
    }
    .report-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 18px;
    }
    .report-tags span {
      border-radius: 999px;
      padding: 6px 11px;
      background: rgba(255, 255, 255, 0.055);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #DDE7F3;
      font-size: 12px;
      line-height: 1;
      font-weight: 800;
      white-space: nowrap;
    }
    .analysis-card {
      display: grid;
      grid-template-columns: minmax(190px, 240px) minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }
    .analysis-card .report-copy {
      max-width: 790px;
    }
    .analysis-card:hover {
      border-color: rgba(255, 232, 163, 0.17);
      box-shadow: 0 22px 46px rgba(0, 0, 0, 0.32);
      transform: translateY(-1px);
    }
    .core-row {
      padding: 16px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .core-row b,
    .sub-section b {
      display: block;
      margin-bottom: 8px;
      color: #FFE8A3;
      font-size: 13px;
    }
    .sub-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .sub-section p {
      font-size: 13.5px;
    }

    /* 각 서판별 개성적 글로우 데코레이션 */
    .card-person {
      border-color: rgba(162, 155, 254, 0.22);
      box-shadow: inset 0 0 24px rgba(162, 155, 254, 0.04), 0 15px 35px rgba(0, 0, 0, 0.3);
    }
    .card-person h3 { color: #a29bfe; text-shadow: 0 0 10px rgba(162, 155, 254, 0.4); }
    .card-person::before {
      background: radial-gradient(circle at 10% 10%, rgba(162, 155, 254, 0.05) 0%, transparent 50%);
    }
    .card-person:hover {
      border-color: rgba(162, 155, 254, 0.4);
      box-shadow: inset 0 0 30px rgba(162, 155, 254, 0.08), 0 20px 45px rgba(162, 155, 254, 0.05);
      transform: translateY(-2px);
    }

    .card-destiny {
      border-color: rgba(212, 175, 55, 0.22);
      box-shadow: inset 0 0 24px rgba(212, 175, 55, 0.04), 0 15px 35px rgba(0, 0, 0, 0.3);
    }
    .card-destiny h3 { color: #FFE8A3; text-shadow: 0 0 10px rgba(197, 155, 63, 0.4); }
    .card-destiny::before {
      background: radial-gradient(circle at 10% 10%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
    }
    .card-destiny:hover {
      border-color: rgba(212, 175, 55, 0.4);
      box-shadow: inset 0 0 30px rgba(212, 175, 55, 0.08), 0 20px 45px rgba(212, 175, 55, 0.05);
      transform: translateY(-2px);
    }

    .card-partner {
      border-color: rgba(245, 87, 108, 0.22);
      box-shadow: inset 0 0 24px rgba(245, 87, 108, 0.04), 0 15px 35px rgba(0, 0, 0, 0.3);
    }
    .card-partner h3 { color: #f5576c; text-shadow: 0 0 10px rgba(245, 87, 108, 0.4); }
    .card-partner::before {
      background: radial-gradient(circle at 10% 10%, rgba(245, 87, 108, 0.05) 0%, transparent 50%);
    }
    .card-partner:hover {
      border-color: rgba(245, 87, 108, 0.4);
      box-shadow: inset 0 0 30px rgba(245, 87, 108, 0.08), 0 20px 45px rgba(245, 87, 108, 0.05);
      transform: translateY(-2px);
    }

    /* 추가 요소들 - 키워드 및 메인 하이라이터 */
    .keywords-badge-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 20px 0 0;
    }
    .keyword-badge {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #E2E8F0;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .cautions-container {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .caution-item {
      font-size: 12px;
      color: #94A3B8;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }

    .result-footer-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 40px;
    }
    .action-btn {
      width: auto;
      min-width: 200px;
      margin-top: 0;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text);
    }
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    @media (max-width: 900px) {
      .result-head {
        grid-template-columns: 1fr;
      }
      .pdf-btn {
        width: 100%;
        margin-top: -4px;
      }
      .cosmic-tablet-container {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .card-core {
        grid-template-columns: 1fr;
      }
      .cosmic-card,
      .card-report {
        padding: 22px 18px;
      }
      .card-report h3 {
        font-size: 20px;
      }
      .report-cover-grid {
        grid-template-columns: 1fr;
      }
      .cosmic-card p {
        max-width: none;
        font-size: 14.5px;
        line-height: 1.82;
      }
      .report-section-label {
        font-size: 20px;
        margin-top: 28px;
      }
      .analysis-card {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      @page {
        size: A4;
        margin: 10mm;
      }
      html,
      body {
        background: var(--bg) !important;
        color: var(--text) !important;
      }
      .space-dust,
      .pdf-btn,
      .result-footer-actions {
        display: none !important;
      }
      .result-stage {
        padding: 0;
        display: block !important;
        opacity: 1 !important;
        transform: none !important;
        max-width: none;
      }
      .result {
        box-shadow: none;
        padding: 18px;
        color: var(--text) !important;
      }
      .cosmic-card,
      .chart,
      .meta,
      .notice {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .chart-wrap {
        overflow: visible;
      }
    }
  </style>
</head>
<body>
  <div class="space-dust"></div>
  <a class="global-home-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
  
  <!-- STAGE 1: Welcome Intro Gate -->
  <div id="stage-welcome" class="welcome-stage active">
    <a class="welcome-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
    <div class="welcome-desc">
      🌌 당신의 호흡과 온 우주가 맞물린 위대한 순간.<br>
      본인의 <strong>MBTI</strong>와 <strong>우주적 만세력(Saju)</strong>이 직조해내는 신비로운 조화와<br>
      오행의 어우러짐을 Celestial 밤하늘 아래에서 탐독해보세요.
    </div>
    <button id="btn-start" class="welcome-btn">이벤트 신청 및 운명의 만세력 조회</button>
    <div class="welcome-links">
      <a class="welcome-link-btn" href="/applicants">신청자 목록 확인하기</a>
      <a class="welcome-link-btn" href="/results">매칭결과 확인하기</a>
      <a class="welcome-link-btn" href="/roulette">룰렛결과 확인하기</a>
      <a class="welcome-link-btn" href="/ladder">사다리결과 확인하기</a>
    </div>
  </div>

  <!-- STAGE 2: Cosmic Input Stage -->
  <div id="stage-input" class="input-stage stage-hidden">
    <section class="control">
      <form id="manse-form">
        <div style="display:flex;align-items:center;justify-content:space-between;margin:16px 0 6px;">
          <label for="roster-combobox" style="margin:0">신청자 선택</label>
          <button type="button" id="btn-roster-request" title="목록에 신규 사용자 추가 요청" style="width:auto;height:30px;margin-top:0;padding:0 12px;font-size:11px;font-weight:900;letter-spacing:0.06em;border-radius:8px;background:rgba(255,232,163,0.1);border:1px solid rgba(255,232,163,0.28);color:#FFE8A3;cursor:pointer;box-shadow:none;transition:background 0.2s;" onmouseover="this.style.background='rgba(255,232,163,0.18)'" onmouseout="this.style.background='rgba(255,232,163,0.1)'">추가요청</button>
        </div>
        <div class="combo">
          <input id="roster-combobox" role="combobox" aria-expanded="false" aria-controls="roster-options" autocomplete="off" placeholder="이름을 검색하거나 선택하세요">
          <input id="roster-participant-id" name="rosterParticipantId" type="hidden" required>
          <div id="roster-options" class="combo-list hidden" role="listbox"></div>
        </div>
        <p id="roster-note" class="roster-note"></p>
        <p style="margin:6px 0 0;color:#64748B;font-size:11.5px;line-height:1.55;">* 목록에서 검색이 되지 않는 경우 우측 상단의 추가요청 버튼을 눌러 정보를 입력하여 운영자에게 요청해주세요.</p>
        <div class="row">
          <div>
            <label for="name">이름</label>
            <input id="name" name="name" readonly required placeholder="명단에서 선택">
          </div>
          <div>
            <label for="gender-display">성별</label>
            <input id="gender-display" readonly placeholder="자동 입력">
            <input id="gender" name="gender" type="hidden">
          </div>
        </div>
        <div class="row">
          <div>
            <label for="marital-status">혼인상태</label>
            <select id="marital-status" name="maritalStatus" required>
              <option value="" disabled selected>혼인상태 선택</option>
              <option value="미혼">미혼</option>
              <option value="기혼">기혼</option>
              <option value="돌싱">돌싱</option>
            </select>
          </div>
        </div>
        <div id="marital-range-wrap" class="marital-range-wrap" style="display:none;">
          <div class="marital-range-label">
            <strong id="marital-range-my-status"></strong> 외에 매칭이 가능한 범위를 정해주세요. <span>(복수선택 가능)</span>
          </div>
          <div class="marital-range-btns" id="marital-range-btns"></div>
        </div>
        <label for="mbti">MBTI</label>
        <select id="mbti" name="mbti" required>
          <option value="" disabled selected>MBTI 선택</option>
          <option value="ISTJ">ISTJ</option>
          <option value="ISFJ">ISFJ</option>
          <option value="INFJ">INFJ</option>
          <option value="INTJ">INTJ</option>
          <option value="ISTP">ISTP</option>
          <option value="ISFP">ISFP</option>
          <option value="INFP">INFP</option>
          <option value="INTP">INTP</option>
          <option value="ESTP">ESTP</option>
          <option value="ESFP">ESFP</option>
          <option value="ENFP">ENFP</option>
          <option value="ENTP">ENTP</option>
          <option value="ESTJ">ESTJ</option>
          <option value="ESFJ">ESFJ</option>
          <option value="ENFJ">ENFJ</option>
          <option value="ENTJ">ENTJ</option>
        </select>
        <div class="row">
          <div>
            <label for="date">생년월일</label>
            <input id="date" name="date" type="date" required>
          </div>
          <div>
            <label for="time">출생시간</label>
            <input id="time" name="time" type="time" required>
          </div>
        </div>
        <label class="check">
          <input id="time-unknown" name="timeUnknown" type="checkbox">
          출생시간 모름
        </label>
        <label for="calendar">달력구분</label>
        <select id="calendar" name="calendar" required>
          <option value="" disabled selected>달력구분 선택</option>
          <option value="solar">양력(Solar)</option>
          <option value="lunar">음력(Lunar)</option>
        </select>
        <label for="birth-place">태어난 곳</label>
        <select id="birth-place" name="birthPlace"></select>
        <div id="custom-place-wrap" class="hidden">
          <label for="custom-birth-place">도시 직접 입력</label>
          <input id="custom-birth-place" name="customBirthPlace" placeholder="예: Chicago">
        </div>
        <label class="check">
          <input id="test-mode" name="testMode" type="checkbox" checked>
          생년월일 데이터 표시 (테스트 모드)
        </label>
        <button type="submit">이벤트 신청 및 운명의 만세력 조회</button>
        <div id="submit-oracle" class="submit-oracle hidden" aria-live="polite">
          <div class="submit-oracle-inner">
            <div class="oracle-ring"><span class="oracle-core"></span></div>
            <div class="oracle-title">운명의 리포트를 작성하고 있어요</div>
            <div id="oracle-message" class="oracle-message">만세력의 별자리를 정렬하는 중...</div>
            <div class="oracle-progress"><span></span></div>
            <div class="oracle-note">리포트가 완성되어야 신청이 완료됩니다. 실패하면 입력 내용은 유지되니 다시 신청 버튼을 눌러주세요.</div>
          </div>
        </div>
        <p class="hint">출생 정보는 보안 암호화 처리되며, 공개 매칭 화면에는 노출되지 않습니다. 계산된 오행 만세력과 MBTI만을 매칭 엔진에 활용하여 최고의 파트너를 분석합니다.</p>
        <div id="error" class="error"></div>
      </form>
    </section>
  </div>

  <!-- 추가요청 Modal -->
  <div id="roster-request-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:200;align-items:center;justify-content:center;padding:24px;">
    <div style="width:min(420px,100%);background:#0a0f1e;border:1px solid rgba(255,232,163,0.28);border-radius:22px;padding:30px 26px;box-shadow:0 40px 100px rgba(0,0,0,0.7);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;">
        <div style="color:#FFE8A3;font-size:18px;font-weight:900;">목록 추가 요청</div>
        <button type="button" id="roster-request-close" style="width:34px;height:34px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.05);color:#94A3B8;font-size:17px;cursor:pointer;">✕</button>
      </div>
      <form id="roster-request-form">
        <label style="display:block;margin:0 0 6px;color:#94A3B8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">이름 <span style="color:#f5576c">*</span></label>
        <input id="rr-name" type="text" required placeholder="실명을 입력해주세요" style="width:100%;height:44px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(10,14,26,0.65);color:#F8FAFC;padding:0 16px;font-size:14.5px;box-sizing:border-box;margin-bottom:14px;font-family:inherit">
        <label style="display:block;margin:0 0 6px;color:#94A3B8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">성별 <span style="color:#f5576c">*</span></label>
        <select id="rr-gender" required style="width:100%;height:44px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(10,14,26,0.65);color:#F8FAFC;padding:0 16px;font-size:14.5px;box-sizing:border-box;margin-bottom:14px;font-family:inherit;appearance:auto">
          <option value="" disabled selected>성별 선택</option>
          <option value="남">남</option>
          <option value="여">여</option>
        </select>
        <div id="rr-error" style="color:#f5576c;font-size:13px;font-weight:600;min-height:18px;margin-bottom:8px;text-align:center"></div>
        <button type="submit" style="width:100%;height:46px;border:0;border-radius:12px;background:linear-gradient(135deg,#FFE8A3 0%,#C59B3F 50%,#FFE8A3 100%);color:#050811;font-weight:900;font-size:15px;cursor:pointer;">추가 요청하기</button>
      </form>
    </div>
  </div>

  <!-- STAGE 3: Oracle Result Stage -->
  <div id="stage-result" class="result-stage stage-hidden">
    <section id="result" class="result">
      <div class="empty">생년월일시와 태어난 곳을 입력하시면<br>Celestial 밤하늘 스타일의 고급 만세력 카드가 생성됩니다.</div>
    </section>
  </div>
  <script>
    const cities = ${JSON.stringify(CITIES)};
    const useDevDefaults = ${JSON.stringify(useDevDefaults)};
    const form = document.querySelector("#manse-form");
    const resultEl = document.querySelector("#result");
    const errorEl = document.querySelector("#error");
    const submitOracle = document.querySelector("#submit-oracle");
    const oracleMessage = document.querySelector("#oracle-message");
    const birthPlace = document.querySelector("#birth-place");
    const customPlaceWrap = document.querySelector("#custom-place-wrap");
    const customBirthPlace = document.querySelector("#custom-birth-place");
    const timeInput = document.querySelector("#time");
    const timeUnknown = document.querySelector("#time-unknown");
    const rosterCombo = document.querySelector("#roster-combobox");
    const rosterSelect = document.querySelector("#roster-participant-id");
    const rosterOptions = document.querySelector("#roster-options");
    const rosterNote = document.querySelector("#roster-note");
    const nameInput = document.querySelector("#name");
    const genderInput = document.querySelector("#gender");
    const genderDisplay = document.querySelector("#gender-display");
    let rosterParticipants = [];

    // Stage DOM Elements
    const stageWelcome = document.querySelector("#stage-welcome");
    const stageInput = document.querySelector("#stage-input");
    const stageResult = document.querySelector("#stage-result");
    const btnStart = document.querySelector("#btn-start");
    const globalHomeLogo = document.querySelector(".global-home-logo");
    const oracleMessages = [
      "만세력의 별자리를 정렬하는 중...",
      "오행의 흐름과 균형을 읽는 중...",
      "MBTI와 사주의 결을 맞춰보는 중...",
      "관계 리듬과 인연의 단서를 정리하는 중...",
      "완성된 리포트 문장을 다듬는 중..."
    ];
    let oracleTimer = null;

    // Stage Transition Helper (fade out -> wait -> hide/show -> reflow -> fade in)
    function transitionStage(from, to) {
      from.classList.remove("active");
      setTimeout(() => {
        from.classList.add("stage-hidden");
        to.classList.remove("stage-hidden");
        // Force reflow
        to.offsetWidth;
        to.classList.add("active");
        globalHomeLogo.classList.toggle("is-visible", to !== stageWelcome);
        
        // Scroll back to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 450);
    }

    // Initialize Welcome Gate Action
    btnStart.addEventListener("click", () => {
      transitionStage(stageWelcome, stageInput);
    });

    // 추가요청 모달
    const rrModal = document.querySelector("#roster-request-modal");
    document.querySelector("#btn-roster-request").addEventListener("click", () => {
      rrModal.style.display = "flex";
      document.querySelector("#rr-name").focus();
    });
    document.querySelector("#roster-request-close").addEventListener("click", () => {
      rrModal.style.display = "none";
    });
    rrModal.addEventListener("click", (e) => { if (e.target === rrModal) rrModal.style.display = "none"; });
    document.querySelector("#roster-request-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.querySelector("#rr-error");
      errEl.textContent = "";
      const submitBtn = e.target.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "요청 중...";
      try {
        const res = await fetch("/api/roster/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: document.querySelector("#rr-name").value.trim(),
            gender: document.querySelector("#rr-gender").value,
          }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "요청에 실패했습니다.");
        rrModal.style.display = "none";
        document.querySelector("#rr-name").value = "";
        document.querySelector("#rr-gender").value = "";
        alert("추가 요청이 접수되었습니다. 운영자 승인 후 목록에 추가됩니다.");
        loadRoster();
      } catch (error) {
        errEl.textContent = error.message;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "추가 요청하기";
      }
    });

    loadRoster();
 
    for (const city of cities) {
      const option = document.createElement("option");
      option.value = city.name;
      option.textContent = city.name;
      birthPlace.append(option);
    }
    birthPlace.insertAdjacentHTML("afterbegin", '<option value="" disabled selected>태어난 곳 선택</option>');
    if (useDevDefaults) {
      document.querySelector("#marital-status").value = "미혼";
      document.querySelector("#mbti").value = "ENTP";
      document.querySelector("#date").value = "1982-01-21";
      document.querySelector("#time").value = "15:20";
      document.querySelector("#calendar").value = "solar";
      birthPlace.value = "서울특별시";
    }
    birthPlace.addEventListener("change", () => {
      const isCustom = birthPlace.value === "직접 입력";
      customPlaceWrap.classList.toggle("hidden", !isCustom);
      customBirthPlace.required = isCustom;
      if (isCustom) customBirthPlace.focus();
    });
 
    timeUnknown.addEventListener("change", () => {
      timeInput.disabled = timeUnknown.checked;
      timeInput.required = !timeUnknown.checked;
    });

    const ALL_MARITAL = ["미혼", "기혼", "돌싱"];
    let selectedMaritalRange = new Set();
    const maritalRangeWrap = document.querySelector("#marital-range-wrap");
    const maritalRangeBtns = document.querySelector("#marital-range-btns");
    const maritalRangeMyStatus = document.querySelector("#marital-range-my-status");
    const maritalStatusSelect = document.querySelector("#marital-status");

    maritalStatusSelect.addEventListener("change", () => {
      const current = maritalStatusSelect.value;
      selectedMaritalRange.clear();
      if (!current) { maritalRangeWrap.style.display = "none"; return; }
      maritalRangeMyStatus.textContent = current;
      const others = ALL_MARITAL.filter((s) => s !== current);
      maritalRangeBtns.innerHTML = others.map((s) =>
        '<button type="button" class="marital-range-btn" data-value="' + s + '">' + s + '</button>'
      ).join("");
      maritalRangeBtns.querySelectorAll(".marital-range-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = btn.dataset.value;
          if (selectedMaritalRange.has(val)) {
            selectedMaritalRange.delete(val);
            btn.classList.remove("selected");
          } else {
            selectedMaritalRange.add(val);
            btn.classList.add("selected");
          }
        });
      });
      maritalRangeWrap.style.display = "";
    });
 
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorEl.textContent = "";
      if (!rosterSelect.value) {
        errorEl.textContent = "신청자 명단에서 이름을 선택해주세요.";
        rosterCombo.focus();
        openRosterOptions();
        return;
      }
      
      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "분석 리포트 생성 중...";
      startSubmitOracle();

      const data = Object.fromEntries(new FormData(form));
      const payload = {
        rosterParticipantId: data.rosterParticipantId,
        name: data.name,
        date: data.date,
        time: data.time,
        timeUnknown: Boolean(data.timeUnknown),
        calendar: data.calendar,
        birthPlace: data.birthPlace,
        customBirthPlace: data.customBirthPlace,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        matchingMaritalRange: [...selectedMaritalRange],
        mbti: data.mbti,
      };
      try {
        oracleMessage.textContent = "입력 정보를 확인하고 만세력을 계산하는 중...";
        const startResponse = await fetch("/api/manse/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const startBody = await readJsonResponse(startResponse);
        if (!startResponse.ok) throw new Error(startBody.error || "계산에 실패했습니다.");

        oracleMessage.textContent = "Gemini가 긴 사주 리포트를 작성하는 중...";
        const analyzeResponse = await fetch("/api/manse/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysisRequest: startBody.analysisRequest }),
        });
        const body = await readJsonResponse(analyzeResponse);
        if (!analyzeResponse.ok) throw new Error(body.error || "사주 분석에 실패했습니다.");
        if (!body.view?.geminiAnalysis || body.view.geminiAnalysis.status !== "ok") {
          throw new Error("사주 분석 리포트가 아직 완성되지 않았습니다. 잠시 후 다시 신청 버튼을 눌러주세요.");
        }
        
        render(body.view, Boolean(data.testMode));
        transitionStage(stageInput, stageResult);
      } catch (error) {
        errorEl.textContent = error.message;
      } finally {
        stopSubmitOracle();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    function startSubmitOracle() {
      let index = 0;
      submitOracle.classList.remove("hidden");
      oracleMessage.textContent = oracleMessages[index];
      clearInterval(oracleTimer);
      oracleTimer = setInterval(function() {
        index = (index + 1) % oracleMessages.length;
        oracleMessage.textContent = oracleMessages[index];
      }, 3600);
    }

    function stopSubmitOracle() {
      clearInterval(oracleTimer);
      oracleTimer = null;
      submitOracle.classList.add("hidden");
    }

    async function readJsonResponse(response) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) return response.json();
      const text = await response.text();
      const isTimeoutHtml = /<html|timeout|timed out|function invocation failed/i.test(text);
      if (isTimeoutHtml) {
        throw new Error("사주 분석 시간이 길어져 신청이 완료되지 않았습니다. 입력 내용은 유지되니 잠시 후 다시 신청 버튼을 눌러주세요.");
      }
      throw new Error("서버 응답을 확인하지 못했습니다. 입력 내용은 유지되니 다시 신청 버튼을 눌러주세요.");
    }
 
    function render(view, showBirthData) {
      const order = ["hour", "day", "month", "year"];
      let html = '';
      html += '<div class="application-success">이벤트 신청이 완료되었습니다.<span>아래에서 만세력 리포트와 신청 정보를 확인할 수 있습니다.</span></div>';
      html += '<div class="result-head">';
      html += '<div class="profile">';
      html += '  <div class="avatar">' + escapeHtml(view.name.slice(0, 1) || "M") + '</div>';
      html += '  <div>';
      html += '    <div class="name">' + escapeHtml(view.name) + '</div>';
      html += '    <div class="subtitle">' + escapeHtml(view.profileTitle) + (view.mbti ? " · " + escapeHtml(view.mbti) : "") + '</div>';
      html += '  </div>';
      html += '</div>';
      html += '<button type="button" id="btn-save-pdf" class="pdf-btn">PDF로 저장</button>';
      html += '</div>';
      
      html += '<div class="meta" style="' + (showBirthData ? "" : "display:none") + '">';
      html += '  <div class="solar">☀️ 양력 ' + escapeHtml(view.solarText) + '</div>';
      html += '  <div class="lunar">🌙 음력 ' + escapeHtml(view.lunarText) + '</div>';
      html += '  <div class="place">📍 출생지 ' + escapeHtml(view.locationText) + '</div>';
      html += '</div>';
      
      html += '<p class="notice">✨ ' + escapeHtml(view.notice) + '</p>';
      
      html += '<div class="chart-wrap">';
      html += '  <div class="labels">';
      html += '    <div></div>';
      html += '    <div>천간</div>';
      html += '    <div>십성</div>';
      html += '    <div>지지</div>';
      html += '    <div>십성</div>';
      html += '    <div>지장간</div>';
      html += '    <div>12운성</div>';
      html += '    <div>12신살</div>';
      html += '  </div>';
      html += '  <div class="chart">';
      html += '    ' + order.map(function(key) { return column(view.cells[key], key); }).join("");
      html += '  </div>';
      html += '</div>';
      html += analysisCard(view.geminiAnalysis);

      // Footer Actions (Back Button)
      html += '<div class="result-footer-actions">';
      html += '  <button type="button" id="btn-view-applicants" class="action-btn">이벤트 신청자 조회하기</button>';
      html += '</div>';
      
      resultEl.innerHTML = html;

      // Bind Back Button Action
      document.querySelector("#btn-view-applicants").addEventListener("click", () => {
        window.location.href = "/applicants";
      });
      document.querySelector("#btn-save-pdf").addEventListener("click", () => {
        const originalTitle = document.title;
        document.title = pdfTitle(view);
        window.print();
        setTimeout(() => {
          document.title = originalTitle;
        }, 1200);
      });
    }

    async function loadRoster() {
      try {
        const response = await fetch("/api/roster", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "참가자 명단을 불러오지 못했습니다.");
        rosterParticipants = body.participants || [];
        renderRosterOptions();
        if (useDevDefaults) {
          const preferred = rosterParticipants.find((item) => item.displayName === "벤지" && !item.hasSubmitted)
            || rosterParticipants.find((item) => !item.hasSubmitted);
          if (preferred) selectRosterParticipant(preferred);
        }
      } catch (error) {
        rosterCombo.placeholder = "명단 조회 실패";
        rosterNote.textContent = error.message;
      }
    }

    rosterCombo.addEventListener("focus", () => {
      renderRosterOptions(rosterCombo.value);
      openRosterOptions();
    });

    rosterCombo.addEventListener("input", () => {
      rosterSelect.value = "";
      nameInput.value = "";
      genderInput.value = "";
      genderDisplay.value = "";
      rosterNote.textContent = "";
      renderRosterOptions(rosterCombo.value);
      openRosterOptions();
    });

    rosterCombo.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const first = filteredRoster(rosterCombo.value).find((item) => !item.hasSubmitted);
      if (!first) return;
      event.preventDefault();
      selectRosterParticipant(first);
    });

    function renderRosterOptions(query = "") {
      const filtered = filteredRoster(query);
      if (!filtered.length) {
        rosterOptions.innerHTML = '<div class="combo-option disabled">검색 결과가 없습니다.<small>명단 확인 필요</small></div>';
        return;
      }
      rosterOptions.innerHTML = filtered.map((item) => {
        const disabled = item.hasSubmitted ? " disabled" : "";
        const status = item.hasSubmitted ? "신청완료" : item.gender;
        return '<div class="combo-option' + disabled + '" role="option" data-id="' + escapeHtml(item.id) + '">' +
          '<span>' + escapeHtml(item.displayName) + '</span>' +
          '<small>' + escapeHtml(status) + '</small>' +
          '</div>';
      }).join("");
      rosterOptions.querySelectorAll(".combo-option").forEach((option) => {
        option.addEventListener("mousedown", (event) => {
          event.preventDefault();
          const item = rosterParticipants.find((candidate) => candidate.id === option.dataset.id);
          if (!item || item.hasSubmitted) return;
          selectRosterParticipant(item);
        });
      });
    }

    function filteredRoster(query = "") {
      const keyword = String(query || "").trim().toLocaleLowerCase("ko");
      return rosterParticipants.filter((item) => {
        return !keyword || item.displayName.toLocaleLowerCase("ko").includes(keyword);
      }).slice(0, 18);
    }

    function selectRosterParticipant(selected) {
      rosterCombo.value = selected.displayName + " · " + selected.gender;
      rosterSelect.value = selected.id;
      nameInput.value = selected.displayName;
      genderInput.value = selected.gender;
      genderDisplay.value = selected.gender === "남" ? "남성" : "여성";
      rosterNote.textContent = "명단 기준으로 이름과 성별이 자동 입력되었습니다.";
      closeRosterOptions();
    }

    function openRosterOptions() {
      rosterOptions.classList.remove("hidden");
      rosterCombo.setAttribute("aria-expanded", "true");
    }

    function closeRosterOptions() {
      rosterOptions.classList.add("hidden");
      rosterCombo.setAttribute("aria-expanded", "false");
    }

    document.addEventListener("mousedown", (event) => {
      if (event.target === rosterCombo || rosterOptions.contains(event.target)) return;
      closeRosterOptions();
    });

    function pdfTitle(view) {
      const name = sanitizeFilenamePart(view.name || "Moras");
      const mbti = sanitizeFilenamePart(view.mbti || "MBTI");
      return "Moras - " + name + " - " + mbti + " 사주 리포트";
    }

    function sanitizeFilenamePart(value) {
      return String(value || "")
        .replace(/[\\\\/:*?"<>|]/g, "")
        .replace(/\\s+/g, " ")
        .trim()
        .slice(0, 40) || "Moras";
    }
 
    function analysisCard(analysis) {
      if (!analysis || analysis.status !== "ok") {
        return '';
      }
      const keywordsHtml = Array.isArray(analysis.strength_keywords) 
        ? '<div class="keywords-badge-container">' + 
          analysis.strength_keywords.map(function(kw) { return '<span class="keyword-badge"># ' + escapeHtml(kw) + '</span>'; }).join('') + 
          '</div>' 
        : '';
        
      const cautionsHtml = Array.isArray(analysis.cautions)
        ? '<div class="cautions-container">' +
          analysis.cautions.map(function(c) { return '<div class="caution-item">⚠️ ' + escapeHtml(c) + '</div>'; }).join('') +
          '</div>'
        : '';
        
      const coreHtml = Array.isArray(analysis.manse_core)
        ? '<div class="cosmic-card card-core"><h3>만세력 핵심 해석</h3>' +
          analysis.manse_core.map(function(item) {
            return '<div class="core-row"><b>' + escapeHtml(item.label || "해석") + '</b><p>' + escapeHtml(item.text || "") + '</p></div>';
          }).join('') +
          '</div>'
        : '';

      const sections = [
        { group: "A. 자기 이해" },
        { icon: "01", kicker: "SELF", title: "나는 어떤 사람인가", text: analysis.what_person || "고유한 기질을 심층 분석하고 있습니다.", tags: ["자기이해", "기질", "MBTI"] },
        { icon: "02", kicker: "ENERGY", title: "내 감정과 에너지 구조", text: analysis.emotional_energy || "", tags: ["감정리듬", "에너지", "내면"] },
        { icon: "03", kicker: "FLOW", title: "삶의 흐름과 운명", text: analysis.destiny_nature || "선천적으로 품고 태어난 흐름을 짚어보고 있습니다.", tags: ["삶의흐름", "선택", "리듬"] },
        { group: "B. 관계 & 사랑" },
        { icon: "04", kicker: "MATCH", title: "어떤 인연이 어울리는가", text: analysis.best_partner_style || "어울리는 인연의 결을 탐구하고 있습니다.", keywords: true },
        { icon: "05", kicker: "LOVE STYLE", title: "연애 스타일 분석", text: analysis.relationship_style || "", tags: ["표현방식", "거리감", "소통"] },
        { icon: "06", kicker: "LOVE FLOW", title: "연애운의 흐름", text: analysis.love_flow || "", tags: ["끌림", "타이밍", "관계흐름"] },
        { icon: "07", kicker: "SHADOW", title: "관계에서의 그림자", text: analysis.relationship_shadow || "", cautions: true },
      ];

      let html = '';
      html += '<div class="cosmic-tablet-container">';
      if (analysis.report_title || analysis.opening_summary) {
        html += '  <div class="cosmic-card card-report">';
        html += '    <h3>' + escapeHtml(analysis.report_title || "Moras 리포트") + '</h3>';
        html += '    <div class="report-lead">' + escapeHtml(reportLead(analysis)) + '</div>';
        html += '    <p>' + escapeHtml(analysis.opening_summary || "") + '</p>';
        html += '    ' + reportCoverPoints(analysis);
        html += '  </div>';
      }
      html += coreHtml;

      sections.forEach(function(section) {
        if (section.group) {
          html += '<div class="report-section-label">' + escapeHtml(section.group) + '</div>';
          return;
        }
        if (!section.text) return;
        html += reportSectionCard(section, section.keywords ? keywordsHtml : "", section.cautions ? cautionsHtml : "");
      });

      if (analysis.growth_guide || analysis.tone_note) {
        html += '  <div class="cosmic-card analysis-card card-destiny">';
        html += '    <div class="report-card-header">';
        html += '      <span class="report-icon">+</span>';
        html += '      <div><div class="report-kicker">GUIDE</div><div class="report-title">이벤트 활용 가이드</div></div>';
        html += '    </div>';
        html += '    <div class="report-copy">';
        if (analysis.growth_guide) html += '      <p>' + escapeHtml(analysis.growth_guide) + '</p>';
        if (analysis.tone_note) html += '      <div style="margin-top: 16px; font-size: 12.5px; line-height: 1.7; color: #FFE8A3;">' + escapeHtml(analysis.tone_note) + '</div>';
        html += '    </div>';
        html += '  </div>';
      }
      
      html += '</div>';
      return html;
    }

    function reportSectionCard(section, afterHtml, extraHtml) {
      let cardClass = "cosmic-card analysis-card ";
      if (section.kicker === "MATCH" || section.kicker === "LOVE STYLE" || section.kicker === "LOVE FLOW") cardClass += "card-partner";
      else if (section.kicker === "FLOW") cardClass += "card-destiny";
      else cardClass += "card-person";

      let html = '';
      html += '<div class="' + cardClass + '">';
      html += '  <div class="report-card-header">';
      html += '    <span class="report-icon">' + escapeHtml(section.icon) + '</span>';
      html += '    <div><div class="report-kicker">' + escapeHtml(section.kicker) + '</div><div class="report-title">' + escapeHtml(section.title) + '</div></div>';
      html += '  </div>';
      html += '  <div class="report-copy">';
      html += '    <p>' + escapeHtml(section.text) + '</p>';
      html += '    ' + summaryHtml(section.text);
      html += '    ' + (afterHtml || "");
      html += '    ' + tagHtml(section.tags);
      html += '    ' + (extraHtml || "");
      html += '  </div>';
      html += '</div>';
      return html;
    }

    function reportLead(analysis) {
      const title = analysis.report_title || "Moras 리포트";
      const mbtiMatch = title.match(/[IE][NS][TF][JP]/);
      const mbti = mbtiMatch ? mbtiMatch[0] : "MBTI";
      return mbti + "의 심리 리듬과 만세력의 상징을 함께 읽어낸 대표 서사입니다.";
    }

    function reportCoverPoints(analysis) {
      const keywords = Array.isArray(analysis.strength_keywords) ? analysis.strength_keywords.slice(0, 3) : [];
      const points = [
        { label: "SELF", text: summarySentence(analysis.what_person || analysis.opening_summary) },
        { label: "RHYTHM", text: summarySentence(analysis.emotional_energy || analysis.destiny_nature) },
        { label: "MATCH", text: summarySentence(analysis.best_partner_style || analysis.relationship_style) },
      ];
      if (keywords.length) {
        points[1].text = keywords.join(" · ");
      }
      return '<div class="report-cover-grid">' +
        points.map(function(point) {
          return '<div class="report-cover-point"><b>' + escapeHtml(point.label) + '</b><span>' + escapeHtml(point.text) + '</span></div>';
        }).join('') +
        '</div>';
    }

    function summarySentence(text) {
      const sentence = String(text || "")
        .replace(/\\s+/g, " ")
        .split(/(?<=[.!?。])\\s+/)
        .map(function(item) { return item.trim(); })
        .filter(Boolean)[0] || "";
      return sentence.length > 68 ? sentence.slice(0, 68) + "..." : sentence;
    }

    function summaryHtml(text) {
      const lines = summaryLines(text);
      if (!lines.length) return "";
      return '<div class="report-summary"><b class="summary-title">두줄요약</b>' +
        lines.map(function(line) { return '<span>' + escapeHtml(line) + '</span>'; }).join('') +
        '</div>';
    }

    function summaryLines(text) {
      return String(text || "")
        .replace(/\\s+/g, " ")
        .split(/(?<=[.!?。])\\s+/)
        .map(function(item) { return item.trim(); })
        .filter(Boolean)
        .slice(0, 2);
    }

    function tagHtml(tags) {
      if (!Array.isArray(tags) || !tags.length) return "";
      return '<div class="report-tags">' +
        tags.map(function(tag) { return '<span>#' + escapeHtml(tag) + '</span>'; }).join('') +
        '</div>';
    }

    function column(cell, key) {
      const getElementClass = (el) => {
        if (!el) return "";
        if (el.includes("木") || el.includes("목")) return "elem-wood";
        if (el.includes("火") || el.includes("화")) return "elem-fire";
        if (el.includes("土") || el.includes("토")) return "elem-earth";
        if (el.includes("金") || el.includes("금")) return "elem-metal";
        if (el.includes("水") || el.includes("수")) return "elem-water";
        return "";
      };
      
      const getElementSvg = (el) => {
        if (!el) return "";
        if (el.includes("木") || el.includes("목")) {
          return '<svg class="elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C11.5 2 10 5 10 8C10 11 11.5 12 12 12C12.5 12 14 11 14 8C14 5 12.5 2 12 2Z M12 12C9 12 7 14 7 17C7 20 12 22 12 22C12 22 17 20 17 17C17 14 15 12 12 12Z"/></svg>';
        }
        if (el.includes("火") || el.includes("화")) {
          return '<svg class="elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C12 2 17 7 17 11C17 15.5 13.5 18 12 22C10.5 18 7 15.5 7 11C7 7 12 2 12 2Z M12 8C12 8 14.5 11 14.5 13C14.5 15 13 16 12 18C11 16 9.5 15 9.5 13C9.5 11 12 8 12 8Z"/></svg>';
        }
        if (el.includes("土") || el.includes("토")) {
          return '<svg class="elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 18H22L12 2Z M12 6L18.5 16H5.5L12 6Z M12 10L15 15H9L12 10Z"/></svg>';
        }
        if (el.includes("金") || el.includes("금")) {
          return '<svg class="elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L4 12L12 22L20 12L12 2Z M12 6L17 12L12 18L7 12L12 6Z"/></svg>';
        }
        if (el.includes("水") || el.includes("수")) {
          return '<svg class="elem-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12C2 12 5 9 8 12C11 15 13 15 16 12C19 9 22 12 22 12M2 17C2 17 5 14 8 17C11 20 13 20 16 17C19 14 22 17 22 17"/></svg>';
        }
        return "";
      };
      
      const stemClass = getElementClass(cell.stemElement || "");
      const branchClass = getElementClass(cell.branchElement || "");
      
      const stemSvg = getElementSvg(cell.stemElement || "");
      const branchSvg = getElementSvg(cell.branchElement || "");
      
      let html = '';
      html += '<div class="col ' + (key === "day" ? "day" : "") + '">';
      html += '  <div class="slot">' + escapeHtml(cell.label) + '</div>';
      html += '  <div class="slot big ' + stemClass + '">';
      html += '    ' + stemSvg;
      html += '    <div class="stem">' + escapeHtml(cell.stemText) + '</div>';
      html += '    <span class="element">' + (cell.stemElement ? escapeHtml(cell.stemElement) : "") + '</span>';
      html += '  </div>';
      html += '  <div class="slot ten-stem">' + escapeHtml(cell.stemTenGod) + '</div>';
      html += '  <div class="slot big ' + branchClass + '">';
      html += '    ' + branchSvg;
      html += '    <div class="branch">' + escapeHtml(cell.branchText) + '</div>';
      html += '    <span class="element">' + (cell.branchElement ? escapeHtml(cell.branchElement) : "") + '</span>';
      html += '  </div>';
      html += '  <div class="slot ten-branch">' + escapeHtml(cell.branchTenGod) + '</div>';
      html += '  <div class="slot">' + escapeHtml(cell.hiddenStems) + '</div>';
      html += '  <div class="slot">' + escapeHtml(cell.twelveStage) + '</div>';
      html += '  <div class="slot">' + escapeHtml(cell.twelveGod) + '</div>';
      html += '</div>';
      
      return html;
    }
 
    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char]));
    }
  </script>
</body>
</html>`;
}

function shouldUseDevDefaults() {
  if (process.env.NETLIFY || process.env.CONTEXT === "production") return false;
  if (process.env.MORAS_DEV_DEFAULTS === "1") return true;
  if (process.env.MORAS_DEV_DEFAULTS === "0") return false;
  return process.env.NODE_ENV !== "production";
}

module.exports = { page };
