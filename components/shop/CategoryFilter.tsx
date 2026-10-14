"use client";

import { cn } from "@/lib/utils";
import { LaceType, Texture } from "@/types";
import { TEXTURES, LACE_TYPES } from "@/lib/catalog";

export interface ShopFilterState {
  laceType: LaceType | "all";
  texture: Texture | "all";
}

export function CategoryFilter({
  filters,
  onChange,
  showLace = true,
}: {
  filters: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
  showLace?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => onChange({ ...filters, texture: "all" })}
          className={cn(
            "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition",
            filters.texture === "all"
              ? "bg-sand text-espresso border-sand"
              : "border-sand/20 text-sand/60 hover:border-sand/40"
          )}
        >
          All Textures
        </button>
        {TEXTURES.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange({ ...filters, texture: t.id })}
            className={cn(
              "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition",
              filters.texture === t.id
                ? "bg-sand text-espresso border-sand"
                : "border-sand/20 text-sand/60 hover:border-sand/40"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {showLace && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => onChange({ ...filters, laceType: "all" })}
            className={cn(
              "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition",
              filters.laceType === "all"
                ? "bg-terracotta text-white border-terracotta"
                : "border-white/15 text-sand/60 hover:border-terracotta/50"
            )}
          >
            All Lace
          </button>
          {LACE_TYPES.map((l) => (
            <button
              key={l.id}
              onClick={() => onChange({ ...filters, laceType: l.id })}
              className={cn(
                "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition",
                filters.laceType === l.id
                  ? "bg-terracotta text-white border-terracotta"
                  : "border-white/15 text-sand/60 hover:border-terracotta/50"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}