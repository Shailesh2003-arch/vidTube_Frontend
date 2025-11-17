export default function VideoSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Video Player Skeleton */}
      <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>

      {/* Title Skeleton */}
      <div className="mt-4 h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>

      {/* Small Line */}
      <div className="mt-3 h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-md"></div>

      {/* Channel Info */}
      <div className="mt-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="flex flex-col gap-2 w-1/2">
          <div className="h-4 w-3/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div className="h-4 w-2/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>

      {/* Description Lines */}
      <div className="mt-6 space-y-2">
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        <div className="h-4 w-4/6 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
      </div>
    </div>
  );
}
