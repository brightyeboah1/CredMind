import { ReactNode } from "react";

// ─── WIDE GRADIENT CTA BANNER ─────────────────────────────────────────────
// The "save money, become a millionaire" style banner — a bold colour block
// used sparingly to draw the eye to one specific promo (refer-a-friend, etc).

export default function PromoBanner({
  title,
  blurb,
  action,
  gradient = "linear-gradient(120deg, #1E3A66 0%, #12161F 100%)",
}: {
  title: string;
  blurb: string;
  action: ReactNode;
  gradient?: string;
}) {
  return (
    <div
      style={{ background: gradient }}
      className="rounded-2xl p-8 flex items-center justify-between gap-8 flex-wrap border border-border/50"
    >
      <div className="max-w-md">
        <div className="text-h3 text-ink mb-2">{title}</div>
        <p className="text-body text-inkMuted mb-5">{blurb}</p>
        {action}
      </div>
    </div>
  );
}
