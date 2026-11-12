import { NextRequest } from "next/server";

export interface RequestMeta {
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  userAgent: string;
  deviceType: string;
  browser: string;
  os: string;
}

export function extractClientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const vercelForwarded = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    const first = vercelForwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

export function parseUserAgent(ua: string): {
  deviceType: string;
  browser: string;
  os: string;
} {
  const lower = ua.toLowerCase();

  let deviceType = "Desktop";
  if (/bot|crawler|spider|headless|curl|wget|python/i.test(ua)) {
    deviceType = "Bot";
  } else if (/ipad|tablet|playbook|silk/i.test(lower)) {
    deviceType = "Tablet";
  } else if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(lower)) {
    deviceType = "Mobile";
  }

  let os = "Unknown";
  if (lower.includes("windows")) os = "Windows";
  else if (lower.includes("iphone") || lower.includes("ipad")) os = "iOS";
  else if (lower.includes("android")) os = "Android";
  else if (lower.includes("mac os") || lower.includes("macintosh")) os = "macOS";
  else if (lower.includes("linux")) os = "Linux";

  let browser = "Unknown";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("opr/") || lower.includes("opera")) browser = "Opera";
  else if (lower.includes("chrome/") && !lower.includes("edg/")) browser = "Chrome";
  else if (lower.includes("firefox/")) browser = "Firefox";
  else if (lower.includes("safari/") && !lower.includes("chrome/")) browser = "Safari";
  else if (deviceType === "Bot") browser = "Automated";

  return { deviceType, browser, os };
}

export function extractRequestMeta(req: NextRequest): RequestMeta {
  const ipAddress = extractClientIp(req);
  const userAgent = req.headers.get("user-agent") || "Unknown";
  const country = decodeHeader(req.headers.get("x-vercel-ip-country")) || (ipAddress === "127.0.0.1" || ipAddress === "::1" ? "Local" : "Unknown");
  const city = decodeHeader(req.headers.get("x-vercel-ip-city")) || "";
  const region = decodeHeader(req.headers.get("x-vercel-ip-country-region")) || "";
  const { deviceType, browser, os } = parseUserAgent(userAgent);

  return {
    ipAddress,
    country,
    city,
    region,
    userAgent,
    deviceType,
    browser,
    os,
  };
}

function decodeHeader(val: string | null): string {
  if (!val) return "";
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}
