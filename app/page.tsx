"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "@/data/cards";
import { getCards } from "@/lib/cards";
import { FILTERS } from "@/data/filters";
import { ACCOUNTS } from "@/data/accounts";
import CardChip from "@/components/CardChip";
import AccountTile from "@/components/AccountTile";

export default function ExplorePage() {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bank, setBank] = useState("All");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    getCards().then((data) => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  const banks = useMemo(() => [...new Set(cards.map((c) => c.bank))].sort(), [cards]);

  const toggleFilter = (id: string) =>
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const filtered = cards.filter((c) => {
    if (bank !== "All" && c.bank !== bank) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.bank.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (activeFilters.length > 0) {
      const activeTests = FILTERS.filter((f) => activeFilters.includes(f.id));
      if (!activeTests.every((f) => f.test(c))) return false;
    }
    return true;
  });

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="max-w-2xl mb-16">
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cards or banks"
          className="input-field max-w-xs"
        />
        <select
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="input-field max-w-[180px] cursor-pointer"
        >
          <option>All</option>
          {banks.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <div className="ml-auto text-small text-inkFaint">
          {loading ? "Loading…" : `${filtered.length} cards`}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => toggleFilter(f.id)}
            className={`text-small font-medium px-3.5 py-1.5 rounded-full border transition-colors duration-250 ${
              activeFilters.includes(f.id)
                ? "border-accent text-accent bg-accentMuted"
                : "border-border text-inkMuted hover:text-ink hover:border-inkFaint"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {compareIds.length > 0 && (
        <div className="card-panel p-4 mb-8 flex items-center justify-between">
          <span className="text-body text-ink">
            {compareIds.length} card{compareIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => setCompareIds([])}
              className="btn-ghost text-small"
            >
              Clear
            </button>
            <button
              onClick={() =>
                router.push(`/compare?ids=${compareIds.join(",")}`)
              }
              className="btn-primary text-small !py-2 !px-4"
            >
              Compare now
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="text-body text-inkMuted mb-20">Loading cards…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {filtered.map((card) => (
            <CardChip
              key={card.id}
              card={card}
              onClick={() => router.push(`/card/${card.id}`)}
              selected={compareIds.includes(card.id)}
              onToggleCompare={() => toggleCompare(card.id)}
            />
          ))}
        </div>
      )}

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
