import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Pool } from "pg";
import {
  AnalyticsSummary,
  ApplicationStatus,
  PageView,
  SiteSettings,
  Subject,
  Tutor,
  TutorApplication,
} from "./types";
import { DEFAULT_SETTINGS, DEFAULT_SUBJECTS, DEFAULT_TUTORS } from "./seed";

export type StorageMode = "postgres" | "file" | "ephemeral-tmp";

interface StoreShape {
  settings: SiteSettings;
  subjects: Subject[];
  tutors: Tutor[];
  applications: TutorApplication[];
  pageViews: PageView[];
  adminPasswordHash?: string;
}

const PG_CONN = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

let pgPool: Pool | null = null;
let pgInitPromise: Promise<void> | null = null;
let fileLock: Promise<void> = Promise.resolve();

function getPool(): Pool {
  if (!pgPool) {
    const isLocal =
      PG_CONN.includes("localhost") || PG_CONN.includes("127.0.0.1");
    pgPool = new Pool({
      connectionString: PG_CONN,
      ssl: isLocal ? undefined : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pgPool;
}

export function getStorageMode(): StorageMode {
  if (PG_CONN) return "postgres";
  if (process.env.VERCEL === "1") return "ephemeral-tmp";
  return "file";
}

function getFilePath(): string {
  if (process.env.VERCEL === "1") {
    return "/tmp/biddyascope-data.json";
  }
  return path.join(process.cwd(), ".data", "biddyascope.json");
}

function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = fileLock.then(fn, fn);
  fileLock = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

async function readLocalStore(): Promise<StoreShape> {
  const filePath = getFilePath();
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    return {
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [...DEFAULT_SUBJECTS],
      tutors: Array.isArray(parsed.tutors) ? parsed.tutors : [...DEFAULT_TUTORS],
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
      pageViews: Array.isArray(parsed.pageViews) ? parsed.pageViews : [],
      adminPasswordHash:
        typeof parsed.adminPasswordHash === "string"
          ? parsed.adminPasswordHash
          : undefined,
    };
  } catch {
    const initial: StoreShape = {
      settings: { ...DEFAULT_SETTINGS },
      subjects: [...DEFAULT_SUBJECTS],
      tutors: [...DEFAULT_TUTORS],
      applications: [],
      pageViews: [],
    };
    await writeLocalStore(initial);
    return initial;
  }
}

async function writeLocalStore(data: StoreShape): Promise<void> {
  const filePath = getFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function ensurePgReady(): Promise<void> {
  if (!PG_CONN) return;
  if (!pgInitPromise) {
    pgInitPromise = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS bs_settings (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS bs_subjects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          name_bn TEXT NOT NULL DEFAULT '',
          level TEXT NOT NULL DEFAULT 'HSC Science',
          description TEXT NOT NULL DEFAULT '',
          description_bn TEXT NOT NULL DEFAULT '',
          active BOOLEAN NOT NULL DEFAULT TRUE,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS bs_tutors (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          institution TEXT NOT NULL,
          year_of_study TEXT NOT NULL,
          department TEXT NOT NULL DEFAULT '',
          subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
          experience_years INTEGER NOT NULL DEFAULT 2,
          tagline TEXT NOT NULL DEFAULT '',
          tagline_bn TEXT NOT NULL DEFAULT '',
          active BOOLEAN NOT NULL DEFAULT TRUE,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS bs_applications (
          id TEXT PRIMARY KEY,
          tracking_code TEXT NOT NULL,
          student_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          guardian_phone TEXT NOT NULL DEFAULT '',
          college TEXT NOT NULL DEFAULT '',
          hsc_batch TEXT NOT NULL DEFAULT '',
          subject_id TEXT NOT NULL,
          subject_name TEXT NOT NULL,
          area TEXT NOT NULL DEFAULT '',
          full_address TEXT NOT NULL DEFAULT '',
          days_per_week INTEGER NOT NULL DEFAULT 3,
          preferred_time TEXT NOT NULL DEFAULT '',
          tutor_gender_pref TEXT NOT NULL DEFAULT 'Any',
          notes TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL DEFAULT 'pending',
          assigned_tutor_id TEXT DEFAULT '',
          assigned_tutor_name TEXT DEFAULT '',
          admin_notes TEXT NOT NULL DEFAULT '',
          ip_address TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS bs_page_views (
          id TEXT PRIMARY KEY,
          ip_address TEXT NOT NULL,
          country TEXT NOT NULL DEFAULT '',
          city TEXT NOT NULL DEFAULT '',
          region TEXT NOT NULL DEFAULT '',
          path TEXT NOT NULL DEFAULT '/',
          referrer TEXT NOT NULL DEFAULT '',
          user_agent TEXT NOT NULL DEFAULT '',
          device_type TEXT NOT NULL DEFAULT 'Desktop',
          browser TEXT NOT NULL DEFAULT 'Unknown',
          os TEXT NOT NULL DEFAULT 'Unknown',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_bs_page_views_created_at ON bs_page_views(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_bs_page_views_ip ON bs_page_views(ip_address);
        CREATE INDEX IF NOT EXISTS idx_bs_applications_created_at ON bs_applications(created_at DESC);
      `);

      const settingsRes = await pool.query("SELECT id FROM bs_settings WHERE id = 'default'");
      if (settingsRes.rowCount === 0) {
        await pool.query(
          "INSERT INTO bs_settings (id, data, updated_at) VALUES ('default', $1::jsonb, NOW())",
          [JSON.stringify(DEFAULT_SETTINGS)]
        );
      }

      const subjRes = await pool.query("SELECT COUNT(*)::int AS cnt FROM bs_subjects");
      if ((subjRes.rows[0]?.cnt ?? 0) === 0) {
        for (const s of DEFAULT_SUBJECTS) {
          await pool.query(
            `INSERT INTO bs_subjects (id, name, name_bn, level, description, description_bn, active, sort_order, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [s.id, s.name, s.nameBn, s.level, s.description, s.descriptionBn, s.active, s.sortOrder, s.createdAt]
          );
        }
      }

      const tutorRes = await pool.query("SELECT COUNT(*)::int AS cnt FROM bs_tutors");
      if ((tutorRes.rows[0]?.cnt ?? 0) === 0) {
        for (const t of DEFAULT_TUTORS) {
          await pool.query(
            `INSERT INTO bs_tutors (id, name, institution, year_of_study, department, subjects, experience_years, tagline, tagline_bn, active, sort_order, created_at)
             VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12)`,
            [
              t.id,
              t.name,
              t.institution,
              t.yearOfStudy,
              t.department,
              JSON.stringify(t.subjects),
              t.experienceYears,
              t.tagline,
              t.taglineBn,
              t.active,
              t.sortOrder,
              t.createdAt,
            ]
          );
        }
      }
    })();
  }
  await pgInitPromise;
}

// ---------------- SETTINGS ----------------

export async function getSettings(): Promise<SiteSettings> {
  if (PG_CONN) {
    await ensurePgReady();
    const res = await getPool().query("SELECT data FROM bs_settings WHERE id = 'default'");
    const data = res.rows[0]?.data || {};
    return { ...DEFAULT_SETTINGS, ...data };
  }
  const store = await readLocalStore();
  return store.settings;
}

export async function updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const updatedAt = new Date().toISOString();
  if (PG_CONN) {
    await ensurePgReady();
    const current = await getSettings();
    const next: SiteSettings = { ...current, ...patch, updatedAt };
    await getPool().query(
      `INSERT INTO bs_settings (id, data, updated_at) VALUES ('default', $1::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [JSON.stringify(next)]
    );
    return next;
  }
  return withFileLock(async () => {
    const store = await readLocalStore();
    store.settings = { ...store.settings, ...patch, updatedAt };
    await writeLocalStore(store);
    return store.settings;
  });
}

export async function getAdminPasswordHash(): Promise<string | null> {
  if (PG_CONN) {
    await ensurePgReady();
    const res = await getPool().query("SELECT data FROM bs_settings WHERE id = 'admin_auth'");
    const hash = res.rows[0]?.data?.passwordHash;
    return typeof hash === "string" && hash.length > 0 ? hash : null;
  }
  const store = await readLocalStore();
  return store.adminPasswordHash || null;
}

export async function setAdminPasswordHash(passwordHash: string): Promise<void> {
  if (PG_CONN) {
    await ensurePgReady();
    await getPool().query(
      `INSERT INTO bs_settings (id, data, updated_at) VALUES ('admin_auth', $1::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [JSON.stringify({ passwordHash })]
    );
    return;
  }
  await withFileLock(async () => {
    const store = await readLocalStore();
    store.adminPasswordHash = passwordHash;
    await writeLocalStore(store);
  });
}

// ---------------- SUBJECTS ----------------

export async function listSubjects(onlyActive = false): Promise<Subject[]> {
  if (PG_CONN) {
    await ensurePgReady();
    const query = onlyActive
      ? "SELECT * FROM bs_subjects WHERE active = TRUE ORDER BY sort_order ASC, created_at ASC"
      : "SELECT * FROM bs_subjects ORDER BY sort_order ASC, created_at ASC";
    const res = await getPool().query(query);
    return res.rows.map(mapSubjectRow);
  }
  const store = await readLocalStore();
  const list = onlyActive ? store.subjects.filter((s) => s.active) : store.subjects;
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function createSubject(
  input: Omit<Subject, "id" | "createdAt">
): Promise<Subject> {
  const subject: Subject = {
    ...input,
    id: `subj-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  if (PG_CONN) {
    await ensurePgReady();
    await getPool().query(
      `INSERT INTO bs_subjects (id, name, name_bn, level, description, description_bn, active, sort_order, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        subject.id,
        subject.name,
        subject.nameBn,
        subject.level,
        subject.description,
        subject.descriptionBn,
        subject.active,
        subject.sortOrder,
        subject.createdAt,
      ]
    );
    return subject;
  }
  return withFileLock(async () => {
    const store = await readLocalStore();
    store.subjects.push(subject);
    await writeLocalStore(store);
    return subject;
  });
}

export async function updateSubject(
  id: string,
  patch: Partial<Omit<Subject, "id" | "createdAt">>
): Promise<Subject | null> {
  if (PG_CONN) {
    await ensurePgReady();
    const existingRes = await getPool().query("SELECT * FROM bs_subjects WHERE id = $1", [id]);
    if (existingRes.rowCount === 0) return null;
    const existing = mapSubjectRow(existingRes.rows[0]);
    const next: Subject = { ...existing, ...patch };
    await getPool().query(
      `UPDATE bs_subjects
       SET name = $2, name_bn = $3, level = $4, description = $5, description_bn = $6, active = $7, sort_order = $8
       WHERE id = $1`,
      [
        id,
        next.name,
        next.nameBn,
        next.level,
        next.description,
        next.descriptionBn,
        next.active,
        next.sortOrder,
      ]
    );
    return next;
  }
  return withFileLock(async () => {
    const store = await readLocalStore();
    const idx = store.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    store.subjects[idx] = { ...store.subjects[idx], ...patch };
    await writeLocalStore(store);
    return store.subjects[idx];
  });
}

export async function deleteSubject(id: string): Promise<boolean> {
  if (PG_CONN) {
    await ensurePgReady();
    const res = await getPool().query("DELETE FROM bs_subjects WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }
  return withFileLock(async () => {
    const store = await readLocalStore();
    const before = store.subjects.length;
    store.subjects = store.subjects.filter((s) => s.id !== id);
    await writeLocalStore(store);
    return store.subjects.length < before;
  });
}

// ---------------- TUTORS ----------------

export async function listTutors(onlyActive = false): Promise<Tutor[]> {
  if (PG_CONN) {
    await ensurePgReady();
    const query = onlyActive
      ? "SELECT * FROM bs_tutors WHERE active = TRUE ORDER BY sort_order ASC, created_at ASC"
      : "SELECT * FROM bs_tutors ORDER BY sort_order ASC, created_at ASC";
    const res = await getPool().query(query);
    return res.rows.map(mapTutorRow);
  }
  const store = await readLocalStore();
  const list = onlyActive ? store.tutors.filter((t) => t.active) : store.tutors;
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function createTutor(input: Omit<Tutor, "id" | "createdAt">): Promise<Tutor> {
  const tutor: Tutor = {
    ...input,
    id: `tutor-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  if (PG_CONN) {
    await ensurePgReady();
    await getPool().query(
      `INSERT INTO bs_tutors (id, name, institution, year_of_study, department, subjects, experience_years, tagline, tagline_bn, active, sort_order, created_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12)`,
      [
        tutor.id,
        tutor.name,
        tutor.institution,
        tutor.yearOfStudy,
        tutor.department,
        JSON.stringify(tutor.subjects),
        tutor.experienceYears,
        tutor.tagline,
        tutor.taglineBn,
        tutor.active,
        tutor.sortOrder,
        tutor.createdAt,
      ]
    );
    return tutor;
  }
  return withFileLock(async () => {
    const store = await readLocalStore();
    store.tutors.push(tutor);
    await writeLocalStore(store);
    return tutor;
  });
}

export async function updateTutor(
  id: string,
  patch: Partial<Omit<Tutor, "id" | "createdAt">>
): Promise<Tutor | null> {
  if (PG_CONN) {
    await ensurePgReady();
    const existingRes = await getPool().query("SELECT * FROM bs_tutors WHERE id = $1", [id]);
    if (existingRes.rowCount === 0) return null;
    const existing = mapTutorRow(existingRes.rows[0]);
    const next: Tutor = { ...existing, ...patch };
    await getPool().query(
      `UPDATE bs_tutors
       SET name = $2, institution = $3, year_of_study = $4, department = $5, subjects = $6::jsonb,
           experience_years = $7, tagline = $8, tagline_bn = $9, active = $10, sort_order = $11
       WHERE id = $1`,
      [
        id,
        next.name,
        next.institution,
        next.yearOfStudy,
        next.department,
        JSON.stringify(next.subjects),
        next.experienceYears,
        next.tagline,
        next.taglineBn,
        next.active,
        next.sortOrder,
      ]
    );
    return next;
  }
  return withFileLock(async () => {
    const store = await readLocalStore();
    const idx = store.tutors.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    store.tutors[idx] = { ...store.tutors[idx], ...patch };
    await writeLocalStore(store);
    return store.tutors[idx];
  });
}

export async function deleteTutor(id: string): Promise<boolean> {
  if (PG_CONN) {
    await ensurePgReady();
    const res = await getPool().query("DELETE FROM bs_tutors WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }
  return withFileLock(async () => {
    const store = await readLocalStore();
    const before = store.tutors.length;
    store.tutors = store.tutors.filter((t) => t.id !== id);
    await writeLocalStore(store);
    return store.tutors.length < before;
  });
}

// ---------------- APPLICATIONS ----------------

export async function listApplications(): Promise<TutorApplication[]> {
  if (PG_CONN) {
    await ensurePgReady();
    const res = await getPool().query("SELECT * FROM bs_applications ORDER BY created_at DESC");
    return res.rows.map(mapApplicationRow);
  }
  const store = await readLocalStore();
  return [...store.applications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createApplication(
  input: Omit<
    TutorApplication,
    "id" | "trackingCode" | "status" | "adminNotes" | "createdAt" | "updatedAt"
  >
): Promise<TutorApplication> {
  const now = new Date().toISOString();
  const code = `BS-${crypto.randomInt(1000, 9999)}`;
  const app: TutorApplication = {
    ...input,
    id: `app-${crypto.randomUUID().slice(0, 10)}`,
    trackingCode: code,
    status: "pending",
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };

  if (PG_CONN) {
    await ensurePgReady();
    await getPool().query(
      `INSERT INTO bs_applications (
        id, tracking_code, student_name, phone, guardian_phone, college, hsc_batch,
        subject_id, subject_name, area, full_address, days_per_week, preferred_time,
        tutor_gender_pref, notes, status, assigned_tutor_id, assigned_tutor_name,
        admin_notes, ip_address, created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
      )`,
      [
        app.id,
        app.trackingCode,
        app.studentName,
        app.phone,
        app.guardianPhone || "",
        app.college,
        app.hscBatch,
        app.subjectId,
        app.subjectName,
        app.area,
        app.fullAddress,
        app.daysPerWeek,
        app.preferredTime,
        app.tutorGenderPref,
        app.notes,
        app.status,
        app.assignedTutorId || "",
        app.assignedTutorName || "",
        app.adminNotes,
        app.ipAddress,
        app.createdAt,
        app.updatedAt,
      ]
    );
    return app;
  }

  return withFileLock(async () => {
    const store = await readLocalStore();
    store.applications.unshift(app);
    await writeLocalStore(store);
    return app;
  });
}

export async function updateApplication(
  id: string,
  patch: Partial<{
    status: ApplicationStatus;
    assignedTutorId: string;
    assignedTutorName: string;
    adminNotes: string;
  }>
): Promise<TutorApplication | null> {
  const updatedAt = new Date().toISOString();
  if (PG_CONN) {
    await ensurePgReady();
    const existingRes = await getPool().query("SELECT * FROM bs_applications WHERE id = $1", [id]);
    if (existingRes.rowCount === 0) return null;
    const existing = mapApplicationRow(existingRes.rows[0]);
    const next: TutorApplication = { ...existing, ...patch, updatedAt };
    await getPool().query(
      `UPDATE bs_applications
       SET status = $2, assigned_tutor_id = $3, assigned_tutor_name = $4, admin_notes = $5, updated_at = $6
       WHERE id = $1`,
      [
        id,
        next.status,
        next.assignedTutorId || "",
        next.assignedTutorName || "",
        next.adminNotes,
        updatedAt,
      ]
    );
    return next;
  }

  return withFileLock(async () => {
    const store = await readLocalStore();
    const idx = store.applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    store.applications[idx] = { ...store.applications[idx], ...patch, updatedAt };
    await writeLocalStore(store);
    return store.applications[idx];
  });
}

export async function deleteApplication(id: string): Promise<boolean> {
  if (PG_CONN) {
    await ensurePgReady();
    const res = await getPool().query("DELETE FROM bs_applications WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }
  return withFileLock(async () => {
    const store = await readLocalStore();
    const before = store.applications.length;
    store.applications = store.applications.filter((a) => a.id !== id);
    await writeLocalStore(store);
    return store.applications.length < before;
  });
}

// ---------------- PAGE VIEWS & ANALYTICS ----------------

export async function recordPageView(
  input: Omit<PageView, "id" | "createdAt">
): Promise<PageView> {
  const view: PageView = {
    ...input,
    id: `pv-${crypto.randomUUID().slice(0, 12)}`,
    createdAt: new Date().toISOString(),
  };

  if (PG_CONN) {
    await ensurePgReady();
    await getPool().query(
      `INSERT INTO bs_page_views (id, ip_address, country, city, region, path, referrer, user_agent, device_type, browser, os, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        view.id,
        view.ipAddress,
        view.country,
        view.city,
        view.region,
        view.path,
        view.referrer,
        view.userAgent,
        view.deviceType,
        view.browser,
        view.os,
        view.createdAt,
      ]
    );
    return view;
  }

  return withFileLock(async () => {
    const store = await readLocalStore();
    store.pageViews.unshift(view);
    if (store.pageViews.length > 5000) {
      store.pageViews = store.pageViews.slice(0, 5000);
    }
    await writeLocalStore(store);
    return view;
  });
}

export async function clearPageViews(): Promise<void> {
  if (PG_CONN) {
    await ensurePgReady();
    await getPool().query("DELETE FROM bs_page_views");
    return;
  }
  await withFileLock(async () => {
    const store = await readLocalStore();
    store.pageViews = [];
    await writeLocalStore(store);
  });
}

export async function getAnalytics(): Promise<AnalyticsSummary> {
  let views: PageView[] = [];
  let applications: TutorApplication[] = [];

  if (PG_CONN) {
    await ensurePgReady();
    const [pvRes, appRes] = await Promise.all([
      getPool().query("SELECT * FROM bs_page_views ORDER BY created_at DESC LIMIT 2000"),
      getPool().query("SELECT * FROM bs_applications ORDER BY created_at DESC"),
    ]);
    views = pvRes.rows.map(mapPageViewRow);
    applications = appRes.rows.map(mapApplicationRow);
  } else {
    const store = await readLocalStore();
    views = [...store.pageViews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    applications = store.applications;
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const ipSet = new Set<string>();
  const todayIpSet = new Set<string>();
  let viewsToday = 0;

  const ipMap = new Map<
    string,
    {
      ipAddress: string;
      country: string;
      city: string;
      hits: number;
      lastSeen: string;
      deviceType: string;
      browser: string;
    }
  >();

  const deviceMap = new Map<string, number>();
  const dayMap = new Map<string, { views: number; ips: Set<string> }>();

  // Prepare last 14 days keys
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    dayMap.set(d, { views: 0, ips: new Set() });
  }

  for (const v of views) {
    ipSet.add(v.ipAddress);
    const day = v.createdAt.slice(0, 10);
    if (day === todayStr) {
      viewsToday++;
      todayIpSet.add(v.ipAddress);
    }

    const dayEntry = dayMap.get(day);
    if (dayEntry) {
      dayEntry.views++;
      dayEntry.ips.add(v.ipAddress);
    }

    const existingIp = ipMap.get(v.ipAddress);
    if (!existingIp) {
      ipMap.set(v.ipAddress, {
        ipAddress: v.ipAddress,
        country: v.country,
        city: v.city,
        hits: 1,
        lastSeen: v.createdAt,
        deviceType: v.deviceType,
        browser: v.browser,
      });
    } else {
      existingIp.hits++;
    }

    deviceMap.set(v.deviceType, (deviceMap.get(v.deviceType) || 0) + 1);
  }

  const uniqueIps = ipSet.size;
  const totalViews = views.length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a) => a.status === "pending").length;
  const conversionRate =
    uniqueIps > 0 ? Math.round((totalApplications / uniqueIps) * 1000) / 10 : 0;

  const dailyTraffic = Array.from(dayMap.entries()).map(([date, val]) => ({
    date,
    views: val.views,
    uniqueIps: val.ips.size,
  }));

  const topIps = Array.from(ipMap.values())
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 25);

  const deviceBreakdown = Array.from(deviceMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  return {
    totalViews,
    uniqueIps,
    viewsToday,
    uniqueIpsToday: todayIpSet.size,
    totalApplications,
    pendingApplications,
    conversionRate,
    dailyTraffic,
    topIps,
    deviceBreakdown,
    recentViews: views.slice(0, 200),
  };
}

// ---------------- ROW MAPPERS ----------------

function mapSubjectRow(row: Record<string, unknown>): Subject {
  return {
    id: String(row.id),
    name: String(row.name),
    nameBn: String(row.name_bn ?? ""),
    level: String(row.level ?? "HSC Science"),
    description: String(row.description ?? ""),
    descriptionBn: String(row.description_bn ?? ""),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

function mapTutorRow(row: Record<string, unknown>): Tutor {
  const subjects = Array.isArray(row.subjects)
    ? row.subjects.map(String)
    : typeof row.subjects === "string"
    ? (JSON.parse(row.subjects) as string[])
    : [];
  return {
    id: String(row.id),
    name: String(row.name),
    institution: String(row.institution),
    yearOfStudy: String(row.year_of_study),
    department: String(row.department ?? ""),
    subjects,
    experienceYears: Number(row.experience_years ?? 2),
    tagline: String(row.tagline ?? ""),
    taglineBn: String(row.tagline_bn ?? ""),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

function mapApplicationRow(row: Record<string, unknown>): TutorApplication {
  return {
    id: String(row.id),
    trackingCode: String(row.tracking_code),
    studentName: String(row.student_name),
    phone: String(row.phone),
    guardianPhone: String(row.guardian_phone ?? ""),
    college: String(row.college ?? ""),
    hscBatch: String(row.hsc_batch ?? ""),
    subjectId: String(row.subject_id),
    subjectName: String(row.subject_name),
    area: String(row.area ?? ""),
    fullAddress: String(row.full_address ?? ""),
    daysPerWeek: Number(row.days_per_week ?? 3),
    preferredTime: String(row.preferred_time ?? ""),
    tutorGenderPref: String(row.tutor_gender_pref ?? "Any"),
    notes: String(row.notes ?? ""),
    status: (String(row.status) as ApplicationStatus) || "pending",
    assignedTutorId: String(row.assigned_tutor_id ?? ""),
    assignedTutorName: String(row.assigned_tutor_name ?? ""),
    adminNotes: String(row.admin_notes ?? ""),
    ipAddress: String(row.ip_address ?? ""),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function mapPageViewRow(row: Record<string, unknown>): PageView {
  return {
    id: String(row.id),
    ipAddress: String(row.ip_address),
    country: String(row.country ?? ""),
    city: String(row.city ?? ""),
    region: String(row.region ?? ""),
    path: String(row.path ?? "/"),
    referrer: String(row.referrer ?? ""),
    userAgent: String(row.user_agent ?? ""),
    deviceType: String(row.device_type ?? "Desktop"),
    browser: String(row.browser ?? "Unknown"),
    os: String(row.os ?? "Unknown"),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}
