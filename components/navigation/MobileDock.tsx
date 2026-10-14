"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Sparkles, ShoppingCart } from "lucide-react";
import { useCartStore, useCartCount } from "@/lib/store";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/her-story", label: "Her", icon: Sparkles },
];

export function MobileDock() {
  const pathname = usePathname();
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartCount();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.3 }}
      className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="liquid-glass flex items-center gap-1 px-1.5 py-1.5 rounded-full">
        {LINKS.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs transition-colors ${
                active ? "text-white" : "text-sand/60 hover:text-sand"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="mobile-dock-active"
                  className="absolute inset-0 bg-terracotta rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={15} className="relative z-10" />
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}

        <button
          onClick={openCart}
          aria-label="Open cart"
          className="relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs text-sand/60 hover:text-sand transition-colors"
        >
          <ShoppingCart size={15} />
          <span>Bag</span>
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {count}
            </span>
          )}
        </button>
      </div>
    </motion.nav>
  );
}