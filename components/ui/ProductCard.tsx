"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { WigProduct } from "@/types";
import { colorSwatches } from "@/lib/data";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store";

export function ProductCard({ product }: { product: WigProduct }) {
  const [rangeIndex, setRangeIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const range = product.ranges[rangeIndex];
  const color = range.colors[colorIndex];
  const size = range.sizes[sizeIndex];
  const price = color.prices[size] ?? 0;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      rangeLabel: range.label,
      size,
      color: color.name,
      price,
      image: color.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const isSynthetic = product.hairType === "synthetic";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden group"
    >
      <div className="relative aspect-square overflow-hidden bg-black/30">
        <Image
          src={color.image}
          alt={product.name + " - " + color.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span
            className={cn(
              "text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border",
              isSynthetic
                ? "bg-espresso/80 border-sand/40 text-sand"
                : "bg-terracotta border-terracotta text-white"
            )}
          >
            {isSynthetic ? "Synthetic" : "Human Hair"}
          </span>
          {product.featured && (
            <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-sand text-espresso">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-2xl text-sand leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-sand/50 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {product.ranges.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {product.ranges.map((r, i) => (
              <button
                key={r.label}
                onClick={() => {
                  setRangeIndex(i);
                  setSizeIndex(0);
                  setColorIndex(0);
                }}
                className={cn(
                  "text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border transition",
                  i === rangeIndex
                    ? "bg-terracotta border-terracotta text-white"
                    : "border-white/15 text-sand/60 hover:border-terracotta/50"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {range.colors.map((c, i) => (
            <button
              key={c.code}
              onClick={() => setColorIndex(i)}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                i === colorIndex
                  ? "border-terracotta scale-110"
                  : "border-white/20 hover:border-sand/50"
              )}
              style={{ backgroundColor: colorSwatches[c.code] }}
              aria-label={c.name}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {range.sizes.map((s, i) => (
            <button
              key={s}
              onClick={() => setSizeIndex(i)}
              className={cn(
                "min-w-[40px] text-sm px-3 py-1.5 rounded-lg border transition",
                i === sizeIndex
                  ? "bg-sand text-espresso border-sand"
                  : "border-white/15 text-sand/70 hover:border-sand/50"
              )}
            >
              {s}&quot;
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="font-display text-2xl text-terracotta">
            {formatPrice(price)}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-terracotta/90 transition"
          >
            <ShoppingBag size={16} />
            {added ? "Added" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}