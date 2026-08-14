import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseUrl } from "./env";

// Used in Server Components, Route Handlers (API routes), and Server Actions.
// Reads the user's auth cookie so we know who's logged in server-side —
// this is what lets API routes check subscription_tier before calling
// Claude, without ever trusting anything the client sends us directly.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component — middleware handles refresh instead
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Called from a Server Component — middleware handles refresh instead
          }
        },
      },
    }
  );
}

// Service-role client — bypasses Row Level Security entirely.
// ONLY use this for trusted server-side operations (e.g. incrementing
// usage_tracking counts, admin card management). NEVER expose this
// client or its key to the browser.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createServiceClient() {
  return createSupabaseClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
