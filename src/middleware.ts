import { NextRequest, NextResponse } from "next/server";

const STATIC_EXT_RE =
  /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|woff|woff2|ttf|txt|xml|json)$/i;

const KNOWN_ROUTES = new Set(["/", "/apply", "/admin"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/favicon.ico") {
    const iconUrl = req.nextUrl.clone();
    iconUrl.pathname = "/icon.png";
    return NextResponse.rewrite(iconUrl);
  }

  if (KNOWN_ROUTES.has(pathname) || STATIC_EXT_RE.test(pathname)) {
    return NextResponse.next();
  }

  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }

  // Strip invisible Unicode spaces/joiners and trailing punctuation often attached when sharing URLs in WhatsApp/SMS.
  const cleaned =
    decoded
      .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF\u00A0]/g, "")
      .replace(/[.,;:!?।*_)~'"\]\s]+$/g, "")
      .replace(/\/+$/, "") || "/";

  const lower = cleaned.toLowerCase();
  if (KNOWN_ROUTES.has(lower) && pathname !== lower) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = lower;
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/).*)"],
};
