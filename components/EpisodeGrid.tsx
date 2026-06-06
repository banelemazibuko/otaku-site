"use client";

import { Check } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface EpisodeGridProps {
  malId: number;
  episodeCount: number;
  currentEpisode: number;
  onSelectEpisode: (episode: number) => void;
}

export function EpisodeGrid({
  malId,
  episodeCount,
  currentEpisode,
  onSelectEpisode,
}: EpisodeGridProps) {
  const { isEpisodeWatched } = useWatchlist();
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Episodes
      </h3>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {episodes.map((ep) => {
          const watched = isEpisodeWatched(malId, ep);
          const active = ep === currentEpisode;

          return (
            <button
              key={ep}
              type="button"
              onClick={() => onSelectEpisode(ep)}
              aria-current={active ? "true" : undefined}
              aria-label={`Episode ${ep}${watched ? ", watched" : ""}`}
              className={`relative flex min-h-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                active
                  ? "border-otaku-violet bg-otaku-violet text-white"
                  : watched
                    ? "border-otaku-violet/20 bg-otaku-grey/50 text-gray-500"
                    : "border-otaku-violet/20 bg-otaku-grey text-gray-200 hover:border-otaku-violet/50 hover:text-white"
              }`}
            >
              {watched && (
                <Check
                  className={`absolute left-1 top-1 h-3 w-3 ${
                    active ? "text-white" : "text-otaku-violet"
                  }`}
                  aria-hidden="true"
                />
              )}
              {ep}
            </button>
          );
        })}
      </div>
    </div>
  );
}
