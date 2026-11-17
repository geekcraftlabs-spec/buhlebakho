/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { DELIVERY_FEE } from "@/lib/data";
import { useCartStore } from "@/lib/store";

interface OrderData {
  id: string;
  name: string;
  whatsapp: string;
  total: number;
  status: string;
}

export function ThankYouClient({ order }: { order: OrderData | null }) {
  const clearCart = useCartStore((s) => s.clearCart);
  const [confirmed, setConfirmed] = useState(false);
  const [checking, setChecking] = useState(true);

  const firstName = order?.name?.split(" ")[0] ?? "there";

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!order) {
      setChecking(false);
      return;
    }
    if (order.status !== "pending") {
      setConfirmed(true);
      setChecking(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/public/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });
        if (res.ok) setConfirmed(true);
      } catch (err) {
        console.error("[thank-you] mark-paid failed:", err);
      } finally {
        setChecking(false);
      }
    })();
  }, [order]);

  return (
    <main className="min-h-screen px-6 pt-32 pb-28 lg:pt-40">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40"
          >
            {checking ? (
              <Loader2 className="text-green-400 animate-spin" size={36} />
            ) : (
              <CheckCircle2 className="text-green-400" size={36} />
            )}
          </motion.div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-terracotta">
              {checking ? "Confirming..." : "Order Confirmed"}
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-sand leading-tight">
              Thank you, {firstName}
            </h1>
            <p className="text-sand/60 max-w-md mx-auto">
              {checking
                ? "Just a moment..."
                : `Your payment was successful. We'll WhatsApp you on ${
                    order?.whatsapp ?? "your number"
                  } shortly to confirm your order.`}
            </p>
          </div>
        </div>

        {order && (
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-sand/50">Order ID</span>
              <span className="text-sand font-mono text-xs">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sand/50">Total Paid</span>
              <span className="text-terracotta font-display text-xl">
                {formatPrice(order.total)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sand/50">Delivery</span>
              <span className="text-sand">
                Door Delivery · {formatPrice(DELIVERY_FEE)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sand/50">Status</span>
              <span className="text-green-400 uppercase tracking-widest text-xs">
                {confirmed ? "paid" : order.status}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="font-display text-2xl text-sand">
            What happens next
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: CheckCircle2,
                title: "Confirmation",
                desc: "We'll WhatsApp you shortly to confirm your order.",
              },
              {
                icon: Package,
                title: "Packed next-day",
                desc: "Your order is processed the next business day.",
              },
              {
                icon: Truck,
                title: "2-3 day delivery",
                desc: "Tracked Courier Guy shipping to your door.",
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3"
                >
                  <Icon size={20} className="text-terracotta" />
                  <div>
                    <p className="text-sand font-medium text-sm">
                      {step.title}
                    </p>
                    <p className="text-xs text-sand/50 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-6">
          <Link href="/shop">
            <Button variant="secondary">
              <Home size={14} /> Continue Shopping
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs uppercase tracking-[0.3em] text-sand/30 pt-8">
          Your beauty · Your crown · Your rules
        </p>
      </div>
    </main>
  );
}