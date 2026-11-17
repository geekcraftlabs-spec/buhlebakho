import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createYocoCheckout } from "@/lib/yoco";
import { validateAddress } from "@/lib/google-maps";
import { generateOrderId } from "@/lib/utils";
import { CartItem } from "@/types";
import { DELIVERY_FEE } from "@/lib/data";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      whatsapp,
      smsNumber,
      address,
      addressComponents,
      items,
    } = body as {
      name: string;
      whatsapp: string;
      smsNumber: string;
      address: string;
      addressComponents?: {
        streetNumber?: string;
        route?: string;
        suburb?: string;
        city?: string;
        province?: string;
        postalCode?: string;
      };
      items: CartItem[];
    };

    if (!name || !whatsapp || !smsNumber || !address || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Server-side address validation (skipped if GOOGLE_MAPS_SERVER_API_KEY not set)
    let finalAddress = address;
    try {
      const validation = await validateAddress({
        addressLines: [address],
        locality: addressComponents?.city,
        administrativeArea: addressComponents?.province,
        postalCode: addressComponents?.postalCode,
        countryCode: "ZA",
      });

      if (validation) {
        if (!validation.verdict.addressComplete) {
          console.warn(
            "[checkout] address validation incomplete:",
            validation.verdict
          );
        }
        // Only use Google's formatted version if it's more complete
        if (validation.formattedAddress) {
          finalAddress = validation.formattedAddress;
        }
      }
    } catch (err) {
      console.warn("[checkout] address validation failed, using raw:", err);
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + DELIVERY_FEE;
    const orderId = generateOrderId();

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create Yoco checkout
    const checkout = await createYocoCheckout({
      amount: total,
      currency: "ZAR",
      description: `Buhle Bakho order ${orderId}`,
      successUrl: `${baseUrl}/thank-you/${orderId}`,
      cancelUrl: `${baseUrl}/checkout?cancelled=1`,
      metadata: {
        orderId,
        customerName: name,
      },
    });

    await prisma.order.create({
      data: {
        id: orderId,
        name,
        whatsapp: normalizePhone(whatsapp),
        email: null,
        deliveryMethod: "door",
        address: finalAddress,
        smsNumber: normalizePhone(smsNumber),
        items: items as unknown as Prisma.InputJsonValue,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        status: "pending",
        yocoCheckoutId: checkout.id,
      },
    });

    return NextResponse.json({
      orderId,
      redirectUrl: checkout.redirectUrl,
    });
  } catch (err) {
    console.error("[POST /api/checkout] error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout", detail: String(err) },
      { status: 500 }
    );
  }
}

function normalizePhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.startsWith("27")) return `+${clean}`;
  if (clean.startsWith("0")) return `+27${clean.slice(1)}`;
  return `+27${clean}`;
}