/**
 * Public marketing page for Moras /upcoming.
 *
 * Responsibilities:
 * - Render the event poster and Central Time countdown.
 * - Serve presentation-only HTML/CSS/JS for unauthenticated visitors.
 * - Keep DB, auth, API, and business logic out of this file.
 */

const UPCOMING_IMAGE_ROUTE = "/assets/marketing/upcoming-event/moras-upcoming-event-mbti-saju-v1.png";

function upcomingEventPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras Upcoming Event - 천체 별자리 MBTI & 사주 매칭</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@300;400;500;700;900&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #020306;
      --bg-gradient: radial-gradient(circle at 50% 30%, #111A35 0%, #060913 60%, #020306 100%);
      --gold: #D4AF37;
      --gold-gradient: linear-gradient(135deg, #FFE8A3 0%, #C59B3F 50%, #FFE8A3 100%);
      --text: #F8FAFC;
      --muted: #94A3B8;
      --panel: rgba(10, 15, 30, 0.72);
      --line: rgba(255, 255, 255, 0.08);
      --gold-line: rgba(212, 175, 55, 0.25);
    }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg-gradient);
      color: var(--text);
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
      overflow-x: hidden;
      position: relative;
    }
    
    /* 우주 먼지 및 별무리 효과 */
    body::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: 
        radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 150px 80px, rgba(255,255,255,0.9), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 300px 250px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 450px 120px, rgba(212, 175, 55, 0.8), rgba(0,0,0,0)),
        radial-gradient(1px 1px at 700px 380px, #fff, rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 900px 180px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
        radial-gradient(2px 2px at 1150px 290px, rgba(0, 242, 254, 0.6), rgba(0,0,0,0)),
        radial-gradient(1.5px 1.5px at 1300px 420px, rgba(240, 147, 251, 0.6), rgba(0,0,0,0));
      background-size: 1400px 900px;
      opacity: 0.45;
      z-index: -2;
      pointer-events: none;
      animation: starMove 120s linear infinite;
    }
    
    @keyframes starMove {
      from { background-position: 0 0; }
      to { background-position: 1400px 900px; }
    }

    main {
      min-height: 100vh;
      min-height: 100svh;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      justify-items: center;
      padding: 104px 16px 32px;
      overflow-x: hidden;
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
    
    .poster-stage {
      position: relative;
      width: min(100%, calc((100svh - 152px) * 1));
      aspect-ratio: 1;
      min-height: 0;
      display: grid;
      place-items: center;
      align-self: center;
      border-radius: 24px;
      padding: 8px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(212, 175, 55, 0.15) 50%, rgba(255, 255, 255, 0.02) 100%);
      box-shadow: 0 35px 90px rgba(0,0,0,0.65), 
                  inset 0 1px 3px rgba(255,255,255,0.1),
                  0 0 40px rgba(212, 175, 55, 0.05);
      border: 1px solid rgba(212, 175, 55, 0.2);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .poster-stage:hover {
      border-color: rgba(212, 175, 55, 0.4);
      box-shadow: 0 40px 100px rgba(0,0,0,0.75), 
                  inset 0 1px 3px rgba(255,255,255,0.15),
                  0 0 60px rgba(212, 175, 55, 0.12);
      transform: translateY(-4px);
    }
    
    .poster {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    
    /* 프리미엄 골드 글래스 카운트다운 */
    .countdown {
      position: absolute;
      left: 50%;
      bottom: clamp(14px, 2.5%, 28px);
      transform: translateX(-50%);
      width: min(84%, 860px);
      border: 1px solid var(--gold-line);
      border-radius: 16px;
      background: var(--panel);
      box-shadow: 0 25px 70px rgba(0,0,0,0.55), 
                  inset 0 1px 1px rgba(255, 255, 255, 0.08),
                  0 0 25px rgba(212, 175, 55, 0.1);
      backdrop-filter: blur(20px) saturate(120%);
      -webkit-backdrop-filter: blur(20px) saturate(120%);
      padding: clamp(12px, 1.5vw, 20px);
      transition: all 0.3s ease;
    }
    
    .event-date {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
      border-bottom: 1px dashed rgba(212, 175, 55, 0.15);
      padding-bottom: 8px;
    }
    
    .event-date .title {
      font-family: 'Cinzel', serif;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
      font-size: clamp(13px, 1.2vw, 17px);
      letter-spacing: 0.08em;
      text-shadow: 0 0 10px rgba(212, 175, 55, 0.15);
    }
    
    .event-date span {
      color: var(--muted);
      font-size: clamp(10px, .9vw, 13px);
      font-weight: 500;
      text-align: right;
      letter-spacing: -0.01em;
    }
    
    .time-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    
    .time-box {
      min-width: 0;
      min-height: clamp(54px, 5.5vw, 84px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 10px;
      background: rgba(255,255,255,0.02);
      box-shadow: inset 0 0 10px rgba(255,255,255,0.01);
      transition: border-color 0.3s ease;
    }
    
    .time-box:hover {
      border-color: rgba(212, 175, 55, 0.15);
    }
    
    .value {
      font-family: 'Outfit', sans-serif;
      color: #ffffff;
      font-size: clamp(28px, 3.8vw, 54px);
      font-weight: 900;
      line-height: 1;
      background: linear-gradient(180deg, #FFFFFF 30%, #E2E8F0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(212,175,55,0.25);
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.03em;
    }
    
    .label {
      margin-top: 6px;
      color: var(--muted);
      font-size: clamp(8px, .75vw, 11px);
      font-weight: 700;
      letter-spacing: 0.1em;
    }
    
    .open-state {
      display: none;
      font-family: 'Cinzel', serif;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: clamp(24px, 4.5vw, 38px);
      font-weight: 800;
      text-align: center;
      padding: 16px 0 8px;
      text-shadow: 0 0 20px rgba(212, 175, 55, 0.35);
      letter-spacing: 0.05em;
    }
    
    footer {
      margin-top: 14px;
      text-align: center;
      color: rgba(245,234,214,.55);
      font-size: clamp(8px, .7vw, 11px);
      letter-spacing: 0.02em;
    }
    
    @media (max-width: 720px) {
      main {
        padding: 0;
        align-items: center;
      }
      .poster-stage {
        width: 100vw;
        height: 100svh;
        aspect-ratio: auto;
        border-radius: 0;
        border: none;
        padding: 0;
        box-shadow: none;
      }
      .poster-stage:hover {
        transform: none;
        box-shadow: none;
      }
      .poster {
        border-radius: 0;
        object-fit: cover;
      }
      .countdown {
        bottom: max(16px, env(safe-area-inset-bottom));
        width: calc(100% - 24px);
        padding: 14px 12px;
        border-radius: 14px;
      }
      .event-date {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      .event-date span {
        text-align: left;
      }
      .time-box {
        min-height: 64px;
      }
      .value {
        font-size: 32px;
      }
    }
  </style>
</head>
<body>
  <a class="global-home-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
  <main>
    <div class="poster-stage">
      <img class="poster" src="${UPCOMING_IMAGE_ROUTE}" alt="Moras Upcoming Event MBTI + 사주 기반 매칭 이벤트">
      <section class="countdown" aria-label="이벤트 카운트다운">
        <div class="event-date">
          <div class="title">2026.05.31 EVENT OPEN</div>
          <span>뉴욕 (Eastern) 기준 오후 11시 오픈</span>
        </div>
        <div id="time-grid" class="time-grid">
          <div class="time-box">
            <div id="days" class="value">00</div>
            <div class="label">DAYS</div>
          </div>
          <div class="time-box">
            <div id="hours" class="value">00</div>
            <div class="label">HOURS</div>
          </div>
          <div class="time-box">
            <div id="minutes" class="value">00</div>
            <div class="label">MINUTES</div>
          </div>
          <div class="time-box">
            <div id="seconds" class="value">00</div>
            <div class="label">SECONDS</div>
          </div>
        </div>
        <div id="open-state" class="open-state">이벤트가 시작되었습니다</div>
        <footer>Countdown to 2026-05-31 11:00 PM Eastern Time</footer>
      </section>
    </div>
  </main>
  <script>
    const target = new Date("2026-06-01T03:00:00Z").getTime();
    const fields = {
      days: document.querySelector("#days"),
      hours: document.querySelector("#hours"),
      minutes: document.querySelector("#minutes"),
      seconds: document.querySelector("#seconds"),
    };
    const grid = document.querySelector("#time-grid");
    const openState = document.querySelector("#open-state");

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function tick() {
      const remaining = target - Date.now();
      if (remaining <= 0) {
        grid.style.display = "none";
        openState.style.display = "block";
        return;
      }
      const totalSeconds = Math.floor(remaining / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      fields.days.textContent = pad(days);
      fields.hours.textContent = pad(hours);
      fields.minutes.textContent = pad(minutes);
      fields.seconds.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  </script>
</body>
</html>`;
}

module.exports = { upcomingEventPage, UPCOMING_IMAGE_ROUTE };
