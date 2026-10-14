/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/lib/store";

export function CartToast() {
  const items = useCartStore((s) => s.items);
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);
  const isOpen = useCartStore((s) => s.isOpen);
  const openCart = useCartStore((s) => s.openCart);

  const [visible, setVisible] = useState(false);
  const [addedName, setAddedName] = useState("");

  useEffect(() => {
    if (lastAddedAt === 0) return;
    // Don't show if drawer is open
    if (isOpen) return;

    // Get the most recently added item's name
    const last = items[items.length - 1];
    if (last) setAddedName(last.productName);

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, [lastAddedAt, isOpen, items]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed bottom-24 lg:bottom-24 left-1/2 -translate-x-1/2 z-[55] w-[calc(100%-2rem)] max-w-md"
        >
          <div className="bg-espresso/95 backdrop-blur-xl border border-terracotta/40 rounded-2xl shadow-2xl shadow-black/50 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0">
              <Check size={18} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sand text-sm font-medium leading-tight">
                Added to cart
              </p>
              <p className="text-sand/50 text-xs mt-0.5 truncate">
                {addedName}
              </p>
            </div>
            <button
              onClick={() => {
                setVisible(false);
                openCart();
              }}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-terracotta hover:text-terracotta/80 transition shrink-0"
            >
              <ShoppingBag size={12} /> View
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-sand/40 hover:text-sand transition shrink-0"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}