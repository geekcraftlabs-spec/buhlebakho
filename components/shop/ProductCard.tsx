"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, AlertCircle, Check } from "lucide-react";
import { ProductVariant, CartItem } from "@/types";
import {
  COLOR_SWATCHES,
  PLACEHOLDER_IMAGE,
  getTextureLabel,
} from "@/lib/catalog";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store";

export function ProductCard({ variant }: { variant: ProductVariant }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const inStock = variant.stockCount > 0;
  const displayPrice = variant.salePrice ?? variant.price;
  const imageSrc = imgError ? PLACEHOLDER_IMAGE : variant.image;

  const handleAdd = () => {
    if (!inStock) return;

    const item: CartItem = {
      variantId: variant.id,
      productName: `${getTextureLabel(variant.texture)} ${
        variant.hairType === "futura-fibre" ? "Futura" : "Human Blend"
      }`,
      texture: variant.texture,
      laceType: variant.laceType,
      colorCode: variant.colorCode,
      colorName: variant.colorName,
      sizeLabel: variant.sizeLabel,
      price: displayPrice,
      image: variant.image,
      quantity: 1,
      hairType: variant.hairType,
    };

    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-black/20">
        <Image
          src={imageSrc}
          alt={`${variant.colorName} ${getTextureLabel(variant.texture)} ${variant.sizeLabel}"`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-cover group-hover:scale-105 transition-transform duration-700",
            !inStock && "opacity-60"
          )}
          onError={() => setImgError(true)}
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          <span className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-terracotta text-white font-medium">
            {variant.laceType}
          </span>
          {variant.hairType === "futura-fibre" && (
            <span className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-purple-500/90 text-white font-medium">
              Futura
            </span>
          )}
          {variant.hairType === "custom-human-hair" && (
            <span className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-500 text-espresso font-medium">
              Made to Order
            </span>
          )}
        </div>

        {inStock && variant.stockCount <= 5 && (
          <div className="absolute top-4 right-4">
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/90 text-espresso font-medium flex items-center gap-1">
              <AlertCircle size={10} /> Only {variant.stockCount} left
            </span>
          </div>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs uppercase tracking-[0.3em] text-sand/80 border border-sand/40 rounded-full px-4 py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-display text-2xl text-sand leading-tight">
            {getTextureLabel(variant.texture)}
          </h3>
          <p className="text-xs text-sand/50 mt-1">
            {variant.colorName} · {variant.sizeLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-white/20"
            style={{
              backgroundColor: COLOR_SWATCHES[variant.colorCode] ?? "#888888",
            }}
            aria-label={variant.colorName}
          />
          <span className="text-xs text-sand/60">{variant.colorCode}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex flex-col">
            {variant.salePrice && (
              <span className="text-xs text-sand/40 line-through">
                {formatPrice(variant.price)}
              </span>
            )}
            <span className="font-display text-2xl text-terracotta leading-none">
              {formatPrice(displayPrice)}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            animate={added ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
            onClick={handleAdd}
            disabled={!inStock}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition overflow-hidden",
              inStock
                ? added
                  ? "bg-green-500 text-white"
                  : "bg-terracotta text-white hover:bg-terracotta/90"
                : "bg-white/5 text-sand/30 cursor-not-allowed"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <Check size={16} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  {inStock ? "Add" : "Sold Out"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}