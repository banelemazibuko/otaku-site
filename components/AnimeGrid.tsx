import { AnimeItem } from "@/lib/types";
import { AnimeCard } from "./AnimeCard";

interface AnimeGridProps {
  anime: AnimeItem[];
  showRemoveOverlay?: boolean;
  onRemove?: (malId: number) => void;
}

export function AnimeGrid({
  anime,
  showRemoveOverlay,
  onRemove,
}: AnimeGridProps) {
  if (anime.length === 0) {
    return (
      <p className="py-16 text-center text-gray-400">
        No anime found. Try a different search.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {anime.map((item) => (
        <AnimeCard
          key={item.malId}
          anime={item}
          showRemoveOverlay={showRemoveOverlay}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
