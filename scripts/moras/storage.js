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
const crypto = require("node:crypto");

const IS_SERVERLESS = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const DATA_DIR = IS_SERVERLESS ? path.join("/tmp", "moras") : path.join(__dirname, "..", "..", "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "dev-submissions.json");
const ROSTER_FILE = path.join(DATA_DIR, "dev-roster-participants.json");
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_TABLE = "participant_submissions";
const ROSTER_TABLE = "event_participants";
let submissionWriteQueue = Promise.resolve();
let rosterWriteQueue = Promise.resolve();

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

async function deleteSubmission(id) {
  const submissionId = nullableString(id);
  if (!submissionId) throw new Error("삭제할 신청 ID가 필요합니다.");

  if (hasSupabaseConfig()) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?id=eq.${encodeURIComponent(submissionId)}`, {
      method: "DELETE",
      headers: supabaseHeaders({ Prefer: "return=minimal" }),
    });
    if (!response.ok) {
      throw new Error(`Supabase 신청 삭제 실패: ${await response.text()}`);
    }
    return;
  }

  submissionWriteQueue = submissionWriteQueue.then(async () => {
    const submissions = await readSubmissions();
    const next = submissions.filter((item) => item.id !== submissionId);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(next, null, 2), "utf8");
  });
  await submissionWriteQueue;
}

async function deleteAllSubmissions() {
  if (hasSupabaseConfig()) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?id=not.is.null`, {
      method: "DELETE",
      headers: supabaseHeaders({ Prefer: "return=minimal" }),
    });
    if (!response.ok) {
      throw new Error(`Supabase 신청 전체삭제 실패: ${await response.text()}`);
    }
    return;
  }

  submissionWriteQueue = submissionWriteQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2), "utf8");
  });
  await submissionWriteQueue;
}

async function readRosterParticipants({ includeInactive = false } = {}) {
  const participants = hasSupabaseConfig()
    ? await readRosterFromSupabase(includeInactive)
    : await readRosterFromLocal();

  return participants
    .filter((item) => includeInactive || item.isActive !== false)
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "ko"));
}

async function findRosterParticipantById(id) {
  const participantId = nullableString(id);
  if (!participantId) return null;

  const participants = await readRosterParticipants({ includeInactive: true });
  return participants.find((item) => item.id === participantId) || null;
}

async function hasSubmissionForRosterParticipant(rosterParticipantId) {
  const participantId = nullableString(rosterParticipantId);
  if (!participantId) return false;

  if (hasSupabaseConfig()) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?roster_participant_id=eq.${encodeURIComponent(participantId)}&select=id&limit=1`,
      { headers: supabaseHeaders() },
    );
    if (!response.ok) {
      throw new Error(`Supabase 중복 신청 조회 실패: ${await response.text()}`);
    }
    return (await response.json()).length > 0;
  }

  const submissions = await readSubmissions();
  return submissions.some((item) => item.rosterParticipantId === participantId);
}

async function saveRosterParticipant(input) {
  const isNew = !nullableString(input.id);
  const participant = normalizeRosterParticipant(input);

  if (hasSupabaseConfig()) {
    return saveRosterToSupabase(participant, isNew);
  }

  rosterWriteQueue = rosterWriteQueue.then(async () => {
    const participants = await readRosterFromLocal();
    const now = new Date().toISOString();
    const index = participants.findIndex((item) => item.id === participant.id);
    const sameNameIndex = participants.findIndex(
      (item) => item.id !== participant.id && normalizeNameKey(item.displayName) === normalizeNameKey(participant.displayName),
    );
    if (sameNameIndex >= 0) {
      throw new Error("이미 등록된 참가자 이름입니다.");
    }
    const next = {
      ...participant,
      createdAt: index >= 0 ? participants[index].createdAt : now,
      updatedAt: now,
    };
    if (index >= 0) participants[index] = next;
    else participants.push(next);
    await writeRosterToLocal(participants);
  });
  await rosterWriteQueue;
  return participant;
}

async function deleteRosterParticipant(id) {
  const participantId = nullableString(id);
  if (!participantId) throw new Error("삭제할 참가자 ID가 필요합니다.");

  if (hasSupabaseConfig()) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${ROSTER_TABLE}?id=eq.${encodeURIComponent(participantId)}`, {
      method: "PATCH",
      headers: supabaseHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify({ is_active: false, updated_at: new Date().toISOString() }),
    });
    if (!response.ok) {
      throw new Error(`Supabase 참가자 삭제 실패: ${await response.text()}`);
    }
    return;
  }

  rosterWriteQueue = rosterWriteQueue.then(async () => {
    const participants = await readRosterFromLocal();
    const next = participants.map((item) =>
      item.id === participantId ? { ...item, isActive: false, updatedAt: new Date().toISOString() } : item,
    );
    await writeRosterToLocal(next);
  });
  await rosterWriteQueue;
}

