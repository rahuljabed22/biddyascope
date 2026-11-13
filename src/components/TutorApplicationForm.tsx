"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Layers,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import type { SiteSettings, Subject, TutorApplication } from "@/lib/types";
import { buildTwoSubjectCombos } from "@/lib/subjects-combo";
import { toWhatsAppDigits } from "@/lib/contact";

export type Lang = "bn" | "en";

export const KHULNA_AREAS = [
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

interface Props {
  lang: Lang;
  subjects: Subject[];
  settings: SiteSettings;
  preselectedSubjectId?: string;
}

export default function TutorApplicationForm({
  lang,
  subjects,
  settings,
  preselectedSubjectId,
}: Props) {
  const isBn = lang === "bn";
  const combos = useMemo(() => buildTwoSubjectCombos(subjects), [subjects]);

  const [subjectCount, setSubjectCount] = useState<1 | 2>(1);
  const [singleSubjectId, setSingleSubjectId] = useState<string>(
    subjects[0]?.id || ""
  );
  const [comboId, setComboId] = useState<string>(combos[0]?.id || "");

  const [studyMode, setStudyMode] = useState<"solo" | "group">("solo");
  const [groupPreference, setGroupPreference] = useState<string>(
    "Need matching with 1-2 other students in my area"
  );

  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [college, setCollege] = useState("");
  const [hscBatch, setHscBatch] = useState("HSC 1st Year");
  const [area, setArea] = useState(KHULNA_AREAS[0]);
  const [fullAddress, setFullAddress] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [tutorGenderPref, setTutorGenderPref] = useState("Any");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedApp, setSubmittedApp] = useState<TutorApplication | null>(
    null
  );

  useEffect(() => {
    if (preselectedSubjectId) {
      setSubjectCount(1);
      setSingleSubjectId(preselectedSubjectId);
      setSubmittedApp(null);
    }
  }, [preselectedSubjectId]);

  useEffect(() => {
    if (!singleSubjectId && subjects[0]) {
      setSingleSubjectId(subjects[0].id);
    }
  }, [subjects, singleSubjectId]);

  useEffect(() => {
    if (combos.length > 0 && !combos.some((c) => c.id === comboId)) {
      setComboId(combos[0].id);
    }
  }, [combos, comboId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const activeSelection = subjectCount === 2 ? comboId : singleSubjectId;

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
          subjectCount,
          subjectId: activeSelection,
          studyMode,
          groupPreference:
            studyMode === "group" ? groupPreference : "Solo (1-on-1)",
          area,
          fullAddress,
          daysPerWeek,
          preferredTime: "Afternoon / Evening",
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

  if (submittedApp) {
    return (
      <div className="rounded-2xl bg-white text-[#0B162C] p-7 sm:p-9 shadow-2xl space-y-5 border border-[#0B162C]/10">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold">
            {isBn
              ? "আপনার রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!"
              : "Registration Submitted Successfully!"}
          </h3>
          <p className="text-sm text-[#0B162C]/70 mt-1">
            {submittedApp.studyMode === "group"
              ? isBn
                ? "আপনার ২–৩ জনের গ্রুপ ব্যাচ আবেদনটি জমা হয়েছে। একই এলাকায় আরও শিক্ষার্থী মিললে বা আপনার গ্রুপ কনফার্ম হলে আমরা দ্রুত যোগাযোগ করে ব্যাচ অ্যাপ্রুভ করব।"
                : "Your 2–3 student group registration is saved. We will contact you as soon as a batch match in your area is ready for approval."
              : isBn
              ? "খুব শীঘ্রই আমাদের টিম আপনার নম্বরে যোগাযোগ করে অভিজ্ঞ মেন্টর কনফার্ম করবে।"
              : "Our academic team will reach out shortly to confirm your selective home tutor match."}
          </p>
        </div>

        <div className="rounded-xl bg-[#FAF8F4] border border-[#0B162C]/10 p-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-[#0B162C]/60">
              {isBn ? "ট্র্যাকিং কোড:" : "Tracking Code:"}
            </span>
            <span className="font-mono-code font-bold text-teal-800">
              {submittedApp.trackingCode}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#0B162C]/60">
              {isBn ? "শিক্ষার্থী:" : "Student:"}
            </span>
            <span className="font-bold">{submittedApp.studentName}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#0B162C]/60">
              {isBn ? "সাবজেক্ট:" : "Subject(s):"}
            </span>
            <span className="font-bold text-right">
              {submittedApp.subjectName} ({submittedApp.subjectCount}{" "}
              {isBn ? "টি" : submittedApp.subjectCount === 2 ? "Subjects" : "Subject"})
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#0B162C]/60">
              {isBn ? "পড়ার ধরন:" : "Study Format:"}
            </span>
            <span className="font-bold">
              {submittedApp.studyMode === "group"
                ? isBn
                  ? "২–৩ জনের গ্রুপ ব্যাচ"
                  : "2–3 Student Group Batch"
                : isBn
                ? "একা (Solo 1-on-1)"
                : "Solo (1-on-1)"}
            </span>
          </div>
          <div className="flex justify-between gap-3">
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
          {toWhatsAppDigits(settings.whatsappNumber) && (
            <a
              href={`https://wa.me/${toWhatsAppDigits(settings.whatsappNumber)}?text=${encodeURIComponent(
                `Hello BiddyaScope, I registered (${submittedApp.trackingCode}) for ${submittedApp.subjectName} (${submittedApp.studyMode === "group" ? "2-3 Student Group Batch" : "Solo 1-on-1"}) in ${submittedApp.area}.`
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
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white text-[#0B162C] p-6 sm:p-8 shadow-lg shadow-[#0B162C]/5 space-y-5 border border-[#0B162C]/10"
    >
      {/* TRUST & PERSONAL INITIATIVE BANNER INSIDE FORM */}
      <div className="rounded-xl bg-teal-50/70 border border-teal-700/20 p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-teal-900 font-extrabold text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              {isBn
                ? "কমিশনভিত্তিক টিউশন মিডিয়া নয় — সম্পূর্ণ ভেরিফায়েড ও সিলেক্টিভ হোম টিউটর"
                : "Not a Commission-Based Tuition Media — Verified Selective Tutors Only"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-900">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>{isBn ? "২টি ডেমো ক্লাস ফ্রি" : "2 Free Demo Classes"}</span>
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-[#0B162C]/75 leading-relaxed">
          {isBn
            ? "এটি আমাদের নিজেদের একটি উদ্যোগ—নিজেদের বন্ধু ও ছোট ভাই-বোনদের সার্কল (KUET ও খুলনা মেডিকেল) থেকে কেবল যারা দীর্ঘদিন ধরে অভিজ্ঞ এবং শুধুমাত্র HSC Science পড়ান, কেবল তাদেরকেই সরাসরি আপনার বাসায় পাঠানো হয়। শুরুতেই ২টি ডেমো ক্লাস একদম ফ্রি পাবেন।"
            : "This is our own personal effort—selecting strictly from our trusted circle of friends and juniors (KUET & Khulna Medical) who have years of experience teaching exclusively HSC Science. Your first 2 demo classes are completely free."}
        </p>
      </div>

      {/* STEP 1: SUBJECT COUNT & SUBJECT/COMBO SELECTION */}
      <div className="rounded-xl bg-[#FAF8F4] border border-[#0B162C]/10 p-4 space-y-3.5">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-extrabold text-[#0B162C] mb-2">
            <Layers className="w-3.5 h-3.5 text-teal-700" />
            <span>
              {isBn
                ? "১. কয়টি সাবজেক্ট পড়তে চান? *"
                : "1. How many subjects do you want to study? *"}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSubjectCount(1)}
              className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                subjectCount === 1
                  ? "bg-[#0B162C] text-white border-[#0B162C] shadow-sm"
                  : "bg-white text-[#0B162C]/80 border-[#0B162C]/15 hover:border-teal-700/40"
              }`}
            >
              {isBn ? "১টি সাবজেক্ট (Single)" : "1 Subject (Single)"}
            </button>
            <button
              type="button"
              onClick={() => setSubjectCount(2)}
              disabled={combos.length === 0}
              className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-50 ${
                subjectCount === 2
                  ? "bg-[#0F766E] text-white border-[#0F766E] shadow-sm"
                  : "bg-white text-[#0B162C]/80 border-[#0B162C]/15 hover:border-teal-700/40"
              }`}
            >
              {isBn ? "২টি সাবজেক্ট (Combo)" : "2 Subjects (Best Combo)"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5">
            {subjectCount === 2
              ? isBn
                ? "২. সেরা ২-সাবজেক্ট কম্বিনেশন নির্বাচন করুন (HSC Science) *"
                : "2. Select Best 2-Subject Combination (HSC Science) *"
              : isBn
              ? "২. সাবজেক্ট নির্বাচন করুন (HSC Science) *"
              : "2. Select Subject (HSC Science) *"}
          </label>

          {subjectCount === 1 ? (
            <div className="relative">
              <select
                required
                value={singleSubjectId}
                onChange={(e) => setSingleSubjectId(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-teal-700/30 bg-white px-3.5 py-2.5 pr-9 text-sm font-bold text-[#0B162C] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
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
          ) : (
            <div className="relative">
              <select
                required
                value={comboId}
                onChange={(e) => setComboId(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-teal-700/30 bg-white px-3.5 py-2.5 pr-9 text-sm font-bold text-[#0B162C] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
              >
                {combos.map((combo) => (
                  <option key={combo.id} value={combo.id}>
                    {isBn ? combo.labelBn : combo.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-teal-800 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* STEP 2: SOLO VS 2-3 STUDENT GROUP BATCH */}
      <div className="rounded-xl bg-amber-50/70 border border-amber-300/70 p-4 space-y-3">
        <div>
          <label className="block text-xs font-extrabold text-[#0B162C] mb-2">
            {isBn
              ? "৩. কীভাবে পড়তে চান? (একা নাকি ২–৩ জনের ছোট ব্যাচ) *"
              : "3. Study Format (Solo or 2–3 Student Group) *"}
          </label>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setStudyMode("solo")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                studyMode === "solo"
                  ? "bg-[#0B162C] text-white border-[#0B162C] shadow-sm"
                  : "bg-white text-[#0B162C]/80 border-[#0B162C]/15 hover:border-amber-500"
              }`}
            >
              <User className="w-4 h-4" />
              <span>{isBn ? "একা পড়ব (Solo 1-on-1)" : "Solo (1-on-1 Tutor)"}</span>
            </button>
            <button
              type="button"
              onClick={() => setStudyMode("group")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                studyMode === "group"
                  ? "bg-amber-700 text-white border-amber-700 shadow-sm"
                  : "bg-white text-[#0B162C]/80 border-[#0B162C]/15 hover:border-amber-500"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>
                {isBn
                  ? "২–৩ জন একসাথে পড়ব (Group)"
                  : "2–3 Students Group Batch"}
              </span>
            </button>
          </div>
        </div>

        {studyMode === "group" && (
          <div>
            <label className="block text-xs font-bold mb-1 text-amber-950">
              {isBn ? "গ্রুপের অবস্থা নির্বাচন করুন" : "Group Status"}
            </label>
            <div className="relative">
              <select
                value={groupPreference}
                onChange={(e) => setGroupPreference(e.target.value)}
                className="w-full appearance-none rounded-xl border border-amber-400 bg-white px-3.5 py-2 pr-9 text-xs font-semibold text-[#0B162C] focus:outline-none focus:ring-2 focus:ring-amber-600 cursor-pointer"
              >
                <option value="Need matching with 1-2 other students in my area">
                  {isBn
                    ? "আমি একা রেজিস্ট্রেশন করছি — এলাকার অন্য ২–১ জনের সাথে ম্যাচ করে দিন"
                    : "Registering solo — match me with 1–2 students in my area"}
                </option>
                <option value="Already have 2 students (open to 3rd)">
                  {isBn
                    ? "আমরা ২ জন বন্ধু আছি (দরকার হলে ৩য় জন ম্যাচ করা যাবে)"
                    : "We are 2 friends (open to adding a 3rd student)"}
                </option>
                <option value="Already have 3 students ready">
                  {isBn
                    ? "আমরা ৩ জন বন্ধু একসাথে রেডি আছি"
                    : "We already have a 3-student group ready"}
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-amber-800 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-[11px] sm:text-xs text-amber-950/90 leading-relaxed bg-white/80 rounded-lg p-2.5 border border-amber-200">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            {isBn
              ? "২–৩ জন একসাথে পড়তে চাইলে কোনো সমস্যা নেই—আপাতত রেজিস্ট্রেশন করে রাখুন। আপনার এলাকায় একই সাবজেক্টে আরও কেউ আবেদন করলে আমরা আপনাদেরকে একসাথে ম্যাচ করানোর চেষ্টা করব। ব্যাচ অ্যাপ্রুভ হলেই আপনারা ২–৩ জন একসাথে পড়তে পারবেন।"
              : "Want to study with 2–3 students? Go ahead and register now! When other students in your area apply for the same subject, we will match you together. Once the batch is approved, you can study together."}
          </p>
        </div>
      </div>

      {/* STUDENT DETAILS */}
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
            {isBn ? "অভিভাবকের নম্বর (ঐচ্ছিক)" : "Guardian Phone (Optional)"}
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

      <div className="grid sm:grid-cols-3 gap-4">
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
                {isBn ? "HSC ১ম বর্ষ" : "HSC 1st Year"}
              </option>
              <option value="HSC 2nd Year">
                {isBn ? "HSC ২য় বর্ষ" : "HSC 2nd Year"}
              </option>
              <option value="HSC Test / Board Exam">
                {isBn ? "HSC পরীক্ষার্থী" : "HSC Candidate"}
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#0B162C]/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

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
            {isBn ? "সপ্তাহে কত দিন?" : "Days / Week"}
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
            placeholder={isBn ? "বাসা/রোড নম্বর..." : "House / Road details..."}
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
                {isBn ? "খুলনা মেডিকেল শিক্ষার্থী" : "Khulna Medical Preferred"}
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
          : studyMode === "group"
          ? isBn
            ? "গ্রুপ ব্যাচের জন্য রেজিস্ট্রেশন করুন"
            : "Register for Group Batch"
          : isBn
          ? "হোম টিউটরের আবেদন জমা দিন"
          : "Submit Home Tutor Application"}
      </button>

      <p className="text-center text-xs font-semibold text-emerald-800">
        {isBn
          ? "✓ আবেদনের পর শুরুতেই ২টি ডেমো ক্লাস সম্পূর্ণ ফ্রি — কোনো অগ্রিম ফি নেই।"
          : "✓ First 2 demo classes are completely free — no upfront fee."}
      </p>
    </form>
  );
}
