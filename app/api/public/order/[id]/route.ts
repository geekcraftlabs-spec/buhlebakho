import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({
      id: order.id,
      name: order.name,
      total: order.total,
      payshapReference: order.payshapReference,
      status: order.status,
      deliveryMethod: order.deliveryMethod,
    });
  } catch (err) {
    console.error("[GET /api/public/order/[id]] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch order", detail: String(err) },
      { status: 500 }
    );
  }
}