export const PlaylistSkeleton = () => {
  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="h-48 bg-gray-300 rounded-xl animate-pulse" />
      <div className="h-6 w-1/3 bg-gray-300 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse" />
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-3 rounded-xl border bg-gray-200 animate-pulse"
          >
            <div className="w-56 h-32 bg-gray-400 rounded-lg" />
            <div className="flex flex-col justify-center gap-2 flex-1">
              <div className="h-4 w-3/4 bg-gray-400 rounded" />
              <div className="h-3 w-1/2 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
