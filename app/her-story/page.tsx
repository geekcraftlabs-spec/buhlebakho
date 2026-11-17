import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { SiteNav } from "@/components/navigation/SiteNav";
import { Button } from "@/components/ui/Button";
import { BeadworkDivider } from "@/components/brand/BeadworkDivider";
import { TikTokGallery } from "@/components/tiktok/TikTokGallery";
import { TATTOO_URLS } from "@/lib/data";

export const metadata = {
  title: "Her Story | Buhle Bakho",
  description:
    "Meet Kiara Mabuza — tattoo artist, wig lover, and the soul behind Buhle Bakho.",
};

export const revalidate = 3600;

export default function HerStoryPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-32">
        {/* Top nav pills — desktop only */}
        <section className="px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="hidden lg:flex flex-wrap gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-sand/20 text-sand/70 hover:border-sand/40 transition"
              >
                <Home size={12} /> Home
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-sand/20 text-sand/70 hover:border-sand/40 transition"
              >
                Shop
              </Link>
            </div>
          </div>
        </section>

        {/* HERO */}
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-terracotta">
              Her Story
            </p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-sand leading-[0.95] tracking-tight">
              Meet <span className="italic text-terracotta">Kiara.</span>
            </h1>
            <p className="text-lg md:text-xl text-sand/60 max-w-xl leading-relaxed pt-2">
              Tattoo artist. Wig lover. The woman behind Buhle Bakho.
            </p>
          </div>
        </section>

        {/* PHOTO GRID */}
        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {["kiara1", "kiara2", "kiara3", "kiara4"].map((name, i) => (
              <div
                key={name}
                className={`relative rounded-3xl overflow-hidden border border-sand/10 aspect-[3/4] ${
                  i % 2 === 1 ? "md:translate-y-8" : ""
                }`}
              >
                <Image
                  src={`/images/kiara/${name}.jpg`}
                  alt={`Kiara Mabuza — photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </section>

        <BeadworkDivider className="my-8" />

        {/* STORY TEXT */}
        <section className="px-6 py-24">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-display text-4xl md:text-5xl text-sand leading-tight">
              Hair, ink, and everything in between.
            </h2>
            <div className="space-y-6 text-sand/70 leading-relaxed text-lg">
              <p>
                Kiara&apos;s been in the tattoo chair for years — drawing,
                shading, and turning ideas into something permanent. It taught
                her an eye for detail and the patience to get things right the
                first time.
              </p>
              <p>
                When she started wearing wigs, she brought the same approach
                to hair. She wanted pieces that felt natural, sat right, and
                actually lasted. When she couldn&apos;t find what she was
                looking for, she started sourcing them herself.
              </p>
              <p>
                Buhle Bakho is what came out of that. Every wig is hand-picked
                by Kiara, and every order is packed with the same care she
                brings to her work. If it&apos;s not something she&apos;d wear,
                it doesn&apos;t make it to the shop.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/shop">
                <Button size="lg" className="group">
                  Shop her picks
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* WIG TIKTOKS */}
        <section className="px-6 py-24 border-t border-sand/10">
          <div className="max-w-7xl mx-auto">
            <TikTokGallery
              eyebrow="The hair"
              heading="Wigs in the wild"
            />
          </div>
        </section>

        {/* TATTOO ARTISTRY */}
        <section className="px-6 py-24 border-t border-sand/10">
          <div className="max-w-7xl mx-auto">
            <TikTokGallery
              urls={TATTOO_URLS}
              eyebrow="The artist"
              heading="Ink in motion"
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 py-16 border-t border-sand/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <p className="font-display text-2xl text-sand">
                Buhle <span className="text-terracotta">Bakho</span>
              </p>
              <p className="text-xs uppercase tracking-widest text-sand/40">
                Your beauty · Your crown · Your rules
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-sand/60">
              <a
                href="https://www.instagram.com/kiara.lukhele_"
                target="_blank"
                rel="noreferrer"
                className="hover:text-terracotta transition"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@kiaramabuza"
                target="_blank"
                rel="noreferrer"
                className="hover:text-terracotta transition"
              >
                TikTok
              </a>
              <a
                href="https://wa.me/27682852438"
                target="_blank"
                rel="noreferrer"
                className="hover:text-terracotta transition"
              >
                WhatsApp
              </a>
            </div>
            <p className="text-xs text-sand/40">
              © {new Date().getFullYear()} Buhle Bakho
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}