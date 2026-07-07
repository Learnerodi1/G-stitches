"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabaseClient";
import {
  AdminPageHeader,
  primaryBtn,
  selectClass,
  StatusBadge,
} from "../../components/ui";

interface Order {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  street_address: string;
  city: string;
  state: string;
  postal_code: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  payment_reference: string | null;
  payment_status: string;
  order_status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  name: string;
  size: string | null;
  price: number;
  quantity: number;
}

const ORDER_STATUSES = ["processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed"];

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      const [{ data: orderData }, { data: itemsData }] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id).single(),
        supabase.from("order_items").select("*").eq("order_id", id),
      ]);
      if (orderData) {
        setOrder(orderData);
        setOrderStatus(orderData.order_status);
        setPaymentStatus(orderData.payment_status);
      }
      setItems(itemsData || []);
      setLoading(false);
    }
    fetchOrder();
  }, [id]);

  async function saveStatus() {
    setSaving(true);
    await supabase
      .from("orders")
      .update({ order_status: orderStatus, payment_status: paymentStatus })
      .eq("id", id);
    setSaving(false);
    if (order) setOrder({ ...order, order_status: orderStatus, payment_status: paymentStatus });
  }

  if (loading) return <p className="text-ivory/40 text-sm font-sans pt-8">Loading…</p>;
  if (!order) return <p className="text-ivory/40 text-sm font-sans pt-8">Order not found.</p>;

  const shortId = id.slice(0, 8).toUpperCase();

  return (
    <div>
      <AdminPageHeader label="Order" title={`#${shortId}`} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6"
      >
        {/* Left */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-3">
              Customer
            </p>
            <p className="text-ivory font-semibold font-sans text-sm">
              {order.first_name} {order.last_name}
            </p>
            <p className="text-ivory/60 text-sm font-sans mt-1">{order.email}</p>
            {order.phone && (
              <p className="text-ivory/60 text-sm font-sans">{order.phone}</p>
            )}
          </div>

          {/* Delivery address */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-3">
              Delivery Address
            </p>
            <p className="text-ivory/80 text-sm font-sans leading-relaxed">
              {order.street_address}
              <br />
              {order.city}, {order.state}
              {order.postal_code && `, ${order.postal_code}`}
            </p>
          </div>

          {/* Order items */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-4">
              Items
            </p>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-ivory text-sm font-semibold font-sans">{item.name}</p>
                    <p className="text-ivory/45 text-[11px] font-sans">
                      {item.size ? `Size: ${item.size} · ` : ""}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-ivory/80 text-sm font-sans shrink-0">
                    ₦{(Number(item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-antique-gold/12 space-y-2">
              <div className="flex justify-between text-ivory/55 text-xs font-sans">
                <span>Subtotal</span>
                <span>₦{Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ivory/55 text-xs font-sans">
                <span>Shipping</span>
                <span>₦{Number(order.shipping).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ivory font-semibold text-sm font-sans pt-1 border-t border-antique-gold/10">
                <span>Total</span>
                <span className="text-antique-gold">₦{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Status panel */}
        <div className="space-y-4">
          {/* Current status */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-3">
              Current Status
            </p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={order.payment_status} />
              <StatusBadge status={order.order_status} />
            </div>
          </div>

          {/* Update status */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-4">
              Update Status
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/50 font-sans mb-2">
                  Fulfillment
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className={selectClass}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/50 font-sans mb-2">
                  Payment
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className={selectClass}
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={saveStatus}
                disabled={saving}
                className={`${primaryBtn} w-full justify-center disabled:opacity-50`}
              >
                {saving ? "Saving…" : "Update Status"}
              </button>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-antique-gold font-sans mb-3">
              Payment Info
            </p>
            <p className="text-ivory/40 text-[10px] font-sans uppercase tracking-[0.1em] mb-1">Reference</p>
            <p className="text-ivory/70 text-xs font-sans break-all leading-relaxed">
              {order.payment_reference || "—"}
            </p>
            <p className="text-ivory/25 text-[10px] font-sans mt-4">
              Placed {new Date(order.created_at).toLocaleString("en-NG")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
