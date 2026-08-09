// ─── CUSTOM ICON SET ──────────────────────────────────────────────────────
// Hand-built, minimal line icons — 1.5px stroke, no fill, rounded caps.
// Deliberately avoids the "generic icon library" look (no Feather/Heroicons
// default shapes) and avoids emoji entirely per the design brief.
// All icons share the same visual language: single stroke weight, 24x24
// viewbox, rounded line caps/joins for a soft, Wealthsimple-adjacent feel.

import { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconCard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <line x1="2.5" y1="10" x2="21.5" y2="10" />
      <line x1="5.5" y1="14.5" x2="9.5" y2="14.5" />
    </svg>
  );
}

export function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
      <path d="M9.5 19.5v-6h5v6" />
    </svg>
  );
}

export function IconCompare(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4v13" />
      <path d="M4 13l4 4 4-4" />
      <path d="M16 20V7" />
      <path d="M20 11l-4-4-4 4" />
    </svg>
  );
}

export function IconTarget(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconStack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l8.5 4.8L12 12.6 3.5 7.8 12 3z" />
      <path d="M3.5 12.2L12 17l8.5-4.8" />
      <path d="M3.5 16.4L12 21.2l8.5-4.8" />
    </svg>
  );
}

export function IconTrend(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17l6-6.5 4 3.5L21 6" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

export function IconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5h16v11H9l-4 3.5v-3.5H4v-11z" />
      <line x1="7.5" y1="9.5" x2="16.5" y2="9.5" />
      <line x1="7.5" y1="13" x2="13" y2="13" />
    </svg>
  );
}

export function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="12" x2="19" y2="12" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function IconClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function IconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 018 0v3" />
    </svg>
  );
}

export function IconPlane(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l2 6 6 2-1.2 1.6L13 11l-1.5 6L15 19l-3 1.5L9 19l3.5-2-1.5-6L5.2 12.6 4 11l6-2 2-6z" />
    </svg>
  );
}

export function IconCoin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9M9.5 9.5h3.75a1.75 1.75 0 010 3.5H10.5a1.75 1.75 0 000 3.5h4" />
    </svg>
  );
}

export function IconShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
