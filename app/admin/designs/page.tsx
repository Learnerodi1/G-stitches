"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import {
  AdminPageHeader, FilterPills, TableShell,
  StatusBadge, EmptyState, LoadingRows,
} from "../components/ui";

interface Design {
  id: string;
  customer_name: string;
  customer_email: string;
  budget: number | null;
  status: string;
  created_at: string;
}

const FILTERS = ["all", "pending", "reviewed", "quoted", "in_progress", "completed"];

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDesigns() {
      let q = supabase
        .from("custom_designs")
        .select("id, customer_name, customer_email, budget, status, created_at")
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      setDesigns(data || []);
      setLoading(false);
    }
    fetchDesigns();
  }, [filter]);

  return (
    <div>
      <AdminPageHeader title="Custom Designs" />

      <FilterPills
        options={FILTERS}
        active={filter}
        onChange={(v) => { setFilter(v); setLoading(true); }}
        format={(v) => v.replace(/_/g, " ")}
      />

      <TableShell>
        <div className="hidden sm:grid grid-cols-[1fr_120px_130px_60px] gap-4 px-5 py-3 border-b border-antique-gold/12">
          {["Customer", "Budget", "Status", ""].map((h, i) => (
            <span key={i} className="text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/30 font-sans">{h}</span>
          ))}
        </div>

        {loading ? (
          <LoadingRows />
        ) : designs.length === 0 ? (
          <EmptyState message="No design requests found." />
        ) : (
          <div className="divide-y divide-antique-gold/10">
            {designs.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-ivory/[0.025] transition-colors duration-200"
              >
                {/* ── MOBILE ── */}
                <div className="sm:hidden px-4 py-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-ivory text-sm font-semibold font-sans">{d.customer_name}</p>
                      <p className="text-ivory/35 text-[11px] font-sans truncate mt-0.5">{d.customer_email}</p>
                      <p className="text-ivory/20 text-[10px] font-sans mt-0.5">
                        {new Date(d.created_at).toLocaleDateString("en-NG")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-antique-gold/70 text-sm font-semibold font-sans">
                        {d.budget ? `₦${Number(d.budget).toLocaleString()}` : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <StatusBadge status={d.status} />
                    <Link href={`/admin/designs/${d.id}`}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-antique-gold/60 hover:text-antique-gold font-sans transition-colors">
                      View →
                    </Link>
                  </div>
                </div>

                {/* ── DESKTOP ── */}
                <div className="hidden sm:grid grid-cols-[1fr_120px_130px_60px] gap-4 px-5 py-4 items-center">
                  <div>
                    <p className="text-ivory text-sm font-semibold font-sans">{d.customer_name}</p>
                    <p className="text-ivory/35 text-[10px] font-sans mt-0.5">{d.customer_email}</p>
                    <p className="text-ivory/20 text-[9px] font-sans mt-0.5">
                      {new Date(d.created_at).toLocaleDateString("en-NG")}
                    </p>
                  </div>
                  <p className="text-antique-gold/70 text-sm font-semibold font-sans">
                    {d.budget ? `₦${Number(d.budget).toLocaleString()}` : "—"}
                  </p>
                  <div><StatusBadge status={d.status} /></div>
                  <div className="text-right">
                    <Link href={`/admin/designs/${d.id}`}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-antique-gold/60 hover:text-antique-gold font-sans transition-colors">
                      View
                    </Link>
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
