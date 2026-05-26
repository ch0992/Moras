import manseWeb from "../../scripts/manse-web.js";

const {
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
  handleAdminGachapon,
  handlePublicResults,
  handlePublicRoulette,
  handlePublicLadder,
  handlePublicGachapon,
  handleRoulettePublicAction,
  handleLadderPublicAction,
  handleGachaponPublicAction,
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
  gachaponPage,
  secretPage,
  upcomingEventPage,
  promoPage,
  guidePage,
  handleGetPrizeWins,
  handleMarkPrizeWinUsed,
  prizeResultsPage,
} = manseWeb;

export default async (request) => {
  const url = new URL(request.url);

  try {
    if (request.method === "GET" && url.pathname === "/") {
      return html(page());
    }

    if (request.method === "GET" && url.pathname === "/upcoming") {
      return html(upcomingEventPage());
    }

    if (request.method === "GET" && url.pathname === "/applicants") {
      return html(applicantsPage());
    }

    if (request.method === "GET" && url.pathname === "/admin") {
      return html(isAdminAuthenticated({ headers: { cookie: request.headers.get("cookie") || "" } }) ? adminPage() : adminLoginPage());
    }

    if (request.method === "GET" && url.pathname === "/match") {
      return html(matchPage());
    }

    if (request.method === "GET" && url.pathname === "/results") {
      return html(resultsPage());
    }

    if (request.method === "GET" && url.pathname === "/promo") {
      return html(promoPage());
    }

    if (request.method === "GET" && url.pathname === "/guide") {
      return html(guidePage());
    }

    if (request.method === "GET" && url.pathname === "/roulette") {
      return html(roulettePage());
    }

    if (request.method === "GET" && url.pathname === "/ladder") {
      return html(ladderPage());
    }

    if (request.method === "GET" && url.pathname === "/gachapon") {
      return html(gachaponPage());
    }

    if (request.method === "GET" && url.pathname === "/prize-results") {
      return html(prizeResultsPage());
    }

    if (request.method === "GET" && url.pathname === "/secret") {
      return html(secretPage());
    }

    if (request.method === "POST" && url.pathname === "/api/secret/submissions") {
      const body = await request.json();
      const result = await handleSecretSubmissions(body.pin);
      return json(result.payload, result.status);
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true });
    }

    if (request.method === "GET" && url.pathname === "/api/applicants") {
      const result = await handleApplicants();
      return json(result.payload, result.status);
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/applicants/")) {
      const id = decodeURIComponent(url.pathname.replace("/api/applicants/", ""));
      const result = await handleApplicantDetail(id);
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/roster/request") {
      const result = await handleRosterRequest(await request.json());
      return json(result.payload, result.status);
    }

    if (request.method === "GET" && url.pathname === "/api/roster") {
      const result = await handleRoster();
      return json(result.payload, result.status);
    }

    if (request.method === "GET" && url.pathname === "/api/results") {
      const result = await handlePublicResults();
      return json(result.payload, result.status);
    }

    if (request.method === "GET" && url.pathname === "/api/roulette") {
      const result = await handlePublicRoulette();
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/roulette") {
      return json(await handleRoulettePublicAction(await request.json()));
    }

    if (request.method === "GET" && url.pathname === "/api/ladder") {
      const result = await handlePublicLadder();
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/ladder") {
      return json(await handleLadderPublicAction(await request.json()));
    }

    if (request.method === "GET" && url.pathname === "/api/gachapon") {
      const result = await handlePublicGachapon();
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/gachapon") {
      return json(await handleGachaponPublicAction(await request.json()));
    }

    if (request.method === "GET" && url.pathname === "/api/prize-wins") {
      const queryParams = Object.fromEntries(url.searchParams.entries());
      const result = await handleGetPrizeWins(queryParams);
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/prize-wins/use") {
      const body = await request.json();
      const result = await handleMarkPrizeWinUsed(body);
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/manse") {
      return json(await handleManseApi(await request.json()));
    }

    if (request.method === "POST" && url.pathname === "/api/manse/start") {
      return json(await handleManseStartApi(await request.json()));
    }

    if (request.method === "POST" && url.pathname === "/api/manse/analyze") {
      return json(await handleManseAnalyzeApi(await request.json()));
    }

    if (request.method === "POST" && url.pathname === "/api/admin/login") {
      const result = handleAdminLogin(await request.json());
      return json(result.payload, result.status, result.cookies);
    }

    if (request.method === "POST" && url.pathname === "/api/admin/logout") {
      const result = handleAdminLogout();
      return json(result.payload, result.status, result.cookies);
    }

    if (request.method === "GET" && url.pathname === "/api/admin/submissions") {
      const result = await handleAdminSubmissions(request.headers.get("cookie") || "");
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/admin/submissions/test-seed") {
      const result = await handleAdminSubmissionTestSeed(request.headers.get("cookie") || "");
      return json(result.payload, result.status);
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/admin/submissions/")) {
      const id = decodeURIComponent(url.pathname.replace("/api/admin/submissions/", ""));
      const result = await handleAdminSubmissionDelete(request.headers.get("cookie") || "", id);
      return json(result.payload, result.status);
    }

    if (url.pathname === "/api/admin/roster" || url.pathname.startsWith("/api/admin/roster/")) {
      const id = url.pathname === "/api/admin/roster" ? "" : decodeURIComponent(url.pathname.replace("/api/admin/roster/", ""));
      const body = request.method === "POST" || request.method === "PATCH" ? await request.json() : {};
      const result = await handleAdminRoster(request.headers.get("cookie") || "", request.method, body, id);
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/admin/match") {
      const result = await handleAdminMatch(request.headers.get("cookie") || "");
      return json(result.payload, result.status);
    }

    if (request.method === "GET" && url.pathname === "/api/admin/matches") {
      const result = await handleAdminMatches(request.headers.get("cookie") || "");
      return json(result.payload, result.status);
    }

    if (request.method === "DELETE" && url.pathname === "/api/admin/matches") {
      const result = await handleAdminMatchesReset(request.headers.get("cookie") || "");
      return json(result.payload, result.status);
    }

    if (url.pathname === "/api/admin/roulette" || url.pathname.startsWith("/api/admin/roulette/")) {
      const id = url.pathname === "/api/admin/roulette" ? "" : decodeURIComponent(url.pathname.replace("/api/admin/roulette/", ""));
      const body = request.method === "POST" || request.method === "PATCH" ? await request.json() : {};
      const result = await handleAdminRoulette(request.headers.get("cookie") || "", request.method, body, id);
      return json(result.payload, result.status);
    }

    if (url.pathname === "/api/admin/ladder" || url.pathname.startsWith("/api/admin/ladder/")) {
      const id = url.pathname === "/api/admin/ladder" ? "" : decodeURIComponent(url.pathname.replace("/api/admin/ladder/", ""));
      const body = request.method === "POST" || request.method === "PATCH" ? await request.json() : {};
      const result = await handleAdminLadder(request.headers.get("cookie") || "", request.method, body, id);
      return json(result.payload, result.status);
    }

    if (url.pathname === "/api/admin/gachapon" || url.pathname.startsWith("/api/admin/gachapon/")) {
      const id = url.pathname === "/api/admin/gachapon" ? "" : decodeURIComponent(url.pathname.replace("/api/admin/gachapon/", ""));
      const body = request.method === "POST" || request.method === "PATCH" ? await request.json() : {};
      const result = await handleAdminGachapon(request.headers.cookie || request.headers.get("cookie") || "", request.method, body, id);
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/match/detail") {
      const result = await handleMatchDetail(await request.json());
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/match/vote") {
      const result = await handleMatchVote(await request.json());
      return json(result.payload, result.status);
    }

    if (url.pathname === "/api/admin/vote-deadline") {
      const body = request.method === "PATCH" ? await request.json() : {};
      const result = await handleAdminVoteDeadline(request.headers.get("cookie") || "", request.method, body);
      return json(result.payload, result.status);
    }

    return new Response("Not found", { status: 404 });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
};

