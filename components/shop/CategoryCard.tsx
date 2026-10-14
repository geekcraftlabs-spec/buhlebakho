"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CategoryMeta } from "@/lib/catalog";
import { PLACEHOLDER_IMAGE } from "@/lib/catalog";

export function CategoryCard({ category, index }: { category: CategoryMeta; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 26,
        delay: index * 0.08,
      }}
    >
      <Link
        href={`/shop/${category.id}`}
        className="group block bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-terracotta/40 transition"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-black/20">
          <Image
            src={category.heroImage}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            <p
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: category.accentColor }}
            >
              {category.tagline}
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-sand leading-tight">
              {category.name}
            </h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-sand/60 leading-relaxed">
            {category.description}
          </p>
          <div className="flex items-center gap-2 text-terracotta text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
            Explore <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}