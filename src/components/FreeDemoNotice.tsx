"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface Props {
  isBn: boolean;
}

/**
 * Highlights the 2-free-demo-class guarantee on both homepage and /apply.
 */
export default function FreeDemoNotice({ isBn }: Props) {
  return (
    <div className="rounded-2xl bg-emerald-50 border border-emerald-300/80 p-4 sm:p-5 space-y-1.5 shadow-sm">
      <div className="flex items-center gap-2 text-emerald-950 text-xs sm:text-sm font-extrabold">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          {isBn
            ? "শুরুতেই ২টি ডেমো ক্লাস সম্পূর্ণ ফ্রি"
            : "2 Free Demo Classes Included"}
        </span>
      </div>
      <p className="text-xs text-emerald-950/85 leading-relaxed">
        {isBn
          ? "টিচারের পড়ানোর ধরন ও মান যাচাই করার জন্য শুরুতেই ২টি ডেমো ক্লাস একদম ফ্রি পাচ্ছেন। ক্লাস ভালো লাগলেই কেবল নিয়মিত টিউশন কনফার্ম করবেন।"
          : "Evaluate your mentor's teaching quality first with 2 completely free demo classes—confirm regular tuition only when you're satisfied."}
      </p>
    </div>
  );
}
