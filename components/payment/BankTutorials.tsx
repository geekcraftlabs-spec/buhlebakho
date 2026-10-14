"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { bankTutorials } from "@/lib/data";
import { BankTutorial } from "@/types";

export function BankTutorials() {
  const [active, setActive] = useState<BankTutorial | null>(null);

  return (
    <section className="space-y-6">
      <div>
        <h3 className="font-display text-2xl text-sand">
          How to pay with Payshap
        </h3>
        <p className="text-sm text-sand/50 mt-1">
          Pick your bank and watch the short tutorial.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {bankTutorials.map((bank) => (
          <button
            key={bank.code}
            onClick={() => setActive(bank)}
            className="group relative flex flex-col items-center justify-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-terracotta/60 transition"
          >
            <div className="relative w-12 h-12">
              <Image
                src={bank.logo}
                alt={bank.name}
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <span className="text-sm text-sand">{bank.name}</span>
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-terracotta/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Play size={10} className="text-terracotta" />
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-espresso border border-white/10 rounded-3xl overflow-hidden"
            >
              <header className="flex items-center justify-between p-5 border-b border-white/10">
                <h4 className="font-display text-xl text-sand">
                  {active.name} Tutorial
                </h4>
                <button
                  onClick={() => setActive(null)}
                  className="text-sand/60 hover:text-sand"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </header>
              <div className="aspect-video bg-black flex items-center justify-center text-sand/50 text-sm">
                Tutorial coming soon
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
