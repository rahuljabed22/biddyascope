import { NextRequest, NextResponse } from "next/server";
import { createApplication, listSubjects } from "@/lib/db";
import { extractRequestMeta } from "@/lib/request-info";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentName = String(body?.studentName || "").trim();
    const phone = String(body?.phone || "").trim();
    const guardianPhone = String(body?.guardianPhone || "").trim();
    const college = String(body?.college || "").trim();
    const hscBatch = String(body?.hscBatch || "").trim();
    const subjectId = String(body?.subjectId || "").trim();
    const area = String(body?.area || "").trim();
    const fullAddress = String(body?.fullAddress || "").trim();
    const daysPerWeek = Math.min(7, Math.max(1, Number(body?.daysPerWeek || 3)));
    const preferredTime = String(body?.preferredTime || "").trim();
    const tutorGenderPref = String(body?.tutorGenderPref || "Any").trim();
    const notes = String(body?.notes || "").trim();

    if (!studentName || studentName.length < 2) {
      return NextResponse.json({ error: "Student name is required." }, { status: 400 });
    }
    if (!phone || phone.length < 7) {
      return NextResponse.json({ error: "Valid phone number is required." }, { status: 400 });
    }
    if (!subjectId) {
      return NextResponse.json({ error: "Please select a subject." }, { status: 400 });
    }
    if (!area) {
      return NextResponse.json({ error: "Please specify your area/location." }, { status: 400 });
    }

    const activeSubjects = await listSubjects(true);
    const chosenSubject = activeSubjects.find((s) => s.id === subjectId);
    if (!chosenSubject) {
      return NextResponse.json(
        { error: "Selected subject is currently unavailable." },
        { status: 400 }
      );
    }

    const meta = extractRequestMeta(req);
    const application = await createApplication({
      studentName,
      phone,
      guardianPhone,
      college,
      hscBatch: hscBatch || "HSC 1st Year",
      subjectId: chosenSubject.id,
      subjectName: chosenSubject.name,
      area,
      fullAddress,
      daysPerWeek,
      preferredTime: preferredTime || "Afternoon / Evening",
      tutorGenderPref,
      notes,
      ipAddress: meta.ipAddress,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("Create application error:", err);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
