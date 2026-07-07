"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { AdminPageHeader, EmptyState, LoadingRows, FilterPills } from "../components/ui";

interface Review {
  id: string;
  product_id: string | null;
  customer_name: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
  products?: { name: string } | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="tracking-tight">
      {"★".repeat(rating)}
      <span className="text-ivory/15">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      let q = supabase
        .from("reviews")
        .select("*, products(name)")
        .order("created_at", { ascending: false });
      if (filter === "pending") q = q.eq("approved", false);
      if (filter === "approved") q = q.eq("approved", true);
      const { data } = await q;
      setReviews((data as Review[]) || []);
      setLoading(false);
    }
    fetchReviews();
  }, [filter]);

  async function setApproval(id: string, approved: boolean) {
    await supabase.from("reviews").update({ approved }).eq("id", id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)));
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <AdminPageHeader title="Reviews" />

      <FilterPills
        options={["all", "pending", "approved"]}
        active={filter}
        onChange={(v) => { setFilter(v); setLoading(true); }}
      />

      {loading ? (
        <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl overflow-hidden">
          <LoadingRows />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl overflow-hidden">
          <EmptyState message="No reviews found." />
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className={`bg-ivory/[0.04] border rounded-2xl p-5 transition-colors duration-300 ${
                r.approved ? "border-antique-gold/15" : "border-antique-gold/35"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Customer + badge */}
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <p className="text-ivory font-semibold text-sm font-sans">{r.customer_name}</p>
                    {r.approved ? (
                      <span className="bg-emerald-500/12 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-sans">
                        Approved
                      </span>
                    ) : (
                      <span className="bg-yellow-500/12 text-yellow-400 border border-yellow-500/20 text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-sans">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <p className="text-antique-gold text-sm mb-1">
                    <Stars rating={r.rating} />
                  </p>

                  {/* Product */}
                  {r.products?.name && (
                    <p className="text-ivory/30 text-[10px] font-sans uppercase tracking-[0.15em] mb-2">
                      {r.products.name}
                    </p>
                  )}

                  {/* Comment */}
                  {r.comment && (
                    <p className="text-ivory/65 text-sm font-sans leading-relaxed">{r.comment}</p>
                  )}

                  <p className="text-ivory/20 text-[10px] font-sans mt-3 tracking-wide">
                    {new Date(r.created_at).toLocaleString("en-NG")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {!r.approved ? (
                    <button
                      onClick={() => setApproval(r.id, true)}
                      className="px-4 py-2 bg-emerald-500/12 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] font-sans hover:bg-emerald-500/20 transition-colors duration-300"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => setApproval(r.id, false)}
                      className="px-4 py-2 bg-ivory/[0.06] border border-ivory/15 text-ivory/50 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] font-sans hover:bg-ivory/[0.1] transition-colors duration-300"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="px-4 py-2 text-ivory/25 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] font-sans hover:text-signal-red transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
