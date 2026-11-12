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
  title: "BiddyaScope | Selective HSC Science Home Tutors — KUET & Khulna Medical",
  description:
    "Not a conventional tuition media. BiddyaScope provides strictly vetted, experienced 3rd & 4th year mentors from KUET and Khulna Medical College for HSC Science (Physics, Chemistry, Higher Math, Biology).",
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
