import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { getNow } from "@/lib/server-date";

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const now = getNow();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const paidStatuses = ["paid", "awaiting_shipment", "shipped", "delivered"];

    const stats = {
      toShip: orders.filter((o) => o.status === "paid").length,
      awaitingShipment: orders.filter((o) => o.status === "awaiting_shipment")
        .length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      thisMonthRevenue: orders
        .filter(
          (o) =>
            paidStatuses.includes(o.status) &&
            o.paidAt &&
            new Date(o.paidAt) >= startOfMonth
        )
        .reduce((sum, o) => sum + o.total, 0),
      allTimeRevenue: orders
        .filter((o) => paidStatuses.includes(o.status))
        .reduce((sum, o) => sum + o.total, 0),
      allTimeOrderCount: orders.filter((o) => paidStatuses.includes(o.status))
        .length,
    };

    return NextResponse.json({ orders, stats });
  } catch (err) {
    console.error("[GET /api/admin/orders] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders", detail: String(err) },
      { status: 500 }
    );
  }
}