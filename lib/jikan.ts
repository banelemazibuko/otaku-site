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

export async function getTopAnime(): Promise<AnimeItem[]> {
  const result = await fetchJikan<JikanResponse>("/top/anime?limit=24");

  if (!result?.data || !Array.isArray(result.data)) {
    return [];
  }

  return result.data.map(mapAnime);
}

export async function searchAnime(query: string): Promise<AnimeItem[]> {
  const encoded = encodeURIComponent(query.trim());
  const result = await fetchJikan<JikanResponse>(
    `/anime?q=${encoded}&limit=24`
  );

  if (!result?.data || !Array.isArray(result.data)) {
    return [];
  }

  return result.data.map(mapAnime);
}

export async function getAnimeById(malId: number): Promise<AnimeItem | null> {
  const result = await fetchJikan<JikanResponse>(`/anime/${malId}/full`);

  if (!result?.data || Array.isArray(result.data)) {
    return null;
  }

  return mapAnime(result.data);
}
