/**
 * Submission storage for Moras.
 *
 * Responsibilities:
 * - Save/read participant submissions from Supabase when configured.
 * - Fall back to local JSON storage for local development.
 * - Keep HTML rendering, auth, and Gemini calls out of this file.
 */

const fs = require("node:fs/promises");
const path = require("node:path");

const IS_SERVERLESS = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const DATA_DIR = IS_SERVERLESS ? path.join("/tmp", "moras") : path.join(__dirname, "..", "..", "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "dev-submissions.json");
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_TABLE = "participant_submissions";
let submissionWriteQueue = Promise.resolve();

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
    gemini_analysis: submission.geminiAnalysis,
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
    geminiAnalysis: row.gemini_analysis || raw.geminiAnalysis || null,
  };
}

module.exports = { saveSubmission, readSubmissions };
