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
  IconMenu,
  IconClose,
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
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
              className="hidden md:flex w-9 h-9 rounded-full bg-accentMuted items-center justify-center text-accent font-semibold text-small"
            >
              {user.email?.[0]?.toUpperCase() ?? "?"}
            </button>
          ) : (
            !loading && (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="btn-ghost text-small">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary text-small !py-2 !px-4">
                  Get started
                </Link>
              </div>
            )
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-inkMuted hover:text-ink hover:bg-surface transition-colors duration-250"
          >
            {menuOpen ? (
              <IconClose width={20} height={20} />
            ) : (
              <IconMenu width={20} height={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav panel — every page in one tappable list */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-canvas">
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-body font-medium transition-colors duration-250 ${
                    active
                      ? "text-ink bg-surface"
                      : "text-inkMuted hover:text-ink hover:bg-surface"
                  }`}
                >
                  <Icon width={18} height={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="px-4 pb-4 pt-1 border-t border-border">
            {!loading && user ? (
              <button
                onClick={() => setPanelOpen(true)}
                className="flex items-center gap-3 px-3 py-3 w-full text-left rounded-xl text-body font-medium text-inkMuted hover:text-ink hover:bg-surface transition-colors duration-250"
              >
                <span className="w-7 h-7 rounded-full bg-accentMuted flex items-center justify-center text-accent font-semibold text-small">
                  {user.email?.[0]?.toUpperCase() ?? "?"}
                </span>
                Account
              </button>
            ) : (
              !loading && (
                <div className="flex gap-3 pt-2">
                  <Link href="/login" className="btn-secondary flex-1 text-center text-small !py-2.5">
                    Log in
                  </Link>
                  <Link href="/signup" className="btn-primary flex-1 text-center text-small !py-2.5">
                    Get started
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {panelOpen && user && (
        <AccountPanel email={user.email} onClose={() => setPanelOpen(false)} />
      )}
    </nav>
  );
}
