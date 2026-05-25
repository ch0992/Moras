#!/usr/bin/env node

/**
 * Moras web server entrypoint.
 *
 * Responsibilities:
 * - Route local HTTP and Netlify Function requests.
 * - Delegate page rendering, auth, storage, and business logic to modules.
 * - Do not add HTML templates or domain logic here.
 */

const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");




const { URL } = require("node:url");
const { handleAdminLogin, handleAdminLogout, isAdminAuthenticated } = require("./moras/auth");
const { handleManseApi, handleManseStartApi, handleManseAnalyzeApi } = require("./moras/manse-service");
const {
  deleteAllSubmissions,
  deleteRosterParticipant,
  deleteSubmission,
  readRosterParticipants,
  readSubmissions,
  saveRosterParticipant,
  saveRosterRequest,
} = require("./moras/storage");
const { readJson, send, sendJson } = require("./moras/http");
const { adminLoginPage, adminPage } = require("./moras/pages/admin-page");
const { applicantsPage } = require("./moras/pages/applicants-page");
const { page } = require("./moras/pages/participant-page");
const { upcomingEventPage, UPCOMING_IMAGE_ROUTE } = require("./moras/pages/upcoming-page");
const { matchPage } = require("./moras/pages/match-page");
const { resultsPage } = require("./moras/pages/results-page");
const { roulettePage } = require("./moras/pages/roulette-page");
const { ladderPage } = require("./moras/pages/ladder-page");
const { secretPage } = require("./moras/pages/secret-page");

const PORT = Number(process.env.PORT || 4173);
const UPCOMING_IMAGE_FILE = path.join(
  __dirname,
  "..",
  "assets",
  "marketing",
  "upcoming-event",
  "moras-upcoming-event-mbti-saju-v1.png",
);

function matchPerson(person) {
  return {
    id: person?.id,
    displayName: person?.displayName || person?.display_name || "",
    gender: person?.gender || "",
    mbti: person?.mbti || "",
    manse: person?.manse || person?.manse_result || null,
  };
}

// Modular Handlers for Netlify & Local server reuse
async function handleAdminSubmissions(cookieHeader) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }
  try {
    return {
      status: 200,
      payload: { submissions: await readSubmissions() },
    };
  } catch (error) {
    return {
      status: 500,
      payload: { error: error.message },
    };
  }
}

async function handleAdminSubmissionDelete(cookieHeader, id) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }
  try {
    if (id === "__all__") await deleteAllSubmissions();
    else await deleteSubmission(id);
    return {
      status: 200,
      payload: { ok: true },
    };
  } catch (error) {
    return {
      status: 400,
      payload: { error: error.message },
    };
  }
}

async function handleAdminSubmissionTestSeed(cookieHeader) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }
  try {
    const { seedTestSubmissionsFromRoster } = require("./moras/manse-service");
    return {
      status: 200,
      payload: await seedTestSubmissionsFromRoster(),
    };
  } catch (error) {
    return {
      status: 400,
      payload: { error: error.message },
    };
  }
}

async function handleApplicants() {
  try {
    const submissions = await readSubmissions();
    const applicants = submissions
      .map(toApplicantListItem)
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    return {
      status: 200,
      payload: { applicants },
    };
  } catch (error) {
    return {
      status: 500,
      payload: { error: error.message },
    };
  }
}

