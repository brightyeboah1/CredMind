// The Supabase client libraries append their own path (e.g. /rest/v1/...,
// /auth/v1/...) to whatever base URL they're given. If the configured
// NEXT_PUBLIC_SUPABASE_URL already includes a path — e.g. someone pasted
// ".../rest/v1" instead of the bare project URL — every request doubles
// up and 404s. Strip any trailing path so this is resilient regardless of
// exactly what's stored in the deployment's environment variables.
export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  try {
    const url = new URL(raw);
    return `${url.protocol}//${url.host}`;
  } catch {
    return raw;
  }
}
