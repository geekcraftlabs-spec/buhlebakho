/* eslint-disable @typescript-eslint/no-unused-vars */
import { HairType, Texture, LaceType, ProductGroup } from "@/types";

// ---------- Category display metadata ----------
export interface CategoryMeta {
  id: HairType;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  heroImage: string;
  accentColor: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "human-blend",
    name: "Human Blends",
    shortName: "Human Blends",
    tagline: "Premium quality, everyday price",
    description:
      "Blended human hair with heat-resistant fibre — the best of both worlds. Soft, natural movement, and can be heat-styled. Our everyday luxury.",
    heroImage: "/images/wigs/bonestraight-24-1B.png",
    accentColor: "#c2410c",
  },
  {
    id: "futura-fibre",
    name: "Futura Fibres",
    shortName: "Futura",
    tagline: "Heat-resistant Japanese fibre",
    description:
      "Japanese Futura fibre wigs — the gold standard of synthetic. Soft, low-sheen, and heat-resistant up to 210°C. Bold colors, bold statement.",
    heroImage: "/images/wigs/bodywave-24-27.png",
    accentColor: "#a855f7",
  },
  {
    id: "custom-human-hair",
    name: "100% Human Hair",
    shortName: "Human Hair",
    tagline: "Made to order — worth the wait",
    description:
      "Crafted by hand, piece by piece. Real human hair, made to order with a 3-4 day lead time. Only a limited number available per 10-day period to ensure quality.",
    heroImage: "/images/wigs/bonestraight-24-99J.png",
    accentColor: "#d4af37",
  },
];

export function getCategoryMeta(id: HairType): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

// ---------- Textures ----------
export const TEXTURES: { id: Texture; label: string }[] = [
  { id: "bone-straight", label: "Bone Straight" },
  { id: "body-wave", label: "Body Wave" },
  { id: "deep-wave", label: "Deep Wave" },
];

export function getTextureLabel(id: Texture): string {
  return TEXTURES.find((t) => t.id === id)?.label ?? id;
}

// ---------- Lace types ----------
export const LACE_TYPES: { id: LaceType; label: string; description: string }[] = [
  { id: "5x5", label: "5x5 Closure", description: "Small top-front patch. Beginner friendly." },
  { id: "13x4", label: "13x4 Frontal", description: "Full ear-to-ear hairline. Everyday wear." },
  { id: "13x6", label: "13x6 Frontal", description: "Deeper lace. Deep parts and pulled-back styles." },
];

// ---------- Preset pricing (by size group) ----------
export const PRESET_PRICES: Record<string, { min: number; max: number; default: number }> = {
  "10-14": { min: 750, max: 800, default: 750 },
  "16-20": { min: 825, max: 970, default: 850 },
  "22-30": { min: 900, max: 1100, default: 950 },
};

// ---------- Color swatches ----------
export const COLOR_SWATCHES: Record<string, string> = {
  "1B": "#1a1a1a",
  "1": "#0a0a0a",
  "2": "#2b1810",
  "4": "#4a2c1a",
  "27": "#e8c88a",
  "30": "#a8542a",
  "33": "#7a3a1a",
  "99J": "#4a0e1c",
  "350": "#c97240",
  "613": "#f5e6c8",
  "4/27": "#c9a26a",
  "1B/27": "#b8925a",
  "1B/30": "#7a4a2a",
  "1B/99J": "#3a0f18",
  "1B/613": "#c9b88a",
  "pink": "#f4a0c8",
  "blackplum": "#2a0a2a",
  "grey": "#888888",
  "red": "#a31c1c",
  "ash-blonde": "#c8b48a",
  "lilac": "#c8b0d8",
  "teal": "#1a8a8a",
  "fuchsia": "#c82a8a",
  "rose-gold": "#d8a890",
};

// ---------- Placeholder ----------
export const PLACEHOLDER_IMAGE = "/images/placeholder.png";

// ---------- Helper: get size group from inch size ----------
export function getSizeGroup(size: number): "10-14" | "16-20" | "22-30" {
  if (size <= 14) return "10-14";
  if (size <= 20) return "16-20";
  return "22-30";
}

