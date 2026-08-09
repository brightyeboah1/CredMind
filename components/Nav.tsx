"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  IconHome,
  IconCard,
  IconCompare,
  IconTarget,
  IconStack,
  IconTrend,
  IconChat,
} from "./icons";
import AccountPanel from "./AccountPanel";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: IconHome },
  { href: "/", label: "Explore", icon: IconCard },
  { href: "/compare", label: "Compare", icon: IconCompare },
  { href: "/quiz", label: "Quiz", icon: IconTarget },
  { href: "/optimizer", label: "Stack", icon: IconStack, protected: true },
  { href: "/debt", label: "Debt", icon: IconTrend, protected: true },
  { href: "/chat", label: "AI Educator", icon: IconChat, protected: true },
];

export default function Nav() {
  const [user, setUser] = useState<null | { email?: string }>(null);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
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

  return (
    <nav className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-1">
        <Link href="/home" className="flex items-center mr-8 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-lockup.png" alt="CredMind" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-small font-medium transition-colors duration-250 ${
                  active
                    ? "text-ink bg-surface"
                    : "text-inkMuted hover:text-ink hover:bg-surface"
                }`}
              >
                <Icon width={16} height={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {!loading && user ? (
            <button
              onClick={() => setPanelOpen(true)}
              className="w-9 h-9 rounded-full bg-accentMuted flex items-center justify-center text-accent font-semibold text-small"
            >
              {user.email?.[0]?.toUpperCase() ?? "?"}
            </button>
          ) : (
            !loading && (
              <>
                <Link href="/login" className="btn-ghost text-small">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary text-small !py-2 !px-4">
                  Get started
                </Link>
              </>
            )
          )}
        </div>
      </div>

      {panelOpen && user && (
        <AccountPanel email={user.email} onClose={() => setPanelOpen(false)} />
      )}
    </nav>
  );
}
