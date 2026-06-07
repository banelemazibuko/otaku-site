import { ANIME } from "@consumet/extensions";
import { StreamResponse } from "./types";

interface StreamApiConfig {
  baseUrl: string;
  provider: string;
  timeoutMs: number;
}

interface SearchResult {
  id: string;
  title?: string;
}

interface EpisodeInfo {
  id: string;
  number?: number;
}

interface AnimeInfoResponse {
  id?: string;
  episodes?: EpisodeInfo[];
}

interface StreamSource {
  url: string;
  isM3U8?: boolean;
  type?: string;
}

interface WatchResponse {
  sources?: StreamSource[];
}

type AnimeProvider = {
  search: (query: string) => Promise<{ results?: SearchResult[] }>;
  fetchAnimeInfo: (id: string) => Promise<AnimeInfoResponse>;
  fetchEpisodeSources: (
    episodeId: string
  ) => Promise<{ sources?: StreamSource[] }>;
};

function getTimeoutMs(): number {
  const parsed = Number(process.env.STREAM_FETCH_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15000;
}

function usesDirectMode(): boolean {
  const baseUrl = process.env.NEXT_PUBLIC_STREAM_API_URL?.trim();
  return !baseUrl || baseUrl.toLowerCase() === "direct";
}

export function getStreamApiConfig(): StreamApiConfig {
  const baseUrl = process.env.NEXT_PUBLIC_STREAM_API_URL?.replace(/\/$/, "");

  if (!baseUrl || baseUrl.toLowerCase() === "direct") {
    throw new Error(
      "External stream API URL is not configured. Using built-in direct mode."
    );
  }

  return {
    baseUrl,
    provider: process.env.NEXT_PUBLIC_STREAM_PROVIDER ?? "anime/hianime",
    timeoutMs: getTimeoutMs(),
  };
}

function getDirectProvider(): AnimeProvider {
  const providerPath = (
    process.env.NEXT_PUBLIC_STREAM_PROVIDER ?? "anime/hianime"
  ).toLowerCase();

  if (providerPath.includes("animepahe")) {
    return new ANIME.AnimePahe() as unknown as AnimeProvider;
  }

  if (providerPath.includes("animekai")) {
    return new ANIME.AnimeKai() as unknown as AnimeProvider;
  }

  return new ANIME.Hianime() as unknown as AnimeProvider;
}

async function fetchWithTimeout(
  url: string,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

function pickSearchResult(
  results: SearchResult[],
  title: string
): SearchResult | null {
  if (results.length === 0) return null;

  const normalized = title.trim().toLowerCase();
  const exact = results.find(
    (item) => item.title?.trim().toLowerCase() === normalized
  );

  return exact ?? results[0];
}

function pickEpisode(
  episodes: EpisodeInfo[],
  episodeNumber: number
): EpisodeInfo | null {
  if (episodes.length === 0) return null;

  const byNumber = episodes.find((ep) => ep.number === episodeNumber);
  if (byNumber) return byNumber;

  const byIndex = episodes[episodeNumber - 1];
  return byIndex ?? null;
}

function extractM3u8Url(sources: StreamSource[] | undefined): string | null {
  if (!sources || sources.length === 0) return null;

  const hlsSource =
    sources.find((s) => s.isM3U8) ??
    sources.find((s) => s.url.includes(".m3u8")) ??
    sources[0];

  return hlsSource?.url ?? null;
}

async function resolveStreamUrlDirect(
  title: string,
  episodeNumber: number
): Promise<StreamResponse> {
  try {
    const provider = getDirectProvider();
    const searchData = await provider.search(title);
    const match = pickSearchResult(searchData.results ?? [], title);

    if (!match?.id) {
      return { error: "No matching anime found on the stream provider." };
    }

    const infoData = await provider.fetchAnimeInfo(match.id);
    const episode = pickEpisode(infoData.episodes ?? [], episodeNumber);

    if (!episode?.id) {
      return {
        error: `Episode ${episodeNumber} is not available on the stream provider.`,
      };
    }

    const watchData = await provider.fetchEpisodeSources(episode.id);
    const url = extractM3u8Url(watchData.sources);

    if (!url) {
      return { error: "No HLS stream source returned for this episode." };
    }

    return { url };
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown provider error";
    return {
      error: `Unable to fetch stream from the built-in provider: ${detail}`,
    };
  }
}

async function resolveStreamUrlRemote(
  title: string,
  episodeNumber: number
): Promise<StreamResponse> {
  let config: StreamApiConfig;

  try {
    config = getStreamApiConfig();
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Stream API is not configured.",
    };
  }

  const { baseUrl, provider, timeoutMs } = config;

  try {
    const searchUrl = `${baseUrl}/${provider}/${encodeURIComponent(title)}`;
    const searchResponse = await fetchWithTimeout(searchUrl, timeoutMs);

    if (!searchResponse.ok) {
      return {
        error: `Stream search failed (${searchResponse.status}). The provider may be offline.`,
      };
    }

    const searchData = (await searchResponse.json()) as {
      results?: SearchResult[];
    };
    const match = pickSearchResult(searchData.results ?? [], trimmedTitle(title));

    if (!match?.id) {
      return { error: "No matching anime found on the stream provider." };
    }

    const infoUrl = `${baseUrl}/${provider}/info?id=${encodeURIComponent(match.id)}`;
    const infoResponse = await fetchWithTimeout(infoUrl, timeoutMs);

    if (!infoResponse.ok) {
      return {
        error: `Failed to load anime episodes (${infoResponse.status}).`,
      };
    }

    const infoData = (await infoResponse.json()) as AnimeInfoResponse;
    const episode = pickEpisode(infoData.episodes ?? [], episodeNumber);

    if (!episode?.id) {
      return {
        error: `Episode ${episodeNumber} is not available on the stream provider.`,
      };
    }

    const watchUrl = `${baseUrl}/${provider}/watch/${encodeURIComponent(episode.id)}`;
    const watchResponse = await fetchWithTimeout(watchUrl, timeoutMs);

    if (!watchResponse.ok) {
      return {
        error: `Stream link not found (${watchResponse.status}). Try another episode or provider.`,
      };
    }

    const watchData = (await watchResponse.json()) as WatchResponse;
    const url = extractM3u8Url(watchData.sources);

    if (!url) {
      return { error: "No HLS stream source returned for this episode." };
    }

    return { url };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { error: "Stream request timed out. Please try again." };
    }

    return {
      error: "Unable to reach the stream provider. Check your API URL.",
    };
  }
}

function trimmedTitle(title: string): string {
  return title.trim();
}

export async function resolveStreamUrl(
  title: string,
  episodeNumber: number
): Promise<StreamResponse> {
  const normalizedTitle = trimmedTitle(title);

  if (!normalizedTitle) {
    return { error: "Anime title is required to resolve a stream." };
  }

  if (!Number.isFinite(episodeNumber) || episodeNumber < 1) {
    return { error: "Invalid episode number." };
  }

  if (usesDirectMode()) {
    return resolveStreamUrlDirect(normalizedTitle, episodeNumber);
  }

  return resolveStreamUrlRemote(normalizedTitle, episodeNumber);
}
