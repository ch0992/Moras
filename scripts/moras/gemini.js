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

async function analyzeManseWithGemini({ name, mbti, birthPlace, result }) {
  if (!GEMINI_API_KEY) {
    return {
      status: "skipped",
      reason: "missing_gemini_api_key",
      model: GEMINI_MODEL,
    };
  }

  const prompt = buildGeminiMansePrompt({ name, mbti, birthPlace, result });
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
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
        const retryable = response.status === 503 || response.status === 429 || text.includes("UNAVAILABLE");
        if (retryable && attempt < 2) {
          await sleep(1000 * (1 << attempt));
          continue;
        }
        return {
          status: "error",
          model: GEMINI_MODEL,
          error: `Gemini API 실패: ${response.status}`,
          detail: text.slice(0, 500),
        };
      }

      const body = JSON.parse(text);
      const raw = body.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
      return {
        status: "ok",
        model: GEMINI_MODEL,
        analyzedAt: new Date().toISOString(),
        ...parseGeminiJson(raw),
      };
    } catch (error) {
      const retryable = String(error.message || error).includes("503") || String(error.message || error).includes("UNAVAILABLE");
      if (retryable && attempt < 2) {
        await sleep(1000 * (1 << attempt));
        continue;
      }
      return {
        status: "error",
        model: GEMINI_MODEL,
        error: error.message || String(error),
      };
    }
  }

  return {
    status: "error",
    model: GEMINI_MODEL,
    error: "Gemini 최대 재시도 횟수 초과",
  };
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
Analyze the calculated manseryeok/saju data for an open-chat matching event.

Return ONLY a valid JSON object with this schema:
{
  "analysis_summary": "Korean summary, 2-3 sentences",
  "strength_keywords": ["Korean keyword", "Korean keyword", "Korean keyword"],
  "relationship_style": "Korean explanation, 1-2 sentences",
  "cautions": ["Korean caution", "Korean caution"],
  "tone_note": "Korean event-friendly note"
}

Rules:
- Do not claim fate is fixed.
- Do not mention health, lifespan, money fortune, marriage certainty, or deterministic predictions.
- Keep the tone symbolic, playful, and suitable for a casual community event.
- Base the analysis on MBTI if present and on the calculated manseryeok data.
- Do not include birth date, birth time, or birth place in the written analysis.
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
