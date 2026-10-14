/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { getTextureLabel } from "@/lib/catalog";

const DELIVERY_FEE = 100;

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const subtotal = useCartSubtotal();
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-espresso border-l border-white/10 z-[70] flex flex-col"
          >
            <header className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-display text-2xl text-sand">
                Your Bag ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="text-sand/60 hover:text-sand"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 && (
                <p className="text-sand/50 text-center py-12">
                  Your bag is empty.
                </p>
              )}
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-3"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/30 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sand text-sm font-medium truncate">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-sand/50 mt-0.5">
                      {item.colorName} · {item.sizeLabel}
                      {item.laceType && ` · ${item.laceType}`}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded-md border border-white/15 flex items-center justify-center text-sand/60 hover:border-terracotta hover:text-terracotta"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sand text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded-md border border-white/15 flex items-center justify-center text-sand/60 hover:border-terracotta hover:text-terracotta"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-terracotta font-display text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-sand/30 hover:text-red-400 self-start"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-white/10 p-6 space-y-4">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-sand/60">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sand/60">
                    <span>Delivery</span>
                    <span>{formatPrice(DELIVERY_FEE)}</span>
                  </div>
                  <div className="flex justify-between text-sand font-medium pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span className="text-terracotta font-display text-xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className={cn(
                    "block text-center w-full bg-terracotta text-white py-3 rounded-xl font-medium hover:bg-terracotta/90 transition"
                  )}
                >
                  Proceed to Checkout
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}