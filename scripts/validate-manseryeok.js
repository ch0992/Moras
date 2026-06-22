#!/usr/bin/env node

const {
  calculateSaju,
  getPillarByHangul,
  lunarToSolar,
  solarToLunar,
} = require("@fullstackfamily/manseryeok");
const fs = require("node:fs");
const path = require("node:path");
const projectPackage = require("../package.json");

const ELEMENTS = ["목", "화", "토", "금", "수"];
const STEMS = {
  갑: { element: "목", polarity: "yang" },
  을: { element: "목", polarity: "yin" },
  병: { element: "화", polarity: "yang" },
  정: { element: "화", polarity: "yin" },
  무: { element: "토", polarity: "yang" },
  기: { element: "토", polarity: "yin" },
  경: { element: "금", polarity: "yang" },
  신: { element: "금", polarity: "yin" },
  임: { element: "수", polarity: "yang" },
  계: { element: "수", polarity: "yin" },
};
const ELEMENT_RELATIONS = {
  목: { produces: "화", controls: "토", producedBy: "수", controlledBy: "금" },
  화: { produces: "토", controls: "금", producedBy: "목", controlledBy: "수" },
  토: { produces: "금", controls: "수", producedBy: "화", controlledBy: "목" },
  금: { produces: "수", controls: "목", producedBy: "토", controlledBy: "화" },
  수: { produces: "목", controls: "화", producedBy: "금", controlledBy: "토" },
};
const BRANCH_MAIN_STEMS = {
  자: "계",
  축: "기",
  인: "갑",
  묘: "을",
  진: "무",
  사: "병",
  오: "정",
  미: "기",
  신: "경",
  유: "신",
  술: "무",
  해: "임",
};
const HIDDEN_STEMS = {
  자: ["임", "계"],
  축: ["계", "신", "기"],
  인: ["무", "병", "갑"],
  묘: ["갑", "을"],
  진: ["을", "계", "무"],
  사: ["무", "경", "병"],
  오: ["병", "기", "정"],
  미: ["정", "을", "기"],
  신: ["무", "임", "경"],
  유: ["경", "신"],
  술: ["신", "정", "무"],
  해: ["무", "갑", "임"],
};
const PILLAR_ORDER = ["year", "month", "day", "hour"];
const PILLAR_LABELS = {
  year: "연주",
  month: "월주",
  day: "일주",
  hour: "시주",
};

const TWELVE_STAGES = {
  갑: { 자: "목욕", 축: "관대", 인: "건록", 묘: "제왕", 진: "쇠", 사: "병", 오: "사", 미: "묘", 신: "절", 유: "태", 술: "양", 해: "장생" },
  을: { 자: "병", 축: "쇠", 인: "제왕", 묘: "건록", 진: "관대", 사: "목욕", 오: "장생", 미: "양", 신: "태", 유: "절", 술: "묘", 해: "사" },
  병: { 자: "태", 축: "양", 인: "장생", 묘: "목욕", 진: "관대", 사: "건록", 오: "제왕", 미: "쇠", 신: "병", 유: "사", 술: "묘", 해: "절" },
  정: { 자: "절", 축: "묘", 인: "사", 묘: "병", 진: "쇠", 사: "제왕", 오: "건록", 미: "관대", 신: "목욕", 유: "장생", 술: "양", 해: "태" },
  무: { 자: "태", 축: "양", 인: "장생", 묘: "목욕", 진: "관대", 사: "건록", 오: "제왕", 미: "쇠", 신: "병", 유: "사", 술: "묘", 해: "절" },
  기: { 자: "절", 축: "묘", 인: "사", 묘: "병", 진: "쇠", 사: "제왕", 오: "건록", 미: "관대", 신: "목욕", 유: "장생", 술: "양", 해: "태" },
  경: { 자: "사", 축: "묘", 인: "절", 묘: "태", 진: "양", 사: "장생", 오: "목욕", 미: "관대", 신: "건록", 유: "제왕", 술: "쇠", 해: "병" },
  신: { 자: "장생", 축: "양", 인: "태", 묘: "절", 진: "묘", 사: "사", 오: "병", 미: "쇠", 신: "제왕", 유: "건록", 술: "관대", 해: "목욕" },
  임: { 자: "제왕", 축: "쇠", 인: "병", 묘: "사", 진: "묘", 사: "절", 오: "태", 미: "양", 신: "장생", 유: "목욕", 술: "관대", 해: "건록" },
  계: { 자: "건록", 축: "관대", 인: "목욕", 묘: "장생", 진: "양", 사: "태", 오: "절", 미: "묘", 신: "사", 유: "병", 술: "쇠", 해: "제왕" },
};

