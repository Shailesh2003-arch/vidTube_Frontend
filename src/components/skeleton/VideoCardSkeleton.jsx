export default function VideoCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Thumbnail */}
      <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>

      {/* Title */}
      <div className="mt-3 h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
      <div className="mt-2 h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-md"></div>

      {/* Channel */}
      <div className="mt-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="flex flex-col gap-2 w-1/2">
          <div className="h-3 w-4/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div className="h-3 w-3/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
