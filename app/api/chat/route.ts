import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const FREE_MONTHLY_LIMIT = 5;

const SYSTEM_PROMPT = `You are a friendly, expert Canadian personal finance advisor. You ONLY answer questions about:
- Canadian credit cards, rewards programs (Aeroplan, Scene+, Avion, PC Optimum, etc.)
- Credit scores, improving credit in Canada
- Debt payoff strategies (avalanche, snowball, balance transfers)
- Budgeting and personal finance for Canadians

If asked about anything unrelated to finance, credit, or budgeting, politely decline and redirect.
This is educational information only, not licensed financial advice — make that clear if the user
asks for something that sounds like personalized professional advice.
Be warm, concise, and specific. Use CAD dollar signs. Keep responses under 200 words unless detail is needed.`;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already blocks unauthenticated access
  // to /chat, but the API route must never trust that alone.
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { messages } = await req.json();

  // ─── Usage cap enforcement ──────────────────────────────────────────────
  // Uses the service-role client because this write must succeed
  // regardless of the RLS policy nuances, and we've already verified
  // the user's identity above via their session cookie.
  const service = createServiceClient();

  const { data: profile } = await service
    .from("profiles")
    .select("subscription_tier, credit_balance")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.subscription_tier === "premium";
  const month = new Date().toISOString().slice(0, 7); // "2026-08"

  if (!isPremium) {
    const { data: usage } = await service
      .from("usage_tracking")
      .select("count")
      .eq("user_id", user.id)
      .eq("feature", "ai_chat")
      .eq("month", month)
      .single();

    const currentCount = usage?.count ?? 0;

    if (currentCount >= FREE_MONTHLY_LIMIT) {
      return NextResponse.json(
        {
          error: "limit_reached",
          message:
            "You've used your 5 free messages this month. Upgrade to Premium for unlimited AI chat.",
        },
        { status: 402 }
      );
    }

    // Increment usage — upsert handles the "first message this month" case
    await service.from("usage_tracking").upsert(
      {
        user_id: user.id,
        feature: "ai_chat",
        month,
        count: currentCount + 1,
      },
      { onConflict: "user_id,feature,month" }
    );
  }

  // ─── Call Claude ─────────────────────────────────────────────────────────
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
