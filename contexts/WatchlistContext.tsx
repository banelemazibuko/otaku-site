"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimeItem } from "@/lib/types";

const WATCHLIST_STORAGE_KEY = "otaku_watchlist";

interface WatchlistContextValue {
  watchlist: AnimeItem[];
  watchlistCount: number;
  isLoading: boolean;
  addToWatchlist: (anime: AnimeItem) => void;
  removeFromWatchlist: (malId: number) => void;
  isInWatchlist: (malId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored) as AnimeItem[]);
      }
    } catch {
      localStorage.removeItem(WATCHLIST_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToWatchlist = useCallback(
    (anime: AnimeItem) => {
      setWatchlist((current) => {
        if (current.some((item) => item.malId === anime.malId)) {
          return current;
        }

        const updated = [...current, anime];
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const removeFromWatchlist = useCallback((malId: number) => {
    setWatchlist((current) => {
      const updated = current.filter((item) => item.malId !== malId);
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isInWatchlist = useCallback(
    (malId: number) => watchlist.some((item) => item.malId === malId),
    [watchlist]
  );

  const value = useMemo(
    () => ({
      watchlist,
      watchlistCount: watchlist.length,
      isLoading,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
    }),
    [
      watchlist,
      isLoading,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
    ]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistContextValue {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }

  return context;
}
