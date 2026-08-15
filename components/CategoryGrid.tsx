"use client";

import Link from "next/link";
import { SVGProps } from "react";
import {
  IconPlane,
  IconCoin,
  IconTarget,
  IconTrend,
  IconStack,
  IconShield,
  IconCheck,
} from "./icons";
import { FILTERS } from "@/data/filters";

const CATEGORY_ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  travel: IconPlane,
  cashback: IconCoin,
  rewards: IconTarget,
  low_interest: IconTrend,
  balance_transfer: IconStack,
  premium: IconShield,
  no_fee: IconCheck,
};

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {FILTERS.map((f) => {
        const Icon = CATEGORY_ICONS[f.id] ?? IconTarget;
        return (
          <Link
            key={f.id}
            href={`/browse?filter=${f.id}`}
            className="card-panel p-5 flex flex-col items-start gap-4 hover:border-inkFaint transition-colors duration-250"
          >
            <div className="w-10 h-10 rounded-xl bg-accentMuted flex items-center justify-center text-accent flex-shrink-0">
              <Icon width={18} height={18} />
            </div>
            <span className="text-body font-medium text-ink">{f.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
