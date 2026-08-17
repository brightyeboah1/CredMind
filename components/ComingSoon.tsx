import { ReactNode } from "react";
import Link from "next/link";
import { IconClock } from "./icons";

// ─── COMING SOON ──────────────────────────────────────────────────────────
// Same blurred-preview visual language as GatedPreview, but with no auth
// dependency — used for pages that aren't ready to ship yet (rather than
// pages gated behind login), so it never dead-ends on a broken sign-in flow.

export default function ComingSoon({
  children,
  title,
  blurb,
}: {
  children: ReactNode;
  title: string;
  blurb: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none blur-sm opacity-50 select-none">{children}</div>
      <div className="absolute inset-0 flex items-start justify-center pt-24 px-6">
        <div className="card-panel p-8 max-w-sm text-center shadow-raised bg-surface/95 backdrop-blur">
          <div className="w-14 h-14 rounded-2xl bg-accentMuted flex items-center justify-center mx-auto mb-6">
            <IconClock width={22} height={22} className="text-accent" />
          </div>
          <h2 className="text-h3 text-ink mb-2">{title}</h2>
          <p className="text-body text-inkMuted mb-6">{blurb}</p>
          <Link href="/" className="btn-primary w-full inline-block">
            Browse credit cards instead
          </Link>
        </div>
      </div>
    </div>
  );
}
