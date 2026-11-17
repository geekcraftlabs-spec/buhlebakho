import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = order.items as Array<{
      variantId: string;
      quantity: number;
    }>;

    for (const item of items) {
      await prisma.productVariant.updateMany({
        where: { id: item.variantId },
        data: { stockCount: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[stock decrement] error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}