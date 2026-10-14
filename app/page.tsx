import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/navigation/SiteNav";
import { Button } from "@/components/ui/Button";
import { TikTokGallery } from "@/components/tiktok/TikTokGallery";
import { BeadworkCorner } from "@/components/brand/BeadworkCorner";
import { BeadworkDivider } from "@/components/brand/BeadworkDivider";
import { Marquee } from "@/components/brand/Marquee";
import { CATEGORIES } from "@/lib/catalog";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
              <p className="text-xs uppercase tracking-[0.35em] text-terracotta">
                Buhle Bakho
              </p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-sand leading-[0.95] tracking-tight">
                Your beauty.
                <br />
                Your crown.
                <br />
                <span className="italic text-terracotta">Your rules.</span>
              </h1>
              <p className="text-lg text-sand/60 max-w-md leading-relaxed">
                Human blends, Futura fibres, and made-to-order 100% human
                hair. Same-day processing. 2-3 day nationwide delivery.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/shop">
                  <Button size="lg" className="group">
                    Shop the collection
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </Link>
                <Link href="/her-story">
                  <Button size="lg" variant="secondary">
                    Meet Kiara
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none rounded-[2rem] overflow-hidden border border-sand/10">
                <Image
                  src="/images/kiara/kiara1.jpg"
                  alt="Kiara Mabuza wearing a Buhle Bakho wig"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <BeadworkCorner className="absolute top-6 left-6" />
                <BeadworkCorner className="absolute bottom-6 right-6 rotate-180" />
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <Marquee />

        {/* FEATURED — now uses category cards */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto space-y-12">
            <header className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
                  Shop by category
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-sand mt-2">
                  Three collections
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline text-sm text-sand/60 hover:text-terracotta transition"
              >
                View all →
              </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.id}`}
                  className="group block bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-terracotta/40 transition"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
                    <Image
                      src={cat.heroImage}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p
                        className="text-[10px] uppercase tracking-[0.3em] mb-2"
                        style={{ color: cat.accentColor }}
                      >
                        {cat.tagline}
                      </p>
                      <h3 className="font-display text-3xl text-sand">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-sand/60 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-2 text-terracotta text-sm uppercase tracking-widest mt-4 group-hover:gap-4 transition-all">
                      Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <BeadworkDivider className="my-8" />

        {/* BRAND STATEMENT */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-sand/10">
                <Image
                  src="/images/kiara/kiara2.jpg"
                  alt="Kiara Mabuza"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
                The story
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-sand leading-tight">
                Beauty isn&apos;t borrowed.
                <br />
                It was always yours.
              </h2>
              <p className="text-sand/60 leading-relaxed max-w-lg text-lg">
                Buhle Bakho started with a simple idea — that every woman
                deserves to feel like the best version of herself. Whether you
                want a premium human blend, a bold Futura fibre, or a custom
                wig made just for you, we&apos;ve got you.
              </p>
              <Link
                href="/her-story"
                className="inline-flex items-center gap-2 text-terracotta text-sm uppercase tracking-widest hover:gap-4 transition-all"
              >
                Read her story →
              </Link>
            </div>
          </div>
        </section>

        {/* TIKTOK */}
        <section className="px-6 py-24 border-t border-sand/10">
          <div className="max-w-7xl mx-auto">
            <TikTokGallery />
          </div>
        </section>

        {/* HER STORY CTA */}
        <section className="px-6 py-24 border-t border-sand/10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
              Behind the brand
            </p>
            <h2 className="font-display text-5xl md:text-7xl text-sand leading-tight">
              Meet the woman
              <br />
              behind the <span className="italic text-terracotta">crown.</span>
            </h2>
            <p className="text-sand/60 max-w-xl mx-auto text-lg">
              Tattoo artist. Wig lover. And the soul behind Buhle Bakho.
            </p>
            <div className="pt-4">
              <Link href="/her-story">
                <Button size="lg" className="group">
                  Read her story
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-t border-sand/10 px-6 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Same-day", value: "Processing" },
              { label: "2-3 Days", value: "Delivery" },
              { label: "3 Types", value: "Of Hair" },
              { label: "Nationwide", value: "Shipping" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl md:text-3xl text-terracotta">
                  {stat.label}
                </p>
                <p className="text-xs uppercase tracking-widest text-sand/50 mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="px-6 py-16 border-t border-sand/10">
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