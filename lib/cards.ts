import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreditCard } from "@/data/cards";

// ─── LIVE CARD DATA ───────────────────────────────────────────────────────
// Fetches from Supabase's `credit_cards` table instead of the static
// data/cards.ts seed file. `data/cards.ts` still exports the CreditCard
// type (reused here) but its CARDS array is no longer imported anywhere —
// kept only as a historical reference for the schema shape.

function mapRow(row: any): CreditCard {
  return {
    id: row.slug,
    name: row.name,
    bank: row.bank,
    type: row.card_type,
    network: row.network,
    annualFee: Number(row.annual_fee ?? 0),
    annualFeeNote: row.annual_fee_note ?? undefined,
    welcomeBonus: row.welcome_bonus_text ?? "",
    minSpend: row.min_spend_amount ? Number(row.min_spend_amount) : 0,
    minSpendPeriod: row.min_spend_period ?? "",
    interestRate: Number(row.purchase_rate ?? 0),
    rewards: row.rewards ?? {},
    rewardType: row.reward_type ?? "none",
    rewardProgram: row.reward_program ?? "None",
    insurance: row.insurance ?? [],
    loungeAccess: row.lounge_access ? row.lounge_details || "Lounge access included" : false,
    creditScore: row.min_credit_score ?? "",
    incomeReq: row.income_req ?? "",
    featured: row.is_featured ?? false,
    featuredBonus: row.featured_bonus_text ?? null,
    highlights: row.card_highlights ?? [],
    balanceTransfer: row.balance_transfer ?? false,
    btRate: row.bt_rate != null ? Number(row.bt_rate) : undefined,
    btMonths: row.bt_months ?? undefined,
    btFee: row.bt_fee != null ? Number(row.bt_fee) : undefined,
    image: row.image_url ?? `/cards/${row.slug}.png`,
    pros: row.pros ?? undefined,
    cons: row.cons ?? undefined,
    fullDescription: row.full_description ?? undefined,
    eligibility: row.eligibility ?? undefined,
    fees: row.fees ?? undefined,
    foreignTransactionFee: row.foreign_transaction_fee != null ? Number(row.foreign_transaction_fee) : undefined,
    instantApproval: row.instant_approval ?? undefined,
  };
}

export async function getCards(client?: SupabaseClient): Promise<CreditCard[]> {
  const supabase = client ?? createClient();
  const { data, error } = await supabase
    .from("credit_cards")
    .select("*")
    .eq("is_active", true)
    .order("name");
  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getCardBySlug(slug: string, client?: SupabaseClient): Promise<CreditCard | null> {
  const supabase = client ?? createClient();
  const { data, error } = await supabase
    .from("credit_cards")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error || !data) return null;
  return mapRow(data);
}
