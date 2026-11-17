import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getNow } from "@/lib/server-date";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Fetch the order first to get items
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existing.status !== "pending") {
      return NextResponse.json({ ok: true, alreadyPaid: true });
    }

    // ATOMIC UPDATE: only succeeds if status is STILL pending
    // This is the guard against double-decrement
    const now = getNow();
    const updateResult = await prisma.order.updateMany({
      where: {
        id: orderId,
        status: "pending", // only match if still pending
      },
      data: {
        status: "paid",
        paidAt: now,
        orderDay: now.toISOString().slice(0, 10),
      },
    });

    // If 0 rows updated, someone else already processed it
    if (updateResult.count === 0) {
      return NextResponse.json({ ok: true, alreadyPaid: true });
    }

    // Only NOW decrement stock — this block runs exactly once
    const items = existing.items as Array<{
      variantId: string;
      quantity: number;
    }>;
    for (const item of items) {
      try {
        await prisma.productVariant.updateMany({
          where: { id: item.variantId },
          data: { stockCount: { decrement: item.quantity } },
        });
      } catch (stockErr) {
        console.error(
          `[mark-paid] stock decrement failed for ${item.variantId}:`,
          stockErr
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/public/mark-paid] error:", err);
    return NextResponse.json(
      { error: "Failed to mark paid", detail: String(err) },
      { status: 500 }
    );
  }
}