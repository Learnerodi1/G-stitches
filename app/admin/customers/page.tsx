"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import {
  AdminPageHeader,
  FilterPills,
  TableShell,
  EmptyState,
  LoadingRows,
} from "../components/ui";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

const FILTERS = ["all", "customer", "admin"];

export default function AdminCustomersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    let q = supabase
      .from("profiles")
      .select("id, email, full_name, phone, role, created_at")
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("role", filter);
    const { data } = await q;
    setProfiles(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    fetchProfiles();

    // Real-time: re-fetch whenever a profile is inserted or updated
    const channel = supabase
      .channel("admin-profiles-watch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchProfiles()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchProfiles]);

  async function toggleRole(profile: Profile) {
    const newRole = profile.role === "admin" ? "customer" : "admin";
    const confirmed = confirm(
      `${newRole === "admin" ? "Promote" : "Demote"} ${profile.email} to ${newRole}?`
    );
    if (!confirmed) return;
    setSaving(profile.id);
    await supabase.from("profiles").update({ role: newRole }).eq("id", profile.id);
    setProfiles((prev) =>
      prev.map((p) => (p.id === profile.id ? { ...p, role: newRole } : p))
    );
    setSaving(null);
  }

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

  const customerCount = profiles.filter((p) => p.role === "customer").length;
  const adminCount = profiles.filter((p) => p.role === "admin").length;

  return (
    <div>
      <AdminPageHeader
        label="Accounts"
        title="Customers"
        action={
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-sans text-ivory/35 uppercase tracking-[0.2em]">Live</p>
              <div className="flex items-center gap-1.5 justify-end mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-ivory/40 font-sans">Auto-updates</span>
              </div>
            </div>
          </div>
        }
      />

      {/* Summary pills */}
      <div className="flex gap-3 mb-5">
        <span className="bg-ivory/[0.06] border border-antique-gold/15 rounded-full px-3 py-1 text-xs font-sans text-ivory/50">
          {customerCount} customer{customerCount !== 1 ? "s" : ""}
        </span>
        <span className="bg-ivory/[0.06] border border-antique-gold/15 rounded-full px-3 py-1 text-xs font-sans text-ivory/50">
          {adminCount} admin{adminCount !== 1 ? "s" : ""}
        </span>
      </div>

      <FilterPills
        options={FILTERS}
        active={filter}
        onChange={(v) => { setFilter(v); setLoading(true); }}
      />

      <TableShell>
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-[1fr_160px_140px_110px_90px] gap-4 px-5 py-3 border-b border-antique-gold/12">
          {["Account", "Phone", "Joined", "Role", ""].map((h, i) => (
            <span key={i} className="text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/30 font-sans">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <LoadingRows />
        ) : profiles.length === 0 ? (
          <EmptyState message="No accounts found." />
        ) : (
          <div className="divide-y divide-antique-gold/10">
            {profiles.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-ivory/[0.025] transition-colors duration-200"
              >
                {/* ── MOBILE ── */}
                <div className="sm:hidden px-4 py-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        {/* Avatar initials */}
                        <div className="w-7 h-7 rounded-full bg-antique-gold/15 border border-antique-gold/20 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-antique-gold font-sans">
                            {(p.full_name ?? p.email).slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-ivory text-sm font-semibold font-sans truncate">
                          {p.full_name || <span className="text-ivory/30 font-normal italic text-xs">No name</span>}
                        </p>
                      </div>
                      <p className="text-ivory/45 text-[11px] font-sans mt-0.5 truncate pl-9">{p.email}</p>
                      {p.phone && (
                        <p className="text-ivory/30 text-[10px] font-sans mt-0.5 pl-9">{p.phone}</p>
                      )}
                      <p className="text-ivory/20 text-[10px] font-sans mt-1 pl-9">
                        Joined {fmtDate(p.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <RoleBadge role={p.role} />
                      <button
                        onClick={() => toggleRole(p)}
                        disabled={saving === p.id}
                        className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ivory/30 hover:text-antique-gold font-sans transition-colors duration-300 disabled:opacity-40"
                      >
                        {saving === p.id ? "…" : p.role === "admin" ? "Demote" : "Promote"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── DESKTOP ── */}
                <div className="hidden sm:grid grid-cols-[1fr_160px_140px_110px_90px] gap-4 px-5 py-4 items-center">
                  {/* Account */}
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-antique-gold/12 border border-antique-gold/20 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-antique-gold font-sans">
                        {(p.full_name ?? p.email).slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-ivory text-sm font-semibold font-sans truncate">
                        {p.full_name || <span className="text-ivory/30 font-normal italic">No name</span>}
                      </p>
                      <p className="text-ivory/40 text-[10px] font-sans mt-0.5 truncate">{p.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <p className="text-ivory/35 text-xs font-sans truncate">
                    {p.phone || <span className="text-ivory/20 italic">—</span>}
                  </p>

                  {/* Joined */}
                  <p className="text-ivory/35 text-xs font-sans">{fmtDate(p.created_at)}</p>

                  {/* Role */}
                  <div>
                    <RoleBadge role={p.role} />
                  </div>

                  {/* Action */}
                  <div className="text-right">
                    <button
                      onClick={() => toggleRole(p)}
                      disabled={saving === p.id}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ivory/30 hover:text-antique-gold font-sans transition-colors duration-300 disabled:opacity-40"
                    >
                      {saving === p.id ? "…" : p.role === "admin" ? "Demote" : "Promote"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </TableShell>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <span className="bg-antique-gold/12 text-antique-gold border border-antique-gold/20 text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-sans">
        Admin
      </span>
    );
  }
  return (
    <span className="bg-ivory/[0.06] text-ivory/40 border border-ivory/10 text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-sans">
      Customer
    </span>
  );
}
