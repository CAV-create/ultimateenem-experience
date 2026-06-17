import http from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { buildDailyNewsBrief } from "../lib/dailyNews.mjs";

loadLocalEnv();

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || `localhost:${port}`}`);

  if (request.method === "OPTIONS") {
    send(response, 204, "");
    return;
  }

  if (request.method !== "GET" || url.pathname !== "/api/noticias/diarias") {
    send(response, 404, {
      ok: false,
      error: "Endpoint não encontrado.",
      endpoint: "/api/noticias/diarias",
    });
    return;
  }

  const force = url.searchParams.get("force") === "1";
  if (force) {
    const expected = process.env.CRON_SECRET;
    const received = request.headers.authorization;
    if (!expected || received !== `Bearer ${expected}`) {
      send(response, 401, { ok: false, error: "Unauthorized" });
      return;
    }
  }

  try {
    const brief = await buildDailyNewsBrief({ force });
    send(response, 200, { ok: true, ...brief }, force ? "no-store" : "no-store");
  } catch (error) {
    console.error("[ultimateenem-local-news]", error);
    send(response, 500, {
      ok: false,
      error: "Falha ao gerar o plantão de atualidades ENEM.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

server.listen(port, host, () => {
  console.log(`ultimateENEM Atualidades API: http://localhost:${port}/api/noticias/diarias`);
});

function send(response, status, data, cacheControl = "no-store") {
  const body = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  response.writeHead(status, {
    ...CORS_HEADERS,
    "Content-Type": typeof data === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "Cache-Control": cacheControl,
  });
  response.end(body);
}

function loadLocalEnv() {
  for (const name of [".env.local", ".env"]) {
    const file = resolve(process.cwd(), name);
    if (!existsSync(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const clean = line.trim();
      if (!clean || clean.startsWith("#") || !clean.includes("=")) continue;
      const index = clean.indexOf("=");
      const key = clean.slice(0, index).trim();
      const value = clean.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  }
}
