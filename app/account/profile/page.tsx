"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

const inputCls =
  "w-full bg-white border border-ground/15 rounded-xl px-4 py-3 text-ground text-sm font-sans outline-none placeholder:text-ground/30 focus:border-ground/35 transition-colors duration-200";

export default function ProfilePage() {
  const [user, setUser]     = useState<User | null>(null);
  const [form, setForm]     = useState({ full_name: "", phone: "" });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]       = useState<{ text: string; ok: boolean } | null>(null);
  const fileRef             = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
      const { data } = await supabase.from("profiles")
        .select("full_name, phone, avatar_url").eq("id", user.id).single();
      setForm({
        full_name: data?.full_name ?? user.user_metadata?.full_name ?? "",
        phone:     data?.phone     ?? user.user_metadata?.phone     ?? "",
      });
      setAvatarUrl(data?.avatar_url ?? "");
    })();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { setMsg({ text: "Image must be under 5 MB.", ok: false }); return; }
    setUploading(true);
    const ext  = file.name.split(".").pop() ?? "jpg";
    const path = `avatars/${user.id}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true, contentType: file.type });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      setAvatarUrl(publicUrl);
      setMsg({ text: "Photo updated!", ok: true });
    } else { setMsg({ text: "Upload failed. Try again.", ok: false }); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setMsg(null);
    const { error } = await supabase.from("profiles")
      .update({ full_name: form.full_name, phone: form.phone }).eq("id", user.id);
    setSaving(false);
    setMsg(error
      ? { text: "Could not save. Try again.", ok: false }
      : { text: "Profile saved!", ok: true }
    );
    setTimeout(() => setMsg(null), 3000);
  };

  const initials = form.full_name
    ? form.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-7 max-w-xl">

      {/* Page header */}
      <div>
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-ground/35 mb-0.5">Settings</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ground">Edit Profile</h1>
      </div>

      {/* Avatar card — dark brand card */}
      <div className="bg-ground rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-antique-gold/40 via-antique-gold to-antique-gold/40" />
        <div className="px-5 sm:px-7 py-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-ivory/30 font-sans mb-5">
            Profile Photo
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar circle */}
            <div className="relative shrink-0 group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-antique-gold/10 border-2 border-antique-gold/30">
                {avatarUrl
                  ? <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                  : <span className="w-full h-full flex items-center justify-center text-2xl font-bold text-antique-gold font-sans">{initials}</span>
                }
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold font-sans text-ivory mb-0.5">{form.full_name || "Your Name"}</p>
              <p className="text-[11px] font-sans text-ivory/35 mb-3">{user?.email}</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 bg-antique-gold/10 border border-antique-gold/25 text-antique-gold px-4 py-2 rounded-full text-[11px] font-semibold font-sans uppercase tracking-[0.15em] hover:bg-antique-gold/20 transition-colors disabled:opacity-50"
              >
                {uploading
                  ? <><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Uploading…</>
                  : <><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>Change Photo</>
                }
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
              <p className="text-[9px] text-ivory/20 font-sans mt-2">JPG, PNG or WebP · Max 5 MB</p>
              {msg && (
                <p className={`text-[11px] font-sans mt-2 ${msg.ok ? "text-emerald-400" : "text-signal-red"}`}>
                  {msg.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal info form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-ground/8 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-7 py-4 border-b border-ground/6">
          <p className="text-[10px] font-semibold font-sans text-ground uppercase tracking-[0.25em]">
            Personal Information
          </p>
        </div>

        <div className="px-5 sm:px-7 py-6 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ground/40 font-sans mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="Your full name"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ground/40 font-sans mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+234 000 0000 000"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ground/40 font-sans mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full bg-ground/[0.03] border border-ground/8 rounded-xl px-4 py-3 text-ground/35 text-sm font-sans cursor-not-allowed"
            />
            <p className="text-[10px] text-ground/30 font-sans mt-1.5">Email cannot be changed here.</p>
          </div>
        </div>

        <div className="px-5 sm:px-7 py-4 border-t border-ground/6 bg-ground/[0.02] flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-signal-red text-ivory px-7 py-2.5 rounded-full text-[11px] font-semibold font-sans uppercase tracking-[0.15em] hover:bg-signal-red/90 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {msg && (
            <span className={`text-xs font-sans ${msg.ok ? "text-emerald-600" : "text-signal-red"}`}>
              {msg.text}
            </span>
          )}
        </div>
      </form>

    </div>
  );
}
