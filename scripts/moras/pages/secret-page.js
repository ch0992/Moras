/**
 * Secret page: PIN-protected full submissions view.
 */

function secretPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moras — Secret</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #060913;
      --panel: rgba(10, 15, 30, 0.85);
      --line: rgba(255,255,255,0.08);
      --text: #F8FAFC;
      --muted: rgba(248,250,252,0.45);
      --gold: #FFE8A3;
      --gold-dim: rgba(255,232,163,0.18);
      --accent: #8B5CF6;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Outfit', 'Noto Sans KR', sans-serif; }

    .pin-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 32px;
      padding: 24px;
    }
    .pin-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.05em;
      text-align: center;
    }
    .pin-subtitle {
      font-size: 13px;
      color: var(--muted);
      text-align: center;
      margin-top: -20px;
    }
    .pin-inputs {
      display: flex;
      gap: 10px;
    }
    .pin-digit {
      width: 52px;
      height: 64px;
      background: var(--panel);
      border: 1.5px solid var(--line);
      border-radius: 10px;
      color: var(--text);
      font-size: 26px;
      font-weight: 700;
      text-align: center;
      caret-color: var(--gold);
      outline: none;
      transition: border-color 0.15s;
    }
    .pin-digit:focus {
      border-color: var(--gold);
      background: rgba(255,232,163,0.07);
    }
    .pin-digit.filled {
      border-color: rgba(255,232,163,0.5);
    }
    .pin-error {
      color: #f87171;
      font-size: 13px;
      text-align: center;
      min-height: 18px;
    }
    .pin-btn {
      background: var(--gold);
      color: #0a0a0a;
      border: none;
      border-radius: 10px;
      padding: 14px 40px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.04em;
      transition: opacity 0.15s;
    }
    .pin-btn:hover { opacity: 0.88; }
    .pin-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Data table */
    .data-screen { display: none; padding: 24px 16px; }
    .data-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .data-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--gold);
    }
    .data-count {
      font-size: 13px;
      color: var(--muted);
    }
    .table-wrap {
      overflow-x: auto;
      border-radius: 10px;
      border: 1px solid var(--line);
    }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: rgba(255,232,163,0.07); }
    th {
      padding: 10px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      border-bottom: 1px solid var(--line);
    }
    td {
      padding: 9px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      color: var(--text);
      white-space: nowrap;
      vertical-align: middle;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255,255,255,0.025); }
    .muted { color: var(--muted); font-size: 12px; }
    .null { color: rgba(255,255,255,0.2); font-size: 11px; }
    .badge-m { color: #60a5fa; font-weight: 600; }
    .badge-f { color: #f472b6; font-weight: 600; }
    .tag {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(255,255,255,0.07);
      margin-right: 2px;
    }
  </style>
</head>
<body>

  <!-- PIN screen -->
  <div class="pin-screen" id="pin-screen">
    <div class="pin-title">보안 접근</div>
    <p class="pin-subtitle">6자리 코드를 입력하세요</p>
    <div class="pin-inputs" id="pin-inputs">
      <input class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" autocomplete="off" data-index="0">
      <input class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" autocomplete="off" data-index="1">
      <input class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" autocomplete="off" data-index="2">
      <input class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" autocomplete="off" data-index="3">
      <input class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" autocomplete="off" data-index="4">
      <input class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" autocomplete="off" data-index="5">
    </div>
    <div class="pin-error" id="pin-error"></div>
    <button class="pin-btn" id="pin-submit" disabled>확인</button>
  </div>

  <!-- Data screen -->
  <div class="data-screen" id="data-screen">
    <div class="data-header">
      <div>
        <div class="data-title">전체 신청자 데이터</div>
        <div class="data-count" id="data-count"></div>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>제출시간</th>
            <th>이름</th>
            <th>성별</th>
            <th>혼인상태</th>
            <th>MBTI</th>
            <th>생년월일시</th>
            <th>달력</th>
            <th>출생지</th>
            <th>사주 팔자</th>
            <th>매칭범위</th>
            <th>분석</th>
          </tr>
        </thead>
        <tbody id="secret-rows"></tbody>
      </table>
    </div>
  </div>

<script>
  const digits = Array.from(document.querySelectorAll('.pin-digit'));
  const submitBtn = document.getElementById('pin-submit');
  const errorEl = document.getElementById('pin-error');

  digits.forEach((el, i) => {
    el.addEventListener('input', () => {
      el.value = el.value.replace(/[^0-9]/g, '').slice(-1);
      el.classList.toggle('filled', el.value !== '');
      if (el.value && i < digits.length - 1) digits[i + 1].focus();
      updateSubmit();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !el.value && i > 0) {
        digits[i - 1].value = '';
        digits[i - 1].classList.remove('filled');
        digits[i - 1].focus();
        updateSubmit();
      }
      if (e.key === 'Enter') submitBtn.click();
    });
    el.addEventListener('paste', (e) => {
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 6);
      if (pasted.length === 6) {
        e.preventDefault();
        pasted.split('').forEach((ch, idx) => {
          digits[idx].value = ch;
          digits[idx].classList.add('filled');
        });
        digits[5].focus();
        updateSubmit();
      }
    });
  });

  function updateSubmit() {
    const pin = digits.map(d => d.value).join('');
    submitBtn.disabled = pin.length !== 6;
  }

  submitBtn.addEventListener('click', async () => {
    const pin = digits.map(d => d.value).join('');
    if (pin.length !== 6) return;
    errorEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = '확인 중...';
    try {
      const res = await fetch('/api/secret/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        errorEl.textContent = data.error || '코드가 올바르지 않습니다.';
        digits.forEach(d => { d.value = ''; d.classList.remove('filled'); });
        digits[0].focus();
        updateSubmit();
        submitBtn.textContent = '확인';
        return;
      }
      document.getElementById('pin-screen').style.display = 'none';
      document.getElementById('data-screen').style.display = 'block';
      renderTable(data.submissions || []);
    } catch {
      errorEl.textContent = '서버 오류가 발생했습니다.';
      submitBtn.textContent = '확인';
    }
  });

  function esc(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatDt(iso) {
    if (!iso) return '<span class="null">N/A</span>';
    const d = new Date(iso);
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    const hh = String(d.getHours()).padStart(2,'0');
    const mi = String(d.getMinutes()).padStart(2,'0');
    return esc(d.getFullYear() + '-' + mm + '-' + dd + ' ' + hh + ':' + mi);
  }

  function renderTable(submissions) {
    document.getElementById('data-count').textContent = submissions.length + '명 신청';
    const tbody = document.getElementById('secret-rows');
    if (!submissions.length) {
      tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:32px;color:var(--muted);">신청자 없음</td></tr>';
      return;
    }
    tbody.innerHTML = submissions.map(s => {
      const saju = s.manse?.saju || {};
      const sajuText = [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar].filter(Boolean).join(' / ') || '<span class="null">N/A</span>';
      const timeDisplay = s.birthTimeUnknown ? '시간모름' : (s.birthTime || '');
      const calDisplay = s.calendarType === 'lunar' ? '음력' : '양력';
      const genderClass = s.gender === '남' ? 'badge-m' : s.gender === '여' ? 'badge-f' : '';
      const range = Array.isArray(s.matchingMaritalRange) && s.matchingMaritalRange.length
        ? s.matchingMaritalRange.map(r => '<span class="tag">' + esc(r) + '</span>').join('')
        : '<span class="null">N/A</span>';
      const analysisStatus = s.geminiAnalysis?.status === 'test'
        ? '<span class="muted">테스트</span>'
        : s.geminiAnalysis?.report_title
          ? '<span style="color:#4ade80;font-size:11px;">완료</span>'
          : '<span class="null">없음</span>';
      return '<tr>'
        + '<td class="muted">' + formatDt(s.submittedAt) + '</td>'
        + '<td><strong>' + esc(s.displayName) + '</strong></td>'
        + '<td class="' + genderClass + '">' + esc(s.gender || '') + '</td>'
        + '<td>' + esc(s.maritalStatus || '') + '</td>'
        + '<td>' + esc(s.mbti || '') + '</td>'
        + '<td>' + esc(s.birthDate || '') + ' ' + esc(timeDisplay) + '</td>'
        + '<td>' + esc(calDisplay) + '</td>'
        + '<td>' + esc(s.birthPlace || '') + '</td>'
        + '<td>' + sajuText + '</td>'
        + '<td>' + range + '</td>'
        + '<td>' + analysisStatus + '</td>'
        + '</tr>';
    }).join('');
  }
</script>
</body>
</html>`;
}

module.exports = { secretPage };
