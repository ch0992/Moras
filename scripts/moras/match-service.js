/**
 * Moras Batch Matching Engine.
 *
 * Responsibilities:
 * - Load participants from Supabase/Local JSON.
 * - Cache and generate Gemini compatibility evaluations (Score A->B, B->A).
 * - Run optimized bipartite matching solver (Greedy + 2-opt Swap Optimization).
 * - Save match results, residual unmatched entries, and track batch runs.
 */

const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const MATCH_PROMPT_VERSION = "v2-simple-score";
const MATCHING_INTENT_SECTIONS = [
  { key: "romance", label: "썸" },
  { key: "friendship", label: "친목" },
];

const ELEMENTS = ["목", "화", "토", "금", "수"];
const ELEMENT_GENERATES = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};
const ELEMENT_CONTROLS = {
  목: "토",
  토: "수",
  수: "화",
  화: "금",
  금: "목",
};

const BRANCH_TRINES = [
  ["신", "자", "진"],
  ["해", "묘", "미"],
  ["인", "오", "술"],
  ["사", "유", "축"],
];
const BRANCH_CLASHES = new Set(["자오", "오자", "축미", "미축", "인신", "신인", "묘유", "유묘", "진술", "술진", "사해", "해사"]);

// 1. Utility helper for Supabase REST API calls
function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function requestSupabase(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const body = options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body;
  const response = await fetch(url, {
    ...options,
    body,
    headers: supabaseHeaders(options.headers),
  });
  if (!response.ok) {
    throw new Error(`Supabase [${endpoint}] 실패: ${await response.text()}`);
  }
  if (response.status === 204) {
    return null;
  }
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }
  return JSON.parse(text);
}

// 2. Gemini Compatibility Scorer
function buildGeminiCompatibilityPrompt({ scorer, target }) {
  const payload = {
    scorer: {
      name: scorer.displayName,
      gender: scorer.gender,
      mbti: scorer.mbti,
      saju: scorer.manse?.saju || {},
    },
    target: {
      name: target.displayName,
      gender: target.gender,
      mbti: target.mbti,
      saju: target.manse?.saju || {},
    },
  };

  return `You are Moras, a lighthearted Korean event compatibility assistant.
Analyze the saju and MBTI compatibility from ${payload.scorer.name} (${payload.scorer.gender}) to ${payload.target.name} (${payload.target.gender}).

Return ONLY a valid JSON object with this schema:
{
  "score": 85,
  "reason": "사주상의 궁합(일간 합/조화)과 MBTI 호환성을 반영한 2-3문장의 재치있고 상냥한 한국어 궁합 해석",
  "reason_keywords": ["키워드1", "키워드2", "키워드3"]
}

Rules:
- score must be an integer between 0 and 100.
- Do not mention deterministic predictions, health, lifespan, money fortune, or absolute marriage certainty.
- Base it on MBTI compatibility (e.g. INFJ-ENFP dynamic) and saju element harmony (e.g., day pillar stems interaction, element balance).
- Keep the tone highly playful, encouraging, and suitable for a casual community event.
- Return ONLY JSON. No markdown. No explanation.

Input JSON:
${JSON.stringify(payload)}`;
}

