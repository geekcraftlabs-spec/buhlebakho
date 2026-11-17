/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { COLOR_SWATCHES } from "@/lib/color-swatches";
import { cn } from "@/lib/utils";

const HAIR_TYPES = [
  { id: "futura-fibre", label: "Futura Fibre" },
  { id: "human-blend", label: "Human Blend" },
  { id: "custom-human-hair", label: "Custom Raw Human Hair" },
];

const TEXTURES = [
  { id: "bone-straight", label: "Bone Straight" },
  { id: "body-wave", label: "Body Wave" },
  { id: "deep-wave", label: "Deep Wave" },
];

const LACE_TYPES = ["5x5", "13x4", "13x6"];
const FUTURA_SIZES = ["short", "long"];
const HUMAN_SIZES = ["10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30"];

export default function NewVariantPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hairType, setHairType] = useState("futura-fibre");
  const [texture, setTexture] = useState("bone-straight");
  const [laceType, setLaceType] = useState("13x4");
  const [sizeLabel, setSizeLabel] = useState("short");
  const [customSize, setCustomSize] = useState("");
  const [colorCode, setColorCode] = useState("1B");
  const [colorName, setColorName] = useState("Natural Off-Black");
  const [price, setPrice] = useState("550");
  const [stock, setStock] = useState("5");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    const swatch = COLOR_SWATCHES.find((s) => s.code === colorCode);
    if (swatch) setColorName(swatch.name);
  }, [colorCode]);

  useEffect(() => {
    if (hairType === "futura-fibre") { setSizeLabel("short"); setPrice("550"); }
    else if (hairType === "custom-human-hair") { setSizeLabel("12"); setPrice("3500"); }
    else { setSizeLabel("12"); setPrice("750"); }
  }, [hairType]);

  useEffect(() => {
    const size = customSize || sizeLabel;
    if (hairType === "futura-fibre") {
      setImageName(`futura-${size}-${colorCode}-${texture === "bone-straight" ? "straight" : "bodywave"}`);
    } else if (hairType === "custom-human-hair") {
      setImageName(`custom-raw-${size}-${colorCode}`);
    } else {
      setImageName(`${texture.replace("-", "")}-${size}-${colorCode}`);
    }
  }, [hairType, texture, sizeLabel, customSize, colorCode]);

  const finalSize = customSize || sizeLabel;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hairType, texture, laceType, colorCode, colorName,
          sizeLabel: finalSize,
          price: parseInt(price),
          stockCount: parseInt(stock),
          image: `/images/wigs/${imageName}.png`,
          isFeatured,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/admin/inventory");
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  };

  const sizesToShow = hairType === "futura-fibre" ? FUTURA_SIZES : HUMAN_SIZES;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <header className="flex items-center gap-4">
        <Link href="/admin/inventory" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2.5 rounded-full border border-sand/20 text-sand/70 hover:border-terracotta/40">
          <ChevronLeft size={14} /> Back
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-terracotta">Admin</p>
          <h1 className="font-display text-4xl text-sand leading-none mt-1">Add New Wig</h1>
        </div>
      </header>

      <div className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">Hair Type</label>
          <div className="grid grid-cols-3 gap-2">
            {HAIR_TYPES.map((t) => (
              <button key={t.id} onClick={() => setHairType(t.id)}
                className={cn("text-xs uppercase tracking-widest py-3 rounded-xl border transition",
                  hairType === t.id ? "bg-terracotta border-terracotta text-white" : "border-white/15 text-sand/60 hover:border-terracotta/50")}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">Texture</label>
          <div className="grid grid-cols-3 gap-2">
            {TEXTURES.map((t) => (
              <button key={t.id} onClick={() => setTexture(t.id)}
                className={cn("text-xs uppercase tracking-widest py-3 rounded-xl border transition",
                  texture === t.id ? "bg-terracotta border-terracotta text-white" : "border-white/15 text-sand/60 hover:border-terracotta/50")}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">Lace Type</label>
          <div className="grid grid-cols-3 gap-2">
            {LACE_TYPES.map((l) => (
              <button key={l} onClick={() => setLaceType(l)}
                className={cn("text-xs uppercase tracking-widest py-3 rounded-xl border transition",
                  laceType === l ? "bg-terracotta border-terracotta text-white" : "border-white/15 text-sand/60 hover:border-terracotta/50")}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {sizesToShow.map((s) => (
              <button key={s} onClick={() => { setSizeLabel(s); setCustomSize(""); }}
                className={cn("px-4 py-2 rounded-xl border text-sm transition",
                  sizeLabel === s && !customSize ? "bg-terracotta border-terracotta text-white" : "border-white/15 text-sand/60 hover:border-terracotta/50")}>
                {s === "short" || s === "long" ? s : `${s}"`}
              </button>
            ))}
          </div>
          <Input placeholder="Or enter custom size" value={customSize} onChange={(e) => setCustomSize(e.target.value)} className="mt-2" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">Color</label>
          <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
            {COLOR_SWATCHES.map((c) => (
              <button key={c.code} onClick={() => setColorCode(c.code)} title={c.name}
                className={cn("w-full aspect-square rounded-lg border-2 transition",
                  colorCode === c.code ? "border-terracotta scale-110" : "border-white/20 hover:border-sand/50")}
                style={{ backgroundColor: c.hex }} />
            ))}
          </div>
          <p className="text-xs text-sand/50 mt-2">Selected: <span className="text-terracotta">{colorCode} — {colorName}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">Price (R)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">Stock</label>
            <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-sand/50 mb-2">Image Filename</label>
          <Input value={imageName} onChange={(e) => setImageName(e.target.value)} />
          <p className="text-xs text-sand/40 mt-1">Save your image as <code className="bg-white/5 px-1 rounded">public/images/wigs/{imageName}.png</code></p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-terracotta" />
          <span className="text-sm text-sand/80">Feature on "Featured from TikTok" page</span>
        </label>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Variant</>}
        </Button>
      </div>
    </div>
  );
}