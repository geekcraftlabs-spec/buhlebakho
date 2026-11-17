import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const variants = await prisma.productVariant.findMany({
    orderBy: [{ hairType: "asc" }, { sizeLabel: "asc" }],
  });
  return NextResponse.json({ variants });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const variant = await prisma.productVariant.upsert({
      where: {
        hairType_laceType_texture_colorCode_sizeLabel: {
          hairType: body.hairType,
          laceType: body.laceType,
          texture: body.texture,
          colorCode: body.colorCode,
          sizeLabel: body.sizeLabel,
        },
      },
      create: body,
      update: body,
    });
    return NextResponse.json({ variant });
  } catch (err) {
    console.error("[POST /api/admin/variants] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}