const TWELVE_GODS_BY_GROUP = {
  "인오술": { 해: "겁살", 자: "재살", 축: "천살", 인: "지살", 묘: "년살", 진: "월살", 사: "망신살", 오: "장성살", 미: "반안살", 신: "역마살", 유: "육해살", 술: "화개살" },
  "사유축": { 인: "겁살", 묘: "재살", 진: "천살", 사: "지살", 오: "년살", 미: "월살", 신: "망신살", 유: "장성살", 술: "반안살", 해: "역마살", 자: "육해살", 축: "화개살" },
  "신자진": { 사: "겁살", 오: "재살", 미: "천살", 신: "지살", 유: "년살", 술: "월살", 해: "망신살", 자: "장성살", 축: "반안살", 인: "역마살", 묘: "육해살", 진: "화개살" },
  "해묘미": { 신: "겁살", 유: "재살", 술: "천살", 해: "지살", 자: "년살", 축: "월살", 인: "망신살", 묘: "장성살", 진: "반안살", 사: "역마살", 오: "육해살", 미: "화개살" },
};

function printUsage() {
  console.log(`Moras 만세력 정확도 검증 CLI

Usage:
  npm run manse:validate -- --date YYYY-MM-DD --time HH:mm [options]

Required:
  --date YYYY-MM-DD        Birth date. Interpreted by --calendar.
  --time HH:mm             Birth time in the supplied timezone/local standard.

Options:
  --calendar solar|lunar   Default: solar.
  --leap-month true|false  Lunar input only. Default: false.
  --longitude number       Optional birthplace longitude. Default: 127.
  --timezone value         Metadata only. Default: Asia/Seoul.
  --time-correction bool   Apply true solar time correction. Default: true.
  --json                   Print machine-readable JSON only.

Examples:
  npm run manse:validate -- --date 1990-05-15 --time 14:30 --calendar solar
  npm run manse:validate -- --date 1990-04-21 --time 14:30 --calendar lunar
`);
}

