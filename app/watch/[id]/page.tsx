import { notFound } from "next/navigation";
import { getAnimeById } from "@/lib/jikan";
import { WatchPageClient } from "@/components/WatchPageClient";

interface WatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { id } = await params;
  const { ep } = await searchParams;
  const malId = Number(id);

  if (Number.isNaN(malId)) {
    notFound();
  }

  const anime = await getAnimeById(malId);

  if (!anime) {
    notFound();
  }

  const parsedEp = ep ? Number(ep) : 1;
  const initialEpisode = Number.isNaN(parsedEp) ? 1 : parsedEp;

  return <WatchPageClient anime={anime} initialEpisode={initialEpisode} />;
}
