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
  <title>Moras - 관리자 로그인</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #060913;
      --bg-gradient: radial-gradient(circle at 50% 50%, #111A35 0%, #060913 60%, #020306 100%);
      --panel: rgba(10, 15, 30, 0.72);
      --line: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --muted: #94A3B8;
      --gold: #D4AF37;
      --gold-gradient: linear-gradient(135deg, #FFE8A3 0%, #C59B3F 50%, #FFE8A3 100%);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: var(--bg-gradient);
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      overflow: hidden;
      position: relative;
    }
    body::before {
      content: '';
      position: absolute;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.06) 0%, transparent 70%);
      top: 10%; left: 10%;
      z-index: -1;
    }
    body::after {
      content: '';
      position: absolute;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.06) 0%, transparent 70%);
      bottom: 10%; right: 10%;
      z-index: -1;
    }
    main {
      width: min(400px, calc(100vw - 32px));
      padding: 36px 32px;
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 24px;
      background: var(--panel);
      backdrop-filter: blur(20px) saturate(120%);
      -webkit-backdrop-filter: blur(20px) saturate(120%);
      box-shadow: 0 35px 80px rgba(0, 0, 0, 0.6), 
                  inset 0 1px 1px rgba(255, 255, 255, 0.08),
                  0 0 20px rgba(197, 155, 63, 0.05);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
    main:hover {
      border-color: rgba(212, 175, 55, 0.35);
      box-shadow: 0 40px 90px rgba(0, 0, 0, 0.7), 
                  inset 0 1px 1px rgba(255, 255, 255, 0.12),
                  0 0 30px rgba(197, 155, 63, 0.1);
    }
    h1 {
      margin: 0 0 24px;
      font-family: 'Cinzel', serif;
      font-weight: 800;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 26px;
      text-align: center;
      letter-spacing: 0.08em;
      text-shadow: 0 0 12px rgba(197, 155, 63, 0.35);
    }
    label {
      display: block;
      margin: 16px 0 6px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    input {
      width: 100%;
      height: 44px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: rgba(10, 14, 26, 0.6);
      color: var(--text);
      padding: 0 14px;
      font: inherit;
      font-size: 14.5px;
      transition: all 0.3s ease;
    }
    input:focus {
      outline: none;
      border-color: #C59B3F;
      background: rgba(10, 14, 26, 0.85);
      box-shadow: 0 0 12px rgba(197, 155, 63, 0.3);
    }
    button {
      width: 100%;
      height: 46px;
      margin-top: 24px;
      border: 0;
      border-radius: 10px;
      background: var(--gold-gradient);
      color: #060913;
      font-weight: 900;
      font-size: 15px;
      letter-spacing: 0.08em;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(197, 155, 63, 0.25);
      transition: all 0.3s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(197, 155, 63, 0.35);
      filter: brightness(1.08);
    }
    .check {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 16px;
      color: var(--text);
      font-size: 13.5px;
      cursor: pointer;
      user-select: none;
    }
    .check input { width: 18px; height: 18px; accent-color: #C59B3F; cursor: pointer; }
    .error { min-height: 18px; margin-top: 16px; color: #f5576c; font-size: 14px; font-weight: 600; text-align: center; }
  </style>
</head>
<body>
  <a class="global-home-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
  <main>
    <h1>Moras Admin</h1>
    <form id="login-form">
      <label for="admin-id">아이디</label>
      <input id="admin-id" name="adminId" autocomplete="username" required placeholder="관리자 ID">
      <label for="admin-password">패스워드</label>
      <input id="admin-password" name="adminPassword" type="password" autocomplete="current-password" required placeholder="비밀번호">
      <label class="check">
        <input id="save-credentials" type="checkbox" checked>
        비밀번호 기억하기
      </label>
      <button type="submit">🗝️ 로그인</button>
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
  <title>Moras 관리자 대시보드</title>
  <script>
    window.addEventListener('error', function(e) {
      var errBanner = document.createElement('div');
      errBanner.style.position = 'fixed';
      errBanner.style.top = '0';
      errBanner.style.left = '0';
      errBanner.style.width = '100%';
      errBanner.style.background = '#f5576c';
      errBanner.style.color = '#fff';
      errBanner.style.padding = '12px 20px';
      errBanner.style.fontSize = '14px';
      errBanner.style.zIndex = '99999';
      errBanner.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
      errBanner.style.fontFamily = 'monospace';
      errBanner.style.whiteSpace = 'pre-wrap';
      errBanner.style.boxSizing = 'border-box';
      errBanner.innerHTML = '<strong>[JS ERROR]</strong> ' + e.message + ' at ' + e.filename + ':' + e.lineno + ':' + e.colno;
      document.body.appendChild(errBanner);
    });
    window.addEventListener('unhandledrejection', function(e) {
      var errBanner = document.createElement('div');
      errBanner.style.position = 'fixed';
      errBanner.style.top = '0';
      errBanner.style.left = '0';
      errBanner.style.width = '100%';
      errBanner.style.background = '#f5576c';
      errBanner.style.color = '#fff';
      errBanner.style.padding = '12px 20px';
      errBanner.style.fontSize = '14px';
      errBanner.style.zIndex = '99999';
      errBanner.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
      errBanner.style.fontFamily = 'monospace';
      errBanner.style.whiteSpace = 'pre-wrap';
      errBanner.style.boxSizing = 'border-box';
      errBanner.innerHTML = '<strong>[PROMISE REJECTION]</strong> ' + (e.reason ? (e.reason.message || e.reason) : 'Unknown Rejection');
      document.body.appendChild(errBanner);
    });
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #060913;
      --bg-gradient: radial-gradient(circle at 50% 30%, #111A35 0%, #060913 60%, #020306 100%);
      --panel: rgba(10, 15, 30, 0.72);
      --line: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --muted: #94A3B8;
      --gold: #D4AF37;
      --gold-gradient: linear-gradient(135deg, #FFE8A3 0%, #C59B3F 50%, #FFE8A3 100%);
      --blue: #00F2FE;
      --red: #F5576C;
      --font-outfit: 'Outfit', 'Noto Sans KR', sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg-gradient);
      color: var(--text);
      font-family: var(--font-outfit);
      letter-spacing: -0.01em;
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
    }
    
    /* 포스터 별무리 오라 재현 */
    body::before {
      content: '';
      position: fixed;
      top: -10%; left: -10%;
      width: 50%; height: 50%;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.07) 0%, transparent 70%);
      z-index: -1;
      pointer-events: none;
    }
    body::after {
      content: '';
      position: fixed;
      bottom: -10%; right: -10%;
      width: 50%; height: 50%;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.07) 0%, transparent 70%);
      z-index: -1;
      pointer-events: none;
    }
    
    main {
      width: min(1440px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 116px 0 60px;
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
    header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      margin-bottom: 32px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 24px;
    }
    h1 {
      margin: 0;
      font-family: 'Cinzel', serif;
      font-weight: 800;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 28px;
      letter-spacing: 0.05em;
      text-shadow: 0 0 12px rgba(197, 155, 63, 0.35);
    }
    .header-nav {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    a {
      color: #FFE8A3;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    a:hover {
      color: #C59B3F;
    }
    button {
      height: 42px;
      border: 0;
      border-radius: 10px;
      background: var(--gold-gradient);
      color: #060913;
      font-weight: 800;
      padding: 0 20px;
      cursor: pointer;
      font-family: inherit;
      box-shadow: 0 4px 15px rgba(197, 155, 63, 0.25);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(197, 155, 63, 0.35);
      filter: brightness(1.08);
    }
    button:active {
      transform: translateY(0);
    }
 
    /* Engine Panel styling */
    .engine-panel {
      background: var(--panel);
      backdrop-filter: blur(20px) saturate(120%);
      -webkit-backdrop-filter: blur(20px) saturate(120%);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.08);
    }
    .engine-info h2 {
      margin: 0 0 6px;
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.01em;
    }
    .engine-info p {
      margin: 0;
      font-size: 13.5px;
      color: var(--muted);
      line-height: 1.5;
    }
    .engine-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    /* 네온 퍼플/에메랄드 회전 프로그레스 바 */
    .progress-bar-container {
      width: 260px;
      height: 12px;
      background: rgba(0, 0, 0, 0.45);
      border-radius: 99px;
      overflow: hidden;
      display: none;
      border: 1px solid rgba(255,255,255,0.06);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
    }
    .progress-bar-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #00F2FE 0%, #FFE8A3 50%, #F5576C 100%);
      border-radius: 99px;
      transition: width 0.4s ease;
      box-shadow: 0 0 12px rgba(0, 242, 254, 0.6);
    }
 
    /* Tab Layout */
    .tabs-nav {
      display: flex;
      gap: 12px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 24px;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--muted);
      height: 48px;
      padding: 0 24px;
      font-size: 15.5px;
      font-weight: 700;
      border-bottom: 3px solid transparent;
      border-radius: 0;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.02);
      box-shadow: none;
      transform: none;
    }
    .tab-btn.active {
      color: #FFE8A3;
      border-bottom-color: #FFE8A3;
      background: transparent;
      text-shadow: 0 0 10px rgba(254, 224, 130, 0.3);
    }
    
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }

    .roster-panel {
      display: grid;
      gap: 18px;
    }
    .roster-form {
      display: grid;
      grid-template-columns: minmax(180px, 1fr) 150px auto auto;
      gap: 12px;
      align-items: end;
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--panel);
      backdrop-filter: blur(20px);
    }
    .roster-form label {
      display: block;
      margin: 0 0 6px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .roster-form input,
    .roster-form select {
      width: 100%;
      height: 42px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: rgba(10, 14, 26, 0.68);
      color: var(--text);
      padding: 0 12px;
      font: inherit;
    }
    .roster-form button {
      width: auto;
      min-width: 104px;
      height: 42px;
      margin: 0;
      padding: 0 16px;
    }
    .roster-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .roster-actions button {
      width: auto;
      height: 34px;
      margin: 0;
      padding: 0 12px;
      font-size: 12px;
    }
    .submissions-toolbar {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .toolbar-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .roster-status {
      color: var(--muted);
      font-size: 13px;
      min-height: 18px;
    }
    .roster-search-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .roster-search-wrap input {
      flex: 1;
      height: 38px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: rgba(10, 14, 26, 0.68);
      color: var(--text);
      padding: 0 12px;
      font: inherit;
      font-size: 13px;
    }
    .roster-search-wrap input:focus {
      outline: none;
      border-color: rgba(255, 232, 163, 0.4);
    }
    .requests-section {
      border: 1px solid rgba(255, 232, 163, 0.22);
      border-radius: 16px;
      background: rgba(255, 232, 163, 0.04);
      overflow: hidden;
    }
    .requests-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 232, 163, 0.14);
    }
    .requests-section-title {
      color: #FFE8A3;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.06em;
    }
    .requests-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      padding: 0 7px;
      border-radius: 999px;
      background: rgba(255, 232, 163, 0.22);
      color: #FFE8A3;
      font-size: 11px;
      font-weight: 900;
    }
    .request-row {
      display: grid;
      grid-template-columns: minmax(120px, 1fr) 60px minmax(100px, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 12px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 13px;
    }
    .request-row:last-child { border-bottom: 0; }
    .request-row .req-name { font-weight: 900; color: var(--text); }
    .request-row .req-time { color: var(--muted); font-size: 12px; }
    .request-actions { display: flex; gap: 7px; justify-content: flex-end; }
    .btn-approve {
      width: auto;
      height: 32px;
      margin: 0;
      padding: 0 14px;
      font-size: 12px;
      font-weight: 900;
      border: 1px solid rgba(52, 211, 153, 0.45);
      border-radius: 8px;
      background: rgba(52, 211, 153, 0.12);
      color: #34D399;
      cursor: pointer;
    }
    .btn-approve:hover { background: rgba(52, 211, 153, 0.22); }
    .btn-reject {
      width: auto;
      height: 32px;
      margin: 0;
      padding: 0 14px;
      font-size: 12px;
      font-weight: 900;
      border: 1px solid rgba(248, 113, 113, 0.4);
      border-radius: 8px;
      background: rgba(248, 113, 113, 0.1);
      color: #F87171;
      cursor: pointer;
    }
    .btn-reject:hover { background: rgba(248, 113, 113, 0.2); }

    @media (max-width: 820px) {
      .roster-form {
        grid-template-columns: 1fr;
      }
    }
 
    /* Submissions list tables */
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 20px;
      background: var(--panel);
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }
    table {
      width: 100%;
      min-width: 980px;
      border-collapse: collapse;
    }
    th, td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: middle;
      font-size: 14px;
      white-space: nowrap;
    }
    th {
      color: #FFE8A3;
      font-size: 12.5px;
      font-weight: 700;
      background: rgba(10, 14, 26, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    tr:last-child td { border-bottom: 0; }
    .muted { color: var(--muted); }
    .null { color: var(--muted); font-family: ui-monospace, monospace; }
    
    .gender-badge {
      display: inline-flex;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 0.03em;
    }
    .gender-badge.male {
      background: rgba(0, 242, 254, 0.12);
      color: #00F2FE;
      border: 1px solid rgba(0, 242, 254, 0.25);
    }
    .gender-badge.female {
      background: rgba(240, 147, 251, 0.12);
      color: #F093FB;
      border: 1px solid rgba(240, 147, 251, 0.25);
    }
 
    .pill {
      display: inline-flex;
      border: 1px solid rgba(197,155,63,.35);
      border-radius: 99px;
      color: #FFE8A3;
      padding: 3px 10px;
      font-weight: 700;
      font-size: 11.5px;
      background: rgba(197, 155, 63, 0.05);
    }
    
    .btn-secondary {
      height: 32px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--line);
      color: var(--text);
      padding: 0 12px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 600;
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.08);
      box-shadow: none;
      transform: none;
      border-color: rgba(255,255,255,0.2);
    }
    .btn-danger {
      border-color: rgba(245, 87, 108, 0.28);
      color: #FCA5A5;
    }
    .btn-danger:hover {
      background: rgba(245, 87, 108, 0.10);
      border-color: rgba(245, 87, 108, 0.46);
    }
    .row-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;
    }
 
    /* Matching Couples View Grid */
    .couples-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 32px;
    }
    .couple-card {
      background: rgba(10, 14, 26, 0.55);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 24px 28px;
      display: grid;
      grid-template-columns: 72px minmax(180px, 1fr) minmax(180px, 1fr) minmax(220px, 0.8fr) 104px;
      align-items: center;
      gap: 16px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .couple-card:hover {
      border-color: rgba(255,255,255,0.15);
      transform: translateY(-2px);
    }
 
    /* Rank highlights */
    .couple-rank-box {
      text-align: center;
    }
    .couple-rank {
      font-size: 28px;
      font-weight: 900;
      color: var(--muted);
      font-family: 'Outfit', sans-serif;
    }
    
    /* 1등 커플 골드 마스터 피스 카드 */
    .couple-card.gold-highlight {
      background: linear-gradient(135deg, rgba(197, 155, 63, 0.18) 0%, rgba(10, 14, 26, 0.9) 70%);
      border: 2px solid #FFE8A3;
      box-shadow: 0 0 35px rgba(197, 155, 63, 0.4), inset 0 0 20px rgba(197, 155, 63, 0.1);
      position: relative;
      overflow: hidden;
      animation: goldenPulse 3s infinite alternate;
    }
    
    @keyframes goldenPulse {
      0% { box-shadow: 0 0 20px rgba(197, 155, 63, 0.3); }
      100% { box-shadow: 0 0 40px rgba(197, 155, 63, 0.6), inset 0 0 15px rgba(197, 155, 63, 0.15); }
    }
    
    .couple-card.gold-highlight .couple-rank {
      font-family: 'Cinzel', serif;
      color: #FFE8A3;
      font-size: 36px;
      text-shadow: 0 0 15px rgba(197, 155, 63, 0.6);
    }
 
    .couple-participant {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255,255,255,0.03);
      border-radius: 14px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .couple-participant.male {
      border-left: 3px solid var(--blue);
      box-shadow: inset 3px 0 10px rgba(0, 242, 254, 0.03);
    }
    .couple-participant.female {
      border-left: 3px solid var(--red);
      box-shadow: inset 3px 0 10px rgba(245, 87, 108, 0.03);
    }
    .cp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cp-name {
      font-weight: 800;
      font-size: 16px;
      color: #fff;
    }
    .cp-saju {
      font-size: 12.5px;
      color: var(--muted);
    }
    .passcode-badge {
      display: inline-block;
      font-family: monospace;
      font-size: 13.5px;
      color: #FFE8A3;
      background: rgba(197, 155, 63, 0.12);
      border: 1px dashed rgba(197, 155, 63, 0.4);
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
    }
 
    .couple-score-box {
      text-align: left;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      gap: 8px;
    }
    .couple-score {
      font-size: 30px;
      font-weight: 900;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      line-height: 1.1;
    }
    .couple-score span {
      font-size: 12px;
      color: var(--muted);
      font-weight: 400;
    }
    .gold-highlight .couple-score {
      color: #FFE8A3;
      text-shadow: 0 0 12px rgba(197, 155, 63, 0.5);
    }
    .score-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .score-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 26px;
      padding: 4px 8px;
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 999px;
      background: rgba(255,255,255,0.05);
      color: var(--muted);
      font-size: 11.5px;
      font-weight: 800;
      white-space: nowrap;
    }
    .score-chip strong {
      color: #FFE8A3;
      margin-left: 4px;
    }
    .relation-type {
      color: #FFE8A3;
      font-size: 12.5px;
      font-weight: 900;
    }
    .couple-actions {
      display: flex;
      justify-content: flex-end;
    }
    .btn-detail {
      height: 38px;
      border-radius: 10px;
      padding: 0 14px;
      font-size: 12.5px;
      font-weight: 900;
      background: rgba(197, 155, 63, 0.12);
      border: 1px solid rgba(197, 155, 63, 0.38);
      color: #FFE8A3;
      cursor: pointer;
    }
    .btn-detail:hover {
      background: rgba(197, 155, 63, 0.20);
      box-shadow: 0 0 18px rgba(197, 155, 63, 0.20);
    }
    .match-detail-panel {
      display: none;
      margin-top: -8px;
      margin-bottom: 8px;
      padding: 24px;
      border: 1px solid rgba(197, 155, 63, 0.25);
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(10, 14, 26, 0.92), rgba(20, 15, 35, 0.78));
      box-shadow: 0 24px 60px rgba(0,0,0,0.40);
    }
    .match-detail-panel.open {
      display: block;
    }
    .match-detail-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }
    .match-detail-head h3 {
      margin: 0 0 6px;
      color: #fff;
      font-size: 20px;
    }
    .match-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-top: 18px;
    }
    .match-person-detail {
      min-width: 0;
    }
    .match-person-detail h4 {
      margin: 0 0 8px;
      font-size: 15px;
      color: #FFE8A3;
    }
    .score-formula-box {
      padding: 16px;
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 14px;
      background: rgba(0,0,0,0.22);
      color: var(--muted);
      font-size: 13px;
      line-height: 1.7;
    }
    .score-formula-box strong {
      color: #fff;
    }
    .print-only-title {
      display: none;
    }
    .roulette-panel {
      display: grid;
      grid-template-columns: minmax(260px, 0.8fr) minmax(320px, 1.2fr);
      gap: 18px;
    }
    .roulette-card {
      padding: 22px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: rgba(10, 14, 26, 0.62);
    }
    .roulette-card h3 {
      margin: 0 0 14px;
      color: #FFE8A3;
      font-size: 17px;
    }
    .roulette-settings-form {
      display: grid;
      gap: 12px;
      margin-bottom: 18px;
      padding: 16px;
      border: 1px solid rgba(255, 232, 163, 0.16);
      border-radius: 14px;
      background: rgba(255, 232, 163, 0.045);
    }
    .roulette-settings-grid {
      display: grid;
      grid-template-columns: minmax(180px, 1fr) minmax(170px, 0.75fr);
      gap: 12px;
      align-items: end;
    }
    .roulette-settings-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
    }
    .roulette-settings-actions button {
      width: auto;
      min-width: 140px;
    }
    .roulette-timer-status {
      margin-top: 12px;
      padding: 12px 14px;
      border: 1px solid rgba(255, 232, 163, 0.16);
      border-radius: 12px;
      background: rgba(255,255,255,0.035);
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.6;
    }
    .roulette-timer-status strong {
      color: #FFE8A3;
    }
    .roulette-settings-grid label {
      display: block;
      margin-bottom: 7px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 900;
    }
    .roulette-form {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      margin-bottom: 16px;
    }
    .roulette-form input, .roulette-settings-form input, .roulette-card select, .roulette-participant-tools input {
      min-height: 42px;
      border-radius: 10px;
      border: 1px solid var(--line);
      background: rgba(5, 8, 17, 0.72);
      color: var(--text);
      padding: 0 12px;
      font-weight: 700;
      width: 100%;
    }
    .roulette-wheel {
      min-height: 180px;
      border: 1px solid rgba(197, 155, 63, 0.25);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 18px auto;
      aspect-ratio: 1;
      max-width: 230px;
      background:
        conic-gradient(from 0deg, rgba(197,155,63,0.30), rgba(0,242,254,0.18), rgba(245,87,108,0.18), rgba(197,155,63,0.30));
      box-shadow: inset 0 0 40px rgba(0,0,0,0.45), 0 0 35px rgba(197,155,63,0.12);
      text-align: center;
      color: #fff;
      font-size: 24px;
      font-weight: 900;
    }
    .roulette-result-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .roulette-result-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 12px 14px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      background: rgba(255,255,255,0.04);
    }
    .roulette-check-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
      margin: 10px 0 16px;
      max-height: 180px;
      overflow: auto;
    }
    .roulette-check {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 9px 10px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      background: rgba(255,255,255,0.04);
      color: var(--text);
      font-size: 13px;
      font-weight: 800;
    }
    .roulette-check input {
      width: auto;
      min-height: auto;
      accent-color: #FFE8A3;
    }
    .roulette-check .check-label { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .roulette-check .btn-del-item { flex-shrink:0; width:20px; height:20px; border:0; border-radius:50%; background:rgba(239,68,68,.22); color:#fca5a5; font-size:13px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; transition:background .15s; }
    .roulette-check .btn-del-item:hover { background:rgba(239,68,68,.5); }
    .roulette-participant-tools {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      margin: 14px 0;
    }
    .roulette-roster-results {
      display: grid;
      gap: 8px;
      max-height: 360px;
      overflow: auto;
      padding-right: 4px;
    }
    .roulette-roster-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 10px;
      align-items: center;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      background: rgba(255,255,255,0.04);
    }
    .roulette-board-preview {
      min-height: 180px;
      border: 1px solid rgba(197, 155, 63, 0.25);
      border-radius: 18px;
      padding: 14px;
      background: radial-gradient(circle at 50% 0%, rgba(255,232,163,0.10), rgba(10,14,26,0.62));
    }
    .roulette-mini-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      max-height: 124px;
      overflow: hidden;
    }
    @media (max-width: 760px) {
      .roulette-settings-grid {
        grid-template-columns: 1fr;
      }
      .roulette-participant-tools {
        grid-template-columns: 1fr;
      }
    }
 
    /* unmatched-container - 딥 블루-퍼플 성운 글래스모피즘 */
    .unmatched-container {
      background: rgba(20, 15, 35, 0.55);
      border: 1px solid rgba(162, 155, 254, 0.18);
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 20px 45px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.04);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .unmatched-container h3 {
      margin: 0 0 14px;
      color: #a29bfe;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .unmatched-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .unmatched-badge {
      background: rgba(162, 155, 254, 0.1);
      border: 1px solid rgba(162, 155, 254, 0.2);
      color: #a29bfe;
      padding: 8px 16px;
      border-radius: 99px;
      font-size: 13.5px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
 
    .detail-row > td {
      padding: 0;
      background: rgba(5, 8, 17, 0.85);
    }
    .detail-panel {
      padding: 20px 24px;
      border-top: 1px solid var(--line);
    }
    .detail-panel details {
      margin-top: 16px;
    }
    summary {
      color: #FFE8A3;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      outline: none;
    }
    pre {
      max-width: 100%;
      max-height: 360px;
      overflow: auto;
      padding: 16px;
      border-radius: 10px;
      background: rgba(0,0,0,0.5);
      border: 1px solid var(--line);
      color: #E2E8F0;
      white-space: pre-wrap;
      font-size: 12px;
      line-height: 1.55;
    }
    .analysis-box {
      max-width: 100%;
      margin: 16px 0 0;
      padding: 18px;
      border: 1px solid rgba(197, 155, 63, 0.25);
      border-radius: 12px;
      background: rgba(197, 155, 63, 0.05);
      color: #FFE8A3;
      font-size: 13.5px;
      line-height: 1.65;
      white-space: normal;
    }
    .analysis-box strong {
      display: block;
      margin-bottom: 8px;
      color: #FFE8A3;
      font-size: 14.5px;
    }
 
    .admin-chart {
      margin: 16px 0;
      overflow-x: auto;
    }
    .mini-chart {
      display: grid;
      grid-template-columns: 80px repeat(4, minmax(140px, 1fr));
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 10px;
      overflow: hidden;
      background: rgba(0,0,0,0.3);
    }
    .mini-cell {
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1px solid var(--line);
      border-top: 1px solid var(--line);
      padding: 8px;
      color: var(--text);
      font-size: 13px;
      white-space: nowrap;
    }
    .mini-label {
      border-left: 0;
      color: var(--muted);
      background: rgba(10, 14, 26, 0.85);
      font-weight: 700;
    }
    .mini-head {
      border-top: 0;
      background: rgba(10, 14, 26, 0.95);
      color: #fff;
      font-weight: 800;
    }
    .mini-big {
      min-height: 48px;
      font-size: 20px;
      font-weight: 900;
    }
    .mini-branch {
      color: var(--gold);
    }
    .mini-day {
      color: var(--blue);
    }
 
    @media (max-width: 820px) {
      .couple-card {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 20px;
      }
      .couple-rank-box {
        grid-column: auto;
        text-align: left;
        border-bottom: 1px solid var(--line);
        padding-bottom: 10px;
      }
      .couple-score-box {
        grid-column: auto;
        border-top: 1px solid var(--line);
        padding-top: 10px;
      }
      .couple-actions { justify-content: stretch; }
      .btn-detail { width: 100%; }
      .match-detail-grid { grid-template-columns: 1fr; }
      .match-detail-head { flex-direction: column; }
      .roulette-panel { grid-template-columns: 1fr; }
      .roulette-form { grid-template-columns: 1fr; }
    }
    @media print {
      body { background: #050812; }
      header, .engine-panel, .tabs-nav, .btn-detail, .engine-actions, .header-nav, .no-print { display: none !important; }
      main { max-width: none; padding: 0; }
      .tab-content { display: none !important; }
      #tab-couples { display: block !important; }
      .couple-card, .unmatched-container { display: none !important; }
      .match-detail-panel { display: none !important; box-shadow: none; page-break-inside: avoid; }
      .match-detail-panel.print-target { display: block !important; border-color: rgba(197, 155, 63, 0.45); }
      .print-only-title { display: block; margin: 0 0 18px; color: #FFE8A3; font-size: 22px; font-weight: 900; }
    }
  </style>
</head>
<body>
  <a class="global-home-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
  <main>
    <header>
      <div>
        <h1>Moras 관리자 대시보드</h1>
        <div class="muted" style="margin-top: 4px;">오픈채팅 이벤트 MBTI & 사주 기반 매칭 엔진 대시보드</div>
      </div>
      <div class="header-nav">
        <a href="/" target="_blank">참가자 등록화면</a>
        <button id="logout" type="button">로그아웃</button>
      </div>
    </header>
 
    <!-- Batch Matcher Trigger Panel -->
    <div class="engine-panel">
      <div class="engine-info">
        <h2>일괄 이분 매칭 엔진 (Bipartite Match Engine)</h2>
        <p id="engine-status">가중치(상호 궁합 평균 점수)의 합이 최대가 되도록 2-opt Swap 최적화 분배를 실행합니다.</p>
      </div>
      <div class="engine-actions">
        <div class="progress-bar-container" id="engine-progress">
          <div class="progress-bar-fill" id="engine-progress-fill"></div>
        </div>
        <button id="btn-run-match" type="button">일괄 매칭 엔진 실행</button>
      </div>
    </div>
 
    <!-- Tab navigation -->
    <div class="tabs-nav">
      <button class="tab-btn active" data-tab="submissions" id="tab-btn-subs">참가자 목록 (불러오는 중)</button>
      <button class="tab-btn" data-tab="roster" id="tab-btn-roster">전체명단</button>
      <button class="tab-btn" data-tab="couples" id="tab-btn-couples">매칭 결과</button>
      <button class="tab-btn" data-tab="roulette" id="tab-btn-roulette">추첨 룰렛</button>
      <button class="tab-btn" data-tab="ladder" id="tab-btn-ladder">사다리타기</button>
      <button class="tab-btn" data-tab="gachapon" id="tab-btn-gachapon">가차폰 추첨</button>
    </div>
 
    <!-- Tab Contents 1: Submissions -->
    <div class="tab-content active" id="tab-submissions">
      <div class="submissions-toolbar">
        <div class="muted" id="submissions-status">참가자 목록을 불러오는 중...</div>
        <div class="toolbar-actions">
          <button type="button" class="btn-secondary" id="submissions-seed-test">테스트 데이터 넣기</button>
          <button type="button" class="btn-secondary btn-danger" id="submissions-delete-all">전체삭제</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>제출 시간</th>
              <th>이름</th>
              <th>성별</th>
              <th>MBTI</th>
              <th>사주 팔자</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody id="rows-submissions"></tbody>
        </table>
      </div>
    </div>

    <!-- Tab Contents: Master Roster -->
    <div class="tab-content" id="tab-roster">
      <div class="roster-panel">
        <form id="roster-form" class="roster-form">
          <input type="hidden" id="roster-id">
          <div>
            <label for="roster-name">이름</label>
            <input id="roster-name" required placeholder="예: 벤지">
          </div>
          <div>
            <label for="roster-gender">성별</label>
            <select id="roster-gender" required>
              <option value="남">남성</option>
              <option value="여">여성</option>
            </select>
          </div>
          <button type="submit">저장</button>
          <button type="button" class="btn-secondary" id="roster-cancel">취소</button>
        </form>
        <div class="roster-status" id="roster-status">명단을 불러오는 중...</div>

        <!-- 추가요청 목록 -->
        <div class="requests-section" id="requests-section" style="display:none;">
          <div class="requests-section-header">
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="requests-section-title">추가요청 목록</span>
              <span class="requests-badge" id="requests-badge">0</span>
            </div>
          </div>
          <div class="request-row" style="border-bottom:1px solid rgba(255,232,163,0.14);padding-top:10px;padding-bottom:10px;">
            <div style="color:#FFE8A3;font-size:11px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">이름</div>
            <div style="color:#FFE8A3;font-size:11px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">성별</div>
            <div style="color:#FFE8A3;font-size:11px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">신청시간</div>
            <div></div>
          </div>
          <div id="rows-requests"></div>
        </div>

        <!-- 검색 + 목록 -->
        <div class="roster-search-wrap">
          <input id="roster-search" type="text" placeholder="이름으로 검색...">
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>성별</th>
                <th>상태</th>
                <th>수정일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody id="rows-roster"></tbody>
          </table>
        </div>
      </div>
    </div>
 
    <!-- Tab Contents 2: Couples Results -->
    <div class="tab-content" id="tab-couples">
      <div class="submissions-toolbar">
        <div class="muted" id="matches-status">매칭 결과를 불러오는 중...</div>
        <button type="button" class="btn-secondary btn-danger" id="matches-reset">매칭결과 초기화</button>
      </div>
      <!-- Vote Deadline Management -->
      <div id="vote-deadline-panel" style="display:none;margin:12px 0 16px;padding:14px 16px;background:rgba(255,232,163,0.06);border:1px solid rgba(255,232,163,0.18);border-radius:10px;">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <span style="font-size:12px;font-weight:700;color:#FFE8A3;white-space:nowrap;">매칭 선택 마감:</span>
          <span id="vote-deadline-display" style="font-size:13px;color:#F8FAFC;font-weight:600;">로드 중...</span>
          <div style="display:flex;gap:6px;align-items:center;margin-left:auto;">
            <input type="datetime-local" id="vote-deadline-input"
              style="height:34px;background:rgba(5,8,17,.72);border:1px solid rgba(255,232,163,0.3);border-radius:8px;color:#fff;padding:0 10px;font-size:12px;font-family:inherit;">
            <button type="button" id="vote-deadline-save" style="height:34px;padding:0 14px;font-size:12px;white-space:nowrap;border-radius:8px;">저장</button>
          </div>
        </div>
      </div>
      <div class="couples-container" id="couples-list">
        <!-- Render couple cards dynamically -->
        <div class="muted" style="text-align: center; padding: 40px 0;">아직 매칭 결과가 조회되지 않았습니다. 새로고침을 실행하세요.</div>
      </div>
      
      <div class="unmatched-container" id="unmatched-area" style="display: none;">
        <h3>성비 불균형 보류 명단 (Unmatched Participants)</h3>
        <div class="unmatched-list" id="unmatched-list">
          <!-- Unmatched items -->
        </div>
      </div>
    </div>

    <!-- Tab Contents 3: Roulette -->
    <div class="tab-content" id="tab-roulette">
      <div class="roulette-panel">
        <div class="roulette-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h3 style="margin:0;">룰렛 이벤트 설정</h3>
            <div style="display:flex;gap:6px;">
              <button id="roulette-reset-results" type="button" class="btn-secondary" style="height:32px;font-size:12px;padding:0 12px;border-color:rgba(251,191,36,.4);color:#fbbf24;">룰렛초기화</button>
              <button id="roulette-reset" type="button" class="btn-secondary btn-danger" style="height:32px;font-size:12px;padding:0 12px;">전체룰렛초기화</button>
            </div>
          </div>
          <!-- 이벤트 이름 -->
          <div style="display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:18px;align-items:end;">
            <div>
              <label style="display:block;margin-bottom:7px;color:var(--muted);font-size:12px;font-weight:900;" for="roulette-event-name">룰렛이벤트 이름</label>
              <input id="roulette-event-name" placeholder="예: 제 1회 룰렛이벤트" style="width:100%;min-height:42px;border-radius:10px;border:1px solid var(--line);background:rgba(5,8,17,.72);color:#fff;padding:0 14px;font-family:inherit;font-size:14px;font-weight:700;">
            </div>
            <button id="roulette-name-save" type="button" style="height:42px;padding:0 20px;white-space:nowrap;">저장</button>
          </div>
          <!-- 타이머 자동실행 카드 (인라인) -->
          <div class="roulette-settings-form" id="roulette-timer-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
              <h3 style="margin:0;font-size:15px;">⏰ 타이머 자동실행</h3>
            </div>
            <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin-bottom:12px;">
              <div>
                <label style="display:block;margin-bottom:7px;color:var(--muted);font-size:12px;font-weight:900;" for="roulette-start-time">시작 예정 시간</label>
                <input id="roulette-start-time" type="datetime-local" style="width:100%;min-height:42px;border-radius:10px;border:1px solid var(--line);background:rgba(5,8,17,.72);color:#fff;padding:0 14px;font-family:inherit;font-size:14px;font-weight:700;">
              </div>
              <button id="roulette-timer-start" type="button" style="height:42px;padding:0 20px;white-space:nowrap;background:linear-gradient(135deg,#FFE8A3,#F4C35E);color:#03070e;font-weight:900;border:0;border-radius:10px;cursor:pointer;">타이머룰렛 시작</button>
            </div>
            <div id="roulette-timer-display" style="padding:14px 16px;border-radius:12px;background:rgba(255,232,163,.06);border:1px solid rgba(255,232,163,.14);min-height:52px;display:flex;align-items:center;gap:10px;">
              <span id="roulette-timer-clock" style="font-size:clamp(18px,2.8vw,26px);font-weight:900;color:#FFE8A3;font-family:'Cinzel',serif;letter-spacing:.04em;">–</span>
              <span id="roulette-timer-countdown" style="font-size:13px;font-weight:700;color:rgba(255,255,255,.55);"></span>
            </div>
            <div class="roulette-timer-status" id="roulette-timer-status" style="margin-top:10px;">룰렛 실행 상태를 불러오는 중...</div>
          </div>
          <!-- hidden draw-mode (still needed for saveSettings) -->
          <input type="hidden" id="roulette-draw-mode" value="instant">
          <h3>추첨 항목 관리</h3>
          <form class="roulette-form" id="roulette-item-form">
            <input id="roulette-item-label" placeholder="예: 커피 쿠폰, 우선 선택권" required>
            <button type="submit">항목 추가</button>
          </form>
          <label>룰렛판에 올릴 추첨 항목</label>
          <div class="roulette-check-grid" id="roulette-item-checks"></div>
          <div class="roulette-board-preview">
            <div class="muted" style="margin-bottom:10px;">룰렛판 미리보기</div>
            <div class="roulette-mini-pool" id="roulette-mini-pool"></div>
          </div>
          <div class="roulette-wheel" id="roulette-wheel">READY</div>
          <button id="roulette-spin" type="button" style="width:100%;">룰렛 돌리기</button>
          <div class="muted" id="roulette-status" style="margin-top:12px;">추첨 데이터를 불러오는 중...</div>
        </div>
        <div class="roulette-card">
          <h3>룰렛 참가자 및 추첨 결과 <span id="roulette-participant-count" style="font-size:13px;font-weight:500;color:var(--muted);"></span></h3>
          <div class="roulette-participant-tools">
            <input id="roulette-roster-search" placeholder="전체명단에서 이름 검색">
            <select id="roulette-roster-select"></select>
          </div>
          <div style="display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:14px;">
            <button id="roulette-add-participant" type="button" style="width:100%;margin:0;">룰렛 참가자 추가</button>
            <button id="roulette-add-all" type="button" style="margin:0;white-space:nowrap;">전체추가</button>
          </div>
          <div class="roulette-result-list" id="roulette-results"></div>
        </div>
      </div>
    </div>

    <!-- Tab Contents 4: Ladder -->
    <div class="tab-content" id="tab-ladder">
      <div class="roulette-panel">
        <div class="roulette-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h3 style="margin:0;">사다리타기 이벤트 설정</h3>
            <div style="display:flex;gap:6px;">
              <button id="ladder-reset-results" type="button" class="btn-secondary" style="height:32px;font-size:12px;padding:0 12px;border-color:rgba(251,191,36,.4);color:#fbbf24;">사다리초기화</button>
              <button id="ladder-reset" type="button" class="btn-secondary btn-danger" style="height:32px;font-size:12px;padding:0 12px;">전체초기화</button>
            </div>
          </div>
          <!-- 이벤트 이름 -->
          <div style="display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:18px;align-items:end;">
            <div>
              <label style="display:block;margin-bottom:7px;color:var(--muted);font-size:12px;font-weight:900;" for="ladder-event-name">사다리타기 이벤트 이름</label>
              <input id="ladder-event-name" placeholder="예: 제 1회 사다리타기 이벤트" style="width:100%;min-height:42px;border-radius:10px;border:1px solid var(--line);background:rgba(5,8,17,.72);color:#fff;padding:0 14px;font-family:inherit;font-size:14px;font-weight:700;">
            </div>
            <button id="ladder-name-save" type="button" style="height:42px;padding:0 20px;white-space:nowrap;">저장</button>
          </div>
          <!-- 타이머 자동실행 카드 (인라인) -->
          <div class="roulette-settings-form" id="ladder-timer-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
              <h3 style="margin:0;font-size:15px;">⏰ 타이머 자동실행</h3>
            </div>
            <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin-bottom:12px;">
              <div>
                <label style="display:block;margin-bottom:7px;color:var(--muted);font-size:12px;font-weight:900;" for="ladder-start-time">시작 예정 시간</label>
                <input id="ladder-start-time" type="datetime-local" style="width:100%;min-height:42px;border-radius:10px;border:1px solid var(--line);background:rgba(5,8,17,.72);color:#fff;padding:0 14px;font-family:inherit;font-size:14px;font-weight:700;">
              </div>
              <button id="ladder-timer-start" type="button" style="height:42px;padding:0 20px;white-space:nowrap;background:linear-gradient(135deg,#FFE8A3,#F4C35E);color:#03070e;font-weight:900;border:0;border-radius:10px;cursor:pointer;">타이머 사다리 시작</button>
            </div>
            <div id="ladder-timer-display" style="padding:14px 16px;border-radius:12px;background:rgba(255,232,163,.06);border:1px solid rgba(255,232,163,.14);min-height:52px;display:flex;align-items:center;gap:10px;">
              <span id="ladder-timer-clock" style="font-size:clamp(18px,2.8vw,26px);font-weight:900;color:#FFE8A3;font-family:'Cinzel',serif;letter-spacing:.04em;">–</span>
              <span id="ladder-timer-countdown" style="font-size:13px;font-weight:700;color:rgba(255,255,255,.55);"></span>
            </div>
            <div class="roulette-timer-status" id="ladder-timer-status" style="margin-top:10px;">사다리 실행 상태를 불러오는 중...</div>
          </div>
          <!-- hidden draw-mode -->
          <input type="hidden" id="ladder-draw-mode" value="instant">

          <div style="margin-top:18px;padding:16px;border-radius:14px;background:rgba(255,232,163,0.03);border:1px solid rgba(255,232,163,0.1);">
            <h4 style="color:#FFE8A3;margin:0 0 6px;font-size:13px;">💡 상품 목록 연동 안내</h4>
            <p style="color:var(--muted);font-size:11.5px;line-height:1.5;">사다리타기의 추첨 상품은 **'추첨 룰렛' 탭의 '추첨 항목 관리'**에 등록하고 체크박스를 선택한 항목들이 실시간으로 자동 연동됩니다. 룰렛 탭에서 상품 항목을 먼저 준비해주세요.</p>
          </div>

          <div style="margin-top:14px;padding:14px 16px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div>
              <div style="font-size:13px;font-weight:900;color:#fff;">선택 애니메이션 방식</div>
              <div style="font-size:11px;color:var(--muted);margin-top:2px;">열이 선택되기 전 볼이 움직이는 방식</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <select id="ladder-bounce-mode" style="min-height:38px;border-radius:8px;border:1px solid var(--line);background:rgba(5,8,17,.72);color:#fff;padding:0 10px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;">
                <option value="random">랜덤 (기존)</option>
                <option value="pendulum">좌우 왕복 (점차 느려짐)</option>
              </select>
              <button id="ladder-bounce-mode-save" type="button" style="height:38px;padding:0 14px;white-space:nowrap;font-size:13px;">저장</button>
            </div>
          </div>

          <button id="ladder-spin" type="button" style="width:100%;margin-top:18px;height:46px;background:linear-gradient(135deg,#FFE8A3,#F4C35E);color:#03070e;font-weight:900;border:0;border-radius:10px;cursor:pointer;">사다리타기 돌리기 (순차 추첨)</button>
          <div class="muted" id="ladder-status" style="margin-top:12px;">사다리 데이터를 불러오는 중...</div>
        </div>
        <div class="roulette-card">
          <h3>사다리 참가자 및 결과 <span id="ladder-participant-count" style="font-size:13px;font-weight:500;color:var(--muted);"></span></h3>
          <div class="roulette-participant-tools">
            <input id="ladder-roster-search" placeholder="전체명단에서 이름 검색">
            <select id="ladder-roster-select"></select>
          </div>
          <div style="display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:14px;">
            <button id="ladder-add-participant" type="button" style="width:100%;margin:0;">사다리 참가자 추가</button>
            <button id="ladder-add-all" type="button" style="margin:0;white-space:nowrap;">전체추가</button>
          </div>
          <div class="roulette-result-list" id="ladder-results"></div>
        </div>
      </div>
    </div>

    <!-- Tab Contents 5: Gachapon -->
    <div class="tab-content" id="tab-gachapon">
      <div class="roulette-panel">
        <div class="roulette-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h3 style="margin:0;">네온 가차폰 추첨 설정</h3>
            <div style="display:flex;gap:6px;">
              <button id="gachapon-reset-results" type="button" class="btn-secondary" style="height:32px;font-size:12px;padding:0 12px;border-color:rgba(251,191,36,.4);color:#fbbf24;">결과초기화</button>
              <button id="gachapon-reset" type="button" class="btn-secondary btn-danger" style="height:32px;font-size:12px;padding:0 12px;">전체초기화</button>
            </div>
          </div>
          <!-- 이벤트 이름 -->
          <div style="display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:18px;align-items:end;">
            <div>
              <label style="display:block;margin-bottom:7px;color:var(--muted);font-size:12px;font-weight:900;" for="gachapon-event-name">가차폰 이벤트 이름</label>
              <input id="gachapon-event-name" placeholder="예: 제 1회 네온 가차폰 이벤트" style="width:100%;min-height:42px;border-radius:10px;border:1px solid var(--line);background:rgba(5,8,17,.72);color:#fff;padding:0 14px;font-family:inherit;font-size:14px;font-weight:700;">
            </div>
            <button id="gachapon-name-save" type="button" style="height:42px;padding:0 20px;white-space:nowrap;">저장</button>
          </div>
          <!-- 타이머 자동실행 카드 (인라인) -->
          <div class="roulette-settings-form" id="gachapon-timer-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
              <h3 style="margin:0;font-size:15px;">⏰ 타이머 자동실행</h3>
            </div>
            <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin-bottom:12px;">
              <div>
                <label style="display:block;margin-bottom:7px;color:var(--muted);font-size:12px;font-weight:900;" for="gachapon-start-time">시작 예정 시간</label>
                <input id="gachapon-start-time" type="datetime-local" style="width:100%;min-height:42px;border-radius:10px;border:1px solid var(--line);background:rgba(5,8,17,.72);color:#fff;padding:0 14px;font-family:inherit;font-size:14px;font-weight:700;">
              </div>
              <button id="gachapon-timer-start" type="button" style="height:42px;padding:0 20px;white-space:nowrap;background:linear-gradient(135deg,#FFE8A3,#F4C35E);color:#03070e;font-weight:900;border:0;border-radius:10px;cursor:pointer;">타이머 가차 시작</button>
            </div>
            <div id="gachapon-timer-display" style="padding:14px 16px;border-radius:12px;background:rgba(255,232,163,.06);border:1px solid rgba(255,232,163,.14);min-height:52px;display:flex;align-items:center;gap:10px;">
              <span id="gachapon-timer-clock" style="font-size:clamp(18px,2.8vw,26px);font-weight:900;color:#FFE8A3;font-family:'Cinzel',serif;letter-spacing:.04em;">–</span>
              <span id="gachapon-timer-countdown" style="font-size:13px;font-weight:700;color:rgba(255,255,255,.55);"></span>
            </div>
            <div class="roulette-timer-status" id="gachapon-timer-status" style="margin-top:10px;">가차폰 실행 상태를 불러오는 중...</div>
          </div>
          <!-- hidden draw-mode -->
          <input type="hidden" id="gachapon-draw-mode" value="instant">

          <div style="margin-top:18px;padding:16px;border-radius:14px;background:rgba(255,232,163,0.03);border:1px solid rgba(255,232,163,0.1);">
            <h4 style="color:#FFE8A3;margin:0 0 6px;font-size:13px;">💡 상품 목록 연동 안내</h4>
            <p style="color:var(--muted);font-size:11.5px;line-height:1.5;">가차폰 추첨 상품은 **'추첨 룰렛' 탭의 '추첨 항목 관리'**에 등록하고 체크박스를 선택한 항목들이 실시간으로 자동 연동됩니다. 룰렛 탭에서 상품 항목을 먼저 준비해주세요.</p>
          </div>

          <button id="gachapon-spin" type="button" style="width:100%;margin-top:18px;height:46px;background:linear-gradient(135deg,#FFE8A3,#F4C35E);color:#03070e;font-weight:900;border:0;border-radius:10px;cursor:pointer;">가차 레버 당기기 (순차 추첨)</button>
          <div class="muted" id="gachapon-status" style="margin-top:12px;">가차폰 데이터를 불러오는 중...</div>
        </div>
        <div class="roulette-card">
          <h3>가차폰 참가자 및 결과 <span id="gachapon-participant-count" style="font-size:13px;font-weight:500;color:var(--muted);"></span></h3>
          <div class="roulette-participant-tools">
            <input id="gachapon-roster-search" placeholder="전체명단에서 이름 검색">
            <select id="gachapon-roster-select"></select>
          </div>
          <div style="display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:14px;">
            <button id="gachapon-add-participant" type="button" style="width:100%;margin:0;">가차폰 참가자 추가</button>
            <button id="gachapon-add-all" type="button" style="margin:0;white-space:nowrap;">전체추가</button>
          </div>
          <div class="roulette-result-list" id="gachapon-results"></div>
        </div>
      </div>
    </div>
  </main>
 
  <script>
    // Tab switching controller
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
 
    let roulettePollInterval = null;
    function startRoulettePoll() {
      if (roulettePollInterval) return;
      roulettePollInterval = setInterval(async () => {
        // Only silently refresh participants + results (don't clobber form fields)
        try {
          const response = await fetch("/api/admin/roulette", { cache: "no-store" });
          const data = await response.json();
          if (!response.ok) return;
          rouletteState.participants = data.participants || [];
          rouletteState.results      = data.results      || [];
          rouletteState.roster       = data.roster       || [];
          renderRouletteParticipantsAndResults();
          renderRouletteRosterSelect();
          const status = document.getElementById("roulette-status");
          status.textContent = "선택 항목 " + selectedRouletteItemIds().length + "개 · 룰렛 참가자 " + rouletteState.participants.length + "명";
        } catch (_) {}
      }, 5000);
    }
    function stopRoulettePoll() {
      if (roulettePollInterval) { clearInterval(roulettePollInterval); roulettePollInterval = null; }
    }

    let ladderPollInterval = null;
    function startLadderPoll() {
      if (ladderPollInterval) return;
      ladderPollInterval = setInterval(async () => {
        try {
          const response = await fetch("/api/admin/ladder", { cache: "no-store" });
          const data = await response.json();
          if (!response.ok) return;
          ladderState.participants = data.participants || [];
          ladderState.results      = data.results      || [];
          ladderState.roster       = data.roster       || [];
          renderLadderParticipantsAndResults();
          renderLadderRosterSelect();
          const status = document.getElementById("ladder-status");
          status.textContent = "룰렛 연동 상품 " + (ladderState.settings.roulettePrizes?.selectedItemIds?.length || 0) + "개 · 사다리 참가자 " + ladderState.participants.length + "명";
        } catch (_) {}
      }, 5000);
    }
    function stopLadderPoll() {
      if (ladderPollInterval) { clearInterval(ladderPollInterval); ladderPollInterval = null; }
    }

    let gachaponPollInterval = null;
    function startGachaponPoll() {
      if (gachaponPollInterval) return;
      gachaponPollInterval = setInterval(async () => {
        try {
          const response = await fetch("/api/admin/gachapon", { cache: "no-store" });
          const data = await response.json();
          if (!response.ok) return;
          gachaponState.participants = data.participants || [];
          gachaponState.results      = data.results      || [];
          gachaponState.roster       = data.roster       || [];
          renderGachaponParticipantsAndResults();
          renderGachaponRosterSelect();
          const status = document.getElementById("gachapon-status");
          status.textContent = "룰렛 연동 상품 " + (gachaponState.settings.roulettePrizes?.selectedItemIds?.length || 0) + "개 · 가차폰 참가자 " + gachaponState.participants.length + "명";
        } catch (_) {}
      }, 5000);
    }
    function stopGachaponPoll() {
      if (gachaponPollInterval) { clearInterval(gachaponPollInterval); gachaponPollInterval = null; }
    }

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        const tabName = btn.dataset.tab;
        document.getElementById("tab-" + tabName).classList.add("active");

        if (tabName === "couples") {
          stopRoulettePoll();
          stopLadderPoll();
          stopGachaponPoll();
          loadMatches();
        }
        if (tabName === "roster") {
          stopRoulettePoll();
          stopLadderPoll();
          stopGachaponPoll();
          loadRoster();
        }
        if (tabName === "roulette") {
          stopLadderPoll();
          stopGachaponPoll();
          loadRoulette();
          startRoulettePoll();
        }
        if (tabName === "ladder") {
          stopRoulettePoll();
          stopGachaponPoll();
          loadLadder();
          startLadderPoll();
        }
        if (tabName === "gachapon") {
          stopRoulettePoll();
          stopLadderPoll();
          loadGachapon();
          startGachaponPoll();
        }
        if (tabName !== "roulette" && tabName !== "ladder" && tabName !== "gachapon") {
          stopRoulettePoll();
          stopLadderPoll();
          stopGachaponPoll();
        }
      });
    });
 
    document.getElementById("roster-search").addEventListener("input", renderRosterWithSearch);

    document.querySelector("#logout").addEventListener("click", async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      location.href = "/admin";
    });
 
    // Run Match Engine
    document.getElementById("btn-run-match").addEventListener("click", async () => {
      if (!confirm("모든 참가자 데이터를 대상으로 이분 매칭 엔진을 구동하시겠습니까?\\nGemini API 호출 및 최적화 계산으로 약 5~15초 소요될 수 있습니다.")) {
        return;
      }
 
      const runBtn = document.getElementById("btn-run-match");
      const progressContainer = document.getElementById("engine-progress");
      const progressFill = document.getElementById("engine-progress-fill");
      const statusText = document.getElementById("engine-status");
 
      runBtn.disabled = true;
      runBtn.textContent = "매칭 연산 중...";
      progressContainer.style.display = "block";
      progressFill.style.width = "10%";
      statusText.innerHTML = "<strong>매칭 분석 진행 중:</strong> 참가자 분류 및 궁합 정보를 로드하고 있습니다...";
 
      let width = 10;
      const progressInterval = setInterval(() => {
        if (width < 85) {
          width += Math.floor(Math.random() * 8) + 1;
          progressFill.style.width = width + "%";
        }
      }, 600);
 
      try {
        const response = await fetch("/api/admin/match", { method: "POST" });
        const data = await response.json();
        
        clearInterval(progressInterval);
        
        if (!response.ok) {
          progressFill.style.width = "0%";
          progressContainer.style.display = "none";
          runBtn.disabled = false;
          runBtn.textContent = "일괄 매칭 엔진 실행";
          statusText.innerHTML = \`<span style="color: #f5576c;"><strong>실패:</strong> \${escapeHtml(data.error || "알 수 없는 에러가 발생했습니다.")}</span>\`;
          alert("매칭 실행 오류: " + (data.error || "연산 실패"));
          return;
        }
 
        progressFill.style.width = "100%";
        setTimeout(() => {
          progressContainer.style.display = "none";
          runBtn.disabled = false;
          runBtn.textContent = "일괄 매칭 엔진 실행";
          statusText.innerHTML = \`<span style="color: #FFE8A3;"><strong>성공:</strong> 매칭이 성공적으로 완료되었습니다! (\${data.matchesCount}쌍 매칭 완료, \${data.unmatchedCount}명 보류)</span>\`;
          
          // Switch to couples tab automatically
          document.getElementById("tab-btn-couples").click();
          load();
        }, 800);
 
      } catch (error) {
        clearInterval(progressInterval);
        progressFill.style.width = "0%";
        progressContainer.style.display = "none";
        runBtn.disabled = false;
        runBtn.textContent = "일괄 매칭 엔진 실행";
        statusText.innerHTML = \`<span style="color: #f5576c;"><strong>실패:</strong> 네트워크 서버 통신 오류</span>\`;
      }
    });
 
    let rosterItems = [];
    let rouletteTimerInterval = null;
    let rouletteState = { items: [], participants: [], roster: [], results: [], settings: {} };

    document.getElementById("roster-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = document.getElementById("roster-id").value;
      const payload = {
        displayName: document.getElementById("roster-name").value.trim(),
        gender: document.getElementById("roster-gender").value,
      };
      const status = document.getElementById("roster-status");
      status.textContent = "저장 중...";

      try {
        const response = await fetch(id ? "/api/admin/roster/" + encodeURIComponent(id) : "/api/admin/roster", {
          method: id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "명단 저장 실패");
        resetRosterForm();
        await loadRoster();
        status.textContent = "저장되었습니다.";
      } catch (error) {
        status.textContent = error.message;
      }
    });

    document.getElementById("roster-cancel").addEventListener("click", resetRosterForm);
    document.getElementById("submissions-seed-test").addEventListener("click", async () => {
      const confirmed = confirm(
        "전체 참가자 명단을 기준으로 테스트 신청 데이터를 채울까요?\\n이미 신청된 참가자는 건너뛰고, 비어있는 참가자만 테스트 데이터로 추가됩니다.",
      );
      if (!confirmed) return;
      const button = document.getElementById("submissions-seed-test");
      const status = document.getElementById("submissions-status");
      button.disabled = true;
      button.textContent = "입력 중";
      status.textContent = "전체 참가자 명단 기준으로 테스트 데이터를 입력하는 중...";
      try {
        const response = await fetch("/api/admin/submissions/test-seed", { method: "POST" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "테스트 데이터 입력 실패");
        await load();
        status.textContent = \`테스트 데이터 \${body.created || 0}명 입력 완료 · 기존 신청 \${body.skipped || 0}명 건너뜀\`;
      } catch (error) {
        status.textContent = error.message;
        alert(error.message);
      } finally {
        button.disabled = false;
        button.textContent = "테스트 데이터 넣기";
      }
    });
    document.getElementById("submissions-delete-all").addEventListener("click", async () => {
      const confirmed = confirm(
        "현재 이벤트 참가자 신청 데이터를 전체삭제할까요?\\n마스터 참가자 명단은 유지되며, 삭제된 사람은 다시 신청할 수 있습니다.",
      );
      if (!confirmed) return;
      const button = document.getElementById("submissions-delete-all");
      const status = document.getElementById("submissions-status");
      button.disabled = true;
      button.textContent = "삭제 중";
      status.textContent = "이벤트 참가자 신청 데이터를 전체삭제하는 중...";
      try {
        const response = await fetch("/api/admin/submissions/__all__", { method: "DELETE" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "전체삭제 실패");
        await load();
      } catch (error) {
        status.textContent = error.message;
        alert(error.message);
      } finally {
        button.disabled = false;
        button.textContent = "전체삭제";
      }
    });
    document.getElementById("matches-reset").addEventListener("click", async () => {
      const confirmed = confirm(
        "매칭 결과와 참가자 신청 목록을 모두 초기화할까요?\\n전체 참가자 명단은 유지되지만 신청 데이터, 매칭 결과, 평가/투표 데이터는 삭제됩니다.",
      );
      if (!confirmed) return;
      const button = document.getElementById("matches-reset");
      const status = document.getElementById("matches-status");
      button.disabled = true;
      button.textContent = "초기화 중";
      status.textContent = "매칭 결과를 초기화하는 중...";
      try {
        const response = await fetch("/api/admin/matches", { method: "DELETE" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "초기화 실패");
        await loadMatches();
        await load();
      } catch (error) {
        status.textContent = error.message;
        alert(error.message);
      } finally {
        button.disabled = false;
        button.textContent = "매칭결과 초기화";
      }
    });

    load();
    /* 전체명단 탭 숫자를 페이지 로드 즉시 표시 */
    (async () => {
      try {
        const res = await fetch("/api/admin/roster", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          const active = (data.participants || []).filter(p => p.isActive !== false).length;
          document.getElementById("tab-btn-roster").textContent = "전체명단 (" + active + "명)";
        }
      } catch (_) {}
    })();

    // 1. Load submissions
    async function load() {
      const btnSubs = document.getElementById("tab-btn-subs");
      const rowsArea = document.getElementById("rows-submissions");
      const status = document.getElementById("submissions-status");
      rowsArea.innerHTML = '<tr><td colspan="6" class="muted">불러오는 중...</td></tr>';
      status.textContent = "참가자 목록을 불러오는 중...";
      
      try {
        const response = await fetch("/api/admin/submissions", { cache: "no-store" });
        const body = await response.json();
        
        if (!response.ok) {
          rowsArea.innerHTML = '<tr><td colspan="6">조회 실패</td></tr>';
          btnSubs.textContent = "참가자 목록 (에러)";
          return;
        }
 
        const count = body.submissions.length;
        const maleCount = body.submissions.filter((item) => item.gender === "남").length;
        const femaleCount = body.submissions.filter((item) => item.gender === "여").length;
        btnSubs.textContent = \`참가자 목록 (\${count}명)\`;
        status.textContent = \`신청 완료 \${count}명 · 남자 \${maleCount}명 · 여자 \${femaleCount}명\`;
        
        rowsArea.innerHTML = body.submissions.map(row).join("") || '<tr><td colspan="6" class="muted">제출된 데이터가 없습니다.</td></tr>';
        
        // Setup details toggles
        document.querySelectorAll(".detail-toggle").forEach((button) => {
          button.addEventListener("click", () => {
            const detailRow = document.getElementById(button.dataset.target);
            const isHidden = detailRow.hidden;
            detailRow.hidden = !isHidden;
            button.textContent = isHidden ? "만세력 닫기" : "만세력 보기";
          });
        });
        document.querySelectorAll(".submission-delete").forEach((button) => {
          button.addEventListener("click", async () => {
            const name = button.dataset.name || "해당 참가자";
            if (!confirm(name + " 님의 신청 데이터를 삭제할까요?\\n삭제하면 다시 신청할 수 있습니다.")) return;
            button.disabled = true;
            button.textContent = "삭제 중";
            try {
              const response = await fetch("/api/admin/submissions/" + encodeURIComponent(button.dataset.id), { method: "DELETE" });
              const body = await response.json();
              if (!response.ok) throw new Error(body.error || "삭제 실패");
              await load();
            } catch (error) {
              alert(error.message);
              button.disabled = false;
              button.textContent = "삭제";
            }
          });
        });
      } catch (err) {
        rowsArea.innerHTML = '<tr><td colspan="6">통신 에러 발생</td></tr>';
        btnSubs.textContent = "참가자 목록 (에러)";
      }
    }

    async function loadRoster() {
      const btnRoster = document.getElementById("tab-btn-roster");
      const rowsArea = document.getElementById("rows-roster");
      const status = document.getElementById("roster-status");
      rowsArea.innerHTML = '<tr><td colspan="5" class="muted">불러오는 중...</td></tr>';
      status.textContent = "명단을 불러오는 중...";

      try {
        const response = await fetch("/api/admin/roster", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "명단 조회 실패");
        rosterItems = body.participants || [];
        const activeItems = rosterItems.filter((item) => item.isActive !== false);
        const pendingItems = rosterItems.filter((item) => item.isActive === false);
        const activeCount = activeItems.length;
        const maleCount = activeItems.filter((item) => item.gender === "남").length;
        const femaleCount = activeItems.filter((item) => item.gender === "여").length;
        btnRoster.textContent = \`전체명단 (\${activeCount}명)\`;
        status.textContent = \`활성 \${activeCount}명 · 남자 \${maleCount}명 · 여자 \${femaleCount}명\`;
        renderRosterWithSearch();
        bindRosterActions();
        renderPendingRequests(pendingItems);
      } catch (error) {
        rowsArea.innerHTML = '<tr><td colspan="5">조회 실패</td></tr>';
        status.textContent = error.message;
        btnRoster.textContent = "전체명단 (에러)";
      }
    }

    function renderRosterWithSearch() {
      const keyword = (document.getElementById("roster-search")?.value || "").trim().toLocaleLowerCase("ko");
      const filtered = keyword
        ? rosterItems.filter((item) => item.isActive !== false && (item.displayName || "").toLocaleLowerCase("ko").includes(keyword))
        : rosterItems.filter((item) => item.isActive !== false);
      const rowsArea = document.getElementById("rows-roster");
      rowsArea.innerHTML = filtered.map(rosterRow).join("") || '<tr><td colspan="5" class="muted">검색 결과가 없습니다.</td></tr>';
      bindRosterActions();
    }

    function renderPendingRequests(items) {
      const section = document.getElementById("requests-section");
      const badge = document.getElementById("requests-badge");
      const area = document.getElementById("rows-requests");
      badge.textContent = items.length;
      if (!items.length) {
        section.style.display = "none";
        return;
      }
      section.style.display = "";
      area.innerHTML = items.map((item) => {
        const genderBadge = item.gender
          ? \`<span class="gender-badge \${item.gender === '남' ? 'male' : 'female'}">\${item.gender}</span>\`
          : '<span class="null">N/A</span>';
        return \`
          <div class="request-row">
            <div class="req-name">\${escapeHtml(item.displayName)}</div>
            <div>\${genderBadge}</div>
            <div class="req-time">\${formatDateTime(item.updatedAt)}</div>
            <div class="request-actions">
              <button class="btn-approve req-approve" type="button" data-id="\${escapeHtml(item.id)}" data-name="\${escapeHtml(item.displayName)}" data-gender="\${escapeHtml(item.gender || '')}">✓ 허가</button>
              <button class="btn-reject req-reject" type="button" data-id="\${escapeHtml(item.id)}" data-name="\${escapeHtml(item.displayName)}">✕ 거절</button>
            </div>
          </div>
        \`;
      }).join("");
      bindRequestActions();
    }

    function bindRequestActions() {
      document.querySelectorAll(".req-approve").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const { id, name, gender } = btn.dataset;
          if (!confirm(\`"\${name}" 님을 명단에 추가(활성화)할까요?\`)) return;
          btn.disabled = true;
          const res = await fetch("/api/admin/roster/" + encodeURIComponent(id), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ displayName: name, gender, isActive: true }),
          });
          const body = await res.json();
          if (!res.ok) { alert(body.error || "허가 실패"); btn.disabled = false; return; }
          await loadRoster();
        });
      });
      document.querySelectorAll(".req-reject").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const { id, name } = btn.dataset;
          if (!confirm(\`"\${name}" 님의 추가 요청을 거절(삭제)할까요?\`)) return;
          btn.disabled = true;
          const res = await fetch("/api/admin/roster/" + encodeURIComponent(id), { method: "DELETE" });
          const body = await res.json();
          if (!res.ok) { alert(body.error || "거절 실패"); btn.disabled = false; return; }
          await loadRoster();
        });
      });
    }

    function rosterRow(item) {
      const genderBadge = item.gender
        ? \`<span class="gender-badge \${item.gender === '남' ? 'male' : 'female'}">\${item.gender}</span>\`
        : '<span class="null">N/A</span>';
      return \`
        <tr class="\${item.isActive === false ? "muted" : ""}">
          <td><strong>\${escapeHtml(item.displayName)}</strong></td>
          <td>\${genderBadge}</td>
          <td>\${item.isActive === false ? "비활성" : "활성"}</td>
          <td class="muted">\${formatDateTime(item.updatedAt)}</td>
          <td>
            <div class="roster-actions">
              <button class="btn-secondary roster-edit" type="button" data-id="\${escapeHtml(item.id)}">수정</button>
              <button class="btn-secondary roster-delete" type="button" data-id="\${escapeHtml(item.id)}">삭제</button>
            </div>
          </td>
        </tr>
      \`;
    }

    function bindRosterActions() {
      document.querySelectorAll(".roster-edit").forEach((button) => {
        button.addEventListener("click", () => {
          const item = rosterItems.find((candidate) => candidate.id === button.dataset.id);
          if (!item) return;
          document.getElementById("roster-id").value = item.id;
          document.getElementById("roster-name").value = item.displayName;
          document.getElementById("roster-gender").value = item.gender;
          document.getElementById("roster-name").focus();
        });
      });

      document.querySelectorAll(".roster-delete").forEach((button) => {
        button.addEventListener("click", async () => {
          const item = rosterItems.find((candidate) => candidate.id === button.dataset.id);
          if (!item || !confirm(item.displayName + " 님을 명단에서 비활성 처리할까요?")) return;
          const response = await fetch("/api/admin/roster/" + encodeURIComponent(item.id), { method: "DELETE" });
          const body = await response.json();
          if (!response.ok) {
            alert(body.error || "삭제 실패");
            return;
          }
          await loadRoster();
        });
      });
    }

    function resetRosterForm() {
      document.getElementById("roster-id").value = "";
      document.getElementById("roster-name").value = "";
      document.getElementById("roster-gender").value = "남";
    }
 
    // Render single row
    function row(item, index) {
      const time = item.birthTimeUnknown ? "시간모름" : item.birthTime;
      const saju = item.manse?.saju || {};
      const detailId = "detail-" + index;
      
      const genderBadge = item.gender 
        ? \`<span class="gender-badge \${item.gender === '남' ? 'male' : 'female'}">\${item.gender}</span>\`
        : '<span class="null">N/A</span>';
 
      return \`
        <tr>
          <td class="muted">\${formatDateTime(item.submittedAt)}</td>
          <td><strong>\${escapeHtml(item.displayName)}</strong></td>
          <td>\${genderBadge}</td>
          <td>\${nullableCell(item.mbti, true)}</td>
          <td>\${escapeHtml([saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar].filter(Boolean).join(" / ")) || '<span class="null">N/A</span>'}</td>
          <td>
            <div class="row-actions">
              <button class="detail-toggle btn-secondary" type="button" data-target="\${detailId}">만세력 보기</button>
              <button class="submission-delete btn-secondary btn-danger" type="button" data-id="\${escapeHtml(item.id)}" data-name="\${escapeHtml(item.displayName || "이름 없음")}">삭제</button>
            </div>
          </td>
        </tr>
        <tr id="\${detailId}" class="detail-row" hidden>
          <td colspan="6">
            <div class="detail-panel">
              \${manseChart(item)}
              \${analysisBox(item.geminiAnalysis)}
              <details style="margin-top: 10px;">
                <summary>JSON 상세 데이터</summary>
                <pre>\${escapeHtml(JSON.stringify(item, null, 2))}</pre>
              </details>
            </div>
          </td>
        </tr>
      \`;
    }
 
    // 2. Load matches
    async function loadMatches() {
      const container = document.getElementById("couples-list");
      const unmatchedArea = document.getElementById("unmatched-area");
      const unmatchedList = document.getElementById("unmatched-list");
      const status = document.getElementById("matches-status");
      
      container.innerHTML = '<div class="muted" style="text-align: center; padding: 40px 0;">매칭 결과 로드 중...</div>';
      unmatchedArea.style.display = "none";
      status.textContent = "매칭 결과를 불러오는 중...";
 
      try {
        const response = await fetch("/api/admin/matches", { cache: "no-store" });
        const data = await response.json();
        
        if (!response.ok) {
          container.innerHTML = \`<div style="color: #f5576c; text-align: center; padding: 40px 0;">매칭 결과 로드 실패: \${escapeHtml(data.error)}</div>\`;
          return;
        }
 
        if (!data.matches || data.matches.length === 0) {
          status.textContent = "매칭 결과 없음";
          container.innerHTML = '<div class="muted" style="text-align: center; padding: 40px 0;">아직 완료된 매칭 결과가 없습니다. 우측 상단 엔진을 구동해 매칭을 생성하세요!</div>';
          return;
        }
 
        const matches = data.matches.map(normalizeMatch);
        const unmatched = (data.unmatched || []).map(normalizePerson);
        window.__morasMatches = matches;
        status.textContent = \`매칭 완료 \${matches.length}커플\`;
        container.innerHTML = matches.map((match, index) => coupleCard(match, index)).join("");
        bindMatchDetailButtons();
 
        // Render Unmatched
        if (unmatched.length > 0) {
          unmatchedArea.style.display = "block";
          unmatchedList.innerHTML = unmatched.map(item => {
            const mbtiText = item.mbti ? \`<span class="pill">\${item.mbti}</span>\` : "";
            const genderClass = item.gender === '남' ? 'color: var(--blue)' : 'color: var(--red)';
            return \`
              <div class="unmatched-badge">
                <strong style="\${genderClass}">\${item.gender}</strong>
                <strong>\${escapeHtml(item.displayName)}</strong>
                \${mbtiText}
              </div>
            \`;
          }).join("");
        }
      } catch (err) {
        container.innerHTML = '<div style="color: #f5576c; text-align: center; padding: 40px 0;">네트워크 연결 실패</div>';
      }
      // Load vote deadline
      loadVoteDeadline();
    }

    async function loadVoteDeadline() {
      try {
        const res = await fetch("/api/admin/vote-deadline", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const panel = document.getElementById("vote-deadline-panel");
        const display = document.getElementById("vote-deadline-display");
        const input = document.getElementById("vote-deadline-input");
        if (!data.runId) { panel.style.display = "none"; return; }
        panel.style.display = "block";
        if (data.voteDeadline) {
          const d = new Date(data.voteDeadline);
          const fmt = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0") + " " + String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
          display.textContent = fmt + (d < new Date() ? " (종료)" : "");
          display.style.color = d < new Date() ? "#f87171" : "#F8FAFC";
          // Set input default to current value
          const iso = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0") + "T" + String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
          input.value = iso;
        } else {
          display.textContent = "미설정";
        }
      } catch(e) {}
    }

    document.getElementById("vote-deadline-save").addEventListener("click", async () => {
      const input = document.getElementById("vote-deadline-input");
      const val = input.value;
      if (!val) { alert("마감 시간을 입력해주세요."); return; }
      const btn = document.getElementById("vote-deadline-save");
      btn.disabled = true;
      btn.textContent = "저장 중...";
      try {
        const res = await fetch("/api/admin/vote-deadline", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voteDeadline: new Date(val).toISOString() }),
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || "저장 실패"); return; }
        await loadVoteDeadline();
        alert("마감 시간이 저장되었습니다.");
      } catch(e) { alert("서버 오류"); }
      finally { btn.disabled = false; btn.textContent = "저장"; }
    });


    function normalizeMatch(match) {
      return {
        ...match,
        male: normalizePerson(match.male),
        female: normalizePerson(match.female),
      };
    }

    function normalizePerson(person) {
      return {
        ...person,
        displayName: person?.displayName || person?.display_name || "이름 없음",
        gender: person?.gender || "",
        mbti: person?.mbti || "",
        manse: person?.manse || person?.manse_result || null,
      };
    }
 
    function coupleCard(c, index) {
      const isTop = c.is_top_match;
      const highlightClass = isTop ? "gold-highlight" : "";
      const score = Math.round(c.average_score);
      const detail = c.score_detail || {};
      const relationType = detail.relationshipType || "균형 탐색형";
      const mbtiScore = scoreNumber(detail.mbtiScore);
      const sajuScore = scoreNumber(detail.sajuScore);
      const consistencyScore = scoreNumber(detail.consistencyScore);
      
      return \`
        <div class="couple-card \${highlightClass}">
          <div class="couple-rank-box">
            <div class="couple-rank">\${c.rank}위</div>
            \${isTop ? '<div style="font-size:10px; font-weight:800; color:#FFE8A3; margin-top:2px;">BEST COUPLE</div>' : ""}
          </div>
          
          <!-- 남성 정보 -->
          <div class="couple-participant male">
            <div class="cp-header">
              <span class="cp-name">\${escapeHtml(c.male.displayName)} (\${c.male.mbti || "N/A"})</span>
            </div>
            <div class="cp-saju">
              \${escapeHtml([c.male.manse?.saju?.yearPillar, c.male.manse?.saju?.monthPillar, c.male.manse?.saju?.dayPillar, c.male.manse?.saju?.hourPillar].filter(Boolean).join(" / ")) || "사주 정보 없음"}
            </div>
          </div>
 
          <!-- 여성 정보 -->
          <div class="couple-participant female">
            <div class="cp-header">
              <span class="cp-name">\${escapeHtml(c.female.displayName)} (\${c.female.mbti || "N/A"})</span>
            </div>
            <div class="cp-saju">
              \${escapeHtml([c.female.manse?.saju?.yearPillar, c.female.manse?.saju?.monthPillar, c.female.manse?.saju?.dayPillar, c.female.manse?.saju?.hourPillar].filter(Boolean).join(" / ")) || "사주 정보 없음"}
            </div>
          </div>
 
          <!-- 궁합 점수 -->
          <div class="couple-score-box">
            <div>
              <div class="couple-score">\${score}<span>점</span></div>
              <div class="relation-type">\${escapeHtml(relationType)}</div>
            </div>
            <div class="score-chips">
              <span class="score-chip">MBTI <strong>\${mbtiScore}</strong></span>
              <span class="score-chip">사주 <strong>\${sajuScore}</strong></span>
              <span class="score-chip">편차보정 <strong>\${consistencyScore}</strong></span>
            </div>
          </div>

          <div class="couple-actions">
            <button class="btn-detail" type="button" data-match-index="\${index}">상세보기</button>
          </div>
        </div>
        \${matchDetailPanel(c, index)}
      \`;
    }

    function matchDetailPanel(c, index) {
      const detail = c.score_detail || {};
      const score = Math.round(c.average_score || detail.finalScore || 0);
      const title = \`\${c.rank}위 매칭 상세: \${c.male.displayName} × \${c.female.displayName}\`;
      const formula = \`
        <div class="score-formula-box">
          <strong>점수 계산</strong><br>
          MBTI 상호 궁합 \${scoreNumber(detail.mbtiScore)}점 + 사주 상호 궁합 \${scoreNumber(detail.sajuScore)}점의 평균은 \${scoreNumber(detail.baseScore)}점입니다.<br>
          두 점수의 차이는 \${scoreNumber(detail.rawDeviation)}점이며, 이번 전체 후보 조합의 최대 편차 \${scoreNumber(detail.maxDeviation)}점을 기준으로 편차 보정 \${scoreNumber(detail.consistencyScore)}점이 적용되었습니다.<br>
          최종 점수는 기본 평균 90%와 편차 보정 10%를 합산해 \${score}점으로 표시합니다.
        </div>
      \`;
      return \`
        <section class="match-detail-panel" id="match-detail-\${index}">
          <div class="print-only-title">Moras 매칭 결과 상세</div>
          <div class="match-detail-head">
            <div>
              <h3>\${escapeHtml(title)}</h3>
              <div class="muted">\${escapeHtml(detail.narrative || "MBTI와 만세력 흐름을 함께 반영한 매칭 결과입니다.")}</div>
            </div>
            <button class="btn-detail no-print" type="button" data-print-match="\${index}">PDF로 저장</button>
          </div>
          \${formula}
          <div class="match-detail-grid">
            <div class="match-person-detail">
              <h4>남자 · \${escapeHtml(c.male.displayName)} (\${escapeHtml(c.male.mbti || "N/A")})</h4>
              \${manseChart(c.male)}
            </div>
            <div class="match-person-detail">
              <h4>여자 · \${escapeHtml(c.female.displayName)} (\${escapeHtml(c.female.mbti || "N/A")})</h4>
              \${manseChart(c.female)}
            </div>
          </div>
        </section>
      \`;
    }

    function bindMatchDetailButtons() {
      document.querySelectorAll("[data-match-index]").forEach((button) => {
        button.addEventListener("click", () => {
          const target = document.getElementById("match-detail-" + button.dataset.matchIndex);
          if (!target) return;
          target.classList.toggle("open");
          button.textContent = target.classList.contains("open") ? "닫기" : "상세보기";
          if (target.classList.contains("open")) {
            target.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      });
      document.querySelectorAll("[data-print-match]").forEach((button) => {
        button.addEventListener("click", () => {
          document.querySelectorAll(".match-detail-panel").forEach((panel) => panel.classList.remove("print-target"));
          const target = document.getElementById("match-detail-" + button.dataset.printMatch);
          if (!target) return;
          target.classList.add("open", "print-target");
          const match = window.__morasMatches?.[Number(button.dataset.printMatch)];
          if (match?.male?.displayName && match?.female?.displayName) {
            document.title = \`Moras 매칭결과 - \${match.male.displayName} \${match.female.displayName}\`;
          }
          window.print();
          setTimeout(() => target.classList.remove("print-target"), 300);
        });
      });
    }

    function scoreNumber(value) {
      if (value === null || value === undefined || value === "") return "-";
      const number = Number(value);
      if (!Number.isFinite(number)) return "-";
      return String(Math.round(number));
    }

    function toDateTimeLocalValue(value) {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      const pad = (number) => String(number).padStart(2, "0");
      return date.getFullYear() + "-" +
        pad(date.getMonth() + 1) + "-" +
        pad(date.getDate()) + "T" +
        pad(date.getHours()) + ":" +
        pad(date.getMinutes());
    }

    /* ── 이벤트 이름 저장 ── */
    document.getElementById("roulette-name-save").addEventListener("click", async () => {
      const status = document.getElementById("roulette-status");
      const eventName = document.getElementById("roulette-event-name").value.trim();
      if (!eventName) { status.textContent = "이벤트 이름을 입력해주세요."; return; }
      status.textContent = "이벤트 이름 저장 중...";
      const res = await fetch("/api/admin/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          eventName,
          startsAt: (rouletteState.settings.starts_at || rouletteState.settings.startsAt) ?? null,
          drawMode: rouletteState.settings.draw_mode || rouletteState.settings.drawMode || "instant",
          selectedItemIds: selectedRouletteItemIds(),
        }),
      });
      const data = await res.json();
      status.textContent = res.ok ? "이벤트 이름이 저장되었습니다." : (data.error || "저장 실패");
      if (res.ok) await loadRoulette();
    });

    /* ── 타이머룰렛 시작 ── */
    document.getElementById("roulette-timer-start").addEventListener("click", async () => {
      const status = document.getElementById("roulette-status");
      const startsAtValue = document.getElementById("roulette-start-time").value;
      if (!startsAtValue) { status.textContent = "시작 예정 시간을 설정해주세요."; return; }
      const selectedItemIds = selectedRouletteItemIds();
      if (!selectedItemIds.length) { status.textContent = "추첨 항목을 하나 이상 선택해주세요."; return; }
      status.textContent = "타이머 자동실행 설정 중...";
      const res = await fetch("/api/admin/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          eventName: document.getElementById("roulette-event-name").value.trim(),
          startsAt: new Date(startsAtValue).toISOString(),
          drawMode: "timer",
          selectedItemIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) { status.textContent = data.error || "저장 실패"; return; }
      document.getElementById("roulette-draw-mode").value = "timer";
      status.textContent = "타이머 자동실행이 설정되었습니다.";
      await loadRoulette();
    });

    /* ── 시작시간 입력 변경 시 대형 표시 업데이트 ── */
    document.getElementById("roulette-start-time").addEventListener("input", updateTimerDisplay);
    function updateTimerDisplay() {
      const val = document.getElementById("roulette-start-time").value;
      const clock = document.getElementById("roulette-timer-clock");
      const countdown = document.getElementById("roulette-timer-countdown");
      if (!val) { clock.textContent = "–"; countdown.textContent = ""; return; }
      const d = new Date(val);
      clock.textContent = d.getFullYear() + ". " +
        String(d.getMonth()+1).padStart(2,"0") + ". " +
        String(d.getDate()).padStart(2,"0") + ".  " +
        String(d.getHours()).padStart(2,"0") + ":" +
        String(d.getMinutes()).padStart(2,"0");
      const diff = d.getTime() - Date.now();
      countdown.textContent = diff > 0
        ? "(" + formatCountdownText(diff) + " 후 시작)"
        : "(이미 지난 시간)";
    }

    document.getElementById("roulette-item-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.getElementById("roulette-item-label");
      const label = input.value.trim();
      if (!label) return;
      const status = document.getElementById("roulette-status");
      status.textContent = "추첨 항목을 저장하는 중...";
      const response = await fetch("/api/admin/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createItem", label }),
      });
      const data = await response.json();
      if (!response.ok) {
        status.textContent = data.error || "추첨 항목 저장에 실패했습니다.";
        return;
      }
      input.value = "";
      await loadRoulette();
    });

    document.getElementById("roulette-roster-search").addEventListener("input", renderRouletteRosterSelect);
    document.getElementById("roulette-add-participant").addEventListener("click", async () => {
      const select = document.getElementById("roulette-roster-select");
      const status = document.getElementById("roulette-status");
      if (!select.value) {
        status.textContent = "추가할 참가자를 먼저 선택해주세요.";
        return;
      }
      status.textContent = "룰렛 참가자를 추가하는 중...";
      const response = await fetch("/api/admin/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addParticipant", rosterParticipantId: select.value }),
      });
      const data = await response.json();
      if (!response.ok) {
        status.textContent = data.error || "참가자 추가 실패";
        return;
      }
      document.getElementById("roulette-roster-search").value = "";
      await loadRoulette();
    });

    document.getElementById("roulette-reset-results").addEventListener("click", async () => {
      if (!confirm("추첨 결과와 진행 상태만 초기화할까요?\\n참가자 명단은 그대로 유지됩니다.")) return;
      const status = document.getElementById("roulette-status");
      status.textContent = "룰렛 결과 초기화 중...";
      const response = await fetch("/api/admin/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetResults" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "초기화 실패"; return; }
      status.textContent = "추첨 결과가 초기화되었습니다. (참가자 유지)";
      await loadRoulette();
    });

    document.getElementById("roulette-reset").addEventListener("click", async () => {
      if (!confirm("참가자, 추첨 결과, 타이머, 선택항목을 전부 초기화할까요?\\n추첨 항목 목록은 유지됩니다.")) return;
      const status = document.getElementById("roulette-status");
      status.textContent = "전체 룰렛 초기화 중...";
      const response = await fetch("/api/admin/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetRoulette" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "전체 초기화 실패"; return; }
      status.textContent = "룰렛이 전체 초기화되었습니다.";
      await loadRoulette();
    });

    document.getElementById("roulette-add-all").addEventListener("click", async () => {
      if (!confirm("전체 참가자 명단(활성)을 모두 룰렛에 추가할까요?\\n이미 추가된 참가자는 건너뜁니다.")) return;
      const status = document.getElementById("roulette-status");
      status.textContent = "전체 참가자를 룰렛에 추가하는 중...";
      const response = await fetch("/api/admin/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addAllParticipants" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "전체 추가 실패"; return; }
      status.textContent = (data.added || 0) + "명이 룰렛에 추가되었습니다.";
      await loadRoulette();
    });

    document.getElementById("roulette-spin").addEventListener("click", async () => {
      const wheel = document.getElementById("roulette-wheel");
      const status = document.getElementById("roulette-status");
      const selectedItemIds = selectedRouletteItemIds();
      if (!selectedItemIds.length) {
        status.textContent = "먼저 추첨 항목을 하나 이상 선택해주세요.";
        return;
      }
      if (!rouletteState.participants.length) {
        status.textContent = "룰렛 참가자를 먼저 추가해주세요.";
        return;
      }
      wheel.textContent = "SPIN";
      status.textContent = "다음 추첨 항목을 돌리는 중...";
      const response = await fetch("/api/admin/roulette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "spin", selectedItemIds }),
      });
      const data = await response.json();
      if (!response.ok) {
        status.textContent = data.error || "추첨에 실패했습니다.";
        wheel.textContent = "READY";
        return;
      }
      const count = data.count ?? 0;
      const winners = data.winners || [];
      const winnerNames = winners.map(function(w) { return w.display_name || w.displayName || "당첨자"; }).join(", ");
      wheel.textContent = count > 0 ? (count === 1 ? (winners[0]?.display_name || winners[0]?.displayName || "당첨") : count + "개 완료") : "DONE";
      status.textContent = count > 0 ? (winnerNames + " 당첨!") : "이미 모든 추첨이 완료되었습니다.";
      await loadRoulette();
    });

    async function loadRoulette() {
      const status = document.getElementById("roulette-status");
      status.textContent = "추첨 데이터를 불러오는 중...";
      try {
        const response = await fetch("/api/admin/roulette", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          status.textContent = data.error || "추첨 데이터를 불러오지 못했습니다.";
          return;
        }
        rouletteState = {
          items: data.items || [],
          participants: data.participants || [],
          roster: data.roster || [],
          results: data.results || [],
          settings: data.settings || {},
        };
        const settings = rouletteState.settings;
        document.getElementById("roulette-event-name").value = settings.event_name || settings.eventName || "";
        document.getElementById("roulette-start-time").value = toDateTimeLocalValue(settings.starts_at || settings.startsAt);
        document.getElementById("roulette-draw-mode").value = settings.draw_mode || settings.drawMode || "instant";
        updateTimerDisplay();
        renderRouletteItemChecks();
        renderRouletteRosterSelect();
        renderRouletteParticipantsAndResults();
        updateRouletteTimerStatus(settings, rouletteState.items);
        status.textContent = "선택 항목 " + selectedRouletteItemIds().length + "개 · 룰렛 참가자 " + rouletteState.participants.length + "명";
      } catch (error) {
        status.textContent = "네트워크 연결 실패";
      }
    }

    function selectedRouletteItemIds() {
      return Array.from(document.querySelectorAll(".roulette-item-check:checked")).map((input) => input.value);
    }

    function renderRouletteItemChecks() {
      const selected = new Set(rouletteState.settings.selected_item_ids || rouletteState.settings.selectedItemIds || []);
      const checks = document.getElementById("roulette-item-checks");
      checks.innerHTML = rouletteState.items.length
        ? rouletteState.items.map((item) =>
            '<label class="roulette-check">'
            + '<input class="roulette-item-check" type="checkbox" value="' + escapeHtml(item.id) + '" ' + (selected.has(item.id) ? "checked" : "") + '>'
            + '<span class="check-label">' + escapeHtml(item.label) + '</span>'
            + '<button type="button" class="btn-del-item" data-item-id="' + escapeHtml(item.id) + '" title="삭제">×</button>'
            + '</label>').join("")
        : '<div class="muted">등록된 추첨 항목이 없습니다.</div>';
      /* Auto-save selected items on every checkbox change */
      document.querySelectorAll(".roulette-item-check").forEach((input) => {
        input.addEventListener("change", async () => {
          renderRouletteBoardPreview();
          await autoSaveSelectedItems();
        });
      });
      /* Delete buttons */
      document.querySelectorAll(".btn-del-item").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          const itemId = btn.dataset.itemId;
          if (!itemId) return;
          const status = document.getElementById("roulette-status");
          status.textContent = "항목 삭제 중...";
          const res = await fetch("/api/admin/roulette/" + encodeURIComponent(itemId), { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) { status.textContent = data.error || "삭제 실패"; return; }
          await loadRoulette();
        });
      });
      renderRouletteBoardPreview();
    }

    async function autoSaveSelectedItems() {
      const selectedItemIds = selectedRouletteItemIds();
      const status = document.getElementById("roulette-status");
      try {
        const res = await fetch("/api/admin/roulette", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "saveSettings",
            eventName: document.getElementById("roulette-event-name").value.trim(),
            startsAt: document.getElementById("roulette-start-time").value
              ? new Date(document.getElementById("roulette-start-time").value).toISOString() : null,
            drawMode: document.getElementById("roulette-draw-mode").value,
            selectedItemIds,
          }),
        });
        const data = await res.json();
        if (res.ok && data.settings) {
          rouletteState.settings = { ...rouletteState.settings, selected_item_ids: selectedItemIds };
        }
        status.textContent = "선택 항목 " + selectedItemIds.length + "개 · 룰렛 참가자 " + rouletteState.participants.length + "명";
      } catch (_) {}
    }

    function renderRouletteBoardPreview() {
      const selected = new Set(selectedRouletteItemIds());
      const pool = document.getElementById("roulette-mini-pool");
      const selectedItems = rouletteState.items.filter((item) => selected.has(item.id));
      pool.innerHTML = selectedItems.length
        ? selectedItems.map((item) => '<span class="pill">' + escapeHtml(item.label) + '</span>').join("")
        : '<span class="muted">체크한 추첨 항목이 공개 룰렛 상단에서 회전합니다.</span>';
    }

    function renderRouletteRosterSelect() {
      const select = document.getElementById("roulette-roster-select");
      const keyword = document.getElementById("roulette-roster-search").value.trim().toLocaleLowerCase("ko");
      const activeRosterIds = new Set(rouletteState.participants.map((item) => item.roster_participant_id).filter(Boolean));
      const candidates = rouletteState.roster
        .filter((item) => !activeRosterIds.has(item.id))
        .filter((item) => !keyword || item.displayName.toLocaleLowerCase("ko").includes(keyword));
      select.innerHTML = candidates.length
        ? candidates.slice(0, 40).map((item) => '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(item.displayName) + ' · ' + escapeHtml(item.gender || "") + '</option>').join("")
        : '<option value="">추가 가능한 참가자 없음</option>';
    }

    function renderRouletteParticipantsAndResults() {
      const results = document.getElementById("roulette-results");
      const countEl = document.getElementById("roulette-participant-count");
      if (countEl) {
        const n = rouletteState.participants.length;
        countEl.textContent = n ? "(" + n + "명)" : "";
      }
      const byParticipant = new Map();
      rouletteState.results.forEach((row) => {
        const participant = row.participant || {};
        const id = row.roulette_participant_id || participant.id;
        if (id && !byParticipant.has(id)) byParticipant.set(id, row);
      });
      results.innerHTML = rouletteState.participants.length
        ? rouletteState.participants.map((participant) => {
            const row = byParticipant.get(participant.id);
            const itemLabel = row?.item?.label || "대기";
            const wonAt = row ? formatDateTime(row.created_at || row.createdAt) : "";
            return '<div class="roulette-roster-row"><div><strong>' + escapeHtml(participant.display_name || participant.displayName || "이름 없음") + '</strong><span class="muted"> · ' + escapeHtml(participant.gender || "") + '</span><div class="muted" style="font-size:12px;">' + escapeHtml(itemLabel) + (wonAt ? " · " + escapeHtml(wonAt) : "") + '</div></div><span class="pill">' + (row ? "당첨" : "대기") + '</span><button class="btn-secondary roulette-remove-participant" type="button" data-id="' + escapeHtml(participant.id) + '">제외</button></div>';
          }).join("")
        : '<div class="muted" style="padding:24px 0; text-align:center;">룰렛 참가자를 추가해주세요.</div>';
      document.querySelectorAll(".roulette-remove-participant").forEach((button) => {
        button.addEventListener("click", async () => {
          const status = document.getElementById("roulette-status");
          const response = await fetch("/api/admin/roulette", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "removeParticipant", participantId: button.dataset.id }),
          });
          const data = await response.json();
          if (!response.ok) {
            status.textContent = data.error || "참가자 제외 실패";
            return;
          }
          await loadRoulette();
        });
      });
    }

    function updateRouletteTimerStatus(settings, items) {
      clearInterval(rouletteTimerInterval);
      const target = document.getElementById("roulette-timer-status");
      const drawMode = settings.draw_mode || settings.drawMode || "instant";
      const startValue = settings.starts_at || settings.startsAt;
      const executedAt = settings.sequence_completed_at || settings.auto_spin_executed_at || settings.autoSpinExecutedAt;
      const selectedIds = new Set(settings.selected_item_ids || settings.selectedItemIds || []);
      const selectedItems = items.filter((entry) => selectedIds.has(entry.id));
      const itemText = selectedItems.length ? " · 추첨 항목: " + escapeHtml(selectedItems.map((item) => item.label).join(", ")) : "";

      if (drawMode !== "timer") {
        target.innerHTML = "현재 방식: <strong>즉시 돌리기</strong> · 룰렛 돌리기 버튼을 누르면 선택 항목이 차례로 실행됩니다." + itemText;
        return;
      }
      if (!startValue) {
        target.innerHTML = "현재 방식: <strong>타이머 자동 실행</strong> · 시작 예정 시간을 설정해주세요.";
        return;
      }
      if (executedAt) {
        target.innerHTML = "자동 순차 추첨 완료 · <strong>" + escapeHtml(formatDateTime(executedAt)) + "</strong>" + itemText;
        return;
      }

      const render = () => {
        const diff = new Date(startValue).getTime() - Date.now();
        if (Number.isNaN(diff)) {
          target.innerHTML = "타이머 시간이 올바르지 않습니다.";
          return;
        }
        if (diff <= 0) {
          target.innerHTML = "자동 순차 추첨 진행 중 · 공개 룰렛 페이지/API가 8초 간격으로 결과를 생성합니다." + itemText;
          clearInterval(rouletteTimerInterval);
          return;
        }
        target.innerHTML = "현재 방식: <strong>타이머 자동 실행</strong> · 시작까지 <strong>" + formatCountdownText(diff) + "</strong>" + itemText;
      };
      render();
      rouletteTimerInterval = setInterval(render, 1000);
    }
 
    // Helper functions
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
      const core = Array.isArray(analysis.manse_core)
        ? analysis.manse_core.map((item) => (item.label || "해석") + ": " + (item.text || "")).join(" / ")
        : "";
      const summary = analysis.analysis_summary || analysis.opening_summary || analysis.what_person || "";
      return \`
        <div class="analysis-box">
          <strong>Gemini AI 사주 분석 코멘트</strong>
          <div>\${escapeHtml(summary)}</div>
          \${core ? '<div style="margin-top:8px;"><strong>만세력 핵심:</strong> ' + escapeHtml(core) + '</div>' : ""}
          \${keywords ? '<div style="margin-top:8px;"><strong>강점 키워드:</strong> ' + escapeHtml(keywords) + '</div>' : ""}
          \${analysis.relationship_style ? '<div style="margin-top:4px;"><strong>관계 스타일:</strong> ' + escapeHtml(analysis.relationship_style) + '</div>' : ""}
          \${cautions ? '<div style="margin-top:4px;"><strong>참고 및 유의사항:</strong> ' + escapeHtml(cautions) + '</div>' : ""}
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
      return new Date(value).toLocaleString("ko-KR", { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    function formatCountdownText(ms) {
      const total = Math.max(0, Math.floor(ms / 1000));
      const days = Math.floor(total / 86400);
      const hours = Math.floor((total % 86400) / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      const parts = [];
      if (days) parts.push(days + "일");
      parts.push(String(hours).padStart(2, "0") + "시간");
      parts.push(String(minutes).padStart(2, "0") + "분");
      parts.push(String(seconds).padStart(2, "0") + "초");
      return parts.join(" ");
    }
 
    /* ── LADDER GAME CONTROLLER ── */
    let ladderState = { participants: [], roster: [], results: [], settings: {} };
    let ladderTimerInterval = null;

    /* ── 사다리 이벤트 이름 저장 ── */
    document.getElementById("ladder-name-save").addEventListener("click", async () => {
      const status = document.getElementById("ladder-status");
      const eventName = document.getElementById("ladder-event-name").value.trim();
      if (!eventName) { status.textContent = "이벤트 이름을 입력해주세요."; return; }
      status.textContent = "사다리 이벤트 이름 저장 중...";
      const res = await fetch("/api/admin/ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          eventName,
          startsAt: (ladderState.settings.starts_at || ladderState.settings.startsAt) ?? null,
          drawMode: ladderState.settings.draw_mode || ladderState.settings.drawMode || "instant",
        }),
      });
      const data = await res.json();
      status.textContent = res.ok ? "이벤트 이름이 저장되었습니다." : (data.error || "저장 실패");
      if (res.ok) await loadLadder();
    });

    /* ── 타이머 자동실행 시작 ── */
    document.getElementById("ladder-timer-start").addEventListener("click", async () => {
      const status = document.getElementById("ladder-status");
      const startsAtValue = document.getElementById("ladder-start-time").value;
      if (!startsAtValue) { status.textContent = "시작 예정 시간을 설정해주세요."; return; }
      status.textContent = "타이머 자동실행 설정 중...";
      const res = await fetch("/api/admin/ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          eventName: document.getElementById("ladder-event-name").value.trim(),
          startsAt: new Date(startsAtValue).toISOString(),
          drawMode: "timer",
        }),
      });
      const data = await res.json();
      if (!res.ok) { status.textContent = data.error || "저장 실패"; return; }
      document.getElementById("ladder-draw-mode").value = "timer";
      status.textContent = "타이머 자동실행이 설정되었습니다.";
      await loadLadder();
    });

    /* ── 시작시간 입력 변경 시 대형 표시 업데이트 ── */
    document.getElementById("ladder-start-time").addEventListener("input", updateLadderTimerDisplay);
    function updateLadderTimerDisplay() {
      const val = document.getElementById("ladder-start-time").value;
      const clock = document.getElementById("ladder-timer-clock");
      const countdown = document.getElementById("ladder-timer-countdown");
      if (!val) { clock.textContent = "–"; countdown.textContent = ""; return; }
      const d = new Date(val);
      clock.textContent = d.getFullYear() + ". " +
        String(d.getMonth()+1).padStart(2,"0") + ". " +
        String(d.getDate()).padStart(2,"0") + ".  " +
        String(d.getHours()).padStart(2,"0") + ":" +
        String(d.getMinutes()).padStart(2,"0");
      const diff = d.getTime() - Date.now();
      countdown.textContent = diff > 0
        ? "(" + formatCountdownText(diff) + " 후 시작)"
        : "(이미 지난 시간)";
    }

    document.getElementById("ladder-bounce-mode-save").addEventListener("click", async () => {
      const status = document.getElementById("ladder-status");
      status.textContent = "애니메이션 방식 저장 중...";
      const res = await fetch("/api/admin/ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          eventName: document.getElementById("ladder-event-name").value.trim(),
          startsAt: (ladderState.settings.starts_at || ladderState.settings.startsAt) ?? null,
          drawMode: ladderState.settings.draw_mode || "instant",
          bounceMode: document.getElementById("ladder-bounce-mode").value,
        }),
      });
      const data = await res.json();
      status.textContent = res.ok ? "애니메이션 방식이 저장되었습니다." : (data.error || "저장 실패");
      if (res.ok) await loadLadder();
    });

    document.getElementById("ladder-roster-search").addEventListener("input", renderLadderRosterSelect);
    document.getElementById("ladder-add-participant").addEventListener("click", async () => {
      const select = document.getElementById("ladder-roster-select");
      const status = document.getElementById("ladder-status");
      if (!select.value) {
        status.textContent = "추가할 참가자를 먼저 선택해주세요.";
        return;
      }
      status.textContent = "사다리 참가자를 추가하는 중...";
      const response = await fetch("/api/admin/ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addParticipant", rosterParticipantId: select.value }),
      });
      const data = await response.json();
      if (!response.ok) {
        status.textContent = data.error || "참가자 추가 실패";
        return;
      }
      document.getElementById("ladder-roster-search").value = "";
      await loadLadder();
    });

    document.getElementById("ladder-reset-results").addEventListener("click", async () => {
      if (!confirm("사다리 매칭 결과와 진행 상태만 초기화할까요?\\n참가자 명단은 그대로 유지됩니다.")) return;
      const status = document.getElementById("ladder-status");
      status.textContent = "사다리 결과 초기화 중...";
      const response = await fetch("/api/admin/ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetResults" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "초기화 실패"; return; }
      status.textContent = "사다리 매칭 결과가 초기화되었습니다. (참가자 유지)";
      await loadLadder();
    });

    document.getElementById("ladder-reset").addEventListener("click", async () => {
      if (!confirm("참가자, 매칭 결과, 타이머 세팅을 전부 초기화할까요?\\n상품 정보는 룰렛 탭에 그대로 보존됩니다.")) return;
      const status = document.getElementById("ladder-status");
      status.textContent = "전체 사다리 초기화 중...";
      const response = await fetch("/api/admin/ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetLadder" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "전체 초기화 실패"; return; }
      status.textContent = "사다리타기가 전체 초기화되었습니다.";
      await loadLadder();
    });

    document.getElementById("ladder-add-all").addEventListener("click", async () => {
      if (!confirm("전체 참가자 명단(활성)을 모두 사다리타기에 추가할까요?\\n이미 추가된 참가자는 건너뜁니다.")) return;
      const status = document.getElementById("ladder-status");
      status.textContent = "전체 참가자를 사다리에 추가하는 중...";
      const response = await fetch("/api/admin/ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addAllParticipants" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "전체 추가 실패"; return; }
      status.textContent = (data.added || 0) + "명이 사다리타기에 추가되었습니다.";
      await loadLadder();
    });

    document.getElementById("ladder-spin").addEventListener("click", async () => {
      const status = document.getElementById("ladder-status");
      if (!ladderState.participants.length) {
        status.textContent = "사다리 참가자를 먼저 추가해주세요.";
        return;
      }
      status.textContent = "다음 사다리 당첨 대상을 뽑는 중...";
      const response = await fetch("/api/admin/ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "spin" }),
      });
      const data = await response.json();
      if (!response.ok) {
        status.textContent = data.error || "추첨에 실패했습니다.";
        return;
      }
      const winner = data.winner || {};
      const wName = winner.display_name || winner.displayName || "당첨자";
      status.textContent = wName + " 님 사다리 출발 결과 생성! 상품: " + (data.result?.prize_label || "당첨");
      await loadLadder();
    });

    async function loadLadder() {
      const status = document.getElementById("ladder-status");
      status.textContent = "사다리 데이터를 불러오는 중...";
      try {
        const response = await fetch("/api/admin/ladder", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          status.textContent = data.error || "사다리 데이터를 불러오지 못했습니다.";
          return;
        }
        ladderState = {
          participants: data.participants || [],
          roster: data.roster || [],
          results: data.results || [],
          settings: data.settings || {},
        };
        const settings = ladderState.settings;
        document.getElementById("ladder-event-name").value = settings.event_name || "";
        document.getElementById("ladder-start-time").value = toDateTimeLocalValue(settings.starts_at || settings.startsAt);
        document.getElementById("ladder-draw-mode").value = settings.draw_mode || "instant";
        document.getElementById("ladder-bounce-mode").value = settings.bounce_mode || "random";
        updateLadderTimerDisplay();
        renderLadderRosterSelect();
        renderLadderParticipantsAndResults();
        updateLadderTimerStatus(settings);
        status.textContent = "룰렛 연동 상품 " + (settings.roulettePrizes?.selectedItemIds?.length || 0) + "개 · 사다리 참가자 " + ladderState.participants.length + "명";
      } catch (error) {
        status.textContent = "네트워크 연결 실패";
      }
    }

    function renderLadderRosterSelect() {
      const select = document.getElementById("ladder-roster-select");
      const keyword = document.getElementById("ladder-roster-search").value.trim().toLocaleLowerCase("ko");
      const activeRosterIds = new Set(ladderState.participants.map((item) => item.roster_participant_id).filter(Boolean));
      const candidates = ladderState.roster
        .filter((item) => !activeRosterIds.has(item.id))
        .filter((item) => !keyword || item.displayName.toLocaleLowerCase("ko").includes(keyword));
      select.innerHTML = candidates.length
        ? candidates.slice(0, 40).map((item) => '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(item.displayName) + ' · ' + escapeHtml(item.gender || "") + '</option>').join("")
        : '<option value="">추가 가능한 참가자 없음</option>';
    }

    function renderLadderParticipantsAndResults() {
      const results = document.getElementById("ladder-results");
      const countEl = document.getElementById("ladder-participant-count");
      if (countEl) {
        const n = ladderState.participants.length;
        countEl.textContent = n ? "(" + n + "명)" : "";
      }
      const byParticipant = new Map();
      ladderState.results.forEach((row) => {
        const participant = row.participant || {};
        const id = row.ladder_participant_id || participant.id;
        if (id && !byParticipant.has(id)) byParticipant.set(id, row);
      });
      results.innerHTML = ladderState.participants.length
        ? ladderState.participants.map((participant) => {
            const row = byParticipant.get(participant.id);
            const wonAt = row ? formatDateTime(row.created_at || row.createdAt) : "";
            const wonText = row ? "매칭: " + row.prize_label : "대기";
            return '<div class="roulette-roster-row"><div><strong>' + escapeHtml(participant.display_name || participant.displayName || "이름 없음") + '</strong><span class="muted"> · ' + escapeHtml(participant.gender || "") + '</span><div class="muted" style="font-size:12px;">' + escapeHtml(wonText) + (wonAt ? " · " + escapeHtml(wonAt) : "") + '</div></div><span class="pill">' + (row ? "완료" : "대기") + '</span><button class="btn-secondary ladder-remove-participant" type="button" data-id="' + escapeHtml(participant.id) + '">제외</button></div>';
          }).join("")
        : '<div class="muted" style="padding:24px 0; text-align:center;">사다리 참가자를 추가해주세요.</div>';
      document.querySelectorAll(".ladder-remove-participant").forEach((button) => {
        button.addEventListener("click", async () => {
          const status = document.getElementById("ladder-status");
          const response = await fetch("/api/admin/ladder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "removeParticipant", participantId: button.dataset.id }),
          });
          const data = await response.json();
          if (!response.ok) {
            status.textContent = data.error || "참가자 제외 실패";
            return;
          }
          await loadLadder();
        });
      });
    }

    function updateLadderTimerStatus(settings) {
      clearInterval(ladderTimerInterval);
      const target = document.getElementById("ladder-timer-status");
      const drawMode = settings.draw_mode || "instant";
      const startValue = settings.starts_at || settings.startsAt;
      const executedAt = settings.sequence_completed_at || settings.auto_spin_executed_at;
      const prizeCount = settings.roulettePrizes?.selectedItemIds?.length || 0;
      const itemText = " · 연동된 룰렛 상품 수: " + prizeCount + "개";

      if (drawMode !== "timer") {
        target.innerHTML = "현재 방식: <strong>즉시 돌리기</strong> · 사다리타기 돌리기 버튼을 누르면 선택 항목이 차례로 실행됩니다." + itemText;
        return;
      }
      if (!startValue) {
        target.innerHTML = "현재 방식: <strong>타이머 자동 실행</strong> · 시작 예정 시간을 설정해주세요.";
        return;
      }
      if (executedAt) {
        target.innerHTML = "자동 순차 추첨 완료 · <strong>" + escapeHtml(formatDateTime(executedAt)) + "</strong>" + itemText;
        return;
      }

      const render = () => {
        const diff = new Date(startValue).getTime() - Date.now();
        if (Number.isNaN(diff)) {
          target.innerHTML = "타이머 시간이 올바르지 않습니다.";
          return;
        }
        if (diff <= 0) {
          target.innerHTML = "자동 순차 추첨 진행 중 · 공개 사다리 페이지/API가 8초 간격으로 결과를 생성합니다." + itemText;
          clearInterval(ladderTimerInterval);
          return;
        }
        target.innerHTML = "현재 방식: <strong>타이머 자동 실행</strong> · 시작까지 <strong>" + formatCountdownText(diff) + "</strong>" + itemText;
      };
      render();
      ladderTimerInterval = setInterval(render, 1000);
    }

    /* ── GACHAPON GAME CONTROLLER ── */
    let gachaponState = { participants: [], roster: [], results: [], settings: {} };
    let gachaponTimerInterval = null;

    /* ── 가차폰 이벤트 이름 저장 ── */
    document.getElementById("gachapon-name-save").addEventListener("click", async () => {
      const status = document.getElementById("gachapon-status");
      const eventName = document.getElementById("gachapon-event-name").value.trim();
      if (!eventName) { status.textContent = "이벤트 이름을 입력해주세요."; return; }
      status.textContent = "가차폰 이벤트 이름 저장 중...";
      const res = await fetch("/api/admin/gachapon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          eventName,
          startsAt: (gachaponState.settings.starts_at || gachaponState.settings.startsAt) ?? null,
          drawMode: gachaponState.settings.draw_mode || "instant",
        }),
      });
      const data = await res.json();
      status.textContent = res.ok ? "가차폰 이벤트 이름이 저장되었습니다." : (data.error || "저장 실패");
      if (res.ok) await loadGachapon();
    });

    /* ── 타이머 자동실행 시작 ── */
    document.getElementById("gachapon-timer-start").addEventListener("click", async () => {
      const status = document.getElementById("gachapon-status");
      const timeVal = document.getElementById("gachapon-start-time").value;
      if (!timeVal) { status.textContent = "시작 예정 시간을 입력해주세요."; return; }
      status.textContent = "타이머 스케줄 설정 중...";
      const res = await fetch("/api/admin/gachapon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          eventName: document.getElementById("gachapon-event-name").value.trim(),
          startsAt: new Date(timeVal).toISOString(),
          drawMode: "timer",
        }),
      });
      const data = await res.json();
      status.textContent = res.ok ? "타이머 자동 가차 스케줄이 설정되었습니다." : (data.error || "설정 실패");
      if (res.ok) await loadGachapon();
    });

    /* ── 시작시간 입력 변경 시 대형 표시 업데이트 ── */
    document.getElementById("gachapon-start-time").addEventListener("input", updateGachaponTimerDisplay);
    function updateGachaponTimerDisplay() {
      const val = document.getElementById("gachapon-start-time").value;
      const clock = document.getElementById("gachapon-timer-clock");
      const countdown = document.getElementById("gachapon-timer-countdown");
      if (!val) { clock.textContent = "–"; countdown.textContent = ""; return; }
      const d = new Date(val);
      clock.textContent = d.getFullYear() + ". " +
        String(d.getMonth()+1).padStart(2,"0") + ". " +
        String(d.getDate()).padStart(2,"0") + ".  " +
        String(d.getHours()).padStart(2,"0") + ":" +
        String(d.getMinutes()).padStart(2,"0");
      const diff = d.getTime() - Date.now();
      countdown.textContent = diff > 0
        ? "(" + formatCountdownText(diff) + " 후 시작)"
        : "(이미 지난 시간)";
    }

    document.getElementById("gachapon-roster-search").addEventListener("input", renderGachaponRosterSelect);
    document.getElementById("gachapon-add-participant").addEventListener("click", async () => {
      const select = document.getElementById("gachapon-roster-select");
      const status = document.getElementById("gachapon-status");
      if (!select.value) {
        status.textContent = "추가할 참가자를 먼저 선택해주세요.";
        return;
      }
      status.textContent = "가차폰 참가자를 추가하는 중...";
      const response = await fetch("/api/admin/gachapon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addParticipant", rosterParticipantId: select.value }),
      });
      const data = await response.json();
      if (!response.ok) {
        status.textContent = data.error || "참가자 추가 실패";
        return;
      }
      document.getElementById("gachapon-roster-search").value = "";
      await loadGachapon();
    });

    document.getElementById("gachapon-reset-results").addEventListener("click", async () => {
      if (!confirm("가차폰 매칭 결과와 진행 상태만 초기화할까요?\n참가자 명단은 그대로 유지됩니다.")) return;
      const status = document.getElementById("gachapon-status");
      status.textContent = "가차폰 결과 초기화 중...";
      const response = await fetch("/api/admin/gachapon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetResults" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "초기화 실패"; return; }
      status.textContent = "가차폰 매칭 결과가 초기화되었습니다. (참가자 유지)";
      await loadGachapon();
    });

    document.getElementById("gachapon-reset").addEventListener("click", async () => {
      if (!confirm("참가자, 매칭 결과, 타이머 세팅을 전부 초기화할까요?\n상품 정보는 룰렛 탭에 그대로 보존됩니다.")) return;
      const status = document.getElementById("gachapon-status");
      status.textContent = "전체 가차폰 초기화 중...";
      const response = await fetch("/api/admin/gachapon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetGachapon" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "전체 초기화 실패"; return; }
      status.textContent = "가차폰이 전체 초기화되었습니다.";
      await loadGachapon();
    });

    document.getElementById("gachapon-add-all").addEventListener("click", async () => {
      if (!confirm("전체 참가자 명단(활성)을 모두 가차폰에 추가할까요?\n이미 추가된 참가자는 건너뜁니다.")) return;
      const status = document.getElementById("gachapon-status");
      status.textContent = "전체 참가자를 가차폰에 추가하는 중...";
      const response = await fetch("/api/admin/gachapon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addAllParticipants" }),
      });
      const data = await response.json();
      if (!response.ok) { status.textContent = data.error || "전체 추가 실패"; return; }
      status.textContent = (data.added || 0) + "명이 가차폰에 추가되었습니다.";
      await loadGachapon();
    });

    document.getElementById("gachapon-spin").addEventListener("click", async () => {
      const status = document.getElementById("gachapon-status");
      if (!gachaponState.participants.length) {
        status.textContent = "가차폰 참가자를 먼저 추가해주세요.";
        return;
      }
      status.textContent = "가차 레버를 당기는 중...";
      const response = await fetch("/api/admin/gachapon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "spin" }),
      });
      const data = await response.json();
      if (!response.ok) {
        status.textContent = data.error || "추첨에 실패했습니다.";
        return;
      }
      const winner = data.winner || {};
      const wName = winner.display_name || winner.displayName || "당첨자";
      status.textContent = wName + " 님 가차 레버 결과 생성! 상품: " + (data.result?.prize_label || "당첨");
      await loadGachapon();
    });

    async function loadGachapon() {
      const status = document.getElementById("gachapon-status");
      status.textContent = "가차폰 데이터를 불러오는 중...";
      try {
        const response = await fetch("/api/admin/gachapon", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          status.textContent = data.error || "가차폰 데이터를 불러오지 못했습니다.";
          return;
        }
        gachaponState = {
          participants: data.participants || [],
          roster: data.roster || [],
          results: data.results || [],
          settings: data.settings || {},
        };
        const settings = gachaponState.settings;
        document.getElementById("gachapon-event-name").value = settings.event_name || "";
        document.getElementById("gachapon-start-time").value = toDateTimeLocalValue(settings.starts_at || settings.startsAt);
        document.getElementById("gachapon-draw-mode").value = settings.draw_mode || "instant";
        updateGachaponTimerDisplay();
        renderGachaponRosterSelect();
        renderGachaponParticipantsAndResults();
        updateGachaponTimerStatus(settings);
        status.textContent = "룰렛 연동 상품 " + (settings.roulettePrizes?.selectedItemIds?.length || 0) + "개 · 가차폰 참가자 " + gachaponState.participants.length + "명";
      } catch (error) {
        status.textContent = "네트워크 연결 실패";
      }
    }

    function renderGachaponRosterSelect() {
      const select = document.getElementById("gachapon-roster-select");
      const keyword = document.getElementById("gachapon-roster-search").value.trim().toLocaleLowerCase("ko");
      const activeRosterIds = new Set(gachaponState.participants.map((item) => item.roster_participant_id).filter(Boolean));
      const candidates = gachaponState.roster
        .filter((item) => !activeRosterIds.has(item.id))
        .filter((item) => !keyword || item.displayName.toLocaleLowerCase("ko").includes(keyword));
      select.innerHTML = candidates.length
        ? candidates.slice(0, 40).map((item) => '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(item.displayName) + ' · ' + escapeHtml(item.gender || "") + '</option>').join("")
        : '<option value="">추가 가능한 참가자 없음</option>';
    }

    function renderGachaponParticipantsAndResults() {
      const results = document.getElementById("gachapon-results");
      const countEl = document.getElementById("gachapon-participant-count");
      if (countEl) {
        const n = gachaponState.participants.length;
        countEl.textContent = n ? "(" + n + "명)" : "";
      }
      const byParticipant = new Map();
      gachaponState.results.forEach((row) => {
        const participant = row.participant || {};
        const id = row.gachapon_participant_id || participant.id;
        if (id && !byParticipant.has(id)) byParticipant.set(id, row);
      });
      results.innerHTML = gachaponState.participants.length
        ? gachaponState.participants.map((participant) => {
            const row = byParticipant.get(participant.id);
            const wonAt = row ? formatDateTime(row.created_at || row.createdAt) : "";
            const wonText = row ? "매칭: " + row.prize_label : "대기";
            return '<div class="roulette-roster-row"><div><strong>' + escapeHtml(participant.display_name || participant.displayName || "이름 없음") + '</strong><span class="muted"> · ' + escapeHtml(participant.gender || "") + '</span><div class="muted" style="font-size:12px;">' + escapeHtml(wonText) + (wonAt ? " · " + escapeHtml(wonAt) : "") + '</div></div><span class="pill">' + (row ? "완료" : "대기") + '</span><button class="btn-secondary gachapon-remove-participant" type="button" data-id="' + escapeHtml(participant.id) + '">제외</button></div>';
          }).join("")
        : '<div class="muted" style="padding:24px 0; text-align:center;">가차폰 참가자를 추가해주세요.</div>';
      document.querySelectorAll(".gachapon-remove-participant").forEach((button) => {
        button.addEventListener("click", async () => {
          const status = document.getElementById("gachapon-status");
          const response = await fetch("/api/admin/gachapon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "removeParticipant", participantId: button.dataset.id }),
          });
          const data = await response.json();
          if (!response.ok) {
            status.textContent = data.error || "참가자 제외 실패";
            return;
          }
          await loadGachapon();
        });
      });
    }

    function updateGachaponTimerStatus(settings) {
      clearInterval(gachaponTimerInterval);
      const target = document.getElementById("gachapon-timer-status");
      const drawMode = settings.draw_mode || "instant";
      const startValue = settings.starts_at || settings.startsAt;
      const executedAt = settings.sequence_completed_at || settings.auto_spin_executed_at;
      const prizeCount = settings.roulettePrizes?.selectedItemIds?.length || 0;
      const itemText = " · 연동된 룰렛 상품 수: " + prizeCount + "개";

      if (drawMode !== "timer") {
        target.innerHTML = "현재 방식: <strong>즉시 돌리기</strong> · 가차 레버 당기기 버튼을 누르면 선택 항목이 차례로 실행됩니다." + itemText;
        return;
      }
      if (!startValue) {
        target.innerHTML = "현재 방식: <strong>타이머 자동 실행</strong> · 시작 예정 시간을 설정해주세요.";
        return;
      }
      if (executedAt) {
        target.innerHTML = "자동 순차 추첨 완료 · <strong>" + escapeHtml(formatDateTime(executedAt)) + "</strong>" + itemText;
        return;
      }

      const render = () => {
        const diff = new Date(startValue).getTime() - Date.now();
        if (Number.isNaN(diff)) {
          target.innerHTML = "타이머 시간이 올바르지 않습니다.";
          return;
        }
        if (diff <= 0) {
          target.innerHTML = "자동 순차 추첨 진행 중 · 공개 가차폰 페이지/API가 8초 간격으로 결과를 생성합니다." + itemText;
          clearInterval(gachaponTimerInterval);
          return;
        }
        target.innerHTML = "현재 방식: <strong>타이머 자동 실행</strong> · 시작까지 <strong>" + formatCountdownText(diff) + "</strong>" + itemText;
      };
      render();
      gachaponTimerInterval = setInterval(render, 1000);
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
