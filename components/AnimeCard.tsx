import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AnimeItem } from "@/lib/types";

interface AnimeCardProps {
  anime: AnimeItem;
  showRemove?: boolean;
  onRemove?: (malId: number) => void;
}

export function AnimeCard({ anime, showRemove, onRemove }: AnimeCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-otaku-violet/10 bg-otaku-grey transition-all duration-300 hover:border-otaku-violet/40 hover:shadow-lg hover:shadow-otaku-violet/10">
      <Link href={`/anime/${anime.malId}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[2/3] overflow-hidden bg-otaku-black">
          {anime.imageUrl ? (
            <Image
              src={anime.imageUrl}
              alt={anime.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No image
            </div>
          )}

          {anime.score !== undefined && anime.score > 0 && (
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-otaku-black/80 px-2 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400" />
              {anime.score.toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-otaku-violet">
            {anime.title}
          </h3>
          {anime.episodes !== undefined && anime.episodes > 0 && (
            <p className="mt-1 text-xs text-gray-400">
              {anime.episodes} episodes
            </p>
          )}
        </div>
      </Link>

      {showRemove && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(anime.malId)}
          className="mx-3 mb-3 rounded-lg border border-red-500/30 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
        >
          Remove from Watchlist
        </button>
      )}
    </article>
  );
}
