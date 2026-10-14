import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const ok = await login(password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/login] error:", err);
    return NextResponse.json(
      { error: "Login failed", detail: String(err) },
      { status: 500 }
    );
  }
}