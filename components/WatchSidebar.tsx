import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { WatchlistButton } from "./WatchlistButton";

interface WatchSidebarProps {
  anime: AnimeItem;
  episodeCount: number;
}

export function WatchSidebar({ anime, episodeCount }: WatchSidebarProps) {
  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-otaku-violet/20 bg-otaku-grey p-4 lg:p-5">
      <Link
        href={`/anime/${anime.malId}`}
        className="inline-flex items-center gap-2 text-sm text-otaku-violet transition-colors hover:text-otaku-violet-light"
      >
        <ArrowLeft className="h-4 w-4" />
        View details
      </Link>

      <div className="relative mx-auto aspect-[2/3] w-full max-w-[180px] overflow-hidden rounded-xl bg-otaku-black lg:max-w-none">
        {anime.imageUrl ? (
          <Image
            src={anime.imageUrl}
            alt={anime.title}
            fill
            sizes="(max-width: 1024px) 180px, 280px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>

      <div>
        <h1 className="text-lg font-bold leading-snug text-white lg:text-xl">
          {anime.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          {anime.score !== undefined && anime.score > 0 && (
            <span className="flex items-center gap-1 rounded-md bg-otaku-black px-2 py-1 text-xs font-semibold text-yellow-400">
              <Star className="h-3 w-3 fill-yellow-400" />
              {anime.score.toFixed(1)}
            </span>
          )}
          <span className="text-xs">{episodeCount} episodes</span>
        </div>
      </div>

      {anime.synopsis && (
        <p className="line-clamp-6 text-sm leading-relaxed text-gray-400">
          {anime.synopsis}
        </p>
      )}

      <WatchlistButton anime={anime} />
    </aside>
  );
}
