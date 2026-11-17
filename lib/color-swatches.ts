export interface ColorSwatch {
  code: string;
  name: string;
  hex: string;
}

export const COLOR_SWATCHES: ColorSwatch[] = [
  { code: "1",     name: "Jet Black",            hex: "#0a0a0a" },
  { code: "1B",    name: "Natural Off-Black",    hex: "#1a1a1a" },
  { code: "2",     name: "Darkest Brown",        hex: "#2b1810" },
  { code: "4",     name: "Chocolate Brown",      hex: "#4a2c1a" },
  { code: "27",    name: "Honey Blonde",         hex: "#e8c88a" },
  { code: "30",    name: "Auburn",               hex: "#a8542a" },
  { code: "33",    name: "Dark Auburn",          hex: "#7a3a1a" },
  { code: "99J",   name: "Burgundy",             hex: "#4a0e1c" },
  { code: "350",   name: "Copper",               hex: "#c97240" },
  { code: "613",   name: "Platinum Blonde",      hex: "#f5e6c8" },
  { code: "4/27",  name: "Highlight",            hex: "#c9a26a" },
  { code: "1B/27", name: "Honey Ombré",          hex: "#b8925a" },
  { code: "1B/30", name: "Auburn Ombré",         hex: "#7a4a2a" },
  { code: "1B/99J",name: "Burgundy Ombré",       hex: "#3a0f18" },
  { code: "1B/613",name: "Platinum Ombré",       hex: "#c9b88a" },
  { code: "P1B/30",name: "Piano Auburn",         hex: "#7a4a2a" },
  { code: "P1B/33",name: "Piano Dark Auburn",    hex: "#5a2a1a" },
  { code: "P4/27/30", name: "Piano Caramel",     hex: "#a8784a" },
  { code: "pink",  name: "Pastel Pink",          hex: "#f4a0c8" },
  { code: "Pink",  name: "Pink",                 hex: "#f4a0c8" },
  { code: "PastelPink", name: "Pastel Pink",     hex: "#f4a0c8" },
  { code: "blackplum", name: "Black + Plum",     hex: "#2a0a2a" },
  { code: "grey",  name: "Silver / Grey",        hex: "#888888" },
  { code: "red",   name: "Statement Red",        hex: "#a31c1c" },
  { code: "ashyblonde", name: "Ash Blonde",      hex: "#c8b48a" },
  { code: "lilac", name: "Lilac",                hex: "#c8b0d8" },
  { code: "teal",  name: "Teal",                 hex: "#1a8a8a" },
  { code: "fuchsia", name: "Fuchsia",            hex: "#c82a8a" },
  { code: "rose-gold", name: "Rose Gold",        hex: "#d8a890" },
];

export function getSwatch(code: string): ColorSwatch | undefined {
  return COLOR_SWATCHES.find((s) => s.code.toLowerCase() === code.toLowerCase());
}