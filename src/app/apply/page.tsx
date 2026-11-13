import ApplyLandingClient from "@/components/ApplyLandingClient";
import { getSettings, listSubjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  const [settings, subjects] = await Promise.all([
    getSettings(),
    listSubjects(true),
  ]);

  return <ApplyLandingClient settings={settings} subjects={subjects} />;
}
