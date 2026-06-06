import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { getAnimeById } from "@/lib/jikan";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const malId = Number(id);

  if (Number.isNaN(malId)) {
    notFound();
  }

  const anime = await getAnimeById(malId);

  if (!anime) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/anime/${anime.malId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-otaku-violet transition-colors hover:text-otaku-violet-light"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {anime.title}
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
        {anime.title}
      </h1>
      <p className="mb-6 text-sm text-gray-400">Episode 1</p>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-otaku-violet/20 bg-otaku-grey shadow-xl shadow-black/40">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-otaku-black/60">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-otaku-violet/20">
            <Play className="h-8 w-8 fill-otaku-violet text-otaku-violet" />
          </div>
          <p className="text-sm font-medium text-gray-300">Player coming soon</p>
          <p className="max-w-sm px-4 text-center text-xs text-gray-500">
            Streaming playback will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
