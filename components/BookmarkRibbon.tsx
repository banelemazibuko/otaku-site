"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface BookmarkRibbonProps {
  anime: AnimeItem;
}

export function BookmarkRibbon({ anime }: BookmarkRibbonProps) {
  const { user, openAuthModal } = useAuth();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const saved = isInWatchlist(anime.malId);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      openAuthModal("signin");
      return;
    }

    if (saved) {
      removeFromWatchlist(anime.malId);
    } else {
      addToWatchlist(anime);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      aria-pressed={saved}
      className={`absolute right-0 top-0 z-10 flex h-10 w-10 items-center justify-center transition-colors ${
        saved
          ? "bg-otaku-violet text-white"
          : "bg-otaku-black/70 text-gray-300 backdrop-blur-sm hover:bg-otaku-violet hover:text-white"
      }`}
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%)",
      }}
    >
      {saved ? (
        <BookmarkCheck className="h-4 w-4 translate-x-1 -translate-y-1 fill-current" />
      ) : (
        <Bookmark className="h-4 w-4 translate-x-1 -translate-y-1" />
      )}
    </button>
  );
}
