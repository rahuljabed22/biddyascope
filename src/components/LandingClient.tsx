"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Cpu,
  UserCheck,
  XCircle,
  Languages,
} from "lucide-react";
import type { SiteSettings, Subject, Tutor, TutorApplication } from "@/lib/types";

interface Props {
  settings: SiteSettings;
  subjects: Subject[];
  tutors: Tutor[];
}

type Lang = "bn" | "en";

const KHULNA_AREAS = [
  "Sonadanga (সোনাডাঙ্গা)",
  "Boyra (বয়রা)",
  "Nirala (নিরালা)",
  "Khalishpur (খালিশপুর)",
  "Daulatpur (দৌলতপুর)",
  "Gollamari (গল্লামারী)",
  "Moylapota (ময়লাপোতা)",
  "Shib Bari (শিববাড়ি)",
  "Tutpara (টুটপাড়া)",
  "Rupsha / Other (অন্যান্য)",
];

export default function LandingClient({ settings, subjects, tutors }: Props) {
  const [lang, setLang] = useState<Lang>("bn");
  const [tutorFilter, setTutorFilter] = useState<string>("all");
  const trackedRef = useRef(false);

  // Application form state
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [college, setCollege] = useState("");
  const [hscBatch, setHscBatch] = useState("HSC 1st Year");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [area, setArea] = useState(KHULNA_AREAS[0]);
  const [fullAddress, setFullAddress] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [preferredTime, setPreferredTime] = useState("Afternoon (4:00 PM - 7:00 PM)");
  const [tutorGenderPref, setTutorGenderPref] = useState("Any");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedApp, setSubmittedApp] = useState<TutorApplication | null>(null);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || "",
      }),
    }).catch(() => {});
  }, []);

  const isBn = lang === "bn";

  const filteredTutors = tutors.filter((t) => {
    if (tutorFilter === "all") return true;
    if (tutorFilter === "kuet") return t.institution.toLowerCase().includes("kuet");
    if (tutorFilter === "kmc") return t.institution.toLowerCase().includes("medical");
    return true;
  });

  function handleSelectSubjectAndScroll(id: string) {
    setSubjectId(id);
    setSubmittedApp(null);
    const el = document.getElementById("apply");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          phone,
          guardianPhone,
          college,
          hscBatch,
          subjectId,
          area,
          fullAddress,
          daysPerWeek,
          preferredTime,
          tutorGenderPref,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
      } else {
        setSubmittedApp(data.application);
        setStudentName("");
        setPhone("");
        setGuardianPhone("");
        setCollege("");
        setFullAddress("");
        setNotes("");
      }
    } catch {
      setErrorMsg(
        isBn
          ? "সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Network error. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#0B162C]">
      {/* Announcement Bar */}
      {settings.announcementActive && (
        <div className="bg-[#0B162C] text-amber-100 text-xs sm:text-sm py-2.5 px-4 text-center border-b border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{isBn ? settings.announcementTextBn : settings.announcementText}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF8F4]/90 border-b border-[#0B162C]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0B162C] text-white flex items-center justify-center shadow-sm group-hover:bg-teal-800 transition-colors">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-none">
                {settings.brandName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-teal-800 font-semibold">
                {isBn ? "সিলেক্টিভ হোম টিউশন" : "Selective Home Tutors"}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#0B162C]/80">
            <a href="#why-us" className="hover:text-teal-800 transition-colors">
              {isBn ? "কেন আমরা ভিন্ন" : "Why Us"}
            </a>
            <a href="#subjects" className="hover:text-teal-800 transition-colors">
              {isBn ? "সাবজেক্টসমূহ" : "Subjects"}
            </a>
            <a href="#mentors" className="hover:text-teal-800 transition-colors">
              {isBn ? "আমাদের টিচার" : "Mentors"}
            </a>
            <a href="#apply" className="hover:text-teal-800 transition-colors">
              {isBn ? "আবেদন করুন" : "Apply"}
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLang(isBn ? "en" : "bn")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0B162C]/15 bg-white text-xs font-semibold hover:bg-[#0B162C]/5 transition-colors cursor-pointer"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-teal-700" />
              <span>{isBn ? "EN" : "বাংলা"}</span>
            </button>

            <a
              href="#apply"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs sm:text-sm font-semibold hover:bg-[#0D5E58] transition-colors shadow-sm"
            >
              <span>{isBn ? "টিউটর নিন" : "Apply Now"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#0B162C]/65 hover:text-[#0B162C] hover:bg-[#0B162C]/5 transition-colors"
              title="Admin Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#0B162C]/10">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 20%, rgba(15, 118, 110, 0.14), transparent 42%), radial-gradient(circle at 85% 15%, rgba(217, 119, 6, 0.12), transparent 38%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/10 border border-teal-800/20 text-teal-900 text-xs font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>{isBn ? settings.heroBadgeBn : settings.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.18] text-[#0B162C]">
                {isBn ? settings.heroTitleBn : settings.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#0B162C]/75 leading-relaxed max-w-2xl">
                {isBn ? settings.heroSubtitleBn : settings.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#apply"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B162C] text-white font-bold text-sm sm:text-base hover:bg-teal-900 transition-all shadow-lg shadow-[#0B162C]/15"
                >
                  <span>
                    {isBn
                      ? "হোম টিউটরের জন্য আবেদন করুন"
                      : "Apply for a Home Tutor"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#mentors"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#0B162C]/15 font-bold text-sm sm:text-base hover:border-teal-700/40 hover:bg-teal-50/40 transition-all"
                >
                  <span>
                    {isBn ? "অভিজ্ঞ মেন্টরদের দেখুন" : "Meet Our Mentors"}
                  </span>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 max-w-xl">
                <div className="rounded-xl bg-white/80 border border-[#0B162C]/10 p-3.5">
                  <div className="text-xs text-[#0B162C]/60 font-semibold">
                    {isBn ? "টিউটর সোর্স" : "Tutor Pool"}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-teal-900 mt-0.5">
                    KUET & KMC
                  </div>
                </div>
                <div className="rounded-xl bg-white/80 border border-[#0B162C]/10 p-3.5">
                  <div className="text-xs text-[#0B162C]/60 font-semibold">
                    {isBn ? "অধ্যয়নরত বর্ষ" : "Academic Year"}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#0B162C] mt-0.5">
                    {isBn ? "৩য় ও ৪র্থ বর্ষ" : "3rd & 4th Year"}
                  </div>
                </div>
                <div className="rounded-xl bg-white/80 border border-[#0B162C]/10 p-3.5">
                  <div className="text-xs text-[#0B162C]/60 font-semibold">
                    {isBn ? "বিভাগ" : "Division"}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-amber-800 mt-0.5">
                    HSC Science
                  </div>
                </div>
              </div>
            </div>

            {/* Right Selective Verification Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#0B162C] text-white p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-teal-500/15 blur-2xl" />
                <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-amber-300 font-bold">
                      {isBn ? "সিলেক্টিভ স্ট্যান্ডার্ড" : "Selective Vetting"}
                    </span>
                    <h2 className="text-lg font-bold mt-0.5">
                      {isBn
                        ? "টিউটর বাছাইয়ের ৪টি কঠোর শর্ত"
                        : "4-Step Mentor Qualification"}
                    </h2>
                  </div>
                  <Award className="w-7 h-7 text-amber-300 shrink-0" />
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {isBn
                          ? "শুধুমাত্র KUET ও খুলনা মেডিকেল"
                          : "Exclusively KUET & Khulna Medical"}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        {isBn
                          ? "৩য় ও ৪র্থ বর্ষের শিক্ষার্থী—যাদের নিজস্ব সাবজেক্টে গভীর দখল রয়েছে।"
                          : "3rd & 4th year students with proven mastery in Engineering & Medical sciences."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {isBn
                          ? "বহু বছরের পড়ানোর বাস্তব অভিজ্ঞতা"
                          : "Multi-Year Teaching Track Record"}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        {isBn
                          ? "নতুন বা অনভিজ্ঞ কাউকে নয়; কেবল অভিজ্ঞ মেন্টরদেরই বাসায় পাঠানো হয়।"
                          : "No fresh/untested tutors. Every teacher has years of prior HSC mentoring."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {isBn
                          ? "সাবজেক্ট-ভিত্তিক স্পেশালাইজেশন"
                          : "Dedicated Subject Matching"}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        {isBn
                          ? "ফিজিক্স ও ম্যাথে কুয়েটের এবং বায়োলজি ও কেমিস্ট্রিতে মেডিকেল ও কুয়েটের সেরা মেন্টর।"
                          : "Physics & Math by KUET; Biology & Chemistry by Khulna Medical & KUET mentors."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {isBn
                          ? "গতানুগতিক মিডিয়া কমিশন মডেল নয়"
                          : "Zero Tuition-Media Compromise"}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        {isBn
                          ? "টিউশন মিলিয়ে দিয়েই দায়িত্ব শেষ নয়—নিয়মিত প্রগ্রেস ও গাইডলাইন ফলোআপ।"
                          : "Direct academic accountability instead of random agency forwarding."}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ANTI-TUITION-MEDIA COMPARISON */}
        <section id="why-us" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-900/10 px-3 py-1 rounded-full">
              {isBn ? "আমাদের দর্শন" : "Our Philosophy"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {isBn ? settings.antiMediaTitleBn : settings.antiMediaTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#0B162C]/75 leading-relaxed">
              {isBn ? settings.antiMediaDescriptionBn : settings.antiMediaDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Conventional Tuition Media */}
            <div className="rounded-2xl bg-white border border-rose-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-rose-950">
                    {isBn ? "গতানুগতিক টিউশন মিডিয়া" : "Conventional Tuition Media"}
                  </h3>
                  <p className="text-xs text-rose-700/80">
                    {isBn ? "যা আমরা কখনোই করি না" : "What we strictly reject"}
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-[#0B162C]/75">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "অভিজ্ঞতা বা পড়ানোর দক্ষতা যাচাই না করেই যেকোনো টিউটর পাঠিয়ে দেয়।"
                      : "Sends unvetted tutors without checking teaching experience or subject depth."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "শুধুমাত্র কমিশন আদায়ই মূল লক্ষ্য—শিক্ষার্থীর রেজাল্ট নিয়ে কোনো দায়বদ্ধতা নেই।"
                      : "Commission-first mindset with zero follow-up on student improvement."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "১ম বর্ষের অনভিজ্ঞ টিচার দিয়ে বোর্ড ও এডমিশন লেভেলের HSC সায়েন্স পড়ানো।"
                      : "Assigns inexperienced freshmen to critical HSC Science board & admission prep."}
                  </span>
                </li>
              </ul>
            </div>

            {/* BiddyaScope Selective Standard */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0B162C] to-[#11274B] text-white p-6 sm:p-8 shadow-xl border border-teal-500/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {isBn ? "BiddyaScope সিলেক্টিভ মেন্টরশিপ" : "BiddyaScope Selective Standard"}
                  </h3>
                  <p className="text-xs text-teal-300">
                    {isBn ? "অভিজ্ঞতা ও মানের শতভাগ নিশ্চয়তা" : "Curated quality & accountability"}
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-white/85">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "১০০% সিলেক্টিভ টিচার—সবাই KUET ও খুলনা মেডিকেলের ৩য় ও ৪র্থ বর্ষের শিক্ষার্থী।"
                      : "100% selective mentors—strictly 3rd & 4th year students of KUET & Khulna Medical College."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "প্রত্যেক টিচারের ২–৪+ বছরের বাস্তব পড়ানোর অভিজ্ঞতা ও স্টুডেন্ট রিভিউ যাচাইকৃত।"
                      : "Every mentor holds 2–4+ years of proven HSC home-tutoring experience."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "অভিভাবকের সাথে সরাসরি সমন্বয় এবং নিয়মিত প্রগ্রেস ট্র্যাকিং।"
                      : "Direct guardian coordination, trial validation, and continuous academic tracking."}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SUBJECTS SECTION */}
        <section id="subjects" className="py-16 bg-white border-y border-[#0B162C]/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  HSC Science Only
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                  {isBn
                    ? "বর্তমানে যেসব সাবজেক্টে হোম টিউটর দেওয়া হচ্ছে"
                    : "Active HSC Science Subjects"}
                </h2>
                <p className="text-sm text-[#0B162C]/70 mt-1">
                  {isBn
                    ? "যেকোনো সাবজেক্টে ক্লিক করে সরাসরি হোম টিউটরের আবেদন ফরমে চলে যান।"
                    : "Select a subject below to jump directly to the application form."}
                </p>
              </div>
              <div className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-2 rounded-xl">
                {isBn
                  ? `মোট সক্রিয় সাবজেক্ট: ${subjects.length}টি`
                  : `${subjects.length} Active Subjects`}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {subjects.map((subj) => (
                <div
                  key={subj.id}
                  className="group rounded-2xl bg-[#FAF8F4] border border-[#0B162C]/10 p-6 flex flex-col justify-between hover:border-teal-700/40 hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-10 h-10 rounded-xl bg-[#0B162C] text-amber-300 flex items-center justify-center group-hover:bg-teal-800 transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-[#0B162C]/10 text-[#0B162C]/70">
                        {subj.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B162C]">
                      {isBn ? subj.nameBn || subj.name : subj.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0B162C]/70 mt-2 leading-relaxed">
                      {isBn
                        ? subj.descriptionBn || subj.description
                        : subj.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectSubjectAndScroll(subj.id)}
                    className="mt-5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white border border-[#0B162C]/15 text-xs font-bold text-[#0B162C] group-hover:bg-[#0F766E] group-hover:text-white group-hover:border-[#0F766E] transition-colors cursor-pointer"
                  >
                    <span>
                      {isBn ? "এই সাবজেক্টে এপ্লাই করুন" : "Apply for This Subject"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MENTORS ROSTER */}
        <section id="mentors" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-900/10 px-3 py-1 rounded-full">
                {isBn ? "ভেরিফায়েড মেন্টর প্যানেল" : "Verified Faculty Pool"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                {isBn
                  ? "KUET ও খুলনা মেডিকেলের অভিজ্ঞ টিচারবৃন্দ"
                  : "Experienced 3rd & 4th Year Mentors"}
              </h2>
              <p className="text-sm text-[#0B162C]/70 mt-1">
                {isBn
                  ? "আমাদের প্রতিটি টিচার ৩য় বা ৪র্থ বর্ষের শিক্ষার্থী এবং একাধিক বছর ধরে HSC Science পড়াচ্ছেন।"
                  : "Every tutor is carefully selected from KUET & Khulna Medical College with years of teaching experience."}
              </p>
            </div>

            <div className="inline-flex rounded-xl bg-white border border-[#0B162C]/10 p-1 self-start">
              {[
                { key: "all", label: isBn ? "সকল মেন্টর" : "All Mentors" },
                { key: "kuet", label: "KUET" },
                { key: "kmc", label: isBn ? "খুলনা মেডিকেল" : "Khulna Medical" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setTutorFilter(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    tutorFilter === tab.key
                      ? "bg-[#0B162C] text-white"
                      : "text-[#0B162C]/70 hover:text-[#0B162C]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredTutors.map((tutor) => {
              const isMedical = tutor.institution.toLowerCase().includes("medical");
              return (
                <div
                  key={tutor.id}
                  className="rounded-2xl bg-white border border-[#0B162C]/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            isMedical
                              ? "bg-emerald-900/10 text-emerald-800"
                              : "bg-indigo-900/10 text-indigo-900"
                          }`}
                        >
                          {isMedical ? (
                            <Stethoscope className="w-6 h-6" />
                          ) : (
                            <Cpu className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg text-[#0B162C]">
                            {tutor.name}
                          </h3>
                          <p className="text-xs font-bold text-teal-800">
                            {tutor.institution} • {tutor.yearOfStudy}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shrink-0">
                        <Clock className="w-3 h-3" />
                        {tutor.experienceYears}+ {isBn ? "বছর অভিজ্ঞতা" : "Yrs Exp."}
                      </span>
                    </div>

                    {tutor.department && (
                      <p className="text-xs font-semibold text-[#0B162C]/60 mt-3">
                        {tutor.department}
                      </p>
                    )}

                    <p className="text-sm text-[#0B162C]/80 mt-2.5 leading-relaxed">
                      {isBn ? tutor.taglineBn || tutor.tagline : tutor.tagline}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#0B162C]/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.subjects.map((sub) => (
                        <span
                          key={sub}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FAF8F4] border border-[#0B162C]/10 text-[#0B162C]"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {isBn ? "সিলেক্টিভ ভেরিফায়েড" : "Verified"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STUDENT APPLICATION FORM */}
        <section
          id="apply"
          className="py-16 sm:py-20 bg-[#0B162C] text-white border-t border-white/10"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                {isBn ? "হোম টিউটর আবেদন" : "Student Application"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {isBn
                  ? "আপনার বাসার জন্য অভিজ্ঞ হোম টিউটর অনুরোধ করুন"
                  : "Request a Selective Home Tutor"}
              </h2>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                {isBn
                  ? "ফরমটি পূরণ করুন। আপনার পছন্দের সাবজেক্ট ও এলাকা অনুযায়ী আমাদের টিম কুয়েট অথবা খুলনা মেডিকেলের সবচেয়ে উপযুক্ত ৩য়/৪র্থ বর্ষের মেন্টরকে নির্ধারণ করে ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।"
                  : "Fill out your HSC Science requirements. Our academic coordinator will match you with a vetted 3rd or 4th year KUET or Khulna Medical mentor within 24 hours."}
              </p>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">
                      {isBn ? "সার্ভিস এরিয়া" : "Service Coverage"}
                    </span>
                    <span className="text-white/70 text-xs">
                      {isBn ? settings.serviceAreaBn : settings.serviceArea}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-white/85 font-semibold">
                    {settings.contactPhone}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submittedApp ? (
                <div className="rounded-2xl bg-white text-[#0B162C] p-7 sm:p-9 shadow-2xl space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold">
                      {isBn
                        ? "আপনার আবেদন সফলভাবে জমা হয়েছে!"
                        : "Application Submitted Successfully!"}
                    </h3>
                    <p className="text-sm text-[#0B162C]/70 mt-1">
                      {isBn
                        ? "খুব শীঘ্রই আমাদের টিম আপনার নম্বরে যোগাযোগ করে অভিজ্ঞ মেন্টর কনফার্ম করবে।"
                        : "Our academic team will reach out shortly to confirm your selective home tutor match."}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#FAF8F4] border border-[#0B162C]/10 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#0B162C]/60">
                        {isBn ? "ট্র্যাকিং কোড:" : "Tracking Code:"}
                      </span>
                      <span className="font-mono-code font-bold text-teal-800">
                        {submittedApp.trackingCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#0B162C]/60">
                        {isBn ? "শিক্ষার্থী:" : "Student:"}
                      </span>
                      <span className="font-bold">{submittedApp.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#0B162C]/60">
                        {isBn ? "সাবজেক্ট:" : "Subject:"}
                      </span>
                      <span className="font-bold">{submittedApp.subjectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#0B162C]/60">
                        {isBn ? "এলাকা:" : "Area:"}
                      </span>
                      <span className="font-bold">{submittedApp.area}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedApp(null)}
                      className="px-5 py-2.5 rounded-xl bg-[#0B162C] text-white text-sm font-bold hover:bg-teal-900 transition-colors cursor-pointer"
                    >
                      {isBn ? "আরেকটি আবেদন করুন" : "Submit Another Application"}
                    </button>
                    {settings.whatsappNumber && (
                      <a
                        href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hello BiddyaScope, I submitted a home tutor request (${submittedApp.trackingCode}) for ${submittedApp.subjectName}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl bg-white text-[#0B162C] p-6 sm:p-8 shadow-2xl space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn ? "শিক্ষার্থীর নাম *" : "Student Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder={isBn ? "যেমন: সাদমান সাকিব" : "e.g., Sadman Sakib"}
                        className="w-full rounded-xl border border-[#0B162C]/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full rounded-xl border border-[#0B162C]/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn
                          ? "অভিভাবকের নম্বর (ঐচ্ছিক)"
                          : "Guardian Phone (Optional)"}
                      </label>
                      <input
                        type="tel"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        placeholder="018XXXXXXXX"
                        className="w-full rounded-xl border border-[#0B162C]/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn ? "কলেজের নাম" : "College Name"}
                      </label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder={
                          isBn
                            ? "যেমন: সরকারি বিএল / এমএম সিটি কলেজ"
                            : "e.g., Govt. MM City College"
                        }
                        className="w-full rounded-xl border border-[#0B162C]/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown + Batch */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn
                          ? "সাবজেক্ট নির্বাচন করুন (HSC Science) *"
                          : "Select Subject (HSC Science) *"}
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={subjectId}
                          onChange={(e) => setSubjectId(e.target.value)}
                          className="w-full appearance-none rounded-xl border-2 border-teal-700/30 bg-teal-50/40 px-3.5 py-2.5 pr-9 text-sm font-bold text-[#0B162C] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                        >
                          {subjects.length === 0 && (
                            <option value="">No active subjects</option>
                          )}
                          {subjects.map((subj) => (
                            <option key={subj.id} value={subj.id}>
                              {isBn
                                ? `${subj.nameBn || subj.name} — ${subj.level}`
                                : `${subj.name} (${subj.level})`}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-teal-800 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn ? "শ্রেণি / ব্যাচ *" : "HSC Batch *"}
                      </label>
                      <div className="relative">
                        <select
                          value={hscBatch}
                          onChange={(e) => setHscBatch(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-[#0B162C]/15 bg-white px-3.5 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                        >
                          <option value="HSC 1st Year">
                            {isBn ? "HSC ১ম বর্ষ (1st Year)" : "HSC 1st Year"}
                          </option>
                          <option value="HSC 2nd Year">
                            {isBn ? "HSC ২য় বর্ষ (2nd Year)" : "HSC 2nd Year"}
                          </option>
                          <option value="HSC Test / Board Exam">
                            {isBn
                              ? "HSC পরীক্ষার্থী (Board Candidate)"
                              : "HSC Board Candidate"}
                          </option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#0B162C]/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Area + Days */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn ? "এলাকা (খুলনা) *" : "Area / Location *"}
                      </label>
                      <div className="relative">
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-[#0B162C]/15 bg-white px-3.5 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                        >
                          {KHULNA_AREAS.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#0B162C]/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn ? "সপ্তাহে কত দিন পড়বেন?" : "Days per Week"}
                      </label>
                      <div className="relative">
                        <select
                          value={daysPerWeek}
                          onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                          className="w-full appearance-none rounded-xl border border-[#0B162C]/15 bg-white px-3.5 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                        >
                          {[2, 3, 4, 5, 6].map((d) => (
                            <option key={d} value={d}>
                              {d} {isBn ? "দিন / সপ্তাহ" : "Days / Week"}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#0B162C]/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn ? "পূর্ণ ঠিকানা" : "Detailed Address"}
                      </label>
                      <input
                        type="text"
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        placeholder={
                          isBn ? "বাসা/রোড নম্বর..." : "House / Road details..."
                        }
                        className="w-full rounded-xl border border-[#0B162C]/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {isBn ? "টিউটর পছন্দ" : "Mentor Preference"}
                      </label>
                      <div className="relative">
                        <select
                          value={tutorGenderPref}
                          onChange={(e) => setTutorGenderPref(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-[#0B162C]/15 bg-white px-3.5 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                        >
                          <option value="Any">
                            {isBn ? "যেকোনো (KUET / KMC)" : "Any (KUET / KMC)"}
                          </option>
                          <option value="KUET Preferred">
                            {isBn ? "KUET শিক্ষার্থী" : "KUET Preferred"}
                          </option>
                          <option value="Khulna Medical Preferred">
                            {isBn
                              ? "খুলনা মেডিকেল শিক্ষার্থী"
                              : "Khulna Medical Preferred"}
                          </option>
                          <option value="Male Tutor">
                            {isBn ? "পুরুষ টিউটর" : "Male Tutor"}
                          </option>
                          <option value="Female Tutor">
                            {isBn ? "মহিলা টিউটর" : "Female Tutor"}
                          </option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#0B162C]/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5">
                      {isBn
                        ? "পছন্দের সময় / বিশেষ নোট (ঐচ্ছিক)"
                        : "Preferred Time & Notes (Optional)"}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        isBn
                          ? "যেমন: বিকাল ৫টার পর, অথবা নির্দিষ্ট কোন অধ্যায়ে দুর্বলতা..."
                          : "e.g., After 5 PM, need focus on Organic Chemistry or Calculus..."
                      }
                      className="w-full rounded-xl border border-[#0B162C]/15 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || subjects.length === 0}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0F766E] text-white font-bold text-sm sm:text-base hover:bg-[#0D5E58] disabled:opacity-60 transition-all shadow-lg shadow-teal-900/15 cursor-pointer"
                  >
                    {submitting
                      ? isBn
                        ? "জমা হচ্ছে..."
                        : "Submitting..."
                      : isBn
                      ? "হোম টিউটরের আবেদন জমা দিন"
                      : "Submit Home Tutor Application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#070E1C] text-white/75 py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <GraduationCap className="w-5 h-5 text-amber-300" />
              <span>{settings.brandName}</span>
            </div>
            <p className="text-xs mt-1.5 max-w-md text-white/60">
              {isBn ? settings.footerTaglineBn : settings.footerTagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs">
            <span>{settings.contactPhone}</span>
            <span>{settings.contactEmail}</span>
            <Link
              href="/admin"
              className="text-amber-300 hover:underline font-semibold"
            >
              Admin Dashboard →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
