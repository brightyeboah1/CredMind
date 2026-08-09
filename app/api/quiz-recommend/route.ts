import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CARDS } from "@/data/cards";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Quiz can be TAKEN without login, but results require it — enforced here,
  // not just hidden in the UI, so the recommendation can't be fetched by
  // calling this route directly while logged out.
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { answers } = await req.json();

  const cardList = CARDS.map(
    (c) =>
      `${c.name} (${c.bank}): fee $${c.annualFee}, type ${c.type}, creditScore ${c.creditScore}, balanceTransfer ${c.balanceTransfer}`
  ).join("\n");

  const qas = answers
    .map((a: { q: string; a: string }) => `Q: ${a.q} A: ${a.a}`)
    .join("\n");

  const prompt = `Quiz answers:\n${qas}\n\nAvailable cards:\n${cardList}\n\nReturn ONLY a JSON array of 3 objects, no markdown:\n[{"cardName":"<exact>","matchScore":<80-99>,"reason":"<2-3 sentences>","topPerk":"<key perk>"}]`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: "Canadian credit card recommendation expert. Return only valid JSON arrays.",
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "[]";
    const clean = text.replace(/```json|```/g, "").trim();

    // Store the result for later personalization / analytics
    await supabase.from("quiz_results").insert({
      user_id: user.id,
      answers,
      recommended_cards: JSON.parse(clean),
    });

    return NextResponse.json({ results: JSON.parse(clean) });
  } catch (err) {
    console.error("Quiz recommendation error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
