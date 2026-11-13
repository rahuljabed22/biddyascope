import type { Metadata } from "next";
import ApplyLandingClient from "@/components/ApplyLandingClient";
import { getSettings, listSubjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "হোম টিউটর রেজিস্ট্রেশন ফর্ম | বিদ্যাস্কোপ — ২টি ফ্রি ডেমো ক্লাস",
  description:
    "Physics, Chemistry, Higher Math ও Biology-এর জন্য KUET এবং খুলনা মেডিকেলের অভিজ্ঞ ও ভেরিফায়েড মেন্টর। সিদ্ধান্ত নেওয়ার আগে পাচ্ছেন ২টি ফ্রি ডেমো ক্লাস।",
  openGraph: {
    title: "হোম টিউটর রেজিস্ট্রেশন ফর্ম | বিদ্যাস্কোপ",
    description:
      "KUET এবং খুলনা মেডিকেলের অভিজ্ঞ HSC Science মেন্টর। শুরুতেই পাচ্ছেন ২টি ফ্রি ডেমো ক্লাস — এখনই ফর্ম জমা দিন।",
    url: "/apply",
    siteName: "বিদ্যাস্কোপ",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 636,
        height: 488,
        alt: "বিদ্যাস্কোপ",
      },
    ],
  },
};

export default async function ApplyPage() {
  const [settings, subjects] = await Promise.all([
    getSettings(),
    listSubjects(true),
  ]);

  return <ApplyLandingClient settings={settings} subjects={subjects} />;
}
