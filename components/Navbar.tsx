"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark, LogOut, Play, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/contexts/WatchlistContext";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { watchlistCount } = useWatchlist();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-otaku-violet/20 bg-otaku-grey/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4 lg:gap-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-white transition-colors hover:text-otaku-violet"
          >
            <Play className="h-6 w-6 fill-otaku-violet text-otaku-violet" />
            <span>
              Otaku<span className="text-otaku-violet">Stream</span>
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden flex-1 md:flex md:max-w-xl md:mx-auto"
          >
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search anime..."
                className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-otaku-violet/50 focus:outline-none"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/watchlist"
              className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-gray-300 transition-colors hover:bg-otaku-black hover:text-otaku-violet"
              aria-label="Watchlist"
            >
              <Bookmark className="h-5 w-5" />
              {watchlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-otaku-violet px-1 text-xs font-semibold text-white">
                  {watchlistCount > 99 ? "99+" : watchlistCount}
                </span>
              )}
            </Link>

            {!authLoading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpen((open) => !open)}
                      className="flex min-h-11 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-otaku-black"
                      aria-expanded={menuOpen}
                      aria-haspopup="true"
                    >
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full border-2 border-otaku-violet/40 bg-otaku-black"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-otaku-violet/40 bg-otaku-violet/20 text-sm font-semibold text-otaku-violet">
                          {getInitials(user.name)}
                        </span>
                      )}
                      <span className="hidden text-sm font-medium text-gray-200 sm:inline">
                        {user.name}
                      </span>
                    </button>

                    {menuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setMenuOpen(false)}
                          aria-hidden="true"
                        />
                        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-otaku-violet/20 bg-otaku-grey shadow-xl shadow-black/40">
                          <div className="border-b border-otaku-violet/10 px-4 py-3">
                            <p className="truncate text-sm font-medium text-white">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              signOut();
                              setMenuOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-otaku-black hover:text-red-400"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    className="flex min-h-11 items-center rounded-lg border border-otaku-violet px-4 text-sm font-medium text-otaku-violet transition-colors hover:bg-otaku-violet hover:text-white"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="pb-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search anime..."
              className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-otaku-violet/50 focus:outline-none"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
