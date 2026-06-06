export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-56 animate-pulse rounded bg-otaku-grey" />
        <div className="h-4 w-72 animate-pulse rounded bg-otaku-grey/70" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-[2/3] animate-pulse rounded-xl bg-otaku-grey" />
            <div className="h-4 animate-pulse rounded bg-otaku-grey/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