async function evaluatePairCompatibility(scorer, target) {
  if (!GEMINI_API_KEY) {
    // Return a basic mock compatibility score when API key is missing
    const score = Math.floor(Math.random() * 41) + 60; // 60~100
    return {
      score,
      reason: `[API 키 없음 - 테스트 궁합] ${scorer.displayName}님과 ${target.displayName}님은 MBTI(${scorer.mbti} · ${target.mbti}) 성향과 오행의 흐름 상 매우 호화롭고 조화로운 시너지를 자아냅니다.`,
      reason_keywords: ["테스트매칭", "MBTI케미", "오행조화"],
    };
  }

  const prompt = buildGeminiCompatibilityPrompt({ scorer, target });
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      if (!response.ok) {
        if ((response.status === 503 || response.status === 429) && attempt < 2) {
          await new Promise((r) => setTimeout(r, 1000 * (1 << attempt)));
          continue;
        }
        throw new Error(`Gemini 궁합 계산 실패 (HTTP ${response.status})`);
      }

      const body = JSON.parse(text);
      const raw = body.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
      const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        score: typeof parsed.score === "number" ? parsed.score : 70,
        reason: parsed.reason || "상호 보완적인 긍정적 에너지가 돋보이는 매칭입니다.",
        reason_keywords: Array.isArray(parsed.reason_keywords) ? parsed.reason_keywords : ["조화", "긍정에너지"],
      };
    } catch (error) {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (1 << attempt)));
        continue;
      }
      console.error(`Gemini Evaluation Error (Attempt ${attempt}):`, error);
      return {
        score: 70,
        reason: "상호 존중과 깊은 공감이 바탕이 되는 관계입니다.",
        reason_keywords: ["소통", "공감"],
      };
    }
  }
}

function clampScore(value, max = 100, min = 0) {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}

function normalizeMatchingIntent(value) {
  const intent = String(value || "").trim();
  if (intent === "friendship" || intent === "친목") return "friendship";
  return "romance";
}

