"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // profiles row is auto-created by the DB trigger (see schema doc)
    setDone(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  };

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-6 py-20 text-center">
        <h1 className="text-h1 text-ink mb-3">Check your email</h1>
        <p className="text-body text-inkMuted">
          We sent a confirmation link to <span className="text-ink">{email}</span>.
          Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-h1 text-ink mb-2">Create your account</h1>
      <p className="text-body text-inkMuted mb-8">
        Free — unlocks the Stack Optimizer, Debt Optimizer, and AI Educator
      </p>

      <button onClick={handleGoogle} className="btn-secondary w-full mb-4">
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-small text-inkFaint">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSignup} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        {error && <p className="text-small text-negative">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account..." : "Create free account"}
        </button>
      </form>

      <p className="text-small text-inkMuted mt-6 text-center">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="text-accent hover:text-accentHover"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
