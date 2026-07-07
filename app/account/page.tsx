"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface Profile {
  full_name: string;
  phone: string;
  avatar_url: string;
}

interface Order {
  id: string;
  total: number;
  order_status: string;
  payment_status: string;
  created_at: string;
}

interface Appointment {
  id: string;
  garment_type: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const statusCls: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-800",
  confirmed:  "bg-blue-100  text-blue-800",
  processing: "bg-sky-100   text-sky-800",
  shipped:    "bg-indigo-100 text-indigo-800",
  delivered:  "bg-emerald-100 text-emerald-800",
  completed:  "bg-emerald-100 text-emerald-800",
  cancelled:  "bg-red-100   text-red-800",
  paid:       "bg-emerald-100 text-emerald-800",
  failed:     "bg-red-100   text-red-800",
};

const fmt     = (n: number) => `₦${n.toLocaleString()}`;
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

const inputCls =
  "w-full bg-white border border-ground/15 rounded-xl px-4 py-3 text-ground text-sm font-sans outline-none placeholder:text-ground/30 focus:border-ground/40 transition-colors duration-200";

// ─────────────────────────────────────────────────────────────
// Section heading (used throughout the overview page)
// ─────────────────────────────────────────────────────────────
function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-ground/35 mb-0.5">{eyebrow}</p>
      <h2 className="font-display text-xl font-bold text-ground">{title}</h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function AccountPage() {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", avatar_url: "" });
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef               = useRef<HTMLInputElement>(null);

  const [stats, setStats]     = useState({ orders: 0, appointments: 0, messages: 0 });
  const [recentOrders, setRecentOrders]           = useState<Order[]>([]);
  const [recentAppts, setRecentAppts]             = useState<Appointment[]>([]);

  // ── Bootstrap ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: prof } = await supabase
        .from("profiles").select("full_name, phone, avatar_url")
        .eq("id", user.id).single();

      const p: Profile = {
        full_name:  prof?.full_name  ?? user.user_metadata?.full_name ?? "",
        phone:      prof?.phone      ?? user.user_metadata?.phone     ?? "",
        avatar_url: prof?.avatar_url ?? "",
      };
      setProfile(p);
      setEditForm({ full_name: p.full_name, phone: p.phone });

      const [oCount, aCount, mCount, oRecent, aRecent] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("appointments").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("orders").select("id,total,order_status,payment_status,created_at")
          .eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
        supabase.from("appointments").select("id,garment_type,preferred_date,preferred_time,status,created_at")
          .eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
      ]);

      setStats({ orders: oCount.count ?? 0, appointments: aCount.count ?? 0, messages: mCount.count ?? 0 });
      setRecentOrders(oRecent.data ?? []);
      setRecentAppts(aRecent.data ?? []);
    })();
  }, []);

  // ── Avatar upload ──────────────────────────────────────────
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB."); return; }
    setUploading(true);
    const ext  = file.name.split(".").pop() ?? "jpg";
    const path = `avatars/${user.id}.${ext}`;
    const { error } = await supabase.storage.from("images")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      setProfile((p) => ({ ...p, avatar_url: publicUrl }));
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Save profile ───────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSaveMsg("");
    const { error } = await supabase.from("profiles")
      .update({ full_name: editForm.full_name, phone: editForm.phone }).eq("id", user.id);
    setSaving(false);
    if (!error) {
      setProfile((p) => ({ ...p, ...editForm }));
      setSaveMsg("Saved!");
      setTimeout(() => { setSaveMsg(""); setEditOpen(false); }, 1500);
    } else { setSaveMsg("Could not save."); }
  };

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email ?? "?").slice(0, 2).toUpperCase();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  // ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ══════════════════════════════════════════════════════
          PAGE HEADER
      ══════════════════════════════════════════════════════ */}
      <div>
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-ground/35 mb-1">
          Dashboard
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ground leading-tight">
          {greeting}, {profile.full_name?.split(" ")[0] || "there"}.
        </h1>
        <p className="text-sm font-sans text-ground/50 mt-1">
          Here&apos;s a summary of your G-Stitches account.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          PROFILE CARD
      ══════════════════════════════════════════════════════ */}
      <div className="bg-ground rounded-2xl overflow-hidden">
        {/* Gold accent strip */}
        <div className="h-1 bg-gradient-to-r from-antique-gold/40 via-antique-gold to-antique-gold/40" />

        <div className="px-5 sm:px-7 py-6">
          {/* Stack avatar + info vertically on mobile, side-by-side from sm */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                aria-label="Change profile photo"
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-antique-gold/10 border-2 border-antique-gold/30 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold"
              >
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" sizes="80px" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl font-bold text-antique-gold font-sans">
                    {initials}
                  </span>
                )}
                <span className="absolute inset-0 flex flex-col items-center justify-center bg-ground/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {uploading
                    ? <svg className="w-5 h-5 text-ivory animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    : <>
                        <svg className="w-4 h-4 text-antique-gold" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                        <span className="text-[9px] text-antique-gold font-sans mt-1 uppercase tracking-wider">Photo</span>
                      </>
                  }
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
              {/* Camera badge */}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-signal-red border-2 border-ground flex items-center justify-center pointer-events-none">
                <svg className="w-2.5 h-2.5 text-ivory" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </div>
            </div>

            {/* Info + edit */}
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg sm:text-xl font-bold text-ivory leading-tight truncate">
                {profile.full_name || initials}
              </h2>
              <p className="text-[12px] font-sans text-ivory/45 mt-0.5 truncate">{user?.email}</p>
              {profile.phone && (
                <p className="text-[11px] font-sans text-ivory/30 mt-0.5">{profile.phone}</p>
              )}
              <button
                onClick={() => { setEditOpen((v) => !v); setSaveMsg(""); }}
                className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold font-sans uppercase tracking-[0.2em] text-antique-gold/60 hover:text-antique-gold transition-colors duration-200"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                {editOpen ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Inline edit form */}
          {editOpen && (
            <form onSubmit={handleSaveProfile} className="mt-5 pt-5 border-t border-antique-gold/12 space-y-3">
              {/* Always 1 col, fields stacked */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/30 font-sans mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/30 font-sans mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+234 000 0000 000"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-signal-red text-ivory px-6 py-2.5 rounded-full text-[11px] font-semibold font-sans uppercase tracking-[0.15em] hover:bg-signal-red/90 transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditOpen(false); setSaveMsg(""); }}
                  className="text-[11px] font-sans text-ivory/25 hover:text-ivory/50 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                {saveMsg && (
                  <span className={`text-[11px] font-sans ${saveMsg === "Saved!" ? "text-emerald-400" : "text-signal-red"}`}>
                    {saveMsg}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════════════════════ */}
      {/* 1 column on mobile, 3 on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {([
          { label: "Orders",       count: stats.orders,       href: "/account/orders" },
          { label: "Appointments", count: stats.appointments, href: "/account/appointments" },
          { label: "Messages",     count: stats.messages,     href: "/account/messages" },
        ]).map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-ground rounded-2xl px-5 py-5 flex sm:flex-col items-center sm:items-center sm:text-center gap-4 sm:gap-0 border border-antique-gold/10 hover:border-antique-gold/30 transition-colors duration-200 group"
          >
            <p className="font-display text-4xl font-bold text-ivory tabular-nums group-hover:text-antique-gold transition-colors duration-200 sm:mb-0">
              {s.count}
            </p>
            <div className="flex-1 sm:flex-none sm:mt-2">
              <p className="text-sm font-semibold font-sans text-ivory/60 group-hover:text-ivory/80 transition-colors duration-200">
                {s.label}
              </p>
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-ivory/20 mt-0.5 group-hover:text-ivory/35 transition-colors duration-200">
                Tap to view →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          QUICK LINKS
      ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/gallery"
          className="group flex items-center gap-4 bg-signal-red rounded-2xl px-5 py-4 transition-all duration-300 hover:bg-signal-red/90"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-ivory" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold font-sans text-ivory">Shop Collection</p>
            <p className="text-[11px] font-sans text-ivory/60 mt-0.5">Browse our latest pieces</p>
          </div>
          <svg className="w-4 h-4 text-ivory/40 group-hover:translate-x-1 transition-transform duration-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>

        <Link
          href="/book-fitting"
          className="group flex items-center gap-4 bg-ground rounded-2xl px-5 py-4 border border-antique-gold/15 transition-all duration-300 hover:border-antique-gold/40"
        >
          <div className="w-10 h-10 rounded-xl bg-antique-gold/10 border border-antique-gold/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-antique-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold font-sans text-ivory">Book a Fitting</p>
            <p className="text-[11px] font-sans text-ivory/35 mt-0.5">Schedule your appointment</p>
          </div>
          <svg className="w-4 h-4 text-ivory/20 group-hover:translate-x-1 group-hover:text-antique-gold/60 transition-all duration-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════
          RECENT ORDERS
      ══════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-ground/35 mb-0.5">History</p>
            <h2 className="font-display text-xl font-bold text-ground">Recent Orders</h2>
          </div>
          <Link href="/account/orders" className="text-[11px] font-semibold font-sans uppercase tracking-[0.15em] text-signal-red hover:text-signal-red/80 transition-colors">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-ground/8 py-10 text-center">
            <svg className="w-9 h-9 text-ground/15 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <p className="text-ground/35 text-sm font-sans mb-3">No orders placed yet.</p>
            <Link href="/gallery" className="text-signal-red text-xs font-semibold font-sans uppercase tracking-wider hover:underline">
              Shop Now →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-ground/8 divide-y divide-ground/6 overflow-hidden">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-4 hover:bg-ground/[0.02] transition-colors">
                {/* Top row: ref + badges */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-[10px] font-mono text-ground/40">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-sans ${statusCls[order.order_status] ?? "bg-ground/8 text-ground/40"}`}>
                      {order.order_status}
                    </span>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-sans ${statusCls[order.payment_status] ?? "bg-ground/8 text-ground/40"}`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
                {/* Bottom row: amount + date */}
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-base font-bold font-display text-ground">{fmt(order.total)}</p>
                  <p className="text-[11px] text-ground/35 font-sans shrink-0">{fmtDate(order.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          RECENT APPOINTMENTS
      ══════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-ground/35 mb-0.5">Schedule</p>
            <h2 className="font-display text-xl font-bold text-ground">Appointments</h2>
          </div>
          <Link href="/account/appointments" className="text-[11px] font-semibold font-sans uppercase tracking-[0.15em] text-signal-red hover:text-signal-red/80 transition-colors">
            View all →
          </Link>
        </div>

        {recentAppts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-ground/8 py-10 text-center">
            <svg className="w-9 h-9 text-ground/15 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p className="text-ground/35 text-sm font-sans mb-3">No appointments booked yet.</p>
            <Link href="/book-fitting" className="text-signal-red text-xs font-semibold font-sans uppercase tracking-wider hover:underline">
              Book a Fitting →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-ground/8 divide-y divide-ground/6 overflow-hidden">
            {recentAppts.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-ground/[0.02] transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold font-sans text-ground truncate">
                    {appt.garment_type || "Fitting Session"}
                  </p>
                  <p className="text-[11px] text-ground/40 font-sans mt-0.5">
                    {appt.preferred_date}{appt.preferred_time ? ` · ${appt.preferred_time}` : ""}
                  </p>
                </div>
                <span className={`text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full font-sans shrink-0 ${statusCls[appt.status] ?? "bg-ground/8 text-ground/40"}`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          GOLD DIVIDER FOOTER
      ══════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex-1 h-px bg-ground/10" />
        <p className="text-[9px] font-sans uppercase tracking-[0.35em] text-ground/25">G-Stitches · Bespoke Fashion</p>
        <div className="flex-1 h-px bg-ground/10" />
      </div>

    </div>
  );
}
