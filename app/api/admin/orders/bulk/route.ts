import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderIds, status, waybill } = await req.json();

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "No order IDs" }, { status: 400 });
    }
    if (!status) {
      return NextResponse.json({ error: "No status" }, { status: 400 });
    }

    const result = await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: {
        status,
        ...(waybill !== undefined && { waybill }),
      },
    });

    return NextResponse.json({ ok: true, count: result.count });
  } catch (err) {
    console.error("[PATCH /api/admin/orders/bulk] error:", err);
    return NextResponse.json(
      { error: "Failed to update orders", detail: String(err) },
      { status: 500 }
    );
  }
}