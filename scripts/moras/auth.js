/**
 * Admin authentication helpers for Moras.
 *
 * Responsibilities:
 * - Validate admin credentials from env-backed settings.
 * - Create and verify the admin session cookie.
 * - Keep UI, storage, and route handling out of this file.
 */

const crypto = require("node:crypto");

const ADMIN_ID = process.env.MORAS_ADMIN_ID || "admin";
const ADMIN_PASSWORD = process.env.MORAS_ADMIN_PASSWORD || "admin";
const ADMIN_COOKIE = "moras_admin_session";
const ADMIN_SECRET = process.env.MORAS_ADMIN_SECRET || "moras-dev-admin-secret";

function createAdminToken(adminId) {
  const payload = Buffer.from(
    JSON.stringify({ adminId, expiresAt: Date.now() + 12 * 60 * 60 * 1000 }),
    "utf8",
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function isAdminAuthenticated(req) {
  const token = parseCookies(req.headers.cookie || "")[ADMIN_COOKIE];
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return parsed.adminId === ADMIN_ID && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function parseCookies(cookieHeader) {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), part.slice(index + 1)];
      }),
  );
}

function handleAdminLogin(body) {
  if (body.adminId !== ADMIN_ID || body.adminPassword !== ADMIN_PASSWORD) {
    return {
      status: 401,
      payload: { error: "아이디 또는 패스워드가 맞지 않습니다." },
      cookies: [],
    };
  }
  return {
    status: 200,
    payload: { ok: true },
    cookies: [`${ADMIN_COOKIE}=${createAdminToken(body.adminId)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200`],
  };
}

function handleAdminLogout() {
  return {
    status: 200,
    payload: { ok: true },
    cookies: [`${ADMIN_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`],
  };
}

module.exports = { handleAdminLogin, handleAdminLogout, isAdminAuthenticated };
