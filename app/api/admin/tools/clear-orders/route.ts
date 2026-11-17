import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await prisma.order.deleteMany({});
    return NextResponse.json({ ok: true, count: result.count });
  } catch (err) {
    console.error("[clear-orders] error:", err);
    return NextResponse.json(
      { error: "Failed to clear orders", detail: String(err) },
      { status: 500 }
    );
  }
}