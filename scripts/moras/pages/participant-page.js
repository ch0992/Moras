/**
 * Participant input page for Moras.
 *
 * Responsibilities:
 * - Render the public submission form and result view.
 * - Keep calculation, storage, auth, and API logic out of this file.
 */

const { CITIES } = require("../manse-service");

function page() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 만세력 테스트</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #211c0e;
      --panel: #151b1b;
      --panel-2: #111616;
      --line: #3d4648;
      --text: #d6d0c2;
      --muted: #a79f91;
      --gold: #e0a84e;
      --blue: #7fc2da;
      --red: #c05d54;
      --green: #70b26b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: radial-gradient(circle at 18% 0%, #30270f 0, #211c0e 34%, #17140b 100%);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }
    main {
      width: min(1120px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 28px 0 48px;
      display: grid;
      grid-template-columns: 330px minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }
    .control, .result {
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(17, 22, 22, .82);
      border-radius: 8px;
      box-shadow: 0 18px 50px rgba(0,0,0,.24);
    }
    .control { padding: 18px; position: sticky; top: 18px; }
    h1 {
      margin: 0 0 14px;
      font-size: 20px;
      line-height: 1.25;
      color: #f4ead4;
    }
    label {
      display: block;
      margin: 12px 0 6px;
      font-size: 12px;
      color: var(--muted);
    }
    input, select {
      width: 100%;
      height: 38px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #0e1414;
      color: var(--text);
      padding: 0 10px;
      font: inherit;
    }
    .hidden { display: none; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .check {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      color: var(--text);
      font-size: 13px;
    }
    .check input { width: 16px; height: 16px; }
    button {
      width: 100%;
      height: 42px;
      margin-top: 16px;
      border: 0;
      border-radius: 6px;
      background: #d49a45;
      color: #17120a;
      font-weight: 800;
      cursor: pointer;
    }
    .hint {
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }
    .secondary-link {
      display: inline-flex;
      margin-top: 12px;
      color: #e8c174;
      font-size: 13px;
      text-decoration: none;
    }
    .result {
      padding: 26px 28px 30px;
      min-width: 0;
    }
    .profile {
      display: grid;
      grid-template-columns: 56px minmax(0, 1fr);
      gap: 14px;
      align-items: center;
      margin-bottom: 14px;
    }
    .avatar {
      width: 56px;
      height: 56px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #e9f6f7;
      color: #2d777d;
      border: 3px solid #fcf6e8;
      font-size: 23px;
      font-weight: 900;
    }
    .name {
      font-size: 25px;
      font-weight: 900;
      color: #f1e8d8;
      line-height: 1.1;
    }
    .subtitle {
      margin-top: 4px;
      color: #efe4cf;
      font-size: 15px;
    }
    .meta {
      margin: 11px 0 18px;
      display: grid;
      gap: 4px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.35;
    }
    .meta .solar { color: #c66b62; }
    .meta .lunar { color: #6aa9ce; }
    .meta .place { color: #f0d18f; }
    .notice {
      margin: 0 0 18px;
      padding: 10px 12px;
      border: 1px solid rgba(224,168,78,.26);
      border-radius: 6px;
      background: rgba(224,168,78,.08);
      color: #f1d7a6;
      font-size: 13px;
    }
    .analysis {
      margin: 0 0 18px;
      padding: 12px;
      border: 1px solid rgba(127,194,218,.24);
      border-radius: 6px;
      background: rgba(127,194,218,.07);
      color: #d6edf4;
      font-size: 13px;
      line-height: 1.55;
    }
    .analysis strong {
      display: block;
      margin-bottom: 6px;
      color: #f0ddba;
    }
    .chart-wrap {
      display: grid;
      grid-template-columns: 54px minmax(560px, 1fr);
      align-items: end;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 2px;
      -webkit-overflow-scrolling: touch;
    }
    .labels {
      display: grid;
      grid-template-rows: 26px 60px 24px 64px 24px 24px 24px 24px;
      color: var(--muted);
      font-size: 13px;
      align-items: center;
    }
    .chart {
      display: grid;
      grid-template-columns: repeat(4, minmax(124px, 1fr));
      border: 1px solid #46555a;
      border-radius: 6px;
      overflow: hidden;
      background: var(--panel);
      min-width: 560px;
    }
    .col {
      display: grid;
      grid-template-rows: 26px 60px 24px 64px 24px 24px 24px 24px;
      border-left: 1px solid var(--line);
    }
    .col:first-child { border-left: 0; }
    .slot {
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid var(--line);
      color: #c9c2b4;
      font-size: 13px;
      white-space: nowrap;
    }
    .slot:first-child {
      border-top: 0;
      background: var(--bg);
      color: #d8ccb7;
      font-size: 12px;
    }
    .big {
      position: relative;
      flex-direction: column;
      gap: 2px;
      background: var(--panel-2);
    }
    .stem {
      color: #c6bfb3;
      font-size: 28px;
      font-weight: 900;
      line-height: 1;
    }
    .branch {
      color: var(--gold);
      font-size: 30px;
      font-weight: 900;
      line-height: 1;
    }
    .element {
      position: absolute;
      right: 8px;
      bottom: 7px;
      font-size: 11px;
      color: #d7c48e;
      font-weight: 800;
    }
    .day .stem, .day .ten-stem { color: var(--blue); }
    .day .branch, .day .ten-branch { color: var(--gold); }
    .empty {
      min-height: 420px;
      display: grid;
      place-items: center;
      color: var(--muted);
      text-align: center;
      line-height: 1.6;
    }
    .error {
      margin-top: 12px;
      color: #ffb4a8;
      font-size: 13px;
      min-height: 18px;
    }
    @media (max-width: 860px) {
      main {
        width: min(100vw - 20px, 560px);
        grid-template-columns: 1fr;
        gap: 14px;
        padding: 10px 0 28px;
      }
      .control { position: static; }
      .result { padding: 20px 14px 24px; }
    }
    @media (max-width: 560px) {
      body {
        background: #211c0e;
      }
      main {
        width: 100%;
        padding: 0 0 24px;
      }
      .control, .result {
        border-left: 0;
        border-right: 0;
        border-radius: 0;
        box-shadow: none;
      }
      .control {
        padding: 16px;
      }
      h1 {
        font-size: 19px;
      }
      .row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      input, select, button {
        height: 44px;
        font-size: 16px;
      }
      .check {
        min-height: 34px;
      }
      .result {
        padding: 18px 10px 22px;
      }
      .profile {
        grid-template-columns: 48px minmax(0, 1fr);
        gap: 11px;
        margin: 0 6px 12px;
      }
      .avatar {
        width: 48px;
        height: 48px;
        font-size: 20px;
      }
      .name {
        font-size: 23px;
      }
      .subtitle {
        font-size: 14px;
      }
      .meta {
        margin: 10px 6px 14px;
        font-size: 12px;
      }
      .notice {
        margin: 0 6px 14px;
        font-size: 12px;
        line-height: 1.45;
      }
      .chart-wrap {
        grid-template-columns: 46px minmax(420px, 1fr);
        gap: 6px;
        padding: 0 0 6px;
      }
      .labels {
        grid-template-rows: 24px 54px 23px 58px 23px 23px 23px 23px;
        font-size: 12px;
      }
      .chart {
        min-width: 420px;
        grid-template-columns: repeat(4, minmax(105px, 1fr));
      }
      .col {
        grid-template-rows: 24px 54px 23px 58px 23px 23px 23px 23px;
      }
      .slot {
        font-size: 12px;
      }
      .stem {
        font-size: 24px;
      }
      .branch {
        font-size: 26px;
      }
      .element {
        right: 6px;
        bottom: 5px;
        font-size: 10px;
      }
      .empty {
        min-height: 260px;
      }
    }
    @media (max-width: 380px) {
      .chart-wrap {
        grid-template-columns: 42px minmax(392px, 1fr);
      }
      .chart {
        min-width: 392px;
        grid-template-columns: repeat(4, 98px);
      }
      .stem {
        font-size: 22px;
      }
      .branch {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="control">
      <h1>Moras 만세력 테스트</h1>
      <form id="manse-form">
        <label for="name">이름</label>
        <input id="name" name="name" autocomplete="name">
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
        <label for="calendar">달력</label>
        <select id="calendar" name="calendar">
          <option value="solar" selected>양력</option>
          <option value="lunar">음력</option>
        </select>
        <label for="birth-place">태어난 곳</label>
        <select id="birth-place" name="birthPlace"></select>
        <div id="custom-place-wrap" class="hidden">
          <label for="custom-birth-place">도시 직접 입력</label>
          <input id="custom-birth-place" name="customBirthPlace" placeholder="예: 시카고">
        </div>
        <label class="check">
          <input id="test-mode" name="testMode" type="checkbox" checked>
          테스트 모드에서 생년월일 표시
        </label>
        <button type="submit">만세력 조회</button>
        <p class="hint">생년월일시와 출생지는 공개 화면이나 결과 페이지에 노출되지 않으며, 운영자 확인을 위해 관리자 화면에서만 조회됩니다. 매칭에는 MBTI와 계산된 만세력 결과를 사용합니다.</p>
        <a class="secondary-link" href="/admin">관리자 페이지 열기</a>
        <div id="error" class="error"></div>
      </form>
    </section>
    <section id="result" class="result">
      <div class="empty">생년월일시와 태어난 곳을 입력하면<br>포스텔러 스타일 만세력 카드가 표시됩니다.</div>
    </section>
  </main>
  <script>
    const cities = ${JSON.stringify(CITIES)};
    const form = document.querySelector("#manse-form");
    const resultEl = document.querySelector("#result");
    const errorEl = document.querySelector("#error");
    const birthPlace = document.querySelector("#birth-place");
    const customPlaceWrap = document.querySelector("#custom-place-wrap");
    const customBirthPlace = document.querySelector("#custom-birth-place");
    const timeInput = document.querySelector("#time");
    const timeUnknown = document.querySelector("#time-unknown");

    for (const city of cities) {
      const option = document.createElement("option");
      option.value = city.name;
      option.textContent = city.name;
      birthPlace.append(option);
    }
    birthPlace.value = "서울특별시";
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

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorEl.textContent = "";
      const data = Object.fromEntries(new FormData(form));
      const payload = {
        name: data.name,
        date: data.date,
        time: data.time,
        timeUnknown: Boolean(data.timeUnknown),
        calendar: data.calendar,
        birthPlace: data.birthPlace,
        customBirthPlace: data.customBirthPlace,
      };
      try {
        const response = await fetch("/api/manse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "계산에 실패했습니다.");
        render(body.view, Boolean(data.testMode));
      } catch (error) {
        errorEl.textContent = error.message;
      }
    });

    function render(view, showBirthData) {
      const order = ["hour", "day", "month", "year"];
      resultEl.innerHTML = \`
        <div class="profile">
          <div class="avatar">\${escapeHtml(view.name.slice(0, 1) || "M")}</div>
          <div>
            <div class="name">\${escapeHtml(view.name)}</div>
            <div class="subtitle">\${escapeHtml(view.profileTitle)}\${view.mbti ? " · " + escapeHtml(view.mbti) : ""}</div>
          </div>
        </div>
        <div class="meta" style="\${showBirthData ? "" : "display:none"}">
          <div class="solar">양 \${escapeHtml(view.solarText)}</div>
          <div class="lunar">음 \${escapeHtml(view.lunarText)}</div>
          <div class="place">양 \${escapeHtml(view.solarText)} \${escapeHtml(view.locationText)}</div>
        </div>
        <p class="notice">\${escapeHtml(view.notice)}</p>
        \${analysisCard(view.geminiAnalysis)}
        <div class="chart-wrap">
          <div class="labels">
            <div></div>
            <div>천간</div>
            <div>십성</div>
            <div>지지</div>
            <div>십성</div>
            <div>지장간</div>
            <div>12운성</div>
            <div>12신살</div>
          </div>
          <div class="chart">
            \${order.map((key) => column(view.cells[key], key)).join("")}
          </div>
        </div>
      \`;
    }

    function analysisCard(analysis) {
      if (!analysis || analysis.status !== "ok") return "";
      const keywords = Array.isArray(analysis.strength_keywords) ? analysis.strength_keywords.join(", ") : "";
      const cautions = Array.isArray(analysis.cautions) ? analysis.cautions.join(" / ") : "";
      return \`
        <div class="analysis">
          <strong>Gemini 사주 분석</strong>
          <div>\${escapeHtml(analysis.analysis_summary || "")}</div>
          \${keywords ? '<div>키워드: ' + escapeHtml(keywords) + '</div>' : ""}
          \${analysis.relationship_style ? '<div>관계 스타일: ' + escapeHtml(analysis.relationship_style) + '</div>' : ""}
          \${cautions ? '<div>참고: ' + escapeHtml(cautions) + '</div>' : ""}
        </div>
      \`;
    }

    function column(cell, key) {
      return \`
        <div class="col \${key === "day" ? "day" : ""}">
          <div class="slot">\${escapeHtml(cell.label)}</div>
          <div class="slot big">
            <div class="stem">\${escapeHtml(cell.stemText)}</div>
            <span class="element">\${cell.stemElement ? "-" + escapeHtml(cell.stemElement) : ""}</span>
          </div>
          <div class="slot ten-stem">\${escapeHtml(cell.stemTenGod)}</div>
          <div class="slot big">
            <div class="branch">\${escapeHtml(cell.branchText)}</div>
            <span class="element">\${cell.branchElement ? "+" + escapeHtml(cell.branchElement) : ""}</span>
          </div>
          <div class="slot ten-branch">\${escapeHtml(cell.branchTenGod)}</div>
          <div class="slot">\${escapeHtml(cell.hiddenStems)}</div>
          <div class="slot">\${escapeHtml(cell.twelveStage)}</div>
          <div class="slot">\${escapeHtml(cell.twelveGod)}</div>
        </div>
      \`;
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

module.exports = { page };
