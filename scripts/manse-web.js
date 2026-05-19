#!/usr/bin/env node

const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const { URL } = require("node:url");
const { buildResult, formatDate, formatLunar, PILLAR_ORDER } = require("./validate-manseryeok");

const PORT = Number(process.env.PORT || 4173);
const IS_SERVERLESS = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const DATA_DIR = IS_SERVERLESS ? path.join("/tmp", "moras") : path.join(__dirname, "..", "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "dev-submissions.json");
const ADMIN_ID = process.env.MORAS_ADMIN_ID || "admin";
const ADMIN_PASSWORD = process.env.MORAS_ADMIN_PASSWORD || "admin";
const ADMIN_COOKIE = "moras_admin_session";
const ADMIN_SECRET = process.env.MORAS_ADMIN_SECRET || "moras-dev-admin-secret";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_TABLE = "participant_submissions";
let submissionWriteQueue = Promise.resolve();
const CITIES = [
  { name: "서울특별시", longitude: 127, timezone: "Asia/Seoul" },
  { name: "부산광역시", longitude: 129, timezone: "Asia/Seoul" },
  { name: "대구광역시", longitude: 128.6, timezone: "Asia/Seoul" },
  { name: "인천광역시", longitude: 126.7, timezone: "Asia/Seoul" },
  { name: "광주광역시", longitude: 126.85, timezone: "Asia/Seoul" },
  { name: "대전광역시", longitude: 127.38, timezone: "Asia/Seoul" },
  { name: "울산광역시", longitude: 129.31, timezone: "Asia/Seoul" },
  { name: "제주시", longitude: 126.53, timezone: "Asia/Seoul" },
  { name: "도쿄", longitude: 139.69, timezone: "Asia/Tokyo" },
  { name: "뉴욕", longitude: -74.01, timezone: "America/New_York" },
  { name: "로스앤젤레스", longitude: -118.24, timezone: "America/Los_Angeles" },
  { name: "직접 입력", longitude: 127, timezone: "Asia/Seoul", custom: true },
];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/") {
    send(res, 200, "text/html; charset=utf-8", page());
    return;
  }

  if (req.method === "GET" && url.pathname === "/admin") {
    if (!isAdminAuthenticated(req)) {
      send(res, 200, "text/html; charset=utf-8", adminLoginPage());
      return;
    }
    send(res, 200, "text/html; charset=utf-8", adminPage());
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/manse") {
    try {
      sendJson(res, 200, await handleManseApi(await readJson(req)));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/login") {
    try {
      const result = handleAdminLogin(await readJson(req));
      sendJson(res, result.status, result.payload, result.cookies);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/logout") {
    const result = handleAdminLogout();
    sendJson(res, result.status, result.payload, result.cookies);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/submissions") {
    try {
      const result = await handleAdminSubmissions(req.headers.cookie || "");
      sendJson(res, result.status, result.payload);
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
    return;
  }

  send(res, 404, "text/plain; charset=utf-8", "Not found");
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Moras manseryeok web: http://localhost:${PORT}`);
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function buildViewModel(result, input) {
  const ordered = ["hour", "day", "month", "year"];
  const cells = Object.fromEntries(
    ordered.map((key) => {
      const pillar = result.pillars[key];
      const derived = result.derived.byPillar[key];
      if (!pillar) {
        return [
          key,
          {
            label: { hour: "생시", day: "생일", month: "생월", year: "생년" }[key],
            unknown: true,
            stemText: "시간모름",
            branchText: "시간모름",
            stemElement: "",
            branchElement: "",
            stemTenGod: "X",
            branchTenGod: "X",
            hiddenStems: "X",
            twelveStage: "X",
            twelveGod: "X",
          },
        ];
      }
      return [
        key,
        {
          label: { hour: "생시", day: "생일", month: "생월", year: "생년" }[key],
          unknown: false,
          stemText: pillar.stem.hangul + pillar.stem.hanja,
          branchText: pillar.branch.hangul + pillar.branch.hanja,
          stemElement: pillar.stem.element,
          branchElement: pillar.branch.element,
          stem: pillar.stem,
          branch: pillar.branch,
          pillar: pillar.hangul,
          pillarHanja: pillar.hanja,
          stemTenGod: derived.stemTenGod,
          branchTenGod: derived.branchTenGod,
          hiddenStems: derived.hiddenStems,
          twelveStage: derived.twelveStage,
          twelveGod: derived.twelveGodDisplay,
          twelveGodRaw: derived.twelveGod,
        },
      ];
    }),
  );

  return {
    submissionId: input.submissionId,
    name: input.name || "테스트 사용자",
    mbti: normalizeMbti(input.mbti),
    profileTitle: `${result.saju.dayPillar}(${stemColorName(result.pillars.day.stem.hangul)} ${result.pillars.day.branch.animal})`,
    cells,
    solarText: `${formatDate(result.normalizedSolarDate)} ${input.timeUnknown ? "시간모름" : input.time}`,
    lunarText: `${formatLunar(result.normalizedLunarDate)} ${input.timeUnknown ? "시간모름" : input.time}`,
    locationText: `${input.birthPlace || "출생지 미입력"} (진태양시 보정 적용)`,
    notice: "MBTI, 만세력 결과는 관리자 검수와 매칭 계산을 위해 저장됩니다.",
  };
}

function buildSubmission(input, birthPlace, result) {
  return {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    displayName: nullableString(input.name),
    mbti: normalizeMbti(input.mbti),
    birthDate: input.date,
    birthTime: input.timeUnknown ? null : input.time,
    birthTimeUnknown: Boolean(input.timeUnknown),
    calendarType: input.calendar || "solar",
    birthPlace: birthPlace.name,
    calculationPolicy: {
      longitude: birthPlace.longitude,
      timezone: birthPlace.timezone,
      trueSolarTimeCorrection: true,
    },
    manse: {
      library: result.package,
      libraryVersion: result.packageVersion,
      calculatedAt: new Date().toISOString(),
      normalizedSolarDate: result.normalizedSolarDate,
      normalizedLunarDate: result.normalizedLunarDate,
      saju: result.saju,
      pillars: result.pillars,
      derived: result.derived,
      elementDistribution: result.elementDistribution,
    },
  };
}

function normalizeMbti(value) {
  const mbti = String(value || "").trim().toUpperCase();
  return /^[IE][NS][TF][JP]$/.test(mbti) ? mbti : null;
}

function nullableString(value) {
  const text = String(value || "").trim();
  return text || null;
}

async function saveSubmission(submission) {
  if (hasSupabaseConfig()) {
    await saveSubmissionToSupabase(submission);
    return {
      id: submission.id,
      submittedAt: submission.submittedAt,
    };
  }

  submissionWriteQueue = submissionWriteQueue.then(async () => {
    const submissions = await readSubmissions();
    submissions.unshift(submission);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf8");
  });
  await submissionWriteQueue;
  return {
    id: submission.id,
    submittedAt: submission.submittedAt,
  };
}

async function readSubmissions() {
  if (hasSupabaseConfig()) {
    return readSubmissionsFromSupabase();
  }

  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

async function saveSubmissionToSupabase(submission) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: supabaseHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify(toSupabaseRow(submission)),
  });
  if (!response.ok) {
    throw new Error(`Supabase 저장 실패: ${await response.text()}`);
  }
}

async function readSubmissionsFromSupabase() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?select=*&order=submitted_at.desc`,
    {
      headers: supabaseHeaders(),
    },
  );
  if (!response.ok) {
    throw new Error(`Supabase 조회 실패: ${await response.text()}`);
  }
  return (await response.json()).map(fromSupabaseRow);
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function toSupabaseRow(submission) {
  return {
    id: submission.id,
    submitted_at: submission.submittedAt,
    display_name: submission.displayName,
    mbti: submission.mbti,
    birth_date: submission.birthDate,
    birth_time: submission.birthTime,
    birth_time_unknown: submission.birthTimeUnknown,
    calendar_type: submission.calendarType,
    birth_place: submission.birthPlace,
    calculation_policy: submission.calculationPolicy,
    manse_result: submission.manse,
    raw_submission: submission,
  };
}

function fromSupabaseRow(row) {
  const raw = row.raw_submission || {};
  return {
    ...raw,
    id: row.id,
    submittedAt: row.submitted_at,
    displayName: row.display_name,
    mbti: row.mbti,
    birthDate: row.birth_date,
    birthTime: row.birth_time ? row.birth_time.slice(0, 5) : null,
    birthTimeUnknown: row.birth_time_unknown,
    calendarType: row.calendar_type,
    birthPlace: row.birth_place,
    calculationPolicy: row.calculation_policy,
    manse: row.manse_result,
  };
}

function resolveBirthPlace(name, customName) {
  const city = CITIES.find((item) => item.name === name) || CITIES[0];
  if (!city.custom) return city;

  const trimmedName = String(customName || "").trim();
  return {
    name: trimmedName || "직접 입력",
    longitude: city.longitude,
    timezone: city.timezone,
  };
}

function stemColorName(stem) {
  if (["갑", "을"].includes(stem)) return "푸른";
  if (["병", "정"].includes(stem)) return "붉은";
  if (["무", "기"].includes(stem)) return "노란";
  if (["경", "신"].includes(stem)) return "하얀";
  return "검은";
}

function createAdminToken(adminId) {
  const payload = Buffer.from(
    JSON.stringify({ adminId, expiresAt: Date.now() + 12 * 60 * 60 * 1000 }),
    "utf8",
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function isAdminAuthenticated(req) {
  const token = parseCookies(req.headers.cookie || "")[ADMIN_COOKIE];
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return parsed.adminId === ADMIN_ID && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function parseCookies(cookieHeader) {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), part.slice(index + 1)];
      }),
  );
}

function sendJson(res, status, payload, cookies = []) {
  send(res, status, "application/json; charset=utf-8", JSON.stringify(payload), cookies);
}

function send(res, status, contentType, body, cookies = []) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    ...(cookies.length ? { "Set-Cookie": cookies } : {}),
  });
  res.end(body);
}

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

async function handleManseApi(body) {
  const birthPlace = resolveBirthPlace(body.birthPlace, body.customBirthPlace);
  const result = buildResult({
    date: body.date,
    time: body.timeUnknown ? "unknown" : body.time,
    calendar: body.calendar || "solar",
    leapMonth: Boolean(body.leapMonth),
    longitude: birthPlace.longitude,
    timezone: birthPlace.timezone,
    timeCorrection: true,
  });
  const submission = await saveSubmission(buildSubmission(body, birthPlace, result));

  return {
    submission,
    result,
    view: buildViewModel(result, { ...body, birthPlace: birthPlace.name, submissionId: submission.id }),
  };
}

function handleAdminLogin(body) {
  if (body.adminId !== ADMIN_ID || body.adminPassword !== ADMIN_PASSWORD) {
    return {
      status: 401,
      payload: { error: "아이디 또는 패스워드가 맞지 않습니다." },
      cookies: [],
    };
  }
  return {
    status: 200,
    payload: { ok: true },
    cookies: [`${ADMIN_COOKIE}=${createAdminToken(body.adminId)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200`],
  };
}

function handleAdminLogout() {
  return {
    status: 200,
    payload: { ok: true },
    cookies: [`${ADMIN_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`],
  };
}

async function handleAdminSubmissions(cookieHeader) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }
  return {
    status: 200,
    payload: { submissions: await readSubmissions() },
  };
}

module.exports = {
  adminLoginPage,
  adminPage,
  handleAdminLogin,
  handleAdminLogout,
  handleAdminSubmissions,
  handleManseApi,
  isAdminAuthenticated,
  page,
};

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
        <div class="muted">로컬 JSON 저장소 기반 임시 관리자 조회 화면</div>
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
        <p class="hint">입력값과 계산된 만세력 결과는 관리자 검수 및 매칭 계산을 위해 저장됩니다.</p>
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

module.exports = {
  adminLoginPage,
  adminPage,
  handleAdminLogin,
  handleAdminLogout,
  handleAdminSubmissions,
  handleManseApi,
  isAdminAuthenticated,
  page,
};
