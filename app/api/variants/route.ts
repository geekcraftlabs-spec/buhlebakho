import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { isHidden: false },
      orderBy: [{ hairType: "asc" }, { sizeLabel: "asc" }],
    });
    return NextResponse.json({ variants });
  } catch (err) {
    console.error("[GET /api/variants] error:", err);
    return NextResponse.json({ variants: [] });
  }
}