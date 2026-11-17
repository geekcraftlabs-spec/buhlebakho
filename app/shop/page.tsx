import Link from "next/link";
import { Home, Music2, ChevronRight } from "lucide-react";
import { SiteNav } from "@/components/navigation/SiteNav";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { CATEGORIES } from "@/lib/catalog";

export const metadata = {
  title: "Shop | Buhle Bakho",
  description:
    "Browse our three hair categories — human blends, Futura fibres, and custom human hair.",
};

export default function ShopPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pt-32 pb-28 lg:pt-40">
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Top nav pills — desktop only */}
          <div className="hidden lg:flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-sand/20 text-sand/70 hover:border-sand/40 transition"
            >
              <Home size={12} /> Home
            </Link>
          </div>

          {/* Featured from TikTok pill */}
          <Link
            href="/shop/featured"
            className="group flex items-center justify-between gap-4 bg-gradient-to-r from-terracotta/15 via-terracotta/5 to-transparent border border-terracotta/40 rounded-2xl p-4 md:p-5 hover:border-terracotta transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-terracotta/20 border border-terracotta/40 flex items-center justify-center shrink-0">
                <Music2 size={18} className="text-terracotta" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-terracotta">
                  Featured from TikTok
                </p>
                <p className="text-sand text-sm md:text-base font-medium">
                  What you saw her wearing
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-terracotta group-hover:translate-x-1 transition-transform shrink-0"
            />
          </Link>

          <header className="space-y-4 text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.35em] text-terracotta">
              The Shop
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-sand leading-tight">
              Choose your{" "}
              <span className="italic text-terracotta">crown</span>
            </h1>
            <p className="text-sand/60 leading-relaxed">
              Three collections. One promise — next-day processing and 2-3 day
              delivery, every time.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((category, i) => (
              <CategoryCard key={category.id} category={category} index={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}