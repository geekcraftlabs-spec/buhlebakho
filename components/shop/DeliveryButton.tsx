"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck } from "lucide-react";
import { DeliveryInfoModal } from "@/components/admin/DeliveryInfoModal";

export function DeliveryButton() {
  const [open, setOpen] = useState(false);
  const [glowPulse, setGlowPulse] = useState(true);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          setOpen(true);
          setGlowPulse(false);
        }}
        className="relative inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2.5 rounded-full border border-terracotta/40 text-terracotta hover:bg-terracotta/10 transition"
      >
        {/* Animated glow ring */}
        <AnimatePresence>
          {glowPulse && (
            <motion.span
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full border-2 border-terracotta/60 pointer-events-none"
            />
          )}
        </AnimatePresence>
        <Truck size={14} />
        Delivery & Returns
      </motion.button>

      <DeliveryInfoModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}