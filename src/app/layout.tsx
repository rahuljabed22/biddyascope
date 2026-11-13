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
  title: "বিদ্যাস্কোপ | Selective HSC Science Home Tutors — KUET & Khulna Medical",
  description:
    "Not a commission-based tuition media. Our own selective initiative assigning long-experienced, verified HSC Science home tutors from KUET and Khulna Medical College.",
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
