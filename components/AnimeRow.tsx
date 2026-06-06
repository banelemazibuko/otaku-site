import { AnimeItem } from "@/lib/types";
import { AnimeCard } from "./AnimeCard";

interface AnimeRowProps {
  title: string;
  anime: AnimeItem[];
}

export function AnimeRow({ title, anime }: AnimeRowProps) {
  if (anime.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">{title}</h2>
      <div className="scroll-row -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {anime.map((item) => (
          <div
            key={item.malId}
            className="w-36 shrink-0 snap-start sm:w-44"
          >
            <AnimeCard anime={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
