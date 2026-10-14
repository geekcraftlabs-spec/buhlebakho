import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const stats = {
      pending: orders.filter((o) => o.status === "pending").length,
      paymentSent: orders.filter((o) => o.status === "payment_sent").length,
      paid: orders.filter((o) => o.status === "paid").length,
      thisMonthRevenue: orders
        .filter((o) => o.status === "delivered" && o.createdAt >= startOfMonth)
        .reduce((sum, o) => sum + o.total, 0),
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