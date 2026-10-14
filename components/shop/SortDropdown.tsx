"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "size-asc"
  | "size-desc";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "size-asc": "Size: Small to Large",
  "size-desc": "Size: Large to Small",
};

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2.5 rounded-full border transition",
          open
            ? "border-terracotta text-terracotta bg-terracotta/5"
            : "border-white/15 text-sand/60 hover:border-terracotta/50 hover:text-sand"
        )}
        aria-label="Sort products"
      >
        <ArrowUpDown size={14} />
        <span>{SORT_LABELS[value]}</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="absolute right-0 top-full mt-2 w-56 bg-espresso border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-30"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 text-sm flex items-center justify-between gap-3 transition",
                  opt === value
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-sand/70 hover:bg-white/5 hover:text-sand"
                )}
              >
                <span>{SORT_LABELS[opt]}</span>
                {opt === value && <Check size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}