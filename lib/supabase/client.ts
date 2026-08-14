import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl } from "./env";

// Used in Client Components ("use client" files) — respects the logged-in
// user's session and Row Level Security automatically.
export function createClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
