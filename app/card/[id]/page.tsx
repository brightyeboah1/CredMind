"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "@/data/cards";
import { getCardBySlug } from "@/lib/cards";
import { createClient } from "@/lib/supabase/client";
import { addToStack, removeFromStack, getStack, getWatchlist, toggleWatchlist } from "@/lib/userCards";
import CardImage from "@/components/CardImage";
import { IconCheck, IconChevronDown } from "@/components/icons";

// Rough dollar-value estimate for the "Est. annual rewards" stat — assumes
// typical Canadian monthly spend per category, valuing each point/cashback
// percent at ~$0.01 per dollar spent. It's a stated estimate, not a quote.
const ASSUMED_MONTHLY_SPEND: Record<string, number> = {
  dining: 300,
  groceries: 500,
  gas: 150,
  travel: 200,
  transit: 100,
  streaming: 50,
  entertainment: 100,
  air_canada: 100,
  categories_choice: 400,
  other: 300,
};

function estimateAnnualValue(rewards: Record<string, number>) {
  const annual = Object.entries(rewards).reduce((sum, [cat, rate]) => {
    const spend = ASSUMED_MONTHLY_SPEND[cat] ?? 200;
    return sum + spend * (rate / 100);
  }, 0);
  return Math.round(annual * 12);
}

