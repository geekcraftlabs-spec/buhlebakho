"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore, useCartSubtotal } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { DELIVERY_FEE } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();
  const total = subtotal + DELIVERY_FEE;

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [confirmWhatsapp, setConfirmWhatsapp] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"door" | "locker">("door");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your full name.");
    if (whatsapp.length !== 9 || !/^\d{9}$/.test(whatsapp))
      return setError("WhatsApp number must be 9 digits (e.g. 831234567).");
    if (whatsapp !== confirmWhatsapp)
      return setError("WhatsApp numbers do not match.");
    if (deliveryMethod === "door" && !address.trim())
      return setError("Please enter your delivery address.");
    if (items.length === 0) return setError("Your bag is empty.");

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          deliveryMethod,
          address: deliveryMethod === "door" ? address : null,
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed.");
      clearCart();
      router.push(`/thank-you/${data.orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="font-display text-2xl text-sand">Your details</h2>
        <Input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex items-stretch gap-2">
          <div className="flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-sand/60 text-sm">
            +27
          </div>
          <Input
            placeholder="831234567"
            value={whatsapp}
            onChange={(e) =>
              setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 9))
            }
            inputMode="numeric"
            maxLength={9}
            required
          />
        </div>
        <Input
          placeholder="Confirm WhatsApp number"
          value={confirmWhatsapp}
          onChange={(e) =>
            setConfirmWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 9))
          }
          inputMode="numeric"
          maxLength={9}
          required
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl text-sand">Delivery method</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: "door", label: "Door Delivery", desc: "Courier to your address" },
            { id: "locker", label: "Locker Collection", desc: "Collect from nearest TCG locker" },
          ].map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setDeliveryMethod(opt.id as "door" | "locker")}
              className={cn(
                "text-left p-5 rounded-2xl border transition",
                deliveryMethod === opt.id
                  ? "border-terracotta bg-terracotta/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sand font-medium">{opt.label}</span>
                <span className="text-terracotta font-display">
                  {formatPrice(DELIVERY_FEE)}
                </span>
              </div>
              <p className="text-xs text-sand/50 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>

        {deliveryMethod === "door" ? (
          <Textarea
            placeholder="Full delivery address (street, suburb, city, postal code)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            required
          />
        ) : (
          <div className="p-4 rounded-2xl bg-terracotta/10 border border-terracotta/30 text-sm text-sand/80">
            We&apos;ll send you the 3 closest TCG lockers via WhatsApp after
            checkout so you can choose the one that works best for you.
          </div>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
        >
          {error}
        </motion.p>
      )}

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3">
        <div className="flex justify-between text-sm text-sand/60">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-sand/60">
          <span>Delivery</span>
          <span>{formatPrice(DELIVERY_FEE)}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-white/5">
          <span className="text-sand">Total</span>
          <span className="text-terracotta font-display text-2xl">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={loading || items.length === 0}
        className="w-full"
      >
        {loading ? "Placing order..." : "Place Order"}
      </Button>
    </form>
  );
}
