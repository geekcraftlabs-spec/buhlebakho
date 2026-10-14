/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore, useCartCount, useCartSubtotal } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export function DesktopCartButton() {
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartCount();
  const subtotal = useCartSubtotal();
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);

  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (lastAddedAt === 0) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [lastAddedAt]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.3 }}
      whileTap={{ scale: 0.96 }}
      onClick={openCart}
      className="hidden lg:flex fixed bottom-6 right-6 z-50 items-center gap-3 bg-terracotta text-white px-5 py-3.5 rounded-full shadow-2xl shadow-terracotta/30 hover:bg-terracotta/90 transition"
      aria-label="Open cart"
    >
      <motion.div
        animate={pulse ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <ShoppingBag size={18} />
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute -top-2 -right-2 bg-espresso text-terracotta text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border border-terracotta"
          >
            {count}
          </motion.span>
        )}
      </motion.div>
      <span className="text-sm font-medium">
        {count > 0
          ? `${count} item${count > 1 ? "s" : ""} · ${formatPrice(subtotal)}`
          : "Cart"}
      </span>
    </motion.button>
  );
}