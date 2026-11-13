"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Languages,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { SiteSettings, Subject } from "@/lib/types";
import {
  formatBdPhoneDisplay,
  toTelHref,
  toWhatsAppDigits,
} from "@/lib/contact";
import TutorApplicationForm, { type Lang } from "./TutorApplicationForm";
import FreeDemoNotice from "./FreeDemoNotice";

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

      {/* Clean Light Header with Uploaded Logo Only (No 'BiddyaScope' text) */}
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

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLang(isBn ? "en" : "bn")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0B162C]/15 bg-[#FAF8F4] text-xs font-semibold hover:bg-[#0B162C]/5 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-teal-700" />
              <span>{isBn ? "EN" : "বাংলা"}</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#0B162C]/15 text-xs font-bold hover:bg-[#FAF8F4] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBn ? "মূল ওয়েবসাইট" : "Main Site"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Light Theme Landing Body + Registration Form */}
      <main className="flex-1 bg-gradient-to-b from-[#FAF8F4] via-[#FAF8F4] to-white py-5 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column on Desktop (Second on Mobile): Authentic Personal-Effort Story + Combo & Group Rules */}
          <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/10 border border-teal-800/20 text-teal-900 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>
                {isBn
                  ? "আমাদের নিজস্ব সিলেক্টিভ উদ্যোগ • খুলনা"
                  : "Our Own Selective Initiative • Khulna"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[#0B162C]">
              {isBn
                ? "ভেরিফায়েড ও অভিজ্ঞ HSC হোম টিউটরের জন্য রেজিস্ট্রেশন করুন"
                : "Register for a Verified, Selective HSC Home Tutor"}
            </h1>

            <p className="text-sm sm:text-base text-[#0B162C]/75 leading-relaxed">
              {isBn
                ? "আমরা গতানুগতিক কোনো টিউশন মিডিয়া নই। অন্যান্য টিউশন মিডিয়াগুলোর মতো কমিশনভিত্তিক কাজ আমরা একদমই করি না—আমরা সম্পূর্ণ আলাদা।"
                : "We are NOT a conventional, commission-based tuition media. We operate completely differently from agency models."}
            </p>

            {/* Personal Circle & Anti-Media Card (Light Theme) */}
            <div className="rounded-2xl bg-white border border-teal-700/20 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-teal-900 font-extrabold text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  {isBn
                    ? "কেন আমরা সম্পূর্ণ ভিন্ন ও নির্ভরযোগ্য?"
                    : "Why Our Initiative Is Completely Different"}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#0B162C]/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "এটি আমাদের নিজেদেরই একটি প্রচেষ্টা—কেবল আমাদের নিজেদের বন্ধু ও ছোট ভাই-বোনদের (KUET ও খুলনা মেডিকেল) নিয়েই এই উদ্যোগ।"
                      : "This is our own personal effort—built exclusively with trusted friends and juniors from KUET & Khulna Medical College."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "যারা দীর্ঘদিন ধরে পড়াচ্ছেন, অনেক অভিজ্ঞ এবং শুধুমাত্র HSC Science-ই পড়ান—আমরা কেবল তাদেরকেই সিলেক্ট করি।"
                      : "We select only long-experienced mentors who teach exclusively HSC Science."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? "কোনো মিডিয়া কমিশনের তাড়া নয়—স্টুডেন্টের বাসায় একেবারেই ভেরিফায়েড ও সিলেক্টিভ টিচার পাঠানো হয়।"
                      : "Zero media-commission compromise—only verified, selective teachers are sent to your home."}
                  </span>
                </li>
              </ul>
            </div>

            {/* 1 or 2 Subjects Highlight */}
            <div className="rounded-2xl bg-white border border-[#0B162C]/10 p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#0B162C] font-extrabold text-sm">
                <Layers className="w-4 h-4 text-teal-700" />
                <span>
                  {isBn
                    ? "১টি বা ২টি সাবজেক্ট (সেরা কম্বিনেশন)"
                    : "1 Subject or Best 2-Subject Combos"}
                </span>
              </div>
              <p className="text-xs text-[#0B162C]/75 leading-relaxed">
                {isBn
                  ? "ফিজিক্স, কেমিস্ট্রি, হায়ার ম্যাথ বা বায়োলজি—যেকোনো ১টি সাবজেক্ট নিতে পারেন অথবা সেরা ২-সাবজেক্ট কম্বিনেশন (যেমন Physics + Higher Math বা Biology + Chemistry) বেছে নিতে পারেন।"
                  : "Choose any single HSC Science subject (Physics, Chemistry, Higher Math, Biology) or select one of our best 2-subject pairings."}
              </p>
            </div>

            {/* Solo OR 2-3 Student Group Highlight */}
            <div className="rounded-2xl bg-amber-50 border border-amber-300/80 p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-extrabold text-sm">
                <Users className="w-4 h-4 text-amber-700" />
                <span>
                  {isBn
                    ? "একা অথবা ২–৩ জন মিলে পড়ার সুবিধা"
                    : "Study Solo or in a 2–3 Student Group Batch"}
                </span>
              </div>
              <p className="text-xs text-amber-950/85 leading-relaxed">
                {isBn
                  ? "আপনি চাইলে একা (1-on-1) পড়তে পারেন, অথবা ২–৩ জন একসাথে ছোট ব্যাচেও পড়তে পারেন। ২–৩ জনের সাথে পড়তে চাইলে সমস্যা নেই—আপাতত রেজিস্ট্রেশন করে রাখুন। একই এলাকায় একই সাবজেক্টে আরও কেউ আবেদন করলে আমরা আপনাদের ম্যাচ করানোর চেষ্টা করব। ব্যাচ অ্যাপ্রুভ হলেই একসাথে পড়া শুরু করতে পারবেন।"
                  : "You can study 1-on-1 solo or join a 2–3 student small batch. Register now—when other students in your area apply for the same subject, we will match you together. Once the batch is approved, classes begin!"}
              </p>
            </div>

            {/* 2 Free Demo Classes Highlight */}
            <FreeDemoNotice isBn={isBn} />

            <div className="rounded-2xl bg-white border border-[#0B162C]/10 p-5 shadow-sm space-y-2.5 text-xs text-[#0B162C]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>{isBn ? settings.serviceAreaBn : settings.serviceArea}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-700 shrink-0" />
                <a
                  href={toTelHref(settings.contactPhone)}
                  className="font-semibold hover:text-teal-800 hover:underline"
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
                    className="font-semibold hover:text-emerald-800 hover:underline"
                  >
                    WhatsApp: {formatBdPhoneDisplay(settings.whatsappNumber)}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  {isBn
                    ? "আবেদন করার ২৪ ঘণ্টার মধ্যে যোগাযোগ করা হয়"
                    : "Coordinator contacts you within 24 hours"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column on Desktop (First on Mobile): Light Theme Application Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="lg:hidden mb-3.5 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-900/10 border border-teal-800/20 text-teal-900 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>
                  {isBn
                    ? "হোম টিউটর রেজিস্ট্রেশন ফর্ম • ২টি ডেমো ক্লাস ফ্রি"
                    : "Tutor Registration Form • 2 Free Demo Classes"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B162C]">
                {isBn
                  ? "ফর্ম পূরণ করে হোম টিউটরের আবেদন করুন"
                  : "Fill Out the Form for a Verified Home Tutor"}
              </h2>
            </div>
            <TutorApplicationForm
              lang={lang}
              subjects={subjects}
              settings={settings}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white text-[#0B162C]/75 py-8 border-t border-[#0B162C]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Image
              src="/logo.png"
              alt="বিদ্যাস্কোপ"
              width={636}
              height={488}
              className="h-10 w-auto object-contain self-start"
            />
            <span>{isBn ? settings.footerTaglineBn : settings.footerTagline}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
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
            <Link href="/" className="text-teal-800 hover:underline font-semibold">
              {isBn ? "মূল পেজ →" : "Home →"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
