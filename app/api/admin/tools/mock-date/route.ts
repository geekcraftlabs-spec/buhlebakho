import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

const ENV_PATH = path.join(process.cwd(), ".env.local");

async function readEnv(): Promise<string> {
  try {
    return await fs.readFile(ENV_PATH, "utf-8");
  } catch {
    return "";
  }
}

async function writeEnv(content: string) {
  await fs.writeFile(ENV_PATH, content, "utf-8");
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const env = await readEnv();
  const match = env.match(/^MOCK_DATE="?([^"\n]*)"?/m);
  return NextResponse.json({ mockDate: match?.[1] ?? "" });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { mockDate } = await req.json();

  let env = await readEnv();

  // Remove existing MOCK_DATE line
  env = env.replace(/^MOCK_DATE=.*\n?/m, "");

  if (mockDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(mockDate)) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    env = env.trimEnd() + `\nMOCK_DATE="${mockDate}"\n`;
  }

  await writeEnv(env);
  return NextResponse.json({ ok: true });
}