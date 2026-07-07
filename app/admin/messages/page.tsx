"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { AdminPageHeader, EmptyState, LoadingRows, FilterPills } from "../components/ui";

interface Message {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchMsgs() {
      let q = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (filter === "unread") q = q.eq("is_read", false);
      const { data } = await q;
      setMessages(data || []);
      setLoading(false);
    }
    fetchMsgs();
  }, [filter]);

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
  }

  async function toggleExpand(msg: Message) {
    const opening = expanded !== msg.id;
    setExpanded(opening ? msg.id : null);
    if (opening && !msg.is_read) markRead(msg.id);
  }

  return (
    <div>
      <AdminPageHeader title="Messages" />

      <FilterPills
        options={["all", "unread"]}
        active={filter}
        onChange={(v) => { setFilter(v); setLoading(true); }}
      />

      {loading ? (
        <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl overflow-hidden">
          <LoadingRows />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-ivory/[0.04] border border-antique-gold/20 rounded-2xl overflow-hidden">
          <EmptyState message="No messages found." />
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className={`bg-ivory/[0.04] border rounded-2xl overflow-hidden transition-colors duration-300 ${
                msg.is_read ? "border-antique-gold/15" : "border-antique-gold/40"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(msg)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-ivory/[0.03] transition-colors duration-200 text-left gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {!msg.is_read && (
                    <span className="w-2 h-2 rounded-full bg-antique-gold shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold font-sans truncate ${msg.is_read ? "text-ivory/60" : "text-ivory"}`}>
                      {msg.first_name} {msg.last_name}
                    </p>
                    <p className="text-ivory/35 text-[11px] font-sans mt-0.5 truncate">
                      {msg.email}
                      {msg.location ? ` · ${msg.location}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="text-ivory/25 text-[10px] font-sans hidden sm:block">
                    {new Date(msg.created_at).toLocaleDateString("en-NG")}
                  </p>
                  <span className="text-ivory/25 text-xs font-sans">
                    {expanded === msg.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Expanded */}
              <AnimatePresence>
                {expanded === msg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <div className="px-5 pb-5 border-t border-antique-gold/12">
                      <p className="text-ivory/70 text-sm font-sans leading-relaxed mt-4 whitespace-pre-wrap">
                        {msg.message || "—"}
                      </p>
                      {msg.phone && (
                        <p className="text-ivory/35 text-[11px] font-sans mt-3">Phone: {msg.phone}</p>
                      )}
                      {!msg.is_read && (
                        <button
                          onClick={() => markRead(msg.id)}
                          className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-antique-gold/60 hover:text-antique-gold font-sans transition-colors duration-300"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