const MBTI_COMPATIBILITY_MATRIX = {
  ISTJ: { ISTJ: 3, ISFJ: 4, INFJ: 2, INTJ: 3, ISTP: 3, ISFP: 3, INFP: 1, INTP: 3, ESTP: 3, ESFP: 3, ENFP: 1, ENTP: 3, ESTJ: 5, ESFJ: 4, ENFJ: 2, ENTJ: 4 },
  ISFJ: { ISTJ: 4, ISFJ: 3, INFJ: 3, INTJ: 2, ISTP: 3, ISFP: 3, INFP: 3, INTP: 1, ESTP: 3, ESFP: 3, ENFP: 3, ENTP: 1, ESTJ: 4, ESFJ: 5, ENFJ: 4, ENTJ: 2 },
  INFJ: { ISTJ: 2, ISFJ: 3, INFJ: 3, INTJ: 4, ISTP: 1, ISFP: 3, INFP: 3, INTP: 3, ESTP: 1, ESFP: 3, ENFP: 4, ENTP: 5, ESTJ: 2, ESFJ: 4, ENFJ: 5, ENTJ: 4 },
  INTJ: { ISTJ: 3, ISFJ: 2, INFJ: 4, INTJ: 3, ISTP: 3, ISFP: 1, INFP: 3, INTP: 3, ESTP: 3, ESFP: 1, ENFP: 5, ENTP: 4, ESTJ: 4, ESFJ: 2, ENFJ: 4, ENTJ: 5 },
  ISTP: { ISTJ: 3, ISFJ: 3, INFJ: 1, INTJ: 3, ISTP: 3, ISFP: 4, INFP: 2, INTP: 3, ESTP: 5, ESFP: 4, ENFP: 2, ENTP: 4, ESTJ: 3, ESFJ: 3, ENFJ: 1, ENTJ: 3 },
  ISFP: { ISTJ: 3, ISFJ: 3, INFJ: 3, INTJ: 1, ISTP: 4, ISFP: 3, INFP: 3, INTP: 2, ESTP: 4, ESFP: 5, ENFP: 4, ENTP: 2, ESTJ: 3, ESFJ: 3, ENFJ: 3, ENTJ: 1 },
  INFP: { ISTJ: 1, ISFJ: 3, INFJ: 3, INTJ: 3, ISTP: 2, ISFP: 3, INFP: 3, INTP: 4, ESTP: 2, ESFP: 4, ENFP: 5, ENTP: 4, ESTJ: 1, ESFJ: 3, ENFJ: 4, ENTJ: 4 },
  INTP: { ISTJ: 3, ISFJ: 1, INFJ: 3, INTJ: 3, ISTP: 3, ISFP: 2, INFP: 4, INTP: 3, ESTP: 4, ESFP: 2, ENFP: 4, ENTP: 5, ESTJ: 3, ESFJ: 1, ENFJ: 3, ENTJ: 4 },
  ESTP: { ISTJ: 3, ISFJ: 3, INFJ: 1, INTJ: 3, ISTP: 5, ISFP: 4, INFP: 2, INTP: 4, ESTP: 3, ESFP: 4, ENFP: 2, ENTP: 3, ESTJ: 3, ESFJ: 3, ENFJ: 1, ENTJ: 3 },
  ESFP: { ISTJ: 3, ISFJ: 3, INFJ: 3, INTJ: 1, ISTP: 4, ISFP: 5, INFP: 4, INTP: 2, ESTP: 4, ESFP: 3, ENFP: 3, ENTP: 2, ESTJ: 3, ESFJ: 3, ENFJ: 3, ENTJ: 1 },
  ENFP: { ISTJ: 1, ISFJ: 3, INFJ: 4, INTJ: 5, ISTP: 2, ISFP: 4, INFP: 5, INTP: 4, ESTP: 2, ESFP: 3, ENFP: 3, ENTP: 4, ESTJ: 1, ESFJ: 3, ENFJ: 4, ENTJ: 4 },
  ENTP: { ISTJ: 3, ISFJ: 1, INFJ: 5, INTJ: 4, ISTP: 4, ISFP: 2, INFP: 4, INTP: 5, ESTP: 3, ESFP: 2, ENFP: 4, ENTP: 3, ESTJ: 3, ESFJ: 1, ENFJ: 3, ENTJ: 4 },
  ESTJ: { ISTJ: 5, ISFJ: 4, INFJ: 2, INTJ: 4, ISTP: 3, ISFP: 3, INFP: 1, INTP: 3, ESTP: 3, ESFP: 3, ENFP: 1, ENTP: 3, ESTJ: 3, ESFJ: 4, ENFJ: 2, ENTJ: 3 },
  ESFJ: { ISTJ: 4, ISFJ: 5, INFJ: 4, INTJ: 2, ISTP: 3, ISFP: 3, INFP: 3, INTP: 1, ESTP: 3, ESFP: 3, ENFP: 3, ENTP: 1, ESTJ: 4, ESFJ: 3, ENFJ: 3, ENTJ: 2 },
  ENFJ: { ISTJ: 2, ISFJ: 4, INFJ: 5, INTJ: 4, ISTP: 1, ISFP: 3, INFP: 4, INTP: 3, ESTP: 1, ESFP: 3, ENFP: 4, ENTP: 3, ESTJ: 2, ESFJ: 3, ENFJ: 3, ENTJ: 4 },
  ENTJ: { ISTJ: 4, ISFJ: 2, INFJ: 4, INTJ: 5, ISTP: 3, ISFP: 1, INFP: 4, INTP: 4, ESTP: 3, ESFP: 1, ENFP: 4, ENTP: 4, ESTJ: 3, ESFJ: 2, ENFJ: 4, ENTJ: 3 }
};

function scoreMbtiCompatibility(typeA, typeB) {
  const normA = String(typeA || "").toUpperCase().trim();
  const normB = String(typeB || "").toUpperCase().trim();
  
  const level = MBTI_COMPATIBILITY_MATRIX[normA]?.[normB];
  if (!level) return 70;
  
  const scoreMap = {
    5: 100,
    4: 80,
    3: 70,
    2: 60,
    1: 50
  };
  
  return scoreMap[level] || 70;
}

function getElementCounts(manse) {
  const counts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const source = manse?.elementDistribution?.counts || {};
  for (const element of ELEMENTS) {
    counts[element] = Number(source[element] || 0);
  }
  return counts;
}

function getStrongElements(counts) {
  const max = Math.max(...ELEMENTS.map((element) => counts[element]));
  return ELEMENTS.filter((element) => counts[element] === max && max > 0);
}

