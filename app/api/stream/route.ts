import { NextRequest, NextResponse } from "next/server";
import { resolveStreamUrl } from "@/lib/stream";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title")?.trim();
  const episodeParam = searchParams.get("episode");
  const episode = episodeParam ? Number(episodeParam) : NaN;

  if (!title) {
    return NextResponse.json(
      { error: "Missing required query parameter: title" },
      { status: 400 }
    );
  }

  if (!Number.isFinite(episode) || episode < 1) {
    return NextResponse.json(
      { error: "Missing or invalid query parameter: episode" },
      { status: 400 }
    );
  }

  const result = await resolveStreamUrl(title, episode);

  if (result.url) {
    return NextResponse.json({ url: result.url });
  }

  const status = result.error?.includes("not configured") ? 503 : 404;
  return NextResponse.json({ error: result.error ?? "Stream not found" }, {
    status,
  });
}
