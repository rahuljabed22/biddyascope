import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/db";
import { extractRequestMeta } from "@/lib/request-info";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPath = typeof body?.path === "string" ? body.path.slice(0, 200) : "/";
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : "";

    // Do not inflate public analytics when viewing admin pages
    if (rawPath.startsWith("/admin")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const meta = extractRequestMeta(req);
    await recordPageView({
      ipAddress: meta.ipAddress,
      country: meta.country,
      city: meta.city,
      region: meta.region,
      path: rawPath,
      referrer,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
      browser: meta.browser,
      os: meta.os,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
