/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { use, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Home } from "lucide-react";
import { SiteNav } from "@/components/navigation/SiteNav";
import { ProductCard } from "@/components/shop/ProductCard";
import { NotifyForm } from "@/components/shop/NotifyForm";
import { CategoryFilter, ShopFilterState } from "@/components/shop/CategoryFilter";
import { SortDropdown, SortOption } from "@/components/shop/SortDropdown";
import { DeliveryButton } from "@/components/shop/DeliveryButton";
import { getCategoryMeta, PLACEHOLDER_IMAGE } from "@/lib/catalog";
import { HairType, ProductVariant } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_IDS: HairType[] = [
  "human-blend",
  "futura-fibre",
  "custom-human-hair",
];

function sortVariants(
  variants: ProductVariant[],
  sort: SortOption
): ProductVariant[] {
  const arr = [...variants];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "size-asc":
      return arr.sort(
        (a, b) => (parseInt(a.sizeLabel) || 0) - (parseInt(b.sizeLabel) || 0)
      );
    case "size-desc":
      return arr.sort(
        (a, b) => (parseInt(b.sizeLabel) || 0) - (parseInt(a.sizeLabel) || 0)
      );
    case "featured":
    default:
      return arr;
  }
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const hairType = category as HairType;
  const meta = getCategoryMeta(hairType);

  const [filters, setFilters] = useState<ShopFilterState>({
    laceType: "all",
    texture: "all",
  });
  const [sort, setSort] = useState<SortOption>("featured");
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all variants from DB on mount, filter to this category
  useEffect(() => {
    if (!CATEGORY_IDS.includes(hairType)) return;

    const load = async () => {
      try {
        const res = await fetch("/api/variants", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const all: ProductVariant[] = data.variants ?? [];
          setVariants(all.filter((v) => v.hairType === hairType));
        }
      } catch (err) {
        console.error("[category] load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [hairType]);

  const filtered = useMemo(() => {
    const base = variants
      .filter((v) => !v.isHidden)
      .filter(
        (v) => filters.laceType === "all" || v.laceType === filters.laceType
      )
      .filter(
        (v) => filters.texture === "all" || v.texture === filters.texture
      );
    return sortVariants(base, sort);
  }, [variants, filters, sort]);

  const inStock = filtered.filter((v) => v.stockCount > 0);
  const soldOut = filtered.filter((v) => v.stockCount === 0);

  if (!meta || !CATEGORY_IDS.includes(hairType)) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-sand/60">That category doesn&apos;t exist.</p>
          <Link
            href="/shop"
            className="text-terracotta text-sm uppercase tracking-widest hover:gap-4 inline-flex items-center gap-2 transition-all"
          >
            <ChevronLeft size={14} /> Back to shop
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pt-32 pb-28 lg:pt-40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="hidden lg:flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-sand/20 text-sand/70 hover:border-sand/40 transition"
            >
              <Home size={12} /> Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-sand/20 text-sand/70 hover:border-sand/40 transition"
            >
              <ChevronLeft size={12} /> Categories
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <p
                className="text-xs uppercase tracking-[0.35em]"
                style={{ color: meta.accentColor }}
              >
                {meta.tagline}
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-sand leading-tight">
                {meta.name}
              </h1>
              <p className="text-sand/60 leading-relaxed max-w-lg">
                {meta.description}
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10">
              <Image
                src={meta.heroImage}
                alt={meta.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <CategoryFilter
              filters={filters}
              onChange={setFilters}
              showLace={hairType !== "custom-human-hair"}
            />
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <p className="text-xs uppercase tracking-widest text-sand/40">
                {inStock.length} {inStock.length === 1 ? "item" : "items"}{" "}
                available
              </p>
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : inStock.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inStock.map((v) => (
                <ProductCard key={v.id} variant={v} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
              <p className="text-sand/60">
                No products match these filters right now.
              </p>
            </div>
          )}

          {soldOut.length > 0 && (
            <section className="pt-12 border-t border-white/10 space-y-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-sand/40">
                  Restocking soon
                </p>
                <h2 className="font-display text-3xl text-sand">
                  Out of stock — notify me
                </h2>
                <p className="text-sand/50 text-sm max-w-xl">
                  Enter your WhatsApp number and we&apos;ll let you know the
                  moment it&apos;s back in stock.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {soldOut.map((v) => (
                  <NotifyForm key={v.id} variant={v} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}