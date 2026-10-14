import { Flower2 } from "lucide-react";
import { TAGLINE } from "@/lib/data";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  showSubtitle?: boolean;
}

const SIZES = {
  sm: {
    icon: 18,
    eyebrow: "text-[9px]",
    word: "text-2xl md:text-3xl",
    tag: "text-xs",
    gap: "mb-2",
  },
  md: {
    icon: 28,
    eyebrow: "text-xs",
    word: "text-4xl md:text-5xl",
    tag: "text-sm",
    gap: "mb-3",
  },
  lg: {
    icon: 44,
    eyebrow: "text-sm",
    word: "text-6xl md:text-7xl lg:text-8xl",
    tag: "text-base md:text-lg",
    gap: "mb-4",
  },
};

export function Logo({
  size = "md",
  showTagline = true,
  showSubtitle = true,
}: LogoProps) {
  const s = SIZES[size];

  return (
    <div className="flex flex-col items-center text-center">
      <Flower2
        size={s.icon}
        className={`text-terracotta ${s.gap}`}
      />
      {showSubtitle && (
        <p
          className={`${s.eyebrow} tracking-[0.4em] uppercase text-terracotta ${s.gap}`}
        >
          By Kiara Mabuza
        </p>
      )}
      <h1
        className={`font-display ${s.word} tracking-tight leading-none`}
      >
        <span className="text-sand">Buhle</span>{" "}
        <span className="text-terracotta">Bakho</span>
      </h1>
      {showTagline && (
        <p
          className={`${s.tag} italic text-sand/60 mt-3 font-light tracking-wide`}
        >
          {TAGLINE}
        </p>
      )}
    </div>
  );
}