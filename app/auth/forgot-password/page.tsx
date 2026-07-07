"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

const inputClass =
  "w-full bg-ivory/[0.07] border border-antique-gold/25 rounded-xl px-4 py-3.5 text-ivory text-sm font-sans outline-none placeholder:text-ivory/40 focus:border-antique-gold focus-visible:ring-2 focus-visible:ring-antique-gold/30 transition-all duration-300";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = (new FormData(e.currentTarget)).get("email") as string;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full max-w-md text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-antique-gold/15 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-antique-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-ivory">Check Your Inbox</h2>
        <p className="text-ivory/60 font-sans text-sm max-w-xs mx-auto leading-relaxed">
          We've sent a password reset link to your email address. Check your spam folder if you don't see it.
        </p>
        <Link
          href="/auth/sign-in"
          className="inline-block text-antique-gold text-sm font-sans hover:text-ivory transition-colors pt-2"
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <p className="text-xs font-sans tracking-[0.3em] uppercase text-antique-gold mb-2">
          Reset Password
        </p>
        <h1 className="font-display text-3xl font-bold text-ivory">Forgot Password?</h1>
        <p className="text-ivory/50 text-sm font-sans mt-2 max-w-xs mx-auto leading-relaxed">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/55 font-sans block mb-1.5">
            Email Address
          </label>
          <input name="email" type="email" placeholder="you@example.com" required className={inputClass} />
        </div>

        {error && (
          <div className="bg-signal-red/10 border border-signal-red/30 rounded-xl px-4 py-3">
            <p className="text-signal-red text-sm font-sans">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-signal-red text-ivory py-4 rounded-full text-sm font-semibold uppercase tracking-[0.15em] font-sans hover:bg-signal-red/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/sign-in" className="text-antique-gold/70 text-sm font-sans hover:text-antique-gold transition-colors">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
