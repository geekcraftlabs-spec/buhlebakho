"use client";

import { cn } from "@/lib/utils";
import { HairType } from "@/types";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "9x6-glueless", label: "9x6 Glueless" },
  { id: "straight", label: "Straight" },
  { id: "curls", label: "Curls" },
  { id: "bobo", label: "Bobo" },
  { id: "double-drawn", label: "Double Drawn" },
];

const HAIR_TYPES: { id: "all" | HairType; label: string }[] = [
  { id: "all", label: "All Hair" },
  { id: "human", label: "Human Hair" },
  { id: "synthetic", label: "Synthetic" },
];

export function FilterBar({
  category,
  hairType,
  onCategoryChange,
  onHairTypeChange,
}: {
  category: string;
  hairType: "all" | HairType;
  onCategoryChange: (id: string) => void;
  onHairTypeChange: (id: "all" | HairType) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 justify-center">
        {HAIR_TYPES.map((ht) => (
          <button
            key={ht.id}
            onClick={() => onHairTypeChange(ht.id)}
            className={cn(
              "text-xs uppercase tracking-widest px-5 py-2.5 rounded-full border transition",
              hairType === ht.id
                ? "bg-terracotta border-terracotta text-white"
                : "border-sand/20 text-sand/70 hover:border-terracotta/60"
            )}
          >
            {ht.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition",
              category === cat.id
                ? "bg-sand text-espresso border-sand"
                : "border-sand/15 text-sand/60 hover:border-sand/40"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { CATEGORIES, HAIR_TYPES };