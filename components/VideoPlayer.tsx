"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { AnimeItem, StreamResponse } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface VideoPlayerProps {
  anime: AnimeItem;
  currentEpisode: number;
}

type PlayerState = "loading" | "ready" | "error";

const CLIENT_TIMEOUT_MS = 16000;

export function VideoPlayer({ anime, currentEpisode }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { user, openAuthModal } = useAuth();
  const { markEpisodeWatched } = useWatchlist();
  const [playerState, setPlayerState] = useState<PlayerState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const attachStream = useCallback(
    (url: string) => {
      const video = videoRef.current;
      if (!video) return;

      destroyHls();
      video.removeAttribute("src");
      video.load();

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            setPlayerState("error");
            setErrorMessage(
              "Playback failed. The stream may have expired or is unavailable."
            );
            destroyHls();
          }
        });

        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else {
        setPlayerState("error");
        setErrorMessage("HLS playback is not supported in this browser.");
        return;
      }

      setPlayerState("ready");
    },
    [destroyHls]
  );

  const loadStream = useCallback(async () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    destroyHls();
    setPlayerState("loading");
    setErrorMessage("");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    try {
      const params = new URLSearchParams({
        malId: String(anime.malId),
        episode: String(currentEpisode),
        title: anime.title,
      });

      const response = await fetch(`/api/stream?${params.toString()}`, {
        signal: controller.signal,
      });

      const data = (await response.json()) as StreamResponse;

      if (!response.ok || !data.url) {
        setPlayerState("error");
        setErrorMessage(
          data.error ?? "Unable to load stream for this episode."
        );
        return;
      }

      attachStream(data.url);
    } catch (error) {
      setPlayerState("error");
      setErrorMessage(
        error instanceof Error && error.name === "AbortError"
          ? "Stream request timed out. Please try again."
          : "Failed to connect to the stream service."
      );
    } finally {
      clearTimeout(timer);
    }
  }, [anime.malId, anime.title, attachStream, currentEpisode, destroyHls]);

  useEffect(() => {
    loadStream();

    return () => {
      destroyHls();
    };
  }, [loadStream, destroyHls, retryKey]);

  function handlePlay() {
    if (!user) {
      videoRef.current?.pause();
      openAuthModal("signin");
      return;
    }

    markEpisodeWatched(anime.malId, currentEpisode);
  }

  function handleRetry() {
    setRetryKey((key) => key + 1);
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

        {playerState === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-otaku-black/75 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-otaku-violet" />
            <p className="text-sm font-medium text-gray-300">Loading stream...</p>
          </div>
        )}

        {playerState === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-otaku-black/85 px-6 text-center backdrop-blur-sm">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-white">
                Stream unavailable
              </p>
              <p className="mt-2 max-w-md text-sm text-gray-400">
                {errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="flex min-h-10 items-center gap-2 rounded-lg bg-otaku-violet px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-otaku-violet-light"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
