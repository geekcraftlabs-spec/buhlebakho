import Link from "next/link";
import { Home } from "lucide-react";
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
          {/* Top nav pills — desktop only (mobile has the bottom dock) */}
          <div className="hidden lg:flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-sand/20 text-sand/70 hover:border-sand/40 transition"
            >
              <Home size={12} /> Home
            </Link>
          </div>

          <header className="space-y-4 text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.35em] text-terracotta">
              The Shop
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-sand leading-tight">
              Choose your <span className="italic text-terracotta">crown</span>
            </h1>
            <p className="text-sand/60 leading-relaxed">
              Three collections. One promise — same-day processing and
              2-3 day delivery, every time.
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