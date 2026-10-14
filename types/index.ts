// ============================================
// BUHLE BAKHO — TYPE SYSTEM
// ============================================

// ---------- Core enums ----------
export type HairType = "human-blend" | "futura-fibre" | "custom-human-hair";

export type LaceType = "5x5" | "13x4" | "13x6";

export type Texture = "bone-straight" | "body-wave" | "deep-wave";

// Futura uses sizing categories, human uses inch groups
export type SizeGroup = "10-14" | "16-20" | "22-30";
export type FuturaSize = "short" | "long";

// ---------- Catalog ----------
export interface ProductVariant {
  id: string;
  hairType: HairType;
  laceType: LaceType;
  texture: Texture;
  colorCode: string;         // "1B", "27", "4/27", "pink", etc.
  colorName: string;         // "Natural Off-Black", "Honey Blonde", etc.
  sizeGroup?: SizeGroup;     // for human
  futuraSize?: FuturaSize;   // for futura
  sizeLabel: string;         // "14" or "short" or "long" — what the customer sees
  price: number;             // in rands
  salePrice: number | null;
  stockCount: number;        // 0 = out of stock
  image: string;             // "/images/wigs/bonestraight-14-1B.png"
  isHidden: boolean;
  isFeatured: boolean;
  slotCount: number | null;  // only for custom-human-hair
  slotPeriodStart: string | null;
  slotPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

// Product = grouped view for display
export interface ProductGroup {
  id: string;
  hairType: HairType;
  texture: Texture;
  laceType?: LaceType;
  name: string;              // "Bone Straight Human Blend"
  description: string;
  variants: ProductVariant[];
}

// ---------- Cart ----------
export interface CartItem {
  variantId: string;
  productName: string;       // "Bone Straight Human Blend"
  texture: Texture;
  laceType: LaceType | null;
  colorCode: string;
  colorName: string;
  sizeLabel: string;
  price: number;
  image: string;
  quantity: number;
  hairType: HairType;
}

// ---------- Orders ----------
export type OrderStatus =
  | "pending"
  | "paid"
  | "awaiting_shipment"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  name: string;
  whatsapp: string;          // "+27..."
  email: string | null;
  deliveryMethod: "door";    // only door for now
  address: string | null;    // Google Maps-validated
  smsNumber: string | null;  // for courier tracking
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paidAt: string | null;     // when Yoco confirmed
  orderDay: string | null;   // "2026-10-14" — the calendar day bucket
  yocoCheckoutId: string | null;
  yocoPaymentId: string | null;
  waybill: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------- Waitlist ----------
export interface WaitlistEntry {
  id: string;
  phone: string;
  variantId: string;
  variantSnapshot: {
    productName: string;
    colorCode: string;
    colorName: string;
    sizeLabel: string;
    hairType: HairType;
  };
  notified: boolean;
  notifiedAt: string | null;
  createdAt: string;
}

// ---------- Inventory log ----------
export interface InventoryLogEntry {
  id: string;
  variantId: string;
  action: "price_change" | "stock_change" | "hidden" | "unhidden" | "created";
  beforeValue: string | null;
  afterValue: string | null;
  reason: string | null;
  createdAt: string;
}

// ---------- Site settings ----------
export interface SiteSetting {
  key: string;               // "adminSetDate" | "slotPeriodLength" | ...
  value: string;
  updatedAt: string;
}

// ---------- Shop filter state ----------
export interface ShopFilters {
  hairType: HairType | "all";
  laceType: LaceType | "all";
  texture: Texture | "all";
  priceMax?: number;
}

// ---------- Bank tutorial (unchanged) ----------
export interface BankTutorial {
  code: string;
  name: string;
  logo: string;
  video: string;
}