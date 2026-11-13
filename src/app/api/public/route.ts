import { NextResponse } from "next/server";
import { getSettings, listSubjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [settings, subjects] = await Promise.all([
      getSettings(),
      listSubjects(true),
    ]);
    return NextResponse.json({ settings, subjects });
  } catch (err) {
    console.error("Public data error:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