function getWeakElements(counts) {
  const min = Math.min(...ELEMENTS.map((element) => counts[element]));
  return ELEMENTS.filter((element) => counts[element] === min);
}

function getDayStemElement(person) {
  return person.manse?.pillars?.day?.stem?.element || "";
}

function getDayBranch(person) {
  return person.manse?.pillars?.day?.branch?.hangul || "";
}

function getDayPillar(person) {
  return person.manse?.saju?.dayPillar || "";
}

function scoreElementComplement(personA, personB) {
  const aCounts = getElementCounts(personA.manse);
  const bCounts = getElementCounts(personB.manse);
  const aWeak = getWeakElements(aCounts);
  const bWeak = getWeakElements(bCounts);
  const aStrong = getStrongElements(aCounts);
  const bStrong = getStrongElements(bCounts);
  let score = 0;

  for (const element of aWeak) {
    if (bStrong.includes(element)) score += 4;
  }
  for (const element of bWeak) {
    if (aStrong.includes(element)) score += 4;
  }

  const totalSkew = ELEMENTS.reduce((sum, element) => sum + Math.abs(aCounts[element] - bCounts[element]), 0);
  score += Math.max(0, 14 - totalSkew * 2);
  return Math.min(score, 20);
}

function scoreDayStemRelation(personA, personB) {
  const a = getDayStemElement(personA);
  const b = getDayStemElement(personB);
  if (!a || !b) return 8;
  if (a === b) return 9;
  if (ELEMENT_GENERATES[a] === b || ELEMENT_GENERATES[b] === a) return 16;
  if (ELEMENT_CONTROLS[a] === b || ELEMENT_CONTROLS[b] === a) return 5;
  return 10;
}

function scoreDayBranchRelation(personA, personB) {
  const a = getDayBranch(personA);
  const b = getDayBranch(personB);
  if (!a || !b) return 8;
  if (a === b) return 10;
  if (BRANCH_CLASHES.has(`${a}${b}`)) return 2;
  if (BRANCH_TRINES.some((group) => group.includes(a) && group.includes(b))) return 15;
  return 8;
}

function scoreSajuCompatibility(personA, personB) {
  const elementScore = scoreElementComplement(personA, personB);
  const stemScore = scoreDayStemRelation(personA, personB);
  const branchScore = scoreDayBranchRelation(personA, personB);
  const score =
    50 +
    elementScore * 0.8 +
    stemScore * 1.25 +
    branchScore * 1.0;
  return clampScore(score, 100, 50);
}

function relationTypeFor(scoreDetail) {
  if (scoreDetail.consistencyScore >= 80 && scoreDetail.baseScore >= 75) return "안정적 장기형";
  if (scoreDetail.mbtiScore >= 80 && scoreDetail.sajuScore >= 70) return "대화 몰입형";
  if (scoreDetail.sajuScore >= 80 && scoreDetail.mbtiScore <= 70) return "상호 보완형";
  if (scoreDetail.rawDeviation >= 22) return "강한 끌림 조율형";
  return "균형 탐색형";
}

function buildScoreNarrative(male, female, detail) {
  const maleDay = getDayPillar(male) || "일주 정보";
  const femaleDay = getDayPillar(female) || "일주 정보";
  return `${male.displayName}님과 ${female.displayName}님은 MBTI ${male.mbti || "미입력"}-${female.mbti || "미입력"} 조합에서 ${detail.mbtiScore}점, 사주 ${maleDay}-${femaleDay} 흐름에서 ${detail.sajuScore}점으로 계산되었습니다. 두 기준의 편차 보정은 ${detail.consistencyScore}점이며, 최종적으로 ${detail.relationshipType}에 가까운 조합입니다.`;
}

function isMaritalCompatible(a, b) {
  const aRange = Array.isArray(a.matchingMaritalRange) ? a.matchingMaritalRange : [];
  const bRange = Array.isArray(b.matchingMaritalRange) ? b.matchingMaritalRange : [];
  if (aRange.length > 0 && b.maritalStatus && !aRange.includes(b.maritalStatus)) return false;
  if (bRange.length > 0 && a.maritalStatus && !bRange.includes(a.maritalStatus)) return false;
  return true;
}

