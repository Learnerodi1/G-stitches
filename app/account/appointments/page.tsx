"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

interface Appointment {
  id: string;
  garment_type: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  notes: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700",   dot: "bg-amber-400" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700",     dot: "bg-blue-400" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700",       dot: "bg-red-400" },
};

const statusSteps = ["pending", "confirmed", "completed"];

export default function AccountAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setAppointments(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2].map((i) => <div key={i} className="h-32 bg-ground/10 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-sans tracking-[0.25em] uppercase text-ground/40 mb-1">Account</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ground">My Appointments</h1>
        </div>
        <Link
          href="/book-fitting"
          className="bg-signal-red text-ivory px-5 py-2.5 rounded-full text-xs font-semibold font-sans uppercase tracking-wider hover:bg-signal-red/90 transition-colors"
        >
          + Book New
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ground/8 shadow-sm p-12 text-center">
          <svg className="w-10 h-10 text-ground/20 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <p className="text-ground/50 font-sans text-sm mb-4">No appointments booked yet.</p>
          <Link
            href="/book-fitting"
            className="bg-signal-red text-ivory px-6 py-2.5 rounded-full text-sm font-semibold font-sans uppercase tracking-wider hover:bg-signal-red/90 transition-colors"
          >
            Book a Fitting
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const cfg = statusConfig[appt.status] ?? statusConfig.pending;
            const stepIndex = statusSteps.indexOf(appt.status);

            return (
              <div key={appt.id} className="bg-white rounded-2xl border border-ground/8 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-display text-lg font-bold text-ground">
                        {appt.garment_type || "Fitting Session"}
                      </p>
                      <p className="text-sm font-sans text-ground/60 mt-0.5">
                        {appt.preferred_date} · {appt.preferred_time}
                      </p>
                      <p className="text-xs font-sans text-ground/30 mt-0.5">
                        Booked {fmtDate(appt.created_at)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full font-sans shrink-0 ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Progress — only for non-cancelled */}
                  {appt.status !== "cancelled" && (
                    <div className="mb-4">
                      <div className="flex items-center">
                        {statusSteps.map((step, i) => {
                          const done = i <= stepIndex;
                          const active = i === stepIndex;
                          return (
                            <div key={step} className="flex items-center flex-1 last:flex-none">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                                done ? "bg-signal-red text-ivory" : "bg-ground/10 text-ground/30"
                              } ${active ? "ring-2 ring-signal-red/30 ring-offset-1" : ""}`}>
                                {done ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : i + 1}
                              </div>
                              <div className={`flex-1 h-0.5 mx-1 last:hidden ${i < stepIndex ? "bg-signal-red" : "bg-ground/10"}`} />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-1.5">
                        {statusSteps.map((step) => (
                          <p key={step} className="text-[10px] font-sans text-ground/40 capitalize">{step}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {appt.notes && (
                    <div className="bg-ground/[0.03] rounded-xl px-4 py-3 mt-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ground/40 font-sans mb-1">Your Notes</p>
                      <p className="text-sm font-sans text-ground/70 leading-relaxed">{appt.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
