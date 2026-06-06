import {
  getHeroAnime,
  getPopularAnime,
  getTopRatedAnime,
  getTrendingAnime,
  searchAnime,
} from "@/lib/jikan";
import { AnimeGrid } from "@/components/AnimeGrid";
import { AnimeRow } from "@/components/AnimeRow";
import { HeroBanner } from "@/components/HeroBanner";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params.q?.trim();

  if (query) {
    const anime = await searchAnime(query);

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Results for &quot;{query}&quot;
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {anime.length} result{anime.length === 1 ? "" : "s"} found
          </p>
        </div>
        <AnimeGrid anime={anime} />
      </div>
    );
  }

  const [hero, trending, popular, topRated] = await Promise.all([
    getHeroAnime(),
    getTrendingAnime(),
    getPopularAnime(),
    getTopRatedAnime(),
  ]);

  const trendingFiltered = hero
    ? trending.filter((item) => item.malId !== hero.malId)
    : trending;

  return (
    <>
      {hero && <HeroBanner anime={hero} />}
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <AnimeRow title="Trending Now" anime={trendingFiltered} />
        <AnimeRow title="Popular" anime={popular} />
        <AnimeRow title="Top Rated" anime={topRated} />
      </div>
    </>
  );
}
