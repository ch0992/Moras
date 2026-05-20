/**
 * Moras manse submission orchestration.
 *
 * Responsibilities:
 * - Normalize participant input and calculate manseryeok data.
 * - Combine calculated data with Gemini analysis and persistence.
 * - Keep HTTP routing and HTML page rendering out of this file.
 */

const crypto = require("node:crypto");
const { buildResult, formatDate, formatLunar } = require("../validate-manseryeok");
const { analyzeManseWithGemini } = require("./gemini");
const { saveSubmission } = require("./storage");

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
    notice:
      "생년월일시와 출생지는 공개 화면이나 결과 페이지에 노출되지 않으며, 운영자 확인을 위해 관리자 화면에서만 조회됩니다. 매칭에는 MBTI와 계산된 만세력 결과를 사용합니다.",
    geminiAnalysis: input.geminiAnalysis || null,
  };
}

function buildSubmission(input, birthPlace, result, geminiAnalysis) {
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
    geminiAnalysis,
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
  const geminiAnalysis = await analyzeManseWithGemini({
    name: body.name,
    mbti: normalizeMbti(body.mbti),
    birthPlace: birthPlace.name,
    result,
  });
  const submission = await saveSubmission(buildSubmission(body, birthPlace, result, geminiAnalysis));

  return {
    submission,
    result,
    geminiAnalysis,
    view: buildViewModel(result, {
      ...body,
      birthPlace: birthPlace.name,
      submissionId: submission.id,
      geminiAnalysis,
    }),
  };
}

module.exports = { handleManseApi, CITIES };
