import { NextResponse } from "next/server";
import { isAdminAuthenticated, isUsingDefaultPassword } from "@/lib/auth";
import {
  getAnalytics,
  getSettings,
  getStorageMode,
  listApplications,
  listSubjects,
  listTutors,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [settings, subjects, tutors, applications, analytics] = await Promise.all([
      getSettings(),
      listSubjects(false),
      listTutors(false),
      listApplications(),
      getAnalytics(),
    ]);

    return NextResponse.json({
      storageMode: getStorageMode(),
      usingDefaultPassword: isUsingDefaultPassword(),
      settings,
      subjects,
      tutors,
      applications,
      analytics,
    });
  } catch (err) {
    console.error("Admin overview error:", err);
    return NextResponse.json({ error: "Failed to load admin overview" }, { status: 500 });
  }
}
