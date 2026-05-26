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
const {
  findRosterParticipantById,
  hasSubmissionForRosterParticipant,
  readRosterParticipants,
  readSubmissions,
  saveSubmission,
} = require("./storage");

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
    gender: normalizeGender(input.gender),
    maritalStatus: normalizeMaritalStatus(input.maritalStatus),
    mbti: normalizeMbti(input.mbti),
    profileTitle: `${result.saju.dayPillar}(${stemColorName(result.pillars.day.stem.hangul)} ${result.pillars.day.branch.animal})`,
    cells,
    solarText: `${formatDate(result.normalizedSolarDate)} ${input.timeUnknown ? "시간모름" : input.time}`,
    lunarText: `${formatLunar(result.normalizedLunarDate)} ${input.timeUnknown ? "시간모름" : input.time}`,
    locationText: `${input.birthPlace || "출생지 미입력"} (진태양시 보정 적용)`,
    notice:
      "생년월일시와 출생지는 공개 화면 및 관리자 화면에 노출되지 않으며, 별도의 보안 페이지에만 저장됩니다. 매칭에는 MBTI와 계산된 만세력 결과를 사용합니다.",
    geminiAnalysis: input.geminiAnalysis || null,
  };
}

function buildSubmission(input, birthPlace, result, geminiAnalysis) {
  return {
    id: crypto.randomUUID(),
    rosterParticipantId: nullableString(input.rosterParticipantId),
    submittedAt: new Date().toISOString(),
    displayName: nullableString(input.name),
    gender: normalizeGender(input.gender),
    maritalStatus: normalizeMaritalStatus(input.maritalStatus),
    matchingMaritalRange: Array.isArray(input.matchingMaritalRange)
      ? input.matchingMaritalRange.filter((s) => ["미혼", "기혼", "돌싱"].includes(s))
      : [],
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

function normalizeGender(value) {
  const gender = String(value || "").trim();
  return ["남", "여"].includes(gender) ? gender : null;
}

function normalizeMaritalStatus(value) {
  const maritalStatus = String(value || "").trim();
  return ["미혼", "기혼", "돌싱"].includes(maritalStatus) ? maritalStatus : null;
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
  const prepared = await prepareManseSubmission(body);
  return completeManseSubmission(prepared);
}

async function handleManseStartApi(body) {
  const prepared = await prepareManseSubmission(body);
  return {
    analysisRequest: prepared,
    view: buildViewModel(prepared.result, {
      ...prepared.input,
      birthPlace: prepared.birthPlace.name,
      geminiAnalysis: { status: "pending" },
    }),
  };
}

async function handleManseAnalyzeApi(body) {
  const prepared = body?.analysisRequest || body;
  if (!prepared?.input || !prepared?.birthPlace || !prepared?.result) {
    throw new Error("분석 요청 정보가 올바르지 않습니다. 신청 버튼을 다시 눌러주세요.");
  }

  const rosterParticipant = await findRosterParticipantById(prepared.input.rosterParticipantId);
  if (!rosterParticipant || rosterParticipant.isActive === false) {
    throw new Error("참가자 명단에서 신청자를 선택해주세요.");
  }
  if (await hasSubmissionForRosterParticipant(rosterParticipant.id)) {
    throw new Error("이미 이벤트 신청이 완료된 참가자입니다.");
  }

  return completeManseSubmission({
    input: {
      ...prepared.input,
      rosterParticipantId: rosterParticipant.id,
      name: rosterParticipant.displayName,
      gender: rosterParticipant.gender,
    },
    birthPlace: prepared.birthPlace,
    result: prepared.result,
  });
}

async function prepareManseSubmission(body) {
  const rosterParticipant = await findRosterParticipantById(body.rosterParticipantId);
  if (!rosterParticipant || rosterParticipant.isActive === false) {
    throw new Error("참가자 명단에서 신청자를 선택해주세요.");
  }
  if (await hasSubmissionForRosterParticipant(rosterParticipant.id)) {
    throw new Error("이미 이벤트 신청이 완료된 참가자입니다.");
  }

  const normalizedBody = {
    ...body,
    rosterParticipantId: rosterParticipant.id,
    name: rosterParticipant.displayName,
    gender: rosterParticipant.gender,
  };
  const birthPlace = resolveBirthPlace(body.birthPlace, body.customBirthPlace);
  const result = buildResult({
    date: normalizedBody.date,
    time: normalizedBody.timeUnknown ? "unknown" : normalizedBody.time,
    calendar: normalizedBody.calendar || "solar",
    leapMonth: Boolean(normalizedBody.leapMonth),
    longitude: birthPlace.longitude,
    timezone: birthPlace.timezone,
    timeCorrection: true,
  });

  return {
    input: normalizedBody,
    birthPlace,
    result,
  };
}

async function completeManseSubmission({ input, birthPlace, result }) {
  const geminiAnalysis = await analyzeManseWithGemini({
    name: input.name,
    mbti: normalizeMbti(input.mbti),
    birthPlace: birthPlace.name,
    result,
  });
  const submission = await saveSubmission(buildSubmission(input, birthPlace, result, geminiAnalysis));

  return {
    submission,
    result,
    geminiAnalysis,
    view: buildViewModel(result, {
      ...input,
      birthPlace: birthPlace.name,
      submissionId: submission.id,
      geminiAnalysis,
    }),
  };
}

async function seedTestSubmissionsFromRoster() {
  const [roster, submissions] = await Promise.all([
    readRosterParticipants(),
    readSubmissions(),
  ]);
  const existingRosterIds = new Set(submissions.map((item) => item.rosterParticipantId).filter(Boolean));
  const mbtis = ["ENFP", "INFP", "ENFJ", "INFJ", "ENTP", "INTP", "ESFJ", "ISFJ", "ESTP", "ISTP", "ENTJ", "INTJ", "ESFP", "ISFP", "ESTJ", "ISTJ"];
  const cities = CITIES.filter((item) => !item.custom);
  let created = 0;
  let skipped = 0;

  for (let index = 0; index < roster.length; index += 1) {
    const participant = roster[index];
    if (!participant.id || existingRosterIds.has(participant.id)) {
      skipped += 1;
      continue;
    }
    const year = 1988 + (index % 17);
    const month = (index % 12) + 1;
    const day = (index % 25) + 1;
    const hour = 8 + (index % 12);
    const minute = (index % 4) * 15;
    const birthPlace = cities[index % cities.length] || CITIES[0];
    const input = {
      rosterParticipantId: participant.id,
      name: participant.displayName,
      gender: participant.gender,
      maritalStatus: "미혼",
      mbti: mbtis[index % mbtis.length],
      date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      timeUnknown: false,
      calendar: "solar",
    };
    const result = buildResult({
      date: input.date,
      time: input.time,
      calendar: input.calendar,
      leapMonth: false,
      longitude: birthPlace.longitude,
      timezone: birthPlace.timezone,
      timeCorrection: true,
    });
    await saveSubmission(buildSubmission(input, birthPlace, result, {
      status: "test",
      analysis_summary: "관리자 테스트 데이터입니다. 실제 Gemini 분석은 이벤트 신청 시 생성됩니다.",
    }));
    existingRosterIds.add(participant.id);
    created += 1;
  }

  return { created, skipped, total: roster.length };
}

module.exports = { handleManseApi, handleManseStartApi, handleManseAnalyzeApi, seedTestSubmissionsFromRoster, CITIES };
