"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import {
  AdminPageHeader, FilterPills, TableShell,
  StatusBadge, EmptyState, LoadingRows,
} from "../components/ui";

interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  garment_type: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
  reference_image_url: string | null;
}

const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

// Small camera/photo icon used wherever a customer attached a reference image
function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V7.5A1.5 1.5 0 014.5 6h2.379a1.5 1.5 0 001.06-.44l1.122-1.12A1.5 1.5 0 0110.12 4h3.76a1.5 1.5 0 011.06.44l1.122 1.12a1.5 1.5 0 001.06.44H19.5A1.5 1.5 0 0121 7.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 16.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppts() {
      let q = supabase
        .from("appointments")
        .select("id, first_name, last_name, email, garment_type, preferred_date, preferred_time, status, created_at, reference_image_url")
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      setAppointments(data || []);
      setLoading(false);
    }
    fetchAppts();
  }, [filter]);

  return (
    <div>
      <AdminPageHeader title="Appointments" />

      <FilterPills
        options={FILTERS}
        active={filter}
        onChange={(v) => { setFilter(v); setLoading(true); }}
      />

      <TableShell>
        <div className="hidden sm:grid grid-cols-[48px_1fr_130px_110px_110px_60px] gap-4 px-5 py-3 border-b border-antique-gold/12">
          {["", "Customer", "Date & Time", "Garment", "Status", ""].map((h, i) => (
            <span key={i} className="text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/30 font-sans">{h}</span>
          ))}
        </div>

        {loading ? (
          <LoadingRows />
        ) : appointments.length === 0 ? (
          <EmptyState message="No appointments found." />
        ) : (
          <div className="divide-y divide-antique-gold/10">
            {appointments.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-ivory/[0.025] transition-colors duration-200"
              >
                {/* ── MOBILE ── */}
                <div className="sm:hidden px-4 py-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex items-start gap-2.5">
                      {a.reference_image_url && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-antique-gold/20 mt-0.5">
                          <Image
                            src={a.reference_image_url}
                            alt="Reference"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-ivory text-sm font-semibold font-sans">{a.first_name} {a.last_name}</p>
                        <p className="text-ivory/35 text-[11px] font-sans mt-0.5 truncate">{a.email}</p>
                        {a.garment_type && (
                          <p className="text-ivory/25 text-[10px] font-sans capitalize mt-0.5">{a.garment_type}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-ivory/60 text-xs font-sans">{a.preferred_date || "—"}</p>
                      <p className="text-ivory/35 text-[11px] font-sans">{a.preferred_time || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <StatusBadge status={a.status} />
                    <Link href={`/admin/appointments/${a.id}`}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-antique-gold/60 hover:text-antique-gold font-sans transition-colors">
                      View →
                    </Link>
                  </div>
                </div>

                {/* ── DESKTOP ── */}
                <div className="hidden sm:grid grid-cols-[48px_1fr_130px_110px_110px_60px] gap-4 px-5 py-4 items-center">
                  <div>
                    {a.reference_image_url ? (
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-antique-gold/20">
                        <Image
                          src={a.reference_image_url}
                          alt="Reference"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-9 h-9 rounded-lg border border-dashed border-ivory/10 flex items-center justify-center"
                        title="No reference image attached"
                      >
                        <ImageIcon className="w-4 h-4 text-ivory/15" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-ivory text-sm font-semibold font-sans">{a.first_name} {a.last_name}</p>
                    <p className="text-ivory/35 text-[10px] font-sans mt-0.5">{a.email}</p>
                  </div>
                  <div>
                    <p className="text-ivory/60 text-xs font-sans">{a.preferred_date || "—"}</p>
                    <p className="text-ivory/35 text-[10px] font-sans">{a.preferred_time || "—"}</p>
                  </div>
                  <p className="text-ivory/45 text-xs font-sans capitalize">{a.garment_type || "—"}</p>
                  <div><StatusBadge status={a.status} /></div>
                  <div className="text-right">
                    <Link href={`/admin/appointments/${a.id}`}
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