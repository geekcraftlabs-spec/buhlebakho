import { fetchTikTokVideos } from "@/lib/tiktok";
import { TIKTOK_URLS } from "@/lib/data";
import { TikTokCard } from "./TikTokCard";

export async function TikTokGallery({
  urls = TIKTOK_URLS,
  eyebrow = "On TikTok",
  heading = "See her in motion",
}: {
  urls?: string[];
  eyebrow?: string;
  heading?: string;
}) {
  const videos = await fetchTikTokVideos(urls);

  if (videos.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-terracotta">
            {eyebrow}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-sand mt-2">
            {heading}
          </h2>
        </div>
        <a
          href="https://www.tiktok.com/@kiaramabuza"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline text-sm text-sand/60 hover:text-terracotta transition"
        >
          @kiaramabuza →
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {videos.map((video) => (
          <TikTokCard key={video.videoId} video={video} />
        ))}
      </div>
    </section>
  );
}