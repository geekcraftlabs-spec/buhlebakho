/* eslint-disable @typescript-eslint/no-unused-vars */
import { WigProduct, BankTutorial, HairType } from "@/types";

const img = (cat: string, size: number, color: string) =>
  `/images/wigs/${cat}-${size}-${color}.png`;

const colorName: Record<string, string> = {
  black: "Natural Black",
  burgundy: "99J Burgundy",
  ginger: "350 Ginger",
  blonde: "613 Blonde",
  highlight: "4/27 Highlight",
  darkbrown: "4# Dark Brown",
  grey: "Grey",
  red: "Red",
};

const buildColor = (
  code: string,
  category: string,
  sizes: number[],
  priceBySize: Record<number, number>
) => ({
  name: colorName[code],
  code,
  image: img(category, sizes[0], code),
  prices: priceBySize,
});

// ---------- HUMAN HAIR CATALOG ----------
const humanProducts: WigProduct[] = [
  {
    id: "9x6-glueless",
    name: "9x6 Glueless Wig",
    category: "9x6-glueless",
    hairType: "human",
    description: "Pre-plucked 9x6 lace front, glueless install. Ready to wear.",
    featured: true,
    ranges: [
      {
        label: "10 - 14",
        sizes: [10, 12, 14],
        colors: [
          buildColor("black", "9x6glueless", [10, 12, 14], { 10: 850, 12: 1150, 14: 1450 }),
          buildColor("burgundy", "9x6glueless", [12, 10, 14], { 10: 900, 12: 1200, 14: 1500 }),
          buildColor("blonde", "9x6glueless", [10, 12, 14], { 10: 950, 12: 1250, 14: 1550 }),
          buildColor("highlight", "9x6glueless", [10, 12, 14], { 10: 900, 12: 1200, 14: 1500 }),
        ],
      },
      {
        label: "16 - 22",
        sizes: [16, 18, 20, 22],
        colors: [
          buildColor("black", "9x6glueless", [16], { 16: 1750, 18: 2050, 20: 2350, 22: 2650 }),
          buildColor("burgundy", "9x6glueless", [16], { 16: 1800, 18: 2100, 20: 2400, 22: 2700 }),
          buildColor("blonde", "9x6glueless", [16], { 16: 1850, 18: 2150, 20: 2450, 22: 2750 }),
          buildColor("highlight", "9x6glueless", [16], { 16: 1800, 18: 2100, 20: 2400, 22: 2700 }),
        ],
      },
      {
        label: "24 - 30",
        sizes: [24, 26, 28, 30],
        colors: [
          buildColor("black", "9x6glueless", [24], { 24: 2950, 26: 3250, 28: 3550, 30: 3950 }),
          buildColor("burgundy", "9x6glueless", [24], { 24: 3000, 26: 3300, 28: 3600, 30: 4000 }),
          buildColor("blonde", "9x6glueless", [24], { 24: 3050, 26: 3350, 28: 3650, 30: 4050 }),
          buildColor("highlight", "9x6glueless", [24], { 24: 3000, 26: 3300, 28: 3600, 30: 4000 }),
        ],
      },
    ],
  },
  {
    id: "straight",
    name: "Straight Wig",
    category: "straight",
    hairType: "human",
    description: "Bone straight premium human hair. Silky, sleek, and effortless.",
    featured: true,
    ranges: [
      {
        label: "10 - 14",
        sizes: [10, 12, 14],
        colors: [
          buildColor("black", "straight", [14, 10, 12], { 10: 700, 12: 850, 14: 1000 }),
          buildColor("burgundy", "straight", [12, 10, 14], { 10: 750, 12: 900, 14: 1050 }),
          buildColor("blonde", "straight", [10, 12, 14], { 10: 800, 12: 950, 14: 1100 }),
        ],
      },
      {
        label: "16 - 20",
        sizes: [16, 18, 20],
        colors: [
          buildColor("black", "straight", [18], { 16: 1200, 18: 1400, 20: 1600 }),
          buildColor("burgundy", "straight", [18], { 16: 1250, 18: 1450, 20: 1650 }),
          buildColor("blonde", "straight", [18], { 16: 1300, 18: 1500, 20: 1700 }),
        ],
      },
      {
        label: "22 - 24",
        sizes: [22, 24],
        colors: [
          buildColor("black", "straight", [22], { 22: 1750, 24: 1900 }),
          buildColor("burgundy", "straight", [22], { 22: 1800, 24: 1950 }),
          buildColor("blonde", "straight", [22], { 22: 1850, 24: 2000 }),
        ],
      },
    ],
  },
  {
    id: "curls",
    name: "Curly Wig",
    category: "curls",
    hairType: "human",
    description: "Body wave curls with bounce and movement. Full, luscious texture.",
    featured: true,
    ranges: [
      {
        label: "10 - 14",
        sizes: [10, 12, 14],
        colors: [
          buildColor("black", "curly", [10, 12, 14], { 10: 800, 12: 950, 14: 1100 }),
          buildColor("burgundy", "curly", [10, 12, 14], { 10: 850, 12: 1000, 14: 1150 }),
          buildColor("blonde", "curly", [10, 12, 14], { 10: 900, 12: 1050, 14: 1200 }),
        ],
      },
      {
        label: "16 - 20",
        sizes: [16, 18, 20],
        colors: [
          buildColor("black", "curly", [18], { 16: 1300, 18: 1500, 20: 1700 }),
          buildColor("burgundy", "curly", [18], { 16: 1350, 18: 1550, 20: 1750 }),
          buildColor("blonde", "curly", [18], { 16: 1400, 18: 1600, 20: 1800 }),
        ],
      },
      {
        label: "22 - 24",
        sizes: [22, 24],
        colors: [
          buildColor("black", "curly", [22], { 22: 1850, 24: 2000 }),
          buildColor("burgundy", "curly", [22], { 22: 1900, 24: 2050 }),
          buildColor("blonde", "curly", [22], { 22: 1950, 24: 2100 }),
        ],
      },
    ],
  },
  {
    id: "bobo",
    name: "Bobo Wig",
    category: "bobo",
    hairType: "human",
    description: "Classic short bob. Clean, sharp, and unapologetically chic.",
    ranges: [
      {
        label: "8 - 16",
        sizes: [8, 10, 12, 14, 16],
        colors: [
          buildColor("black", "bob", [8], { 8: 500, 10: 550, 12: 600, 14: 700, 16: 950 }),
          buildColor("ginger", "bob", [8], { 8: 550, 10: 600, 12: 650, 14: 750, 16: 1000 }),
          buildColor("burgundy", "bob", [14], { 8: 550, 10: 600, 12: 650, 14: 750, 16: 1000 }),
          buildColor("highlight", "bob", [14], { 8: 550, 10: 600, 12: 650, 14: 750, 16: 1000 }),
        ],
      },
    ],
  },
  {
    id: "double-drawn",
    name: "Double Drawn Wig",
    category: "double-drawn",
    hairType: "human",
    description: "Thick from weft to end. Maximum density, maximum drama.",
    ranges: [
      {
        label: "10 - 14",
        sizes: [10, 12, 14],
        colors: [
          buildColor("black", "doubledrawn", [10, 12, 14], { 10: 750, 12: 1000, 14: 1250 }),
          buildColor("darkbrown", "doubledrawn", [10, 12, 14], { 10: 800, 12: 1050, 14: 1300 }),
          buildColor("burgundy", "doubledrawn", [14], { 10: 800, 12: 1050, 14: 1300 }),
          buildColor("blonde", "doubledrawn", [14], { 10: 850, 12: 1100, 14: 1350 }),
          buildColor("grey", "doubledrawn", [10, 12, 14], { 10: 850, 12: 1100, 14: 1350 }),
          buildColor("red", "doubledrawn", [14], { 10: 850, 12: 1100, 14: 1350 }),
        ],
      },
      {
        label: "16 - 22",
        sizes: [16, 18, 20, 22],
        colors: [
          buildColor("black", "doubledrawn", [20], { 16: 1550, 18: 1850, 20: 2150, 22: 2450 }),
          buildColor("darkbrown", "doubledrawn", [18], { 16: 1600, 18: 1900, 20: 2200, 22: 2500 }),
          buildColor("burgundy", "doubledrawn", [18], { 16: 1600, 18: 1900, 20: 2200, 22: 2500 }),
          buildColor("blonde", "doubledrawn", [18], { 16: 1650, 18: 1950, 20: 2250, 22: 2550 }),
          buildColor("grey", "doubledrawn", [18], { 16: 1650, 18: 1950, 20: 2250, 22: 2550 }),
          buildColor("red", "doubledrawn", [18], { 16: 1650, 18: 1950, 20: 2250, 22: 2550 }),
        ],
      },
      {
        label: "24 - 30",
        sizes: [24, 26, 28, 30],
        colors: [
          buildColor("black", "doubledrawn", [30], { 24: 2750, 26: 3050, 28: 3500, 30: 4000 }),
          buildColor("darkbrown", "doubledrawn", [30], { 24: 2800, 26: 3100, 28: 3550, 30: 4050 }),
          buildColor("burgundy", "doubledrawn", [30], { 24: 2800, 26: 3100, 28: 3550, 30: 4050 }),
          buildColor("blonde", "doubledrawn", [30], { 24: 2850, 26: 3150, 28: 3600, 30: 4100 }),
          buildColor("grey", "doubledrawn", [30], { 24: 2850, 26: 3150, 28: 3600, 30: 4100 }),
          buildColor("red", "doubledrawn", [30], { 24: 2850, 26: 3150, 28: 3600, 30: 4100 }),
        ],
      },
    ],
  },
];

