"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  Database,
  Edit3,
  Eye,
  FileText,
  Globe,
  GraduationCap,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import type {
  AnalyticsSummary,
  ApplicationStatus,
  SiteSettings,
  Subject,
  Tutor,
  TutorApplication,
} from "@/lib/types";
import type { StorageMode } from "@/lib/db";

interface OverviewResponse {
  storageMode: StorageMode;
  usingDefaultPassword: boolean;
  settings: SiteSettings;
  subjects: Subject[];
  tutors: Tutor[];
  applications: TutorApplication[];
  analytics: AnalyticsSummary;
}

type TabKey = "analytics" | "applications" | "subjects" | "tutors" | "settings";

export default function AdminDashboardClient({
  initialAuthenticated,
}: {
  initialAuthenticated: boolean;
}) {
  const [authed, setAuthed] = useState(initialAuthenticated);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("analytics");
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }, []);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (res.ok) {
        const json = (await res.json()) as OverviewResponse;
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      loadOverview();
    }
  }, [authed, loadOverview]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError("Incorrect admin password.");
        return;
      }
      setPassword("");
      setAuthed(true);
    } catch {
      setLoginError("Login request failed.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setData(null);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0B162C] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-7 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0B162C] text-amber-300 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#0B162C]">
                BiddyaScope Admin
              </h1>
              <p className="text-xs text-[#0B162C]/60">
                Analytics, IP Logs, Applications & CMS
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0B162C] mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-[#0B162C]/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {loginError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-[#0F766E] text-white font-bold text-sm hover:bg-[#0D5E58] transition-colors cursor-pointer"
            >
              {loginLoading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="pt-2 border-t border-[#0B162C]/10 flex items-center justify-between text-xs text-[#0B162C]/60">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-[#0B162C] font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Website
            </Link>
            <span>Set `ADMIN_PASSWORD` in env</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#0B162C]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B162C] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-teal-400/40">
          <Check className="w-4 h-4 text-teal-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-[#0B162C] text-white border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600/20 border border-teal-400/30 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-base block leading-none">
                BiddyaScope Control Center
              </span>
              <span className="text-[11px] text-white/60">
                Full Backend, IP Analytics & CMS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {data && (
              <span
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  data.storageMode === "postgres"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : data.storageMode === "file"
                    ? "bg-sky-500/20 text-sky-200 border border-sky-400/30"
                    : "bg-amber-500/20 text-amber-200 border border-amber-400/30"
                }`}
              >
                <Database className="w-3 h-3" />
                {data.storageMode === "postgres"
                  ? "PostgreSQL Connected"
                  : data.storageMode === "file"
                  ? "Local File DB (.data)"
                  : "Temporary /tmp (Attach DATABASE_URL)"}
              </span>
            )}

            <button
              type="button"
              onClick={loadOverview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Environment Advisories */}
        {data?.storageMode === "ephemeral-tmp" && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Vercel Serverless Notice: Running on temporary `/tmp` storage
              </p>
              <p className="mt-0.5 text-amber-900/80">
                Connect a free Neon or Supabase PostgreSQL database in Vercel Storage
                and set <code className="font-mono-code font-bold">DATABASE_URL</code>{" "}
                so applications, IP logs, and edits persist permanently across deployments.
              </p>
            </div>
          </div>
        )}

        {data?.usingDefaultPassword && (
          <div className="rounded-xl bg-sky-50 border border-sky-200 px-4 py-3 flex items-center gap-2.5 text-xs text-sky-900">
            <Lock className="w-4 h-4 text-sky-700 shrink-0" />
            <span>
              Default admin password is active (<code className="font-mono-code font-bold">biddyascope-admin-2026</code>). Set{" "}
              <code className="font-mono-code font-bold">ADMIN_PASSWORD</code> in Vercel Environment Variables before sharing publicly.
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-[#0B162C]/10 shadow-sm">
          {[
            { key: "analytics" as TabKey, label: "Views & IP Analytics", icon: Activity },
            {
              key: "applications" as TabKey,
              label: `Applications (${data?.applications.length ?? 0})`,
              icon: FileText,
            },
            {
              key: "subjects" as TabKey,
              label: `Subjects (${data?.subjects.length ?? 0})`,
              icon: BookOpen,
            },
            {
              key: "tutors" as TabKey,
              label: `Selective Tutors (${data?.tutors.length ?? 0})`,
              icon: Users,
            },
            { key: "settings" as TabKey, label: "Site Content & Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-[#0B162C] text-white shadow-sm"
                    : "text-[#0B162C]/70 hover:bg-[#0B162C]/5 hover:text-[#0B162C]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {!data ? (
          <div className="rounded-2xl bg-white p-12 text-center text-sm text-[#0B162C]/60 border border-[#0B162C]/10">
            Loading BiddyaScope backend data...
          </div>
        ) : (
          <>
            {activeTab === "analytics" && (
              <AnalyticsTab
                analytics={data.analytics}
                onRefresh={loadOverview}
                showToast={showToast}
              />
            )}
            {activeTab === "applications" && (
              <ApplicationsTab
                applications={data.applications}
                tutors={data.tutors}
                onRefresh={loadOverview}
                showToast={showToast}
              />
            )}
            {activeTab === "subjects" && (
              <SubjectsTab
                subjects={data.subjects}
                onRefresh={loadOverview}
                showToast={showToast}
              />
            )}
            {activeTab === "tutors" && (
              <TutorsTab
                tutors={data.tutors}
                onRefresh={loadOverview}
                showToast={showToast}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab
                settings={data.settings}
                onRefresh={loadOverview}
                showToast={showToast}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ==================== TAB 1: ANALYTICS & IP LOGS ====================

function AnalyticsTab({
  analytics,
  onRefresh,
  showToast,
}: {
  analytics: AnalyticsSummary;
  onRefresh: () => Promise<void>;
  showToast: (m: string) => void;
}) {
  const [ipSearch, setIpSearch] = useState("");
  const [clearing, setClearing] = useState(false);

  const maxDaily = Math.max(1, ...analytics.dailyTraffic.map((d) => d.views));

  const filteredLogs = analytics.recentViews.filter((v) => {
    if (!ipSearch.trim()) return true;
    const q = ipSearch.toLowerCase();
    return (
      v.ipAddress.toLowerCase().includes(q) ||
      v.country.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.browser.toLowerCase().includes(q) ||
      v.os.toLowerCase().includes(q) ||
      v.path.toLowerCase().includes(q)
    );
  });

  async function handleClearLogs() {
    if (!confirm("Clear all recorded visitor IP logs?")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/admin/analytics", { method: "DELETE" });
      if (res.ok) {
        showToast("Visitor logs cleared.");
        await onRefresh();
      }
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-[#0B162C]/10 shadow-sm">
          <div className="text-xs font-bold text-[#0B162C]/60 uppercase tracking-wider">
            Total Website Views
          </div>
          <div className="text-3xl font-extrabold mt-2">{analytics.totalViews}</div>
          <div className="text-xs text-teal-700 font-semibold mt-1">
            {analytics.viewsToday} views today
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#0B162C]/10 shadow-sm">
          <div className="text-xs font-bold text-[#0B162C]/60 uppercase tracking-wider">
            Unique IP Addresses
          </div>
          <div className="text-3xl font-extrabold mt-2">{analytics.uniqueIps}</div>
          <div className="text-xs text-teal-700 font-semibold mt-1">
            {analytics.uniqueIpsToday} unique IPs today
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#0B162C]/10 shadow-sm">
          <div className="text-xs font-bold text-[#0B162C]/60 uppercase tracking-wider">
            Tutor Applications
          </div>
          <div className="text-3xl font-extrabold mt-2">
            {analytics.totalApplications}
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-1">
            {analytics.pendingApplications} pending review
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#0B162C]/10 shadow-sm">
          <div className="text-xs font-bold text-[#0B162C]/60 uppercase tracking-wider">
            Conversion Rate
          </div>
          <div className="text-3xl font-extrabold mt-2">
            {analytics.conversionRate}%
          </div>
          <div className="text-xs text-[#0B162C]/60 font-semibold mt-1">
            Applications / Unique IPs
          </div>
        </div>
      </div>

      {/* Traffic Chart + Device Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 border border-[#0B162C]/10 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-base">
                14-Day Traffic & Unique IPs
              </h3>
              <p className="text-xs text-[#0B162C]/60">
                Daily views across BiddyaScope public pages
              </p>
            </div>
          </div>

          <div className="h-44 flex items-end gap-2 pt-4">
            {analytics.dailyTraffic.map((day) => {
              const heightPct = Math.round((day.views / maxDaily) * 100);
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1.5 group relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#0B162C] text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                    {day.date}: {day.views} views ({day.uniqueIps} IPs)
                  </div>
                  <div className="w-full bg-[#F3F5F8] rounded-t-lg h-32 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-teal-600 group-hover:bg-[#0B162C] transition-all rounded-t-lg"
                      style={{ height: `${Math.max(4, heightPct)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#0B162C]/55 font-mono-code">
                    {day.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-white p-6 border border-[#0B162C]/10 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base">Device Breakdown</h3>
          {analytics.deviceBreakdown.length === 0 ? (
            <p className="text-xs text-[#0B162C]/50">No traffic recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.deviceBreakdown.map((d) => {
                const pct =
                  analytics.totalViews > 0
                    ? Math.round((d.count / analytics.totalViews) * 100)
                    : 0;
                return (
                  <div key={d.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{d.name}</span>
                      <span>
                        {d.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F3F5F8] overflow-hidden">
                      <div
                        className="h-full bg-[#0F766E] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Visiting IPs */}
      <div className="rounded-2xl bg-white p-6 border border-[#0B162C]/10 shadow-sm">
        <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-700" />
          Top IP Addresses
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#0B162C]/10 text-[#0B162C]/60 text-xs uppercase">
                <th className="py-2.5 pr-4">IP Address</th>
                <th className="py-2.5 pr-4">Location</th>
                <th className="py-2.5 pr-4">Device / Browser</th>
                <th className="py-2.5 pr-4">Total Hits</th>
                <th className="py-2.5">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B162C]/5">
              {analytics.topIps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#0B162C]/50">
                    No IP traffic recorded yet. Open the homepage to generate a visit!
                  </td>
                </tr>
              ) : (
                analytics.topIps.map((ip) => (
                  <tr key={ip.ipAddress} className="hover:bg-[#FAF8F4]">
                    <td className="py-2.5 pr-4 font-mono-code font-bold text-[#0B162C]">
                      {ip.ipAddress}
                    </td>
                    <td className="py-2.5 pr-4">
                      {[ip.city, ip.country].filter(Boolean).join(", ") || "Unknown"}
                    </td>
                    <td className="py-2.5 pr-4 text-[#0B162C]/75">
                      {ip.deviceType} • {ip.browser}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold text-xs">
                        {ip.hits}
                      </span>
                    </td>
                    <td className="py-2.5 text-[#0B162C]/60 text-xs">
                      {new Date(ip.lastSeen).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Live IP Visit Log */}
      <div className="rounded-2xl bg-white p-6 border border-[#0B162C]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base">Live Visitor IP Log</h3>
            <p className="text-xs text-[#0B162C]/60">
              Latest 200 requests with IP, geo location, OS, browser, and timestamp
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#0B162C]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ipSearch}
                onChange={(e) => setIpSearch(e.target.value)}
                placeholder="Search IP, city, browser..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-[#0B162C]/15 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <button
              type="button"
              onClick={handleClearLogs}
              disabled={clearing}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Logs
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[420px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-white border-b border-[#0B162C]/10 text-[#0B162C]/60 uppercase">
              <tr>
                <th className="py-2.5 pr-3">Time</th>
                <th className="py-2.5 pr-3">IP Address</th>
                <th className="py-2.5 pr-3">Location</th>
                <th className="py-2.5 pr-3">Path</th>
                <th className="py-2.5 pr-3">Device / OS</th>
                <th className="py-2.5">Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B162C]/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#0B162C]/50">
                    No matching logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F4]">
                    <td className="py-2 pr-3 text-[#0B162C]/65 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 font-mono-code font-bold">
                      {log.ipAddress}
                    </td>
                    <td className="py-2 pr-3">
                      {[log.city, log.region, log.country].filter(Boolean).join(", ") ||
                        "Unknown"}
                    </td>
                    <td className="py-2 pr-3 font-mono-code text-teal-800">
                      {log.path}
                    </td>
                    <td className="py-2 pr-3">
                      {log.deviceType} • {log.os}
                    </td>
                    <td className="py-2">{log.browser}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== TAB 2: APPLICATIONS ====================

function ApplicationsTab({
  applications,
  tutors,
  onRefresh,
  showToast,
}: {
  applications: TutorApplication[];
  tutors: Tutor[];
  onRefresh: () => Promise<void>;
  showToast: (m: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = applications.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.studentName.toLowerCase().includes(q) ||
      a.phone.toLowerCase().includes(q) ||
      a.trackingCode.toLowerCase().includes(q) ||
      a.subjectName.toLowerCase().includes(q) ||
      a.area.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-4 border border-[#0B162C]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["all", "pending", "contacted", "matched", "completed", "cancelled"].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#0B162C] text-white"
                    : "bg-[#F3F5F8] text-[#0B162C]/70 hover:text-[#0B162C]"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#0B162C]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, code..."
            className="pl-8 pr-3 py-1.5 rounded-xl border border-[#0B162C]/15 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center text-sm text-[#0B162C]/55 border border-[#0B162C]/10">
          No applications match your filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              tutors={tutors}
              onRefresh={onRefresh}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({
  app,
  tutors,
  onRefresh,
  showToast,
}: {
  app: TutorApplication;
  tutors: Tutor[];
  onRefresh: () => Promise<void>;
  showToast: (m: string) => void;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(app.status);
  const [assignedTutorId, setAssignedTutorId] = useState(app.assignedTutorId || "");
  const [adminNotes, setAdminNotes] = useState(app.adminNotes || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const tutorObj = tutors.find((t) => t.id === assignedTutorId);
      const res = await fetch(`/api/admin/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assignedTutorId,
          assignedTutorName: tutorObj?.name || "",
          adminNotes,
        }),
      });
      if (res.ok) {
        showToast(`Updated ${app.trackingCode}`);
        await onRefresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete application ${app.trackingCode}?`)) return;
    const res = await fetch(`/api/admin/applications/${app.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("Application deleted");
      await onRefresh();
    }
  }

  const badgeColors: Record<ApplicationStatus, string> = {
    pending: "bg-amber-100 text-amber-900",
    contacted: "bg-sky-100 text-sky-900",
    matched: "bg-emerald-100 text-emerald-900",
    completed: "bg-teal-900 text-white",
    cancelled: "bg-rose-100 text-rose-800",
  };

  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 border border-[#0B162C]/10 shadow-sm space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-code text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#0B162C] text-amber-300">
              {app.trackingCode}
            </span>
            <h4 className="font-extrabold text-base">{app.studentName}</h4>
            <span
              className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${badgeColors[app.status]}`}
            >
              {app.status}
            </span>
          </div>
          <p className="text-xs text-[#0B162C]/65 mt-1">
            Submitted {new Date(app.createdAt).toLocaleString()} • IP:{" "}
            <span className="font-mono-code font-semibold">{app.ipAddress || "N/A"}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-[#FAF8F4] rounded-xl p-3.5 border border-[#0B162C]/10">
        <div>
          <span className="text-[#0B162C]/55 block">Subject & Batch</span>
          <span className="font-bold text-teal-900">
            {app.subjectName} • {app.hscBatch}
          </span>
        </div>
        <div>
          <span className="text-[#0B162C]/55 block">Phone / Guardian</span>
          <span className="font-bold">
            {app.phone}
            {app.guardianPhone ? ` / ${app.guardianPhone}` : ""}
          </span>
        </div>
        <div>
          <span className="text-[#0B162C]/55 block">College & Area</span>
          <span className="font-bold">
            {app.college || "N/A"} • {app.area}
          </span>
        </div>
        <div>
          <span className="text-[#0B162C]/55 block">Schedule & Pref</span>
          <span className="font-bold">
            {app.daysPerWeek} days/wk • {app.tutorGenderPref}
          </span>
        </div>
        {(app.fullAddress || app.notes) && (
          <div className="sm:col-span-2 lg:col-span-4 pt-1 border-t border-[#0B162C]/10">
            <span className="text-[#0B162C]/55">Address / Notes: </span>
            <span className="font-medium">
              {[app.fullAddress, app.notes].filter(Boolean).join(" — ")}
            </span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-[#0B162C]/70 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs font-bold bg-white"
          >
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="matched">Matched</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="sm:col-span-4">
          <label className="block text-[11px] font-bold text-[#0B162C]/70 mb-1">
            Assign Selective Mentor
          </label>
          <select
            value={assignedTutorId}
            onChange={(e) => setAssignedTutorId(e.target.value)}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs font-semibold bg-white"
          >
            <option value="">-- Unassigned --</option>
            {tutors.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.institution}, {t.yearOfStudy})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-[#0B162C]/70 mb-1">
            Admin Notes
          </label>
          <input
            type="text"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal remarks..."
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 px-3 rounded-xl bg-[#0F766E] text-white text-xs font-bold hover:bg-[#0D5E58] cursor-pointer"
          >
            {saving ? "Saving..." : "Save Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== TAB 3: SUBJECTS MANAGER ====================

function SubjectsTab({
  subjects,
  onRefresh,
  showToast,
}: {
  subjects: Subject[];
  onRefresh: () => Promise<void>;
  showToast: (m: string) => void;
}) {
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [level, setLevel] = useState("HSC Science");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [sortOrder, setSortOrder] = useState(subjects.length + 1);
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          nameBn: nameBn || name,
          level,
          description,
          descriptionBn: descriptionBn || description,
          sortOrder,
          active: true,
        }),
      });
      if (res.ok) {
        setName("");
        setNameBn("");
        setDescription("");
        setDescriptionBn("");
        showToast("Subject added to dropdown!");
        await onRefresh();
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleAdd}
        className="lg:col-span-4 rounded-2xl bg-white p-6 border border-[#0B162C]/10 shadow-sm space-y-3.5"
      >
        <h3 className="font-extrabold text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-teal-700" />
          Add New Subject (Dropdown)
        </h3>
        <p className="text-xs text-[#0B162C]/60">
          Any active subject added here immediately appears in the student application dropdown.
        </p>

        <div>
          <label className="block text-xs font-bold mb-1">Subject Name (EN) *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., ICT"
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Subject Name (Bangla)</label>
          <input
            type="text"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            placeholder="e.g., তথ্য ও যোগাযোগ প্রযুক্তি (ICT)"
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-bold mb-1">Division / Level</label>
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="HSC Science"
              className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Description (EN)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Description (Bangla)</label>
          <textarea
            rows={2}
            value={descriptionBn}
            onChange={(e) => setDescriptionBn(e.target.value)}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full py-2.5 rounded-xl bg-[#0B162C] text-white text-xs font-bold hover:bg-teal-900 cursor-pointer"
        >
          {adding ? "Adding..." : "Add Subject"}
        </button>
      </form>

      <div className="lg:col-span-8 space-y-3">
        {subjects.map((subj) => (
          <SubjectRow
            key={subj.id}
            subject={subj}
            onRefresh={onRefresh}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  );
}

function SubjectRow({
  subject,
  onRefresh,
  showToast,
}: {
  subject: Subject;
  onRefresh: () => Promise<void>;
  showToast: (m: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(subject.name);
  const [nameBn, setNameBn] = useState(subject.nameBn);
  const [level, setLevel] = useState(subject.level);
  const [description, setDescription] = useState(subject.description);
  const [descriptionBn, setDescriptionBn] = useState(subject.descriptionBn);
  const [sortOrder, setSortOrder] = useState(subject.sortOrder);

  async function toggleActive() {
    const res = await fetch(`/api/admin/subjects/${subject.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !subject.active }),
    });
    if (res.ok) {
      showToast(
        `${subject.name} ${!subject.active ? "enabled" : "hidden"} in dropdown`
      );
      await onRefresh();
    }
  }

  async function saveEdit() {
    const res = await fetch(`/api/admin/subjects/${subject.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        nameBn,
        level,
        description,
        descriptionBn,
        sortOrder,
      }),
    });
    if (res.ok) {
      setEditing(false);
      showToast("Subject updated");
      await onRefresh();
    }
  }

  async function remove() {
    if (!confirm(`Delete subject "${subject.name}"?`)) return;
    const res = await fetch(`/api/admin/subjects/${subject.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("Subject deleted");
      await onRefresh();
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 border border-[#0B162C]/10 shadow-sm space-y-3">
      {editing ? (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-2.5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name EN"
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs font-bold"
            />
            <input
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="Name BN"
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
            <div className="flex gap-2">
              <input
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="Level"
                className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
              />
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-16 rounded-xl border border-[#0B162C]/15 px-2 py-2 text-xs"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description EN"
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
            <textarea
              rows={2}
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              placeholder="Description BN"
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveEdit}
              className="px-4 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-bold cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-1.5 rounded-lg bg-[#F3F5F8] text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm">{subject.name}</span>
              <span className="text-xs text-[#0B162C]/65">({subject.nameBn})</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F4] border border-[#0B162C]/10">
                {subject.level}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  subject.active
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {subject.active ? "Active in Dropdown" : "Hidden"}
              </span>
            </div>
            <p className="text-xs text-[#0B162C]/70 mt-1.5">{subject.description}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleActive}
              className="px-2.5 py-1.5 rounded-lg bg-[#F3F5F8] hover:bg-[#0B162C]/10 text-xs font-bold cursor-pointer"
            >
              {subject.active ? "Disable" : "Enable"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg hover:bg-[#F3F5F8] text-[#0B162C]/70 cursor-pointer"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={remove}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== TAB 4: SELECTIVE TUTORS MANAGER ====================

function TutorsTab({
  tutors,
  onRefresh,
  showToast,
}: {
  tutors: Tutor[];
  onRefresh: () => Promise<void>;
  showToast: (m: string) => void;
}) {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("KUET");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [department, setDepartment] = useState("");
  const [subjectsStr, setSubjectsStr] = useState("Physics, Higher Math");
  const [experienceYears, setExperienceYears] = useState(3);
  const [tagline, setTagline] = useState("");
  const [taglineBn, setTaglineBn] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/admin/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          institution,
          yearOfStudy,
          department,
          subjects: subjectsStr,
          experienceYears,
          tagline,
          taglineBn: taglineBn || tagline,
          active: true,
          sortOrder: tutors.length + 1,
        }),
      });
      if (res.ok) {
        setName("");
        setDepartment("");
        setTagline("");
        setTaglineBn("");
        showToast("Selective tutor added!");
        await onRefresh();
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleAdd}
        className="lg:col-span-4 rounded-2xl bg-white p-6 border border-[#0B162C]/10 shadow-sm space-y-3"
      >
        <h3 className="font-extrabold text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-teal-700" />
          Add Selective Mentor
        </h3>

        <div>
          <label className="block text-xs font-bold mb-1">Mentor Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Farhan Sadik"
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-bold mb-1">Institution</label>
            <select
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full rounded-xl border border-[#0B162C]/15 px-2.5 py-2 text-xs bg-white font-semibold"
            >
              <option value="KUET">KUET</option>
              <option value="Khulna Medical College">Khulna Medical College</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Year</label>
            <select
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              className="w-full rounded-xl border border-[#0B162C]/15 px-2.5 py-2 text-xs bg-white font-semibold"
            >
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="col-span-2">
            <label className="block text-xs font-bold mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., ME / MBBS"
              className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Exp (Yrs)</label>
            <input
              type="number"
              min={1}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
            Subjects (comma-separated)
          </label>
          <input
            type="text"
            value={subjectsStr}
            onChange={(e) => setSubjectsStr(e.target.value)}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Bio (EN)</label>
          <textarea
            rows={2}
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Bio (Bangla)</label>
          <textarea
            rows={2}
            value={taglineBn}
            onChange={(e) => setTaglineBn(e.target.value)}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full py-2.5 rounded-xl bg-[#0B162C] text-white text-xs font-bold hover:bg-teal-900 cursor-pointer"
        >
          {adding ? "Adding..." : "Add Mentor"}
        </button>
      </form>

      <div className="lg:col-span-8 space-y-3">
        {tutors.map((tutor) => (
          <TutorRow
            key={tutor.id}
            tutor={tutor}
            onRefresh={onRefresh}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  );
}

function TutorRow({
  tutor,
  onRefresh,
  showToast,
}: {
  tutor: Tutor;
  onRefresh: () => Promise<void>;
  showToast: (m: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tutor.name);
  const [institution, setInstitution] = useState(tutor.institution);
  const [yearOfStudy, setYearOfStudy] = useState(tutor.yearOfStudy);
  const [department, setDepartment] = useState(tutor.department);
  const [subjectsStr, setSubjectsStr] = useState(tutor.subjects.join(", "));
  const [experienceYears, setExperienceYears] = useState(tutor.experienceYears);
  const [tagline, setTagline] = useState(tutor.tagline);
  const [taglineBn, setTaglineBn] = useState(tutor.taglineBn);

  async function toggleActive() {
    const res = await fetch(`/api/admin/tutors/${tutor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !tutor.active }),
    });
    if (res.ok) {
      showToast(`${tutor.name} ${!tutor.active ? "activated" : "hidden"}`);
      await onRefresh();
    }
  }

  async function saveEdit() {
    const res = await fetch(`/api/admin/tutors/${tutor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        institution,
        yearOfStudy,
        department,
        subjects: subjectsStr,
        experienceYears,
        tagline,
        taglineBn,
      }),
    });
    if (res.ok) {
      setEditing(false);
      showToast("Tutor updated");
      await onRefresh();
    }
  }

  async function remove() {
    if (!confirm(`Delete mentor "${tutor.name}"?`)) return;
    const res = await fetch(`/api/admin/tutors/${tutor.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("Tutor deleted");
      await onRefresh();
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 border border-[#0B162C]/10 shadow-sm space-y-3">
      {editing ? (
        <div className="space-y-2.5">
          <div className="grid sm:grid-cols-3 gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs font-bold"
            />
            <input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
            <input
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
            <input
              value={subjectsStr}
              onChange={(e) => setSubjectsStr(e.target.value)}
              placeholder="Subjects"
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <textarea
              rows={2}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
            <textarea
              rows={2}
              value={taglineBn}
              onChange={(e) => setTaglineBn(e.target.value)}
              className="rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveEdit}
              className="px-4 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-bold cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-1.5 rounded-lg bg-[#F3F5F8] text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-sm">{tutor.name}</span>
              <span className="text-xs font-bold text-teal-800">
                {tutor.institution} • {tutor.yearOfStudy}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                {tutor.experienceYears}+ yrs exp
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  tutor.active
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tutor.active ? "Visible" : "Hidden"}
              </span>
            </div>
            <p className="text-xs text-[#0B162C]/65 mt-1">
              {tutor.department} • Subjects: {tutor.subjects.join(", ")}
            </p>
            <p className="text-xs text-[#0B162C]/80 mt-1">{tutor.tagline}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleActive}
              className="px-2.5 py-1.5 rounded-lg bg-[#F3F5F8] hover:bg-[#0B162C]/10 text-xs font-bold cursor-pointer"
            >
              {tutor.active ? "Hide" : "Show"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg hover:bg-[#F3F5F8] text-[#0B162C]/70 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={remove}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== TAB 5: SITE CONTENT & SETTINGS ====================

function SettingsTab({
  settings,
  onRefresh,
  showToast,
}: {
  settings: SiteSettings;
  onRefresh: () => Promise<void>;
  showToast: (m: string) => void;
}) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("Site content & settings saved!");
        await onRefresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl bg-white p-6 sm:p-8 border border-[#0B162C]/10 shadow-sm space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0B162C]/10 pb-4">
        <div>
          <h3 className="font-extrabold text-lg">
            Site Content & Contact Editor (CMS)
          </h3>
          <p className="text-xs text-[#0B162C]/60">
            Edit any headline, philosophy text, announcement banner, or contact info directly from the backend.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold hover:bg-[#0D5E58] cursor-pointer"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">Brand Name</label>
          <input
            value={form.brandName}
            onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-sm font-bold"
          />
        </div>
        <div className="flex items-center gap-2.5 pt-5">
          <input
            id="annActive"
            type="checkbox"
            checked={form.announcementActive}
            onChange={(e) =>
              setForm({ ...form, announcementActive: e.target.checked })
            }
            className="w-4 h-4 accent-teal-700"
          />
          <label htmlFor="annActive" className="text-xs font-bold">
            Show Top Announcement Bar
          </label>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">
            Announcement Text (EN)
          </label>
          <input
            value={form.announcementText}
            onChange={(e) =>
              setForm({ ...form, announcementText: e.target.value })
            }
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            Announcement Text (Bangla)
          </label>
          <input
            value={form.announcementTextBn}
            onChange={(e) =>
              setForm({ ...form, announcementTextBn: e.target.value })
            }
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">Hero Headline (EN)</label>
          <textarea
            rows={2}
            value={form.heroTitle}
            onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            Hero Headline (Bangla)
          </label>
          <textarea
            rows={2}
            value={form.heroTitleBn}
            onChange={(e) => setForm({ ...form, heroTitleBn: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">Hero Subtitle (EN)</label>
          <textarea
            rows={3}
            value={form.heroSubtitle}
            onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            Hero Subtitle (Bangla)
          </label>
          <textarea
            rows={3}
            value={form.heroSubtitleBn}
            onChange={(e) => setForm({ ...form, heroSubtitleBn: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">
            Anti-Tuition-Media Title (EN)
          </label>
          <input
            value={form.antiMediaTitle}
            onChange={(e) =>
              setForm({ ...form, antiMediaTitle: e.target.value })
            }
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            Anti-Tuition-Media Title (Bangla)
          </label>
          <input
            value={form.antiMediaTitleBn}
            onChange={(e) =>
              setForm({ ...form, antiMediaTitleBn: e.target.value })
            }
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">
            Anti-Tuition-Media Description (EN)
          </label>
          <textarea
            rows={3}
            value={form.antiMediaDescription}
            onChange={(e) =>
              setForm({ ...form, antiMediaDescription: e.target.value })
            }
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            Anti-Tuition-Media Description (Bangla)
          </label>
          <textarea
            rows={3}
            value={form.antiMediaDescriptionBn}
            onChange={(e) =>
              setForm({ ...form, antiMediaDescriptionBn: e.target.value })
            }
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">Contact Phone</label>
          <input
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            WhatsApp Number (with 880)
          </label>
          <input
            value={form.whatsappNumber}
            onChange={(e) =>
              setForm({ ...form, whatsappNumber: e.target.value })
            }
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Contact Email</label>
          <input
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">Service Area (EN)</label>
          <input
            value={form.serviceArea}
            onChange={(e) => setForm({ ...form, serviceArea: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            Service Area (Bangla)
          </label>
          <input
            value={form.serviceAreaBn}
            onChange={(e) => setForm({ ...form, serviceAreaBn: e.target.value })}
            className="w-full rounded-xl border border-[#0B162C]/15 px-3 py-2 text-xs"
          />
        </div>
      </div>
    </form>
  );
}