export default function CardDetailPage({ params }: { params: { id: string } }) {
  const [card, setCard] = useState<CreditCard | null | undefined>(undefined);
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<null | { id: string }>(null);
  const [inStack, setInStack] = useState(false);
  const [watched, setWatched] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getCardBySlug(params.id).then(setCard);
  }, [params.id]);

  useEffect(() => {
    if (!card) return;
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const [stack, watchlist] = await Promise.all([
          getStack(data.user.id),
          getWatchlist(data.user.id),
        ]);
        setInStack(stack.includes(card.id));
        setWatched(watchlist.includes(card.id));
      }
    });
  }, [card]);

  if (card === undefined) {
    return <div className="max-w-2xl mx-auto px-6 py-24 text-center text-body text-inkMuted">Loading…</div>;
  }

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-h1 text-ink mb-3">Card not found</h1>
        <p className="text-body text-inkMuted">
          That card doesn't exist in our catalogue.
        </p>
      </div>
    );
  }

  const handleAddToStack = async () => {
    if (!user) return router.push(`/signup?next=/card/${card.id}`);
    setBusy(true);
    const next = !inStack;
    if (next) await addToStack(user.id, card.id);
    else await removeFromStack(user.id, card.id);
    setInStack(next);
    setBusy(false);
  };

  const handleWatch = async () => {
    if (!user) return router.push(`/signup?next=/card/${card.id}`);
    setBusy(true);
    await toggleWatchlist(user.id, card.id, watched);
    setWatched(!watched);
    setBusy(false);
  };

  const annualValue = estimateAnnualValue(card.rewards);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-4">
        {card.featured && (
          <span className="label-micro text-accent bg-accentMuted px-3 py-1.5 rounded-lg inline-block">
            Featured — ${card.featuredBonus} bonus via our link
          </span>
        )}
        {card.instantApproval && (
          <span className="label-micro text-positive bg-surfaceRaised px-3 py-1.5 rounded-lg inline-block">
            Instant approval
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-1">
        <CardImage src={card.image} name={card.name} className="w-14 h-14 rounded-2xl" />
        <div>
          <h1 className="text-h1 text-ink leading-tight">{card.name}</h1>
          <p className="text-body text-inkMuted">
            {card.bank} · {card.network}
          </p>
        </div>
      </div>

      {card.rating && (
        <div className="flex items-center gap-2 mt-3 mb-10">
          <span className="text-small text-ink font-semibold">★ {card.rating.toFixed(1)}</span>
          <span className="text-small text-inkFaint">
            ({card.reviewCount?.toLocaleString()} reviews)
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="card-panel p-4">
          <p className="label-micro text-inkFaint mb-1">Annual fee</p>
          <p className="text-body text-ink font-medium">
            {card.annualFeeNote || (card.annualFee === 0 ? "None" : `$${card.annualFee}/yr`)}
          </p>
        </div>
        <div className="card-panel p-4">
          <p className="label-micro text-inkFaint mb-1">Interest rate</p>
          <p className="text-body text-ink font-medium">
            {card.interestRate === 0 ? "Charge card" : `${card.interestRate}%`}
          </p>
        </div>
        <div className="card-panel p-4">
          <p className="label-micro text-inkFaint mb-1">Est. annual value</p>
          <p className="text-body text-positive font-medium">${annualValue.toLocaleString()}</p>
        </div>
        <div className="card-panel p-4">
          <p className="label-micro text-inkFaint mb-1">Min. score</p>
          <p className="text-body text-ink font-medium">{card.creditScore}</p>
        </div>
      </div>

      <div className="card-panel p-6 mb-6">
        <p className="label-micro text-accent mb-2">Welcome bonus</p>
        <p className="text-body text-ink">{card.welcomeBonus}</p>
      </div>

      <div className="mb-8">
        <p className="label-micro text-inkFaint mb-3">Rewards — {card.rewardProgram}</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(card.rewards)
            .filter(([, v]) => v > 0)
            .map(([cat, val]) => (
              <div
                key={cat}
                className="flex justify-between bg-surface rounded-lg px-4 py-2.5"
              >
                <span className="text-small text-inkMuted capitalize">
                  {cat.replace(/_/g, " ")}
                </span>
                <span className="text-small text-ink font-semibold">{val}×</span>
              </div>
            ))}
        </div>
      </div>

      {(card.pros || card.cons) && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {card.pros && (
            <div className="card-panel p-5">
              <p className="label-micro text-positive mb-3">Pros</p>
              {card.pros.map((p, i) => (
                <p key={i} className="text-small text-inkMuted mb-2">
                  {p}
                </p>
              ))}
            </div>
          )}
          {card.cons && (
            <div className="card-panel p-5">
              <p className="label-micro text-negative mb-3">Cons</p>
              {card.cons.map((c, i) => (
                <p key={i} className="text-small text-inkMuted mb-2">
                  {c}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-10">
        <p className="label-micro text-inkFaint mb-3">Why get this card</p>
        {card.highlights.map((h, i) => (
          <p key={i} className="text-body text-inkMuted mb-2">
            → {h}
          </p>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <button className="btn-primary flex-1">
          {card.featuredBonus
            ? `Apply now & get $${card.featuredBonus} →`
            : "Apply now →"}
        </button>
        <button
          onClick={() => router.push(`/compare?ids=${card.id}`)}
          className="btn-secondary"
        >
          Compare
        </button>
      </div>

      <div className="flex gap-3 mb-10">
        <button onClick={handleAddToStack} disabled={busy} className="btn-ghost text-small flex items-center gap-1.5">
          {inStack && <IconCheck width={14} height={14} className="text-positive" />}
          {inStack ? "In your stack" : "Add to my stack"}
        </button>
        <span className="text-inkFaint">·</span>
        <button onClick={handleWatch} disabled={busy} className="btn-ghost text-small flex items-center gap-1.5">
          {watched && <IconCheck width={14} height={14} className="text-positive" />}
          {watched ? "Watching" : "Watch this card"}
        </button>
      </div>

      <button
        onClick={() => setShowMore((v) => !v)}
        className="flex items-center gap-2 text-small text-inkMuted hover:text-ink mb-6"
      >
        {showMore ? "Show less" : "Show more details"}
        <IconChevronDown
          width={14}
          height={14}
          className={`transition-transform duration-250 ${showMore ? "rotate-180" : ""}`}
        />
      </button>

      {showMore && (
        <div className="space-y-8 pb-8 border-t border-border pt-8">
          {card.fullDescription && (
            <p className="text-body text-inkMuted">{card.fullDescription}</p>
          )}

          {card.eligibility && (
            <div>
              <p className="label-micro text-inkFaint mb-3">Eligibility</p>
              {card.eligibility.map((e, i) => (
                <p key={i} className="text-small text-inkMuted mb-2">
                  → {e}
                </p>
              ))}
            </div>
          )}

          {card.fees && (
            <div>
              <p className="label-micro text-inkFaint mb-3">Fees</p>
              <div className="space-y-1">
                {card.fees.map((f) => (
                  <div
                    key={f.label}
                    className="flex justify-between bg-surface rounded-lg px-4 py-2.5"
                  >
                    <span className="text-small text-inkMuted">{f.label}</span>
                    <span className="text-small text-ink font-semibold">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {card.insurance.length > 0 && (
            <div>
              <p className="label-micro text-inkFaint mb-3">Insurance & benefits</p>
              {card.insurance.map((ins, i) => (
                <p key={i} className="text-small text-inkMuted mb-2">
                  → {ins}
                </p>
              ))}
            </div>
          )}

          {card.loungeAccess && (
            <div>
              <p className="label-micro text-inkFaint mb-3">Lounge access</p>
              <p className="text-small text-inkMuted">{card.loungeAccess}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
