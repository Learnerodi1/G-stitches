"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

interface Message {
  id: string;
  message: string;
  first_name: string;
  last_name: string;
  email: string;
  is_read: boolean;
  created_at: string;
}

export default function AccountMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setMessages(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-ground/10 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-sans tracking-[0.25em] uppercase text-ground/40 mb-1">Account</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ground">My Messages</h1>
        </div>
        <Link
          href="/contact"
          className="bg-signal-red text-ivory px-5 py-2.5 rounded-full text-xs font-semibold font-sans uppercase tracking-wider hover:bg-signal-red/90 transition-colors"
        >
          + New Message
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ground/8 shadow-sm p-12 text-center">
          <svg className="w-10 h-10 text-ground/20 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <p className="text-ground/50 font-sans text-sm mb-4">No messages sent yet.</p>
          <Link
            href="/contact"
            className="bg-signal-red text-ivory px-6 py-2.5 rounded-full text-sm font-semibold font-sans uppercase tracking-wider hover:bg-signal-red/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl border border-ground/8 shadow-sm px-5 sm:px-6 py-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-ground/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-ground/50 font-sans">
                      {(msg.first_name?.[0] ?? "?").toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-sans text-ground">
                      {msg.first_name} {msg.last_name}
                    </p>
                    <p className="text-xs text-ground/40 font-sans">{msg.email}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-ground/40 font-sans">{fmtDate(msg.created_at)}</p>
                  <span className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-sans ${
                    msg.is_read ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {msg.is_read ? "Seen" : "Sent"}
                  </span>
                </div>
              </div>
              <p className="text-sm font-sans text-ground/70 leading-relaxed bg-ground/[0.03] rounded-xl px-4 py-3">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
