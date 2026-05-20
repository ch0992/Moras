import manseWeb from "../../scripts/manse-web.js";

const {
  adminLoginPage,
  adminPage,
  handleAdminLogin,
  handleAdminLogout,
  handleAdminSubmissions,
  handleManseApi,
  isAdminAuthenticated,
  page,
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

    if (request.method === "GET" && url.pathname === "/admin") {
      return html(isAdminAuthenticated({ headers: { cookie: request.headers.get("cookie") || "" } }) ? adminPage() : adminLoginPage());
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true });
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

    return new Response("Not found", { status: 404 });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
};

export const config = {
  path: ["/", "/upcoming", "/admin", "/health", "/api/manse", "/api/admin/login", "/api/admin/logout", "/api/admin/submissions"],
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