function buildScoreDetails(males, females, { useMaritalFilter = true } = {}) {
  const pairDetails = [];

  for (const male of males) {
    for (const female of females) {
      if (useMaritalFilter && !isMaritalCompatible(male, female)) continue;
      const mbtiScore = scoreMbtiCompatibility(male.mbti, female.mbti);
      const sajuScore = scoreSajuCompatibility(male, female);
      pairDetails.push({
        male,
        female,
        mbtiScore,
        sajuScore,
        rawDeviation: Math.abs(mbtiScore - sajuScore),
      });
    }
  }

  const maxDeviation = Math.max(...pairDetails.map((detail) => detail.rawDeviation), 0);
  const scoreMatrix = {};
  const detailMatrix = {};

  for (const detail of pairDetails) {
    const deviationRatio = maxDeviation > 0 ? (detail.rawDeviation / maxDeviation) * 100 : 0;
    const consistencyScore = 100 - deviationRatio;
    const baseScore = detail.mbtiScore * 0.3 + detail.sajuScore * 0.7;
    const finalScore = baseScore * 0.88 + consistencyScore * 0.12;
    const scoreDetail = {
      mbtiScore: clampScore(detail.mbtiScore),
      sajuScore: clampScore(detail.sajuScore),
      rawDeviation: clampScore(detail.rawDeviation),
      maxDeviation: clampScore(maxDeviation),
      deviationRatio: clampScore(deviationRatio),
      consistencyScore: clampScore(consistencyScore),
      baseScore: clampScore(baseScore),
      finalScore: clampScore(finalScore, 100, 50),
    };
    scoreDetail.relationshipType = relationTypeFor(scoreDetail);
    scoreDetail.narrative = buildScoreNarrative(detail.male, detail.female, scoreDetail);

    if (!scoreMatrix[detail.male.id]) scoreMatrix[detail.male.id] = {};
    if (!detailMatrix[detail.male.id]) detailMatrix[detail.male.id] = {};
    scoreMatrix[detail.male.id][detail.female.id] = scoreDetail.finalScore;
    detailMatrix[detail.male.id][detail.female.id] = scoreDetail;
  }

  return { scoreMatrix, detailMatrix };
}

// 3. Local 2-opt Bipartite Matching Solver
function solveBipartiteMatching(males, females, scoreMatrix) {
  // scoreMatrix is an object of average scores: scoreMatrix[maleId][femaleId] = averageScore
  const maleIds = males.map((m) => m.id);
  const femaleIds = females.map((f) => f.id);

  // Initialize: greedy initial match
  let matches = []; // Array of { maleId, femaleId, score }
  const matchedFemales = new Set();
  const matchedMales = new Set();

  // Sort all potential pairs by score descending (skip incompatible pairs)
  const allPairs = [];
  for (const maleId of maleIds) {
    for (const femaleId of femaleIds) {
      if (scoreMatrix[maleId]?.[femaleId] === undefined) continue;
      allPairs.push({ maleId, femaleId, score: scoreMatrix[maleId][femaleId] });
    }
  }
  allPairs.sort((a, b) => b.score - a.score);

  for (const pair of allPairs) {
    if (!matchedMales.has(pair.maleId) && !matchedFemales.has(pair.femaleId)) {
      matches.push({ ...pair });
      matchedMales.add(pair.maleId);
      matchedFemales.add(pair.femaleId);
    }
  }

  // 2-opt Local Search Optimization
  let improved = true;
  let iterations = 0;
  const maxIterations = 1000;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < matches.length; i++) {
      for (let j = i + 1; j < matches.length; j++) {
        const m1 = matches[i].maleId;
        const f1 = matches[i].femaleId;
        const m2 = matches[j].maleId;
        const f2 = matches[j].femaleId;

        if (scoreMatrix[m1]?.[f2] === undefined || scoreMatrix[m2]?.[f1] === undefined) continue;
        const currentSum = scoreMatrix[m1][f1] + scoreMatrix[m2][f2];
        const swappedSum = scoreMatrix[m1][f2] + scoreMatrix[m2][f1];

        if (swappedSum > currentSum) {
          // Swap matches
          matches[i].femaleId = f2;
          matches[i].score = scoreMatrix[m1][f2];
          matches[j].femaleId = f1;
          matches[j].score = scoreMatrix[m2][f1];
          improved = true;
        }
      }
    }
  }

  // Identify unmatched
  const unmatchedMales = maleIds.filter((id) => !matchedMales.has(id));
  const unmatchedFemales = femaleIds.filter((id) => !matchedFemales.has(id));
  const unmatched = [...unmatchedMales, ...unmatchedFemales];

  return { matches, unmatched };
}

