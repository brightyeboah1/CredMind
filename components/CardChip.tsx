"use client";

import { CreditCard } from "@/data/cards";
import CardImage from "./CardImage";
import { IconArrowRight } from "./icons";

function fmtFee(n: number) {
  return n === 0 ? "No annual fee" : `$${n}/yr`;
}

export default function CardChip({
  card,
  onClick,
  selected,
  onToggleCompare,
}: {
  card: CreditCard;
  onClick: () => void;
  selected?: boolean;
  onToggleCompare?: () => void;
}) {
  const topRewards = Object.entries(card.rewards)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div
      onClick={onClick}
      className={`card-panel p-6 cursor-pointer transition-all duration-250 hover:border-inkFaint ${
        selected ? "border-accent" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <CardImage src={card.image} name={card.name} className="w-10 h-10 rounded-xl" />
          <div>
            <div className="text-body font-semibold text-ink leading-tight">
              {card.name}
            </div>
            <div className="text-small text-inkMuted">{card.bank}</div>
          </div>
        </div>
        {card.featured && (
          <span className="label-micro text-accent bg-accentMuted px-2.5 py-1 rounded-lg">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {topRewards.map(([cat, val]) => (
          <span
            key={cat}
            className="text-small text-inkMuted bg-surfaceRaised px-2.5 py-1 rounded-lg"
          >
            {val}× {cat.replace(/_/g, " ")}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <div className="text-body font-medium text-ink">{fmtFee(card.annualFee)}</div>
          {card.featuredBonus && (
            <div className="text-small text-positive mt-0.5">
              +{card.featuredBonus} bonus
            </div>
          )}
        </div>
        {onToggleCompare ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`text-small font-medium px-3 py-1.5 rounded-lg transition-colors duration-250 ${
              selected
                ? "text-accent bg-accentMuted"
                : "text-inkMuted bg-surfaceRaised hover:text-ink"
            }`}
          >
            {selected ? "Added" : "Compare"}
          </button>
        ) : (
          <IconArrowRight width={16} height={16} className="text-inkFaint" />
        )}
      </div>
    </div>
  );
}
