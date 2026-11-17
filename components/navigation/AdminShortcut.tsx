"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower2 } from "lucide-react";

export function AdminShortcut() {
  const pathname = usePathname();

  // Only show on the home page
  if (pathname !== "/") return null;

  return (
    <Link
      href="/admin/dashboard"
      className="fixed top-4 right-4 z-[9999] flex items-center justify-center w-11 h-11 rounded-full text-sand/30 hover:text-terracotta active:text-terracotta transition-colors"
      style={{ pointerEvents: "auto" }}
      aria-label="Admin access"
    >
      <Flower2 size={22} />
    </Link>
  );
}