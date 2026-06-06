"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface WatchlistButtonProps {
  anime: AnimeItem;
}

export function WatchlistButton({ anime }: WatchlistButtonProps) {
  const { user, openAuthModal } = useAuth();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } =
    useWatchlist();
  const inWatchlist = isInWatchlist(anime.malId);

  function handleClick() {
    if (!user) {
      openAuthModal("signin");
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(anime.malId);
    } else {
      addToWatchlist(anime);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex min-h-11 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
        inWatchlist
          ? "border border-otaku-violet bg-otaku-violet/20 text-otaku-violet hover:bg-otaku-violet/30"
          : "border border-otaku-violet bg-otaku-violet text-white hover:bg-otaku-violet-light"
      }`}
    >
      {inWatchlist ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          In Watchlist
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          Add to Watchlist
        </>
      )}
    </button>
  );
}
