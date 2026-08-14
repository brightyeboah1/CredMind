import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseUrl } from "@/lib/supabase/env";

// ─── SESSION REFRESH ──────────────────────────────────────────────────────
// This is the MVP access table:
//
//   Explore Cards        -> public
//   Card Comparison      -> public
//   Card Quiz (taking)   -> public   (results view is gated inside the page)
//   Home                 -> public   (personalized sections gate themselves)
//   Stack Optimizer      -> public preview, gated by <GatedPreview> in-page
//   Debt Optimizer       -> public preview, gated by <GatedPreview> in-page
//   AI Educator          -> public preview, gated by <GatedPreview> in-page
//
// Stack/Debt/AI Educator used to hard-redirect unauthenticated visitors away
// from here. They now render a blurred preview with a login/signup overlay
// instead (see components/GatedPreview.tsx), so there's no route left to
// redirect — the underlying API routes (/api/optimize-stack,
// /api/optimize-debt, /api/chat) still independently reject unauthenticated
// requests with 401. Middleware still runs on every request purely to keep
// the Supabase session cookie refreshed for Server Components/Route Handlers.

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