async function seedRosterParticipants(items) {
  const participants = Array.isArray(items) ? items.map(normalizeRosterParticipant) : [];
  if (!participants.length) return [];

  if (hasSupabaseConfig()) {
    const rows = participants.map(toRosterSupabaseRow);
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${ROSTER_TABLE}?on_conflict=display_name`, {
      method: "POST",
      headers: supabaseHeaders({ Prefer: "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify(rows),
    });
    if (!response.ok) {
      throw new Error(`Supabase 참가자 시드 실패: ${await response.text()}`);
    }
    return (await response.json()).map(fromRosterSupabaseRow);
  }

  rosterWriteQueue = rosterWriteQueue.then(async () => {
    const existing = await readRosterFromLocal();
    const byName = new Map(existing.map((item) => [normalizeNameKey(item.displayName), item]));
    const now = new Date().toISOString();
    participants.forEach((item) => {
      const key = normalizeNameKey(item.displayName);
      const current = byName.get(key);
      byName.set(key, {
        ...current,
        ...item,
        id: current?.id || item.id,
        createdAt: current?.createdAt || now,
        updatedAt: now,
      });
    });
    await writeRosterToLocal([...byName.values()]);
  });
  await rosterWriteQueue;
  return participants;
}

function hasSupabaseConfig() {
  if (SUPABASE_SERVICE_ROLE_KEY.includes("*")) {
    return false;
  }
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
    roster_participant_id: submission.rosterParticipantId,
    submitted_at: submission.submittedAt,
    display_name: submission.displayName,
    gender: submission.gender,
    marital_status: submission.maritalStatus,
    mbti: submission.mbti,
    birth_date: submission.birthDate,
    birth_time: submission.birthTime,
    birth_time_unknown: submission.birthTimeUnknown,
    calendar_type: submission.calendarType,
    birth_place: submission.birthPlace,
    calculation_policy: submission.calculationPolicy,
    manse_result: submission.manse,
    gemini_analysis: submission.geminiAnalysis || {},
    raw_submission: submission,
  };
}

function fromSupabaseRow(row) {
  const raw = row.raw_submission || {};
  return {
    ...raw,
    id: row.id,
    rosterParticipantId: row.roster_participant_id || raw.rosterParticipantId || null,
    submittedAt: row.submitted_at,
    displayName: row.display_name,
    gender: row.gender,
    maritalStatus: row.marital_status || raw.maritalStatus || null,
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

async function readRosterFromSupabase(includeInactive) {
  const activeFilter = includeInactive ? "" : "&is_active=eq.true";
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${ROSTER_TABLE}?select=*&order=display_name.asc${activeFilter}`,
    { headers: supabaseHeaders() },
  );
  if (!response.ok) {
    throw new Error(`Supabase 참가자 명단 조회 실패: ${await response.text()}`);
  }
  return (await response.json()).map(fromRosterSupabaseRow);
}

async function saveRosterToSupabase(participant, isNew = false) {
  const isUpdate = !isNew && Boolean(participant.id);
  const row = toRosterSupabaseRow(participant);

  if (isUpdate) {
    /* 기존 레코드 수정 (ID 기반 PATCH) */
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${ROSTER_TABLE}?id=eq.${encodeURIComponent(participant.id)}`,
      { method: "PATCH", headers: supabaseHeaders({ Prefer: "return=representation" }), body: JSON.stringify(row) },
    );
    if (!response.ok) throw new Error(`참가자 저장 실패: ${await response.text()}`);
    const rows = await response.json();
    return fromRosterSupabaseRow(rows[0] || participant);
  }

  /* 신규 추가: 2단계 upsert
     1단계: display_name으로 기존 레코드(비활성 포함) PATCH → 있으면 is_active=true 복구
     2단계: PATCH 결과가 없으면 진짜 새 레코드 POST */
  const patchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/${ROSTER_TABLE}?display_name=eq.${encodeURIComponent(row.display_name)}`,
    {
      method: "PATCH",
      headers: supabaseHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify({ ...row, is_active: true }),
    },
  );
  if (!patchRes.ok) throw new Error(`참가자 저장 실패: ${await patchRes.text()}`);
  const patched = await patchRes.json();
  if (patched.length > 0) {
    /* 기존 레코드 복구 완료 */
    return fromRosterSupabaseRow(patched[0]);
  }

  /* 진짜 새 이름 → 신규 삽입 */
  const postRes = await fetch(`${SUPABASE_URL}/rest/v1/${ROSTER_TABLE}`, {
    method: "POST",
    headers: supabaseHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify({ ...row, id: undefined }),
  });
  if (!postRes.ok) throw new Error(`참가자 저장 실패: ${await postRes.text()}`);
  const created = await postRes.json();
  return fromRosterSupabaseRow(created[0] || participant);
}

async function readRosterFromLocal() {
  try {
    const raw = await fs.readFile(ROSTER_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeRosterToLocal(participants) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ROSTER_FILE, JSON.stringify(participants, null, 2), "utf8");
}

function normalizeRosterParticipant(input) {
  const displayName = nullableString(input.displayName || input.name);
  const gender = normalizeGender(input.gender);
  if (!displayName) throw new Error("참가자 이름이 필요합니다.");
  if (!gender) throw new Error("참가자 성별은 남 또는 여로 입력해주세요.");

  return {
    id: nullableString(input.id) || cryptoRandomId(),
    displayName,
    gender,
    isActive: input.isActive !== false,
  };
}

function toRosterSupabaseRow(participant) {
  return {
    id: participant.id,
    display_name: participant.displayName,
    gender: participant.gender,
    is_active: participant.isActive !== false,
    updated_at: new Date().toISOString(),
  };
}

function fromRosterSupabaseRow(row) {
  return {
    id: row.id,
    displayName: row.display_name || row.displayName,
    gender: row.gender,
    isActive: row.is_active ?? row.isActive ?? true,
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

function normalizeGender(value) {
  const gender = String(value || "").trim();
  return ["남", "여"].includes(gender) ? gender : null;
}

function normalizeNameKey(value) {
  return String(value || "").trim().toLocaleLowerCase("ko");
}

function nullableString(value) {
  const text = String(value || "").trim();
  return text || null;
}

function cryptoRandomId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

module.exports = {
  saveSubmission,
  readSubmissions,
  deleteSubmission,
  deleteAllSubmissions,
  readRosterParticipants,
  findRosterParticipantById,
  hasSubmissionForRosterParticipant,
  saveRosterParticipant,
  deleteRosterParticipant,
  seedRosterParticipants,
};
