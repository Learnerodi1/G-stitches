"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabaseClient";
import {
  AdminPageHeader,
  primaryBtn,
  ghostBtn,
  inputClass,
  selectClass,
  Toggle,
} from "../../components/ui";

const CATEGORIES = ["Women", "Men", "Accessories", "Bespoke"];

export default function AdminNewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    alt: "",
    category: "",
    description: "",
    featured: false,
    in_stock: true,
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const ext = file.name.split(".").pop();
    const filename = `products/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("images")
      .upload(filename, file, { upsert: true });
    if (upErr) {
      setError("Image upload failed: " + upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("images").getPublicUrl(filename);
    setImageUrl(data.publicUrl);
    setImagePreview(URL.createObjectURL(file));
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) { setError("Please upload a product image."); return; }
    if (!form.name || !form.price) { setError("Name and price are required."); return; }
    setSaving(true);
    const { error: dbErr } = await supabase.from("products").insert({
      name: form.name,
      price: parseFloat(form.price),
      image_url: imageUrl,
      alt: form.alt || form.name,
      category: form.category || null,
      description: form.description || null,
      featured: form.featured,
      in_stock: form.in_stock,
    });
    if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    router.push("/admin/products");
  }

  return (
    <div>
      <AdminPageHeader label="Products" title="Add Product" />

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Ankara Wrap Dress"
            className={inputClass}
          />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
              Price (₦) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="45000"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={selectClass}
            >
              <option value="">— Select —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
            Product Image *
          </label>
          <div className="flex items-start gap-4">
            {imagePreview && (
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-ivory/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="cursor-pointer flex-1">
              <div className={`${inputClass} cursor-pointer`}>
                <span className="text-ivory/40">
                  {uploading ? "Uploading…" : imageUrl ? "Change image" : "Choose file"}
                </span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Alt text */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
            Alt Text
          </label>
          <input
            type="text"
            value={form.alt}
            onChange={(e) => set("alt", e.target.value)}
            placeholder="Descriptive alt text for accessibility"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Product description…"
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-8">
          {(["featured", "in_stock"] as const).map((field) => (
            <div key={field} className="flex items-center gap-3">
              <Toggle on={form[field]} onClick={() => set(field, !form[field])} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ivory/60 font-sans">
                {field === "featured" ? "Featured" : "In Stock"}
              </span>
            </div>
          ))}
        </div>

        {error && <p className="text-signal-red text-xs font-sans">{error}</p>}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className={`${primaryBtn} disabled:opacity-50`}
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className={ghostBtn}
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}
