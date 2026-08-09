import { createClient } from "@/lib/supabase/client";

// ─── STACK & WATCHLIST HELPERS ────────────────────────────────────────────
// Thin wrappers around Supabase for the user_cards ("your stack") and
// watchlist ("cards you're eyeing") tables added alongside the Home page.
// Every call fails soft (returns [] / no-ops) so the UI never crashes if a
// given Supabase project hasn't run the newer migration block yet.

export async function getStack(userId: string): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_cards")
      .select("card_id")
      .eq("user_id", userId);
    if (error) return [];
    return (data ?? []).map((r) => r.card_id as string);
  } catch {
    return [];
  }
}

export async function addToStack(userId: string, cardId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("user_cards")
      .upsert({ user_id: userId, card_id: cardId }, { onConflict: "user_id,card_id" });
    return !error;
  } catch {
    return false;
  }
}

export async function removeFromStack(userId: string, cardId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("user_cards")
      .delete()
      .eq("user_id", userId)
      .eq("card_id", cardId);
    return !error;
  } catch {
    return false;
  }
}

export async function getWatchlist(userId: string): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("watchlist")
      .select("card_id")
      .eq("user_id", userId);
    if (error) return [];
    return (data ?? []).map((r) => r.card_id as string);
  } catch {
    return [];
  }
}

export async function toggleWatchlist(userId: string, cardId: string, isWatched: boolean): Promise<boolean> {
  try {
    const supabase = createClient();
    if (isWatched) {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", userId)
        .eq("card_id", cardId);
      return !error;
    }
    const { error } = await supabase
      .from("watchlist")
      .upsert({ user_id: userId, card_id: cardId }, { onConflict: "user_id,card_id" });
    return !error;
  } catch {
    return false;
  }
}
