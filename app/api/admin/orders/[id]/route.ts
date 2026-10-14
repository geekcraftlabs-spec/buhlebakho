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
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.waybill !== undefined && { waybill: body.waybill }),
      },
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