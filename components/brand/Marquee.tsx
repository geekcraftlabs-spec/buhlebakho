import { BUSINESS_NAME } from "@/lib/data";

const ITEMS = [
  BUSINESS_NAME,
  "Your beauty",
  "Your crown",
  "Your rules",
  "Premium human hair",
  "Same-day processing",
  "2-3 day delivery",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-sand/10 py-8">
      <div className="flex animate-marquee whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-10 px-5">
            {ITEMS.map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                <span className="font-display text-3xl md:text-4xl text-sand/70 italic">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}