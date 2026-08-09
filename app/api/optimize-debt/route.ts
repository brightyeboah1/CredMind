import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { debts, income, expenses, avalancheMonths, avalancheInterest, minMonths, minInterest } =
    await req.json();

  const prompt = `Canadian user's debt profile:
DEBTS: ${debts.map((d: any) => `${d.name}: $${d.balance} at ${d.rate}%`).join("; ")}
MONTHLY INCOME: $${income}
MONTHLY EXPENSES: $${Object.values(expenses).reduce((a: number, b: any) => a + Number(b), 0)}
AVALANCHE: ${avalancheMonths} months, $${avalancheInterest} interest
MIN ONLY: ${minMonths} months, $${minInterest} interest

Return ONLY valid JSON, no markdown:
{"why":"<2 sentences>","budgetTips":["tip1","tip2","tip3"],"btCardRecommended":true|false,"balanceTransferAdvice":"<1-2 sentences>","quickWin":"<one action this week>"}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      system: "Canadian personal finance expert. Return only valid JSON.",
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const clean = text.replace(/```json|```/g, "").trim();

    return NextResponse.json({ result: JSON.parse(clean) });
  } catch (err) {
    console.error("Debt optimizer error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
