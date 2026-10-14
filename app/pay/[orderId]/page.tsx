import { CheckCircle2 } from "lucide-react";
import { SiteNav } from "@/components/navigation/SiteNav";
import { BankTutorials } from "@/components/payment/BankTutorials";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatPrice } from "@/lib/utils";

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

export default async function PayPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen flex items-center justify-center px-6">
          <p className="text-sand/60">Order not found.</p>
        </main>
      </>
    );
  }

  const isPaid = ["paid", "shipped", "delivered"].includes(order.status);

  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pt-32 pb-28 lg:pt-40">
        <div className="max-w-2xl mx-auto space-y-12">
          {isPaid ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-terracotta/20 border border-terracotta/40">
                <CheckCircle2 className="text-terracotta" size={36} />
              </div>
              <h1 className="font-display text-5xl text-sand">
                Payment Received
              </h1>
              <p className="text-sand/60">
                Thank you. Your order is being prepared for shipping.
              </p>
            </div>
          ) : (
            <>
              <header className="space-y-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
                  Payment
                </p>
                <h1 className="font-display text-5xl md:text-6xl text-sand leading-tight">
                  Complete your order
                </h1>
                <p className="text-sand/60 max-w-xl mx-auto">
                  Use the details below to make your Payshap payment, then send
                  us a screenshot of the confirmation.
                </p>
              </header>

              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-xs uppercase tracking-widest text-sand/50">
                    Amount Due
                  </p>
                  <p className="font-display text-6xl text-terracotta leading-none">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="grid gap-4 pt-4 border-t border-white/5">
                  <CopyRow
                    label="Payshap Number"
                    value={process.env.NEXT_PUBLIC_PAYSHAP_NUMBER ?? ""}
                  />
                  <CopyRow label="Reference" value={order.payshapReference} />
                  <CopyRow label="Order ID" value={order.id} mono />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-2xl text-sand">
                  How it works
                </h3>
                <ol className="space-y-3 text-sm text-sand/70 list-decimal list-inside">
                  <li>Open your banking app.</li>
                  <li>
                    Choose Payshap and enter the number and reference above.
                  </li>
                  <li>Approve the payment.</li>
                  <li>
                    Send us the confirmation screenshot on WhatsApp — we&apos;ll
                    process your order same-day.
                  </li>
                </ol>
              </div>

              <BankTutorials />
            </>
          )}

          <p className="text-center text-xs uppercase tracking-[0.3em] text-sand/30 pt-8">
            Your beauty · Your crown · Your rules
          </p>
        </div>
      </main>
    </>
  );
}

function CopyRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-sand/40">
          {label}
        </p>
        <p
          className={
            "text-sand text-sm truncate " + (mono ? "font-mono text-xs" : "")
          }
        >
          {value}
        </p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}