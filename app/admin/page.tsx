"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  pendingAppointments: number;
  unreadMessages: number;
  pendingDesigns: number;
  pendingReviews: number;
  totalCustomers: number;
}

function StatCard({
  label,
  value,
  sub,
  href,
  index,
  highlight,
}: {
  label: string;
  value: string | number;
  sub: string;
  href: string;
  index: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        href={href}
        className="group block bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5 sm:p-6 card-modern hover:border-antique-gold/45 transition-colors duration-300"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ivory/45 font-sans mb-3">
          {label}
        </p>
        <p className={`font-display text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-300 ${
          highlight ? "text-antique-gold" : "text-ivory group-hover:text-antique-gold"
        }`}>
          {value}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-antique-gold/15" />
          <p className="text-[10px] text-ivory/35 font-sans shrink-0">{sub}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: totalOrders },
        { data: revenue },
        { count: pendingOrders },
        { count: totalProducts },
        { count: pendingAppointments },
        { count: unreadMessages },
        { count: pendingDesigns },
        { count: pendingReviews },
        { count: totalCustomers },
      ] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total").eq("payment_status", "paid"),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("order_status", "processing"),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("custom_designs").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("approved", false),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
      ]);

      const totalRevenue = (revenue || []).reduce((sum, r) => sum + Number(r.total), 0);

      setStats({
        totalOrders: totalOrders || 0,
        totalRevenue,
        pendingOrders: pendingOrders || 0,
        totalProducts: totalProducts || 0,
        pendingAppointments: pendingAppointments || 0,
        unreadMessages: unreadMessages || 0,
        pendingDesigns: pendingDesigns || 0,
        pendingReviews: pendingReviews || 0,
        totalCustomers: totalCustomers || 0,
      });
    }
    fetchStats();
  }, []);

  return (
    <div>
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-10"
      >
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-antique-gold font-sans">
          G-Stitches
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.1em] uppercase text-ivory mt-1">
          Dashboard
        </h1>
        <div className="h-px w-10 bg-antique-gold/40 mt-4" />
      </motion.div>

      {!stats ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-ivory/[0.03] border border-antique-gold/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Revenue highlight */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-6"
          >
            <Link
              href="/admin/orders"
              className="group flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-ivory/[0.05] border border-antique-gold/25 rounded-2xl p-6 sm:p-8 card-modern hover:border-antique-gold/50 transition-colors duration-300"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-antique-gold font-sans mb-2">
                  Total Revenue (Paid)
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight shimmer-gold">
                  ₦{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:text-right">
                <div>
                  <p className="font-display text-2xl font-bold text-ivory">{stats.totalOrders}</p>
                  <p className="text-[10px] text-ivory/40 font-sans uppercase tracking-[0.15em] mt-0.5">Total Orders</p>
                </div>
                <div className="w-px h-8 bg-antique-gold/20" />
                <div>
                  <p className="font-display text-2xl font-bold text-ivory">{stats.pendingOrders}</p>
                  <p className="text-[10px] text-ivory/40 font-sans uppercase tracking-[0.15em] mt-0.5">Processing</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Stat cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Products", value: stats.totalProducts, sub: "in catalogue", href: "/admin/products", index: 0 },
              { label: "Customers", value: stats.totalCustomers, sub: "registered accounts", href: "/admin/customers", index: 1 },
              { label: "Pending Appointments", value: stats.pendingAppointments, sub: "awaiting confirmation", href: "/admin/appointments", index: 2 },
              { label: "Unread Messages", value: stats.unreadMessages, sub: "from customers", href: "/admin/messages", index: 3 },
              { label: "Design Requests", value: stats.pendingDesigns, sub: "pending review", href: "/admin/designs", index: 4 },
              { label: "Pending Reviews", value: stats.pendingReviews, sub: "awaiting approval", href: "/admin/reviews", index: 5 },
            ].map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-antique-gold/15" />
            <p className="text-[9px] tracking-[0.3em] uppercase font-sans text-antique-gold/40">Quick Actions</p>
            <div className="h-px flex-1 bg-antique-gold/15" />
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Add Product", href: "/admin/products/new" },
              { label: "View Orders", href: "/admin/orders" },
              { label: "View Store", href: "/", target: "_blank" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.target}
                className="btn-lift border border-antique-gold/30 text-ivory/65 hover:text-ivory hover:border-antique-gold/60 rounded-full px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] font-sans transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
