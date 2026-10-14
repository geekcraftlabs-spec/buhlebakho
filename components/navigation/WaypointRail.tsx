"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";

const WAYPOINTS = [
  { id: "home", label: "Home", href: "/" },
  { id: "shop", label: "Shop", href: "/shop" },
  { id: "her-story", label: "Her Story", href: "/her-story" },
];

export function WaypointRail() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="hidden lg:flex fixed left-8 xl:left-12 top-1/2 -translate-y-1/2 z-40">
      <div className="relative h-80 w-px">
        {/* Track */}
        <div className="absolute inset-0 bg-sand/15" />

        {/* Progress fill */}
        <motion.div
          className="absolute inset-0 bg-terracotta/60 origin-top"
          style={{ scaleY: fill }}
        />

        {/* Waypoints */}
        {WAYPOINTS.map((wp, i) => {
          const top = `${(i / (WAYPOINTS.length - 1)) * 100}%`;
          const active = isActive(wp.href);
          return (
            <Link
              key={wp.id}
              href={wp.href}
              aria-label={wp.label}
              aria-current={active ? "page" : undefined}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 group block"
              style={{ top }}
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  active
                    ? "w-[7px] h-[7px] bg-terracotta ring-4 ring-terracotta/20"
                    : "w-[5px] h-[5px] bg-sand/40 group-hover:bg-sand/80 group-hover:scale-125"
                }`}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-sand/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {wp.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}