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

    if (request.method === "GET" && url.pathname === "/roulette") {
      return html(roulettePage());
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true });
    }

    if (request.method === "GET" && url.pathname === "/api/applicants") {
      const result = await handleApplicants();
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

    if (request.method === "POST" && url.pathname === "/api/manse") {
      return json(await handleManseApi(await request.json()));
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

    if (request.method === "POST" && url.pathname === "/api/match/detail") {
      const result = await handleMatchDetail(await request.json());
      return json(result.payload, result.status);
    }

    if (request.method === "POST" && url.pathname === "/api/match/vote") {
      const result = await handleMatchVote(await request.json());
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
    "/roulette",
    "/health",
    "/api/applicants",
    "/api/roster",
    "/api/results",
    "/api/roulette",
    "/api/roulette/join",
    "/api/manse",
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
    "/api/match/detail",
    "/api/match/vote"
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
