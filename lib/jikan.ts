import { AnimeItem } from "./types";

const JIKAN_BASE = "https://api.jikan.moe/v4";

interface JikanAnime {
  mal_id: number;
  title: string;
  images?: {
    jpg?: {
      image_url?: string;
      large_image_url?: string;
    };
  };
  score?: number;
  episodes?: number;
  synopsis?: string;
}

interface JikanResponse {
  data: JikanAnime | JikanAnime[];
}

function mapAnime(anime: JikanAnime): AnimeItem {
  return {
    malId: anime.mal_id,
    title: anime.title,
    imageUrl:
      anime.images?.jpg?.large_image_url ??
      anime.images?.jpg?.image_url ??
      "",
    score: anime.score ?? undefined,
    episodes: anime.episodes ?? undefined,
    synopsis: anime.synopsis ?? undefined,
  };
}

async function fetchJikan<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${JIKAN_BASE}${path}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchAnimeList(path: string): Promise<AnimeItem[]> {
  const result = await fetchJikan<JikanResponse>(path);

  if (!result?.data || !Array.isArray(result.data)) {
    return [];
  }

  return result.data.map(mapAnime);
}

export async function getTopAnime(): Promise<AnimeItem[]> {
  return fetchAnimeList("/top/anime?limit=24");
}

export async function getTrendingAnime(): Promise<AnimeItem[]> {
  return fetchAnimeList("/top/anime?filter=airing&limit=12");
}

export async function getPopularAnime(): Promise<AnimeItem[]> {
  return fetchAnimeList("/top/anime?filter=bypopularity&limit=12");
}

export async function getTopRatedAnime(): Promise<AnimeItem[]> {
  return fetchAnimeList("/top/anime?filter=favorite&limit=12");
}

export async function getHeroAnime(): Promise<AnimeItem | null> {
  const trending = await fetchAnimeList("/top/anime?filter=airing&limit=1");

  if (trending.length === 0) {
    return null;
  }

  const featured = trending[0];
  const full = await getAnimeById(featured.malId);

  return full ?? featured;
}

export async function searchAnime(query: string): Promise<AnimeItem[]> {
  const encoded = encodeURIComponent(query.trim());
  return fetchAnimeList(`/anime?q=${encoded}&limit=24`);
}

export async function getAnimeById(malId: number): Promise<AnimeItem | null> {
  const result = await fetchJikan<JikanResponse>(`/anime/${malId}/full`);

  if (!result?.data || Array.isArray(result.data)) {
    return null;
  }

  return mapAnime(result.data);
}
