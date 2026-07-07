"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  total: number;
  subtotal: number;
  shipping: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  street_address: string;
  city: string;
  state: string;
  order_items: OrderItem[];
}

const paymentColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid:    "bg-emerald-100 text-emerald-700",
  failed:  "bg-red-100 text-red-700",
};

const deliveryColor: Record<string, string> = {
  processing: "bg-sky-100 text-sky-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
};

const deliverySteps = ["processing", "shipped", "delivered"];

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;
  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-ground/10 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-sans tracking-[0.25em] uppercase text-ground/40 mb-1">Account</p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-ground">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ground/8 shadow-sm p-12 text-center">
          <svg className="w-10 h-10 text-ground/20 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
          <p className="text-ground/50 font-sans text-sm mb-4">You haven't placed any orders yet.</p>
          <Link href="/gallery" className="bg-signal-red text-ivory px-6 py-2.5 rounded-full text-sm font-semibold font-sans uppercase tracking-wider hover:bg-signal-red/90 transition-colors">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const stepIndex = deliverySteps.indexOf(order.order_status);
            const isExpanded = expanded === order.id;

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-ground/8 shadow-sm overflow-hidden">
                {/* Order header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  className="w-full px-5 sm:px-6 py-4 flex items-start sm:items-center justify-between gap-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-xs font-mono text-ground/50 shrink-0">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-sans ${paymentColor[order.payment_status] ?? "bg-ground/10 text-ground/50"}`}>
                        {order.payment_status}
                      </span>
                    </div>
                    <p className="text-ground font-semibold font-sans">{fmt(order.total)}</p>
                    <p className="text-xs text-ground/40 font-sans mt-0.5">{fmtDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full font-sans hidden sm:inline ${deliveryColor[order.order_status] ?? "bg-ground/10 text-ground/50"}`}>
                      {order.order_status}
                    </span>
                    <svg
                      className={`w-4 h-4 text-ground/40 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expandable details */}
                {isExpanded && (
                  <div className="border-t border-ground/8 px-5 sm:px-6 py-5 space-y-5">
                    {/* Delivery progress */}
                    {order.order_status !== "cancelled" && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ground/40 font-sans mb-3">
                          Delivery Status
                        </p>
                        <div className="flex items-center gap-0">
                          {deliverySteps.map((step, i) => {
                            const done = i <= stepIndex;
                            const active = i === stepIndex;
                            return (
                              <div key={step} className="flex items-center flex-1 last:flex-none">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-sans transition-colors ${
                                  done ? "bg-signal-red text-ivory" : "bg-ground/10 text-ground/30"
                                } ${active ? "ring-2 ring-signal-red/30 ring-offset-2" : ""}`}>
                                  {done ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : i + 1}
                                </div>
                                <div className={`flex-1 h-0.5 mx-1 last:hidden ${i < stepIndex ? "bg-signal-red" : "bg-ground/10"}`} />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-2">
                          {deliverySteps.map((step) => (
                            <p key={step} className="text-[10px] font-sans text-ground/40 capitalize">{step}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ground/40 font-sans mb-3">
                        Items
                      </p>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-ground/6 last:border-0">
                            <div>
                              <p className="text-sm font-sans font-semibold text-ground">{item.name}</p>
                              <p className="text-xs text-ground/40 font-sans">
                                {item.size && `Size: ${item.size} · `}Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-sans font-semibold text-ground">{fmt(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals + Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-ground/[0.03] rounded-xl p-4 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ground/40 font-sans mb-1">Summary</p>
                        <div className="flex justify-between text-sm font-sans">
                          <span className="text-ground/60">Subtotal</span>
                          <span className="text-ground font-semibold">{fmt(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-sans">
                          <span className="text-ground/60">Shipping</span>
                          <span className="text-ground font-semibold">{order.shipping === 0 ? "Free" : fmt(order.shipping)}</span>
                        </div>
                        <div className="h-px bg-ground/10" />
                        <div className="flex justify-between text-sm font-sans">
                          <span className="text-ground font-bold">Total</span>
                          <span className="text-ground font-bold">{fmt(order.total)}</span>
                        </div>
                      </div>
                      <div className="bg-ground/[0.03] rounded-xl p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ground/40 font-sans mb-2">Delivery Address</p>
                        <p className="text-sm font-sans text-ground/70 leading-relaxed">
                          {order.street_address}<br />
                          {order.city}, {order.state}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
