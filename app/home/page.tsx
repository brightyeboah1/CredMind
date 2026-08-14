"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getStack, getWatchlist } from "@/lib/userCards";
import { CreditCard } from "@/data/cards";
import { getCards } from "@/lib/cards";
import { ACCOUNTS } from "@/data/accounts";
import AccountTile from "@/components/AccountTile";
import PromoBanner from "@/components/PromoBanner";
import CardImage from "@/components/CardImage";
import { IconTarget, IconArrowRight } from "@/components/icons";

type CachedScore = { score: number; scoreLabel: string; annualValue: number; savedAt: string };

const FOR_YOU_TILES = [
  {
    href: "/",
    title: "Find your next card",
    blurb: "Browse every card and filter by what matters to you.",
    gradient: "linear-gradient(135deg, #1E3A66 0%, #12161F 100%)",
  },
  {
    href: "/quiz",
    title: "Not sure where to start?",
    blurb: "Take the 60-second quiz and get matched instantly.",
    gradient: "linear-gradient(135deg, #4A2E12 0%, #12161F 100%)",
  },
  {
    href: "/debt",
    title: "Carrying a balance?",
    blurb: "See exactly when you'll be debt-free — and how to get there faster.",
    gradient: "linear-gradient(135deg, #14432B 0%, #12161F 100%)",
  },
  {
    href: "/chat",
    title: "Meet your AI Educator",
    blurb: "Ask anything about credit, debt, or your score — plain answers.",
    gradient: "linear-gradient(135deg, #3B1E4A 0%, #12161F 100%)",
  },
];

function firstName(email?: string | null) {
  if (!email) return "";
  return email.split("@")[0];
}

export default function HomePage() {
  const [user, setUser] = useState<null | { id: string; email?: string }>(null);
  const [loading, setLoading] = useState(true);
  const [stack, setStack] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [score, setScore] = useState<CachedScore | null>(null);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const supabase = createClient();

  useEffect(() => {
    getCards().then(setCards);
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (data.user) {
        const [s, w] = await Promise.all([getStack(data.user.id), getWatchlist(data.user.id)]);
        setStack(s);
        setWatchlist(w);
        try {
          const raw = localStorage.getItem(`stackScore:${data.user.id}`);
          if (raw) setScore(JSON.parse(raw));
        } catch {
          // ignore malformed cache
        }
      }
    });
  }, []);

  const stackCards = cards.filter((c) => stack.includes(c.id));
  const watchCards = cards.filter((c) => watchlist.includes(c.id));
  const totalAnnualFee = stackCards.reduce((s, c) => s + c.annualFee, 0);

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-14">
        {user ? (
          <h1 className="text-h1 text-ink">Welcome back, {firstName(user.email)}</h1>
        ) : (
          <>
            <h1 className="text-h1 text-ink mb-3">Your credit, all in one place.</h1>
            <p className="text-body-lg text-inkMuted mb-6 max-w-xl">
              Track your card stack, watch cards you're eyeing, and see your
              optimization rating — free.
            </p>
            <div className="flex gap-3">
              <Link href="/signup" className="btn-primary">
                Get started free
              </Link>
              <Link href="/login" className="btn-secondary">
                Log in
              </Link>
            </div>
          </>
        )}
      </div>

      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-14">
          {/* Your stack */}
          <div className="card-panel p-6">
            <p className="label-micro text-inkFaint mb-4">Your stack</p>
            {stackCards.length === 0 ? (
              <>
                <p className="text-small text-inkMuted mb-4">
                  You haven't added any cards yet.
                </p>
                <Link href="/" className="text-small text-accent font-medium">
                  Browse cards →
                </Link>
              </>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {stackCards.slice(0, 3).map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <CardImage src={c.image} name={c.name} className="w-8 h-8 rounded-lg" />
                      <span className="text-small text-ink truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-small text-inkMuted mb-3">
                  {stackCards.length} card{stackCards.length > 1 ? "s" : ""} · $
                  {totalAnnualFee.toFixed(0)}/yr combined fees
                </p>
                <Link href="/optimizer" className="text-small text-accent font-medium">
                  Manage stack →
                </Link>
              </>
            )}
          </div>

          {/* Cards you're eyeing */}
          <div className="card-panel p-6">
            <p className="label-micro text-inkFaint mb-4">Cards you're eyeing</p>
            {watchCards.length === 0 ? (
              <>
                <p className="text-small text-inkMuted mb-4">
                  Watch cards from any product page to track them here.
                </p>
                <Link href="/" className="text-small text-accent font-medium">
                  Explore cards →
                </Link>
              </>
            ) : (
              <div className="space-y-3">
                {watchCards.slice(0, 3).map((c) => (
                  <Link
                    key={c.id}
                    href={`/card/${c.id}`}
                    className="flex items-center gap-3 hover:opacity-80"
                  >
                    <CardImage src={c.image} name={c.name} className="w-8 h-8 rounded-lg" />
                    <span className="text-small text-ink truncate">{c.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Optimization rating */}
          <div className="card-panel p-6">
            <p className="label-micro text-inkFaint mb-4">Your optimization rating</p>
            {score ? (
              <div className="flex items-center gap-4">
                <div className="text-display text-accent">{score.score}</div>
                <div>
                  <div className="text-body font-semibold text-ink">{score.scoreLabel}</div>
                  <div className="text-small text-inkMuted">
                    Est. ${score.annualValue?.toLocaleString()} annual value
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-11 h-11 rounded-2xl bg-accentMuted flex items-center justify-center mb-4">
                  <IconTarget width={18} height={18} className="text-accent" />
                </div>
                <p className="text-small text-inkMuted mb-4">
                  Run the Stack Optimizer to see how your cards score.
                </p>
                <Link href="/optimizer" className="text-small text-accent font-medium">
                  Run Stack Optimizer →
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* For you */}
      <div className="mb-14">
        <h2 className="text-h3 text-ink mb-5">For you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FOR_YOU_TILES.map((t) => (
            <AccountTile key={t.href} {...t} />
          ))}
        </div>
      </div>

      {/* Refer a friend banner */}
      <div className="mb-14">
        <PromoBanner
          title="Refer a friend, earn cash back"
          blurb="When a friend signs up and gets approved for a card through your link, you both get cash back. No purchase necessary, terms apply."
          gradient="linear-gradient(120deg, #1E3A66 0%, #12161F 100%)"
          action={
            user ? (
              <p className="text-small text-inkFaint">
                Open your account menu (top right) to copy your referral link.
              </p>
            ) : (
              <Link href="/signup" className="btn-primary text-small !py-2.5 !px-5">
                Create free account
              </Link>
            )
          }
        />
      </div>

      {/* Accounts */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-h3 text-ink">Other products</h2>
          <IconArrowRight width={16} height={16} className="text-inkFaint" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACCOUNTS.map((a) => (
            <AccountTile
              key={a.id}
              href={`/accounts/${a.id}`}
              title={a.title}
              blurb={a.blurb}
              gradient={a.gradient}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
