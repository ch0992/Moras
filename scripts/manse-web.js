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
const { handleManseApi } = require("./moras/manse-service");
const {
  deleteAllSubmissions,
  deleteRosterParticipant,
  deleteSubmission,
  readRosterParticipants,
  readSubmissions,
  saveRosterParticipant,
} = require("./moras/storage");
const { readJson, send, sendJson } = require("./moras/http");
const { adminLoginPage, adminPage } = require("./moras/pages/admin-page");
const { applicantsPage } = require("./moras/pages/applicants-page");
const { page } = require("./moras/pages/participant-page");
const { upcomingEventPage, UPCOMING_IMAGE_ROUTE } = require("./moras/pages/upcoming-page");
const { matchPage } = require("./moras/pages/match-page");
const { resultsPage } = require("./moras/pages/results-page");
const { roulettePage } = require("./moras/pages/roulette-page");

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
      const runs = await requestSupabase("match_runs?status=eq.completed&order=created_at.desc&limit=1");
      if (runs.length === 0) {
        return { status: 200, payload: { matches: [], runId: null } };
      }
      const runId = runs[0].id;
      const matches = await requestSupabase(
        `match_results?match_run_id=eq.${runId}&select=id,rank,is_top_match,average_score,score_detail,male:male_participant_id(id,display_name,gender,mbti,manse_result),female:female_participant_id(id,display_name,gender,mbti,manse_result)&order=rank.asc`
      );
      return {
        status: 200,
        payload: {
          runId,
          matches: matches.map((match) => ({
            id: match.id,
            rank: match.rank,
            is_top_match: match.is_top_match,
            average_score: match.average_score,
            score_detail: match.score_detail,
            male: matchPerson(match.male),
            female: matchPerson(match.female),
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
    const { passcode } = body;
    if (!passcode || passcode.length !== 6) {
      return { status: 400, payload: { error: "올바른 6자리 비밀번호 코드를 입력해주세요." } };
    }

    const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
    const crypto = require("node:crypto");
    const hash = crypto.createHash("sha256").update(passcode).digest("hex");

    if (hasSupabaseConfig()) {
      const participants = await requestSupabase(`participant_submissions?vote_code_hash=eq.${hash}&select=*`);
      if (participants.length === 0) {
        return { status: 404, payload: { error: "해당 코드를 가진 참가자를 찾을 수 없습니다." } };
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

      const votes = await requestSupabase(`match_votes?match_result_id=eq.${match.id}&participant_id=eq.${me.id}&select=*`);
      const hasVoted = votes.length > 0;
      const myVote = hasVoted ? votes[0].selection : null;

      return {
        status: 200,
        payload: {
          matchId: match.id,
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
          hasVoted,
          myVote,
        }
      };
    } else {
      // Local mode fallback
      const localResultPath = path.join(__dirname, "../data/dev-match-results.json");
      try {
        const data = await fs.readFile(localResultPath, "utf8");
        const parsed = JSON.parse(data);
        let passcodes = [];
        try {
          const passcodePath = path.join(__dirname, "../data/operator-passcodes.json");
          const pcData = await fs.readFile(passcodePath, "utf8");
          passcodes = JSON.parse(pcData);
        } catch (e) {}

        const matchCode = passcodes.find(p => p.passcode === passcode);
        if (!matchCode) {
          return { status: 404, payload: { error: "일치하는 로컬 매칭 코드가 없습니다." } };
        }

        const myId = matchCode.participantId;
        const match = parsed.matches.find(m => m.male.id === myId || m.female.id === myId);
        if (!match) {
          return { status: 404, payload: { error: "매칭 결과를 찾을 수 없습니다." } };
        }

        const isMale = match.male.id === myId;
        const me = isMale ? match.male : match.female;
        const partner = isMale ? match.female : match.male;

        return {
          status: 200,
          payload: {
            matchId: parsed.matchRunId,
            me,
            partner,
            compatibility: {
              averageScore: match.score,
              rank: match.rank,
              isTop: match.isTop,
              myPerspective: { score: match.score, reason: "로컬 궁합: 조화로운 오행의 균형이 돋보입니다.", keywords: ["오행균형"] },
              partnerPerspective: { score: match.score, reason: "로컬 궁합: 상호 보완적인 강점이 발현됩니다.", keywords: ["상호보완"] },
            },
            hasVoted: false,
            myVote: null,
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
    const { passcode, selection } = body;
    if (!passcode || passcode.length !== 6) {
      return { status: 400, payload: { error: "올바른 6자리 비밀번호 코드를 입력해주세요." } };
    }
    if (!["yes", "no"].includes(selection)) {
      return { status: 400, payload: { error: "투표 선택 항목이 유효하지 않습니다." } };
    }

    const { requestSupabase, hasSupabaseConfig } = require("./moras/match-service");
    const crypto = require("node:crypto");
    const hash = crypto.createHash("sha256").update(passcode).digest("hex");

    if (hasSupabaseConfig()) {
      const participants = await requestSupabase(`participant_submissions?vote_code_hash=eq.${hash}&select=*`);
      if (participants.length === 0) {
        return { status: 404, payload: { error: "유효하지 않은 패스코드입니다." } };
      }
      const me = participants[0];

      const matches = await requestSupabase(
        `match_results?or=(male_participant_id.eq.${me.id},female_participant_id.eq.${me.id})&order=created_at.desc&limit=1`
      );
      if (matches.length === 0) {
        return { status: 404, payload: { error: "귀하의 인연 매칭 결과를 찾을 수 없습니다." } };
      }
      const match = matches[0];

      const existingVotes = await requestSupabase(
        `match_votes?match_result_id=eq.${match.id}&participant_id=eq.${me.id}&select=*`
      );

      if (existingVotes.length > 0) {
        await requestSupabase(`match_votes?id=eq.${existingVotes[0].id}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: {
            selection,
            revealed_at: null,
          },
        });
      } else {
        await requestSupabase("match_votes", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: {
            match_result_id: match.id,
            participant_id: me.id,
            selection,
            vote_code_hash: hash,
          },
        });
      }

      return { status: 200, payload: { success: true, selection } };
    } else {
      return { status: 200, payload: { success: true, localMock: true, selection } };
    }
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

  if (req.method === "POST" && url.pathname === "/api/manse") {
    try {
      sendJson(res, 200, await handleManseApi(await readJson(req)));
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
  handleRoster,
  handleAdminRoster,
  handleAdminMatch,
  handleAdminMatches,
  handleAdminMatchesReset,
  handleAdminRoulette,
  handlePublicResults,
  handlePublicRoulette,
  handleRoulettePublicAction,
  handleMatchDetail,
  handleMatchVote,
  handleManseApi,
  isAdminAuthenticated,
  page,
  matchPage,
  resultsPage,
  roulettePage,
  upcomingEventPage,
};
