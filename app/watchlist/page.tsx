"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { AnimeGrid } from "@/components/AnimeGrid";
import { useWatchlist } from "@/contexts/WatchlistContext";

export default function WatchlistPage() {
  const { watchlist, isLoading, removeFromWatchlist, watchlistCount } =
    useWatchlist();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-otaku-grey" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[2/3] animate-pulse rounded-xl bg-otaku-grey"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          My Watchlist
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {watchlistCount === 0
            ? "You haven't saved any anime yet"
            : `${watchlistCount} anime saved`}
        </p>
      </div>

      {watchlistCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-otaku-violet/10">
            <Bookmark className="h-10 w-10 text-otaku-violet" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Your watchlist is empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-400">
            Browse trending anime and add your favorites to keep track of what
            you want to watch.
          </p>
          <Link
            href="/"
            className="mt-6 flex min-h-11 items-center rounded-lg bg-otaku-violet px-6 text-sm font-semibold text-white transition-colors hover:bg-otaku-violet-light"
          >
            Browse Anime
          </Link>
        </div>
      ) : (
        <AnimeGrid
          anime={watchlist}
          showRemove
          onRemove={removeFromWatchlist}
        />
      )}
    </div>
  );
}
