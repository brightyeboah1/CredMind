"use client";

import { useState, useRef, useEffect } from "react";
import { IconChat, IconArrowRight } from "@/components/icons";
import ComingSoon from "@/components/ComingSoon";

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Which cards pair best together?",
  "How do I improve my credit score fast?",
  "Should I use a balance transfer card?",
  "What's the best cashback card in Canada?",
];

function ChatContent() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi — I'm your Canadian credit and finance advisor. Ask me anything about cards, your score, debt payoff, or budgeting.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", text: msg }]);
    setLoading(true);

    const history = [...messages, { role: "user" as const, text: msg }].map(
      (m) => ({ role: m.role, content: m.text })
    );

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    if (res.status === 402) {
      setLimitReached(true);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setMessages((p) => [...p, { role: "assistant", text: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-h1 text-ink mb-2">AI Educator</h1>
        <p className="text-body text-inkMuted">
          Canadian credit & finance questions, answered plainly.
        </p>
      </div>

      <div className="card-panel flex flex-col h-[560px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-body ${
                  m.role === "user"
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-surfaceRaised text-ink rounded-bl-md"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surfaceRaised px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-inkFaint animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {limitReached && (
            <div className="card-panel p-5 border-accent/40">
              <p className="text-body text-ink mb-3">
                You've used your 5 free messages this month.
              </p>
              <button className="btn-primary text-small !py-2 !px-4">
                Upgrade to Premium — $9.99/mo
              </button>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-small text-inkMuted bg-surfaceRaised hover:text-ink px-3 py-1.5 rounded-full transition-colors duration-250"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-border flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about credit cards, debt, scores..."
            disabled={limitReached}
            className="input-field flex-1"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading || limitReached}
            className="btn-primary !px-4"
          >
            <IconArrowRight width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ComingSoon
      title="AI Educator is almost ready"
      blurb="We're putting the finishing touches on this — check back soon to ask questions about Canadian credit, debt, and your score."
    >
      <ChatContent />
    </ComingSoon>
  );
}
