"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wigProducts } from "@/lib/data";
import { HairType } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterBar } from "./FilterBar";

export function ShopContent() {
  const [category, setCategory] = useState("all");
  const [hairType, setHairType] = useState<"all" | HairType>("all");

  const filtered = wigProducts.filter((p) => {
    const catOk = category === "all" || p.category === category;
    const typeOk = hairType === "all" || p.hairType === hairType;
    return catOk && typeOk;
  });

  return (
    <div className="space-y-12">
      <FilterBar
        category={category}
        hairType={hairType}
        onCategoryChange={setCategory}
        onHairTypeChange={setHairType}
      />

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-sand/50 py-12">
          No wigs match these filters.
        </p>
      )}
    </div>
  );
}