// ---------- SYNTHETIC (auto-derived, prices × 0.45) ----------
const SYNTHETIC_MULTIPLIER = 0.45;

function toSynthetic(product: WigProduct): WigProduct {
  return {
    ...product,
    id: `${product.id}-synthetic`,
    name: product.name.replace(/Wig$/, "Synthetic Wig"),
    hairType: "synthetic",
    featured: false,
    description: product.description.replace(
      "human hair",
      "premium synthetic fibre"
    ),
    ranges: product.ranges.map((r) => ({
      ...r,
      colors: r.colors.map((c) => ({
        ...c,
        prices: Object.fromEntries(
          Object.entries(c.prices).map(([k, v]) => [
            k,
            Math.round((v as number) * SYNTHETIC_MULTIPLIER),
          ])
        ),
      })),
    })),
  };
}

const syntheticProducts: WigProduct[] = humanProducts.map(toSynthetic);

export const wigProducts: WigProduct[] = [
  ...humanProducts,
  ...syntheticProducts,
];

// ---------- Swatches ----------
export const colorSwatches: Record<string, string> = {
  black: "#1a1a1a",
  burgundy: "#4a0e1c",
  ginger: "#b86b3d",
  blonde: "#f5e6c8",
  highlight: "#c9a26a",
  darkbrown: "#3b2011",
  grey: "#888888",
  red: "#a31c1c",
};

