export interface Subject {
  id: string;
  name: string;
  nameBn: string;
  level: string;
  description: string;
  descriptionBn: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Tutor {
  id: string;
  name: string;
  institution: "KUET" | "Khulna Medical College" | string;
  yearOfStudy: "3rd Year" | "4th Year" | string;
  department: string;
  subjects: string[];
  experienceYears: number;
  tagline: string;
  taglineBn: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

export type ApplicationStatus =
  | "pending"
  | "contacted"
  | "matched"
  | "completed"
  | "cancelled";

export interface TutorApplication {
  id: string;
  trackingCode: string;
  studentName: string;
  phone: string;
  guardianPhone?: string;
  college: string;
  hscBatch: string;
  subjectId: string;
  subjectName: string;
  area: string;
  fullAddress: string;
  daysPerWeek: number;
  preferredTime: string;
  tutorGenderPref: string;
  notes: string;
  status: ApplicationStatus;
  assignedTutorId?: string;
  assignedTutorName?: string;
  adminNotes: string;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageView {
  id: string;
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  path: string;
  referrer: string;
  userAgent: string;
  deviceType: string;
  browser: string;
  os: string;
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  announcementText: string;
  announcementTextBn: string;
  announcementActive: boolean;
  heroBadge: string;
  heroBadgeBn: string;
  heroTitle: string;
  heroTitleBn: string;
  heroSubtitle: string;
  heroSubtitleBn: string;
  antiMediaTitle: string;
  antiMediaTitleBn: string;
  antiMediaDescription: string;
  antiMediaDescriptionBn: string;
  serviceArea: string;
  serviceAreaBn: string;
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  footerTagline: string;
  footerTaglineBn: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueIps: number;
  viewsToday: number;
  uniqueIpsToday: number;
  totalApplications: number;
  pendingApplications: number;
  conversionRate: number;
  dailyTraffic: { date: string; views: number; uniqueIps: number }[];
  topIps: {
    ipAddress: string;
    country: string;
    city: string;
    hits: number;
    lastSeen: string;
    deviceType: string;
    browser: string;
  }[];
  deviceBreakdown: { name: string; count: number }[];
  recentViews: PageView[];
}
