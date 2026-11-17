/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Package,
  Save,
  Eye,
  EyeOff,
  History,
  Search,
  X,
  Plus,
  Star,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CATEGORIES, COLOR_SWATCHES, getTextureLabel } from "@/lib/catalog";
import { HairType, ProductVariant } from "@/types";
import { cn, formatPrice } from "@/lib/utils";

export default function InventoryPage() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHairType, setActiveHairType] = useState<HairType>("futura-fibre");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/variants", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setVariants(Array.isArray(data.variants) ? data.variants : []);
      }
    } catch (err) {
      console.error("[inventory] load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return variants
      .filter((v) => v.hairType === activeHairType)
      .filter(
        (v) =>
          !q ||
          v.colorName.toLowerCase().includes(q) ||
          v.colorCode.toLowerCase().includes(q) ||
          v.sizeLabel.toLowerCase().includes(q) ||
          getTextureLabel(v.texture).toLowerCase().includes(q) ||
          v.laceType.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        if (a.isHidden !== b.isHidden) return a.isHidden ? 1 : -1;
        return a.colorCode.localeCompare(b.colorCode);
      });
  }, [variants, activeHairType, search]);

  const stats = useMemo(() => {
    const inStock = filtered.filter((v) => v.stockCount > 0 && !v.isHidden).length;
    const soldOut = filtered.filter((v) => v.stockCount === 0 && !v.isHidden).length;
    const hidden = filtered.filter((v) => v.isHidden).length;
    const totalUnits = filtered.reduce((s, v) => s + v.stockCount, 0);
    return { inStock, soldOut, hidden, totalUnits };
  }, [filtered]);

  const editing = editingId ? variants.find((v) => v.id === editingId) : null;

  const toggleHidden = async (v: ProductVariant) => {
    await fetch(`/api/admin/variants/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: !v.isHidden }),
    });
    refresh();
  };

  const toggleFeatured = async (v: ProductVariant) => {
    await fetch(`/api/admin/variants/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !v.isFeatured }),
    });
    refresh();
  };

  const deleteVariant = async (v: ProductVariant) => {
    if (
      !confirm(
        `Delete ${getTextureLabel(v.texture)} ${v.colorName} ${v.sizeLabel}?`
      )
    )
      return;
    await fetch(`/api/admin/variants/${v.id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2.5 rounded-full border border-sand/20 text-sand/70 hover:border-terracotta/40 hover:text-sand transition"
          >
            <ChevronLeft size={14} /> Dashboard
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
              Admin
            </p>
            <h1 className="font-display text-4xl text-sand leading-none mt-1">
              Inventory
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/variants/new">
            <Button size="sm">
              <Plus size={14} /> Add New
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={refresh}>
            <History size={14} /> Refresh
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const count = variants.filter((v) => v.hairType === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveHairType(cat.id)}
              className={cn(
                "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition flex items-center gap-2",
                activeHairType === cat.id
                  ? "bg-terracotta border-terracotta text-white"
                  : "border-white/15 text-sand/60 hover:border-terracotta/50"
              )}
            >
              {cat.shortName}
              <span
                className={cn(
                  "text-[10px] rounded-full px-1.5 py-0.5",
                  activeHairType === cat.id ? "bg-white/20" : "bg-white/5"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "In Stock", value: stats.inStock, tone: "text-green-400" },
          { label: "Sold Out", value: stats.soldOut, tone: "text-amber-400" },
          { label: "Hidden", value: stats.hidden, tone: "text-sand/60" },
          { label: "Total Units", value: stats.totalUnits, tone: "text-terracotta" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
          >
            <p className="text-xs uppercase tracking-widest text-sand/40">
              {s.label}
            </p>
            <p className={cn("font-display text-3xl mt-2", s.tone)}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sand/40"
        />
        <Input
          placeholder="Search by color, size, texture, lace..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sand/40 hover:text-sand"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {loading && (
          <div className="text-center py-20 text-sand/50">Loading...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <Package size={28} className="mx-auto text-sand/30 mb-3" />
            <p className="text-sand/50">No variants yet.</p>
          </div>
        )}

        {filtered.map((v) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-white/[0.03] border rounded-2xl p-4 space-y-3",
              v.isFeatured ? "border-terracotta/40" : "border-white/10",
              v.isHidden && "opacity-50"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl border border-white/10 shrink-0"
                style={{
                  backgroundColor: COLOR_SWATCHES[v.colorCode] ?? "#888",
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sand text-sm font-medium leading-tight">
                  {getTextureLabel(v.texture)} · {v.laceType}
                </p>
                <p className="text-xs text-sand/50 mt-1">
                  {v.colorName} ({v.colorCode}) · {v.sizeLabel}
                </p>
                <p className="text-terracotta font-display text-lg mt-1 leading-none">
                  {formatPrice(v.price)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-sand/40">
                  Stock
                </p>
                <p
                  className={cn(
                    "font-display text-2xl leading-none",
                    v.stockCount === 0
                      ? "text-red-400"
                      : v.stockCount <= 5
                        ? "text-amber-400"
                        : "text-green-400"
                  )}
                >
                  {v.stockCount}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 pt-2 border-t border-white/5">
              <button
                onClick={() => toggleFeatured(v)}
                title={v.isFeatured ? "Unfeature" : "Feature"}
                className={cn(
                  "w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center transition",
                  v.isFeatured
                    ? "text-terracotta bg-terracotta/10"
                    : "text-sand/30 hover:text-terracotta"
                )}
              >
                <Star size={14} fill={v.isFeatured ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => toggleHidden(v)}
                title={v.isHidden ? "Unhide" : "Hide"}
                className={cn(
                  "w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center transition",
                  v.isHidden
                    ? "text-sand/30 hover:text-sand/60"
                    : "text-sand/60 hover:text-terracotta"
                )}
              >
                {v.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => setEditingId(v.id)}
                className="px-3 h-9 rounded-lg border border-terracotta/40 text-terracotta text-xs uppercase tracking-widest hover:bg-terracotta/10"
              >
                Edit
              </button>
              <button
                onClick={() => deleteVariant(v)}
                className="w-9 h-9 rounded-lg border border-white/10 text-sand/40 hover:text-red-400 hover:border-red-400/40 flex items-center justify-center"
                title="Delete"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center shadow-2xl shadow-terracotta/30 hover:bg-terracotta/90 transition"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <AnimatePresence>
        {editing && (
          <EditVariantModal
            variant={editing}
            onClose={() => setEditingId(null)}
            onSaved={() => {
              refresh();
              setEditingId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditVariantModal({
  variant,
  onClose,
  onSaved,
}: {
  variant: ProductVariant;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [price, setPrice] = useState(String(variant.price));
  const [salePrice, setSalePrice] = useState(
    variant.salePrice ? String(variant.salePrice) : ""
  );
  const [stock, setStock] = useState(String(variant.stockCount));

  const handleSave = async () => {
    const p = parseInt(price, 10);
    const sp = salePrice.trim() ? parseInt(salePrice, 10) : null;
    const s = parseInt(stock, 10);
    if (isNaN(p) || p < 0) return;
    if (isNaN(s) || s < 0) return;

    await fetch(`/api/admin/variants/${variant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: p, salePrice: sp, stockCount: s }),
    });
    onSaved();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:right-auto bg-espresso border border-white/10 rounded-t-3xl lg:rounded-3xl z-50 p-6 space-y-5 w-full max-w-lg lg:max-w-md"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-terracotta">
            Editing Variant
          </p>
          <h2 className="font-display text-2xl text-sand mt-1">
            {getTextureLabel(variant.texture)} · {variant.laceType}
          </h2>
          <p className="text-sm text-sand/50 mt-0.5">
            {variant.colorName} ({variant.colorCode}) · {variant.sizeLabel}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">
              Price (R)
            </label>
            <Input
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">
              Sale Price (optional)
            </label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Leave empty for no sale"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">
              Stock Count
            </label>
            <Input
              type="number"
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <p className="text-xs text-sand/40 mt-2">
              Set to 0 to mark as sold out
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save size={14} /> Save
          </Button>
        </div>
      </motion.div>
    </>
  );
}