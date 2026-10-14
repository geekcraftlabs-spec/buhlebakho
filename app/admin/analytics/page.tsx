"use client";

import { useEffect, useState } from "react";
import { Flower2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";

interface Order {
  id: string;
  name: string;
  total: number;
  status: string;
  createdAt: string;
  items: CartItem[];
}

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      });
  }, []);

  const delivered = orders.filter((o) => o.status === "delivered");
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const avgOrder = delivered.length > 0 ? totalRevenue / delivered.length : 0;

  const productCounts: Record<string, number> = {};
  orders.forEach((o) =>
    o.items.forEach((i) => {
      productCounts[i.productName] =
        (productCounts[i.productName] || 0) + i.quantity;
    })
  );
  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-sand/50">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-terracotta/20 border border-terracotta/40 flex items-center justify-center">
          <Flower2 className="text-terracotta" size={22} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
            Analytics
          </p>
          <h1 className="font-display text-4xl text-sand leading-none mt-1">
            Performance
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Delivered", value: delivered.length },
          { label: "Revenue", value: formatPrice(totalRevenue) },
          { label: "Avg Order", value: formatPrice(Math.round(avgOrder)) },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
          >
            <p className="text-xs uppercase tracking-widest text-sand/40">
              {s.label}
            </p>
            <p className="font-display text-3xl text-terracotta mt-2">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-sand">Top Products</h2>
        {topProducts.length === 0 ? (
          <p className="text-sand/50 text-sm">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {topProducts.map(([name, count]) => (
              <div
                key={name}
                className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3"
              >
                <span className="text-sand text-sm">{name}</span>
                <span className="text-terracotta font-display text-xl">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}