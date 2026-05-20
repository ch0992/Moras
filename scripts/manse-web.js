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
const { URL } = require("node:url");
const { handleAdminLogin, handleAdminLogout, isAdminAuthenticated } = require("./moras/auth");
const { handleManseApi } = require("./moras/manse-service");
const { readSubmissions } = require("./moras/storage");
const { readJson, send, sendJson } = require("./moras/http");
const { adminLoginPage, adminPage } = require("./moras/pages/admin-page");
const { page } = require("./moras/pages/participant-page");
const { upcomingEventPage, UPCOMING_IMAGE_ROUTE } = require("./moras/pages/upcoming-page");

const PORT = Number(process.env.PORT || 4173);
const UPCOMING_IMAGE_FILE = path.join(
  __dirname,
  "..",
  "assets",
  "marketing",
  "upcoming-event",
  "moras-upcoming-event-mbti-saju-v1.png",
);

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

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, { ok: true });
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
    if (!isAdminAuthenticated({ headers: { cookie: req.headers.cookie || "" } })) {
      sendJson(res, 401, { error: "관리자 로그인이 필요합니다." });
      return;
    }
    try {
      sendJson(res, 200, { submissions: await readSubmissions() });
    } catch (error) {
      sendJson(res, 500, { error: error.message });
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

async function handleAdminSubmissions(cookieHeader) {
  if (!isAdminAuthenticated({ headers: { cookie: cookieHeader || "" } })) {
    return {
      status: 401,
      payload: { error: "관리자 로그인이 필요합니다." },
    };
  }
  return {
    status: 200,
    payload: { submissions: await readSubmissions() },
  };
}

module.exports = {
  adminLoginPage,
  adminPage,
  handleAdminLogin,
  handleAdminLogout,
  handleAdminSubmissions,
  handleManseApi,
  isAdminAuthenticated,
  page,
  upcomingEventPage,
};