// ---------- Human blend variants (generated at runtime) ----------
// These are the SKUs we sell. Admin can hide individual ones later.
export interface SeedVariant {
  hairType: HairType;
  laceType: LaceType;
  texture: Texture;
  colorCode: string;
  colorName: string;
  sizeGroup: "10-14" | "16-20" | "22-30";
  sizeLabel: string;   // "12" | "18" | "24"
  price: number;
  image: string;
}

const COLOR_NAMES: Record<string, string> = {
  "1B": "Natural Off-Black",
  "4": "Chocolate Brown",
  "27": "Honey Blonde",
  "30": "Auburn",
  "99J": "Burgundy",
  "350": "Copper",
  "613": "Platinum Blonde",
  "4/27": "Highlight",
  "2": "Darkest Brown",
};

// Human blend SKUs — one size label per group
// Adjust these when real stock is set. For now: one representative size per group.
export const HUMAN_BLEND_VARIANTS: SeedVariant[] = [
  // Bone Straight
  { hairType: "human-blend", laceType: "5x5", texture: "bone-straight", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "10-14", sizeLabel: "12", price: 750, image: "bonestraight-10-1B" },
  { hairType: "human-blend", laceType: "5x5", texture: "bone-straight", colorCode: "4",  colorName: COLOR_NAMES["4"],  sizeGroup: "10-14", sizeLabel: "12", price: 780, image: "bonestraight-10-4" },
  { hairType: "human-blend", laceType: "5x5", texture: "bone-straight", colorCode: "27", colorName: COLOR_NAMES["27"], sizeGroup: "10-14", sizeLabel: "12", price: 800, image: "bonestraight-10-27" },
  { hairType: "human-blend", laceType: "5x5", texture: "bone-straight", colorCode: "99J", colorName: COLOR_NAMES["99J"], sizeGroup: "10-14", sizeLabel: "12", price: 800, image: "bonestraight-10-99J" },

  { hairType: "human-blend", laceType: "13x4", texture: "bone-straight", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "16-20", sizeLabel: "18", price: 850, image: "bonestraight-16-1B" },
  { hairType: "human-blend", laceType: "13x4", texture: "bone-straight", colorCode: "4",  colorName: COLOR_NAMES["4"],  sizeGroup: "16-20", sizeLabel: "18", price: 880, image: "bonestraight-16-4" },
  { hairType: "human-blend", laceType: "13x4", texture: "bone-straight", colorCode: "27", colorName: COLOR_NAMES["27"], sizeGroup: "16-20", sizeLabel: "18", price: 920, image: "bonestraight-16-27" },
  { hairType: "human-blend", laceType: "13x4", texture: "bone-straight", colorCode: "30", colorName: COLOR_NAMES["30"], sizeGroup: "16-20", sizeLabel: "18", price: 920, image: "bonestraight-16-30" },
  { hairType: "human-blend", laceType: "13x4", texture: "bone-straight", colorCode: "350", colorName: COLOR_NAMES["350"], sizeGroup: "16-20", sizeLabel: "18", price: 950, image: "bonestraight-16-350" },

  { hairType: "human-blend", laceType: "13x6", texture: "bone-straight", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "22-30", sizeLabel: "24", price: 950, image: "bonestraight-24-1B" },
  { hairType: "human-blend", laceType: "13x6", texture: "bone-straight", colorCode: "4",  colorName: COLOR_NAMES["4"],  sizeGroup: "22-30", sizeLabel: "24", price: 980, image: "bonestraight-24-4" },
  { hairType: "human-blend", laceType: "13x6", texture: "bone-straight", colorCode: "613", colorName: COLOR_NAMES["613"], sizeGroup: "22-30", sizeLabel: "24", price: 1100, image: "bonestraight-24-613" },

  // Body Wave
  { hairType: "human-blend", laceType: "5x5", texture: "body-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "10-14", sizeLabel: "12", price: 750, image: "bodywave-10-1B" },
  { hairType: "human-blend", laceType: "5x5", texture: "body-wave", colorCode: "27", colorName: COLOR_NAMES["27"], sizeGroup: "10-14", sizeLabel: "12", price: 800, image: "bodywave-10-27" },

  { hairType: "human-blend", laceType: "13x4", texture: "body-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "16-20", sizeLabel: "18", price: 850, image: "bodywave-16-1B" },
  { hairType: "human-blend", laceType: "13x4", texture: "body-wave", colorCode: "613", colorName: COLOR_NAMES["613"], sizeGroup: "16-20", sizeLabel: "18", price: 970, image: "bodywave-16-613" },

  { hairType: "human-blend", laceType: "13x6", texture: "body-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "22-30", sizeLabel: "24", price: 950, image: "bodywave-24-1B" },
  { hairType: "human-blend", laceType: "13x6", texture: "body-wave", colorCode: "27", colorName: COLOR_NAMES["27"], sizeGroup: "22-30", sizeLabel: "24", price: 1000, image: "bodywave-24-27" },

  // Deep Wave
  { hairType: "human-blend", laceType: "5x5", texture: "deep-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "10-14", sizeLabel: "12", price: 750, image: "deepwave-10-1B" },

  { hairType: "human-blend", laceType: "13x4", texture: "deep-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "16-20", sizeLabel: "18", price: 850, image: "deepwave-16-1B" },
  { hairType: "human-blend", laceType: "13x4", texture: "deep-wave", colorCode: "4",  colorName: COLOR_NAMES["4"],  sizeGroup: "16-20", sizeLabel: "18", price: 880, image: "deepwave-16-4" },
  { hairType: "human-blend", laceType: "13x4", texture: "deep-wave", colorCode: "99J", colorName: COLOR_NAMES["99J"], sizeGroup: "16-20", sizeLabel: "18", price: 900, image: "deepwave-16-99J" },

  { hairType: "human-blend", laceType: "13x6", texture: "deep-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "22-30", sizeLabel: "24", price: 950, image: "deepwave-24-1B" },
  { hairType: "human-blend", laceType: "13x6", texture: "deep-wave", colorCode: "99J", colorName: COLOR_NAMES["99J"], sizeGroup: "22-30", sizeLabel: "24", price: 1000, image: "deepwave-24-99J" },
];

// Futura variants — Small (bob) and Long only
export const FUTURA_VARIANTS: SeedVariant[] = [
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "10-14", sizeLabel: "short", price: 550, image: "futura-short-1B" },
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "22-30", sizeLabel: "long",  price: 900, image: "futura-long-1B" },
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "4",  colorName: COLOR_NAMES["4"],  sizeGroup: "22-30", sizeLabel: "long",  price: 950, image: "futura-long-4" },
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "27", colorName: COLOR_NAMES["27"], sizeGroup: "22-30", sizeLabel: "long",  price: 1000, image: "futura-long-27" },
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "99J", colorName: COLOR_NAMES["99J"], sizeGroup: "22-30", sizeLabel: "long",  price: 1000, image: "futura-long-99J" },
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "1B/27", colorName: "Honey Ombré", sizeGroup: "22-30", sizeLabel: "long", price: 1050, image: "futura-long-1B-27" },
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "1B/30", colorName: "Auburn Ombré", sizeGroup: "22-30", sizeLabel: "long", price: 1050, image: "futura-long-1B-30" },
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "pink", colorName: "Pastel Pink", sizeGroup: "22-30", sizeLabel: "long", price: 950, image: "futura-long-pink" },
  { hairType: "futura-fibre", laceType: "13x4", texture: "body-wave", colorCode: "blackplum", colorName: "Black + Plum", sizeGroup: "22-30", sizeLabel: "long", price: 1100, image: "futura-long-blackplum" },
];

// Custom human hair — max 3 items, made-to-order with slots
export const CUSTOM_VARIANTS: SeedVariant[] = [
  { hairType: "custom-human-hair", laceType: "13x4", texture: "bone-straight", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "16-20", sizeLabel: "16", price: 3500, image: "custom-bonestraight-16-1B" },
  { hairType: "custom-human-hair", laceType: "13x4", texture: "body-wave", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "16-20", sizeLabel: "16", price: 3800, image: "custom-bodywave-16-1B" },
  { hairType: "custom-human-hair", laceType: "13x6", texture: "bone-straight", colorCode: "1B", colorName: COLOR_NAMES["1B"], sizeGroup: "22-30", sizeLabel: "24", price: 4500, image: "custom-bonestraight-24-1B" },
];