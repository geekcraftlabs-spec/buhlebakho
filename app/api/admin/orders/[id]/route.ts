import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.waybill !== undefined) data.waybill = body.waybill;
    if (body.status === "paid" && !body.skipPaidAt) {
      // Set paidAt if it's not already set (only on transition to paid)
    }

    const order = await prisma.order.update({
      where: { id },
      data,
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error("[PATCH /api/admin/orders/[id]] error:", err);
    return NextResponse.json(
      { error: "Failed to update order", detail: String(err) },
      { status: 500 }
    );
  }
}