export const config = {
  path: [
    "/",
    "/upcoming",
    "/applicants",
    "/admin",
    "/match",
    "/results",
    "/promo",
    "/guide",
    "/roulette",
    "/ladder",
    "/gachapon",
    "/prize-results",
    "/health",
    "/api/applicants",
    "/api/applicants/*",
    "/api/roster/request",
    "/api/roster",
    "/api/results",
    "/api/roulette",
    "/api/roulette/join",
    "/api/ladder",
    "/api/gachapon",
    "/api/prize-wins",
    "/api/prize-wins/use",
    "/api/admin/gachapon",
    "/api/admin/gachapon/*",
    "/api/manse",
    "/api/manse/start",
    "/api/manse/analyze",
    "/api/admin/login",
    "/api/admin/logout",
    "/api/admin/submissions",
    "/api/admin/submissions/test-seed",
    "/api/admin/submissions/*",
    "/api/admin/roster",
    "/api/admin/roster/*",
    "/api/admin/match",
    "/api/admin/matches",
    "/api/admin/roulette",
    "/api/admin/roulette/*",
    "/api/admin/ladder",
    "/api/admin/ladder/*",
    "/api/match/detail",
    "/api/match/vote",
    "/api/admin/vote-deadline",
    "/secret",
    "/api/secret/submissions"
  ],
};

function html(body) {
  return new Response(body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function json(payload, status = 200, cookies = []) {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  for (const cookie of cookies || []) {
    headers.append("Set-Cookie", cookie);
  }
  return new Response(JSON.stringify(payload), { status, headers });
}
