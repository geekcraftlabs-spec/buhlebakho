"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { BUSINESS_NAME } from "@/lib/data";

export function TopBar() {
  const scrolled = useScrolled(120);

  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <motion.header
        initial={false}
        animate={{
          maxWidth: scrolled ? 760 : 1400,
          paddingLeft: scrolled ? 20 : 12,
          paddingRight: scrolled ? 20 : 12,
          paddingTop: scrolled ? 10 : 18,
          paddingBottom: scrolled ? 10 : 18,
          borderRadius: scrolled ? 999 : 24,
          backgroundColor: scrolled
            ? "rgba(26, 15, 10, 0.92)"
            : "rgba(26, 15, 10, 0)",
          borderColor: scrolled
            ? "rgba(245, 230, 211, 0.14)"
            : "rgba(245, 230, 211, 0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        style={{
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderWidth: 1,
          borderStyle: "solid",
        }}
        className="pointer-events-auto w-full flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <Flower2
            size={22}
            className="text-terracotta transition-transform group-hover:rotate-12 duration-500"
          />
          <span className="font-display text-lg text-sand tracking-tight">
            {BUSINESS_NAME}
          </span>
        </Link>

        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-terracotta text-white px-5 py-2.5 rounded-full hover:bg-terracotta/90 transition"
        >
          Shop Now
        </Link>
      </motion.header>
    </div>
  );
}