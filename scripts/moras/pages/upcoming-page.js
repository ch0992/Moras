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
  <title>Moras Upcoming Event</title>
  <style>
    :root {
      color-scheme: dark;
      --gold: #f0d18f;
      --soft-gold: #fff0cc;
      --text: #f5ead6;
      --muted: #c9bda8;
      --line: rgba(240,209,143,.36);
      --ink: #050914;
    }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--ink);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }
    main {
      min-height: 100vh;
      min-height: 100svh;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      justify-items: center;
      padding: 16px;
      overflow-x: hidden;
    }
    .poster-stage {
      position: relative;
      width: min(100%, calc((100svh - 32px) * 1));
      aspect-ratio: 1;
      min-height: 0;
      display: grid;
      place-items: center;
      align-self: center;
    }
    .poster {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 22px 80px rgba(0,0,0,.38);
    }
    .countdown {
      position: absolute;
      left: 50%;
      bottom: clamp(10px, 2.1%, 22px);
      transform: translateX(-50%);
      width: min(78%, 860px);
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(5, 9, 20, .78);
      box-shadow: 0 18px 60px rgba(0,0,0,.38);
      backdrop-filter: blur(8px);
      padding: clamp(8px, 1.2vw, 14px);
    }
    .event-date {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 14px;
      margin-bottom: 8px;
      color: var(--soft-gold);
      font-weight: 800;
      font-size: clamp(12px, 1vw, 15px);
    }
    .event-date span {
      color: var(--muted);
      font-size: clamp(10px, .85vw, 12px);
      font-weight: 500;
      text-align: right;
    }
    .time-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
    }
    .time-box {
      min-width: 0;
      min-height: clamp(46px, 5vw, 72px);
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 6px;
      background: rgba(255,255,255,.07);
    }
    .value {
      color: #ffffff;
      font-size: clamp(24px, 3.4vw, 48px);
      font-weight: 900;
      line-height: 1;
      text-shadow: 0 0 22px rgba(126,231,255,.38);
      font-variant-numeric: tabular-nums;
    }
    .label {
      margin-top: 6px;
      color: var(--muted);
      font-size: clamp(9px, .75vw, 11px);
    }
    .open-state {
      display: none;
      color: var(--soft-gold);
      font-size: clamp(24px, 5vw, 42px);
      font-weight: 900;
      text-align: center;
      padding: 18px 0 8px;
    }
    footer {
      margin-top: 12px;
      text-align: center;
      color: rgba(245,234,214,.78);
      font-size: clamp(9px, .75vw, 11px);
      line-height: 1.35;
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
      }
      .poster {
        border-radius: 0;
        object-fit: cover;
      }
      .countdown {
        bottom: max(10px, env(safe-area-inset-bottom));
        width: calc(100% - 20px);
        padding: 10px;
      }
      .event-date {
        display: block;
      }
      .event-date span {
        display: block;
        margin-top: 4px;
        text-align: left;
      }
      .time-grid {
        gap: 7px;
      }
      .time-box {
        min-height: 58px;
      }
      .value {
        font-size: 27px;
      }
      .label {
        font-size: 11px;
      }
    }
    @media (max-width: 420px) {
      main {
        padding: 0;
      }
      .poster-stage {
        width: 100vw;
        height: 100svh;
      }
      .countdown {
        width: calc(100% - 16px);
        padding: 8px;
      }
      .time-box {
        min-height: 50px;
      }
      .value {
        font-size: 22px;
      }
      footer { display: none; }
    }
  </style>
</head>
<body>
  <main>
    <div class="poster-stage">
      <img class="poster" src="${UPCOMING_IMAGE_ROUTE}" alt="Moras Upcoming Event MBTI + 사주 기반 매칭 이벤트">
      <section class="countdown" aria-label="이벤트 카운트다운">
        <div class="event-date">
          <div>2026.05.31 EVENT OPEN</div>
          <span>Auburn / Central 기준 오후 10시 오픈</span>
        </div>
        <div id="time-grid" class="time-grid">
          <div class="time-box"><div><div id="days" class="value">00</div><div class="label">DAYS</div></div></div>
          <div class="time-box"><div><div id="hours" class="value">00</div><div class="label">HOURS</div></div></div>
          <div class="time-box"><div><div id="minutes" class="value">00</div><div class="label">MINUTES</div></div></div>
          <div class="time-box"><div><div id="seconds" class="value">00</div><div class="label">SECONDS</div></div></div>
        </div>
        <div id="open-state" class="open-state">이벤트가 시작되었습니다</div>
        <footer>Countdown to 2026-05-31 10:00 PM Central Time</footer>
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
