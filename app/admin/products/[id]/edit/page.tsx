"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../../../../lib/supabaseClient";
import {
  AdminPageHeader,
  primaryBtn,
  ghostBtn,
  inputClass,
  selectClass,
  Toggle,
} from "../../components/ui";

const CATEGORIES = ["Women", "Men", "Accessories", "Bespoke"];

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image_url: "",
    alt: "",
    category: "",
    description: "",
    featured: false,
    in_stock: true,
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name,
            price: String(data.price),
            image_url: data.image_url,
            alt: data.alt || "",
            category: data.category || "",
            description: data.description || "",
            featured: data.featured,
            in_stock: data.in_stock,
          });
        }
        setLoading(false);
      });
  }, [id]);

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `products/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("images")
      .upload(filename, file, { upsert: true });
    if (upErr) { setError("Upload failed: " + upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from("images").getPublicUrl(filename);
    setNewImageUrl(data.publicUrl);
    setImagePreview(URL.createObjectURL(file));
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error: dbErr } = await supabase
      .from("products")
      .update({
        name: form.name,
        price: parseFloat(form.price),
        image_url: newImageUrl || form.image_url,
        alt: form.alt || form.name,
        category: form.category || null,
        description: form.description || null,
        featured: form.featured,
        in_stock: form.in_stock,
      })
      .eq("id", id);
    if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    router.push("/admin/products");
  }

  async function handleDelete() {
    if (!confirm("Delete this product permanently?")) return;
    await supabase.from("products").delete().eq("id", id);
    router.push("/admin/products");
  }

  if (loading) return <p className="text-ivory/40 text-sm font-sans pt-8">Loading…</p>;

  const displayImage = imagePreview || form.image_url;

  return (
    <div>
      <AdminPageHeader label="Products" title="Edit Product" />

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
      >
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
          />
        </div>

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

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
            Product Image
          </label>
          <div className="flex items-start gap-4">
            {displayImage && (
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-ivory/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayImage} alt={form.name} className="w-full h-full object-cover" />
              </div>
            )}
            <label className="cursor-pointer flex-1">
              <div className={`${inputClass} cursor-pointer`}>
                <span className="text-ivory/40">
                  {uploading ? "Uploading…" : "Change image"}
                </span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
            Alt Text
          </label>
          <input
            type="text"
            value={form.alt}
            onChange={(e) => set("alt", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/50 font-sans mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className={`${primaryBtn} disabled:opacity-50`}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className={ghostBtn}
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ivory/30 hover:text-signal-red font-sans transition-colors duration-300"
          >
            Delete Product
          </button>
        </div>
      </motion.form>
    </div>
  );
}
