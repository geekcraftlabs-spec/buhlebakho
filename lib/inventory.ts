import { ProductVariant, HairType } from "@/types";
import {
  HUMAN_BLEND_VARIANTS,
  FUTURA_VARIANTS,
  CUSTOM_VARIANTS,
  SeedVariant,
} from "./catalog";

// In-memory cache — replaced when we wire up the admin panel
let cache: ProductVariant[] | null = null;

function buildVariant(seed: SeedVariant, index: number): ProductVariant {
  const now = new Date().toISOString();
  const imagePath = seed.image.startsWith("/")
    ? seed.image
    : `/images/wigs/${seed.image}.png`;

  // Temporary: force certain variants to 0 for testing out-of-stock flow
  const forcedZero =
    seed.colorCode === "350" && seed.hairType === "human-blend";
  const initialStock = forcedZero ? 0 : 5;

  return {
    id: `${seed.hairType}-${seed.texture}-${seed.laceType}-${seed.colorCode}-${seed.sizeLabel}`
      .replace(/[^a-z0-9-]/gi, "-")
      .toLowerCase()
      .slice(0, 80),
    hairType: seed.hairType,
    laceType: seed.laceType,
    texture: seed.texture,
    colorCode: seed.colorCode,
    colorName: seed.colorName,
    sizeGroup: seed.sizeGroup,
    futuraSize:
      seed.sizeLabel === "short" || seed.sizeLabel === "long"
        ? seed.sizeLabel
        : undefined,
    sizeLabel: seed.sizeLabel,
    price: seed.price,
    salePrice: null,
    stockCount: initialStock,
    image: imagePath,
    isHidden: false,
    isFeatured: index < 3,
    slotCount: seed.hairType === "custom-human-hair" ? 20 : null,
    slotPeriodStart:
      seed.hairType === "custom-human-hair" ? new Date().toISOString() : null,
    slotPeriodEnd:
      seed.hairType === "custom-human-hair"
        ? new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
        : null,
    createdAt: now,
    updatedAt: now,
  };
}

export function getAllVariants(): ProductVariant[] {
  if (cache) return cache;

  const all: ProductVariant[] = [
    ...HUMAN_BLEND_VARIANTS.map((s, i) => buildVariant(s, i)),
    ...FUTURA_VARIANTS.map((s, i) => buildVariant(s, i)),
    ...CUSTOM_VARIANTS.map((s, i) => buildVariant(s, i)),
  ];

  cache = all;
  return all;
}

export function getVariantsByHairType(hairType: HairType): ProductVariant[] {
  return getAllVariants().filter((v) => v.hairType === hairType);
}

export function getVariantById(id: string): ProductVariant | undefined {
  return getAllVariants().find((v) => v.id === id);
}

export function getFeaturedVariants(): ProductVariant[] {
  return getAllVariants().filter((v) => v.isFeatured && !v.isHidden);
}

export function invalidateCache() {
  cache = null;
}