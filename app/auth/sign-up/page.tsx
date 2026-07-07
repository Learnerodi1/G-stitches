"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const inputClass =
  "w-full bg-ivory/[0.07] border border-antique-gold/25 rounded-xl px-4 py-3.5 text-ivory text-sm font-sans outline-none placeholder:text-ivory/40 focus:border-antique-gold focus-visible:ring-2 focus-visible:ring-antique-gold/30 transition-all duration-300";

type SuccessState = "loggedin" | "confirm_email" | null;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<SuccessState>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const fullName = (fd.get("fullName") as string).trim();
    const email = (fd.get("email") as string).trim();
    const phone = (fd.get("phone") as string).trim();
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;

    if (!fullName) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    // Test Supabase connection first
    const { error: pingError } = await supabase.from("profiles").select("id").limit(1);
    if (pingError && (pingError.code === "PGRST301" || pingError.message?.includes("fetch"))) {
      setError("Cannot connect to the server. Check your internet connection or your Supabase project may be paused — visit supabase.com to wake it up.");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });

    if (signUpError) {
      // Show the most useful part of the error
      const msg = signUpError.message
  || (signUpError as unknown as Record<string, unknown>).error_description as string
  || `Error code: ${(signUpError as unknown as Record<string, unknown>).status ?? "unknown"}`;
      setError(msg || "Sign up failed. Your Supabase project may be paused at supabase.com.");
      setLoading(false);
      return;
    }

    // Fallback: manually create profile row in case the DB trigger didn't run
    if (data.user) {
      await supabase.from("profiles").upsert(
        { id: data.user.id, email, full_name: fullName, phone: phone || "", role: "customer" },
        { onConflict: "id", ignoreDuplicates: true }
      );
    }

    setLoading(false);

    if (data.session) {
      setSuccess("loggedin");
      setTimeout(() => router.push("/account"), 1500);
    } else {
      setSuccess("confirm_email");
    }
  };

  // ── Success: logged in immediately ──────────────────────────
  if (success === "loggedin") {
    return (
      <div className="w-full max-w-md text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-antique-gold/15 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-antique-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-ivory">Account Created!</h2>
        <p className="text-ivory/60 font-sans text-sm">
          Welcome to G-Stitches. Taking you to your dashboard…
        </p>
        <div className="flex gap-1.5 justify-center mt-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-antique-gold/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Success: email confirmation required ─────────────────────
  if (success === "confirm_email") {
    return (
      <div className="w-full max-w-md text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-antique-gold/15 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-antique-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-ivory">Check Your Email</h2>
        <p className="text-ivory/60 font-sans text-sm max-w-xs mx-auto leading-relaxed">
          We've sent a confirmation link to your email address. Click it to activate your account, then sign in.
        </p>
        <p className="text-ivory/35 text-xs font-sans">Don't see it? Check your spam folder.</p>
        <Link
          href="/auth/sign-in"
          className="inline-block mt-2 bg-signal-red text-ivory px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-[0.15em] font-sans hover:bg-signal-red/90 transition-all duration-300"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <p className="text-xs font-sans tracking-[0.3em] uppercase text-antique-gold mb-2">
          Join G-Stitches
        </p>
        <h1 className="font-display text-3xl font-bold text-ivory">Create Account</h1>
        <p className="text-ivory/50 text-sm font-sans mt-2">
          Track your orders, appointments, and messages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/55 font-sans block mb-1.5">
            Full Name <span className="text-signal-red">*</span>
          </label>
          <input name="fullName" type="text" placeholder="Your full name" required className={inputClass} />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/55 font-sans block mb-1.5">
            Email Address <span className="text-signal-red">*</span>
          </label>
          <input name="email" type="email" placeholder="you@example.com" required autoComplete="email" className={inputClass} />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/55 font-sans block mb-1.5">
            Phone Number
          </label>
          <input name="phone" type="tel" placeholder="+234 000 0000 000" className={inputClass} />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/55 font-sans block mb-1.5">
            Password <span className="text-signal-red">*</span>
          </label>
          <input name="password" type="password" placeholder="Min. 6 characters" required autoComplete="new-password" className={inputClass} />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/55 font-sans block mb-1.5">
            Confirm Password <span className="text-signal-red">*</span>
          </label>
          <input name="confirm" type="password" placeholder="Repeat password" required autoComplete="new-password" className={inputClass} />
        </div>

        {error && (
          <div className="bg-signal-red/10 border border-signal-red/30 rounded-xl px-4 py-3 flex items-start gap-2">
            <svg className="w-4 h-4 text-signal-red shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            <p className="text-signal-red text-sm font-sans">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-signal-red text-ivory py-4 rounded-full text-sm font-semibold uppercase tracking-[0.15em] font-sans hover:bg-signal-red/90 transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account…" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <div className="h-px bg-antique-gold/15" />
        <p className="text-ivory/50 text-sm font-sans pt-2">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-antique-gold hover:text-ivory transition-colors duration-300 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
