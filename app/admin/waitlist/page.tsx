/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Bell,
  Check,
  MessageCircle,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  getWaitlist,
  markNotified,
  removeFromWaitlist,
  buildNotifyMessage,
  WaitlistEntry,
} from "@/lib/waitlist";
import { cn } from "@/lib/utils";

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "notified">("pending");

  const refresh = () => setEntries(getWaitlist());

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return entries
      .filter((e) => {
        if (filter === "pending") return !e.notified;
        if (filter === "notified") return e.notified;
        return true;
      })
      .filter(
        (e) =>
          !q ||
          e.phone.includes(q) ||
          e.variantSnapshot.productName.toLowerCase().includes(q) ||
          e.variantSnapshot.colorName.toLowerCase().includes(q) ||
          e.variantSnapshot.sizeLabel.toLowerCase().includes(q)
      );
  }, [entries, search, filter]);

  const stats = useMemo(() => {
    return {
      total: entries.length,
      pending: entries.filter((e) => !e.notified).length,
      notified: entries.filter((e) => e.notified).length,
    };
  }, [entries]);

  const openWhatsApp = (phone: string, text: string) => {
    const clean = phone.replace(/\D/g, "").replace(/^0/, "27");
    window.open(
      `https://wa.me/${clean}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleNotify = (entry: WaitlistEntry) => {
    openWhatsApp(entry.phone, buildNotifyMessage(entry));
    markNotified(entry.id);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this entry from the waitlist?")) return;
    removeFromWaitlist(id);
    refresh();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2.5 rounded-full border border-sand/20 text-sand/70 hover:border-terracotta/40 hover:text-sand transition"
          >
            <ChevronLeft size={14} /> Dashboard
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
              Admin
            </p>
            <h1 className="font-display text-4xl text-sand leading-none mt-1">
              Waitlist
            </h1>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, tone: "text-sand" },
          { label: "Pending", value: stats.pending, tone: "text-amber-400" },
          { label: "Notified", value: stats.notified, tone: "text-green-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
          >
            <p className="text-xs uppercase tracking-widest text-sand/40">
              {s.label}
            </p>
            <p className={cn("font-display text-3xl mt-2", s.tone)}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["pending", "notified", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition",
                filter === f
                  ? "bg-terracotta border-terracotta text-white"
                  : "border-white/15 text-sand/60 hover:border-terracotta/50"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sand/40"
          />
          <Input
            placeholder="Search by phone, color, size..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sand/40 hover:text-sand"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <Bell size={28} className="mx-auto text-sand/30 mb-3" />
            <p className="text-sand/50">
              {filter === "pending"
                ? "No pending waitlist entries."
                : "No entries match."}
            </p>
          </div>
        )}

        {filtered.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-wrap items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4",
              entry.notified && "opacity-60"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sand text-sm font-medium">
                  {entry.variantSnapshot.productName}
                </p>
                {entry.notified ? (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 flex items-center gap-1">
                    <Check size={9} /> Notified
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-sand/50 mt-1">
                {entry.variantSnapshot.colorName} ·{" "}
                {entry.variantSnapshot.sizeLabel} ·{" "}
                {entry.variantSnapshot.laceType}
              </p>
              <p className="text-xs text-sand/40 mt-1 font-mono">
                {entry.phone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!entry.notified && (
                <Button size="sm" onClick={() => handleNotify(entry)}>
                  <MessageCircle size={14} /> Notify
                </Button>
              )}
              {entry.notified && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    openWhatsApp(entry.phone, buildNotifyMessage(entry))
                  }
                >
                  <MessageCircle size={14} /> Send Again
                </Button>
              )}
              <button
                onClick={() => handleDelete(entry.id)}
                className="w-9 h-9 rounded-lg border border-white/10 text-sand/40 hover:text-red-400 hover:border-red-400/40 flex items-center justify-center"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}