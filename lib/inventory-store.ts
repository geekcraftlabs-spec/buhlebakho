import { ProductVariant, HairType } from "@/types";
import {
  HUMAN_BLEND_VARIANTS,
  FUTURA_VARIANTS,
  CUSTOM_VARIANTS,
  SeedVariant,
} from "./catalog";

// In-memory store for admin overrides (will be DB-backed in a later stage)
interface Override {
  price?: number;
  salePrice?: number | null;
  stockCount?: number;
  isHidden?: boolean;
  isFeatured?: boolean;
}

const OVERRIDES_KEY = "bb-admin-overrides";

function loadOverrides(): Record<string, Override> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveOverrides(o: Record<string, Override>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
}

// Build initial variant from seed
function buildVariant(seed: SeedVariant, index: number): ProductVariant {
  const now = new Date().toISOString();
  const imagePath = seed.image.startsWith("/")
    ? seed.image
    : `/images/wigs/${seed.image}.png`;

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

// Always rebuild from localStorage so admin edits reflect immediately
function buildAll(): ProductVariant[] {
  const base = [
    ...HUMAN_BLEND_VARIANTS.map((s, i) => buildVariant(s, i)),
    ...FUTURA_VARIANTS.map((s, i) => buildVariant(s, i)),
    ...CUSTOM_VARIANTS.map((s, i) => buildVariant(s, i)),
  ];

  const overrides = loadOverrides();

  return base.map((v) => {
    const o = overrides[v.id];
    if (!o) return v;
    return {
      ...v,
      price: o.price ?? v.price,
      salePrice: o.salePrice !== undefined ? o.salePrice : v.salePrice,
      stockCount: o.stockCount ?? v.stockCount,
      isHidden: o.isHidden ?? v.isHidden,
      isFeatured: o.isFeatured ?? v.isFeatured,
    };
  });
}

export function getAllVariants(): ProductVariant[] {
  return buildAll();
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

export function setOverride(variantId: string, override: Override) {
  const overrides = loadOverrides();
  overrides[variantId] = { ...overrides[variantId], ...override };
  saveOverrides(overrides);
}

export function invalidateCache() {
  // no-op now — getAllVariants rebuilds every time
}

// ---------- Inventory log (client-side) ----------
export interface InventoryLogEntry {
  id: string;
  variantId: string;
  action: "price_change" | "stock_change" | "hidden" | "unhidden" | "sale_change";
  beforeValue: string;
  afterValue: string;
  createdAt: string;
}

const LOG_KEY = "bb-inventory-log";

export function getInventoryLog(): InventoryLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

export function appendInventoryLog(
  entry: Omit<InventoryLogEntry, "id" | "createdAt">
) {
  if (typeof window === "undefined") return;
  const log = getInventoryLog();
  log.unshift({
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, 200)));
}