"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimeItem, UserWatchHistoryStore, WatchHistory } from "@/lib/types";

const WATCHLIST_STORAGE_KEY = "otaku_watchlist";
const HISTORY_STORAGE_KEY = "otaku_watch_history";

interface WatchlistContextValue {
  watchlist: AnimeItem[];
  watchlistCount: number;
  isLoading: boolean;
  addToWatchlist: (anime: AnimeItem) => void;
  removeFromWatchlist: (malId: number) => void;
  isInWatchlist: (malId: number) => boolean;
  markEpisodeWatched: (malId: number, episode: number) => void;
  isEpisodeWatched: (malId: number, episode: number) => boolean;
  getWatchedEpisodes: (malId: number) => number[];
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

function loadHistoryStore(): UserWatchHistoryStore {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserWatchHistoryStore) : {};
  } catch {
    return {};
  }
}

function parseUserHistory(raw: Record<string, number[]> | undefined): WatchHistory {
  if (!raw) return {};

  const history: WatchHistory = {};
  for (const [key, episodes] of Object.entries(raw)) {
    history[Number(key)] = episodes;
  }
  return history;
}

function saveUserHistory(userId: string, history: WatchHistory): void {
  const store = loadHistoryStore();
  store[userId] = history;
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(store));
}

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<AnimeItem[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistory>({});
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

  useEffect(() => {
    if (!user) {
      setWatchHistory({});
      return;
    }

    const store = loadHistoryStore();
    setWatchHistory(parseUserHistory(store[user.id]));
  }, [user]);

  const addToWatchlist = useCallback((anime: AnimeItem) => {
    setWatchlist((current) => {
      if (current.some((item) => item.malId === anime.malId)) {
        return current;
      }

      const updated = [...current, anime];
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

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

  const markEpisodeWatched = useCallback(
    (malId: number, episode: number) => {
      if (!user) return;

      setWatchHistory((current) => {
        const existing = current[malId] ?? [];
        if (existing.includes(episode)) {
          return current;
        }

        const updated: WatchHistory = {
          ...current,
          [malId]: [...existing, episode].sort((a, b) => a - b),
        };
        saveUserHistory(user.id, updated);
        return updated;
      });
    },
    [user]
  );

  const isEpisodeWatched = useCallback(
    (malId: number, episode: number) =>
      (watchHistory[malId] ?? []).includes(episode),
    [watchHistory]
  );

  const getWatchedEpisodes = useCallback(
    (malId: number) => watchHistory[malId] ?? [],
    [watchHistory]
  );

  const value = useMemo(
    () => ({
      watchlist,
      watchlistCount: watchlist.length,
      isLoading,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      markEpisodeWatched,
      isEpisodeWatched,
      getWatchedEpisodes,
    }),
    [
      watchlist,
      isLoading,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      markEpisodeWatched,
      isEpisodeWatched,
      getWatchedEpisodes,
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
