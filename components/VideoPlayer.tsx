"use client";

import { useRef } from "react";
import { Play } from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface VideoPlayerProps {
  anime: AnimeItem;
  currentEpisode: number;
}

export function VideoPlayer({ anime, currentEpisode }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user, openAuthModal } = useAuth();
  const { markEpisodeWatched } = useWatchlist();

  function handlePlay() {
    if (!user) {
      videoRef.current?.pause();
      openAuthModal("signin");
      return;
    }

    markEpisodeWatched(anime.malId, currentEpisode);
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-white">
        Episode {currentEpisode}
      </h2>
      <div className="relative overflow-hidden rounded-2xl border border-otaku-violet/20 bg-otaku-grey shadow-xl shadow-black/40">
        <video
          ref={videoRef}
          key={currentEpisode}
          controls
          poster={anime.imageUrl || undefined}
          className="aspect-video w-full bg-otaku-black"
          onPlay={handlePlay}
        >
          <track kind="captions" />
        </video>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 rounded-lg bg-otaku-black/70 px-4 py-3 backdrop-blur-sm">
            <Play className="h-8 w-8 text-otaku-violet/80" />
            <p className="text-xs font-medium text-gray-300">
              Placeholder player — real streams coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
