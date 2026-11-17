/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Truck,
  Flower2,
  Package,
  TrendingUp,
  Copy,
  Check,
  ChevronDown,
  Bell,
  DollarSign,
  MessageCircle,
  MapPin,
  Phone,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";
import { copyToClipboard } from "@/lib/clipboard";
import { Order } from "@/types";
import {
  groupOrdersByDay,
  getDayLabel,
  buildSupplierOrderText,
} from "@/lib/admin";
import { SendMessagesModal } from "@/components/admin/SendMessagesModal";

interface Stats {
  toShip: number;
  awaitingShipment: number;
  shipped: number;
  delivered: number;
  thisMonthRevenue: number;
  allTimeRevenue: number;
  allTimeOrderCount: number;
}

const TABS = [
  { id: "paid", label: "Orders to Ship" },
  { id: "awaiting_shipment", label: "Awaiting Shipment" },
  { id: "shipped", label: "Shipped" },
  { id: "all", label: "All" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState("paid");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [collectedDays, setCollectedDays] = useState<Set<string>>(new Set());
  const [copiedSupplier, setCopiedSupplier] = useState<string | null>(null);
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());
  const [broadcastDay, setBroadcastDay] = useState<string | null>(null);
  const [broadcastOrders, setBroadcastOrders] = useState<Order[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        setLoadError(`Could not load orders (${res.status})`);
        return;
      }
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setStats(data.stats ?? null);
      setLoadError(null);
    } catch (err) {
      console.error("[dashboard] load error:", err);
      setLoadError("Could not reach the server.");
    }
  }, [router]);

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  const tabOrders = useMemo(() => {
    if (tab === "all") return orders;
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  const groupedByDay = useMemo(
    () => groupOrdersByDay(tabOrders),
    [tabOrders]
  );

  useEffect(() => {
    if (!expandedDay && groupedByDay.size > 0) {
      setExpandedDay(Array.from(groupedByDay.keys())[0]);
    }
  }, [groupedByDay, expandedDay]);

  const copy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIds((prev) => new Set(prev).add(id));
    }
  };

  const copySupplierText = async (dayKey: string, dayOrders: Order[]) => {
    const text = buildSupplierOrderText(dayOrders);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedSupplier(dayKey);
      setTimeout(() => setCopiedSupplier(null), 2500);
    }
  };

  const markDayCollected = (dayKey: string) => {
    setCollectedDays((prev) => new Set(prev).add(dayKey));
    setExpandedDay(null);
  };

  const moveDayToAwaitingShipment = async (
    dayKey: string,
    dayOrders: Order[]
  ) => {
    const ids = dayOrders.map((o) => o.id);
    await fetch("/api/admin/orders/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds: ids, status: "awaiting_shipment" }),
    });
    setCollectedDays((prev) => {
      const next = new Set(prev);
      next.delete(dayKey);
      return next;
    });
    load();
  };

  const openBroadcast = (dayKey: string, dayOrders: Order[]) => {
    setBroadcastDay(dayKey);
    setBroadcastOrders(dayOrders);
  };

  const finalizeBroadcast = async () => {
    if (!broadcastDay || broadcastOrders.length === 0) return;
    const ids = broadcastOrders.map((o) => o.id);
    await fetch("/api/admin/orders/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds: ids, status: "shipped" }),
    });
    setBroadcastDay(null);
    setBroadcastOrders([]);
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
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
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/inventory">
            <Button variant="secondary" size="sm">
              <Package size={14} /> Inventory
            </Button>
          </Link>
          <Link href="/admin/waitlist">
            <Button variant="secondary" size="sm">
              <Bell size={14} /> Waitlist
            </Button>
          </Link>
          <Link href="/admin/tools">
            <Button variant="ghost" size="sm">
              <Calendar size={14} /> Tools
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={load}>
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
            { label: "Orders to Ship", value: stats.toShip, icon: Package },
            {
              label: "Awaiting Shipment",
              value: stats.awaitingShipment,
              icon: Truck,
            },
            {
              label: "This Month",
              value: formatPrice(stats.thisMonthRevenue),
              icon: TrendingUp,
            },
            {
              label: "All-Time",
              value: formatPrice(stats.allTimeRevenue),
              icon: DollarSign,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-sand/40">
                    {s.label}
                  </p>
                  <Icon size={14} className="text-terracotta/60" />
                </div>
                <p className="font-display text-2xl text-terracotta leading-none">
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
        {groupedByDay.size === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <Package size={28} className="mx-auto text-sand/30 mb-3" />
            <p className="text-sand/50">No orders in this tab.</p>
          </div>
        )}

        {Array.from(groupedByDay.entries()).map(([dayKey, dayOrders]) => {
          const isOpen = expandedDay === dayKey;
          const isCollected = collectedDays.has(dayKey);
          const isCopied = copiedSupplier === dayKey;
          const dayRevenue = dayOrders
            .filter((o) =>
              ["paid", "awaiting_shipment", "shipped", "delivered"].includes(
                o.status
              )
            )
            .reduce((s, o) => s + o.total, 0);

          const isToShipTab = tab === "paid";
          const isAwaitingTab = tab === "awaiting_shipment";

          return (
            <div
              key={dayKey}
              className={cn(
                "bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden transition",
                isCollected && "opacity-50"
              )}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  !isCollected && setExpandedDay(isOpen ? null : dayKey)
                }
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isCollected) {
                    e.preventDefault();
                    setExpandedDay(isOpen ? null : dayKey);
                  }
                }}
                className={cn(
                  "w-full flex flex-wrap items-center justify-between gap-4 p-5 transition text-left",
                  !isCollected && "hover:bg-white/[0.02] cursor-pointer",
                  isCollected && "cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {!isCollected && (
                    <ChevronDown
                      size={18}
                      className={cn(
                        "text-sand/40 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                  {isCollected && (
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      <Check size={16} className="text-green-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-sand font-medium">
                      {getDayLabel(dayKey)}
                    </p>
                    <p className="text-xs text-sand/50">
                      {dayOrders.length}{" "}
                      {dayOrders.length === 1 ? "order" : "orders"}
                      {dayRevenue > 0 && (
                        <>
                          {" · "}
                          <span className="text-terracotta">
                            {formatPrice(dayRevenue)}
                          </span>
                        </>
                      )}
                      {isCollected && (
                        <span className="text-green-400 ml-2">
                          · Stock collected
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isToShipTab && !isCollected && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          copySupplierText(dayKey, dayOrders);
                        }}
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy for Supplier
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markDayCollected(dayKey);
                        }}
                      >
                        <Check size={14} /> Stock Collected
                      </Button>
                    </>
                  )}

                  {isToShipTab && isCollected && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDayToAwaitingShipment(dayKey, dayOrders);
                      }}
                    >
                      <Truck size={14} /> Move to Awaiting Shipment
                    </Button>
                  )}

                  {isAwaitingTab && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBroadcast(dayKey, dayOrders);
                      }}
                    >
                      <MessageCircle size={14} /> Send Messages & Ship
                    </Button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/5 overflow-hidden"
                  >
                    <div className="p-5 space-y-3">
                      {dayOrders.map((order) =>
                        isToShipTab ? (
                          <SimpleOrderRow key={order.id} order={order} />
                        ) : (
                          <ShippingOrderRow
                            key={order.id}
                            order={order}
                            copy={copy}
                            copiedIds={copiedIds}
                          />
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <SendMessagesModal
        open={broadcastDay !== null}
        orders={broadcastOrders}
        onClose={() => {
          setBroadcastDay(null);
          setBroadcastOrders([]);
        }}
        onAllSent={finalizeBroadcast}
      />
    </div>
  );
}

function SimpleOrderRow({ order }: { order: Order }) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sand text-sm">{order.name}</p>
        <p className="text-xs text-sand/40 font-mono mt-0.5">{order.id}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-terracotta font-display text-lg">
          {formatPrice(order.total)}
        </p>
        <p className="text-xs text-sand/40">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>
    </div>
  );
}

