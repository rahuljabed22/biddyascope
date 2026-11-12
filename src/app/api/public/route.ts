import { NextResponse } from "next/server";
import { getSettings, listSubjects, listTutors } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [settings, subjects, tutors] = await Promise.all([
      getSettings(),
      listSubjects(true),
      listTutors(true),
    ]);
    return NextResponse.json({ settings, subjects, tutors });
  } catch (err) {
    console.error("Public data error:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
