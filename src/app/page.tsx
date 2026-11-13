import LandingClient from "@/components/LandingClient";
import { getSettings, listSubjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, subjects] = await Promise.all([
    getSettings(),
    listSubjects(true),
  ]);

  return <LandingClient settings={settings} subjects={subjects} />;
}
