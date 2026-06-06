import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star } from "lucide-react";
import { WatchlistButton } from "@/components/WatchlistButton";
import { getAnimeById } from "@/lib/jikan";

interface AnimeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { id } = await params;
  const malId = Number(id);

  if (Number.isNaN(malId)) {
    notFound();
  }

  const anime = await getAnimeById(malId);

  if (!anime) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-xs overflow-hidden rounded-2xl border border-otaku-violet/20 bg-otaku-grey shadow-xl shadow-black/40 lg:mx-0 lg:max-w-none">
          {anime.imageUrl ? (
            <Image
              src={anime.imageUrl}
              alt={anime.title}
              fill
              priority
              sizes="(max-width: 1024px) 320px, 320px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {anime.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
            {anime.score !== undefined && anime.score > 0 && (
              <span className="flex items-center gap-1.5 rounded-lg bg-otaku-grey px-3 py-1.5 font-semibold text-yellow-400">
                <Star className="h-4 w-4 fill-yellow-400" />
                {anime.score.toFixed(1)}
              </span>
            )}
            {anime.episodes !== undefined && anime.episodes > 0 && (
              <span>{anime.episodes} episodes</span>
            )}
          </div>

          {anime.synopsis && (
            <p className="mt-6 leading-relaxed text-gray-300">
              {anime.synopsis}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <WatchlistButton anime={anime} />
            <button
              type="button"
              disabled
              className="flex min-h-11 cursor-not-allowed items-center gap-2 rounded-lg border border-otaku-violet/30 bg-otaku-grey px-5 py-2.5 text-sm font-semibold text-gray-400"
              title="Streaming coming soon"
            >
              <Play className="h-4 w-4" />
              Watch Now
            </button>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex text-sm text-otaku-violet transition-colors hover:text-otaku-violet-light"
          >
            ← Back to browse
          </Link>
        </div>
      </div>
    </div>
  );
}
