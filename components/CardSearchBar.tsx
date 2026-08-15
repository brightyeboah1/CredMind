"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "@/data/cards";
import CardImage from "./CardImage";
import { IconSearch } from "./icons";

export default function CardSearchBar({ cards }: { cards: CreditCard[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = query
    ? cards
        .filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.bank.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const goToCard = (id: string) => {
    setQuery("");
    setFocused(false);
    router.push(`/card/${id}`);
  };

  return (
    <div className="relative max-w-xl mb-16">
      <div className="relative">
        <IconSearch
          width={18}
          height={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-inkFaint pointer-events-none"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results.length > 0) goToCard(results[0].id);
          }}
          placeholder="Search for a card by name or bank"
          className="input-field !pl-11"
        />
      </div>

      {focused && query && (
        <div className="absolute top-full left-0 right-0 mt-2 card-panel p-2 z-20 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-3 py-2.5 text-small text-inkFaint">No cards match &ldquo;{query}&rdquo;</div>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                onClick={() => goToCard(c.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surfaceRaised flex items-center gap-3"
              >
                <CardImage src={c.image} name={c.name} className="w-8 h-8 rounded-lg" />
                <div className="min-w-0">
                  <div className="text-small text-ink truncate">{c.name}</div>
                  <div className="text-small text-inkFaint">{c.bank}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
