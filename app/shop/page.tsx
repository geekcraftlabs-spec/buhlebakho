import { SiteNav } from "@/components/navigation/SiteNav";
import { ShopContent } from "@/components/shop/ShopContent";

export const metadata = {
  title: "Shop | Buhle Bakho",
  description: "Browse our full collection of premium wigs.",
};

export default function ShopPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pt-32 pb-28 lg:pt-40">
        <div className="max-w-7xl mx-auto space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
              The Collection
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-sand leading-tight">
              Find your crown
            </h1>
            <p className="text-sand/60 max-w-xl mx-auto">
              Every piece is premium human hair, pre-styled, and ready to wear.
            </p>
          </header>

          <ShopContent />
        </div>
      </main>
    </>
  );
}