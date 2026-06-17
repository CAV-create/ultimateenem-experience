import { buildDailyNewsBrief } from "../../../../lib/dailyNews.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: {
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";

  if (force) {
    const expected = process.env.CRON_SECRET;
    const received = request.headers.get("authorization");

    if (!expected || received !== `Bearer ${expected}`) {
      return json({ ok: false, error: "Unauthorized" }, 401);
    }
  }

  try {
    const brief = await buildDailyNewsBrief({ force });
    return json(
      { ok: true, ...brief },
      200,
      {
        "Cache-Control": force
          ? "no-store"
          : "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    );
  } catch (error) {
    console.error("[ultimateenem-daily-news]", error);
    return json(
      {
        ok: false,
        error: "Falha ao gerar o plantão de atualidades ENEM.",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
      { "Cache-Control": "no-store" },
    );
  }
}
