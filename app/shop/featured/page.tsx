"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles, Music2 } from "lucide-react";
import { SiteNav } from "@/components/navigation/SiteNav";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductVariant } from "@/types";

export default function FeaturedPage() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/variants", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { variants: [] }))
      .then((d) => {
        const featured = (d.variants ?? []).filter(
          (v: ProductVariant) => v.isFeatured && !v.isHidden
        );
        setVariants(featured);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pt-32 pb-28 lg:pt-40">
        <div className="max-w-7xl mx-auto space-y-12">
          <Link
            href="/shop"
            className="hidden lg:inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-sand/20 text-sand/70 hover:border-sand/40 transition"
          >
            <ChevronLeft size={12} /> Back to Shop
          </Link>

          <header className="space-y-4 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-terracotta">
              <Music2 size={14} />
              Featured from TikTok
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-sand leading-tight">
              What you saw <span className="italic text-terracotta">on TikTok</span>
            </h1>
            <p className="text-sand/60">
              The exact wigs and hair pieces Kiara&apos;s been wearing — grab them
              while they&apos;re still in stock.
            </p>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : variants.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl space-y-3">
              <Sparkles size={28} className="mx-auto text-sand/30" />
              <p className="text-sand/60">
                Nothing featured yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {variants.map((v) => (
                <ProductCard key={v.id} variant={v} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}