"use client";

import { useState } from "react";
import ComingSoon from "@/components/ComingSoon";

type Debt = { id: number; name: string; balance: number; rate: number; minPayment: number };
type Strategy = "avalanche" | "snowball";

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

function simulate(debts: Debt[], extra: number, strategy: Strategy) {
  let ds = debts.map((d) => ({ ...d, rate: d.rate / 100 / 12 }));
  const sortFn =
    strategy === "avalanche"
      ? (a: typeof ds[0], b: typeof ds[0]) => b.rate - a.rate
      : (a: typeof ds[0], b: typeof ds[0]) => a.balance - b.balance;
  ds.sort(sortFn);
  let months = 0;
  let totalInterest = 0;
  const budget = ds.reduce((s, d) => s + d.minPayment, 0) + extra;

  while (ds.some((d) => d.balance > 0) && months < 600) {
    months++;
    let rem = budget;
    ds = ds.map((d) => {
      if (d.balance <= 0) return d;
      const interest = d.balance * d.rate;
      totalInterest += interest;
      d.balance += interest;
      const pay = Math.min(d.balance, d.minPayment);
      d.balance -= pay;
      rem -= pay;
      return d;
    });
    let i = 0;
    while (rem > 0.01 && i < ds.length) {
      if (ds[i].balance > 0) {
        const pay = Math.min(ds[i].balance, rem);
        ds[i].balance -= pay;
        rem -= pay;
      }
      i++;
    }
    ds.sort(sortFn);
  }
  return { months, totalInterest: Math.round(totalInterest) };
}

