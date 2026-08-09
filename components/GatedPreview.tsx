"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconLock } from "./icons";

// ─── PREVIEW-THEN-GATE ────────────────────────────────────────────────────
// Renders `children` normally once logged in. While logged out, renders the
// same content blurred and non-interactive with a centered login/signup
// card on top — same visual language as the quiz's gated results screen,
// generalized to wrap a whole page instead of just one result view.

export default function GatedPreview({
  children,
  title,
  blurb,
}: {
  children: ReactNode;
  title: string;
  blurb: string;
}) {
  const [user, setUser] = useState<null | { id: string }>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return null;
  if (user) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none blur-sm opacity-50 select-none">{children}</div>
      <div className="absolute inset-0 flex items-start justify-center pt-24 px-6">
        <div className="card-panel p-8 max-w-sm text-center shadow-raised bg-surface/95 backdrop-blur">
          <div className="w-14 h-14 rounded-2xl bg-accentMuted flex items-center justify-center mx-auto mb-6">
            <IconLock width={22} height={22} className="text-accent" />
          </div>
          <h2 className="text-h3 text-ink mb-2">{title}</h2>
          <p className="text-body text-inkMuted mb-6">{blurb}</p>
          <Link
            href={`/signup?next=${encodeURIComponent(pathname)}`}
            className="btn-primary w-full inline-block mb-3"
          >
            Create free account
          </Link>
          <p className="text-small text-inkFaint">
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="text-accent">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
