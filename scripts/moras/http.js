/**
 * HTTP request/response helpers for Moras local and Netlify handlers.
 *
 * Responsibilities:
 * - Parse JSON request bodies.
 * - Send text/JSON responses with cache and cookie headers.
 * - Keep this file framework-agnostic; do not add business logic here.
 */

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload, cookies = []) {
  send(res, status, "application/json; charset=utf-8", JSON.stringify(payload), cookies);
}

function send(res, status, contentType, body, cookies = [], cacheControl = "no-store") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
    ...(cookies.length ? { "Set-Cookie": cookies } : {}),
  });
  res.end(body);
}

module.exports = { readJson, sendJson, send };
