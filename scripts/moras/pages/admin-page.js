/**
 * Admin HTML pages for Moras.
 *
 * Responsibilities:
 * - Render admin login and submissions management HTML.
 * - Keep auth decisions, storage access, and API logic out of this file.
 */

function adminLoginPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 관리자 로그인</title>
  <style>
    :root { color-scheme: dark; --bg:#17140b; --panel:#111616; --line:#3d4648; --text:#d6d0c2; --muted:#a79f91; --gold:#e0a84e; }
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; display:grid; place-items:center; background:var(--bg); color:var(--text); font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    main { width:min(360px, calc(100vw - 32px)); padding:22px; border:1px solid var(--line); border-radius:8px; background:var(--panel); }
    h1 { margin:0 0 16px; color:#f4ead4; font-size:22px; }
    label { display:block; margin:12px 0 6px; color:var(--muted); font-size:12px; }
    input { width:100%; height:42px; border:1px solid var(--line); border-radius:6px; background:#0e1414; color:var(--text); padding:0 10px; font:inherit; }
    button { width:100%; height:42px; margin-top:14px; border:0; border-radius:6px; background:var(--gold); color:#17120a; font-weight:800; cursor:pointer; }
    .check { display:flex; align-items:center; gap:8px; min-height:34px; margin-top:12px; color:var(--text); font-size:13px; }
    .check input { width:16px; height:16px; }
    .error { min-height:18px; margin-top:12px; color:#ffb4a8; font-size:13px; }
    .hint { color:var(--muted); font-size:12px; line-height:1.45; }
  </style>
</head>
<body>
  <main>
    <h1>관리자 로그인</h1>
    <form id="login-form">
      <label for="admin-id">아이디</label>
      <input id="admin-id" name="adminId" autocomplete="username" required>
      <label for="admin-password">패스워드</label>
      <input id="admin-password" name="adminPassword" type="password" autocomplete="current-password" required>
      <label class="check">
        <input id="save-credentials" type="checkbox" checked>
        아이디 패스워드 저장하기
      </label>
      <button type="submit">로그인</button>
      <div id="error" class="error"></div>
    </form>
  </main>
  <script>
    const form = document.querySelector("#login-form");
    const errorEl = document.querySelector("#error");
    const saved = JSON.parse(localStorage.getItem("morasAdminCredentials") || "null");
    if (saved) {
      form.adminId.value = saved.adminId || "";
      form.adminPassword.value = saved.adminPassword || "";
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorEl.textContent = "";
      const payload = Object.fromEntries(new FormData(form));
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) {
        errorEl.textContent = body.error || "로그인 실패";
        return;
      }
      if (document.querySelector("#save-credentials").checked) {
        localStorage.setItem("morasAdminCredentials", JSON.stringify({
          adminId: form.adminId.value,
          adminPassword: form.adminPassword.value,
        }));
      } else {
        localStorage.removeItem("morasAdminCredentials");
      }
      location.href = "/admin";
    });
  </script>
</body>
</html>`;
}

function adminPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 관리자</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #17140b;
      --panel: #111616;
      --line: #3d4648;
      --text: #d6d0c2;
      --muted: #a79f91;
      --gold: #e0a84e;
      --red: #d5756d;
      --blue: #7fc2da;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }
    main {
      width: min(1440px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 28px 0 44px;
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 18px;
    }
    h1 {
      margin: 0;
      color: #f4ead4;
      font-size: 25px;
    }
    a {
      color: var(--gold);
      text-decoration: none;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      color: var(--muted);
      font-size: 13px;
    }
    button {
      height: 36px;
      border: 0;
      border-radius: 6px;
      background: var(--gold);
      color: #17120a;
      font-weight: 800;
      padding: 0 14px;
      cursor: pointer;
    }
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
    }
    table {
      width: 100%;
      min-width: 980px;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
      font-size: 13px;
      white-space: nowrap;
    }
    th {
      color: #f0ddba;
      font-size: 12px;
      background: #1d1a0d;
    }
    tr:last-child td { border-bottom: 0; }
    .muted { color: var(--muted); }
    .null { color: var(--muted); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .pill {
      display: inline-flex;
      border: 1px solid rgba(127,194,218,.35);
      border-radius: 999px;
      color: var(--blue);
      padding: 2px 8px;
      font-weight: 800;
    }
    details {
      white-space: normal;
    }
    summary {
      color: var(--gold);
      cursor: pointer;
    }
    pre {
      max-width: min(980px, 100%);
      max-height: 360px;
      overflow: auto;
      padding: 12px;
      border-radius: 6px;
      background: #0c1111;
      border: 1px solid var(--line);
      color: #dcd5c8;
      white-space: pre-wrap;
      font-size: 12px;
      line-height: 1.45;
    }
    .analysis-box {
      max-width: min(980px, 100%);
      margin: 12px 0;
      padding: 12px;
      border: 1px solid rgba(224,168,78,.24);
      border-radius: 6px;
      background: rgba(224,168,78,.07);
      color: #ead8b8;
      font-size: 13px;
      line-height: 1.55;
      white-space: normal;
    }
    .analysis-box strong {
      display: block;
      margin-bottom: 6px;
      color: #f0ddba;
    }
    .admin-chart {
      margin: 12px 0;
      overflow-x: auto;
    }
    .detail-row > td {
      padding: 0;
      background: #0f1515;
    }
    .detail-panel {
      padding: 14px 18px 18px;
      border-top: 1px solid var(--line);
    }
    .detail-panel details {
      margin-top: 12px;
    }
    .detail-toggle {
      height: 28px;
      background: transparent;
      color: var(--gold);
      padding: 0;
      font-size: 13px;
    }
    .mini-chart {
      display: grid;
      grid-template-columns: 66px repeat(4, minmax(150px, 1fr));
      width: min(980px, 100%);
      min-width: 720px;
      border: 1px solid var(--line);
      border-radius: 6px;
      overflow: hidden;
      background: #101616;
    }
    .mini-cell {
      min-height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1px solid var(--line);
      border-top: 1px solid var(--line);
      padding: 4px 6px;
      color: var(--text);
      font-size: 12px;
      white-space: nowrap;
    }
    .mini-label {
      border-left: 0;
      color: var(--muted);
      background: #171a16;
    }
    .mini-head {
      border-top: 0;
      background: #1d1a0d;
      color: #f0ddba;
      font-weight: 800;
    }
    .mini-big {
      min-height: 52px;
      font-size: 22px;
      font-weight: 900;
    }
    .mini-branch {
      color: var(--gold);
    }
    .mini-day {
      color: var(--blue);
    }
    @media (max-width: 640px) {
      main {
        width: 100%;
        padding: 18px 0 32px;
      }
      header, .toolbar {
        margin-left: 14px;
        margin-right: 14px;
      }
      header {
        display: block;
      }
      h1 {
        margin-bottom: 8px;
        font-size: 22px;
      }
      .table-wrap {
        border-left: 0;
        border-right: 0;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>Moras 관리자</h1>
        <div class="muted">Supabase 저장 데이터 기반 관리자 조회 화면</div>
      </div>
      <div>
        <a href="/">입력 화면</a>
        <button id="logout" type="button">로그아웃</button>
      </div>
    </header>
    <div class="toolbar">
      <div id="count">불러오는 중</div>
      <button id="refresh" type="button">새로고침</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>제출</th>
            <th>이름</th>
            <th>MBTI</th>
            <th>생년월일시</th>
            <th>달력</th>
            <th>출생지</th>
            <th>사주</th>
            <th>관리자 상세</th>
          </tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
    </div>
  </main>
  <script>
    const rows = document.querySelector("#rows");
    const count = document.querySelector("#count");
    document.querySelector("#refresh").addEventListener("click", load);
    document.querySelector("#logout").addEventListener("click", async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      location.href = "/admin";
    });
    load();

    async function load() {
      rows.innerHTML = "";
      count.textContent = "불러오는 중";
      const response = await fetch("/api/admin/submissions", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) {
        rows.innerHTML = '<tr><td colspan="8">조회 실패</td></tr>';
        count.textContent = body.error || "조회 실패";
        return;
      }
      count.textContent = body.submissions.length + "건";
      rows.innerHTML = body.submissions.map(row).join("") || '<tr><td colspan="8" class="muted">아직 제출된 데이터가 없습니다.</td></tr>';
      document.querySelectorAll(".detail-toggle").forEach((button) => {
        button.addEventListener("click", () => {
          const detailRow = document.getElementById(button.dataset.target);
          const isHidden = detailRow.hidden;
          detailRow.hidden = !isHidden;
          button.textContent = isHidden ? "만세력 닫기" : "만세력 보기";
        });
      });
    }

    function row(item, index) {
      const time = item.birthTimeUnknown ? "시간모름" : item.birthTime;
      const saju = item.manse?.saju || {};
      const detailId = "detail-" + index;
      return \`
        <tr>
          <td>\${escapeHtml(formatDateTime(item.submittedAt))}</td>
          <td>\${nullableCell(item.displayName)}</td>
          <td>\${nullableCell(item.mbti, true)}</td>
          <td>\${nullableCell(item.birthDate)} \${escapeHtml(time)}</td>
          <td>\${nullableCell(item.calendarType === "lunar" ? "음력" : "양력")}</td>
          <td>\${nullableCell(item.birthPlace)}</td>
          <td>\${escapeHtml([saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar || "시간모름"].filter(Boolean).join(" / "))}</td>
          <td>
            <button class="detail-toggle" type="button" data-target="\${detailId}">만세력 보기</button>
          </td>
        </tr>
        <tr id="\${detailId}" class="detail-row" hidden>
          <td colspan="8">
            <div class="detail-panel">
              \${manseChart(item)}
              \${analysisBox(item.geminiAnalysis)}
              <details>
                <summary>JSON 상세</summary>
                <pre>\${escapeHtml(JSON.stringify(item, null, 2))}</pre>
              </details>
            </div>
          </td>
        </tr>
      \`;
    }

    function manseChart(item) {
      const manse = item.manse || {};
      const pillars = manse.pillars || {};
      const derived = manse.derived?.byPillar || {};
      const columns = [
        ["hour", "생시"],
        ["day", "생일"],
        ["month", "생월"],
        ["year", "생년"],
      ];
      const rows = [
        ["천간", (pillar, detail, key) => pillar ? big(pillar.stem.hangul + pillar.stem.hanja, key === "day") : "시간모름"],
        ["십성", (pillar, detail) => detail?.stemTenGod || "X"],
        ["지지", (pillar, detail, key) => pillar ? big(pillar.branch.hangul + pillar.branch.hanja, key === "day", true) : "시간모름"],
        ["십성", (pillar, detail) => detail?.branchTenGod || "X"],
        ["지장간", (pillar, detail) => detail?.hiddenStems || "X"],
        ["12운성", (pillar, detail) => detail?.twelveStage || "X"],
        ["12신살", (pillar, detail) => detail?.twelveGodDisplay || detail?.twelveGod || "X"],
      ];

      return \`
        <div class="admin-chart">
          <div class="mini-chart">
            <div class="mini-cell mini-label mini-head"></div>
            \${columns.map(([, label]) => '<div class="mini-cell mini-head">' + escapeHtml(label) + '</div>').join("")}
            \${rows.map(([label, value]) => {
              return '<div class="mini-cell mini-label">' + escapeHtml(label) + '</div>' +
                columns.map(([key]) => {
                  const pillar = pillars[key];
                  const detail = derived[key] || {};
                  return '<div class="mini-cell">' + value(pillar, detail, key) + '</div>';
                }).join("");
            }).join("")}
          </div>
        </div>
      \`;
    }

    function analysisBox(analysis) {
      if (!analysis || analysis.status !== "ok") return "";
      const keywords = Array.isArray(analysis.strength_keywords) ? analysis.strength_keywords.join(", ") : "";
      const cautions = Array.isArray(analysis.cautions) ? analysis.cautions.join(" / ") : "";
      return \`
        <div class="analysis-box">
          <strong>Gemini 사주 분석</strong>
          <div>\${escapeHtml(analysis.analysis_summary || "")}</div>
          \${keywords ? '<div>키워드: ' + escapeHtml(keywords) + '</div>' : ""}
          \${analysis.relationship_style ? '<div>관계 스타일: ' + escapeHtml(analysis.relationship_style) + '</div>' : ""}
          \${cautions ? '<div>참고: ' + escapeHtml(cautions) + '</div>' : ""}
        </div>
      \`;
    }

    function big(value, isDay = false, isBranch = false) {
      const cls = ["mini-big"];
      if (isDay) cls.push("mini-day");
      if (isBranch) cls.push("mini-branch");
      return '<span class="' + cls.join(" ") + '">' + escapeHtml(value) + '</span>';
    }

    function nullableCell(value, pill = false) {
      if (value === null || value === undefined || value === "") return '<span class="null">null</span>';
      return pill ? '<span class="pill">' + escapeHtml(value) + '</span>' : escapeHtml(value);
    }

    function formatDateTime(value) {
      if (!value) return "";
      return new Date(value).toLocaleString("ko-KR");
    }

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
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

module.exports = { adminLoginPage, adminPage };
