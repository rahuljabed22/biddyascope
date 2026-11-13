import { SiteSettings, Subject, Tutor } from "./types";

export const LEGACY_ANTI_MEDIA_DESC_BN =
  "গতানুগতিক টিউশন মিডিয়া কেবল কমিশনের জন্য যাকে-তাকে পাঠিয়ে দেয়। কিন্তু বিদ্যাস্কোপে আমরা সিলেক্টিভ টিচার দেই—যাদের প্রত্যেকের রয়েছে ২ থেকে ৪+ বছরের পড়ানোর বাস্তব অভিজ্ঞতা এবং সবাই কুয়েট বা খুলনা মেডিকেলের ৩য় ও ৪র্থ বর্ষের শিক্ষার্থী।";

export const LEGACY_CONTACT_PHONES = new Set([
  "",
  "+880 1700-000000",
  "01700-000000",
  "01700000000",
]);

export const LEGACY_WHATSAPP_NUMBERS = new Set([
  "",
  "8801700000000",
  "01700000000",
]);

export const LEGACY_ANNOUNCEMENT_EN =
  "HSC Science Home Tutor Applications Open — Verified KUET & Khulna Medical (3rd & 4th Year) Mentors";

export const LEGACY_ANNOUNCEMENT_BN =
  "কমিশনভিত্তিক টিউশন মিডিয়া নয় — কুয়েট ও খুলনা মেডিকেলের অভিজ্ঞ ৩য় ও ৪র্থ বর্ষের সিলেক্টিভ HSC সায়েন্স মেন্টর";

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "বিদ্যাস্কোপ",
  announcementText:
    "2 Free Demo Classes Included — Verified KUET & Khulna Medical HSC Science Home Tutors",
  announcementTextBn:
    "শুরুতেই ২টি ডেমো ক্লাস সম্পূর্ণ ফ্রি — কুয়েট ও খুলনা মেডিকেলের অভিজ্ঞ সিলেক্টিভ HSC সায়েন্স টিউটর",
  announcementActive: true,
  heroBadge: "Our Own Selective Initiative • Khulna",
  heroBadgeBn: "আমাদের নিজস্ব সিলেক্টিভ প্রচেষ্টা • খুলনা",
  heroTitle:
    "Not a Commission-Based Tuition Media. Only Verified, Selective Mentors From Our Own Circle.",
  heroTitleBn:
    "গতানুগতিক কোনো টিউশন মিডিয়া নয় — শুধুই আমাদের পরিচিত ও দীর্ঘদিনের অভিজ্ঞ ভেরিফায়েড HSC টিউটর।",
  heroSubtitle:
    "This is our own close-knit initiative—built by experienced friends and juniors from KUET and Khulna Medical College (3rd & 4th Year) who teach exclusively HSC Science. Unlike commission-driven tuition media agencies, we send only personally verified, selective mentors directly to your home.",
  heroSubtitleBn:
    "এটি আমাদের নিজেদেরই একটি বিশ্বস্ত প্রচেষ্টা—আমাদের পরিচিত বন্ধু ও ছোট ভাই-বোনদের মধ্য থেকে কেবল যারা দীর্ঘদিন ধরে অভিজ্ঞ এবং শুধুমাত্র HSC Science পড়ান, আমরা তাদেরকেই সিলেক্ট করি। অন্য টিউশন মিডিয়ার মতো কমিশনভিত্তিক কাজ না করে আমরা সরাসরি স্টুডেন্টের বাসায় একেবারে ভেরিফায়েড ও সিলেক্টিভ টিচার পাঠাই।",
  antiMediaTitle: "Why We Are Completely Different From Tuition Media",
  antiMediaTitleBn: "কেন আমরা গতানুগতিক টিউশন মিডিয়া থেকে সম্পূর্ণ আলাদা",
  antiMediaDescription:
    "Other tuition media platforms work purely on commission and forward anyone available. We are completely different: this is our own personal effort with trusted, long-experienced friends and juniors from KUET & Khulna Medical College who teach ONLY HSC Science—so every home receives a thoroughly verified, selective teacher.",
  antiMediaDescriptionBn:
    "অন্যান্য টিউশন মিডিয়াগুলো যেভাবে কমিশনভিত্তিক ব্যবসা করে এবং যাকে-তাকে পাঠিয়ে দেয়, আমরা একদমই সেরকম নই। এটি আমাদের নিজেদেরই একটি উদ্যোগ—যেখানে আমাদের নিজেদের বন্ধু বা ছোট ভাই-বোনদের মধ্য থেকেই কেবল দীর্ঘদিনের অভিজ্ঞ ও শুধুমাত্র HSC পড়ানো টিচারদেরকেই বাছাই করা হয় এবং স্টুডেন্টের বাসায় একেবারে ভেরিফায়েড সিলেক্টিভ টিচার পাঠানো হয়।",
  serviceArea:
    "Khulna City (Sonadanga, Boyra, Nirala, Khalishpur, Daulatpur, Gollamari & Nearby)",
  serviceAreaBn:
    "খুলনা শহর (সোনাডাঙ্গা, বয়রা, নিরালা, খালিশপুর, দৌলতপুর, গল্লামারী ও পার্শ্ববর্তী এলাকা)",
  contactPhone: "01902413185",
  whatsappNumber: "8801851911262",
  contactEmail: "admissions@biddyascope.com",
  footerTagline:
    "Our own selective initiative — Verified, experienced HSC Science mentors from KUET & Khulna Medical College.",
  footerTaglineBn:
    "কোনো কমিশনভিত্তিক মিডিয়া নয় — কুয়েট ও খুলনা মেডিকেলের নিজেদের পরিচিত ও দীর্ঘদিনের অভিজ্ঞ ভেরিফায়েড HSC সায়েন্স টিউটরদের উদ্যোগ।",
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
