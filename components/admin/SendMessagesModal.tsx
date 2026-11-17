/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Order } from "@/types";
import { buildWhatsAppLink, buildShippedMessage } from "@/lib/admin";
import { cn } from "@/lib/utils";

interface BroadcastItem {
  order: Order;
  status: "pending" | "opened" | "sent";
  link: string;
}

export function SendMessagesModal({
  open,
  orders,
  onClose,
  onAllSent,
}: {
  open: boolean;
  orders: Order[];
  onClose: () => void;
  onAllSent: () => void;
}) {
  const [items, setItems] = useState<BroadcastItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const built = orders.map((o) => ({
      order: o,
      status: "pending" as const,
      link: buildWhatsAppLink(o),
    }));
    setItems(built);
    setCurrentIndex(0);
  }, [open, orders]);

  const opened = items.filter((i) => i.status === "opened").length;
  const sent = items.filter((i) => i.status === "sent").length;
  const pending = items.filter((i) => i.status === "pending").length;

  const openNext = () => {
    const nextIndex = items.findIndex((i) => i.status === "pending");
    if (nextIndex === -1) return;
    window.open(items[nextIndex].link, "_blank");
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === nextIndex ? { ...item, status: "opened" } : item
      )
    );
    setCurrentIndex(nextIndex);
  };

  const markAsSent = () => {
    // Prefer the currently-open item; else fall back to first opened
    let targetIndex = currentIndex;
    if (items[targetIndex]?.status !== "opened") {
      targetIndex = items.findIndex((i) => i.status === "opened");
      if (targetIndex === -1) return;
    }

    const updated = items.map((item, idx) =>
      idx === targetIndex ? { ...item, status: "sent" as const } : item
    );
    setItems(updated);

    const nextPending = updated.findIndex((i) => i.status === "pending");
    if (nextPending === -1) {
      // All done — trigger the "move to shipped" callback
      onAllSent();
    } else {
      setCurrentIndex(nextPending);
    }
  };

  const allSent = items.length > 0 && items.every((i) => i.status === "sent");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-auto z-[90] bg-espresso border border-white/10 rounded-3xl overflow-hidden"
          >
            <header className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <p className="text-xs uppercase tracking-widest text-terracotta">
                  Send Messages
                </p>
                <h2 className="font-display text-2xl text-sand mt-1">
                  Notify Customers
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-sand/60 hover:text-sand"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </header>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Progress */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Pending", value: pending, tone: "text-amber-400" },
                  { label: "Opened", value: opened, tone: "text-blue-400" },
                  { label: "Sent", value: sent, tone: "text-green-400" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-sand/40">
                      {s.label}
                    </p>
                    <p className={cn("font-display text-2xl mt-1", s.tone)}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* List */}
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div
                    key={item.order.id}
                    className={cn(
                      "flex items-center gap-3 bg-white/[0.02] border rounded-xl p-3 transition",
                      item.status === "sent"
                        ? "border-green-500/30 opacity-60"
                        : item.status === "opened"
                          ? "border-blue-500/40"
                          : "border-white/10"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sand text-sm truncate">
                        {item.order.name}
                      </p>
                      <p className="text-xs text-sand/40 font-mono">
                        {item.order.whatsapp}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-widest px-2 py-1 rounded-full",
                        item.status === "sent"
                          ? "bg-green-500/10 text-green-400"
                          : item.status === "opened"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-amber-500/10 text-amber-400"
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Preview of the message */}
              <details className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                <summary className="text-xs uppercase tracking-widest text-sand/50 cursor-pointer">
                  Preview message
                </summary>
                <pre className="text-xs text-sand/70 whitespace-pre-wrap mt-3 font-sans">
                  {orders[0] ? buildShippedMessage(orders[0]) : ""}
                </pre>
              </details>
            </div>

            <footer className="p-5 border-t border-white/10 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={openNext}
                disabled={pending === 0}
              >
                <ExternalLink size={14} /> Open Next
              </Button>
              <Button
                className="flex-1"
                onClick={markAsSent}
                disabled={opened === 0}
              >
                <Check size={14} /> Mark as Sent
              </Button>
            </footer>

            {allSent && (
              <div className="px-5 pb-5">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center text-sm text-green-400 flex items-center justify-center gap-2">
                  <Check size={16} /> All messages sent
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}