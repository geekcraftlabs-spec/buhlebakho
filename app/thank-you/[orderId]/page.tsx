import Link from "next/link";
import { CheckCircle2, Clock, Truck } from "lucide-react";
import { SiteNav } from "@/components/navigation/SiteNav";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { DELIVERY_FEE } from "@/lib/data";

async function getOrder(id: string) {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${base}/api/public/order/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  const firstName = order?.name?.split(" ")[0] ?? "Queen";

  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pt-32 pb-28 lg:pt-40">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-terracotta/20 border border-terracotta/40">
              <CheckCircle2 className="text-terracotta" size={36} />
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-5xl md:text-6xl text-sand leading-tight">
                Thank you, {firstName}
              </h1>
              <p className="text-sand/60">
                Your order is in. We&apos;ll be with you on WhatsApp within the
                hour.
              </p>
            </div>
          </div>

          {order && (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-sand/50">Order ID</span>
                <span className="text-sand font-mono text-xs">{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sand/50">Total</span>
                <span className="text-terracotta font-display text-xl">
                  {formatPrice(order.total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sand/50">Delivery</span>
                <span className="text-sand">
                  {order.deliveryMethod === "door"
                    ? "Door Delivery"
                    : "Locker Collection"}
                  {" · "}
                  {formatPrice(DELIVERY_FEE)}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Clock,
                title: "Within the hour",
                desc: "We'll WhatsApp you your Payshap details.",
              },
              {
                icon: CheckCircle2,
                title: "Send proof of payment",
                desc: "Reply with a screenshot once paid.",
              },
              {
                icon: Truck,
                title: "2-3 days delivery",
                desc: "Tracked Courier Guy shipping nationwide.",
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3"
                >
                  <Icon size={20} className="text-terracotta" />
                  <div>
                    <p className="text-sand font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-sand/50 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-6">
            <Link href="/shop">
              <Button variant="secondary">Continue Shopping</Button>
            </Link>
          </div>

          <p className="text-center text-xs uppercase tracking-[0.3em] text-sand/30 pt-8">
            Your beauty · Your crown · Your rules
          </p>
        </div>
      </main>
    </>
  );
}