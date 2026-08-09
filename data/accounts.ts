// ─── ACCOUNT PRODUCT TILES ────────────────────────────────────────────────
// Colourful promo tiles for chequing/savings/loans/etc — shown on Home and
// Explore. Not part of the card catalogue, and not filterable alongside it.
// `id` doubles as the /accounts/[type] slug. `href` is left as a placeholder
// route for now — swap in real (affiliate) links whenever they're ready.

export type AccountProduct = {
  id: string;
  title: string;
  blurb: string;
  ctaLabel: string;
  gradient: string;
};

export const ACCOUNTS: AccountProduct[] = [
  {
    id: "chequing",
    title: "Chequing accounts",
    blurb: "No monthly fees, no minimum balance — everyday spending accounts.",
    ctaLabel: "Compare chequing",
    gradient: "linear-gradient(135deg, #1E3A66 0%, #12161F 100%)",
  },
  {
    id: "savings",
    title: "High-interest savings",
    blurb: "Earn more on cash you're not touching day-to-day.",
    ctaLabel: "Compare savings",
    gradient: "linear-gradient(135deg, #14432B 0%, #12161F 100%)",
  },
  {
    id: "loans",
    title: "Personal loans",
    blurb: "Fixed-rate borrowing for big purchases or consolidation.",
    ctaLabel: "Explore loans",
    gradient: "linear-gradient(135deg, #4A2E12 0%, #12161F 100%)",
  },
  {
    id: "loc",
    title: "Lines of credit",
    blurb: "Flexible borrowing you draw from only when you need it.",
    ctaLabel: "Explore LOCs",
    gradient: "linear-gradient(135deg, #3B1E4A 0%, #12161F 100%)",
  },
  {
    id: "mortgages",
    title: "Mortgages",
    blurb: "Rates and terms for buying or renewing in Canada.",
    ctaLabel: "Compare mortgages",
    gradient: "linear-gradient(135deg, #4A1E2E 0%, #12161F 100%)",
  },
];
