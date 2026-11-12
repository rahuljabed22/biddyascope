import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createSubject, listSubjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const subjects = await listSubjects(false);
  return NextResponse.json({ subjects });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }
    const subject = await createSubject({
      name,
      nameBn: String(body?.nameBn || name).trim(),
      level: String(body?.level || "HSC Science").trim(),
      description: String(body?.description || "").trim(),
      descriptionBn: String(body?.descriptionBn || "").trim(),
      active: body?.active !== false,
      sortOrder: Number(body?.sortOrder ?? 99),
    });
    return NextResponse.json({ subject }, { status: 201 });
  } catch (err) {
    console.error("Create subject error:", err);
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}
