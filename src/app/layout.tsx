import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.biddyascope.online"),
  title: "বিদ্যাস্কোপ | Selective HSC Science Home Tutors — KUET & Khulna Medical",
  description:
    "Not a commission-based tuition media. Our own selective initiative assigning long-experienced, verified HSC Science home tutors from KUET and Khulna Medical College. 2 Free Demo Classes included.",
  openGraph: {
    title: "বিদ্যাস্কোপ | Selective HSC Science Home Tutors — KUET & KMC",
    description:
      "কোনো টিউশন মিডিয়া নয় — কুয়েট ও খুলনা মেডিকেলের অভিজ্ঞ মেন্টর। শুরুতেই ২টি ডেমো ক্লাস সম্পূর্ণ ফ্রি।",
    url: "/",
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
  twitter: {
    card: "summary_large_image",
    title: "বিদ্যাস্কোপ | Selective HSC Science Home Tutors — KUET & KMC",
    description:
      "কোনো টিউশন মিডিয়া নয় — কুয়েট ও খুলনা মেডিকেলের অভিজ্ঞ মেন্টর। শুরুতেই ২টি ডেমো ক্লাস সম্পূর্ণ ফ্রি।",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${jakarta.variable} ${hind.variable} ${mono.variable}`}
    >
      <body className="min-h-screen antialiased selection:bg-teal-700 selection:text-white">
        {children}
      </body>
    </html>
  );
}
