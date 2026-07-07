"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const inputClass =
  "w-full bg-ivory/[0.07] border border-antique-gold/25 rounded-xl px-4 py-3.5 text-ivory text-sm font-sans outline-none placeholder:text-ivory/40 focus:border-antique-gold focus-visible:ring-2 focus-visible:ring-antique-gold/30 transition-all duration-300";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <p className="text-xs font-sans tracking-[0.3em] uppercase text-antique-gold mb-2">
          Welcome Back
        </p>
        <h1 className="font-display text-3xl font-bold text-ivory">Sign In</h1>
        <p className="text-ivory/50 text-sm font-sans mt-2">
          Access your orders, appointments, and messages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/55 font-sans block mb-1.5">
            Email Address
          </label>
          <input name="email" type="email" placeholder="you@example.com" required autoComplete="email" className={inputClass} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/55 font-sans">
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-[11px] text-antique-gold/80 hover:text-antique-gold transition-colors font-sans">
              Forgot password?
            </Link>
          </div>
          <input name="password" type="password" placeholder="Your password" required autoComplete="current-password" className={inputClass} />
        </div>

        {error && (
          <div className="bg-signal-red/10 border border-signal-red/30 rounded-xl px-4 py-3">
            <p className="text-signal-red text-sm font-sans">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-signal-red text-ivory py-4 rounded-full text-sm font-semibold uppercase tracking-[0.15em] font-sans hover:bg-signal-red/90 transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In…" : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <div className="h-px bg-antique-gold/15" />
        <p className="text-ivory/50 text-sm font-sans pt-2">
          New to G-Stitches?{" "}
          <Link href="/auth/sign-up" className="text-antique-gold hover:text-ivory transition-colors duration-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
