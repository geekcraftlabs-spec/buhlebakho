/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { DELIVERY_FEE } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AddressInput } from "./AddressInput";

interface AddressDetails {
  formatted: string;
  street: string;
  suburb: string;
  town: string;
  province: string;
  postalCode: string;
}

export function CheckoutForm() {
  const { items } = useCartStore();
  const subtotal = useCartSubtotal();
  const total = subtotal + DELIVERY_FEE;

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [smsNumber, setSmsNumber] = useState("");
  const [sameAsWhatsApp, setSameAsWhatsApp] = useState(true);
  const [address, setAddress] = useState("");
  const [addressComponents, setAddressComponents] =
    useState<AddressDetails | null>(null);
  const [unitNumber, setUnitNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSms = sameAsWhatsApp ? whatsapp : smsNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your full name.");
    if (whatsapp.length !== 9)
      return setError("WhatsApp number must be 9 digits (e.g. 831234567).");
    if (!sameAsWhatsApp && effectiveSms.length !== 9)
      return setError("SMS number must be 9 digits.");
    if (!addressComponents || !addressComponents.formatted.trim())
      return setError("Please complete your delivery address.");
    if (items.length === 0) return setError("Your bag is empty.");

    // Final address includes unit number if provided
    const finalAddress = unitNumber.trim()
      ? `${addressComponents.formatted}, Unit ${unitNumber.trim()}`
      : addressComponents.formatted;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          smsNumber: effectiveSms,
          address: finalAddress,
          addressComponents: {
            streetNumber: addressComponents.street,
            route: addressComponents.street,
            suburb: addressComponents.suburb,
            city: addressComponents.town,
            province: addressComponents.province,
            postalCode: addressComponents.postalCode,
          },
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed.");

      // Cart will be cleared on thank-you page
      window.location.href = data.redirectUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl text-sand">Your details</h2>
        <Input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* WhatsApp */}
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-sand/50">
          WhatsApp Number
        </h3>
        <div className="flex items-stretch gap-2">
          <div className="flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-sand/60 text-sm shrink-0">
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
        <p className="text-xs text-sand/40">
          We&apos;ll send order updates here.
        </p>
      </div>

      {/* SMS */}
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-sand/50">
          SMS Number (for courier tracking)
        </h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sameAsWhatsApp}
            onChange={(e) => setSameAsWhatsApp(e.target.checked)}
            className="w-4 h-4 accent-terracotta"
          />
          <span className="text-sm text-sand/80">
            Same as my WhatsApp number
          </span>
        </label>

        {!sameAsWhatsApp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-stretch gap-2"
          >
            <div className="flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-sand/60 text-sm shrink-0">
              +27
            </div>
            <Input
              placeholder="831234567"
              value={smsNumber}
              onChange={(e) =>
                setSmsNumber(e.target.value.replace(/\D/g, "").slice(0, 9))
              }
              inputMode="numeric"
              maxLength={9}
            />
          </motion.div>
        )}

        <p className="text-xs text-sand/40 flex items-start gap-1.5">
          <span className="text-amber-400 shrink-0">⚠</span>
          <span>
            The Courier Guy sends your tracking number via SMS. Make sure this
            number can receive SMS.
          </span>
        </p>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl text-sand">Delivery address</h2>

        <AddressInput
          onChange={setAddress}
          onValidated={(details) => setAddressComponents(details)}
        />

        {addressComponents && addressComponents.formatted.trim() && (
          <Input
            placeholder="Unit / apartment number (optional)"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
          />
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

      {/* Summary */}
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
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Redirecting to
            payment...
          </>
        ) : (
          <>
            <Lock size={16} /> Pay {formatPrice(total)}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-sand/40">
        Secure payment via Yoco
      </p>
    </form>
  );
}