import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buhlebakho.vercel.app"),
  title: "Buhle Bakho by Kiara Mabuza | Human & Synthetic Wigs",
  description:
    "Your beauty. Your crown. Your rules. Premium human and synthetic wigs, delivered in 2-3 days nationwide.",
  keywords: [
    "wigs",
    "synthetic wigs",
    "human hair wigs",
    "South Africa wigs",
    "glueless wigs",
    "bob wigs",
    "double drawn wigs",
    "Buhle Bakho",
    "Kiara Mabuza",
  ],
  authors: [{ name: "Kiara Mabuza" }],
  creator: "Kiara Mabuza",
  publisher: "Buhle Bakho",
  openGraph: {
    title: "Buhle Bakho by Kiara Mabuza",
    description:
      "Your beauty. Your crown. Your rules. Human and synthetic wigs delivered in 2-3 days.",
    url: "https://buhlebakho.vercel.app",
    siteName: "Buhle Bakho",
    type: "website",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buhle Bakho by Kiara Mabuza",
    description: "Your beauty. Your crown. Your rules.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}