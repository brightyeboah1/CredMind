import Link from "next/link";
import { IconArrowRight } from "./icons";

// ─── COLOURFUL PROMO TILE ─────────────────────────────────────────────────
// Used for the "For you" grid and the accounts row on Home/Explore —
// brings a bit of colour into an otherwise monochrome dark UI, same way
// Wealthsimple's home tab uses tinted photo tiles against a black canvas.

export default function AccountTile({
  href,
  title,
  blurb,
  gradient,
}: {
  href: string;
  title: string;
  blurb: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      style={{ background: gradient }}
      className="block rounded-2xl p-6 h-full transition-transform duration-250 hover:-translate-y-0.5 border border-border/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-body font-semibold text-ink mb-1.5">{title}</div>
          <div className="text-small text-inkMuted">{blurb}</div>
        </div>
        <IconArrowRight width={16} height={16} className="text-inkMuted flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}
