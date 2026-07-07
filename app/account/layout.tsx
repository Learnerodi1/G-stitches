"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// Nav items
// ─────────────────────────────────────────────────────────────
const navItems = [
  {
    href: "/account",
    label: "Overview",
    d: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  },
  {
    href: "/account/orders",
    label: "My Orders",
    d: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z",
  },
  {
    href: "/account/appointments",
    label: "Appointments",
    d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  },
  {
    href: "/account/messages",
    label: "Messages",
    d: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
  },
  {
    href: "/account/profile",
    label: "Edit Profile",
    d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z",
  },
];

// ─────────────────────────────────────────────────────────────
// Sidebar inner content (shared desktop/mobile)
// ─────────────────────────────────────────────────────────────
function SidebarInner({
  user,
  profile,
  pathname,
  onSignOut,
  onClose,
}: {
  user: User | null;
  profile: { full_name: string; avatar_url: string };
  pathname: string;
  onSignOut: () => void;
  onClose?: () => void;
}) {
  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-antique-gold/12 shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="block font-display text-base font-bold tracking-[0.25em] text-ivory hover:text-antique-gold transition-colors duration-300"
        >
          G-STITCHES
        </Link>
        <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-antique-gold/40 mt-0.5">
          My Account
        </p>
      </div>

      {/* Profile summary */}
      <Link
        href="/account/profile"
        onClick={onClose}
        className="flex items-center gap-3 px-5 py-4 border-b border-antique-gold/12 hover:bg-ivory/[0.04] transition-colors duration-200 group shrink-0"
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-antique-gold/15 border border-antique-gold/30 shrink-0">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" sizes="36px" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-antique-gold font-sans">
              {initials}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold font-sans text-ivory truncate group-hover:text-antique-gold transition-colors duration-200">
            {profile.full_name || "My Profile"}
          </p>
          <p className="text-[10px] font-sans text-ivory/30 truncate">{user?.email}</p>
        </div>
        <svg className="w-3.5 h-3.5 text-ivory/20 group-hover:text-antique-gold/60 shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[9px] font-semibold font-sans uppercase tracking-[0.3em] text-antique-gold/35">
          Navigation
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={[
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-sans font-medium transition-all duration-200",
                active
                  ? "bg-antique-gold/10 text-ivory"
                  : "text-ivory/45 hover:text-ivory/80 hover:bg-ivory/[0.05]",
              ].join(" ")}
            >
              {/* Left indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-antique-gold rounded-r-full" />
              )}
              <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
              </svg>
              <span className="flex-1 tracking-wide">{item.label}</span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-antique-gold shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: store link + sign out */}
      <div className="px-3 py-3 border-t border-antique-gold/10 space-y-0.5 shrink-0">
        <Link
          href="/gallery"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-sans text-ivory/30 hover:text-ivory/60 transition-colors duration-200"
        >
          <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Store
        </Link>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-sans text-signal-red/50 hover:text-signal-red hover:bg-signal-red/5 transition-all duration-200"
        >
          <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [loading, setLoading]       = useState(true);
  const [user, setUser]             = useState<User | null>(null);
  const [profile, setProfile]       = useState({ full_name: "", avatar_url: "" });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/sign-in"); return; }
      setUser(user);
      const { data } = await supabase.from("profiles")
        .select("full_name, avatar_url").eq("id", user.id).single();
      setProfile({
        full_name:  data?.full_name  ?? user.user_metadata?.full_name ?? "",
        avatar_url: data?.avatar_url ?? "",
      });
      setLoading(false);
    })();
  }, [router]);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-antique-gold/40 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const currentLabel = navItems.find((n) => n.href === pathname)?.label ?? "Account";

  return (
    <div className="flex min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-88px)]">

      {/* ── DESKTOP SIDEBAR ────────────────────────────── */}
      {/* Desktop sidebar — sticks right under the fixed navbar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 bg-ground border-r border-antique-gold/10 sticky top-[80px] md:top-[88px] self-start h-[calc(100vh-80px)] md:h-[calc(100vh-88px)]">
        <SidebarInner
          user={user}
          profile={profile}
          pathname={pathname}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* ── MOBILE DRAWER BACKDROP ─────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer sits below the fixed navbar (72px mobile / 80px sm / 88px md) */}
            <motion.aside
              className="lg:hidden fixed left-0 bottom-0 w-72 max-w-[85vw] bg-ground z-[100] shadow-2xl border-r border-antique-gold/10"
              style={{ top: 0 }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Spacer so content clears the fixed navbar */}
              <div className="h-[72px] sm:h-[80px] md:h-[88px] shrink-0 border-b border-antique-gold/10 flex items-center px-5 justify-between">
                <span className="font-display text-sm font-bold tracking-[0.25em] text-ivory">G-STITCHES</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-ivory/40 hover:text-ivory rounded-lg hover:bg-ivory/[0.06] transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(100vh-72px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-88px)] overflow-y-auto">
                <SidebarInner
                  user={user}
                  profile={profile}
                  pathname={pathname}
                  onSignOut={handleSignOut}
                  onClose={() => setMobileOpen(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── CONTENT AREA ───────────────────────────────── */}
      <div className="relative flex-1 flex flex-col min-w-0 bg-[#F5F0EB]">

        {/* Mobile sub-header bar — must sit just below the fixed navbar */}
        <div className="lg:hidden w-full fixed top-[100px] sm:top-[100px] md:top-[108px] z-[40] bg-ground border-b border-antique-gold/10 px-4 h-11 flex items-center justify-between ">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open account menu"
            className="flex items-center gap-2 text-ivory/60 hover:text-ivory transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-semibold font-sans uppercase tracking-[0.25em]">Menu</span>
          </button>

          <span className="text-[10px] font-semibold font-sans uppercase tracking-[0.2em] text-ivory/40">
            {currentLabel}
          </span>

          {/* Breadcrumb hint */}
          <Link href="/gallery" className="text-[10px] font-sans text-ivory/25 hover:text-ivory/50 transition-colors uppercase tracking-wider">
            Store
          </Link>
        </div>

        {/* Page content */}
        <div className="flex-1 px-6 sm:px-15 lg:px- xl:px-15 py-7 sm:py-9">
          {children}
        </div>
      </div>
    </div>
  );
}
