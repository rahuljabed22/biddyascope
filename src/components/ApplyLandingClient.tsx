"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Languages,
  Layers,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { SiteSettings, Subject } from "@/lib/types";
import TutorApplicationForm, { type Lang } from "./TutorApplicationForm";

interface Props {
  settings: SiteSettings;
  subjects: Subject[];
}

export default function ApplyLandingClient({ settings, subjects }: Props) {
  const [lang, setLang] = useState<Lang>("bn");
  const trackedRef = useRef(false);
  const isBn = lang === "bn";

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#0B162C]">
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

      {/* Minimal Focused Landing Header */}
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
                {isBn ? "হোম টিউটর রেজিস্ট্রেশন" : "Home Tutor Registration"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLang(isBn ? "en" : "bn")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0B162C]/15 bg-white text-xs font-semibold hover:bg-[#0B162C]/5 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-teal-700" />
              <span>{isBn ? "EN" : "বাংলা"}</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#0B162C]/15 text-xs font-bold hover:bg-[#0B162C]/5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBn ? "মূল ওয়েবসাইট" : "Main Site"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Dedicated Landing Content + Application Form */}
      <main className="flex-1 bg-gradient-to-b from-[#0B162C] via-[#0B162C] to-[#112242] text-white py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Clear Offer + Group Batch & Combo Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              <span>
                {isBn
                  ? "সিলেক্টিভ HSC Science হোম টিউশন • খুলনা"
                  : "Selective HSC Science Home Tutoring • Khulna"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {isBn
                ? "অভিজ্ঞ KUET ও খুলনা মেডিকেল মেন্টরের জন্য রেজিস্ট্রেশন করুন"
                : "Register for a Selective KUET & Khulna Medical Mentor"}
            </h1>

            <p className="text-sm sm:text-base text-white/75 leading-relaxed">
              {isBn
                ? "আমরা গতানুগতিক কোনো টিউশন মিডিয়া নই। শুধুমাত্র কুয়েট ও খুলনা মেডিকেল কলেজের ৩য় ও ৪র্থ বর্ষের বহু বছরের পড়ানোর অভিজ্ঞতাসম্পন্ন বাছাইকৃত টিচারদেরই বাসায় পাঠানো হয়।"
                : "We are not a conventional tuition media. Only vetted, multi-year experienced 3rd & 4th year students from KUET & Khulna Medical College are assigned."}
            </p>

            {/* 1 or 2 Subjects Highlight */}
            <div className="rounded-2xl bg-white/5 border border-white/15 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>
                  {isBn
                    ? "১টি বা ২টি সাবজেক্ট (সেরা কম্বিনেশন)"
                    : "1 Subject or Best 2-Subject Combos"}
                </span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                {isBn
                  ? "ফিজিক্স, কেমিস্ট্রি, হায়ার ম্যাথ বা বায়োলজি—যেকোনো ১টি সাবজেক্ট নিতে পারেন অথবা সেরা ২-সাবজেক্ট কম্বিনেশন (যেমন Physics + Higher Math বা Biology + Chemistry) বেছে নিতে পারেন।"
                  : "Choose any single HSC Science subject (Physics, Chemistry, Higher Math, Biology) or select one of our best 2-subject pairings."}
              </p>
            </div>

            {/* Solo OR 2-3 Student Group Highlight */}
            <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>
                  {isBn
                    ? "একা অথবা ২–৩ জন মিলে পড়ার সুবিধা"
                    : "Study Solo or in a 2–3 Student Group Batch"}
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                {isBn
                  ? "আপনি চাইলে একা (1-on-1) পড়তে পারেন, অথবা ২–৩ জন একসাথে ছোট ব্যাচেও পড়তে পারেন। ২–৩ জনের সাথে পড়তে চাইলে সমস্যা নেই—আপাতত রেজিস্ট্রেশন করে রাখুন। একই এলাকায় একই সাবজেক্টে আরও কেউ আবেদন করলে আমরা আপনাদের ম্যাচ করানোর চেষ্টা করব। ব্যাচ অ্যাপ্রুভ হলেই একসাথে পড়া শুরু করতে পারবেন।"
                  : "You can study 1-on-1 solo or join a 2–3 student small batch. If you'd like to study with 2–3 peers, register now—when other students in your area apply for the same subject, we will match you together. Once the batch is approved, classes begin!"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{isBn ? settings.serviceAreaBn : settings.serviceArea}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="font-semibold">{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  {isBn
                    ? "সাবমিট করার ২৪ ঘণ্টার মধ্যে যোগাযোগ করা হয়"
                    : "Academic coordinator contacts you within 24 hours"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-7">
            <TutorApplicationForm
              lang={lang}
              subjects={subjects}
              settings={settings}
            />
          </div>
        </div>
      </main>

      <footer className="bg-[#070E1C] text-white/70 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-extrabold text-white">{settings.brandName}</span>{" "}
            — {isBn ? settings.footerTaglineBn : settings.footerTagline}
          </div>
          <div className="flex items-center gap-4">
            <span>{settings.contactPhone}</span>
            <Link href="/" className="text-amber-300 hover:underline font-semibold">
              {isBn ? "মূল পেজ →" : "Home →"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