function buildFriendshipRecommendations(males, females, scoreMatrix, detailMatrix, limit = 3) {
  const recommendations = [];

  for (const male of males) {
    const ranked = females
      .map((female) => ({
        participantId: male.id,
        recommendedParticipantId: female.id,
        score: scoreMatrix[male.id]?.[female.id],
        scoreDetail: detailMatrix[male.id]?.[female.id] || null,
      }))
      .filter((item) => item.score !== undefined)
      .sort((a, b) => b.score - a.score || String(a.recommendedParticipantId).localeCompare(String(b.recommendedParticipantId)))
      .slice(0, limit);
    recommendations.push(...ranked.map((item, index) => ({ ...item, rank: index + 1 })));
  }

  for (const female of females) {
    const ranked = males
      .map((male) => ({
        participantId: female.id,
        recommendedParticipantId: male.id,
        score: scoreMatrix[male.id]?.[female.id],
        scoreDetail: detailMatrix[male.id]?.[female.id] || null,
      }))
      .filter((item) => item.score !== undefined)
      .sort((a, b) => b.score - a.score || String(a.recommendedParticipantId).localeCompare(String(b.recommendedParticipantId)))
      .slice(0, limit);
    recommendations.push(...ranked.map((item, index) => ({ ...item, rank: index + 1 })));
  }

  return recommendations;
}