function DebtContent() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "RBC Visa", balance: 5000, rate: 19.99, minPayment: 100 },
  ]);
  const [income, setIncome] = useState(4500);
  const [expenses, setExpenses] = useState({
    rent: 1400,
    groceries: 400,
    utilities: 120,
    phone: 80,
    transitGas: 150,
    subscriptions: 60,
    diningOut: 200,
    other: 200,
  });
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
  const totalMin = debts.reduce((s, d) => s + d.minPayment, 0);
  const extraForDebt = Math.max(0, income - totalExpenses - totalMin);

  const minOnly = simulate(debts, 0, "avalanche");
  const avalanche = simulate(debts, extraForDebt, "avalanche");
  const snowball = simulate(debts, extraForDebt, "snowball");

  const winner: Strategy = avalanche.totalInterest <= snowball.totalInterest ? "avalanche" : "snowball";
  const winnerResult = winner === "avalanche" ? avalanche : snowball;
  const winnerLabel = winner === "avalanche" ? "Avalanche" : "Snowball";

  const addDebt = () =>
    setDebts((p) => [...p, { id: Date.now(), name: "", balance: 0, rate: 19.99, minPayment: 0 }]);
  const updateDebt = (id: number, field: keyof Debt, val: string) =>
    setDebts((p) => p.map((d) => (d.id === id ? { ...d, [field]: field === "name" ? val : +val } : d)));
  const removeDebt = (id: number) => setDebts((p) => p.filter((d) => d.id !== id));

  const analyze = async () => {
    setLoading(true);
    const res = await fetch("/api/optimize-debt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        debts,
        income,
        expenses,
        avalancheMonths: avalanche.months,
        avalancheInterest: avalanche.totalInterest,
        minMonths: minOnly.months,
        minInterest: minOnly.totalInterest,
      }),
    });
    const data = await res.json();
    setAiResult(data.result);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-h1 text-ink mb-2">Debt Optimizer</h1>
      <p className="text-body text-inkMuted mb-12">
        Enter your debts, income, and expenses. See exactly when you'll be
        debt-free — and how to get there faster.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="label-micro text-inkFaint mb-3">Your debts</p>
          {debts.map((d) => (
            <div key={d.id} className="card-panel p-4 mb-3">
              <div className="flex gap-2 mb-3">
                <input
                  value={d.name}
                  onChange={(e) => updateDebt(d.id, "name", e.target.value)}
                  placeholder="Debt name"
                  className="input-field"
                />
                <button
                  onClick={() => removeDebt(d.id)}
                  className="text-inkFaint hover:text-negative px-3"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="label-micro text-inkFaint mb-1">Balance ($)</p>
                  <input
                    type="number"
                    value={d.balance}
                    onChange={(e) => updateDebt(d.id, "balance", e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <p className="label-micro text-inkFaint mb-1">Rate (%)</p>
                  <input
                    type="number"
                    value={d.rate}
                    onChange={(e) => updateDebt(d.id, "rate", e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <p className="label-micro text-inkFaint mb-1">Min payment</p>
                  <input
                    type="number"
                    value={d.minPayment}
                    onChange={(e) => updateDebt(d.id, "minPayment", e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addDebt} className="btn-ghost text-small">
            + Add another debt
          </button>

          <div className="card-panel p-4 mt-4 flex items-center justify-between">
            <span className="text-body text-inkMuted">Total debt</span>
            <span className="text-h3 text-negative">
              {fmt(debts.reduce((s, d) => s + d.balance, 0))}
            </span>
          </div>
        </div>

        <div className="card-panel p-6">
          <p className="label-micro text-inkFaint mb-2">Monthly take-home income ($)</p>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(+e.target.value)}
            className="input-field mb-6 !text-h3 !text-positive !font-semibold !py-2"
          />
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(expenses).map(([cat, val]) => (
              <div key={cat}>
                <p className="label-micro text-inkFaint mb-1 capitalize">
                  {cat.replace(/([A-Z])/g, " $1")}
                </p>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => setExpenses((p) => ({ ...p, [cat]: +e.target.value }))}
                  className="input-field"
                />
              </div>
            ))}
          </div>
          <div className="space-y-1.5 pt-4 border-t border-border">
            <div className="flex justify-between text-small">
              <span className="text-inkMuted">Total expenses</span>
              <span className="text-ink">{fmt(totalExpenses)}</span>
            </div>
            <div className="flex justify-between text-small">
              <span className="text-inkMuted">After expenses</span>
              <span className="text-positive">{fmt(income - totalExpenses)}</span>
            </div>
            <div className="flex justify-between text-small">
              <span className="text-inkMuted">Min. payments</span>
              <span className="text-ink">{fmt(totalMin)}</span>
            </div>
            <div className="flex justify-between text-small">
              <span className="text-inkMuted">Extra for debt</span>
              <span className="text-accent font-semibold">{fmt(extraForDebt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="card-panel p-6">
          <p className="label-micro text-inkFaint mb-2">Minimum payments only</p>
          <p className="text-h2 text-negative">{minOnly.months}mo</p>
          <p className="text-small text-inkMuted">{fmt(minOnly.totalInterest)} interest</p>
          <p className="text-small text-inkFaint mt-1">Paying minimums only</p>
        </div>
        <div
          className={`card-panel p-6 relative ${winner === "avalanche" ? "border-accent" : ""}`}
        >
          {winner === "avalanche" && (
            <span className="label-micro text-accent bg-accentMuted px-2 py-1 rounded-md absolute top-4 right-4">
              AI Pick
            </span>
          )}
          <p className="label-micro text-inkFaint mb-2">Avalanche method</p>
          <p className="text-h2 text-ink">{avalanche.months}mo</p>
          <p className="text-small text-inkMuted">{fmt(avalanche.totalInterest)} interest</p>
          <p className="text-small text-inkFaint mt-1">Highest rate first — saves most interest</p>
        </div>
        <div
          className={`card-panel p-6 relative ${winner === "snowball" ? "border-accent" : ""}`}
        >
          {winner === "snowball" && (
            <span className="label-micro text-accent bg-accentMuted px-2 py-1 rounded-md absolute top-4 right-4">
              AI Pick
            </span>
          )}
          <p className="label-micro text-inkFaint mb-2">Snowball method</p>
          <p className="text-h2 text-ink">{snowball.months}mo</p>
          <p className="text-small text-inkMuted">{fmt(snowball.totalInterest)} interest</p>
          <p className="text-small text-inkFaint mt-1">Smallest balance first — psychological wins</p>
        </div>
      </div>

      {minOnly.totalInterest > winnerResult.totalInterest && (
        <div className="card-panel p-6 mb-10 border-positive/40">
          <p className="text-body text-ink font-medium mb-1">
            By using {winnerLabel} vs. Minimum, you save{" "}
            {fmt(minOnly.totalInterest - winnerResult.totalInterest)} in interest and{" "}
            {minOnly.months - winnerResult.months} months
          </p>
          <p className="text-small text-inkMuted">
            That's real money staying in your pocket instead of going to the bank.
          </p>
        </div>
      )}

      <button onClick={analyze} disabled={loading} className="btn-primary w-full mb-8">
        {loading ? "Building your plan..." : "Get AI-powered payoff plan"}
      </button>

      {aiResult && (
        <div className="space-y-4">
          <div className="card-panel p-6">
            <p className="text-body text-ink">{aiResult.why}</p>
          </div>
          <div className="card-panel p-6">
            <p className="label-micro text-accent mb-3">Budget tips</p>
            {aiResult.budgetTips?.map((t: string, i: number) => (
              <p key={i} className="text-small text-inkMuted mb-2">
                {t}
              </p>
            ))}
          </div>
          {aiResult.btCardRecommended && (
            <div className="card-panel p-6 border-accent/40">
              <p className="label-micro text-accent mb-2">Balance transfer strategy</p>
              <p className="text-small text-inkMuted">{aiResult.balanceTransferAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DebtPage() {
  return (
    <ComingSoon
      title="Debt Optimizer is almost ready"
      blurb="We're putting the finishing touches on this — check back soon for an AI-powered plan to become debt-free faster."
    >
      <DebtContent />
    </ComingSoon>
  );
}
