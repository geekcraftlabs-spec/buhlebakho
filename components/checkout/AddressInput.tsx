/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, ChevronDown, Check, Search } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { PROVINCES, getProvinceByCode } from "@/lib/sa-geography";
import { cn } from "@/lib/utils";

export interface AddressDetails {
  formatted: string;
  street: string;
  suburb: string;
  town: string;
  province: string;
  postalCode: string;
}

export function AddressInput({
  onChange,
  onValidated,
}: {
  value?: string;
  onChange: (v: string) => void;
  onValidated: (details: AddressDetails) => void;
}) {
  const [mode, setMode] = useState<"structured" | "manual">("structured");

  // Structured fields
  const [street, setStreet] = useState("");
  const [suburb, setSuburb] = useState("");
  const [town, setTown] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Manual field
  const [manualAddress, setManualAddress] = useState("");

  // Town search
  const [townSearch, setTownSearch] = useState("");
  const [townPickerOpen, setTownPickerOpen] = useState(false);
  const townPickerRef = useRef<HTMLDivElement>(null);

  // Store callbacks in refs so effects don't depend on them
  const onChangeRef = useRef(onChange);
  const onValidatedRef = useRef(onValidated);

  useEffect(() => {
    onChangeRef.current = onChange;
    onValidatedRef.current = onValidated;
  });

  // Emit structured updates
  useEffect(() => {
    if (mode !== "structured") return;

    const parts = [
      street.trim(),
      suburb.trim(),
      town,
      province,
      postalCode,
    ].filter(Boolean);
    const formatted = parts.join(", ");

    onChangeRef.current(formatted);
    onValidatedRef.current({
      formatted,
      street: street.trim(),
      suburb: suburb.trim(),
      town,
      province,
      postalCode,
    });
  }, [street, suburb, town, province, postalCode, mode]);

  // Emit manual updates
  useEffect(() => {
    if (mode !== "manual") return;

    onChangeRef.current(manualAddress);
    onValidatedRef.current({
      formatted: manualAddress,
      street: manualAddress,
      suburb: "",
      town: "",
      province: "",
      postalCode: "",
    });
  }, [manualAddress, mode]);

  // Close town picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        townPickerRef.current &&
        !townPickerRef.current.contains(e.target as Node)
      ) {
        setTownPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const availableTowns = province
    ? getProvinceByCode(province)?.towns ?? []
    : [];

  const filteredTowns = townSearch.trim()
    ? availableTowns.filter((t) =>
        t.toLowerCase().includes(townSearch.toLowerCase().trim())
      )
    : availableTowns;

  const structuredComplete =
    street.trim() &&
    town &&
    province &&
    postalCode.trim() &&
    /^\d{4}$/.test(postalCode.trim());

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
          <button
            type="button"
            onClick={() => setMode("structured")}
            className={cn(
              "text-xs uppercase tracking-widest px-3 py-1.5 rounded-full transition",
              mode === "structured"
                ? "bg-terracotta text-white"
                : "text-sand/60 hover:text-sand"
            )}
          >
            Select
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={cn(
              "text-xs uppercase tracking-widest px-3 py-1.5 rounded-full transition",
              mode === "manual"
                ? "bg-terracotta text-white"
                : "text-sand/60 hover:text-sand"
            )}
          >
            Type Manually
          </button>
        </div>

        <button
          type="button"
          className="text-sand/40 hover:text-sand/70 transition"
          title="We'll be launching Google address autofill on 1 September 2026. For now, please select your province, town, and type your street address."
        >
          <Info size={16} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "structured" ? (
          <motion.div
            key="structured"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-3"
          >
            <Input
              placeholder="Street address (e.g. 23 Main Road)"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <Input
              placeholder="Suburb (optional)"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <select
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    setTown("");
                    setTownSearch("");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sand text-sm appearance-none cursor-pointer focus:outline-none focus:border-terracotta transition"
                >
                  <option value="" className="bg-espresso">
                    Select province...
                  </option>
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code} className="bg-espresso">
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sand/40 pointer-events-none"
                />
              </div>

              <div ref={townPickerRef} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    province && setTownPickerOpen(!townPickerOpen)
                  }
                  disabled={!province}
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left text-sm flex items-center justify-between transition",
                    !province
                      ? "text-sand/30 cursor-not-allowed"
                      : town
                        ? "text-sand"
                        : "text-sand/50 cursor-pointer hover:border-white/20",
                    townPickerOpen && "border-terracotta"
                  )}
                >
                  <span className="truncate">
                    {town || "Select town / city..."}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-sand/40 transition-transform shrink-0",
                      townPickerOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {townPickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-espresso border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-30 max-h-72 flex flex-col"
                    >
                      <div className="relative border-b border-white/10">
                        <Search
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-sand/40"
                        />
                        <input
                          type="text"
                          placeholder="Search towns..."
                          value={townSearch}
                          onChange={(e) => setTownSearch(e.target.value)}
                          className="w-full bg-transparent px-10 py-3 text-sm text-sand placeholder:text-sand/40 focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="overflow-y-auto">
                        {filteredTowns.length === 0 && (
                          <p className="px-4 py-6 text-center text-xs text-sand/40">
                            No towns match.
                          </p>
                        )}
                        {filteredTowns.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setTown(t);
                              setTownSearch("");
                              setTownPickerOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2",
                              t === town
                                ? "bg-terracotta/10 text-terracotta"
                                : "text-sand/80 hover:bg-white/5 hover:text-sand"
                            )}
                          >
                            {t === town && <Check size={12} />}
                            {t}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Input
              placeholder="Postal code (e.g. 2001)"
              value={postalCode}
              onChange={(e) =>
                setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              inputMode="numeric"
              maxLength={4}
            />

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-start gap-3">
              <Info size={14} className="text-terracotta shrink-0 mt-0.5" />
              <p className="text-xs text-sand/50 leading-relaxed">
                We&apos;ll be launching an address autofill feature on{" "}
                  <span className="text-sand/70">25 November 2026</span>. For
                now, please select from the dropdowns and type your street
                address.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-3"
          >
            <Textarea
              placeholder="Street address, suburb, town, province, postal code"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              rows={4}
            />

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-sand/40 mb-1.5">
                Please format like this
              </p>
              <p className="text-xs text-sand/50 italic">
                23 Main Road, Rosebank, Johannesburg, Gauteng, 2196
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {((mode === "structured" && structuredComplete) ||
        (mode === "manual" && manualAddress.trim().length > 10)) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 space-y-1"
        >
          <p className="text-[10px] uppercase tracking-widest text-green-400 flex items-center gap-1.5">
            <Check size={10} /> This is where we&apos;ll deliver to
          </p>
          <p className="text-sm text-sand/90 font-mono">
            {mode === "structured"
              ? [street.trim(), suburb.trim(), town, province, postalCode]
                  .filter(Boolean)
                  .join(", ")
              : manualAddress.trim()}
          </p>
        </motion.div>
      )}
    </div>
  );
}