// ---------- Bank tutorials ----------
export const bankTutorials: BankTutorial[] = [
  { code: "capitec", name: "Capitec", logo: "/images/banks/capitec.png", video: "/videos/payshap-capitec.mp4" },
  { code: "fnb", name: "FNB", logo: "/images/banks/fnb.png", video: "/videos/payshap-fnb.mp4" },
  { code: "absa", name: "ABSA", logo: "/images/banks/absa.png", video: "/videos/payshap-absa.mp4" },
  { code: "standardbank", name: "Standard Bank", logo: "/images/banks/standardbank.png", video: "/videos/payshap-standardbank.mp4" },
];

// ---------- Constants ----------
export const DELIVERY_FEE = 100;
export const BUSINESS_NAME = "Buhle Bakho";
export const TAGLINE = "Your beauty. Your crown. Your rules.";

// ---------- TikTok URLs ----------
export const TIKTOK_URLS = [
  "https://www.tiktok.com/@kiaramabuza/video/7306432654386285830",
  "https://www.tiktok.com/@kiaramabuza/video/7326505280202689797",
  "https://www.tiktok.com/@kiaramabuza/video/7425543759238122757",
  "https://www.tiktok.com/@kiaramabuza/video/7425543801160125702",
  "https://www.tiktok.com/@kiaramabuza/video/7451927692494081285",
];

export const TATTOO_URLS = [
  "https://www.tiktok.com/@kiaramabuza/video/7661215426101202197",
  "https://www.tiktok.com/@kiaramabuza/video/7632720420445146388",
  "https://www.tiktok.com/@kiaramabuza/video/7615930592865062164",
  "https://www.tiktok.com/@kiaramabuza/video/7641552132705111317",
];