function parseArgs(argv) {
  const args = {
    calendar: "solar",
    leapMonth: false,
    longitude: 127,
    timezone: "Asia/Seoul",
    timeCorrection: true,
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token === "--json") {
      args.json = true;
      continue;
    }
    if (!token.startsWith("--")) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${token}`);
    }
    i += 1;

    if (key === "date") args.date = value;
    else if (key === "time") args.time = value;
    else if (key === "calendar") args.calendar = value;
    else if (key === "leap-month") args.leapMonth = parseBoolean(value, key);
    else if (key === "longitude") args.longitude = parseNumber(value, key);
    else if (key === "timezone") args.timezone = value;
    else if (key === "time-correction") args.timeCorrection = parseBoolean(value, key);
    else throw new Error(`Unknown option: ${token}`);
  }

  return args;
}

function parseBoolean(value, key) {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`--${key} must be true or false`);
}

function parseNumber(value, key) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`--${key} must be a number`);
  }
  return parsed;
}

function parseDate(dateText) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText || "");
  if (!match) {
    throw new Error("--date must use YYYY-MM-DD");
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseTime(timeText) {
  if (timeText === "unknown") {
    return null;
  }

  const match = /^(\d{2}):(\d{2})$/.exec(timeText || "");
  if (!match) {
    throw new Error("--time must use HH:mm or unknown");
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error("--time must be a valid 24-hour time");
  }

  return { hour, minute };
}

function normalizeInput(args) {
  const inputDate = parseDate(args.date);
  const inputTime = parseTime(args.time);

  if (!["solar", "lunar"].includes(args.calendar)) {
    throw new Error("--calendar must be solar or lunar");
  }

  const solar =
    args.calendar === "lunar"
      ? lunarToSolar(inputDate.year, inputDate.month, inputDate.day, args.leapMonth).solar
      : inputDate;
  const lunar = solarToLunar(solar.year, solar.month, solar.day).lunar;

  return {
    input: {
      calendar: args.calendar,
      date: args.date,
      time: inputTime ? args.time : "unknown",
      leapMonth: args.calendar === "lunar" ? args.leapMonth : undefined,
      timezone: args.timezone,
      longitude: args.longitude,
      applyTimeCorrection: args.timeCorrection,
    },
    solar,
    lunar,
    time: inputTime,
  };
}

function pillarDetail(pillar) {
  if (!pillar) return null;

  const detail = getPillarByHangul(pillar);
  if (!detail) {
    throw new Error(`Cannot resolve pillar detail: ${pillar}`);
  }

  return {
    hangul: detail.combined.hangul,
    hanja: detail.combined.hanja,
    stem: {
      hangul: detail.tiangan.hangul,
      hanja: detail.tiangan.hanja,
      element: detail.tiangan.element,
    },
    branch: {
      hangul: detail.dizhi.hangul,
      hanja: detail.dizhi.hanja,
      element: detail.dizhi.element,
      animal: detail.dizhi.animal,
    },
  };
}

function countElements(pillars) {
  const counts = Object.fromEntries(ELEMENTS.map((element) => [element, 0]));
  const slots = [];

  for (const [name, pillar] of Object.entries(pillars)) {
    if (!pillar) continue;

    slots.push({ pillar: name, slot: "천간", element: pillar.stem.element });
    slots.push({ pillar: name, slot: "지지", element: pillar.branch.element });
    counts[pillar.stem.element] += 1;
    counts[pillar.branch.element] += 1;
  }

  return { counts, slots, note: `천간/지지 ${slots.length}개 기준이며 지장간은 제외` };
}

function buildResult(args) {
  const normalized = normalizeInput(args);
  const saju = calculateSaju(
    normalized.solar.year,
    normalized.solar.month,
    normalized.solar.day,
    normalized.time ? normalized.time.hour : undefined,
    normalized.time ? normalized.time.minute : undefined,
    {
      longitude: args.longitude,
      applyTimeCorrection: args.timeCorrection,
    },
  );

  const pillars = {
    year: pillarDetail(saju.yearPillar),
    month: pillarDetail(saju.monthPillar),
    day: pillarDetail(saju.dayPillar),
    hour: saju.hourPillar ? pillarDetail(saju.hourPillar) : null,
  };

  return {
    package: "@fullstackfamily/manseryeok",
    packageVersion: getPackageVersion(),
    normalizedInput: normalized.input,
    normalizedSolarDate: normalized.solar,
    normalizedLunarDate: normalized.lunar,
    saju: {
      yearPillar: saju.yearPillar,
      yearPillarHanja: saju.yearPillarHanja,
      monthPillar: saju.monthPillar,
      monthPillarHanja: saju.monthPillarHanja,
      dayPillar: saju.dayPillar,
      dayPillarHanja: saju.dayPillarHanja,
      hourPillar: saju.hourPillar,
      hourPillarHanja: saju.hourPillarHanja,
      dayStem: pillars.day.stem.hangul,
      dayStemHanja: pillars.day.stem.hanja,
      isTimeCorrected: saju.isTimeCorrected,
      correctedTime: saju.correctedTime || null,
    },
    pillars,
    elementDistribution: countElements(pillars),
    derived: buildDerived(pillars),
  };
}

function buildDerived(pillars) {
  const dayStem = pillars.day.stem.hangul;
  const yearBranch = pillars.year.branch.hangul;
  const dayBranch = pillars.day.branch.hangul;

  // Year-basis Group (for Month, Day, Hour)
  const twelveGodsGroupYear = getTwelveGodsGroup(yearBranch);
  const twelveGodsMapYear = TWELVE_GODS_BY_GROUP[twelveGodsGroupYear];

  // Day-basis Group (for Year)
  const twelveGodsGroupDay = getTwelveGodsGroup(dayBranch);
  const twelveGodsMapDay = TWELVE_GODS_BY_GROUP[twelveGodsGroupDay];

  const byPillar = {};

  for (const name of PILLAR_ORDER) {
    if (!pillars[name]) {
      byPillar[name] = {
        stemTenGod: "X",
        branchTenGod: "X",
        hiddenStems: "X",
        twelveStage: "X",
        twelveGod: "X",
        twelveGodDisplay: "X",
      };
      continue;
    }
    const branch = pillars[name].branch.hangul;

    // Year Pillar uses Day Branch (일지) basis.
    // Month, Day, Hour Pillars use Year Branch (년지) basis.
    const twelveGodsMap = name === "year" ? twelveGodsMapDay : twelveGodsMapYear;
    const resolvedTwelveGod = twelveGodsMap[branch];

    byPillar[name] = {
      stemTenGod: getTenGod(dayStem, pillars[name].stem.hangul),
      branchTenGod: getTenGod(dayStem, BRANCH_MAIN_STEMS[branch]),
      hiddenStems: HIDDEN_STEMS[branch].join(""),
      twelveStage: TWELVE_STAGES[dayStem][branch],
      twelveGod: resolvedTwelveGod,
      twelveGodDisplay: resolvedTwelveGod,
    };
  }

  return {
    basis: {
      twelveStage: "일간 기준",
      twelveGod: "연주:일지기준 / 월·일·시주:년지기준 삼합",
      twelveGodYearBranch: yearBranch,
      twelveGodGroup: twelveGodsGroupYear,
    },
    byPillar,
  };
}

function getTenGod(dayStem, targetStem) {
  const day = STEMS[dayStem];
  const target = STEMS[targetStem];
  const samePolarity = day.polarity === target.polarity;
  const relations = ELEMENT_RELATIONS[day.element];

  if (target.element === day.element) return samePolarity ? "비견" : "겁재";
  if (target.element === relations.produces) return samePolarity ? "식신" : "상관";
  if (target.element === relations.controls) return samePolarity ? "편재" : "정재";
  if (target.element === relations.controlledBy) return samePolarity ? "편관" : "정관";
  if (target.element === relations.producedBy) return samePolarity ? "편인" : "정인";
  throw new Error(`Cannot resolve 십성: ${dayStem} -> ${targetStem}`);
}

function getTwelveGodsGroup(branch) {
  if (["인", "오", "술"].includes(branch)) return "인오술";
  if (["사", "유", "축"].includes(branch)) return "사유축";
  if (["신", "자", "진"].includes(branch)) return "신자진";
  if (["해", "묘", "미"].includes(branch)) return "해묘미";
  throw new Error(`Cannot resolve 12신살 group: ${branch}`);
}

function getPackageVersion() {
  const declaredVersion = String(projectPackage.dependencies?.["@fullstackfamily/manseryeok"] || "").replace(/^[^\d]*/, "");
  try {
    const packagePath = path.join(
      __dirname,
      "..",
      "node_modules",
      "@fullstackfamily",
      "manseryeok",
      "package.json",
    );
    return JSON.parse(fs.readFileSync(packagePath, "utf8")).version;
  } catch {
    return declaredVersion || "unknown";
  }
}

function printHuman(result) {
  console.log("=== Moras 만세력 정확도 검증 결과 ===");
  console.log(`패키지: ${result.package}@${result.packageVersion}`);
  console.log(
    `입력: ${result.normalizedInput.calendar} ${result.normalizedInput.date} ${result.normalizedInput.time}, ` +
      `timezone=${result.normalizedInput.timezone}, longitude=${result.normalizedInput.longitude}, ` +
      `timeCorrection=${result.normalizedInput.applyTimeCorrection}`,
  );
  console.log(
    `양력 기준일: ${formatDate(result.normalizedSolarDate)} / 음력: ${formatLunar(result.normalizedLunarDate)}`,
  );
  if (result.saju.correctedTime) {
    console.log(
      `보정 시간: ${String(result.saju.correctedTime.hour).padStart(2, "0")}:${String(
        result.saju.correctedTime.minute,
      ).padStart(2, "0")}`,
    );
  }
  console.log("");

  console.table([
    row("연주", result.pillars.year, result.derived.byPillar.year),
    row("월주", result.pillars.month, result.derived.byPillar.month),
    row("일주", result.pillars.day, result.derived.byPillar.day),
    row("시주", result.pillars.hour, result.derived.byPillar.hour),
  ]);

  console.log(`일간: ${result.saju.dayStem} (${result.saju.dayStemHanja})`);
  console.log(`오행 분포: ${formatElements(result.elementDistribution.counts)}`);
  console.log(`오행 기준: ${result.elementDistribution.note}`);
  console.log(`12운성 기준: ${result.derived.basis.twelveStage}`);
  console.log(
    `12신살 기준: ${result.derived.basis.twelveGod} (${result.derived.basis.twelveGodYearBranch}=${result.derived.basis.twelveGodGroup})`,
  );
  console.log("");
  console.log("포스텔러 비교값을 docs/validation/manseryeok-accuracy-checklist.md에 기록하세요.");
}

function row(label, pillar, derived) {
  if (!pillar) {
    return {
      항목: label,
      갑자: "시간모름",
      한자: "",
      천간오행: "",
      천간십성: "X",
      지지오행: "",
      지지십성: "X",
      지장간: "X",
      동물: "",
      "12운성": "X",
      "12신살": "X",
    };
  }

  return {
    항목: label,
    갑자: pillar.hangul,
    한자: pillar.hanja,
    천간오행: pillar.stem.element,
    천간십성: derived.stemTenGod,
    지지오행: pillar.branch.element,
    지지십성: derived.branchTenGod,
    지장간: derived.hiddenStems,
    동물: pillar.branch.animal,
    "12운성": derived.twelveStage,
    "12신살": derived.twelveGodDisplay,
  };
}

function formatDate(date) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

function formatLunar(date) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}${
    date.isLeapMonth ? " 윤달" : ""
  }`;
}

function formatElements(counts) {
  return ELEMENTS.map((element) => `${element} ${counts[element]}`).join(" / ");
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      printUsage();
      return;
    }
    if (!args.date || !args.time) {
      printUsage();
      process.exitCode = 1;
      return;
    }

    const result = buildResult(args);
    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printHuman(result);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildResult,
  formatDate,
  formatElements,
  formatLunar,
  PILLAR_ORDER,
  PILLAR_LABELS,
};
