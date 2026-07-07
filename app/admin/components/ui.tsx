"use client";

import { motion } from "framer-motion";

interface AdminPageHeaderProps {
  label?: string;
  title: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({ label = "Manage", title, action }: AdminPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-start justify-between gap-4 mb-8"
    >
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-antique-gold font-sans">
          {label}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.1em] uppercase text-ivory mt-1">
          {title}
        </h1>
        <div className="h-px w-8 bg-antique-gold/35 mt-3" />
      </div>
      {action && <div className="shrink-0 mt-1">{action}</div>}
    </motion.div>
  );
}

export const primaryBtn =
  "btn-lift bg-signal-red text-pure-white rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] font-sans hover:bg-signal-red/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 focus-visible:ring-offset-ground";

export const ghostBtn =
  "btn-lift border border-antique-gold/30 text-ivory/65 hover:text-ivory hover:border-antique-gold/60 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] font-sans transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold";

export const inputClass =
  "w-full bg-ivory/[0.06] border border-antique-gold/25 rounded-lg px-4 py-3 text-ivory text-sm font-sans outline-none placeholder:text-ivory/40 focus:border-antique-gold focus-visible:ring-2 focus-visible:ring-antique-gold/35 transition-colors duration-300 caret-antique-gold";

export const selectClass =
  "w-full bg-ivory/[0.06] border border-antique-gold/25 rounded-lg px-4 py-3 text-ivory text-sm font-sans outline-none focus:border-antique-gold focus-visible:ring-2 focus-visible:ring-antique-gold/35 transition-colors duration-300";

export function FilterPills({
  options,
  active,
  onChange,
  format,
}: {
  options: string[];
  active: string;
  onChange: (v: string) => void;
  format?: (v: string) => string;
}) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {options.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] font-sans transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold ${
            active === f
              ? "bg-ivory/[0.1] text-ivory"
              : "text-ivory/40 hover:text-ivory"
          }`}
        >
          {format ? format(f) : f}
        </button>
      ))}
    </div>
  );
}

export function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

export function TableHeader({ cols }: { cols: string[] }) {
  return (
    <div className="hidden sm:flex items-center border-b border-antique-gold/15 px-5 py-3 gap-4">
      {cols.map((c, i) => (
        <span key={i} className="flex-1 first:flex-[2] text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/35 font-sans">
          {c}
        </span>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/12 text-yellow-400 border-yellow-500/20",
    confirmed: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
    completed: "bg-blue-500/12 text-blue-400 border-blue-500/20",
    cancelled: "bg-red-500/12 text-red-400 border-red-500/20",
    paid: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
    failed: "bg-red-500/12 text-red-400 border-red-500/20",
    processing: "bg-orange-500/12 text-orange-400 border-orange-500/20",
    shipped: "bg-blue-500/12 text-blue-400 border-blue-500/20",
    delivered: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
    reviewed: "bg-blue-500/12 text-blue-400 border-blue-500/20",
    quoted: "bg-purple-500/12 text-purple-400 border-purple-500/20",
    in_progress: "bg-orange-500/12 text-orange-400 border-orange-500/20",
  };
  const cls = map[status] || "bg-ivory/8 text-ivory/55 border-ivory/15";
  return (
    <span className={`${cls} border text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-sans whitespace-nowrap`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function ViewLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-antique-gold/60 hover:text-antique-gold transition-colors duration-300 font-sans"
    >
      View →
    </a>
  );
}

export function Toggle({
  on,
  onClick,
}: {
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-10 h-[22px] rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-1 focus-visible:ring-offset-ground ${
        on ? "bg-antique-gold" : "bg-ivory/15"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"
        style={{ left: on ? "calc(100% - 19px)" : "3px" }}
      />
    </button>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-16 text-center"
    >
      <div className="h-px w-12 bg-antique-gold/25 mx-auto mb-6" />
      <p className="text-ivory/35 text-sm font-sans">{message}</p>
    </motion.div>
  );
}

export function LoadingRows() {
  return (
    <div className="space-y-2 py-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-ivory/[0.02] rounded-xl mx-3 animate-pulse" />
      ))}
    </div>
  );
}
