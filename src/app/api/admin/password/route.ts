import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  hashPassword,
  isAdminAuthenticated,
  SESSION_COOKIE_NAME,
  verifyAdminPassword,
} from "@/lib/auth";
import { setAdminPasswordHash } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (!(await verifyAdminPassword(currentPassword))) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const hashed = hashPassword(newPassword);
    await setAdminPasswordHash(hashed);

    const token = createSessionToken();
    const isHttps =
      req.headers.get("x-forwarded-proto") === "https" ||
      req.nextUrl.protocol === "https:";
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 500 }
    );
  }
}