async function handleApplicantDetail(id) {
  try {
    const submissions = await readSubmissions();
    const submission = submissions.find((item) => item.id === id);
    if (!submission) return { status: 404, payload: { error: "신청 정보를 찾을 수 없습니다." } };
    return {
      status: 200,
      payload: {
        id: submission.id,
        name: submission.displayName || submission.name || "이름 없음",
        gender: submission.gender || null,
        mbti: submission.mbti || null,
        dayPillar: submission.manse?.saju?.dayPillar || null,
        submittedAt: submission.submittedAt || null,
        geminiAnalysis: submission.geminiAnalysis || null,
      },
    };
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleSecretSubmissions(pin) {
  const SECRET_PIN = process.env.SECRET_PIN || "090909";
  if (String(pin || "").trim() !== SECRET_PIN) {
    return { status: 401, payload: { error: "코드가 올바르지 않습니다." } };
  }
  try {
    const submissions = await readSubmissions();
    return { status: 200, payload: { submissions } };
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleRosterRequest(body) {
  try {
    const result = await saveRosterRequest({
      displayName: body.displayName || body.name,
      gender: body.gender,
      contact: body.contact,
    });
    return { status: 200, payload: { ok: true, ...result } };
  } catch (error) {
    return { status: 400, payload: { error: error.message } };
  }
}

async function handleRoster() {
  try {
    const [participants, submissions] = await Promise.all([
      readRosterParticipants(),
      readSubmissions(),
    ]);
    const submittedIds = new Set(submissions.map((item) => item.rosterParticipantId).filter(Boolean));
    return {
      status: 200,
      payload: {
        participants: participants.map((item) => ({
          id: item.id,
          displayName: item.displayName,
          gender: item.gender,
          hasSubmitted: submittedIds.has(item.id),
        })),
      },
    };
  } catch (error) {
    return {
      status: 500,
      payload: { error: error.message },
    };
  }
}

async function handleAdminRoster(cookieHeader, method = "GET", body = {}, id = "") {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }

  try {
    if (method === "GET") {
      return {
        status: 200,
        payload: { participants: await readRosterParticipants({ includeInactive: true }) },
      };
    }
    if (method === "POST") {
      const participant = await saveRosterParticipant(body);
      return { status: 200, payload: { participant } };
    }
    if (method === "PATCH") {
      const participant = await saveRosterParticipant({ ...body, id });
      return { status: 200, payload: { participant } };
    }
    if (method === "DELETE") {
      await deleteRosterParticipant(id);
      return { status: 200, payload: { ok: true } };
    }
    return { status: 405, payload: { error: "지원하지 않는 요청입니다." } };
  } catch (error) {
    return {
      status: 400,
      payload: { error: error.message },
    };
  }
}

function toApplicantListItem(item) {
  return {
    id: item.id,
    name: item.displayName || item.name || "이름 없음",
    gender: item.gender || null,
    mbti: item.mbti || null,
    dayPillar: item.manse?.saju?.dayPillar || null,
    submittedAt: item.submittedAt || null,
  };
}

async function handleAdminMatch(cookieHeader) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }
  try {
    const { runMatchingBatch } = require("./moras/match-service");
    const result = await runMatchingBatch();
    if (result.success) {
      return { status: 200, payload: result };
    } else {
      return { status: 500, payload: { error: result.error } };
    }
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleAdminMatches(cookieHeader) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }
  try {
    const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
    if (hasSupabaseConfig()) {
      const runs = await requestSupabase("match_runs?status=eq.completed&order=created_at.desc&limit=1");
      if (runs.length === 0) {
        return { status: 200, payload: { matches: [], unmatched: [], runId: null } };
      }
      const runId = runs[0].id;

      const matches = await requestSupabase(
        `match_results?match_run_id=eq.${runId}&select=*,male:male_participant_id(id,display_name,gender,mbti,manse_result),female:female_participant_id(id,display_name,gender,mbti,manse_result)&order=rank.asc`
      );

      const unmatched = await requestSupabase(
        `unmatched_participants?match_run_id=eq.${runId}&select=*,participant:participant_id(id,display_name,gender,mbti)`
      );

      return {
        status: 200,
        payload: {
          runId,
          matches: matches.map((match) => ({
            ...match,
            male: matchPerson(match.male),
            female: matchPerson(match.female),
          })),
          unmatched: unmatched.map((u) => matchPerson(u.participant)),
        }
      };
    } else {
      const localResultPath = path.join(__dirname, "../data/dev-match-results.json");
      try {
        const data = await fs.readFile(localResultPath, "utf8");
        const parsed = JSON.parse(data);
        return {
          status: 200,
          payload: {
            runId: parsed.matchRunId,
            matches: (parsed.matches || []).map((match) => ({
              ...match,
              average_score: match.average_score ?? match.score,
              score_detail: match.score_detail || null,
              is_top_match: match.is_top_match ?? match.isTop,
            })),
            unmatched: parsed.unmatched,
          }
        };
      } catch (e) {
        return { status: 200, payload: { matches: [], unmatched: [], runId: null } };
      }
    }
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleAdminMatchesReset(cookieHeader) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }

  try {
    const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
    if (hasSupabaseConfig()) {
      await requestSupabase("match_votes?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
      await requestSupabase("match_results?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
      await requestSupabase("unmatched_participants?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
      await requestSupabase("compatibility_evaluations?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
      await requestSupabase("match_runs?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
      await deleteAllSubmissions();
      return { status: 200, payload: { ok: true } };
    }

    await Promise.all([
      fs.rm(path.join(__dirname, "../data/dev-match-results.json"), { force: true }),
      fs.rm(path.join(__dirname, "../data/operator-passcodes.json"), { force: true }),
    ]);
    await deleteAllSubmissions();
    return { status: 200, payload: { ok: true } };
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handlePublicResults() {
  try {
    const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");

    if (hasSupabaseConfig()) {
      const runs = await requestSupabase("match_runs?status=eq.completed&order=created_at.desc&limit=1&select=id,vote_deadline_at");
      if (runs.length === 0) {
        return { status: 200, payload: { matches: [], runId: null, voteDeadline: null } };
      }
      const runId = runs[0].id;
      const voteDeadline = runs[0].vote_deadline_at || null;
      const matches = await requestSupabase(
        `match_results?match_run_id=eq.${runId}&select=id,rank,is_top_match,average_score,score_detail,male:male_participant_id(id,display_name,gender,mbti,manse_result),female:female_participant_id(id,display_name,gender,mbti,manse_result)&order=rank.asc`
      );

      // Fetch vote status for all matches in this run
      const matchIds = matches.map((m) => m.id);
      let allVotes = [];
      if (matchIds.length > 0) {
        allVotes = await requestSupabase(
          `match_votes?match_result_id=in.(${matchIds.join(",")})&select=match_result_id,participant_id`
        );
      }
      const voteMap = {};
      allVotes.forEach((v) => {
        if (!voteMap[v.match_result_id]) voteMap[v.match_result_id] = new Set();
        voteMap[v.match_result_id].add(v.participant_id);
      });

      return {
        status: 200,
        payload: {
          runId,
          voteDeadline,
          matches: matches.map((match) => ({
            id: match.id,
            rank: match.rank,
            is_top_match: match.is_top_match,
            average_score: match.average_score,
            score_detail: match.score_detail,
            male: matchPerson(match.male),
            female: matchPerson(match.female),
            maleVoted: !!(voteMap[match.id]?.has(match.male?.id)),
            femaleVoted: !!(voteMap[match.id]?.has(match.female?.id)),
          })),
        },
      };
    }

    const localResultPath = path.join(__dirname, "../data/dev-match-results.json");
    try {
      const data = await fs.readFile(localResultPath, "utf8");
      const parsed = JSON.parse(data);
      return {
        status: 200,
        payload: {
          runId: parsed.matchRunId,
          matches: (parsed.matches || []).map((match) => ({
            rank: match.rank,
            is_top_match: match.is_top_match ?? match.isTop,
            average_score: match.average_score ?? match.score,
            score_detail: match.score_detail || null,
            male: matchPerson(match.male),
            female: matchPerson(match.female),
          })),
        },
      };
    } catch {
      return { status: 200, payload: { matches: [], runId: null } };
    }
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleAdminRoulette(cookieHeader, method, body = {}, id = "") {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return { status: 401, payload: { error: "관리자 로그인이 필요합니다." } };
  }

  const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");

  try {
    if (hasSupabaseConfig()) {
      if (method === "GET") {
        await progressScheduledRoulette(requestSupabase);
        return { status: 200, payload: await loadRouletteSupabase(requestSupabase, true) };
      }

      if (method === "POST" && body.action === "createItem") {
        const label = String(body.label || "").trim();
        if (!label) return { status: 400, payload: { error: "추첨 항목을 입력해주세요." } };
        const item = await requestSupabase("roulette_items", {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: { label },
        });
        return { status: 200, payload: { item: item[0] } };
      }

      if (method === "POST" && body.action === "saveSettings") {
        const selectedItemIds = normalizeIdList(body.selectedItemIds);
        const rows = await saveRouletteSettingsSupabase(requestSupabase, {
          eventName: body.eventName,
          startsAt: body.startsAt,
          drawMode: body.drawMode,
          selectedItemIds,
        });
        return { status: 200, payload: { settings: rows[0] } };
      }

      if (method === "POST" && body.action === "addParticipant") {
        const rosterParticipantId = String(body.rosterParticipantId || "").trim();
        const roster = await readRosterParticipants({ includeInactive: true });
        const participant = roster.find((item) => item.id === rosterParticipantId);
        if (!participant) return { status: 404, payload: { error: "참가자 명단에서 대상을 찾지 못했습니다." } };
        const rows = await requestSupabase("roulette_participants?on_conflict=roster_participant_id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=representation" },
          body: {
            roster_participant_id: participant.id,
            display_name: participant.displayName,
            gender: participant.gender,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
        });
        return { status: 200, payload: { participant: rows[0] } };
      }

      if (method === "POST" && body.action === "removeParticipant") {
        const participantId = String(body.participantId || "").trim();
        if (!participantId) return { status: 400, payload: { error: "제외할 참가자가 필요합니다." } };
        await requestSupabase(`roulette_participants?id=eq.${encodeURIComponent(participantId)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: { is_active: false, updated_at: new Date().toISOString() },
        });
        return { status: 200, payload: { ok: true } };
      }

      if (method === "POST" && body.action === "spin") {
        const settingsRows = await requestSupabase("roulette_settings?id=eq.default&select=*");
        const settings = normalizeRouletteSettings(settingsRows[0] || null);
        const selectedItemIds = normalizeIdList(body.selectedItemIds || settings.selected_item_ids);
        if (!selectedItemIds.length) return { status: 400, payload: { error: "추첨할 항목을 선택해주세요." } };
        const completed = await requestSupabase("roulette_results?select=item_id");
        const completedIds = new Set(completed.map((result) => result.item_id));
        const remaining = selectedItemIds.filter((id) => !completedIds.has(id));
        if (!remaining.length) return { status: 200, payload: { ok: true, count: 0, message: "모든 항목이 이미 추첨되었습니다." } };
        const winners = [];
        for (const itemId of remaining) {
          try {
            const result = await spinRouletteSupabase(requestSupabase, itemId);
            winners.push(result.winner);
          } catch (err) {
            if (err.status !== 409) throw err;
          }
        }
        const afterResults = await requestSupabase("roulette_results?select=item_id");
        const afterSet = new Set(afterResults.map((r) => r.item_id));
        if (selectedItemIds.every((id) => afterSet.has(id))) {
          await requestSupabase("roulette_settings?id=eq.default", {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: { sequence_completed_at: new Date().toISOString(), auto_spin_executed_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          });
        }
        return { status: 200, payload: { ok: true, count: winners.length, winners } };
      }

      if (method === "POST" && body.action === "resetResults") {
        /* 참가자는 유지, 추첨 결과와 진행 상태만 초기화 */
        await requestSupabase("roulette_results?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
        await requestSupabase("roulette_settings?id=eq.default", {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: { sequence_started_at: null, sequence_completed_at: null, auto_spin_executed_at: null, updated_at: new Date().toISOString() },
        });
        return { status: 200, payload: { ok: true } };
      }

      if (method === "POST" && body.action === "resetRoulette") {
        /* 참가자 + 결과 + 세팅 전체 초기화 */
        await requestSupabase("roulette_results?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
        await requestSupabase("roulette_participants?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
        await requestSupabase("roulette_settings?id=eq.default", {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: { sequence_started_at: null, sequence_completed_at: null, auto_spin_executed_at: null, starts_at: null, draw_mode: "instant", selected_item_ids: [], updated_at: new Date().toISOString() },
        });
        return { status: 200, payload: { ok: true } };
      }

      if (method === "POST" && body.action === "addAllParticipants") {
        const roster = await readRosterParticipants({ includeInactive: false });
        let added = 0;
        for (const person of roster) {
          await requestSupabase("roulette_participants?on_conflict=roster_participant_id", {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
            body: { roster_participant_id: person.id, display_name: person.displayName, gender: person.gender, is_active: true, updated_at: new Date().toISOString() },
          });
          added++;
        }
        return { status: 200, payload: { ok: true, added } };
      }

      if (method === "DELETE" && id) {
        await requestSupabase(`roulette_items?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: { is_active: false },
        });
        return { status: 200, payload: { ok: true } };
      }
    }

    const localPath = path.join(__dirname, "../data/dev-roulette.json");
    const local = await readLocalRoulette(localPath);
    if (method === "GET") {
      await progressLocalRoulette(local);
      await hydrateLocalRouletteRoster(local);
      await writeLocalRoulette(localPath, local);
      return { status: 200, payload: local };
    }

    if (method === "POST" && body.action === "createItem") {
      const label = String(body.label || "").trim();
      if (!label) return { status: 400, payload: { error: "추첨 항목을 입력해주세요." } };
      local.items.unshift({ id: crypto.randomUUID(), label, is_active: true, created_at: new Date().toISOString() });
    }

    if (method === "POST" && body.action === "saveSettings") {
      const selectedItemIds = normalizeIdList(body.selectedItemIds);
      local.settings = {
        ...defaultRouletteSettings(),
        ...local.settings,
        event_name: String(body.eventName || "").trim() || "Moras 룰렛 이벤트",
        starts_at: String(body.startsAt || "").trim() || null,
        draw_mode: body.drawMode === "timer" ? "timer" : "instant",
        scheduled_item_id: selectedItemIds[0] || null,
        selected_item_ids: selectedItemIds,
        auto_spin_executed_at: null,
        sequence_started_at: null,
        sequence_completed_at: null,
        updated_at: new Date().toISOString(),
      };
    }

    if (method === "POST" && body.action === "addParticipant") {
      await hydrateLocalRouletteRoster(local);
      const participant = (local.roster || []).find((item) => item.id === body.rosterParticipantId);
      if (!participant) return { status: 404, payload: { error: "참가자 명단에서 대상을 찾지 못했습니다." } };
      local.participants = local.participants.filter((item) => item.roster_participant_id !== participant.id);
      local.participants.push({
        id: crypto.randomUUID(),
        roster_participant_id: participant.id,
        display_name: participant.displayName,
        gender: participant.gender,
        is_active: true,
        created_at: new Date().toISOString(),
      });
    }

    if (method === "POST" && body.action === "removeParticipant") {
      local.participants = local.participants.map((item) => item.id === body.participantId ? { ...item, is_active: false } : item);
    }

    if (method === "POST" && body.action === "spin") {
      const completedIds = new Set((local.results || []).map((result) => result.item_id));
      const selectedItemIds = normalizeIdList(body.selectedItemIds || local.settings.selected_item_ids);
      const itemId = selectedItemIds.find((candidate) => !completedIds.has(candidate)) || String(body.itemId || "").trim();
      if (!itemId) return { status: 400, payload: { error: "추첨할 항목을 선택해주세요." } };
      const result = spinRouletteLocal(local, itemId);
      await writeLocalRoulette(localPath, local);
      return { status: 200, payload: result };
    }

    if (method === "DELETE" && id) {
      local.items = local.items.filter((item) => item.id !== id);
    }

    await writeLocalRoulette(localPath, local);
    return { status: 200, payload: { ok: true } };
  } catch (error) {
    return { status: error.status || 500, payload: { error: error.message } };
  }
}

/* ══════════════════════════════════════════════════════════
   🪜  LADDER GAME BACKEND SERVICE (Mirroring Roulette)
   ══════════════════════════════════════════════════════════ */

async function handleAdminLadder(cookieHeader, method, body = {}, id = "") {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return { status: 401, payload: { error: "관리자 로그인이 필요합니다." } };
  }

  const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");

  try {
    if (hasSupabaseConfig()) {
      if (method === "GET") {
        await progressScheduledLadder(requestSupabase);
        return { status: 200, payload: await loadLadderSupabase(requestSupabase, true) };
      }

      if (method === "POST" && body.action === "saveSettings") {
        const rows = await requestSupabase("ladder_settings?on_conflict=id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=representation" },
          body: {
            id: "default",
            event_name: String(body.eventName || "").trim() || "Moras 사다리타기 이벤트",
            starts_at: String(body.startsAt || "").trim() || null,
            draw_mode: body.drawMode === "timer" ? "timer" : "instant",
            sequence_completed_at: null,
            auto_spin_executed_at: null,
            updated_at: new Date().toISOString(),
          },
        });
        return { status: 200, payload: { settings: rows[0] } };
      }

      if (method === "POST" && body.action === "addParticipant") {
        const rosterParticipantId = String(body.rosterParticipantId || "").trim();
        const roster = await readRosterParticipants({ includeInactive: true });
        const participant = roster.find((item) => item.id === rosterParticipantId);
        if (!participant) return { status: 404, payload: { error: "참가자 명단에서 대상을 찾지 못했습니다." } };
        const rows = await requestSupabase("ladder_participants?on_conflict=roster_participant_id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=representation" },
          body: {
            roster_participant_id: participant.id,
            display_name: participant.displayName,
            gender: participant.gender,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
        });
        return { status: 200, payload: { participant: rows[0] } };
      }

      if (method === "POST" && body.action === "removeParticipant") {
        const participantId = String(body.participantId || "").trim();
        if (!participantId) return { status: 400, payload: { error: "제외할 참가자가 필요합니다." } };
        await requestSupabase(`ladder_participants?id=eq.${encodeURIComponent(participantId)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: { is_active: false, updated_at: new Date().toISOString() },
        });
        return { status: 200, payload: { ok: true } };
      }

      if (method === "POST" && body.action === "spin") {
        const result = await spinLadderSupabase(requestSupabase);
        return { status: 200, payload: result };
      }

      if (method === "POST" && body.action === "resetResults") {
        await requestSupabase("ladder_results?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
        await requestSupabase("ladder_settings?id=eq.default", {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: { sequence_started_at: null, sequence_completed_at: null, auto_spin_executed_at: null, updated_at: new Date().toISOString() },
        });
        return { status: 200, payload: { ok: true } };
      }

      if (method === "POST" && body.action === "resetLadder") {
        await requestSupabase("ladder_results?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
        await requestSupabase("ladder_participants?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
        await requestSupabase("ladder_settings?id=eq.default", {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: { sequence_started_at: null, sequence_completed_at: null, auto_spin_executed_at: null, starts_at: null, draw_mode: "instant", updated_at: new Date().toISOString() },
        });
        return { status: 200, payload: { ok: true } };
      }

      if (method === "POST" && body.action === "addAllParticipants") {
        const roster = await readRosterParticipants({ includeInactive: false });
        let added = 0;
        for (const person of roster) {
          await requestSupabase("ladder_participants?on_conflict=roster_participant_id", {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
            body: { roster_participant_id: person.id, display_name: person.displayName, gender: person.gender, is_active: true, updated_at: new Date().toISOString() },
          });
          added++;
        }
        return { status: 200, payload: { ok: true, added } };
      }
    }

    /* Local File DB Fallback: data/dev-ladder.json */
    const localPath = path.join(__dirname, "../data/dev-ladder.json");
    const local = await readLocalLadder(localPath);

    if (method === "GET") {
      await progressLocalLadder(local);
      await hydrateLocalLadderRoster(local);
      await writeLocalLadder(localPath, local);
      return { status: 200, payload: local };
    }

    if (method === "POST" && body.action === "saveSettings") {
      local.settings = {
        ...defaultLadderSettings(),
        ...local.settings,
        event_name: String(body.eventName || "").trim() || "Moras 사다리타기 이벤트",
        starts_at: String(body.startsAt || "").trim() || null,
        draw_mode: body.drawMode === "timer" ? "timer" : "instant",
        auto_spin_executed_at: null,
        sequence_started_at: null,
        sequence_completed_at: null,
        updated_at: new Date().toISOString(),
      };
    }

    if (method === "POST" && body.action === "addParticipant") {
      await hydrateLocalLadderRoster(local);
      const participant = (local.roster || []).find((item) => item.id === body.rosterParticipantId);
      if (!participant) return { status: 404, payload: { error: "참가자 명단에서 대상을 찾지 못했습니다." } };
      local.participants = local.participants.filter((item) => item.roster_participant_id !== participant.id);
      local.participants.push({
        id: crypto.randomUUID(),
        roster_participant_id: participant.id,
        display_name: participant.displayName,
        gender: participant.gender,
        is_active: true,
        created_at: new Date().toISOString(),
      });
    }

    if (method === "POST" && body.action === "removeParticipant") {
      local.participants = local.participants.map((item) => item.id === body.participantId ? { ...item, is_active: false } : item);
    }

    if (method === "POST" && body.action === "spin") {
      const result = await spinLadderLocal(local);
      await writeLocalLadder(localPath, local);
      return { status: 200, payload: result };
    }

    if (method === "POST" && body.action === "resetResults") {
      local.results = [];
      local.settings.sequence_started_at = null;
      local.settings.sequence_completed_at = null;
      local.settings.auto_spin_executed_at = null;
      local.settings.updated_at = new Date().toISOString();
    }

    if (method === "POST" && body.action === "resetLadder") {
      local.results = [];
      local.participants = [];
      local.settings = defaultLadderSettings();
    }

    if (method === "POST" && body.action === "addAllParticipants") {
      const roster = await readRosterParticipants({ includeInactive: false });
      let added = 0;
      local.participants = local.participants.filter((p) => p.is_active !== false);
      const existingIds = new Set(local.participants.map((p) => p.roster_participant_id));
      for (const person of roster) {
        if (!existingIds.has(person.id)) {
          local.participants.push({
            id: crypto.randomUUID(),
            roster_participant_id: person.id,
            display_name: person.displayName,
            gender: person.gender,
            is_active: true,
            created_at: new Date().toISOString(),
          });
          added++;
        }
      }
      return { status: 200, payload: { ok: true, added } };
    }

    await writeLocalLadder(localPath, local);
    return { status: 200, payload: { ok: true } };
  } catch (error) {
    return { status: error.status || 500, payload: { error: error.message } };
  }
}

async function handlePublicLadder() {
  const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
  try {
    if (hasSupabaseConfig()) {
      await progressScheduledLadder(requestSupabase);
      return { status: 200, payload: await loadLadderSupabase(requestSupabase, false) };
    }
    const localPath = path.join(__dirname, "../data/dev-ladder.json");
    const local = await readLocalLadder(localPath);
    await progressLocalLadder(local);
    await hydrateLocalLadderRoster(local);
    local.activeViewerCount = countLocalActiveViewers(local);
    await writeLocalLadder(localPath, local);
    return { status: 200, payload: local };
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleLadderPublicAction(body) {
  const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
  const action = String(body.action || "").trim();
  try {
    if (action === "heartbeat") {
      const sessionId = String(body.sessionId || "").trim().slice(0, 120);
      if (!sessionId) return { error: "세션 정보가 필요합니다." };
      if (hasSupabaseConfig()) {
        await requestSupabase("ladder_view_sessions?on_conflict=session_id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: {
            session_id: sessionId,
            page: "ladder",
            last_seen_at: new Date().toISOString(),
          },
        });
        return { ok: true, activeViewerCount: await readLadderActiveViewerCount(requestSupabase) };
      }
      const localPath = path.join(__dirname, "../data/dev-ladder.json");
      const local = await readLocalLadder(localPath);
      local.viewSessions = local.viewSessions || {};
      local.viewSessions[sessionId] = new Date().toISOString();
      await writeLocalLadder(localPath, local);
      return { ok: true, activeViewerCount: countLocalActiveViewers(local) };
    }
    return { error: "알 수 없는 액션입니다." };
  } catch (error) {
    return { error: error.message };
  }
}

/* 🪜 Ladder Supabase Helpers */
async function loadLadderSupabase(requestSupabase, includeRoster = false) {
  const requests = [
    requestSupabase("ladder_results?select=*,ladder_participant:ladder_participant_id(id,display_name,gender)&order=created_at.desc"),
    requestSupabase("ladder_participants?is_active=eq.true&order=created_at.asc"),
    requestSupabase("ladder_settings?id=eq.default&select=*"),
    readLadderActiveViewerCount(requestSupabase),
    loadRoulettePrizesSupabase(requestSupabase), // 룰렛 상품 연동!
  ];
  if (includeRoster) requests.push(readRosterParticipants({ includeInactive: false }));
  const [results, participants, settingsRows, activeViewerCount, roulettePrizes, roster = []] = await Promise.all(requests);
  
  return { 
    results: (results || []).map(r => ({ ...r, participant: r.ladder_participant || null })), 
    participants, 
    roster, 
    settings: { ...defaultLadderSettings(), ...(settingsRows[0] || {}) }, 
    activeViewerCount,
    roulettePrizes
  };
}

async function loadRoulettePrizesSupabase(requestSupabase) {
  try {
    const [items, settingsRows] = await Promise.all([
      requestSupabase("roulette_items?is_active=eq.true&order=created_at.asc"),
      requestSupabase("roulette_settings?id=eq.default&select=*"),
    ]);
    const settings = settingsRows[0] || {};
    const selectedIds = new Set(normalizeIdList(settings.selected_item_ids));
    return {
      items: items || [],
      selectedItemIds: Array.from(selectedIds),
    };
  } catch (e) {
    return { items: [], selectedItemIds: [] };
  }
}

async function readLadderActiveViewerCount(requestSupabase) {
  const cutoff = new Date(Date.now() - 20 * 1000).toISOString();
  try {
    const rows = await requestSupabase(`ladder_view_sessions?last_seen_at=gte.${encodeURIComponent(cutoff)}&select=session_id`);
    return rows.length;
  } catch {
    return 0;
  }
}

function defaultLadderSettings() {
  return { id: "default", event_name: "Moras 사다리타기 이벤트", starts_at: null, draw_mode: "instant", auto_spin_executed_at: null, sequence_started_at: null, sequence_completed_at: null };
}

/* 🪜 Local JSON Ladder DB Helpers */
async function readLocalLadder(localPath) {
  try {
    const local = JSON.parse(await fs.readFile(localPath, "utf8"));
    // 룰렛 상품 연동 수급
    const roulettePath = path.join(__dirname, "../data/dev-roulette.json");
    const rouletteLocal = await readLocalRoulette(roulettePath);
    const roulettePrizes = {
      items: rouletteLocal.items || [],
      selectedItemIds: rouletteLocal.settings?.selected_item_ids || [],
    };
    return { 
      items: local.items || [], 
      results: local.results || [], 
      participants: local.participants || [], 
      roster: local.roster || [], 
      viewSessions: local.viewSessions || {}, 
      settings: { ...defaultLadderSettings(), ...(local.settings || {}) },
      roulettePrizes
    };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    // 룰렛 상품 연동 수급
    const roulettePath = path.join(__dirname, "../data/dev-roulette.json");
    const rouletteLocal = await readLocalRoulette(roulettePath).catch(() => ({ items: [], settings: {} }));
    const roulettePrizes = {
      items: rouletteLocal.items || [],
      selectedItemIds: rouletteLocal.settings?.selected_item_ids || [],
    };
    return { items: [], results: [], participants: [], roster: [], viewSessions: {}, settings: defaultLadderSettings(), roulettePrizes };
  }
}

async function writeLocalLadder(localPath, local) {
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  // local 객체에 roulettePrizes를 얹어 리턴했으므로 디스크 저장 시에는 필터링해서 가볍게 저장
  const toSave = {
    settings: local.settings,
    participants: local.participants,
    results: local.results,
    viewSessions: local.viewSessions,
  };
  await fs.writeFile(localPath, JSON.stringify(toSave, null, 2), "utf8");
}

async function hydrateLocalLadderRoster(local) {
  local.roster = await readRosterParticipants({ includeInactive: false });
  local.participants = (local.participants || []).filter((item) => item.is_active !== false);
}

/* 사다리 무작위 1회 스핀 매칭 (Local) */
function spinLadderLocal(local) {
  const participants = (local.participants || []).filter((p) => p.is_active !== false);
  if (!participants.length) {
    throw new Error("사다리타기에 등록된 참가자가 없습니다.");
  }
  
  // 룰렛에서 연동된 상품 정보 파싱
  const prizes = local.roulettePrizes || { items: [], selectedItemIds: [] };
  const allPrizes = prizes.items.filter((it) => (prizes.selectedItemIds || []).includes(it.id));
  
  // 이미 당첨 처리된 참가자 집합
  const completedParticipantIds = new Set((local.results || []).map((r) => r.ladder_participant_id));
  // 아직 사다리를 타지 않은 참가자 목록
  const eligibleParticipants = participants.filter((p) => !completedParticipantIds.has(p.id));
  
  if (eligibleParticipants.length === 0) {
    const error = new Error("이미 모든 사다리 참가자의 결과가 생성되었습니다.");
    error.status = 409;
    throw error;
  }
  
  // 이미 소진된 상품 집합
  const completedPrizeIds = new Set((local.results || []).map((r) => r.item_id).filter(id => id !== "default-loss"));
  const remainingPrizes = allPrizes.filter((p) => !completedPrizeIds.has(p.id));
  
  // 당첨 대상 참가자 1명 무작위 지정 (룰렛의 spin과 똑같이 순차 매치)
  const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
  
  let targetPrize = null;
  if (remainingPrizes.length > 0) {
    targetPrize = remainingPrizes[Math.floor(Math.random() * remainingPrizes.length)];
  }
  
  const result = {
    id: crypto.randomUUID(),
    ladder_participant_id: winner.id,
    item_id: targetPrize ? targetPrize.id : "default-loss",
    prize_label: targetPrize ? targetPrize.label : "꽝 (다음 기회에...)",
    created_at: new Date().toISOString(),
    participant: winner
  };
  
  local.results.unshift(result);
  
  // 모든 참가자가 다 찼다면 sequence_completed_at 완료 처리
  const totalCount = local.results.length;
  if (totalCount >= participants.length) {
    local.settings.sequence_completed_at = new Date().toISOString();
    local.settings.auto_spin_executed_at = new Date().toISOString();
  }
  
  return { result, winner };
}

/* 사다리 무작위 1회 스핀 매칭 (Supabase) */
async function spinLadderSupabase(requestSupabase) {
  const [participants, existingResults, prizes] = await Promise.all([
    requestSupabase("ladder_participants?is_active=eq.true&select=id,display_name,gender&order=created_at.asc"),
    requestSupabase("ladder_results?select=ladder_participant_id,item_id"),
    loadRoulettePrizesSupabase(requestSupabase),
  ]);
  
  if (!participants.length) {
    throw new Error("사다리타기에 등록된 참가자가 없습니다.");
  }
  
  const allPrizes = prizes.items.filter((it) => (prizes.selectedItemIds || []).includes(it.id));
  const completedParticipantIds = new Set(existingResults.map((r) => r.ladder_participant_id));
  const eligibleParticipants = participants.filter((p) => !completedParticipantIds.has(p.id));
  
  if (eligibleParticipants.length === 0) {
    const error = new Error("이미 모든 사다리 참가자의 결과가 생성되었습니다.");
    error.status = 409;
    throw error;
  }
  
  const completedPrizeIds = new Set(existingResults.map((r) => r.item_id).filter(id => id !== "default-loss"));
  const remainingPrizes = allPrizes.filter((p) => !completedPrizeIds.has(p.id));
  
  const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
  
  let targetPrize = null;
  if (remainingPrizes.length > 0) {
    targetPrize = remainingPrizes[Math.floor(Math.random() * remainingPrizes.length)];
  }
  
  const inserted = await requestSupabase("ladder_results", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: {
      ladder_participant_id: winner.id,
      item_id: targetPrize ? targetPrize.id : "default-loss",
      prize_label: targetPrize ? targetPrize.label : "꽝 (다음 기회에...)",
    },
  });
  
  const insertedResult = inserted[0];
  
  // 전체 완료 여부 체크
  if (existingResults.length + 1 >= participants.length) {
    await requestSupabase("ladder_settings?id=eq.default", {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: {
        sequence_completed_at: new Date().toISOString(),
        auto_spin_executed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    });
  }
  
  return { result: insertedResult, winner };
}

/* 타이머 스케줄 자동 실행 (Local) */
async function progressLocalLadder(local) {
  if (local.settings.draw_mode !== "timer" || local.settings.sequence_completed_at) return false;
  if (!local.settings.starts_at) return false;
  const startsAt = new Date(local.settings.starts_at);
  if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() > Date.now()) return false;

  let sequenceStartedAt = local.settings.sequence_started_at;
  if (!sequenceStartedAt) {
    local.settings.sequence_started_at = new Date().toISOString();
    local.settings.auto_spin_executed_at = null;
    local.settings.updated_at = new Date().toISOString();
    sequenceStartedAt = local.settings.sequence_started_at;
  }

  const participants = (local.participants || []).filter((p) => p.is_active !== false);
  if (!participants.length) return false;

  const elapsed = Date.now() - new Date(sequenceStartedAt).getTime();
  // 8초마다 한 명씩 주행 시작
  const targetCount = Math.min(participants.length, Math.max(1, Math.floor(elapsed / 8000) + 1));
  
  const results = local.results || [];
  let addedCount = 0;
  
  while (results.length < targetCount) {
    try {
      spinLadderLocal(local);
      addedCount++;
    } catch (e) {
      break;
    }
  }
  return addedCount > 0;
}

/* 타이머 스케줄 자동 실행 (Supabase) */
async function progressScheduledLadder(requestSupabase) {
  const settingsRows = await requestSupabase("ladder_settings?id=eq.default&select=*");
  const settings = settingsRows[0] || {};
  if (settings.draw_mode !== "timer" || settings.sequence_completed_at) return false;
  if (!settings.starts_at) return false;
  const startsAt = new Date(settings.starts_at);
  if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() > Date.now()) return false;

  let sequenceStartedAt = settings.sequence_started_at;
  if (!sequenceStartedAt) {
    const claimed = await requestSupabase("ladder_settings?id=eq.default&sequence_started_at=is.null", {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: { sequence_started_at: new Date().toISOString(), auto_spin_executed_at: null, updated_at: new Date().toISOString() },
    });
    sequenceStartedAt = claimed[0]?.sequence_started_at || new Date().toISOString();
  }

  const participants = await requestSupabase("ladder_participants?is_active=eq.true&select=id");
  if (!participants.length) return false;

  const elapsed = Date.now() - new Date(sequenceStartedAt).getTime();
  const targetCount = Math.min(participants.length, Math.max(1, Math.floor(elapsed / 8000) + 1));
  const results = await requestSupabase("ladder_results?select=id");
  
  let addedCount = 0;
  let curResultsLength = results.length;
  while (curResultsLength < targetCount) {
    try {
      await spinLadderSupabase(requestSupabase);
      curResultsLength++;
      addedCount++;
    } catch (error) {
      if (error.status !== 409) throw error;
      break;
    }
  }
  return addedCount > 0;
}

async function loadRouletteSupabase(requestSupabase, includeRoster = false) {
  const requests = [
    requestSupabase("roulette_items?is_active=eq.true&order=created_at.asc"),
    requestSupabase("roulette_results?select=*,item:item_id(id,label),roulette_participant:roulette_participant_id(id,display_name,gender)&order=created_at.desc"),
    requestSupabase("roulette_participants?is_active=eq.true&order=created_at.asc"),
    requestSupabase("roulette_settings?id=eq.default&select=*"),
    readRouletteActiveViewerCount(requestSupabase),
  ];
  if (includeRoster) requests.push(readRosterParticipants({ includeInactive: false }));
  const [items, results, participants, settingsRows, activeViewerCount, roster = []] = await Promise.all(requests);
  return { items, results: normalizeRouletteResults(results), participants, roster, settings: normalizeRouletteSettings(settingsRows[0] || null), activeViewerCount };
}

async function readRouletteActiveViewerCount(requestSupabase) {
  const cutoff = new Date(Date.now() - 20 * 1000).toISOString();
  try {
    const rows = await requestSupabase(`roulette_view_sessions?last_seen_at=gte.${encodeURIComponent(cutoff)}&select=session_id`);
    return rows.length;
  } catch {
    return 0;
  }
}

function normalizeRouletteResults(results) {
  return (results || []).map((result) => ({ ...result, participant: result.roulette_participant || result.participant || null }));
}

function normalizeRouletteSettings(settings) {
  return { ...defaultRouletteSettings(), ...(settings || {}), selected_item_ids: normalizeIdList(settings?.selected_item_ids || settings?.selectedItemIds || settings?.scheduled_item_id) };
}

function defaultRouletteSettings() {
  return { id: "default", event_name: "Moras 룰렛 이벤트", starts_at: null, draw_mode: "instant", scheduled_item_id: null, selected_item_ids: [], auto_spin_executed_at: null, sequence_started_at: null, sequence_completed_at: null };
}

function normalizeIdList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (!value) return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return normalizeIdList(parsed);
    } catch {}
    return [trimmed];
  }
  return [];
}

async function saveRouletteSettingsSupabase(requestSupabase, input) {
  const selectedItemIds = normalizeIdList(input.selectedItemIds);
  return requestSupabase("roulette_settings?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: {
      id: "default",
      event_name: String(input.eventName || "").trim() || "Moras 룰렛 이벤트",
      starts_at: String(input.startsAt || "").trim() || null,
      draw_mode: input.drawMode === "timer" ? "timer" : "instant",
      scheduled_item_id: selectedItemIds[0] || null,
      selected_item_ids: selectedItemIds,
      auto_spin_executed_at: null,
      sequence_started_at: null,
      sequence_completed_at: null,
      updated_at: new Date().toISOString(),
    },
  });
}

async function spinRouletteSupabase(requestSupabase, itemId) {
  const [participants, existing] = await Promise.all([
    requestSupabase("roulette_participants?is_active=eq.true&select=id,display_name,gender&order=created_at.asc"),
    requestSupabase(`roulette_results?item_id=eq.${encodeURIComponent(itemId)}&select=roulette_participant_id`),
  ]);
  const used = new Set(existing.map((result) => result.roulette_participant_id).filter(Boolean));
  const eligible = participants.filter((participant) => !used.has(participant.id));
  if (eligible.length === 0) {
    const error = new Error("이 항목으로 추첨 가능한 룰렛 참가자가 더 이상 없습니다.");
    error.status = 409;
    throw error;
  }
  const winner = eligible[Math.floor(Math.random() * eligible.length)];
  const inserted = await requestSupabase("roulette_results", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: { item_id: itemId, roulette_participant_id: winner.id },
  });
  return { result: inserted[0], winner };
}

async function progressScheduledRoulette(requestSupabase) {
  const settingsRows = await requestSupabase("roulette_settings?id=eq.default&select=*");
  const settings = normalizeRouletteSettings(settingsRows[0] || null);
  if (settings.draw_mode !== "timer" || settings.sequence_completed_at) return false;
  const itemIds = normalizeIdList(settings.selected_item_ids);
  if (!itemIds.length || !settings.starts_at) return false;
  const startsAt = new Date(settings.starts_at);
  if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() > Date.now()) return false;

  let sequenceStartedAt = settings.sequence_started_at;
  if (!sequenceStartedAt) {
    const claimed = await requestSupabase("roulette_settings?id=eq.default&sequence_started_at=is.null", {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: { sequence_started_at: new Date().toISOString(), auto_spin_executed_at: null, updated_at: new Date().toISOString() },
    });
    sequenceStartedAt = claimed[0]?.sequence_started_at || new Date().toISOString();
  }

  const elapsed = Date.now() - new Date(sequenceStartedAt).getTime();
  const targetCount = Math.min(itemIds.length, Math.max(1, Math.floor(elapsed / 8000) + 1));
  const results = await requestSupabase("roulette_results?select=item_id");
  const completed = new Set(results.map((result) => result.item_id));
  const dueItems = itemIds.slice(0, targetCount).filter((itemId) => !completed.has(itemId));
  for (const itemId of dueItems) {
    try { await spinRouletteSupabase(requestSupabase, itemId); }
    catch (error) { if (error.status !== 409) throw error; }
  }

  const after = await requestSupabase("roulette_results?select=item_id");
  const afterCompleted = new Set(after.map((result) => result.item_id));
  if (itemIds.every((itemId) => afterCompleted.has(itemId))) {
    await requestSupabase("roulette_settings?id=eq.default", {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: { auto_spin_executed_at: new Date().toISOString(), sequence_completed_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    });
  }
  return dueItems.length > 0;
}

async function handlePublicRoulette() {
  const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
  try {
    if (hasSupabaseConfig()) {
      await progressScheduledRoulette(requestSupabase);
      return { status: 200, payload: await loadRouletteSupabase(requestSupabase, false) };
    }
    const localPath = path.join(__dirname, "../data/dev-roulette.json");
    const local = await readLocalRoulette(localPath);
    await progressLocalRoulette(local);
    await hydrateLocalRouletteRoster(local);
    local.activeViewerCount = countLocalActiveViewers(local);
    await writeLocalRoulette(localPath, local);
    return { status: 200, payload: local };
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleRoulettePublicAction(body) {
  const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
  const action = String(body.action || "").trim();
  try {
    if (action === "heartbeat") {
      const sessionId = String(body.sessionId || "").trim().slice(0, 120);
      if (!sessionId) return { error: "세션 정보가 필요합니다." };
      if (hasSupabaseConfig()) {
        await requestSupabase("roulette_view_sessions?on_conflict=session_id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: {
            session_id: sessionId,
            page: "roulette",
            last_seen_at: new Date().toISOString(),
          },
        });
        return { ok: true, activeViewerCount: await readRouletteActiveViewerCount(requestSupabase) };
      }
      const localPath = path.join(__dirname, "../data/dev-roulette.json");
      const local = await readLocalRoulette(localPath);
      local.viewSessions = local.viewSessions || {};
      local.viewSessions[sessionId] = new Date().toISOString();
      await writeLocalRoulette(localPath, local);
      return { ok: true, activeViewerCount: countLocalActiveViewers(local) };
    }
    if (action === "search") {
      const q = String(body.query || "").trim();
      if (!q) return { error: "검색어를 입력해주세요." };
      if (hasSupabaseConfig()) {
        const results = await requestSupabase(
          `event_participants?display_name=ilike.${encodeURIComponent("%" + q + "%")}&is_active=eq.true&select=id,display_name,gender&order=display_name.asc&limit=10`
        );
        return { results: results.map((r) => ({ id: r.id, displayName: r.display_name, gender: r.gender })) };
      }
      const roster = await readRosterParticipants({ includeInactive: false });
      const lq = q.toLocaleLowerCase("ko");
      return { results: roster.filter((p) => p.displayName.toLocaleLowerCase("ko").includes(lq)).slice(0, 10) };
    }
    if (action === "join") {
      const rosterId = String(body.rosterId || "").trim();
      if (!rosterId) return { error: "참가자를 선택해주세요." };
      if (hasSupabaseConfig()) {
        const roster = await requestSupabase(`event_participants?id=eq.${encodeURIComponent(rosterId)}&is_active=eq.true&select=id,display_name,gender`);
        if (!roster.length) return { error: "참가자 명단에서 찾을 수 없습니다." };
        const person = roster[0];
        const existing = await requestSupabase(`roulette_participants?roster_participant_id=eq.${encodeURIComponent(rosterId)}&select=id,is_active`);
        if (existing.length && existing[0].is_active) return { already: true, error: "이미 룰렛에 참가 중입니다." };
        const rows = await requestSupabase("roulette_participants?on_conflict=roster_participant_id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=representation" },
          body: { roster_participant_id: person.id, display_name: person.display_name, gender: person.gender, is_active: true, updated_at: new Date().toISOString() },
        });
        return { ok: true, participant: rows[0] };
      }
      return { error: "서비스를 사용할 수 없습니다." };
    }
    return { error: "알 수 없는 액션입니다." };
  } catch (error) {
    return { error: error.message };
  }
}

async function readLocalRoulette(localPath) {
  try {
    const local = JSON.parse(await fs.readFile(localPath, "utf8"));
    return { items: local.items || [], results: local.results || [], participants: local.participants || [], roster: local.roster || [], viewSessions: local.viewSessions || {}, settings: { ...defaultRouletteSettings(), ...(local.settings || {}) } };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { items: [], results: [], participants: [], roster: [], viewSessions: {}, settings: defaultRouletteSettings() };
  }
}

function countLocalActiveViewers(local) {
  const cutoff = Date.now() - 20 * 1000;
  local.viewSessions = Object.fromEntries(
    Object.entries(local.viewSessions || {}).filter(([, value]) => new Date(value).getTime() >= cutoff),
  );
  return Object.keys(local.viewSessions).length;
}

async function writeLocalRoulette(localPath, local) {
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, JSON.stringify(local, null, 2), "utf8");
}

async function hydrateLocalRouletteRoster(local) {
  local.roster = await readRosterParticipants({ includeInactive: false });
  local.participants = (local.participants || []).filter((item) => item.is_active !== false);
}

function spinRouletteLocal(local, itemId) {
  const used = new Set((local.results || []).filter((result) => result.item_id === itemId).map((result) => result.roulette_participant_id));
  const eligible = (local.participants || []).filter((participant) => participant.is_active !== false && !used.has(participant.id));
  if (!eligible.length) {
    const error = new Error("이 항목으로 추첨 가능한 룰렛 참가자가 더 이상 없습니다.");
    error.status = 409;
    throw error;
  }
  const winner = eligible[Math.floor(Math.random() * eligible.length)];
  const result = { id: crypto.randomUUID(), item_id: itemId, roulette_participant_id: winner.id, created_at: new Date().toISOString(), participant: winner, item: (local.items || []).find((item) => item.id === itemId) };
  local.results.unshift(result);
  return { result, winner };
}

async function progressLocalRoulette(local) {
  const settings = local.settings || {};
  const itemIds = normalizeIdList(settings.selected_item_ids || settings.scheduled_item_id);
  if (settings.draw_mode !== "timer" || settings.sequence_completed_at || !itemIds.length || !settings.starts_at) return false;
  const startsAt = new Date(settings.starts_at);
  if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() > Date.now()) return false;
  if (!settings.sequence_started_at) settings.sequence_started_at = new Date().toISOString();
  const elapsed = Date.now() - new Date(settings.sequence_started_at).getTime();
  const targetCount = Math.min(itemIds.length, Math.max(1, Math.floor(elapsed / 8000) + 1));
  const completed = new Set((local.results || []).map((result) => result.item_id));
  for (const itemId of itemIds.slice(0, targetCount)) {
    if (completed.has(itemId)) continue;
    try { spinRouletteLocal(local, itemId); }
    catch (error) { if (error.status !== 409) throw error; }
  }
  const afterCompleted = new Set((local.results || []).map((result) => result.item_id));
  if (itemIds.every((itemId) => afterCompleted.has(itemId))) {
    settings.auto_spin_executed_at = new Date().toISOString();
    settings.sequence_completed_at = new Date().toISOString();
  }
  return true;
}

async function handleMatchDetail(body) {
  try {
    const { name } = body;
    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      return { status: 400, payload: { error: "이름을 입력해주세요." } };
    }

    const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");

    if (hasSupabaseConfig()) {
      const participants = await requestSupabase(
        `participant_submissions?display_name=ilike.${encodeURIComponent(trimmedName)}&select=*&limit=5`
      );
      if (participants.length === 0) {
        return { status: 404, payload: { error: "참가자를 찾을 수 없습니다. 이름을 다시 확인해주세요." } };
      }
      if (participants.length > 1) {
        return { status: 409, payload: { error: "동일한 이름이 여러 명 있습니다. 운영자에게 문의해주세요." } };
      }
      const me = participants[0];

      const matches = await requestSupabase(
        `match_results?or=(male_participant_id.eq.${me.id},female_participant_id.eq.${me.id})&order=created_at.desc&limit=1`
      );
      if (matches.length === 0) {
        return { status: 404, payload: { error: "귀하의 연분 매칭 결과가 존재하지 않습니다." } };
      }
      const match = matches[0];

      const partnerId = me.gender === "남" ? match.female_participant_id : match.male_participant_id;
      const partners = await requestSupabase(`participant_submissions?id=eq.${partnerId}&select=*`);
      if (partners.length === 0) {
        return { status: 404, payload: { error: "상대방의 데이터를 찾을 수 없습니다." } };
      }
      const partner = partners[0];

      const evals = await requestSupabase(
        `compatibility_evaluations?match_run_id=eq.${match.match_run_id}&or=(and(scorer_participant_id.eq.${me.id},target_participant_id.eq.${partnerId}),and(scorer_participant_id.eq.${partnerId},target_participant_id.eq.${me.id}))`
      );

      const myEval = evals.find(e => e.scorer_participant_id === me.id);
      const partnerEval = evals.find(e => e.scorer_participant_id === partnerId);

      const [votes, partnerVotes, runs] = await Promise.all([
        requestSupabase(`match_votes?match_result_id=eq.${match.id}&participant_id=eq.${me.id}&select=id`),
        requestSupabase(`match_votes?match_result_id=eq.${match.id}&participant_id=eq.${partnerId}&select=id`),
        requestSupabase(`match_runs?id=eq.${match.match_run_id}&select=vote_deadline_at`),
      ]);
      const hasVoted = votes.length > 0;
      const partnerHasVoted = partnerVotes.length > 0;
      const voteDeadline = runs[0]?.vote_deadline_at || null;
      const deadlinePassed = voteDeadline ? new Date(voteDeadline).getTime() < Date.now() : false;

      // Auto-X: if deadline passed, create missing votes as "no"
      if (deadlinePassed && !hasVoted) {
        try {
          await requestSupabase("match_votes", {
            method: "POST",
            headers: { Prefer: "return=minimal" },
            body: { match_result_id: match.id, participant_id: me.id, selection: "no" },
          });
        } catch (_) {}
      }
      if (deadlinePassed && !partnerHasVoted) {
        try {
          await requestSupabase("match_votes", {
            method: "POST",
            headers: { Prefer: "return=minimal" },
            body: { match_result_id: match.id, participant_id: partnerId, selection: "no" },
          });
        } catch (_) {}
      }

      return {
        status: 200,
        payload: {
          matchId: match.id,
          matchResultId: match.id,
          me: {
            id: me.id,
            displayName: me.display_name,
            gender: me.gender,
            mbti: me.mbti,
            manse: me.manse_result,
          },
          partner: {
            id: partner.id,
            displayName: partner.display_name,
            gender: partner.gender,
            mbti: partner.mbti,
            manse: partner.manse_result,
          },
          compatibility: {
            averageScore: Number(match.average_score),
            scoreDetail: match.score_detail || null,
            rank: match.rank,
            isTop: match.is_top_match,
            myPerspective: myEval ? { score: myEval.score, reason: myEval.reason, keywords: myEval.reason_keywords } : null,
            partnerPerspective: partnerEval ? { score: partnerEval.score, reason: partnerEval.reason, keywords: partnerEval.reason_keywords } : null,
          },
          hasVoted: hasVoted || deadlinePassed,
          partnerHasVoted: partnerHasVoted || deadlinePassed,
          voteDeadline,
          deadlinePassed,
        }
      };
    } else {
      // Local mode fallback
      const localResultPath = path.join(__dirname, "../data/dev-match-results.json");
      try {
        const data = await fs.readFile(localResultPath, "utf8");
        const parsed = JSON.parse(data);
        const localMatch = (parsed.matches || []).find(m =>
          (m.male?.displayName || "").toLowerCase() === trimmedName.toLowerCase() ||
          (m.female?.displayName || "").toLowerCase() === trimmedName.toLowerCase()
        );
        if (!localMatch) {
          return { status: 404, payload: { error: "매칭 결과를 찾을 수 없습니다." } };
        }
        const isMale = (localMatch.male?.displayName || "").toLowerCase() === trimmedName.toLowerCase();
        const me = isMale ? localMatch.male : localMatch.female;
        const partner = isMale ? localMatch.female : localMatch.male;

        return {
          status: 200,
          payload: {
            matchId: parsed.matchRunId,
            matchResultId: parsed.matchRunId,
            me,
            partner,
            compatibility: {
              averageScore: localMatch.score,
              rank: localMatch.rank,
              isTop: localMatch.isTop,
              myPerspective: { score: localMatch.score, reason: "로컬 궁합: 조화로운 오행의 균형이 돋보입니다.", keywords: ["오행균형"] },
              partnerPerspective: { score: localMatch.score, reason: "로컬 궁합: 상호 보완적인 강점이 발현됩니다.", keywords: ["상호보완"] },
            },
            hasVoted: false,
            partnerHasVoted: false,
            voteDeadline: null,
            deadlinePassed: false,
          }
        };
      } catch (e) {
        return { status: 500, payload: { error: "로컬 데이터 로드 에러: " + e.message } };
      }
    }
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleMatchVote(body) {
  try {
    const { matchResultId, participantId, selection } = body;
    if (!matchResultId || !participantId) {
      return { status: 400, payload: { error: "매칭 정보가 올바르지 않습니다." } };
    }
    if (!["yes", "no"].includes(selection)) {
      return { status: 400, payload: { error: "O 또는 X를 선택해주세요." } };
    }

    const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");

    if (hasSupabaseConfig()) {
      // Verify the match exists and participantId belongs to it
      const matches = await requestSupabase(
        `match_results?id=eq.${encodeURIComponent(matchResultId)}&select=id,match_run_id,male_participant_id,female_participant_id`
      );
      if (matches.length === 0) {
        return { status: 404, payload: { error: "매칭 결과를 찾을 수 없습니다." } };
      }
      const match = matches[0];
      if (match.male_participant_id !== participantId && match.female_participant_id !== participantId) {
        return { status: 403, payload: { error: "해당 매칭의 참가자가 아닙니다." } };
      }

      // Check deadline
      const runs = await requestSupabase(`match_runs?id=eq.${encodeURIComponent(match.match_run_id)}&select=vote_deadline_at`);
      const deadline = runs[0]?.vote_deadline_at;
      if (deadline && new Date(deadline).getTime() < Date.now()) {
        return { status: 403, payload: { error: "매칭 선택 기간이 종료되었습니다." } };
      }

      // Check if already voted (locked — cannot change)
      const existing = await requestSupabase(
        `match_votes?match_result_id=eq.${encodeURIComponent(matchResultId)}&participant_id=eq.${encodeURIComponent(participantId)}&select=id`
      );
      if (existing.length > 0) {
        return { status: 409, payload: { error: "이미 투표가 완료되었습니다. 변경할 수 없습니다." } };
      }

      await requestSupabase("match_votes", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: { match_result_id: matchResultId, participant_id: participantId, selection },
      });

      return { status: 200, payload: { success: true } };
    } else {
      return { status: 200, payload: { success: true, localMock: true } };
    }
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

async function handleAdminVoteDeadline(cookieHeader, method, body) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return { status: 401, payload: { error: "관리자 로그인이 필요합니다." } };
  }
  const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
  try {
    if (!hasSupabaseConfig()) {
      return { status: 200, payload: { voteDeadline: null, runId: null } };
    }
    if (method === "GET") {
      const runs = await requestSupabase("match_runs?status=eq.completed&order=created_at.desc&limit=1&select=id,vote_deadline_at");
      const run = runs[0] || null;
      return { status: 200, payload: { runId: run?.id || null, voteDeadline: run?.vote_deadline_at || null } };
    }
    if (method === "PATCH") {
      const runs = await requestSupabase("match_runs?status=eq.completed&order=created_at.desc&limit=1&select=id");
      if (!runs.length) return { status: 404, payload: { error: "완료된 매칭 실행이 없습니다." } };
      const runId = runs[0].id;
      const newDeadline = String(body.voteDeadline || "").trim();
      if (!newDeadline || isNaN(new Date(newDeadline).getTime())) {
        return { status: 400, payload: { error: "유효한 마감 시간을 입력해주세요." } };
      }
      await requestSupabase(`match_runs?id=eq.${encodeURIComponent(runId)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: { vote_deadline_at: new Date(newDeadline).toISOString() },
      });
      return { status: 200, payload: { ok: true, runId, voteDeadline: new Date(newDeadline).toISOString() } };
    }
    return { status: 405, payload: { error: "Method not allowed" } };
  } catch (error) {
    return { status: 500, payload: { error: error.message } };
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/") {
    send(res, 200, "text/html; charset=utf-8", page());
    return;
  }

  if (req.method === "GET" && url.pathname === "/upcoming") {
    send(res, 200, "text/html; charset=utf-8", upcomingEventPage());
    return;
  }

  if (req.method === "GET" && url.pathname === "/applicants") {
    send(res, 200, "text/html; charset=utf-8", applicantsPage());
    return;
  }

  if (req.method === "GET" && url.pathname === UPCOMING_IMAGE_ROUTE) {
    try {
      const image = await fs.readFile(UPCOMING_IMAGE_FILE);
      send(res, 200, "image/png", image, [], "public, max-age=86400");
    } catch {
      send(res, 404, "text/plain; charset=utf-8", "Not found");
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/admin") {
    if (!isAdminAuthenticated(req)) {
      send(res, 200, "text/html; charset=utf-8", adminLoginPage());
      return;
    }
    send(res, 200, "text/html; charset=utf-8", adminPage());
    return;
  }

  if (req.method === "GET" && url.pathname === "/match") {
    send(res, 200, "text/html; charset=utf-8", matchPage());
    return;
  }

  if (req.method === "GET" && url.pathname === "/results") {
    send(res, 200, "text/html; charset=utf-8", resultsPage());
    return;
  }

  if (req.method === "GET" && url.pathname === "/roulette") {
    send(res, 200, "text/html; charset=utf-8", roulettePage());
    return;
  }

  if (req.method === "GET" && url.pathname === "/ladder") {
    send(res, 200, "text/html; charset=utf-8", ladderPage());
    return;
  }

  if (req.method === "GET" && url.pathname === "/secret") {
    send(res, 200, "text/html; charset=utf-8", secretPage());
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/secret/submissions") {
    const body = await readJson(req);
    const result = await handleSecretSubmissions(body.pin);
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/applicants") {
    const result = await handleApplicants();
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/roster") {
    const result = await handleRoster();
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/results") {
    const result = await handlePublicResults();
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/roulette") {
    const result = await handlePublicRoulette();
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/roulette") {
    try {
      sendJson(res, 200, await handleRoulettePublicAction(await readJson(req)));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/ladder") {
    const result = await handlePublicLadder();
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ladder") {
    try {
      sendJson(res, 200, await handleLadderPublicAction(await readJson(req)));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/manse") {
    try {
      sendJson(res, 200, await handleManseApi(await readJson(req)));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/manse/start") {
    try {
      sendJson(res, 200, await handleManseStartApi(await readJson(req)));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/manse/analyze") {
    try {
      sendJson(res, 200, await handleManseAnalyzeApi(await readJson(req)));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/login") {
    try {
      const result = handleAdminLogin(await readJson(req));
      sendJson(res, result.status, result.payload, result.cookies);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/logout") {
    const result = handleAdminLogout();
    sendJson(res, result.status, result.payload, result.cookies);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/submissions") {
    const result = await handleAdminSubmissions(req.headers.cookie || "");
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/submissions/test-seed") {
    const result = await handleAdminSubmissionTestSeed(req.headers.cookie || "");
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/admin/submissions/")) {
    const id = decodeURIComponent(url.pathname.replace("/api/admin/submissions/", ""));
    const result = await handleAdminSubmissionDelete(req.headers.cookie || "", id);
    sendJson(res, result.status, result.payload);
    return;
  }

  if (url.pathname === "/api/admin/roster" || url.pathname.startsWith("/api/admin/roster/")) {
    const id = decodeURIComponent(url.pathname.replace("/api/admin/roster/", ""));
    const body = req.method === "POST" || req.method === "PATCH" ? await readJson(req) : {};
    const result = await handleAdminRoster(req.headers.cookie || "", req.method, body, id === "/api/admin/roster" ? "" : id);
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/match") {
    const result = await handleAdminMatch(req.headers.cookie || "");
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/matches") {
    const result = await handleAdminMatches(req.headers.cookie || "");
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "DELETE" && url.pathname === "/api/admin/matches") {
    const result = await handleAdminMatchesReset(req.headers.cookie || "");
    sendJson(res, result.status, result.payload);
    return;
  }

  if (url.pathname === "/api/admin/roulette" || url.pathname.startsWith("/api/admin/roulette/")) {
    const id = url.pathname === "/api/admin/roulette" ? "" : decodeURIComponent(url.pathname.replace("/api/admin/roulette/", ""));
    const body = req.method === "POST" || req.method === "PATCH" ? await readJson(req) : {};
    const result = await handleAdminRoulette(req.headers.cookie || "", req.method, body, id);
    sendJson(res, result.status, result.payload);
    return;
  }

  if (url.pathname === "/api/admin/ladder" || url.pathname.startsWith("/api/admin/ladder/")) {
    const id = url.pathname === "/api/admin/ladder" ? "" : decodeURIComponent(url.pathname.replace("/api/admin/ladder/", ""));
    const body = req.method === "POST" || req.method === "PATCH" ? await readJson(req) : {};
    const result = await handleAdminLadder(req.headers.cookie || "", req.method, body, id);
    sendJson(res, result.status, result.payload);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/match/detail") {
    try {
      const result = await handleMatchDetail(await readJson(req));
      sendJson(res, result.status, result.payload);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/match/vote") {
    try {
      const result = await handleMatchVote(await readJson(req));
      sendJson(res, result.status, result.payload);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (url.pathname === "/api/admin/vote-deadline") {
    const body = req.method === "PATCH" ? await readJson(req) : {};
    const result = await handleAdminVoteDeadline(req.headers.cookie || "", req.method, body);
    sendJson(res, result.status, result.payload);
    return;
  }

  send(res, 404, "text/plain; charset=utf-8", "Not found");
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Moras manseryeok web: http://localhost:${PORT}`);
  });
}

module.exports = {
  adminLoginPage,
  adminPage,
  applicantsPage,
  handleAdminLogin,
  handleAdminLogout,
  handleAdminSubmissions,
  handleAdminSubmissionDelete,
  handleAdminSubmissionTestSeed,
  handleApplicants,
  handleApplicantDetail,
  handleRosterRequest,
  handleRoster,
  handleAdminRoster,
  handleAdminMatch,
  handleAdminMatches,
  handleAdminMatchesReset,
  handleAdminRoulette,
  handleAdminLadder,
  handlePublicResults,
  handlePublicRoulette,
  handlePublicLadder,
  handleRoulettePublicAction,
  handleLadderPublicAction,
  handleMatchDetail,
  handleMatchVote,
  handleManseApi,
  handleManseStartApi,
  handleManseAnalyzeApi,
  handleAdminVoteDeadline,
  handleSecretSubmissions,
  isAdminAuthenticated,
  page,
  matchPage,
  resultsPage,
  roulettePage,
  ladderPage,
  secretPage,
  upcomingEventPage,
};