// 4. Batch Orchestrator
async function runMatchingBatch(runId = null) {
  const currentRunId = runId || crypto.randomUUID();
  const startTime = new Date().toISOString();

  console.log(`Starting Batch Matching Run: ${currentRunId}`);

  // Create match run log if on Supabase
  if (hasSupabaseConfig()) {
    await requestSupabase("match_runs", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: {
        id: currentRunId,
        status: "running",
        prompt_version: MATCH_PROMPT_VERSION,
        gemini_model: null,
        started_at: startTime,
      },
    });
  }

  try {
    // 1. Fetch participants
    let participants = [];
    if (hasSupabaseConfig()) {
      participants = await requestSupabase("participant_submissions?select=*");
      participants = participants.map((row) => ({
        id: row.id,
        displayName: row.display_name,
        gender: row.gender,
        mbti: row.mbti,
        manse: row.manse_result,
        maritalStatus: row.marital_status || row.raw_submission?.maritalStatus || null,
        matchingMaritalRange: row.raw_submission?.matchingMaritalRange || [],
        matchingIntent: normalizeMatchingIntent(row.matching_intent || row.raw_submission?.matchingIntent),
      }));
    } else {
      const localPath = path.join(__dirname, "../../data/dev-submissions.json");
      try {
        const data = await fs.readFile(localPath, "utf8");
        participants = JSON.parse(data);
      } catch (err) {
        if (err.code !== "ENOENT") throw err;
        participants = [];
      }
    }

    // Filter active valid participants with gender, then run matching per intent section.
    const activeParticipants = participants
      .filter((p) => p.gender === "남" || p.gender === "여")
      .map((p) => ({ ...p, matchingIntent: normalizeMatchingIntent(p.matchingIntent) }));
    const allMatches = [];
    const allUnmatched = [];
    const allFriendshipRecommendations = [];
    const detailMatrices = {};

    console.log(`Active participants: ${activeParticipants.length}`);

    for (const section of MATCHING_INTENT_SECTIONS) {
      const sectionParticipants = activeParticipants.filter((p) => p.matchingIntent === section.key);
      const males = sectionParticipants.filter((p) => p.gender === "남");
      const females = sectionParticipants.filter((p) => p.gender === "여");

      console.log(`${section.label} participants: ${sectionParticipants.length} (Males: ${males.length}, Females: ${females.length})`);

      if (!sectionParticipants.length) continue;

      if (males.length === 0 || females.length === 0) {
        if (section.key === "friendship") continue;
        allUnmatched.push(...sectionParticipants.map((p) => ({
          id: p.id,
          matchingIntent: section.key,
          reason: `${section.label} 그룹 성비 불균형으로 인한 미매칭`,
        })));
        continue;
      }

      const { scoreMatrix, detailMatrix } = buildScoreDetails(males, females, {
        useMaritalFilter: section.key === "romance",
      });
      detailMatrices[section.key] = detailMatrix;

      if (section.key === "friendship") {
        allFriendshipRecommendations.push(...buildFriendshipRecommendations(males, females, scoreMatrix, detailMatrix, 3));
        continue;
      }

      const { matches, unmatched } = solveBipartiteMatching(males, females, scoreMatrix);
      matches.sort((a, b) => b.score - a.score);

      allMatches.push(...matches.map((match, index) => ({
        ...match,
        matchingIntent: section.key,
        rank: index + 1,
        isTopMatch: index === 0,
      })));
      allUnmatched.push(...unmatched.map((id) => ({
        id,
        matchingIntent: section.key,
        reason: `${section.label} 그룹 성비 불균형으로 인한 미매칭`,
      })));
    }

    if (allMatches.length === 0 && allFriendshipRecommendations.length === 0) {
      throw new Error("매칭 가능한 썸/친목 그룹이 없습니다. 각 그룹에 최소 남성 1명, 여성 1명이 필요합니다.");
    }

    console.log(`Match solving completed: ${allMatches.length} romance matches, ${allFriendshipRecommendations.length} friendship recommendations, ${allUnmatched.length} unmatched.`);

    // 4. Save results to DB / Local JSON.
    if (hasSupabaseConfig()) {
      const resultsToInsert = allMatches.map((m) => ({
        match_run_id: currentRunId,
        male_participant_id: m.maleId,
        female_participant_id: m.femaleId,
        matching_intent: m.matchingIntent,
        average_score: m.score,
        score_detail: detailMatrices[m.matchingIntent][m.maleId][m.femaleId],
        rank: m.rank,
        is_top_match: m.isTopMatch,
        confirmed_by_operator: false,
      }));

      if (resultsToInsert.length > 0) {
        await requestSupabase("match_results", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: resultsToInsert,
        });
      }

      const evaluationsToInsert = [];
      for (const m of allMatches) {
        const male = activeParticipants.find((p) => p.id === m.maleId);
        const female = activeParticipants.find((p) => p.id === m.femaleId);
        const detail = detailMatrices[m.matchingIntent][m.maleId][m.femaleId];
        const reason = detail.narrative;
        const keywords = [detail.relationshipType, "MBTI궁합", "사주궁합", "편차보정"];
        evaluationsToInsert.push({
          event_id: null,
          match_run_id: currentRunId,
          scorer_participant_id: m.maleId,
          target_participant_id: m.femaleId,
          score: Math.round(detail.finalScore),
          reason,
          reason_keywords: keywords,
          prompt_version: MATCH_PROMPT_VERSION,
          gemini_model: null,
        });
        evaluationsToInsert.push({
          event_id: null,
          match_run_id: currentRunId,
          scorer_participant_id: m.femaleId,
          target_participant_id: m.maleId,
          score: Math.round(detail.finalScore),
          reason: buildScoreNarrative(female, male, detail),
          reason_keywords: keywords,
          prompt_version: MATCH_PROMPT_VERSION,
          gemini_model: null,
        });
      }

      if (evaluationsToInsert.length > 0) {
        await requestSupabase("compatibility_evaluations?on_conflict=scorer_participant_id,target_participant_id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: evaluationsToInsert,
        });
      }

      const unmatchedToInsert = allUnmatched.map((item) => ({
        match_run_id: currentRunId,
        participant_id: item.id,
        matching_intent: item.matchingIntent,
        reason: item.reason,
      }));

      if (unmatchedToInsert.length > 0) {
        await requestSupabase("unmatched_participants", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: unmatchedToInsert,
        });
      }

      const friendshipToInsert = allFriendshipRecommendations.map((item) => ({
        match_run_id: currentRunId,
        participant_id: item.participantId,
        recommended_participant_id: item.recommendedParticipantId,
        rank: item.rank,
        score: item.score,
        score_detail: item.scoreDetail,
      }));

      if (friendshipToInsert.length > 0) {
        await requestSupabase("friendship_recommendations", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: friendshipToInsert,
        });
      }

      const voteDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await requestSupabase(`match_runs?id=eq.${currentRunId}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: {
          status: "completed",
          completed_at: new Date().toISOString(),
          vote_deadline_at: voteDeadline,
        },
      });

      console.log("Matching results saved to Supabase successfully.");

      return {
        success: true,
        matchRunId: currentRunId,
        matchesCount: allMatches.length,
        friendshipRecommendationsCount: allFriendshipRecommendations.length,
        unmatchedCount: allUnmatched.length,
      };
    } else {
      // Local JSON fallback - write results to local file
      const localResultPath = path.join(__dirname, "../../data/dev-match-results.json");
      const localData = {
        matchRunId: currentRunId,
        completedAt: new Date().toISOString(),
        matches: allMatches.map((m) => ({
          rank: m.rank,
          isTop: m.isTopMatch,
          matchingIntent: m.matchingIntent,
          matching_intent: m.matchingIntent,
          male: activeParticipants.find((p) => p.id === m.maleId),
          female: activeParticipants.find((p) => p.id === m.femaleId),
          score: m.score,
          score_detail: detailMatrices[m.matchingIntent][m.maleId][m.femaleId],
        })),
        unmatched: allUnmatched.map((item) => ({
          ...participants.find((p) => p.id === item.id),
          matchingIntent: item.matchingIntent,
          matching_intent: item.matchingIntent,
          unmatchedReason: item.reason,
        })),
        friendshipRecommendations: allFriendshipRecommendations.map((item) => ({
          participant: activeParticipants.find((p) => p.id === item.participantId),
          recommended: activeParticipants.find((p) => p.id === item.recommendedParticipantId),
          rank: item.rank,
          score: item.score,
          score_detail: item.scoreDetail,
        })),
      };
      await fs.writeFile(localResultPath, JSON.stringify(localData, null, 2), "utf8");
      console.log(`Local match result saved to: ${localResultPath}`);

      return {
        success: true,
        matchRunId: currentRunId,
        matchesCount: allMatches.length,
        friendshipRecommendationsCount: allFriendshipRecommendations.length,
        unmatchedCount: allUnmatched.length,
      };
    }
  } catch (error) {
    console.error("Match Engine Run Failed:", error);

    if (hasSupabaseConfig()) {
      await requestSupabase(`match_runs?id=eq.${currentRunId}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: {
          status: "failed",
          error_message: error.message || String(error),
          completed_at: new Date().toISOString(),
        },
      });
    }

    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

module.exports = {
  runMatchingBatch,
  solveBipartiteMatching,
  requestSupabase,
  hasSupabaseConfig,
  normalizeMatchingIntent,
};
