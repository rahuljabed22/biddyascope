import { SiteSettings, Subject, Tutor } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "BiddyaScope",
  announcementText:
    "HSC Science Home Tutor Applications Open — Selective KUET & Khulna Medical College (3rd & 4th Year) Mentors",
  announcementTextBn:
    "এইচএসসি সায়েন্স হোম টিউটর আবেদন চলছে — কুয়েট ও খুলনা মেডিকেল কলেজের ৩য় ও ৪র্থ বর্ষের অভিজ্ঞ মেন্টর",
  announcementActive: true,
  heroBadge: "Selective Home Mentorship • Khulna",
  heroBadgeBn: "সিলেক্টিভ হোম মেন্টরশিপ • খুলনা",
  heroTitle: "Not a Tuition Media. Only Proven, Selective Home Mentors.",
  heroTitleBn:
    "গতানুগতিক টিউশন মিডিয়া নয় — শুধুই বাছাইকৃত ও অভিজ্ঞ হোম টিউটর।",
  heroSubtitle:
    "We exclusively assign vetted 3rd & 4th year students from KUET and Khulna Medical College with years of real teaching experience for HSC Science (Physics, Chemistry, Higher Math & Biology).",
  heroSubtitleBn:
    "আমরা গতানুগতিক কোনো টিউশন মিডিয়া নই। কুয়েট (KUET) ও খুলনা মেডিকেল কলেজের ৩য় ও ৪র্থ বর্ষের দীর্ঘদিনের পড়ানোর অভিজ্ঞতাসম্পন্ন বাছাইকৃত টিচারদেরই কেবল আপনার বাসায় পাঠানো হয়।",
  antiMediaTitle: "Why We Are Not a Conventional Tuition Media",
  antiMediaTitleBn: "কেন আমরা গতানুগতিক টিউশন মিডিয়া নই",
  antiMediaDescription:
    "Conventional tuition media agencies forward random tutors just to collect commission. BiddyaScope works differently: every mentor is personally vetted, holds 2–4+ years of proven HSC teaching experience, and comes strictly from KUET or Khulna Medical College (3rd & 4th Year).",
  antiMediaDescriptionBn:
    "গতানুগতিক টিউশন মিডিয়া কেবল কমিশনের জন্য যাকে-তাকে পাঠিয়ে দেয়। কিন্তু বিদ্যাস্কোপে আমরা সিলেক্টিভ টিচার দেই—যাদের প্রত্যেকের রয়েছে ২ থেকে ৪+ বছরের পড়ানোর বাস্তব অভিজ্ঞতা এবং সবাই কুয়েট বা খুলনা মেডিকেলের ৩য় ও ৪র্থ বর্ষের শিক্ষার্থী।",
  serviceArea: "Khulna City (Sonadanga, Boyra, Nirala, Khalishpur, Daulatpur, Gollamari & Nearby)",
  serviceAreaBn: "খুলনা শহর (সোনাডাঙ্গা, বয়রা, নিরালা, খালিশপুর, দৌলতপুর, গল্লামারী ও পার্শ্ববর্তী এলাকা)",
  contactPhone: "+880 1700-000000",
  whatsappNumber: "8801700000000",
  contactEmail: "admissions@biddyascope.com",
  footerTagline: "Selective HSC Science Home Tutoring by KUET & Khulna Medical College Mentors.",
  footerTaglineBn: "কুয়েট ও খুলনা মেডিকেল কলেজের অভিজ্ঞ মেন্টরদের দ্বারা পরিচালিত সিলেক্টিভ এইচএসসি সায়েন্স হোম টিউটর সার্ভিস।",
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "subj-physics",
    name: "Physics",
    nameBn: "পদার্থবিজ্ঞান (Physics)",
    level: "HSC Science",
    description:
      "Concept-first mastery for 1st & 2nd Paper: mechanics, vectors, electricity, optics, and board + admission numericals.",
    descriptionBn:
      "১ম ও ২য় পত্রের বেসিক ক্লিয়ার, গাণিতিক সমস্যা সমাধান এবং বোর্ড ও এডমিশন স্ট্যান্ডার্ড প্রস্তুতি।",
    active: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "subj-chemistry",
    name: "Chemistry",
    nameBn: "রসায়ন (Chemistry)",
    level: "HSC Science",
    description:
      "Structured organic chemistry mechanisms, quantitative problems, periodic trends, and equation fluency.",
    descriptionBn:
      "অর্গানিক কেমিস্ট্রির সহজ টেকনিক, পরিমাণগত রসায়নের অঙ্ক এবং বোর্ড প্রশ্ন সমাধান।",
    active: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "subj-math",
    name: "Higher Math",
    nameBn: "উচ্চতর গণিত (Higher Math)",
    level: "HSC Science",
    description:
      "Deep problem-solving in calculus, matrices, trigonometry, vectors, and conics with regular speed drills.",
    descriptionBn:
      "ক্যালকুলাস, ত্রিকোণমিতি, ম্যাট্রিক্স ও কনিক্সের গভীর অনুশীলন ও শর্টকাট ছাড়াই মূল কনসেপ্ট আয়ত্ত।",
    active: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "subj-biology",
    name: "Biology",
    nameBn: "জীববিজ্ঞান (Biology)",
    level: "HSC Science",
    description:
      "Medical-grade clarity on botany & zoology, diagram mastery, physiology, and high-yield retention.",
    descriptionBn:
      "উদ্ভিদ ও প্রাণিবিজ্ঞানের চিত্রসহ স্পষ্ট ধারণা, ফিজিওলজি এবং মেডিকেল-মানের প্রস্তুতি।",
    active: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_TUTORS: Tutor[] = [
  {
    id: "tutor-1",
    name: "Tanvir Ahmed",
    institution: "KUET",
    yearOfStudy: "4th Year",
    department: "Dept. of Electrical & Electronic Engineering (EEE)",
    subjects: ["Physics", "Higher Math"],
    experienceYears: 4,
    tagline: "4 years of HSC Science home mentoring across Sonadanga & Nirala. Focuses on CQ + Engineering-grade numericals.",
    taglineBn: "সোনাডাঙ্গা ও নিরালায় ৪ বছরের এইচএসসি পড়ানোর অভিজ্ঞতা। ফিজিক্স ও ম্যাথের সৃজনশীল ও গাণিতিক সমস্যায় বিশেষ দক্ষতা।",
    active: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tutor-2",
    name: "Nusrat Jahan",
    institution: "Khulna Medical College",
    yearOfStudy: "4th Year",
    department: "MBBS (Phase III)",
    subjects: ["Biology", "Chemistry"],
    experienceYears: 3,
    tagline: "Mentored 18+ HSC Science students with structured weekly assessments and diagram-driven Biology mastery.",
    taglineBn: "১৮+ জন এইচএসসি শিক্ষার্থীকে পড়ানোর অভিজ্ঞতা। সাপ্তাহিক পরীক্ষা ও চিত্রভিত্তিক বায়োলজি এবং কেমিস্ট্রি গাইডলাইন।",
    active: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tutor-3",
    name: "Mahmudul Hasan",
    institution: "KUET",
    yearOfStudy: "3rd Year",
    department: "Dept. of Computer Science & Engineering (CSE)",
    subjects: ["Higher Math", "Physics"],
    experienceYears: 3,
    tagline: "Specializes in turning calculus & mechanics into intuitive visual steps for HSC 1st & 2nd year learners.",
    taglineBn: "ক্যালকুলাস ও মেকানিক্সকে সহজ ও ভিজ্যুয়াল উপায়ে বুঝিয়ে এইচএসসি শিক্ষার্থীদের ভীতি দূর করেন।",
    active: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tutor-4",
    name: "Rafiqul Islam",
    institution: "Khulna Medical College",
    yearOfStudy: "3rd Year",
    department: "MBBS (Phase II)",
    subjects: ["Biology", "Chemistry"],
    experienceYears: 3,
    tagline: "Known for patient, concept-first Organic Chemistry & Human Physiology lessons tailored to board & medical prep.",
    taglineBn: "অর্গানিক কেমিস্ট্রি ও হিউম্যান ফিজিওলজি ধৈর্যসহকারে বোর্ড ও মেডিকেল প্রস্তুতির উপযোগী করে পড়ান।",
    active: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
];
