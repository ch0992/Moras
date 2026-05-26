/**
 * Gemini API integration for Moras.
 *
 * Responsibilities:
 * - Build the manse/saju analysis prompt.
 * - Call Gemini with retry and parse JSON responses.
 * - Keep UI rendering, routing, and storage out of this file.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_MAX_OUTPUT_TOKENS = Number.parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || "12000", 10);
const GEMINI_FULL_ATTEMPTS = Number.parseInt(process.env.GEMINI_FULL_ATTEMPTS || "3", 10);
const GEMINI_LITE_ATTEMPTS = Number.parseInt(process.env.GEMINI_LITE_ATTEMPTS || "1", 10);

async function analyzeManseWithGemini({ name, mbti, birthPlace, result }) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API 키가 설정되지 않아 사주 통찰을 생성할 수 없습니다.");
  }

  const full = await callGemini(
    buildGeminiMansePrompt({ name, mbti, birthPlace, result }),
    GEMINI_MAX_OUTPUT_TOKENS,
    GEMINI_FULL_ATTEMPTS
  );
  if (full) return full;

  console.warn("[Gemini] 풀 분석 실패. 라이트 폴백을 시도합니다.");
  const lite = await callGemini(
    buildGeminiLitePrompt({ name, mbti, result }),
    4000,
    GEMINI_LITE_ATTEMPTS
  );
  if (lite) return { ...lite, model: `${GEMINI_MODEL}-lite` };

  console.warn("[Gemini] 라이트 폴백도 실패했습니다.");
  throw new Error("Gemini 사주 통찰 생성이 완료되지 않았습니다. 잠시 후 다시 신청해주세요.");
}

async function callGemini(prompt, maxOutputTokens, maxAttempts, options = {}) {
  const model = options.model || GEMINI_MODEL;
  const schema = options.schema || manseReportSchema();
  const base = process.env.GOOGLE_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";
  const endpoint = `${base}/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens,
      responseMimeType: "application/json",
      responseSchema: toGeminiSchema(schema),
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
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
        const retryable = isRetryableGeminiFailure(response.status, text);
        if (retryable && attempt < maxAttempts - 1) {
          await sleep(backoffMs(attempt));
          continue;
        }
        console.warn(`[Gemini] HTTP ${response.status} 발생. ${summarizeGeminiError(text)}`);
        return null;
      }
      const body = JSON.parse(text);
      const raw = body.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") || "";
      const parsed = parseGeminiJson(raw);
      if (parsed.parseError) {
        if (attempt < maxAttempts - 1) {
          await sleep(backoffMs(attempt));
          continue;
        }
        console.warn(`[Gemini] JSON 파싱 실패. ${parsed.parseError}`);
        return null;
      }
      return {
        status: "ok",
        model,
        analyzedAt: new Date().toISOString(),
        ...parsed,
      };
    } catch (error) {
      if (attempt < maxAttempts - 1) {
        await sleep(backoffMs(attempt));
        continue;
      }
      console.warn(`[Gemini] Error: ${error.message}`);
      return null;
    }
  }
  return null;
}

function toGeminiSchema(schema) {
  if (!schema || typeof schema !== "object") return schema;
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);

  const normalized = {};
  Object.entries(schema).forEach(([key, value]) => {
    if (key === "type" && typeof value === "string") {
      normalized[key] = value.toUpperCase();
      return;
    }
    normalized[key] = toGeminiSchema(value);
  });
  return normalized;
}

function isRetryableGeminiFailure(status, text) {
  return [408, 409, 425, 429, 500, 502, 503, 504].includes(status)
    || /UNAVAILABLE|RESOURCE_EXHAUSTED|DEADLINE_EXCEEDED|INTERNAL|timeout/i.test(String(text || ""));
}

function backoffMs(attempt) {
  return Math.min(8000, 1000 * (1 << attempt));
}

function summarizeGeminiError(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed.error?.message ? `message=${parsed.error.message}` : "";
  } catch {
    return String(text || "").slice(0, 300);
  }
}

function buildGeminiMansePrompt({ name, mbti, birthPlace, result }) {
  const payload = {
    participant: {
      displayName: nullableString(name),
      mbti,
      birthPlace,
    },
    manse: {
      saju: result.saju,
      pillars: result.pillars,
      derived: result.derived,
      elementDistribution: result.elementDistribution,
      normalizedSolarDate: result.normalizedSolarDate,
      normalizedLunarDate: result.normalizedLunarDate,
    },
  };

  return `You are Moras, a lighthearted Korean event compatibility assistant.
Analyze the calculated manseryeok/saju data and MBTI for an open-chat matching event.

The report will be shown directly below the user's manseryeok chart. Make it feel like a
premium psychological report, emotional essay, and modern saju interpretation combined.
Keep it detailed, personal, symbolic, warm, and elegant, but grounded in the provided
pillars, ten-gods, twelve stages/gods, element distribution, and MBTI.

Most users are beginners. Explain saju terms in plain Korean before using them deeply.
For example, explain that 일간 is "the symbol of the self", 오행 is "the balance of five
temperaments", 십성 is "how one's energy appears in relationships and society", and
12운성/12신살 are "rhythm and atmosphere indicators", not fixed predictions.

Return ONLY a valid JSON object with this schema:
{
  "report_title": "Korean short title for this participant's vibe",
  "opening_summary": "Korean text, 7-9 sentences summarizing the representative narrative of this person from MBTI + saju in easy, elegant language",
  "manse_core": [
    { "label": "일간/일주", "text": "Korean text, 5-7 sentences explaining the day pillar/day stem in beginner-friendly terms" },
    { "label": "오행 흐름", "text": "Korean text, 5-7 sentences explaining element balance, strong elements, and missing elements in everyday language" },
    { "label": "십성/12운성", "text": "Korean text, 5-7 sentences explaining social style, relationship behavior, and life rhythm from derived data" }
  ],
  "what_person": "Korean text, 8-10 sentences for [A-1] 나는 어떤 사람인가",
  "emotional_energy": "Korean text, 8-10 sentences for [A-2] 내 감정과 에너지 구조",
  "destiny_nature": "Korean text, 8-10 sentences for [A-3] 삶의 흐름과 운명, without deterministic claims",
  "best_partner_style": "Korean text, 9-11 sentences for [B-4] 어떤 인연이 어울리는가",
  "relationship_style": "Korean text, 9-11 sentences for [B-5] 연애 스타일 분석",
  "love_flow": "Korean text, 8-10 sentences for [B-6] 연애운의 흐름, as emotional/relationship rhythm not prediction",
  "relationship_shadow": "Korean text, 8-10 sentences for [B-7] 관계에서의 그림자, gentle blind spots and growth points",
  "growth_guide": "Korean text, 7-9 sentences of practical event-friendly advice written like a gentle personal guide",
  "strength_keywords": ["Korean keyword", "Korean keyword", "Korean keyword", "Korean keyword", "Korean keyword", "Korean keyword", "Korean keyword"],
  "cautions": ["Korean caution", "Korean caution", "Korean caution", "Korean caution", "Korean caution"],
  "tone_note": "Korean event-friendly closing note"
}

Rules:
- Do not claim fate is fixed.
- Do not mention health, lifespan, money fortune, marriage certainty, or deterministic predictions.
- Keep the tone symbolic, playful, and suitable for a casual community event.
- Base the analysis on MBTI if present and on the calculated manseryeok data. If a field is missing, infer carefully and avoid overclaiming.
- Explain technical terms simply. Do not write like a fortune-telling manual.
- Prefer concrete, friendly examples: conversation style, first impression, dating/event behavior, emotional rhythm, and compatibility clues.
- Write like a sophisticated self-understanding report for an MBTI-aware audience.
- Emphasize rhythm, tendency, atmosphere, energy, and relationship flow instead of predictions.
- Make the relationship sections especially immersive and readable.
- Avoid scary, fatalistic, judgmental, or overly mystical wording.
- Do not include birth date, birth time, or birth place in the written analysis.
- Write in Korean.
- Target 7000-9000 Korean characters total.
- Return ONLY JSON. No markdown. No explanation.

Input JSON:
${JSON.stringify(payload)}`;
}

function manseReportSchema() {
  return {
    type: "object",
    properties: {
      report_title: { type: "string" },
      opening_summary: { type: "string" },
      what_person: { type: "string" },
      manse_core: {
        type: "array",
        items: {
          type: "object",
          properties: {
            label: { type: "string" },
            text: { type: "string" },
          },
          required: ["label", "text"],
        },
      },
      destiny_nature: { type: "string" },
      emotional_energy: { type: "string" },
      relationship_style: { type: "string" },
      best_partner_style: { type: "string" },
      love_flow: { type: "string" },
      relationship_shadow: { type: "string" },
      growth_guide: { type: "string" },
      strength_keywords: {
        type: "array",
        items: { type: "string" },
      },
      cautions: {
        type: "array",
        items: { type: "string" },
      },
      tone_note: { type: "string" },
    },
    required: [
      "report_title",
      "opening_summary",
      "what_person",
      "manse_core",
      "emotional_energy",
      "destiny_nature",
      "relationship_style",
      "best_partner_style",
      "love_flow",
      "relationship_shadow",
      "growth_guide",
      "strength_keywords",
      "cautions",
      "tone_note",
    ],
  };
}

function buildGeminiLitePrompt({ name, mbti, result }) {
  const payload = {
    participant: {
      displayName: nullableString(name),
      mbti,
    },
    manse: {
      saju: result.saju,
      pillars: {
        year: result.pillars?.year,
        month: result.pillars?.month,
        day: result.pillars?.day,
        hour: result.pillars?.hour,
      },
      derived: result.derived?.byPillar
        ? {
            day: result.derived.byPillar.day,
            month: result.derived.byPillar.month,
          }
        : undefined,
      elementDistribution: result.elementDistribution,
    },
  };

  return `You are Moras, a Korean saju/MBTI compatibility assistant for a social matching event.
Write a concise but fully personalized analysis in Korean based on the provided data.
Focus on the day pillar, element distribution, and MBTI combination to make each section unique to this person.

Return ONLY a valid JSON object with this schema:
{
  "report_title": "Korean short title reflecting this person's specific day pillar and MBTI",
  "opening_summary": "Korean text, 4-5 sentences summarizing this person's vibe from their actual saju + MBTI",
  "manse_core": [
    { "label": "일간/일주", "text": "Korean text, 3-4 sentences about this specific day pillar" },
    { "label": "오행 흐름", "text": "Korean text, 3-4 sentences about their actual element distribution" },
    { "label": "십성/12운성", "text": "Korean text, 3-4 sentences about their social/relationship style" }
  ],
  "what_person": "Korean text, 4-5 sentences for [A-1] 나는 어떤 사람인가",
  "emotional_energy": "Korean text, 4-5 sentences for [A-2] 내 감정과 에너지 구조",
  "destiny_nature": "Korean text, 4-5 sentences for [A-3] 삶의 흐름, no deterministic claims",
  "best_partner_style": "Korean text, 4-5 sentences for [B-4] 어떤 인연이 어울리는가",
  "relationship_style": "Korean text, 4-5 sentences for [B-5] 연애 스타일",
  "love_flow": "Korean text, 3-4 sentences for [B-6] 연애운의 흐름",
  "relationship_shadow": "Korean text, 3-4 sentences for [B-7] 관계의 그림자",
  "growth_guide": "Korean text, 3-4 sentences of event-friendly advice",
  "strength_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "cautions": ["caution1", "caution2", "caution3"],
  "tone_note": "Korean closing note, 1-2 sentences"
}

Rules:
- Write in Korean.
- Target 3000-4000 Korean characters total.
- Every field must reflect the actual saju data — not generic descriptions.
- No deterministic predictions, no health/money/fate claims.
- Warm, symbolic, event-friendly tone.
- Return ONLY JSON. No markdown. No explanation.

Input JSON:
${JSON.stringify(payload)}`;
}

function parseGeminiJson(raw) {
  try {
    const cleaned = String(raw || "")
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    return {
      parseError: error.message,
      rawText: String(raw || "").slice(0, 1000),
    };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nullableString(value) {
  const text = String(value || "").trim();
  return text || null;
}

module.exports = { analyzeManseWithGemini };
