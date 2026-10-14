import { SiteNav } from "@/components/navigation/SiteNav";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Checkout | Buhle Bakho",
};

export default function CheckoutPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pt-32 pb-28 lg:pt-40">
        <div className="max-w-2xl mx-auto space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
              Almost there
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-sand leading-tight">
              Checkout
            </h1>
            <p className="text-sand/60">
              Same-day processing · 2-3 day delivery nationwide
            </p>
          </header>

          <CheckoutForm />
        </div>
      </main>
    </>
  );
}