function ShippingOrderRow({
  order,
  copy,
  copiedIds,
}: {
  order: Order;
  copy: (text: string, id: string) => Promise<void>;
  copiedIds: Set<string>;
}) {
  const smsCopied = copiedIds.has(`sms-${order.id}`);
  const addrCopied = copiedIds.has(`addr-${order.id}`);
  const bothCopied = smsCopied && addrCopied;

  if (bothCopied) {
    return (
      <motion.div
        initial={{ opacity: 1, height: "auto" }}
        animate={{ opacity: 0.3, height: "auto" }}
        className="bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2 text-sm text-green-400">
          <Check size={14} /> {order.name} — ready for courier
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sand font-medium">{order.name}</p>
        <p className="text-xs text-sand/40 font-mono">{order.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {order.smsNumber && (
          <div className="bg-white/[0.02] rounded-lg px-3 py-2 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-sand/40 flex items-center gap-1">
                <Phone size={9} /> SMS (for courier)
              </p>
              <p className="text-sand text-sm truncate">{order.smsNumber}</p>
            </div>
            <button
              onClick={() => copy(order.smsNumber!, `sms-${order.id}`)}
              disabled={smsCopied}
              className={cn(
                "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition",
                smsCopied
                  ? "bg-green-500/10 text-green-400 cursor-not-allowed"
                  : "border border-white/10 text-sand/60 hover:border-terracotta hover:text-terracotta active:border-terracotta active:text-terracotta"
              )}
            >
              {smsCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}

        {order.address && (
          <div className="bg-white/[0.02] rounded-lg px-3 py-2 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-sand/40 flex items-center gap-1">
                <MapPin size={9} /> Address
              </p>
              <p className="text-sand text-xs whitespace-pre-wrap line-clamp-3">
                {order.address}
              </p>
            </div>
            <button
              onClick={() => copy(order.address!, `addr-${order.id}`)}
              disabled={addrCopied}
              className={cn(
                "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition mt-0.5",
                addrCopied
                  ? "bg-green-500/10 text-green-400 cursor-not-allowed"
                  : "border border-white/10 text-sand/60 hover:border-terracotta hover:text-terracotta active:border-terracotta active:text-terracotta"
              )}
            >
              {addrCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>

      <a
        href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-sand/40 hover:text-terracotta transition"
      >
        <ExternalLink size={11} /> Open WhatsApp chat
      </a>
    </div>
  );
}