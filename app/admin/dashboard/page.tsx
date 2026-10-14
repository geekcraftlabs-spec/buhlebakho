/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  LogOut,
  MessageCircle,
  Send,
  Truck,
  Flower2,
  Clock,
  CheckCircle2,
  Package,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice, cn } from "@/lib/utils";
import { CartItem } from "@/types";

interface Order {
  id: string;
  name: string;
  whatsapp: string;
  deliveryMethod: string;
  address: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  payshapReference: string;
  createdAt: string;
  waybill: string | null;
}

interface Stats {
  pending: number;
  paymentSent: number;
  paid: number;
  thisMonthRevenue: number;
}

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "payment_sent", label: "Awaiting Proof" },
  { id: "paid", label: "Paid" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];

const BUSINESS_NAME = "Buhle Bakho";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-sand/10 text-sand/70 border-sand/20",
  payment_sent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  paid: "bg-terracotta/15 text-terracotta border-terracotta/40",
  shipped: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  delivered: "bg-green-500/10 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState("pending");
  const [waybills, setWaybills] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        console.error("[dashboard] fetch failed:", res.status, text);
        setLoadError(`Could not load orders (${res.status})`);
        return;
      }
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setStats(data.stats ?? null);
      setLoadError(null);
    } catch (err) {
      console.error("[dashboard] load error:", err);
      setLoadError("Could not reach the server. Check your connection.");
    }
  }, [router]);

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  const updateStatus = async (id: string, status: string, waybill?: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, waybill }),
    });
    load();
  };

  const openWhatsApp = (phone: string, text: string) => {
    const clean = phone.replace(/\D/g, "");
    window.open(
      `https://wa.me/${clean}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const sendPaymentDetails = (order: Order) => {
    const origin = "https://buhlebakho.co.za";
    const msg = `Hi ${order.name.split(" ")[0]}! Thank you for shopping with ${BUSINESS_NAME} 🖤

Your order *${order.id}* total is *${formatPrice(order.total)}*.

To complete your payment, please click this link to easily copy your Payshap details:
${origin}/pay/${order.id}

Once paid, kindly send us a screenshot of your proof of payment here on WhatsApp.

Order processing: same-day · Delivery: 2-3 business days nationwide.`;
    openWhatsApp(order.whatsapp, msg);
    updateStatus(order.id, "payment_sent");
  };

  const sendTracking = (order: Order) => {
    const waybill = waybills[order.id] || "";
    if (!waybill.trim()) return;
    const msg = `Hi ${order.name.split(" ")[0]}! Great news 🎉

Your order *${order.id}* has been shipped!

Track your parcel here:
${waybill}

Delivery is expected within 2-3 business days. We can't wait for you to receive your crown! 👑`;
    openWhatsApp(order.whatsapp, msg);
    updateStatus(order.id, "shipped", waybill);
  };

  const filtered =
    tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-terracotta/20 border border-terracotta/40 flex items-center justify-center">
            <Flower2 className="text-terracotta" size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
              Admin
            </p>
            <h1 className="font-display text-4xl text-sand leading-none mt-1">
              Buhle Bakho
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={load}
            className="text-sand/60 hover:text-sand"
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.push("/admin/login");
            }}
          >
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </header>

      {loadError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-sm text-red-400">
          ⚠ {loadError}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Awaiting Proof", value: stats.paymentSent, icon: Send },
            { label: "Paid", value: stats.paid, icon: CheckCircle2 },
            {
              label: "This Month",
              value: formatPrice(stats.thisMonthRevenue),
              icon: TrendingUp,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-sand/40">
                    {s.label}
                  </p>
                  <Icon size={16} className="text-terracotta/60" />
                </div>
                <p className="font-display text-3xl text-terracotta leading-none">
                  {s.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count =
            t.id === "all"
              ? orders.length
              : orders.filter((o) => o.status === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition flex items-center gap-2",
                tab === t.id
                  ? "bg-terracotta border-terracotta text-white"
                  : "border-white/15 text-sand/60 hover:border-terracotta/50"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "text-[10px] rounded-full px-1.5 py-0.5",
                  tab === t.id ? "bg-white/20" : "bg-white/5"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <Package size={28} className="mx-auto text-sand/30 mb-3" />
            <p className="text-sand/50">No orders here yet.</p>
          </div>
        )}

        {filtered.map((order) => {
          const isOpen = expanded === order.id;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="w-full flex flex-wrap items-center justify-between gap-4 p-5 text-left hover:bg-white/[0.02] transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sand font-medium">{order.name}</p>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border",
                        STATUS_STYLES[order.status] || STATUS_STYLES.pending
                      )}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-sand/50 mt-1">
                    {order.whatsapp} · {order.deliveryMethod} ·{" "}
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-[10px] font-mono text-sand/30 mt-1">
                    {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-terracotta leading-none">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-[10px] text-sand/40 mt-1">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </p>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/5 p-5 space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-sand/40 mb-3">
                      Items
                    </p>
                    <div className="space-y-2">
                      {order.items.map((it, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-white/[0.02] rounded-xl px-4 py-2.5 text-sm"
                        >
                          <div>
                            <span className="text-sand">{it.productName}</span>
                            <span className="text-sand/40 ml-2 text-xs">
                              {it.color} · {it.size}&quot; · {it.rangeLabel}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sand">
                              ×{it.quantity} ·{" "}
                              <span className="text-terracotta">
                                {formatPrice(it.price * it.quantity)}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.address && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-sand/40 mb-2">
                        Delivery address
                      </p>
                      <p className="text-sm text-sand/80 bg-white/[0.02] rounded-xl px-4 py-3">
                        {order.address}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white/[0.02] rounded-xl px-4 py-3">
                      <p className="text-sand/40 uppercase tracking-widest text-[10px] mb-1">
                        Payshap Ref
                      </p>
                      <p className="text-sand font-mono">
                        {order.payshapReference}
                      </p>
                    </div>
                    <div className="bg-white/[0.02] rounded-xl px-4 py-3">
                      <p className="text-sand/40 uppercase tracking-widest text-[10px] mb-1">
                        Subtotal
                      </p>
                      <p className="text-sand">{formatPrice(order.subtotal)}</p>
                    </div>
                    <div className="bg-white/[0.02] rounded-xl px-4 py-3">
                      <p className="text-sand/40 uppercase tracking-widest text-[10px] mb-1">
                        Delivery
                      </p>
                      <p className="text-sand">
                        {formatPrice(order.deliveryFee)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                    {order.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => sendPaymentDetails(order)}
                        >
                          <Send size={14} /> Send Payment Details
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(order.id, "cancelled")}
                        >
                          Cancel Order
                        </Button>
                      </>
                    )}

                    {order.status === "payment_sent" && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            openWhatsApp(
                              order.whatsapp,
                              `Hi ${order.name.split(" ")[0]}, just checking in on your order ${order.id}!`
                            )
                          }
                        >
                          <MessageCircle size={14} /> Open WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(order.id, "paid")}
                        >
                          Mark as Paid
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(order.id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {order.status === "paid" && (
                      <>
                        <Input
                          placeholder="Waybill / tracking number"
                          value={waybills[order.id] ?? ""}
                          onChange={(e) =>
                            setWaybills((w) => ({
                              ...w,
                              [order.id]: e.target.value,
                            }))
                          }
                          className="max-w-xs"
                        />
                        <Button size="sm" onClick={() => sendTracking(order)}>
                          <Truck size={14} /> Send Tracking
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(order.id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {order.status === "shipped" && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            openWhatsApp(
                              order.whatsapp,
                              `Hi ${order.name.split(" ")[0]}, checking in on your delivery for ${order.id}!`
                            )
                          }
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(order.id, "delivered")}
                        >
                          Mark Delivered
                        </Button>
                      </>
                    )}

                    {order.status === "delivered" && (
                      <p className="text-xs text-green-400/70 uppercase tracking-widest">
                        ✓ Order complete
                      </p>
                    )}

                    {order.status === "cancelled" && (
                      <p className="text-xs text-red-400/70 uppercase tracking-widest">
                        ✕ Order cancelled
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}