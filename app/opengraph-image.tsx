import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Buhle Bakho by Kiara Mabuza";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a0f0a",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(194, 65, 12, 0.28) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(245, 230, 211, 0.14) 0%, transparent 55%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Flower icon — Lucide Flower2 path */}
        <svg
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c2410c"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: 32 }}
        >
          <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1" />
          <circle cx="12" cy="8" r="2" />
          <path d="M12 10v12M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5ZM12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z" />
        </svg>

        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#c2410c",
            marginBottom: 24,
          }}
        >
          By Kiara Mabuza
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 118,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          <span style={{ color: "#f5e6d3" }}>BUHLE</span>
          <span style={{ color: "#c2410c" }}>BAKHO</span>
        </div>

        <div
          style={{
            fontSize: 30,
            fontStyle: "italic",
            color: "#d4c5b9",
            marginTop: 44,
          }}
        >
          Your beauty. Your crown. Your rules.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 64,
            fontSize: 20,
            letterSpacing: "0.2em",
            color: "#8a7264",
          }}
        >
          buhlebakho.co.za
        </div>
      </div>
    ),
    size
  );
}