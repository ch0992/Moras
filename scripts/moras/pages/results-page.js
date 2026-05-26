/**
 * Public matching results page for Moras.
 *
 * Responsibilities:
 * - Render shareable matching results without admin authentication.
 * - Show public-safe couple rows and score details.
 * - Keep secret passcodes, admin actions, storage, and API logic out of this file.
 */

function resultsPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras 매칭 결과</title>
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
      --blue: #67E8F9;
      --rose: #F9A8D4;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 15% 18%, rgba(0, 242, 254, 0.12), transparent 34%),
        radial-gradient(circle at 86% 72%, rgba(240, 147, 251, 0.12), transparent 36%),
        linear-gradient(180deg, #07101F 0%, #060913 54%, #020306 100%);
      color: var(--text);
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.38;
      background-image:
        radial-gradient(1px 1px at 80px 80px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1.5px 1.5px at 360px 170px, rgba(255,232,163,0.7), transparent),
        radial-gradient(1px 1px at 900px 330px, rgba(147,197,253,0.8), transparent);
      background-size: 1100px 720px;
    }
    main {
      width: min(1120px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 118px 0 72px;
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
      padding: 34px;
      border: 1px solid rgba(255, 232, 163, 0.18);
      border-radius: 22px;
      background: linear-gradient(135deg, rgba(255, 232, 163, 0.11), rgba(10, 15, 30, 0.78));
      box-shadow: 0 28px 70px rgba(0,0,0,0.38);
    }
    .brand {
      margin: 0 0 10px;
      font-family: 'Cinzel', serif;
      color: var(--gold-soft);
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-shadow: 0 0 18px rgba(212,175,55,0.36);
    }
    h1 {
      margin: 0;
      font-size: clamp(30px, 4vw, 46px);
      line-height: 1.12;
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
    .status {
      margin: 18px 0;
      color: var(--muted);
      font-size: 13px;
      font-weight: 900;
    }
    .list {
      display: grid;
      gap: 14px;
    }
    .couple {
      display: grid;
      grid-template-columns: 62px minmax(150px, 1fr) minmax(150px, 1fr) minmax(210px, 0.9fr) 94px;
      gap: 14px;
      align-items: center;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: rgba(10, 15, 30, 0.72);
      box-shadow: 0 22px 50px rgba(0,0,0,0.24);
      transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease, background 220ms ease;
    }
    .couple:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 232, 163, 0.22);
      background: rgba(14, 18, 34, 0.82);
      box-shadow: 0 26px 64px rgba(0,0,0,0.34);
    }
    .couple.rank-1 {
      border: 2px solid rgba(255, 232, 163, 0.95);
      background: linear-gradient(135deg, rgba(197, 155, 63, 0.18), rgba(10, 15, 30, 0.92) 72%);
      box-shadow: 0 0 36px rgba(197, 155, 63, 0.28), inset 0 0 20px rgba(197, 155, 63, 0.08);
    }
    .couple.rank-2 {
      border: 2px solid rgba(162, 155, 254, 0.72);
      background: linear-gradient(135deg, rgba(162, 155, 254, 0.16), rgba(10, 15, 30, 0.90) 72%);
      box-shadow: 0 0 30px rgba(162, 155, 254, 0.20), inset 0 0 18px rgba(162, 155, 254, 0.06);
    }
    .couple.rank-3 {
      border: 2px solid rgba(103, 232, 249, 0.62);
      background: linear-gradient(135deg, rgba(103, 232, 249, 0.13), rgba(10, 15, 30, 0.90) 72%);
      box-shadow: 0 0 28px rgba(103, 232, 249, 0.18), inset 0 0 18px rgba(103, 232, 249, 0.05);
    }
    .rank {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      border: 1px solid rgba(255, 232, 163, 0.2);
      background: rgba(255, 232, 163, 0.08);
      color: var(--gold-soft);
      font-weight: 900;
    }
    .person {
      min-width: 0;
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(0,0,0,0.20);
    }
    .person.male { border-left: 3px solid var(--blue); }
    .person.female { border-left: 3px solid var(--rose); }
    .label {
      display: block;
      margin-bottom: 4px;
      color: var(--muted);
      font-size: 10.5px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .name {
      color: #fff;
      font-size: 16px;
      font-weight: 900;
      line-height: 1.35;
      word-break: keep-all;
    }
    .sub {
      margin-top: 4px;
      color: var(--muted);
      font-size: 12.5px;
      font-weight: 700;
    }
    .score {
      min-width: 0;
    }
    .score-main {
      color: #fff;
      font-size: 28px;
      line-height: 1;
      font-weight: 900;
    }
    .score-main span {
      margin-left: 2px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }
    .type {
      margin-top: 5px;
      color: var(--gold-soft);
      font-size: 12.5px;
      font-weight: 900;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 9px;
    }
    .chip {
      display: inline-flex;
      padding: 5px 8px;
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 999px;
      background: rgba(255,255,255,0.055);
      color: #CBD5E1;
      font-size: 11px;
      font-weight: 900;
    }
    button {
      min-height: 38px;
      border: 1px solid rgba(255, 232, 163, 0.34);
      border-radius: 10px;
      background: rgba(212,175,55,0.14);
      color: var(--gold-soft);
      font-weight: 900;
      cursor: pointer;
      transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
    }
    button:hover {
      transform: translateY(-1px);
      background: rgba(212,175,55,0.20);
      box-shadow: 0 0 20px rgba(212,175,55,0.20);
    }
    .detail {
      display: none;
      margin: -2px 0 18px;
      padding: 26px;
      border: 1px solid rgba(162,155,254,0.24);
      border-radius: 20px;
      background:
        linear-gradient(135deg, rgba(18, 22, 42, 0.94), rgba(12, 13, 28, 0.86)),
        radial-gradient(circle at 18% 0%, rgba(197,155,63,0.12), transparent 34%);
      box-shadow: 0 26px 70px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.04);
    }
    .detail.open { display: block; }
    .detail p {
      margin: 0;
      color: #CBD5E1;
      font-size: 14px;
      line-height: 1.75;
      word-break: keep-all;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
      margin-top: 20px;
    }
    .reason-card {
      padding: 24px 28px;
      border: 1px solid rgba(162,155,254,0.22);
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(19, 22, 44, 0.92), rgba(13, 14, 31, 0.78));
      box-shadow: 0 18px 46px rgba(0,0,0,0.24), inset 0 1px 1px rgba(255,255,255,0.035);
      transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
    }
    .reason-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255,232,163,0.30);
      box-shadow: 0 24px 58px rgba(0,0,0,0.32), 0 0 24px rgba(162,155,254,0.10);
    }
    .reason-card h3 {
      margin: 0 0 14px;
      color: var(--gold-soft);
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0;
    }
    .reason-card .eyebrow {
      display: block;
      margin-bottom: 8px;
      color: #AAB4D4;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }
    .reason-card p {
      color: #CBD5E1;
      font-size: 15px;
      line-height: 1.9;
      word-break: keep-all;
    }
    .reason-card p + p {
      margin-top: 14px;
    }
    .report-lead {
      padding: 22px 24px;
      border: 1px solid rgba(255,232,163,0.20);
      border-radius: 18px;
      background: rgba(197,155,63,0.07);
      color: #F8E7B0;
      font-size: 15.5px;
      line-height: 1.85;
      word-break: keep-all;
    }
    .formula {
      margin-top: 18px;
      padding: 18px 20px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.22);
      color: var(--muted);
      font-size: 13px;
      line-height: 1.65;
    }
    .empty, .error {
      padding: 34px 22px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(10, 15, 30, 0.68);
      color: var(--muted);
      text-align: center;
      font-weight: 800;
    }
    .error { color: #FCA5A5; }
    .deadline-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      padding: 12px 18px;
      background: rgba(255,232,163,0.06);
      border: 1px solid rgba(255,232,163,0.18);
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .deadline-label {
      font-size: 12px;
      font-weight: 800;
      color: var(--gold-soft);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .deadline-time {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }
    .deadline-time.expired { color: #f87171; }
    .match-cta-btn {
      margin-left: auto;
      background: var(--gold-soft);
      color: #0a0a0a;
      border: none;
      border-radius: 8px;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      text-decoration: none;
      font-family: inherit;
      transition: opacity 0.15s;
      white-space: nowrap;
    }
    .match-cta-btn:hover { opacity: 0.85; }
    .vote-badge {
      display: inline-block;
      margin-top: 6px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    .vote-badge.voted { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .vote-badge.pending { background: rgba(255,255,255,0.06); color: var(--muted); }
    .vote-badge.no-vote { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }

        @media (max-width: 820px) {
      main { width: min(100vw - 24px, 560px); padding-top: 104px; }
      .hero { padding: 24px 20px; }
      .couple { grid-template-columns: 1fr; }
      .rank { width: 100%; height: 38px; }
      button { width: 100%; }
      .detail-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <a class="global-home-logo" href="https://moras-event-matching.netlify.app/" aria-label="Moras 홈으로 이동">MORAS</a>
  <main>
    <section class="hero">
      <div class="brand">Moras</div>
      <h1>이벤트 매칭 결과</h1>
      <p class="summary">MBTI와 만세력 흐름을 함께 반영해 산출한 이벤트 매칭 결과입니다. 점수는 재미와 대화를 위한 참고 지표이며, 결정론적 의미로 사용하지 않습니다.</p>
    </section>
    <div class="status" id="status">매칭 결과를 불러오는 중...</div>
    <section class="list" id="list"></section>
  </main>
  <script>
    const listEl = document.querySelector("#list");
    const statusEl = document.querySelector("#status");

    loadResults();

    async function loadResults() {
      try {
        const response = await fetch("/api/results", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "매칭 결과를 불러오지 못했습니다.");
        renderResults(body.matches || [], body.voteDeadline || null);
      } catch (error) {
        statusEl.textContent = "매칭 결과 조회 실패";
        listEl.innerHTML = '<div class="error">' + escapeHtml(error.message) + '</div>';
      }
    }

    function renderResults(matches, voteDeadline) {
      const deadlinePassed = voteDeadline ? new Date(voteDeadline).getTime() < Date.now() : false;

      // Deadline + vote CTA bar
      let deadlineHtml = "";
      if (voteDeadline) {
        const d = new Date(voteDeadline);
        const fmt = d.getFullYear() + "." + String(d.getMonth()+1).padStart(2,"0") + "." + String(d.getDate()).padStart(2,"0") + " " + String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
        deadlineHtml = '<div class="deadline-bar">' +
          '<span class="deadline-label">' + (deadlinePassed ? "매칭 선택 종료" : "매칭 선택 마감") + '</span>' +
          '<span class="deadline-time' + (deadlinePassed ? " expired" : "") + '">' + fmt + '</span>' +
          '<a href="/match" class="match-cta-btn">매칭 투표하러 가기 →</a>' +
          '</div>';
      } else {
        deadlineHtml = '<div class="deadline-bar"><a href="/match" class="match-cta-btn">매칭 투표하러 가기 →</a></div>';
      }

      statusEl.textContent = matches.length
        ? "총 " + matches.length + "커플 매칭 완료"
        : "아직 공개할 매칭 결과가 없습니다.";
      if (!matches.length) {
        listEl.innerHTML = deadlineHtml + '<div class="empty">관리자가 일괄 매칭을 실행하면 이곳에 결과가 표시됩니다.</div>';
        return;
      }
      listEl.innerHTML = deadlineHtml + matches.map((match, index) => coupleRow(match, index, deadlinePassed)).join("");
      document.querySelectorAll("[data-detail]").forEach((button) => {
        button.addEventListener("click", () => {
          const detail = document.getElementById("detail-" + button.dataset.detail);
          detail.classList.toggle("open");
          button.textContent = detail.classList.contains("open") ? "닫기" : "상세";
        });
      });
    }

    function coupleRow(match, index, deadlinePassed) {
      const detail = match.score_detail || {};
      const score = Math.round(Number(match.average_score || detail.finalScore || 0));
      const male = match.male || {};
      const female = match.female || {};
      const rankClass = rankTierClass(match.rank || index + 1);
      return \`
        <article class="couple \${rankClass}">
          <div class="rank">\${escapeHtml(match.rank || index + 1)}위</div>
          \${personBox("male", "MAN", male, match.maleVoted, deadlinePassed)}
          \${personBox("female", "WOMAN", female, match.femaleVoted, deadlinePassed)}
          <div class="score">
            <div class="score-main">\${score}<span>점</span></div>
            <div class="type">\${escapeHtml(detail.relationshipType || "균형 탐색형")}</div>
            <div class="chips">
              <span class="chip">MBTI \${scoreNumber(detail.mbtiScore)}</span>
              <span class="chip">사주 \${scoreNumber(detail.sajuScore)}</span>
              <span class="chip">편차보정 \${scoreNumber(detail.consistencyScore)}</span>
            </div>
          </div>
          <button type="button" data-detail="\${index}">상세</button>
        </article>
        <section class="detail" id="detail-\${index}">
          \${detailContent(match)}
          <div class="formula">
            MBTI \${scoreNumber(detail.mbtiScore)}점과 사주 \${scoreNumber(detail.sajuScore)}점의 평균에,
            전체 후보군 기준 편차 보정 \${scoreNumber(detail.consistencyScore)}점을 일부 반영해 최종 점수를 계산했습니다.
          </div>
        </section>
      \`;
    }

    function personBox(className, label, person, hasVoted, deadlinePassed) {
      const manse = getManse(person);
      const dayPillar = manse?.saju?.dayPillar || "일주 미확인";
      let voteStatus = "";
      if (deadlinePassed) {
        voteStatus = hasVoted
          ? '<div class="vote-badge voted">투표 완료</div>'
          : '<div class="vote-badge no-vote">미투표 (자동 X)</div>';
      } else {
        voteStatus = hasVoted
          ? '<div class="vote-badge voted">투표 완료</div>'
          : '<div class="vote-badge pending">투표 대기중</div>';
      }
      return \`
        <div class="person \${className}">
          <span class="label">\${label}</span>
          <div class="name">\${escapeHtml(person.displayName || person.display_name || "이름 없음")}</div>
          <div class="sub">\${escapeHtml(person.mbti || "MBTI 미확인")} · \${escapeHtml(dayPillar)}</div>
          \${voteStatus}
        </div>
      \`;
    }

    function detailContent(match) {
      const detail = match.score_detail || {};
      const male = match.male || {};
      const female = match.female || {};
      const maleManse = getManse(male);
      const femaleManse = getManse(female);
      const maleName = displayName(male);
      const femaleName = displayName(female);
      const maleDay = maleManse?.saju?.dayPillar || "일주 정보";
      const femaleDay = femaleManse?.saju?.dayPillar || "일주 정보";
      const maleStrong = strongestElement(maleManse);
      const femaleStrong = strongestElement(femaleManse);
      const type = detail.relationshipType || "균형 탐색형";
      const mbtiText = \`\${male.mbti || "MBTI"}-\${female.mbti || "MBTI"}\`;
      const report = buildLongReport({
        maleName,
        femaleName,
        maleMbti: male.mbti || "MBTI 미확인",
        femaleMbti: female.mbti || "MBTI 미확인",
        mbtiText,
        maleDay,
        femaleDay,
        maleStrong,
        femaleStrong,
        detail,
        type,
      });

      return \`
        <div class="report-lead">\${escapeHtml(detail.narrative || report.lead)}</div>
        <div class="detail-grid">
          \${report.sections.map((section) => reasonCard(section.eyebrow, section.title, section.paragraphs)).join("")}
        </div>
      \`;
    }

    function reasonCard(eyebrow, title, paragraphs) {
      return '<article class="reason-card"><span class="eyebrow">' + escapeHtml(eyebrow) + '</span><h3>' + escapeHtml(title) + '</h3>' +
        paragraphs.map((text) => '<p>' + escapeHtml(text) + '</p>').join("") +
        '</article>';
    }

    function buildLongReport(context) {
      const {
        maleName,
        femaleName,
        maleMbti,
        femaleMbti,
        mbtiText,
        maleDay,
        femaleDay,
        maleStrong,
        femaleStrong,
        detail,
        type,
      } = context;
      const mbtiScore = scoreNumber(detail.mbtiScore);
      const sajuScore = scoreNumber(detail.sajuScore);
      const consistencyScore = scoreNumber(detail.consistencyScore);
      const baseScore = scoreNumber(detail.baseScore);
      const rawDeviation = scoreNumber(detail.rawDeviation);
      const maxDeviation = scoreNumber(detail.maxDeviation);
      const elementText = maleStrong && femaleStrong
        ? maleName + "님에게는 " + maleStrong + " 기운이 비교적 또렷하고, " + femaleName + "님에게는 " + femaleStrong + " 기운이 눈에 띕니다."
        : "두 사람의 오행 흐름은 어느 한 단어로 고정하기보다 전체 균형과 상호 보완성을 함께 보는 편이 좋습니다.";

      return {
        lead: maleName + "님과 " + femaleName + "님의 매칭은 " + type + "으로 읽힙니다. 이 결과는 MBTI " + mbtiScore + "점, 사주 " + sajuScore + "점, 편차 보정 " + consistencyScore + "점을 함께 반영한 이벤트용 관계 리포트입니다.",
        sections: [
          {
            eyebrow: "01 OVERVIEW",
            title: "두 사람의 첫 인상과 관계 분위기",
            paragraphs: [
              maleName + "님과 " + femaleName + "님의 조합은 처음부터 무겁게 결론을 내리는 관계라기보다, 서로의 반응을 살피며 분위기가 서서히 살아나는 쪽에 가깝습니다. " + maleName + "님은 " + maleMbti + "의 방식으로 상황을 읽고 자신의 관심이 움직이는 지점을 빠르게 포착하는 편이고, " + femaleName + "님은 " + femaleMbti + "의 결을 통해 관계의 온도와 대화의 방향을 조절하는 흐름이 있습니다. 그래서 이 매칭은 단순히 점수가 높다는 말보다, 서로가 서로에게 어떤 장면에서 호기심을 느끼는지를 보는 것이 더 중요합니다.",
              "처음 만났을 때 두 사람은 서로의 표현 속도나 질문 방식에서 작은 차이를 느낄 수 있습니다. 하지만 그 차이가 불편함으로만 작동하기보다는, 상대를 조금 더 알고 싶게 만드는 여백이 될 가능성이 있습니다. " + type + "이라는 분류는 두 사람이 같은 방식으로 움직인다는 뜻이 아니라, 관계가 시작될 때 서로에게 설명 가능한 매력과 조율 가능한 차이가 함께 있다는 뜻에 가깝습니다.",
              "이벤트 매칭에서 중요한 것은 절대적인 운명감이 아니라, 대화를 시작할 만한 충분한 이유가 있는지입니다. 이 조합은 그 이유가 비교적 분명한 편입니다. 서로의 성향과 사주 흐름을 함께 보면, 한 사람만 일방적으로 끌고 가는 구조보다는 각자 다른 방식으로 관계의 리듬을 만들 수 있는 여지가 보입니다. 그래서 첫 대화에서는 정답을 찾기보다, 상대가 어떤 반응에서 편안해지는지 관찰하는 것이 좋습니다.",
            ],
          },
          {
            eyebrow: "02 MBTI",
            title: "MBTI로 보는 대화 리듬과 성향 궁합",
            paragraphs: [
              "MBTI 기준에서 두 사람의 조합은 " + mbtiText + "이며, 이번 계산에서 " + mbtiScore + "점으로 반영되었습니다. 이 점수는 인터넷식 궁합표처럼 단순히 좋고 나쁨을 가르는 용도가 아니라, 대화 방식, 관심사의 전개, 감정 표현의 속도, 서로 다른 상황에서의 반응 패턴을 가볍게 비교한 값입니다. 점수가 높게 나왔다는 것은 적어도 이벤트 상황에서 대화를 시작하고 이어갈 실마리가 충분하다는 뜻으로 볼 수 있습니다.",
              maleName + "님 쪽에서는 상대의 반응이 너무 예측 가능하기보다, 적당히 새로운 느낌을 줄 때 관심이 살아날 가능성이 있습니다. 반면 " + femaleName + "님 쪽에서는 대화가 지나치게 흩어지지 않고, 상대가 자신만의 관점을 분명하게 보여줄 때 안정감을 느낄 수 있습니다. 이 두 흐름이 만나면 질문과 답이 딱딱하게 오가는 관계보다, 한 주제에서 다른 주제로 자연스럽게 넘어가며 분위기가 확장되는 장면이 만들어질 수 있습니다.",
              "다만 MBTI 궁합이 좋다는 말은 두 사람이 항상 같은 방식으로 느낀다는 뜻은 아닙니다. 오히려 좋은 조합일수록 서로가 당연하게 여기는 소통 방식이 다를 수 있습니다. 한 사람은 농담처럼 던진 말에 진심을 담을 수 있고, 다른 한 사람은 차분한 설명 속에서 호감을 표현할 수 있습니다. 그래서 이 조합에서는 빠른 판단보다 상대의 말투 뒤에 있는 의도를 한 번 더 살피는 태도가 관계의 질을 크게 바꿀 수 있습니다.",
            ],
          },
          {
            eyebrow: "03 SAJU",
            title: "사주 흐름으로 보는 기질과 에너지의 만남",
            paragraphs: [
              "사주 기준에서 두 사람은 " + maleDay + "와 " + femaleDay + "의 일주 흐름으로 읽힙니다. 일주는 한 사람의 중심 기질과 관계 안에서 드러나는 반응의 결을 살펴볼 때 참고가 되는 지점입니다. 여기서 중요한 것은 미래가 정해져 있다는 뜻이 아니라, 두 사람이 서로를 만났을 때 어떤 분위기와 속도감이 생길 수 있는지를 상징적으로 보는 것입니다. 이번 사주 궁합 점수는 " + sajuScore + "점으로 계산되었습니다.",
              elementText + " 오행은 누가 더 좋고 나쁘다는 기준이 아니라, 관계 안에서 어떤 에너지가 더 쉽게 드러나는지를 보는 언어입니다. 한쪽이 빠르게 판단하고 움직이는 장면에서 다른 한쪽이 분위기를 안정시키거나, 한쪽이 감정의 흐름을 먼저 느낄 때 다른 한쪽이 방향을 잡아주는 식의 보완이 생길 수 있습니다. 이 조합은 서로의 부족함을 완벽히 채운다기보다, 서로 다른 결을 통해 대화의 폭을 넓히는 쪽에 가깝습니다.",
              "사주 흐름에서 좋은 매칭은 반드시 강렬한 끌림만 의미하지 않습니다. 너무 강한 자극은 초반에는 흥미롭지만 오래 유지되기 어려울 수 있고, 너무 비슷한 흐름은 편안하지만 긴장감이 부족할 수 있습니다. " + maleName + "님과 " + femaleName + "님의 조합은 그 중간 지점에서 볼 수 있습니다. 서로가 낯설게 느껴지는 부분을 피하지 않고 천천히 풀어가면, 관계가 단순한 호감에서 조금 더 이해의 방향으로 이동할 수 있습니다.",
            ],
          },
          {
            eyebrow: "04 SCORE",
            title: "점수 구조와 편차 보정의 의미",
            paragraphs: [
              "이번 최종 점수는 MBTI 점수와 사주 점수의 평균을 중심으로 하되, 두 점수의 차이가 얼마나 큰지도 함께 반영했습니다. 두 사람의 기본 평균은 " + baseScore + "점이고, MBTI와 사주 점수 차이는 " + rawDeviation + "점입니다. 전체 후보군에서 관찰된 최대 편차는 " + maxDeviation + "점이었으며, 이 값을 기준으로 편차 보정 점수 " + consistencyScore + "점이 계산되었습니다.",
              "편차 보정은 궁합의 핵심 점수라기보다, 두 기준이 같은 방향을 말하는지 확인하는 보조 지표입니다. 예를 들어 MBTI는 매우 잘 맞는데 사주 흐름은 다소 조율이 필요하다면, 평균 점수만 볼 때보다 조금 더 신중하게 해석해야 합니다. 반대로 두 점수가 비슷한 방향으로 나오면, 성향과 상징적 에너지 흐름이 서로 크게 어긋나지 않는다는 의미로 볼 수 있습니다.",
              "이 조합은 숫자 하나로 모든 것을 설명하기보다, 왜 이 점수가 나왔는지를 함께 보는 것이 중요합니다. 점수가 높아도 대화가 닫혀 있으면 관계는 깊어지기 어렵고, 점수가 아주 높지 않아도 서로를 이해하려는 태도가 있으면 좋은 장면이 만들어질 수 있습니다. 따라서 이 점수는 결론이 아니라 대화를 시작하기 위한 지도에 가깝습니다.",
            ],
          },
          {
            eyebrow: "05 EMOTION",
            title: "감정 온도와 관계 속도",
            paragraphs: [
              maleName + "님과 " + femaleName + "님 사이에서는 처음부터 모든 감정이 명확하게 드러나기보다, 대화가 이어지면서 호감의 온도가 조금씩 올라가는 그림이 어울립니다. 한쪽이 너무 빠르게 확신을 요구하면 다른 쪽은 부담을 느낄 수 있고, 반대로 너무 가볍게만 흘리면 진심이 전달되지 않을 수 있습니다. 그래서 이 조합의 핵심은 속도를 맞추는 일입니다.",
              "좋은 흐름에서는 두 사람이 서로의 반응을 꽤 세심하게 관찰할 가능성이 있습니다. 말의 내용뿐 아니라 말하는 방식, 답장을 이어가는 온도, 질문을 던지는 타이밍 같은 작은 부분들이 호감의 단서가 될 수 있습니다. 특히 이벤트 상황에서는 짧은 시간 안에 모든 것을 판단하기보다, 상대가 어떤 주제에서 눈빛이 살아나는지 보는 것이 더 좋은 기준이 됩니다.",
              "관계가 조금 더 가까워질수록 중요한 것은 감정의 표현 방식입니다. 누군가는 직접적인 말보다 행동으로 호감을 드러내고, 누군가는 질문을 많이 하는 방식으로 관심을 표현합니다. 이 조합에서는 그런 차이를 오해하지 않는 것이 중요합니다. 상대가 내 방식과 다르게 표현한다고 해서 관심이 없는 것은 아닐 수 있습니다.",
            ],
          },
          {
            eyebrow: "06 CONVERSATION",
            title: "대화를 시작하고 이어가는 방법",
            paragraphs: [
              "첫 대화에서는 너무 무거운 질문보다, 각자의 취향과 최근 관심사를 묻는 쪽이 좋습니다. " + maleName + "님에게는 생각을 확장할 수 있는 질문이 잘 맞고, " + femaleName + "님에게는 자신의 감각과 기준을 자연스럽게 말할 수 있는 질문이 좋습니다. 예를 들어 좋아하는 공간, 요즘 자주 떠올리는 주제, 사람을 볼 때 중요하게 보는 분위기 같은 질문은 부담이 적으면서도 상대의 결을 보여줍니다.",
              "두 사람이 대화를 잘 이어가려면 한쪽이 계속 리드하거나 한쪽이 계속 맞춰주는 방식은 피하는 것이 좋습니다. 질문과 반응이 서로 오가야 관계가 살아납니다. 상대가 말한 내용을 가볍게 넘기지 않고 한 번 더 되짚어 주면, 이 조합에서는 신뢰감이 빨리 생길 수 있습니다. 특히 '왜 그렇게 생각했어?'처럼 이유를 묻는 질문이 의외로 좋은 연결점이 될 수 있습니다.",
              "다만 대화가 너무 분석적으로만 흐르면 감정의 여지가 줄어들 수 있습니다. 이 매칭은 심리적으로 이해받는 느낌과 함께, 가벼운 웃음이 섞일 때 더 매력적으로 작동합니다. 진지한 이야기와 편안한 농담이 번갈아 나올 때 두 사람의 호흡이 가장 자연스럽게 살아날 가능성이 있습니다.",
            ],
          },
          {
            eyebrow: "07 CAUTION",
            title: "조심하면 좋은 지점",
            paragraphs: [
              "이 조합에서 가장 조심해야 할 것은 상대를 너무 빨리 단정하는 태도입니다. 처음 보이는 말투나 반응만으로 상대의 깊이를 판단하면, 실제로는 꽤 다른 매력을 놓칠 수 있습니다. " + maleName + "님과 " + femaleName + "님 모두 자신의 리듬이 있기 때문에, 초반의 어색함은 부정적 신호라기보다 아직 조율이 덜 된 상태일 수 있습니다.",
              "또 하나의 포인트는 감정 표현의 속도 차이입니다. 한 사람은 관심이 생기면 바로 티가 날 수 있고, 다른 한 사람은 조금 더 살핀 뒤에 안정적으로 표현할 수 있습니다. 이때 빠른 쪽은 조급해지지 않는 것이 좋고, 느린 쪽은 최소한의 긍정 신호를 보여주는 것이 좋습니다. 작은 반응 하나가 관계의 방향을 훨씬 부드럽게 만들 수 있습니다.",
              "갈등이 생긴다면 정답을 가리는 방식보다 감정의 배경을 설명하는 방식이 더 잘 맞습니다. '네가 틀렸다'보다 '나는 이 부분에서 이렇게 느꼈다'고 말할 때 관계가 덜 방어적으로 흐릅니다. 이 조합은 서로의 세계를 이겨내는 관계가 아니라, 서로의 세계를 번역해보는 관계에 가까울 때 더 좋아집니다.",
            ],
          },
          {
            eyebrow: "08 GUIDE",
            title: "이벤트에서 활용하는 방법",
            paragraphs: [
              "이 리포트는 두 사람이 반드시 잘 되어야 한다는 뜻이 아니라, 대화를 시작해볼 충분한 이유가 있다는 안내에 가깝습니다. 이벤트에서는 결과를 너무 진지한 판정표처럼 받아들이기보다, 서로에게 질문을 던질 수 있는 재미있는 출발점으로 쓰는 것이 가장 좋습니다. 점수보다 중요한 것은 실제로 마주했을 때의 편안함과 호기심입니다.",
              maleName + "님은 " + femaleName + "님에게 너무 정답 같은 인상을 주려 하기보다, 자신의 관심사와 생각의 흐름을 자연스럽게 보여주는 것이 좋습니다. " + femaleName + "님은 " + maleName + "님의 반응을 바로 결론 내리기보다, 그 사람이 어떤 방식으로 호감을 표현하는지 조금 더 살펴보면 좋습니다. 서로에게 필요한 것은 완벽한 첫인상보다 이어지는 대화입니다.",
              "최종적으로 이 매칭은 " + type + "이라는 이름처럼, 관계의 가능성을 한 방향으로만 밀어붙이기보다 서로의 차이와 공통점을 함께 살펴볼 때 가장 잘 살아납니다. 마음에 남는 질문 하나, 편안했던 웃음 하나, 예상보다 잘 통했던 주제 하나가 있다면 그것만으로도 이 매칭은 충분히 의미 있는 시작점이 될 수 있습니다.",
            ],
          },
        ],
      };
    }

    function rankTierClass(rank) {
      const numeric = Number(rank);
      if (numeric === 1) return "rank-1";
      if (numeric === 2) return "rank-2";
      if (numeric === 3) return "rank-3";
      return "";
    }

    function getManse(person) {
      return person?.manse || person?.manse_result || null;
    }

    function displayName(person) {
      return person?.displayName || person?.display_name || "상대";
    }

    function strongestElement(manse) {
      const counts = manse?.elementDistribution?.counts || {};
      let best = "";
      let bestCount = -1;
      Object.entries(counts).forEach(([element, count]) => {
        const numeric = Number(count || 0);
        if (numeric > bestCount) {
          best = element;
          bestCount = numeric;
        }
      });
      return best;
    }

    function scoreNumber(value) {
      const number = Number(value);
      return Number.isFinite(number) ? String(Math.round(number)) : "-";
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

module.exports = { resultsPage };
