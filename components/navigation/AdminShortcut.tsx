import Link from "next/link";
import { Flower2 } from "lucide-react";

export function AdminShortcut() {
  return (
    <Link
      href="/admin/login"
      className="hidden lg:block fixed top-6 right-6 z-40 text-sand/20 hover:text-terracotta transition-colors"
      aria-label="Admin"
    >
      <Flower2 size={20} />
    </Link>
  );
}