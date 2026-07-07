"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabaseClient";
import {
  AdminPageHeader,
  primaryBtn,
  inputClass,
  selectClass,
  StatusBadge,
} from "../../components/ui";

interface Design {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  design_image_url: string;
  description: string | null;
  budget: number | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const STATUSES = ["pending", "reviewed", "quoted", "in_progress", "completed"];

export default function AdminDesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("custom_designs")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDesign(data);
          setStatus(data.status);
          setAdminNotes(data.admin_notes || "");
        }
        setLoading(false);
      });
  }, [id]);

  async function save() {
    setSaving(true);
    await supabase
      .from("custom_designs")
      .update({ status, admin_notes: adminNotes })
      .eq("id", id);
    if (design) setDesign({ ...design, status, admin_notes: adminNotes });
    setSaving(false);
  }

  if (loading) return <p className="text-ivory/40 text-sm font-sans pt-8">Loading…</p>;
  if (!design) return <p className="text-ivory/40 text-sm font-sans pt-8">Design request not found.</p>;

  return (
    <div>
      <AdminPageHeader label="Design Request" title={design.customer_name} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6"
      >
        {/* Left */}
        <div className="space-y-4">
          {/* Design image */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl overflow-hidden">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={design.design_image_url}
                alt={`Design by ${design.customer_name}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-4">
              Customer
            </p>
            <dl className="space-y-3">
              {[
                { label: "Name", value: design.customer_name },
                { label: "Email", value: design.customer_email },
                { label: "Phone", value: design.customer_phone || "—" },
                {
                  label: "Budget",
                  value: design.budget
                    ? `₦${Number(design.budget).toLocaleString()}`
                    : "—",
                },
                {
                  label: "Submitted",
                  value: new Date(design.created_at).toLocaleString("en-NG"),
                },
              ].map((r) => (
                <div key={r.label} className="grid grid-cols-[120px_1fr] gap-2">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/40 font-sans pt-0.5">
                    {r.label}
                  </dt>
                  <dd className="text-ivory/80 text-sm font-sans">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Description */}
          {design.description && (
            <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-3">
                Description
              </p>
              <p className="text-ivory/75 text-sm font-sans leading-relaxed whitespace-pre-wrap">
                {design.description}
              </p>
            </div>
          )}
        </div>

        {/* Right — Status + notes */}
        <div className="space-y-4">
          {/* Current status */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-3">
              Current Status
            </p>
            <StatusBadge status={design.status} />
          </div>

          {/* Update panel */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-4">
              Update
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/50 font-sans mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={selectClass}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/50 font-sans mb-2">
                  Admin Notes
                </label>
                <textarea
                  rows={5}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes for internal reference…"
                  className={`${inputClass} resize-y`}
                />
              </div>
              <button
                onClick={save}
                disabled={saving}
                className={`${primaryBtn} w-full justify-center disabled:opacity-50`}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
