"use client";

import Link from "next/link";
import { CreditCard } from "@/data/cards";
import CardImage from "./CardImage";

function fmtFee(n: number) {
  return n === 0 ? "No annual fee" : `$${n}/yr`;
}

export default function FeaturedCardCarousel({ cards }: { cards: CreditCard[] }) {
  if (cards.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/card/${card.id}`}
          className="card-panel p-5 flex-shrink-0 w-[240px] hover:border-inkFaint transition-colors duration-250 group"
        >
          <div className="flex items-start justify-between mb-4">
            <CardImage src={card.image} name={card.name} className="w-11 h-11 rounded-xl" />
            {card.featuredBonus && (
              <span className="label-micro text-positive bg-surfaceRaised px-2 py-1 rounded-lg whitespace-nowrap">
                +{card.featuredBonus}
              </span>
            )}
          </div>
          <div className="text-body font-semibold text-ink leading-tight mb-1 line-clamp-2">
            {card.name}
          </div>
          <div className="text-small text-inkMuted mb-5">{card.bank}</div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-small text-inkMuted">{fmtFee(card.annualFee)}</span>
            <span className="text-small text-accent font-medium group-hover:underline">
              View card
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
