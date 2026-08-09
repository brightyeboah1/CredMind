import { CreditCard } from "./cards";

// ─── EXPLORE FILTER CHIPS ─────────────────────────────────────────────────
// Additive on top of the existing search/bank controls.

export type CardFilter = {
  id: string;
  label: string;
  test: (c: CreditCard) => boolean;
};

export const FILTERS: CardFilter[] = [
  { id: "low_interest", label: "Low interest", test: (c) => c.type === "low_interest" },
  { id: "balance_transfer", label: "Balance transfer", test: (c) => c.balanceTransfer },
  { id: "rewards", label: "Rewards", test: (c) => c.type === "rewards" },
  { id: "cashback", label: "Cashback", test: (c) => c.type === "cashback" },
  { id: "travel", label: "Travel", test: (c) => c.type === "travel" },
  { id: "premium", label: "Premium", test: (c) => c.type === "premium" },
  { id: "no_fee", label: "No annual fee", test: (c) => c.annualFee === 0 },
];
