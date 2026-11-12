import LandingClient from "@/components/LandingClient";
import { getSettings, listSubjects, listTutors } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, subjects, tutors] = await Promise.all([
    getSettings(),
    listSubjects(true),
    listTutors(true),
  ]);

  return <LandingClient settings={settings} subjects={subjects} tutors={tutors} />;
}
