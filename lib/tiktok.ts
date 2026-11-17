export interface TikTokVideo {
  url: string;
  videoId: string;
  title: string;
  author: string;
  cover: string;
  coverW: number;
  coverH: number;
}

// Fetch poster metadata from TikTok's oEmbed endpoint.
// Runs server-side with a 24h cache.
export async function fetchTikTokMetadata(
  url: string
): Promise<TikTokVideo | null> {
  const match = url.match(/video\/(\d+)/);
  const videoId = match?.[1];
  if (!videoId) return null;

  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
      {
        next: { revalidate: 86400 },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      console.warn(`[tiktok] ${videoId} - HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    const cover = (data.thumbnail_url as string) ?? "";
    if (!cover) return null;

    return {
      url,
      videoId,
      title: (data.title as string) ?? "",
      author: (data.author_name as string) ?? "kiaramabuza",
      cover,
      coverW: (data.thumbnail_width as number) ?? 720,
      coverH: (data.thumbnail_height as number) ?? 1280,
    };
  } catch (err) {
    console.warn(`[tiktok] ${videoId} failed:`, (err as Error).message);
    return null;
  }
}

export async function fetchTikTokVideos(
  urls: string[]
): Promise<TikTokVideo[]> {
  const results = await Promise.all(urls.map(fetchTikTokMetadata));
  return results.filter((v): v is TikTokVideo => v !== null);
}