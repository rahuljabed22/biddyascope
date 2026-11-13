"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Languages,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import type { SiteSettings, Subject } from "@/lib/types";
import {
  formatBdPhoneDisplay,
  toTelHref,
  toWhatsAppDigits,
} from "@/lib/contact";
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

      {/* Navbar with Uploaded Logo Only (No 'BiddyaScope' text) */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-[#0B162C]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="বিদ্যাস্কোপ"
              width={636}
              height={488}
              priority
              className="h-14 sm:h-16 w-auto object-contain"
            />
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0B162C]/15 bg-[#FAF8F4] text-xs font-semibold hover:bg-[#0B162C]/5 transition-colors cursor-pointer"
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
                <div className="rounded-xl bg-white/90 border border-[#0B162C]/10 p-3.5">
                  <div className="text-xs text-[#0B162C]/60 font-semibold">
                    {isBn ? "টিউটর সার্কল" : "Trusted Circle"}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-teal-900 mt-0.5">
                    KUET & KMC
                  </div>
                </div>
                <div className="rounded-xl bg-white/90 border border-[#0B162C]/10 p-3.5">
                  <div className="text-xs text-[#0B162C]/60 font-semibold">
                    {isBn ? "ক্লাস ফোকাস" : "Focus Only"}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#0B162C] mt-0.5">
                    HSC Science
                  </div>
                </div>
                <div className="rounded-xl bg-white/90 border border-[#0B162C]/10 p-3.5">
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
              <div className="rounded-2xl bg-white text-[#0B162C] p-6 sm:p-8 shadow-xl shadow-[#0B162C]/5 border border-[#0B162C]/10 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#0B162C]/10 pb-4 mb-5">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-amber-700 font-bold">
                      {isBn ? "আমাদের নিজস্ব উদ্যোগ" : "Our Own Effort"}
                    </span>
                    <h2 className="text-lg font-extrabold mt-0.5">
                      {isBn
                        ? "টিউটর সিলেকশনের ৪টি মূলনীতি"
                        : "4 Pillars of Our Selective Model"}
                    </h2>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-amber-700" />
                  </div>
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {isBn
                          ? "নিজেদের বন্ধু ও ছোট ভাই-বোনদের প্রচেষ্টা"
                          : "Built With Trusted Friends & Juniors"}
                      </p>
                      <p className="text-[#0B162C]/70 text-xs mt-0.5">
                        {isBn
                          ? "বাইরের অচেনা কাউকে নয়—আমাদের নিজের পরিচিত KUET ও খুলনা মেডিকেলের (৩য় ও ৪র্থ বর্ষ) সার্কল থেকেই টিচার নেওয়া হয়।"
                          : "No random outsiders—only trusted friends and juniors from KUET & Khulna Medical (3rd & 4th Year)."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {isBn
                          ? "অন্যান্য মিডিয়ার মতো কমিশনভিত্তিক নয়"
                          : "Zero Tuition-Media Commission"}
                      </p>
                      <p className="text-[#0B162C]/70 text-xs mt-0.5">
                        {isBn
                          ? "গতানুগতিক টিউশন মিডিয়াগুলো যেভাবে কমিশনের জন্য কাজ করে, আমরা একদমই সেরকম নই—আমরা সম্পূর্ণ আলাদা।"
                          : "We completely reject commission-chasing media models and focus strictly on student outcomes."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {isBn
                          ? "দীর্ঘদিনের অভিজ্ঞ ও শুধুই HSC টিউটর"
                          : "Long-Experienced HSC-Only Mentors"}
                      </p>
                      <p className="text-[#0B162C]/70 text-xs mt-0.5">
                        {isBn
                          ? "যারা অনেকদিন ধরে পড়াচ্ছেন এবং শুধুমাত্র HSC Science পড়ান, কেবল তাদেরকেই বাছাই করে বাসায় পাঠানো হয়।"
                          : "Every teacher has multi-year experience and teaches exclusively HSC Science."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {isBn
                          ? "বাসায় একেবারেই ভেরিফায়েড ও সিলেক্টিভ টিচার"
                          : "Verified Selective Home Delivery"}
                      </p>
                      <p className="text-[#0B162C]/70 text-xs mt-0.5">
                        {isBn
                          ? "১টি বা ২টি সাবজেক্ট এবং একা কিংবা ২–৩ জনের গ্রুপে পড়ার সুযোগ—সরাসরি ভেরিফায়েড মেন্টর।"
                          : "1 or 2 subjects, solo or 2–3 student batch matching—always verified before visiting."}
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
              {isBn ? "আমাদের দর্শন ও প্রচেষ্টা" : "Our Philosophy"}
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
                      ? "অন্যান্য গতানুগতিক টিউশন মিডিয়া"
                      : "Conventional Tuition Media"}
                  </h3>
                  <p className="text-xs text-rose-700/80">
                    {isBn ? "যা আমরা একদমই নই" : "What we completely reject"}
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-[#0B162C]/75">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "কমিশনভিত্তিক ব্যবসা—কমিশন পেলেই যাকে-তাকে যাচাই ছাড়াই বাসায় পাঠিয়ে দেয়।"
                      : "Commission-based model—sends anyone available without real vetting."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "অনেকদিন পড়ানোর বাস্তব অভিজ্ঞতা আছে কি না বা শুধু HSC পড়ায় কি না তা দেখে না।"
                      : "Does not verify multi-year experience or dedicated HSC Science specialization."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "টিউশন মিলিয়ে দেওয়ার পর শিক্ষার্থী বা অভিভাবকের সাথে কোনো দায়বদ্ধতা থাকে না।"
                      : "Zero personal accountability once the initial introduction is over."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Our Own Selective Effort */}
            <div className="rounded-2xl bg-white border-2 border-teal-700/30 p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0B162C]">
                    {isBn
                      ? "আমাদের নিজস্ব সিলেক্টিভ প্রচেষ্টা"
                      : "Our Selective Mentor Standard"}
                  </h3>
                  <p className="text-xs text-teal-800 font-semibold">
                    {isBn
                      ? "সম্পূর্ণ আলাদা, স্বচ্ছ ও ভেরিফায়েড সিস্টেম"
                      : "Completely different, verified & personal"}
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-[#0B162C]/85">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "এটা আমাদের নিজেদেরই উদ্যোগ—নিজেদের পরিচিত বন্ধু ও ছোট ভাই-বোনদের (KUET ও খুলনা মেডিকেল) মধ্য থেকেই সিলেক্টিভ টিচার বাছাই।"
                      : "Our own initiative—mentors are handpicked from our trusted friends and juniors at KUET & Khulna Medical College."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "কেবল যারা অনেকদিন ধরে পড়াচ্ছেন, অভিজ্ঞ এবং শুধুমাত্র HSC-ই পড়ান—শুধু তাদেরকেই রাখা হয়।"
                      : "Only long-experienced tutors who teach exclusively HSC Science are selected."}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "স্টুডেন্টের বাসায় একেবারেই ভেরিফায়েড টিচার পাঠানো হয়—একা অথবা ২–৩ জনের গ্রুপে পড়ার পূর্ণ সুবিধা।"
                      : "Only verified teachers visit the student's home—with flexible solo or 2–3 student batch matching."}
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

        {/* LIGHT THEME STUDENT APPLICATION SECTION ABOVE FOOTER */}
        <section
          id="apply"
          className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF8F4] to-white text-[#0B162C] border-t border-[#0B162C]/10"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-teal-900 bg-teal-900/10 border border-teal-800/20 px-3 py-1 rounded-full">
                {isBn ? "হোম টিউটর রেজিস্ট্রেশন" : "Student Registration"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {isBn
                  ? "বাসায় ভেরিফায়েড ও সিলেক্টিভ হোম টিউটরের জন্য আবেদন করুন"
                  : "Request a Verified, Selective Home Tutor"}
              </h2>
              <p className="text-sm sm:text-base text-[#0B162C]/75 leading-relaxed">
                {isBn
                  ? "অন্য টিউশন মিডিয়ার মতো কমিশনভিত্তিক কোনো ব্যবস্থা নয়—নিজেদের পরিচিত অভিজ্ঞ বন্ধু ও ছোট ভাই-বোনদের (KUET ও খুলনা মেডিকেল) মধ্য থেকে শুধুমাত্র HSC-তে দক্ষ মেন্টরকেই আপনার বাসায় পাঠানো হয়।"
                  : "No commission-based tuition media shortcuts—we match you with a long-experienced, verified HSC Science mentor from our own KUET & Khulna Medical circle."}
              </p>

              {/* Group Batch Policy Highlight */}
              <div className="rounded-2xl bg-amber-50 border border-amber-300/80 p-4 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-amber-950 text-xs font-extrabold uppercase tracking-wider">
                  <Users className="w-4 h-4 text-amber-700" />
                  <span>
                    {isBn
                      ? "২–৩ জনের ছোট গ্রুপ ব্যাচ সুবিধা"
                      : "2–3 Student Group Batch Policy"}
                  </span>
                </div>
                <p className="text-xs text-amber-950/85 leading-relaxed">
                  {isBn
                    ? "আপনি যদি ২–৩ জনের সাথে একসাথে পড়তে চান, সমস্যা নেই! আপাতত রেজিস্ট্রেশন করে রাখুন। আপনার এলাকায় আরও কেউ একই সাবজেক্টে রেজিস্ট্রেশন করলে আমরা আপনাদের একসাথে ম্যাচ করানোর চেষ্টা করব। ব্যাচ অ্যাপ্রুভ হলেই একসাথে পড়তে পারবেন।"
                    : "Want to study with 2–3 students? Register now! When other students in your area apply for the same subject, we'll match you together and start once the batch is approved."}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#0B162C]/10 p-5 space-y-3 text-sm shadow-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B162C]">
                      {isBn ? "সার্ভিস এরিয়া" : "Service Coverage"}
                    </span>
                    <span className="text-[#0B162C]/70 text-xs">
                      {isBn ? settings.serviceAreaBn : settings.serviceArea}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-teal-700 shrink-0" />
                  <a
                    href={toTelHref(settings.contactPhone)}
                    className="text-[#0B162C]/85 font-semibold hover:text-teal-800 hover:underline"
                  >
                    {isBn ? "কল:" : "Phone:"}{" "}
                    {formatBdPhoneDisplay(settings.contactPhone)}
                  </a>
                </div>
                {toWhatsAppDigits(settings.whatsappNumber) && (
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                    <a
                      href={`https://wa.me/${toWhatsAppDigits(settings.whatsappNumber)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0B162C]/85 font-semibold hover:text-emerald-800 hover:underline"
                    >
                      WhatsApp: {formatBdPhoneDisplay(settings.whatsappNumber)}
                    </a>
                  </div>
                )}
                <div className="pt-2 border-t border-[#0B162C]/10">
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:underline"
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

      {/* CLEAN LIGHT FOOTER WITH LOGO (NO 'BiddyaScope' text) */}
      <footer className="bg-white text-[#0B162C]/75 py-10 border-t border-[#0B162C]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <Image
              src="/logo.png"
              alt="বিদ্যাস্কোপ"
              width={636}
              height={488}
              className="h-12 w-auto object-contain"
            />
            <p className="text-xs max-w-md text-[#0B162C]/65">
              {isBn ? settings.footerTaglineBn : settings.footerTagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs">
            <a
              href={toTelHref(settings.contactPhone)}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0B162C] hover:text-teal-800 hover:underline"
            >
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              <span>{formatBdPhoneDisplay(settings.contactPhone)}</span>
            </a>
            {toWhatsAppDigits(settings.whatsappNumber) && (
              <a
                href={`https://wa.me/${toWhatsAppDigits(settings.whatsappNumber)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp: {formatBdPhoneDisplay(settings.whatsappNumber)}</span>
              </a>
            )}
            <span>{settings.contactEmail}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
