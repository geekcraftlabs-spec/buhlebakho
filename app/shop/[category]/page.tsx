/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { use, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Home } from "lucide-react";
import { SiteNav } from "@/components/navigation/SiteNav";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryFilter, ShopFilterState } from "@/components/shop/CategoryFilter";
import { SortDropdown, SortOption } from "@/components/shop/SortDropdown";
import { getVariantsByHairType } from "@/lib/inventory";
import { getCategoryMeta, PLACEHOLDER_IMAGE, getSizeGroup } from "@/lib/catalog";
import { HairType, ProductVariant } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_IDS: HairType[] = [
  "human-blend",
  "futura-fibre",
  "custom-human-hair",
];

// Sort helper — sorts by size in inches when possible
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
      return arr.sort((a, b) => {
        const sa = parseInt(a.sizeLabel) || 0;
        const sb = parseInt(b.sizeLabel) || 0;
        return sa - sb;
      });
    case "size-desc":
      return arr.sort((a, b) => {
        const sa = parseInt(a.sizeLabel) || 0;
        const sb = parseInt(b.sizeLabel) || 0;
        return sb - sa;
      });
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

  useEffect(() => {
    if (!CATEGORY_IDS.includes(hairType)) return;
    setVariants(getVariantsByHairType(hairType));
  }, [hairType]);

  const filtered = useMemo(() => {
    const base = variants
      .filter((v) => !v.isHidden)
      .filter((v) => filters.laceType === "all" || v.laceType === filters.laceType)
      .filter((v) => filters.texture === "all" || v.texture === filters.texture);
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
          {/* Top nav pills */}
          <div className="flex flex-wrap gap-2">
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

          {/* Category hero */}
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

          {/* Filters + Sort row */}
          <div className="space-y-4">
            <CategoryFilter
              filters={filters}
              onChange={setFilters}
              showLace={hairType !== "custom-human-hair"}
            />

            {/* Sort — visually separated */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <p className="text-xs uppercase tracking-widest text-sand/40">
                {inStock.length} {inStock.length === 1 ? "item" : "items"} available
              </p>
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>

          {/* In-stock products */}
          {inStock.length > 0 ? (
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

          {/* Sold out / notify section */}
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
                  <div
                    key={v.id}
                    className={cn(
                      "flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4",
                      "opacity-70"
                    )}
                  >
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <span className="text-[10px] uppercase tracking-widest text-sand/40 text-center leading-tight px-1">
                        {v.laceType}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sand text-sm">
                        {v.colorName} · {v.sizeLabel}
                      </p>
                      <p className="text-xs text-sand/40">
                        Notify form coming soon
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}