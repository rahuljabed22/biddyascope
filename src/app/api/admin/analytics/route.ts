import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { clearPageViews } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await clearPageViews();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Clear analytics error:", err);
    return NextResponse.json({ error: "Failed to clear analytics" }, { status: 500 });
  }
}
