"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import {
  AdminPageHeader, FilterPills, TableShell,
  StatusBadge, EmptyState, LoadingRows,
} from "../components/ui";

interface Order {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
}

const FILTERS = ["all", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      let q = supabase
        .from("orders")
        .select("id, first_name, last_name, email, total, payment_status, order_status, created_at")
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("order_status", filter);
      const { data } = await q;
      setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, [filter]);

  return (
    <div>
      <AdminPageHeader title="Orders" />

      <FilterPills
        options={FILTERS}
        active={filter}
        onChange={(v) => { setFilter(v); setLoading(true); }}
      />

      <TableShell>
        <div className="hidden sm:grid grid-cols-[1fr_120px_120px_140px_60px] gap-4 px-5 py-3 border-b border-antique-gold/12">
          {["Customer", "Total", "Payment", "Order Status", ""].map((h, i) => (
            <span key={i} className="text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/30 font-sans">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <LoadingRows />
        ) : orders.length === 0 ? (
          <EmptyState message="No orders found." />
        ) : (
          <div className="divide-y divide-antique-gold/10">
            {orders.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-ivory/[0.025] transition-colors duration-200"
              >
                {/* ── MOBILE ── */}
                <div className="sm:hidden px-4 py-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-ivory text-sm font-semibold font-sans">
                        {o.first_name} {o.last_name}
                      </p>
                      <p className="text-ivory/35 text-[11px] font-sans mt-0.5 truncate">{o.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-antique-gold/80 text-sm font-semibold font-sans">
                        ₦{Number(o.total).toLocaleString()}
                      </p>
                      <p className="text-ivory/25 text-[10px] font-sans">
                        {new Date(o.created_at).toLocaleDateString("en-NG")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2 flex-wrap">
                      <StatusBadge status={o.payment_status} />
                      <StatusBadge status={o.order_status} />
                    </div>
                    <Link href={`/admin/orders/${o.id}`}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-antique-gold/60 hover:text-antique-gold font-sans transition-colors">
                      View →
                    </Link>
                  </div>
                </div>

                {/* ── DESKTOP ── */}
                <div className="hidden sm:grid grid-cols-[1fr_120px_120px_140px_60px] gap-4 px-5 py-4 items-center">
                  <div>
                    <p className="text-ivory text-sm font-semibold font-sans">{o.first_name} {o.last_name}</p>
                    <p className="text-ivory/35 text-[10px] font-sans mt-0.5">{o.email}</p>
                    <p className="text-ivory/20 text-[9px] font-sans mt-0.5">
                      {new Date(o.created_at).toLocaleDateString("en-NG")}
                    </p>
                  </div>
                  <p className="text-antique-gold/80 text-sm font-semibold font-sans">
                    ₦{Number(o.total).toLocaleString()}
                  </p>
                  <div><StatusBadge status={o.payment_status} /></div>
                  <div><StatusBadge status={o.order_status} /></div>
                  <div className="text-right">
                    <Link href={`/admin/orders/${o.id}`}
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
