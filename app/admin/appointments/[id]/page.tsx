"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";
import {
  AdminPageHeader,
  primaryBtn,
  StatusBadge,
} from "../../components/ui";

interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  garment_type: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  reference_image_url: string | null;
}

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

// Inlined here instead of importing the shared `selectClass` — that shared
// style rendered white text on a white background (unreadable). This matches
// the dark admin theme used everywhere else on this page (ivory text,
// antique-gold borders, dark translucent fill), with a custom chevron since
// native select arrows can also render invisible against a dark background.
const fixedSelectClass =
  "w-full appearance-none bg-[#14110d] border border-antique-gold/25 text-ivory text-sm font-sans rounded-xl px-4 py-3 pr-10 outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/30 transition-colors duration-300 cursor-pointer";

export default function AdminAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) { setAppt(data); setStatus(data.status); }
        setLoading(false);
      });
  }, [id]);

  async function saveStatus() {
    setSaving(true);
    await supabase.from("appointments").update({ status }).eq("id", id);
    if (appt) setAppt({ ...appt, status });
    setSaving(false);
  }

  if (loading) return <p className="text-ivory/40 text-sm font-sans pt-8">Loading…</p>;
  if (!appt) return <p className="text-ivory/40 text-sm font-sans pt-8">Appointment not found.</p>;

  const rows = [
    { label: "Email", value: appt.email },
    { label: "Phone", value: appt.phone || "—" },
    { label: "Garment", value: appt.garment_type || "—" },
    { label: "Date", value: appt.preferred_date || "—" },
    { label: "Time", value: appt.preferred_time || "—" },
    { label: "Booked", value: new Date(appt.created_at).toLocaleString("en-NG") },
  ];

  return (
    <div>
      <AdminPageHeader
        label="Appointment"
        title={`${appt.first_name} ${appt.last_name}`}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6"
      >
        {/* Left */}
        <div className="space-y-4">
          {/* Current status */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-3">
              Current Status
            </p>
            <StatusBadge status={appt.status} />
          </div>

          {/* Details */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-4">
              Details
            </p>
            <dl className="space-y-3">
              {rows.map((r) => (
                <div key={r.label} className="grid grid-cols-[120px_1fr] gap-2">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/40 font-sans pt-0.5">
                    {r.label}
                  </dt>
                  <dd className="text-ivory/80 text-sm font-sans">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Reference image */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-4">
              Reference Image
            </p>
            {appt.reference_image_url ? (
              <a
                href={appt.reference_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full max-w-xs aspect-[3/4] rounded-xl overflow-hidden border border-antique-gold/20 group"
              >
                <Image
                  src={appt.reference_image_url}
                  alt="Customer reference image"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 text-[9px] font-semibold uppercase tracking-wider bg-black/60 text-ivory px-2 py-1 rounded-full font-sans">
                  View full size
                </span>
              </a>
            ) : (
              <p className="text-ivory/40 text-sm font-sans">
                No reference image attached.
              </p>
            )}
          </div>

          {/* Notes */}
          {appt.notes && (
            <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-3">
                Notes
              </p>
              <p className="text-ivory/70 text-sm font-sans leading-relaxed">{appt.notes}</p>
            </div>
          )}
        </div>

        {/* Status panel */}
        <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5 h-fit">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-4">
            Update Status
          </p>
          <div className="relative mb-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={fixedSelectClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#14110d] text-ivory">
                  {s}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-antique-gold/60"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button
            onClick={saveStatus}
            disabled={saving}
            className={`${primaryBtn} w-full justify-center disabled:opacity-50`}
          >
            {saving ? "Saving…" : "Update Status"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}