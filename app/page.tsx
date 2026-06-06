import { getTopAnime, searchAnime } from "@/lib/jikan";
import { AnimeGrid } from "@/components/AnimeGrid";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params.q?.trim();
  const anime = query ? await searchAnime(query) : await getTopAnime();
  const title = query ? `Results for "${query}"` : "Trending Anime";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">
          {query
            ? `${anime.length} result${anime.length === 1 ? "" : "s"} found`
            : "Discover the most popular anime on MyAnimeList"}
        </p>
      </div>

      <AnimeGrid anime={anime} />
    </div>
  );
}
