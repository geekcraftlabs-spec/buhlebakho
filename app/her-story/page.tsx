import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

export default function HerStoryPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-32">
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
              Ink. Lace. And a whole lot of personality.
            </h2>
            <div className="space-y-6 text-sand/70 leading-relaxed text-lg">
              <p>
                By day, Kiara is behind the needle — a tattoo artist with a
                steady hand and an eye for detail. By night, she&apos;s
                transforming looks with wigs that make people stop scrolling.
              </p>
              <p>
                Buhle Bakho started as a way for her to share that magic. Not
                just the hair itself, but the feeling — the moment you look in
                the mirror and remember that your beauty was never up for
                debate.
              </p>
              <p>
                Every piece in the collection is hand-picked by Kiara, styled
                the way she&apos;d wear it herself, and delivered with the same
                care she brings to her art.
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

        {/* WIG TIKTOKS */}
        <section className="px-6 py-24 border-t border-sand/10">
          <div className="max-w-7xl mx-auto">
            <TikTokGallery
              eyebrow="The hair"
              heading="Wigs in the wild"
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 py-16 border-t border-sand/10">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <p className="font-display text-2xl text-sand">
              Buhle <span className="text-terracotta">Bakho</span>
            </p>
            <p className="text-xs uppercase tracking-widest text-sand/40">
              Your beauty · Your crown · Your rules
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}