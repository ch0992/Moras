/**
 * Public applicants list page for Moras.
 *
 * Responsibilities:
 * - Render a lightweight event applicant list.
 * - Show only public-safe fields: name, gender, MBTI, day pillar, submitted time.
 * - Keep storage, auth, and matching logic out of this file.
 */

function applicantsPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 이벤트 신청자 목록</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Outfit:wght@400;600;800;900&family=Noto+Sans+KR:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #060913;
      --panel: rgba(10, 15, 30, 0.74);
      --line: rgba(255, 255, 255, 0.08);
      --gold: #D4AF37;
      --gold-soft: #FFE8A3;
      --text: #F8FAFC;
      --muted: #94A3B8;
      --blue: #93C5FD;
      --rose: #F9A8D4;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 18% 16%, rgba(0, 242, 254, 0.10), transparent 34%),
        radial-gradient(circle at 85% 80%, rgba(240, 147, 251, 0.10), transparent 36%),
        radial-gradient(circle at 50% 30%, #111A35 0%, #060913 58%, #020306 100%);
      color: var(--text);
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1.5px 1.5px at 220px 150px, rgba(255,232,163,0.7), transparent),
        radial-gradient(1px 1px at 760px 280px, rgba(255,255,255,0.7), transparent),
        radial-gradient(1.5px 1.5px at 1120px 460px, rgba(147,197,253,0.6), transparent);
      background-size: 1200px 760px;
      opacity: 0.42;
    }
    main {
      width: min(1040px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 118px 0 80px;
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
    .hero {
      margin-bottom: 24px;
      padding: 34px;
      border-radius: 22px;
      border: 1px solid rgba(255, 232, 163, 0.18);
      background: linear-gradient(135deg, rgba(255, 232, 163, 0.10), rgba(10, 15, 30, 0.72));
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.36);
    }
    .brand {
      margin: 0 0 10px;
      font-family: 'Cinzel', serif;
      color: var(--gold-soft);
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.12em;
    }
    h1 {
      margin: 0;
      color: var(--text);
      font-size: clamp(28px, 4vw, 42px);
      line-height: 1.15;
      font-weight: 900;
      letter-spacing: 0;
    }
    .summary {
      margin: 14px 0 0;
      color: #CBD5E1;
      font-size: 15.5px;
      line-height: 1.7;
      word-break: keep-all;
    }
    .toolbar {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 14px;
      margin: 18px 0;
      color: var(--muted);
      font-size: 13px;
      font-weight: 800;
    }
    .list {
      display: grid;
      gap: 12px;
    }
    .applicant {
      display: grid;
      grid-template-columns: 52px minmax(130px, 1.2fr) 90px 100px 110px minmax(180px, 1fr);
      gap: 12px;
      align-items: center;
      padding: 18px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(10, 15, 30, 0.68);
      box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
    }
    .rank {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 12px;
      border: 1px solid rgba(255, 232, 163, 0.18);
      background: rgba(255, 232, 163, 0.08);
      color: var(--gold-soft);
      font-weight: 900;
    }
    .label {
      display: block;
      margin-bottom: 4px;
      color: var(--muted);
      font-size: 10.5px;
      font-weight: 900;
      letter-spacing: 0.11em;
      text-transform: uppercase;
    }
    .value {
      color: var(--text);
      font-size: 15px;
      font-weight: 900;
      line-height: 1.35;
      word-break: keep-all;
    }
    .pill {
      display: inline-flex;
      justify-content: center;
      min-width: 56px;
      padding: 7px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.055);
      border: 1px solid rgba(255,255,255,0.08);
      color: #E2E8F0;
      font-size: 13px;
      font-weight: 900;
    }
    .empty, .error {
      padding: 36px 24px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(10, 15, 30, 0.68);
      color: var(--muted);
      text-align: center;
      font-size: 15px;
      font-weight: 800;
    }
    .error { color: #FCA5A5; }
    @media (max-width: 760px) {
      main { width: min(100vw - 24px, 520px); padding-top: 104px; }
      .hero { padding: 24px 20px; }
      .toolbar { align-items: flex-start; flex-direction: column; }
      .applicant {
        grid-template-columns: 42px 1fr;
        gap: 12px 14px;
      }
      .applicant > div:not(.rank-wrap) {
        grid-column: 2;
      }
      .rank-wrap {
        grid-row: 1 / span 5;
      }
    }
  </style>
</head>
<body>
  <a class="global-home-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
  <main>
    <section class="hero">
      <div class="brand">Moras</div>
      <h1>현재 이벤트 신청자 목록</h1>
      <p class="summary">신청 순서대로 접수된 참가자를 보여줍니다. 공개 목록에는 이름, 성별, MBTI, 일주, 신청완료시각만 표시됩니다.</p>
    </section>
    <div class="toolbar">
      <div id="count">신청 현황을 불러오는 중...</div>
    </div>
    <section id="list" class="list"></section>
  </main>
  <script>
    const listEl = document.querySelector("#list");
    const countEl = document.querySelector("#count");

    loadApplicants();

    async function loadApplicants() {
      try {
        const response = await fetch("/api/applicants");
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "신청 목록을 불러오지 못했습니다.");
        renderApplicants(body.applicants || []);
      } catch (error) {
        countEl.textContent = "신청 목록 조회 실패";
        listEl.innerHTML = '<div class="error">' + escapeHtml(error.message) + '</div>';
      }
    }

    function renderApplicants(applicants) {
      const maleCount = applicants.filter((item) => item.gender === "남").length;
      const femaleCount = applicants.filter((item) => item.gender === "여").length;
      countEl.textContent = "총 " + applicants.length + "명 신청 완료 · 남자 " + maleCount + "명 · 여자 " + femaleCount + "명";
      if (!applicants.length) {
        listEl.innerHTML = '<div class="empty">아직 신청자가 없습니다.</div>';
        return;
      }
      listEl.innerHTML = applicants.map((item, index) => applicantCard(item, index)).join("");
    }

    function applicantCard(item, index) {
      return '<article class="applicant">' +
        '<div class="rank-wrap"><div class="rank">' + String(index + 1).padStart(2, "0") + '</div></div>' +
        field("이름", item.name || "이름 없음") +
        field("성별", '<span class="pill">' + escapeHtml(item.gender || "미입력") + '</span>', true) +
        field("MBTI", '<span class="pill">' + escapeHtml(item.mbti || "미입력") + '</span>', true) +
        field("일주", item.dayPillar || "미확인") +
        field("신청완료시각", formatSubmittedAt(item.submittedAt)) +
        '</article>';
    }

    function field(label, value, isHtml) {
      return '<div><span class="label">' + escapeHtml(label) + '</span><div class="value">' + (isHtml ? value : escapeHtml(value)) + '</div></div>';
    }

    function formatSubmittedAt(value) {
      if (!value) return "미확인";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return new Intl.DateTimeFormat("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>"']/g, (char) => ({
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

module.exports = { applicantsPage };
