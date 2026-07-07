"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import {
  AdminPageHeader, FilterPills, TableShell,
  StatusBadge, Toggle, EmptyState, LoadingRows,
  primaryBtn,
} from "../components/ui";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string | null;
  featured: boolean;
  in_stock: boolean;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function fetchProducts() {
    let q = supabase
      .from("products")
      .select("id, name, price, image_url, category, featured, in_stock, created_at")
      .order("created_at", { ascending: false });
    if (filter === "featured") q = q.eq("featured", true);
    if (filter === "out of stock") q = q.eq("in_stock", false);
    const { data } = await q;
    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, [filter]);

  async function toggleField(id: string, field: "featured" | "in_stock", current: boolean) {
    await supabase.from("products").update({ [field]: !current }).eq("id", id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: !current } : p)));
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        action={
          <Link href="/admin/products/new" className={primaryBtn}>
            + Add Product
          </Link>
        }
      />

      <FilterPills
        options={["all", "featured", "out of stock"]}
        active={filter}
        onChange={(v) => { setFilter(v); setLoading(true); }}
      />

      <TableShell>
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-[48px_1fr_110px_90px_90px_80px] gap-4 px-5 py-3 border-b border-antique-gold/12">
          {["", "Product", "Price", "Featured", "In Stock", ""].map((h, i) => (
            <span key={i} className="text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/30 font-sans">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <LoadingRows />
        ) : products.length === 0 ? (
          <EmptyState message="No products yet. Add your first product to get started." />
        ) : (
          <div className="divide-y divide-antique-gold/10">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-ivory/[0.025] transition-colors duration-200"
              >
                {/* ── MOBILE ── */}
                <div className="sm:hidden px-4 py-4 flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative bg-ivory/[0.06]">
                    {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ivory text-sm font-semibold font-sans truncate">{p.name}</p>
                    <p className="text-antique-gold/70 text-[11px] font-sans mt-0.5 font-medium">
                      ₦{Number(p.price).toLocaleString()}
                    </p>
                    <p className="text-ivory/35 text-[10px] font-sans">{p.category || "—"}</p>
                    <div className="flex items-center gap-4 mt-2.5">
                      <label className="flex items-center gap-2">
                        <Toggle on={p.featured} onClick={() => toggleField(p.id, "featured", p.featured)} />
                        <span className="text-[9px] uppercase tracking-[0.15em] text-ivory/35 font-sans">Featured</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Toggle on={p.in_stock} onClick={() => toggleField(p.id, "in_stock", p.in_stock)} />
                        <span className="text-[9px] uppercase tracking-[0.15em] text-ivory/35 font-sans">Stock</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Link href={`/admin/products/${p.id}/edit`}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-antique-gold/60 hover:text-antique-gold font-sans transition-colors">
                      Edit
                    </Link>
                    <button onClick={() => deleteProduct(p.id)}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ivory/25 hover:text-signal-red font-sans transition-colors">
                      Delete
                    </button>
                  </div>
                </div>

                {/* ── DESKTOP ── */}
                <div className="hidden sm:grid grid-cols-[48px_1fr_110px_90px_90px_80px] gap-4 px-5 py-4 items-center">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-ivory/[0.06]">
                    {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                  </div>
                  <div>
                    <p className="text-ivory text-sm font-semibold font-sans">{p.name}</p>
                    {p.category && <p className="text-ivory/35 text-[10px] font-sans mt-0.5">{p.category}</p>}
                  </div>
                  <p className="text-antique-gold/80 text-sm font-semibold font-sans">
                    ₦{Number(p.price).toLocaleString()}
                  </p>
                  <div className="flex justify-center">
                    <Toggle on={p.featured} onClick={() => toggleField(p.id, "featured", p.featured)} />
                  </div>
                  <div className="flex justify-center">
                    <Toggle on={p.in_stock} onClick={() => toggleField(p.id, "in_stock", p.in_stock)} />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${p.id}/edit`}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-antique-gold/60 hover:text-antique-gold font-sans transition-colors">
                      Edit
                    </Link>
                    <button onClick={() => deleteProduct(p.id)}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ivory/25 hover:text-signal-red font-sans transition-colors">
                      Del
                    </button>
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
