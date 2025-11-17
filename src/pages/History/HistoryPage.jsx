import { useEffect } from "react";
import { useWatchHistory } from "../../contexts/WatchHistoryContext";
import { groupByDay } from "../../utils/groupByDay";

function HistoryVideoCard({ item }) {
  const { video } = item;
  return (
    <div className="flex gap-4 py-3 cursor-pointer">
      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-48 h-28 rounded-lg object-cover"
      />

      {/* Text Section */}
      <div className="flex flex-col justify-between">
        {/* Title */}
        <h3 className="text-lg font-semibold leading-tight line-clamp-2">
          {video.title}
        </h3>

        {/* Channel info */}
        <div className="flex items-center gap-2 mt-1">
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-400">{video.owner.username}</span>
        </div>

        {/* Stats row */}
        <div className="text-xs text-gray-500 mt-1 flex gap-2">
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{timeAgo(item.createdAt)}</span>
        </div>

        {/* Watched time */}
        <p className="text-xs text-gray-400 mt-1">
          Watched {timeAgo(item.watchedAt)}
        </p>
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function formatViews(num) {
  if (num < 1000) return num;
  if (num < 1_000_000) return (num / 1000).toFixed(1) + "K";
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + "M";
  return (num / 1_000_000_000).toFixed(1) + "B";
}

export default function HistoryPage() {
  const { history, refreshHistory, loading, error } = useWatchHistory();

  useEffect(() => {
    if (!history || history.length === 0) {
      refreshHistory();
    }
  }, []);

  if (loading)
    return <div className="px-6 py-8">Loading your watch history...</div>;
  if (error) return <div className="px-6 py-8">Error loading history.</div>;
  if (!history || history.length === 0)
    return <div className="px-6 py-8">No history found.</div>;

  const grouped = groupByDay(history);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden 
    bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 px-6 py-6 
      bg-white dark:bg-gray-900 
      border-b border-gray-200 dark:border-gray-800"
      >
        <h1 className="text-2xl font-semibold">Watch history</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {grouped.map((group) => (
          <section key={group.dateKey} className="mb-8">
            <h2
              className="text-lg font-semibold mb-3 
            text-gray-800 dark:text-gray-200"
            >
              {group.dayLabel}
            </h2>

            {/* Vertical list */}
            <div
              className="divide-y 
            divide-gray-200 dark:divide-gray-800"
            >
              {group.items.map((item) => (
                <HistoryVideoCard
                  key={item.video._id + item.watchedAt}
                  item={item}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
