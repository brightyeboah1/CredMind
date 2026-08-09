"use client";

import { useState } from "react";
import { CARDS } from "@/data/cards";
import { createClient } from "@/lib/supabase/client";
import CardImage from "@/components/CardImage";
import GatedPreview from "@/components/GatedPreview";
import { IconPlane, IconCoin, IconStack, IconTarget } from "@/components/icons";

type Result = {
  score: number;
  scoreLabel: string;
  annualValue: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  suggestedAdd: string;
};

const GOALS = [
  { id: "travel", label: "Travel", icon: IconPlane },
  { id: "cashback", label: "Cashback", icon: IconCoin },
  { id: "points", label: "Points", icon: IconStack },
  { id: "balanced", label: "Balanced", icon: IconTarget },
];

function OptimizerContent() {
  const [selected, setSelected] = useState<string[]>([]);
  const [goal, setGoal] = useState("travel");
  const [spending, setSpending] = useState({
    groceries: 500,
    dining: 300,
    gas: 150,
    travel: 200,
    streaming: 50,
    other: 400,
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/optimize-stack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardIds: selected, goal, spending }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);

    if (data.result) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          localStorage.setItem(
            `stackScore:${user.id}`,
            JSON.stringify({ ...data.result, savedAt: new Date().toISOString() })
          );
        } catch {
          // localStorage unavailable — non-fatal, Home just won't show a cached score
        }
      }
    }
  };

  const scoreColor = result
    ? result.score >= 8
      ? "text-positive"
      : result.score >= 6
      ? "text-accent"
      : "text-negative"
    : "text-accent";

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-h1 text-ink mb-2">Stack Optimizer</h1>
      <p className="text-body text-inkMuted mb-12">
        Select your cards, set your goal, and get an AI score with specific
        recommendations.
      </p>

      <div className="card-panel p-6 mb-6">
        <p className="label-micro text-inkFaint mb-4">Select your current cards (up to 5)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CARDS.map((c) => (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              disabled={!selected.includes(c.id) && selected.length >= 5}
              className={`text-left px-4 py-3 rounded-xl border transition-colors duration-250 flex items-center gap-2.5 disabled:opacity-40 ${
                selected.includes(c.id)
                  ? "border-accent bg-accentMuted"
                  : "border-border hover:border-inkFaint"
              }`}
            >
              <CardImage src={c.image} name={c.name} className="w-7 h-7 rounded-lg" />
              <div className="min-w-0">
                <div className="text-small text-ink font-medium truncate">{c.name}</div>
                <div className="text-small text-inkFaint truncate">{c.bank}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card-panel p-6">
          <p className="label-micro text-inkFaint mb-4">Optimization goal</p>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`flex flex-col items-center justify-center gap-2 py-6 rounded-xl border transition-colors duration-250 ${
                  goal === g.id
                    ? "border-accent bg-accentMuted text-ink"
                    : "border-border text-inkMuted hover:border-inkFaint"
                }`}
              >
                <g.icon width={20} height={20} />
                <span className="text-small font-medium">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card-panel p-6">
          <p className="label-micro text-inkFaint mb-4">Monthly spending ($)</p>
          <div className="space-y-3">
            {Object.entries(spending).map(([cat, val]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-small text-inkMuted w-20 capitalize flex-shrink-0">
                  {cat}
                </span>
                <input
                  type="number"
                  value={val}
                  onChange={(e) =>
                    setSpending((p) => ({ ...p, [cat]: +e.target.value }))
                  }
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={analyze}
        disabled={selected.length === 0 || loading}
        className="btn-primary w-full mb-10"
      >
        {loading
          ? "Analyzing..."
          : selected.length === 0
          ? "Select cards to analyze"
          : "Optimize my stack"}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="card-panel p-8 flex items-center gap-8">
            <div className={`text-display ${scoreColor}`}>{result.score}</div>
            <div>
              <div className="text-body font-semibold text-ink">
                {result.scoreLabel}
              </div>
              <div className="text-small text-inkMuted">
                Est. ${result.annualValue?.toLocaleString()} annual value
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card-panel p-5">
              <p className="label-micro text-positive mb-3">Strengths</p>
              {result.strengths?.map((s, i) => (
                <p key={i} className="text-small text-inkMuted mb-2">
                  {s}
                </p>
              ))}
            </div>
            <div className="card-panel p-5">
              <p className="label-micro text-negative mb-3">Gaps</p>
              {result.gaps?.map((g, i) => (
                <p key={i} className="text-small text-inkMuted mb-2">
                  {g}
                </p>
              ))}
            </div>
          </div>

          <div className="card-panel p-6">
            <p className="label-micro text-accent mb-4">Recommendations</p>
            {result.recommendations?.map((r, i) => (
              <p key={i} className="text-body text-inkMuted mb-3">
                {i + 1}. {r}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OptimizerPage() {
  return (
    <GatedPreview
      title="See your stack's score"
      blurb="Create a free account to run the Stack Optimizer and get an AI-scored breakdown of your cards."
    >
      <OptimizerContent />
    </GatedPreview>
  );
}
