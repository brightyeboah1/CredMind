"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "@/data/cards";
import { getCards } from "@/lib/cards";
import { ACCOUNTS } from "@/data/accounts";
import CardChip from "@/components/CardChip";
import AccountTile from "@/components/AccountTile";
import FeaturedCardCarousel from "@/components/FeaturedCardCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import CardSearchBar from "@/components/CardSearchBar";

const POPULAR_COUNT = 5;

export default function ExplorePage() {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCards().then((data) => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  const featured = cards.filter((c) => c.featured);
  const popular = cards.slice(0, POPULAR_COUNT);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="max-w-2xl mb-10">
        <h1 className="text-display text-ink mb-4">
          Every Canadian credit card.
          <br />
          One place to compare.
        </h1>
        <p className="text-body-lg text-inkMuted">
          Browse, compare, and find the card that actually fits how you spend —
          no login required.
        </p>
      </div>

      {!loading && <CardSearchBar cards={cards} />}

      {/* Featured cards */}
      {!loading && featured.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-h3 text-ink">Featured cards</h2>
          </div>
          <FeaturedCardCarousel cards={featured} />
        </div>
      )}

      {/* Browse by category */}
      <div className="mb-16">
        <h2 className="text-h3 text-ink mb-5">Browse by category</h2>
        <CategoryGrid />
      </div>

      {/* Popular cards */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-h3 text-ink">Popular cards</h2>
          <span className="text-small text-inkFaint">
            {loading ? "Loading…" : `${cards.length} cards total`}
          </span>
        </div>

        {loading ? (
          <div className="text-body text-inkMuted">Loading cards…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {popular.map((card) => (
              <CardChip key={card.id} card={card} onClick={() => router.push(`/card/${card.id}`)} />
            ))}
          </div>
        )}

        <button onClick={() => router.push("/browse")} className="btn-secondary w-full sm:w-auto">
          View all credit cards
        </button>
      </div>

      {/* Other products — not part of the card catalogue */}
      <div>
        <h2 className="text-h3 text-ink mb-5">Other products</h2>
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
