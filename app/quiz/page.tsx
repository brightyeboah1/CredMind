"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { IconTarget, IconLock } from "@/components/icons";

const QUESTIONS = [
  {
    q: "What's your primary credit card goal?",
    opts: [
      "Maximize travel rewards",
      "Get cash back on spending",
      "Earn points for merchandise",
      "Build or rebuild my credit",
    ],
  },
  {
    q: "Biggest monthly spending category?",
    opts: ["Groceries", "Dining & restaurants", "Gas & transit", "Travel & flights"],
  },
  {
    q: "Annual fee comfort level?",
    opts: ["No annual fee only", "Up to $100/year", "Up to $150/year", "No limit if value is there"],
  },
  {
    q: "Approximate credit score?",
    opts: ["Below 600", "600–659", "660–719", "720+"],
  },
];

type Result = { cardName: string; matchScore: number; reason: string; topPerk: string };

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ q: string; a: string }[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [completed, setCompleted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const pick = async (opt: string) => {
    const newAnswers = [...answers, { q: QUESTIONS[step].q, a: opt }];
    if (step < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
      return;
    }
    setAnswers(newAnswers);
    setCompleted(true);

    // If logged in, fetch real results immediately
    if (user) {
      setLoading(true);
      const res = await fetch("/api/quiz-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: newAnswers }),
      });
      const data = await res.json();
      setResults(data.results || null);
      setLoading(false);
    }
  };

  // ─── Gated results state (not logged in) ────────────────────────────────
  if (completed && !user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accentMuted flex items-center justify-center mx-auto mb-6">
          <IconTarget width={24} height={24} className="text-accent" />
        </div>
        <h1 className="text-h1 text-ink mb-3">Your matches are ready</h1>
        <p className="text-body text-inkMuted mb-8">
          Create a free account to see your top 3 personalized card
          recommendations — takes 15 seconds.
        </p>
        <Link href="/signup" className="btn-primary inline-block">
          See my results
        </Link>
        <p className="text-small text-inkFaint mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-accent">
            Log in
          </Link>
        </p>
      </div>
    );
  }

  // ─── Results state (logged in) ──────────────────────────────────────────
  if (completed && user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-h1 text-ink mb-8 text-center">Your top matches</h1>
        {loading ? (
          <p className="text-body text-inkMuted text-center">Analyzing your answers...</p>
        ) : (
          <div className="space-y-4">
            {results?.map((r, i) => (
              <div key={i} className="card-panel p-6 flex items-center gap-5">
                <div className="text-h2 text-accent font-semibold w-16 text-center flex-shrink-0">
                  {r.matchScore}%
                </div>
                <div>
                  <div className="text-body font-semibold text-ink mb-1">
                    {r.cardName}
                  </div>
                  <div className="text-small text-inkMuted">{r.reason}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Quiz-taking state ───────────────────────────────────────────────────
  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;

  return (
    <div className="max-w-lg mx-auto px-6 py-20">
      <div className="mb-10">
        <div className="flex justify-between text-small text-inkFaint mb-2">
          <span>Question {step + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-250"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-h2 text-ink mb-8">{q.q}</h2>

      <div className="space-y-2">
        {q.opts.map((opt) => (
          <button
            key={opt}
            onClick={() => pick(opt)}
            className="w-full text-left px-5 py-4 rounded-xl card-panel hover:border-accent text-body text-ink transition-colors duration-250"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
