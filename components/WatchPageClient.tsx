"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { EpisodeGrid } from "./EpisodeGrid";
import { VideoPlayer } from "./VideoPlayer";
import { WatchSidebar } from "./WatchSidebar";

interface WatchPageClientProps {
  anime: AnimeItem;
  initialEpisode: number;
}

function getEpisodeCount(anime: AnimeItem): number {
  return anime.episodes && anime.episodes > 0 ? anime.episodes : 1;
}

export function WatchPageClient({ anime, initialEpisode }: WatchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerRef = useRef<HTMLDivElement>(null);
  const episodeCount = getEpisodeCount(anime);

  const epParam = searchParams.get("ep");
  const parsedEp = epParam ? Number(epParam) : initialEpisode;
  const currentEpisode = Math.min(
    Math.max(Number.isNaN(parsedEp) ? initialEpisode : parsedEp, 1),
    episodeCount
  );

  const handleSelectEpisode = useCallback(
    (episode: number) => {
      router.replace(`/watch/${anime.malId}?ep=${episode}`, { scroll: false });

      if (window.innerWidth < 1024) {
        playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [anime.malId, router]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Link
        href={`/anime/${anime.malId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-otaku-violet transition-colors hover:text-otaku-violet-light"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {anime.title}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div ref={playerRef}>
            <VideoPlayer anime={anime} currentEpisode={currentEpisode} />
          </div>

          <EpisodeGrid
            malId={anime.malId}
            episodeCount={episodeCount}
            currentEpisode={currentEpisode}
            onSelectEpisode={handleSelectEpisode}
          />

          <div className="lg:hidden">
            <WatchSidebar anime={anime} episodeCount={episodeCount} />
          </div>
        </div>

        <div className="hidden lg:block">
          <WatchSidebar anime={anime} episodeCount={episodeCount} />
        </div>
      </div>
    </div>
  );
}
