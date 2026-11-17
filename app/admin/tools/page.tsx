/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Trash2, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ToolsPage() {
  const [mockDate, setMockDate] = useState("");
  const [originalMockDate, setOriginalMockDate] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetch("/api/admin/tools/mock-date")
      .then((r) => r.json())
      .then((d) => {
        setMockDate(d.mockDate ?? "");
        setOriginalMockDate(d.mockDate ?? "");
      })
      .catch(() => {});
  }, []);

  const saveDate = async () => {
    const res = await fetch("/api/admin/tools/mock-date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mockDate }),
    });
    if (res.ok) {
      setOriginalMockDate(mockDate);
      setStatus("Saved. Restart dev server for env to take effect.");
    } else {
      setStatus("Failed to save.");
    }
  };

  const clearDate = async () => {
    await fetch("/api/admin/tools/mock-date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mockDate: "" }),
    });
    setMockDate("");
    setOriginalMockDate("");
    setStatus("Cleared.");
  };

  const clearAllOrders = async () => {
    if (!confirm("Delete ALL orders? This cannot be undone.")) return;
    setClearing(true);
    const res = await fetch("/api/admin/tools/clear-orders", {
      method: "POST",
    });
    setClearing(false);
    if (res.ok) {
      setStatus("All orders deleted.");
    } else {
      setStatus("Failed to delete orders.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <header className="flex items-center gap-4">
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
            Testing Tools
          </h1>
        </div>
      </header>

      {status && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-terracotta/10 border border-terracotta/30 rounded-xl px-4 py-3 text-sm text-terracotta"
        >
          {status}
        </motion.div>
      )}

      {/* Date manipulation */}
      <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta/15 border border-terracotta/30 flex items-center justify-center">
            <Calendar size={18} className="text-terracotta" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-sand">
              Mock Current Date
            </h2>
            <p className="text-xs text-sand/50">
              All server-side timestamps use this date instead of real time.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            type="date"
            value={mockDate}
            onChange={(e) => setMockDate(e.target.value)}
          />
          <p className="text-xs text-sand/40">
            Leave blank for real time. Format: YYYY-MM-DD.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveDate} disabled={mockDate === originalMockDate}>
              <Save size={14} /> Save Date
            </Button>
            <Button variant="secondary" onClick={clearDate}>
              <RefreshCw size={14} /> Reset to Real Time
            </Button>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-400">
            ⚠ After saving, restart the dev server (`Ctrl+C` then `npm run dev`)
            for changes to take effect.
          </div>
        </div>
      </section>

      {/* Data cleanup */}
      <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <Trash2 size={18} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-sand">
              Clear All Orders
            </h2>
            <p className="text-xs text-sand/50">
              Deletes every order from the database. Use during testing only.
            </p>
          </div>
        </div>
        <Button variant="danger" onClick={clearAllOrders} disabled={clearing}>
          <Trash2 size={14} /> Delete All Orders
        </Button>
      </section>

      {/* SQL reference */}
      <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3">
        <h2 className="font-display text-xl text-sand">
          Manual SQL (Neon Console)
        </h2>
        <p className="text-xs text-sand/50">
          Paste into Neon → SQL Editor for manual control.
        </p>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-sand/40 mb-1">
              Delete all orders
            </p>
            <pre className="bg-black/40 rounded-lg p-3 text-xs text-sand/80 overflow-x-auto">
              {`DELETE FROM "Order";`}
            </pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-sand/40 mb-1">
              Delete orders older than 30 days
            </p>
            <pre className="bg-black/40 rounded-lg p-3 text-xs text-sand/80 overflow-x-auto">
              {`DELETE FROM "Order"
WHERE "createdAt" < NOW() - INTERVAL '30 days';`}
            </pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-sand/40 mb-1">
              Reset all orders to "paid"
            </p>
            <pre className="bg-black/40 rounded-lg p-3 text-xs text-sand/80 overflow-x-auto">
              {`UPDATE "Order"
SET status = 'paid', "paidAt" = NOW(), "orderDay" = TO_CHAR(NOW(), 'YYYY-MM-DD');`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}