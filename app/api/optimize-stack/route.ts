import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCards } from "@/lib/cards";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { cardIds, goal, spending } = await req.json();
  const allCards = await getCards(supabase);
  const stack = allCards.filter((c) => cardIds.includes(c.id));

  const prompt = `Canadian credit card expert. Analyze this stack.
CARDS: ${stack.map((c) => `${c.name} (${c.bank}): rewards=${JSON.stringify(c.rewards)}, fee=$${c.annualFee}`).join(" | ")}
MONTHLY SPEND: ${Object.entries(spending).map(([k, v]) => `${k}:$${v}`).join(",")}
GOAL: ${goal}
Return ONLY valid JSON: {"score":<1-10>,"scoreLabel":"<label>","annualValue":<CAD number>,"strengths":["...","..."],"gaps":["...","..."],"recommendations":["...","...","..."],"suggestedAdd":"<card name>"}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: "Canadian credit card optimization expert. Return valid JSON only.",
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const clean = text.replace(/```json|```/g, "").trim();

    return NextResponse.json({ result: JSON.parse(clean) });
  } catch (err) {
    console.error("Stack optimizer error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
