"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const inputClass =
  "w-full bg-ivory/[0.06] border border-antique-gold/25 rounded-lg px-4 py-3.5 text-ivory text-sm font-sans outline-none placeholder:text-ivory/55 focus:border-antique-gold focus-visible:ring-2 focus-visible:ring-antique-gold/40 transition-colors duration-300";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Sign in via Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Check admin role in profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (!profile || !["admin", "manager"].includes(profile.role)) {
      await supabase.auth.signOut();
      setError("Access denied. This account does not have admin privileges.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-ground flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-antique-gold font-sans mb-2">
            G-Stitches
          </p>
          <h1 className="font-display font-black uppercase text-ivory text-3xl tracking-tight">
            Admin Panel
          </h1>
          <div className="mt-3 h-px w-12 bg-antique-gold/40 mx-auto" />
        </div>

        {/* Card */}
        <div className="bg-ivory/[0.05] border border-antique-gold/25 rounded-2xl p-7 sm:p-8">
          <p className="text-ivory/60 text-xs font-sans uppercase tracking-[0.2em] mb-6 text-center">
            Sign in to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory/65 font-sans block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-signal-red text-xs font-sans text-center py-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-signal-red text-pure-white rounded-full py-3.5 text-sm font-semibold uppercase tracking-[0.2em] font-sans hover:bg-signal-red/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-ivory/30 text-[10px] font-sans text-center mt-6 uppercase tracking-widest">
          Restricted Access
        </p>
      </div>
    </div>
  );
}
