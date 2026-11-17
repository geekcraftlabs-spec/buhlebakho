import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getNow } from "@/lib/server-date";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("yoco-signature") || "";
  const webhookSecret = process.env.YOCO_WEBHOOK_SECRET;

  if (webhookSecret) {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");
    const provided = signature.replace(/^v1,/, "");
    if (!timingSafeEqual(expectedSignature, provided)) {
      console.warn("[yoco webhook] signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: {
    type: string;
    payload?: {
      id?: string;
      amount?: number;
      metadata?: Record<string, string>;
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.type !== "payment.succeeded") {
    return NextResponse.json({ ok: true, ignored: payload.type });
  }

  const orderId = payload.payload?.metadata?.orderId;
  const paymentId = payload.payload?.id;
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    const now = getNow();
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "paid",
        paidAt: now,
        orderDay: now.toISOString().slice(0, 10),
        yocoPaymentId: paymentId ?? null,
      },
    });
    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (err) {
    console.error("[yoco webhook] db update failed:", err);
    return NextResponse.json(
      { error: "Failed to update order", detail: String(err) },
      { status: 500 }
    );
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}