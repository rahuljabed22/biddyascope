import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createTutor, listTutors } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tutors = await listTutors(false);
  return NextResponse.json({ tutors });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const institution = String(body?.institution || "KUET").trim();
    const yearOfStudy = String(body?.yearOfStudy || "3rd Year").trim();
    if (!name) {
      return NextResponse.json({ error: "Tutor name is required" }, { status: 400 });
    }
    const subjects = Array.isArray(body?.subjects)
      ? body.subjects.map((s: unknown) => String(s).trim()).filter(Boolean)
      : String(body?.subjects || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const tutor = await createTutor({
      name,
      institution,
      yearOfStudy,
      department: String(body?.department || "").trim(),
      subjects,
      experienceYears: Math.max(1, Number(body?.experienceYears ?? 3)),
      tagline: String(body?.tagline || "").trim(),
      taglineBn: String(body?.taglineBn || "").trim(),
      active: body?.active !== false,
      sortOrder: Number(body?.sortOrder ?? 99),
    });
    return NextResponse.json({ tutor }, { status: 201 });
  } catch (err) {
    console.error("Create tutor error:", err);
    return NextResponse.json({ error: "Failed to create tutor" }, { status: 500 });
  }
}
