import AdminDashboardClient from "@/components/AdminDashboardClient";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  return <AdminDashboardClient initialAuthenticated={authed} />;
}
