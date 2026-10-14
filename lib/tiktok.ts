export interface TikTokVideo {
  url: string;
  videoId: string;
  thumbnail: string;
  title: string;
  author: string;
}

export async function fetchTikTokVideos(urls: string[]): Promise<TikTokVideo[]> {
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
          { next: { revalidate: 3600 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return {
          url,
          videoId: url.match(/video\/(\d+)/)?.[1] ?? "",
          thumbnail: data.thumbnail_url as string,
          title: (data.title as string) ?? "",
          author: (data.author_name as string) ?? "",
        };
      } catch {
        return null;
      }
    })
  );
  return results.filter((v): v is TikTokVideo => v !== null);
}