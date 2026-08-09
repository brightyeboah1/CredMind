import { createBrowserClient } from "@supabase/ssr";

// Used in Client Components ("use client" files) — respects the logged-in
// user's session and Row Level Security automatically.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
