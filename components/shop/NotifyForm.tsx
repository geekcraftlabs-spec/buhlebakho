"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductVariant } from "@/types";
import { getTextureLabel } from "@/lib/catalog";
import { addToWaitlist } from "@/lib/waitlist";

export function NotifyForm({ variant }: { variant: ProductVariant }) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 9) {
      setError("Please enter a valid phone number");
      return;
    }
    const normalized = clean.startsWith("0") ? clean : `0${clean}`;

    addToWaitlist({
      variantId: variant.id,
      phone: normalized,
      variantSnapshot: {
        productName: `${getTextureLabel(variant.texture)} ${
          variant.hairType === "futura-fibre" ? "Futura" : "Human Blend"
        }`,
        colorName: variant.colorName,
        colorCode: variant.colorCode,
        sizeLabel: variant.sizeLabel,
        laceType: variant.laceType,
        texture: variant.texture,
        hairType: variant.hairType,
      },
    });

    setSubmitted(true);
    setError(null);
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Bell size={16} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sand text-sm">
            {getTextureLabel(variant.texture)} · {variant.laceType}
          </p>
          <p className="text-xs text-sand/50 mt-0.5">
            {variant.colorName} · {variant.sizeLabel}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-green-400 bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3"
          >
            <Check size={16} />
            We&apos;ll WhatsApp you when it&apos;s back in stock
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <div className="flex items-stretch gap-2 flex-1">
                <div className="flex items-center px-3 bg-white/5 border border-white/10 rounded-xl text-sand/60 text-sm shrink-0">
                  +27
                </div>
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="831234567"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 9));
                    setError(null);
                  }}
                  className="flex-1"
                />
              </div>
              <Button onClick={handleSubmit} disabled={phone.length !== 9}>
                Notify
              </Button>
            </div>
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <X size={10} /> {error}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}