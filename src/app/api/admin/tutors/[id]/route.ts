import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteTutor, updateTutor } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    const body = await req.json();
    if (typeof body?.subjects === "string") {
      body.subjects = body.subjects
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    const updated = await updateTutor(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }
    return NextResponse.json({ tutor: updated });
  } catch (err) {
    console.error("Update tutor error:", err);
    return NextResponse.json({ error: "Failed to update tutor" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    const deleted = await deleteTutor(id);
    if (!deleted) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete tutor error:", err);
    return NextResponse.json({ error: "Failed to delete tutor" }, { status: 500 });
  }
}
