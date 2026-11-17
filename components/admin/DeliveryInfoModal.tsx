"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Truck, RefreshCw, Clock, X, Shield } from "lucide-react";

export function DeliveryInfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-auto z-[90] bg-espresso border border-white/10 rounded-3xl overflow-hidden"
          >
            <header className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <p className="text-xs uppercase tracking-widest text-terracotta">
                  Delivery & Returns
                </p>
                <h2 className="font-display text-2xl text-sand mt-1">
                  The quick version
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

            <div className="p-5 space-y-4">
              <div className="space-y-3">
                {[
                  {
                    icon: Clock,
                    title: "Next-day processing",
                    desc: "Paid orders are processed the next business day.",
                  },
                  {
                    icon: Truck,
                    title: "2-3 day delivery",
                    desc: "Door delivery via The Courier Guy. R100 flat rate nationwide. You'll get an SMS with tracking.",
                  },
                  {
                    icon: Shield,
                    title: "Quality-checked",
                    desc: "Every wig is inspected before it leaves us.",
                  },
                  {
                    icon: RefreshCw,
                    title: "Returns",
                    desc: "Due to hygiene reasons, wigs can't be returned once shipped. Faulty items are replaced within 14 days of delivery — just WhatsApp us.",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-terracotta/15 border border-terracotta/30 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-terracotta" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sand text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-sand/60 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href="https://wa.me/27682852438"
                target="_blank"
                rel="noreferrer"
                className="block text-center text-xs uppercase tracking-widest text-terracotta hover:text-terracotta/80 transition py-2"
              >
                Questions? WhatsApp us →
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}