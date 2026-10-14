import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  formatWhatsApp,
  generateOrderId,
  generatePayshapReference,
} from "@/lib/utils";
import { CartItem } from "@/types";
import { DELIVERY_FEE } from "@/lib/data";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, whatsapp, deliveryMethod, address, items } = body as {
      name: string;
      whatsapp: string;
      deliveryMethod: "door" | "locker";
      address: string | null;
      items: CartItem[];
    };

    if (!name || !whatsapp || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + DELIVERY_FEE;
    const orderId = generateOrderId();
    const payshapReference = generatePayshapReference(name.split(" ")[0]);

    await prisma.order.create({
      data: {
        id: orderId,
        name,
        whatsapp: formatWhatsApp(whatsapp),
        deliveryMethod,
        address: deliveryMethod === "door" ? address : null,
        items: items as unknown as Prisma.InputJsonValue,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        payshapReference,
      },
    });

    return NextResponse.json({ orderId, payshapReference });
  } catch (err) {
    console.error("[POST /api/checkout] error:", err);
    return NextResponse.json(
      { error: "Failed to create order", detail: String(err) },
      { status: 500 }
    );
  }
}