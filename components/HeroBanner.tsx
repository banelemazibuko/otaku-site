"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { WatchlistButton } from "./WatchlistButton";

interface HeroBannerProps {
  anime: AnimeItem;
}

export function HeroBanner({ anime }: HeroBannerProps) {
  return (
    <section className="relative h-[420px] w-full overflow-hidden sm:h-[480px] lg:h-[520px]">
      {anime.imageUrl && (
        <Image
          src={anime.imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-otaku-black via-otaku-black/85 to-otaku-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-otaku-black via-transparent to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-otaku-violet sm:text-sm">
            Featured
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {anime.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-300">
            {anime.score !== undefined && anime.score > 0 && (
              <span className="flex items-center gap-1.5 rounded-lg bg-otaku-grey/80 px-3 py-1 font-semibold text-yellow-400 backdrop-blur-sm">
                <Star className="h-4 w-4 fill-yellow-400" />
                {anime.score.toFixed(1)}
              </span>
            )}
            {anime.episodes !== undefined && anime.episodes > 0 && (
              <span className="rounded-lg bg-otaku-grey/80 px-3 py-1 backdrop-blur-sm">
                {anime.episodes} episodes
              </span>
            )}
          </div>

          {anime.synopsis && (
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-300 sm:text-base">
              {anime.synopsis}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/watch/${anime.malId}`}
              className="flex min-h-11 items-center gap-2 rounded-lg bg-otaku-violet px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-otaku-violet-light"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Now
            </Link>
            <WatchlistButton anime={anime} />
          </div>
        </div>
      </div>
    </section>
  );
}
