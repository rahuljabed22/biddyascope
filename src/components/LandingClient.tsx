"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Languages,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import type { SiteSettings, Subject } from "@/lib/types";
import TutorApplicationForm, { type Lang } from "./TutorApplicationForm";

interface Props {
  settings: SiteSettings;
  subjects: Subject[];
}

export default function LandingClient({ settings, subjects }: Props) {
  const [lang, setLang] = useState<Lang>("bn");
  const [preselectedSubjectId, setPreselectedSubjectId] = useState<
    string | undefined
  >(undefined);
  const trackedRef = useRef(false);

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

  function handleSelectSubjectAndScroll(id: string) {
    setPreselectedSubjectId(id);
    const el = document.getElementById("apply");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#0B162C]">
      {/* Announcement Bar */}
      {settings.announcementActive && (
        <div className="bg-[#0B162C] text-amber-100 text-xs sm:text-sm py-2.5 px-4 text-center border-b border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {isBn ? settings.announcementTextBn : settings.announcementText}
            </span>
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
            <a href="#apply" className="hover:text-teal-800 transition-colors">
              {isBn ? "আবেদন ফর্ম" : "Apply Form"}
            </a>
            <Link href="/apply" className="hover:text-teal-800 transition-colors">
              {isBn ? "রেজিস্ট্রেশন পেজ" : "Direct Form Page"}
            </Link>
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

            <Link
              href="/apply"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs sm:text-sm font-semibold hover:bg-[#0D5E58] transition-colors shadow-sm"
            >
              <span>{isBn ? "টিউটর নিন" : "Apply Now"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

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
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B162C] text-white font-bold text-sm sm:text-base hover:bg-teal-900 transition-all shadow-lg shadow-[#0B162C]/15"
                >
                  <span>
                    {isBn
                      ? "হোম টিউটরের জন্য আবেদন করুন"
                      : "Apply for a Home Tutor"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#why-us"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#0B162C]/15 font-bold text-sm sm:text-base hover:border-teal-700/40 hover:bg-teal-50/40 transition-all"
                >
                  <span>
                    {isBn ? "কেন আমরা মিডিয়া নই" : "Why Not a Tuition Media"}
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
                    {isBn ? "পড়ার ধরন" : "Study Format"}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-amber-800 mt-0.5">
                    {isBn ? "একা / ২–৩ জন" : "Solo / 2–3 Group"}
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
                          ? "১টি বা ২টি সাবজেক্ট ও গ্রুপ ব্যাচের সুবিধা"
                          : "1 or 2 Subjects & Small Group Matching"}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        {isBn
                          ? "একা পড়তে পারেন অথবা ২–৩ জনের ব্যাচে ম্যাচিংয়ের জন্য রেজিস্ট্রেশন করতে পারেন।"
                          : "Study 1-on-1 solo or register to be matched into a 2–3 student batch."}
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
        <section
          id="why-us"
          className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6"
        >
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-900/10 px-3 py-1 rounded-full">
              {isBn ? "আমাদের দর্শন" : "Our Philosophy"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {isBn ? settings.antiMediaTitleBn : settings.antiMediaTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#0B162C]/75 leading-relaxed">
              {isBn
                ? settings.antiMediaDescriptionBn
                : settings.antiMediaDescription}
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
                    {isBn
                      ? "গতানুগতিক টিউশন মিডিয়া"
                      : "Conventional Tuition Media"}
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
                    {isBn
                      ? "BiddyaScope সিলেক্টিভ মেন্টরশিপ"
                      : "BiddyaScope Selective Standard"}
                  </h3>
                  <p className="text-xs text-teal-300">
                    {isBn
                      ? "অভিজ্ঞতা ও মানের শতভাগ নিশ্চয়তা"
                      : "Curated quality & accountability"}
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
                      ? "প্রত্যেক টিচারের বহু বছরের বাস্তব পড়ানোর অভিজ্ঞতা ও স্টুডেন্ট ফিডব্যাক যাচাইকৃত।"
                      : "Every mentor holds multi-year proven HSC home-tutoring experience."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "একা বা ২–৩ জনের ছোট ব্যাচ ম্যাচিং—অভিভাবকের সাথে সরাসরি সমন্বয় ও মনিটরিং।"
                      : "Flexible 1-on-1 or 2–3 student batch matching with direct guardian coordination."}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SUBJECTS SECTION */}
        <section
          id="subjects"
          className="py-16 bg-white border-y border-[#0B162C]/10"
        >
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
                    ? "যেকোনো ১টি সাবজেক্ট অথবা নিচের ফরম থেকে ২টি সাবজেক্টের সেরা কম্বো বেছে নিয়ে আবেদন করুন।"
                    : "Choose a single subject below or pick a best 2-subject combination in the form."}
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
                      {isBn
                        ? "এই সাবজেক্টে এপ্লাই করুন"
                        : "Apply for This Subject"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STUDENT APPLICATION FORM ABOVE FOOTER */}
        <section
          id="apply"
          className="py-16 sm:py-20 bg-[#0B162C] text-white border-t border-white/10"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-start">
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
                  ? "১টি বা ২টি সাবজেক্ট এবং একা বা ২–৩ জনের গ্রুপ ব্যাচ—আপনার পছন্দ অনুযায়ী আবেদন করুন। আমাদের টিম কুয়েট বা খুলনা মেডিকেলের সবচেয়ে উপযুক্ত ৩য়/৪র্থ বর্ষের মেন্টর নির্ধারণ করে যোগাযোগ করবে।"
                  : "Choose 1 or 2 subjects and solo or 2–3 student group format. Our academic coordinator will match you with a vetted 3rd or 4th year KUET or Khulna Medical mentor."}
              </p>

              {/* Group Batch Policy Highlight */}
              <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>
                    {isBn
                      ? "২–৩ জনের ছোট গ্রুপ ব্যাচ সুবিধা"
                      : "2–3 Student Group Batch Policy"}
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {isBn
                    ? "আপনি যদি ২–৩ জনের সাথে একসাথে পড়তে চান, সমস্যা নেই! আপাতত রেজিস্ট্রেশন করে রাখুন। আপনার এলাকায় আরও কেউ একই সাবজেক্টে রেজিস্ট্রেশন করলে আমরা আপনাদের একসাথে ম্যাচ করানোর চেষ্টা করব। ব্যাচ অ্যাপ্রুভ হলেই একসাথে পড়তে পারবেন।"
                    : "Want to study with 2–3 students? Register now! When other students in your area apply for the same subject, we'll match you together and start once the batch is approved."}
                </p>
              </div>

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
                <div className="pt-2 border-t border-white/10">
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>
                      {isBn
                        ? "আলাদা রেজিস্ট্রেশন ল্যান্ডিং পেজ (/apply) খুলুন"
                        : "Open Dedicated Application Page (/apply)"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <TutorApplicationForm
                lang={lang}
                subjects={subjects}
                settings={settings}
                preselectedSubjectId={preselectedSubjectId}
              />
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
              href="/apply"
              className="text-teal-300 hover:underline font-semibold"
            >
              {isBn ? "রেজিস্ট্রেশন পেজ (/apply)" : "Apply Page (/apply)"}
            </Link>
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
