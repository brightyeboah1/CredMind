"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CARDS } from "@/data/cards";
import CardImage from "@/components/CardImage";
import { IconClose } from "@/components/icons";

function CompareTable() {
  const searchParams = useSearchParams();
  const initialIds = useMemo(() => {
    const fromQuery = searchParams.get("ids")?.split(",").filter(Boolean) || [];
    if (fromQuery.length > 0) return fromQuery;
    return CARDS.filter((c) => c.featured).slice(0, 2).map((c) => c.id);
  }, []);

  const [ids, setIds] = useState<string[]>(initialIds);
  const [search, setSearch] = useState("");

  const cards = ids.map((id) => CARDS.find((c) => c.id === id)).filter(Boolean) as typeof CARDS;

  const addCard = (id: string) => {
    if (ids.includes(id) || ids.length >= 4) return;
    setIds((p) => [...p, id]);
    setSearch("");
  };

  const removeCard = (id: string) => setIds((p) => p.filter((x) => x !== id));

  const searchResults = search
    ? CARDS.filter(
        (c) =>
          !ids.includes(c.id) &&
          (c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.bank.toLowerCase().includes(search.toLowerCase()))
      ).slice(0, 5)
    : [];

  const rows: [string, (c: (typeof CARDS)[0]) => string][] = [
    ["Annual fee", (c) => (c.annualFee === 0 ? "None" : `$${c.annualFee}/yr`)],
    ["Network", (c) => c.network],
    ["Interest rate", (c) => (c.interestRate === 0 ? "Charge card" : `${c.interestRate}%`)],
    ["Reward program", (c) => c.rewardProgram],
    ["Lounge access", (c) => (c.loungeAccess ? "Yes" : "No")],
    ["Min. credit score", (c) => c.creditScore],
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-h1 text-ink mb-2">Compare cards</h1>
      <p className="text-body text-inkMuted mb-8">
        Add up to 4 cards — no need to pick them on Explore first.
      </p>

      <div className="relative mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ids.length >= 4 ? "Remove a card to add another" : "Add a card to compare"}
          disabled={ids.length >= 4}
          className="input-field"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 card-panel p-2 z-10">
            {searchResults.map((c) => (
              <button
                key={c.id}
                onClick={() => addCard(c.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surfaceRaised flex items-center gap-3"
              >
                <CardImage src={c.image} name={c.name} className="w-7 h-7 rounded-lg" />
                <div>
                  <div className="text-small text-ink">{c.name}</div>
                  <div className="text-small text-inkFaint">{c.bank}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="max-w-xl mx-auto text-center py-16">
          <p className="text-body text-inkMuted">
            Search above to add cards and start comparing.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <td className="pb-4" />
                {cards.map((c) => (
                  <td key={c.id} className="pb-4 px-4 align-top">
                    <div className="flex items-start gap-2">
                      <CardImage src={c.image} name={c.name} className="w-9 h-9 rounded-lg" />
                      <div className="flex-1">
                        <div className="text-body font-semibold text-ink">{c.name}</div>
                        <div className="text-small text-inkMuted">{c.bank}</div>
                      </div>
                      <button
                        onClick={() => removeCard(c.id)}
                        className="text-inkFaint hover:text-negative"
                      >
                        <IconClose width={14} height={14} />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, fn]) => (
                <tr key={label} className="border-t border-border">
                  <td className="py-4 text-small text-inkMuted">{label}</td>
                  {cards.map((c) => (
                    <td key={c.id} className="py-4 px-4 text-body text-ink">
                      {fn(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareTable />
    </Suspense>
  );
}
