import timeAgo from "../utils/formatTimeAgo";

export default function CommunityPostCard({ tweet }) {
  return (
    <div
      className="mb-4 break-inside-avoid rounded-xl border shadow-sm 
      bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    >
      {/* Header: Username + Time */}
      <div className="flex items-center gap-2 px-4 pt-4">
        {/* Avatar (optional, future) */}
        <img
          src={tweet.owner.avatar}
          alt={tweet.owner.username}
          className="w-8 h-8 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
            {tweet.owner?.username || "Unknown User"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timeAgo(tweet.createdAt)}
          </span>
        </div>
      </div>

      {/* Body: Content + Image */}
      <div className={`${tweet.image ? "p-4 pt-2" : "p-3 pt-2"}`}>
        {/* Text */}
        <p className="text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {tweet.content}
        </p>

        {/* Image (optional) */}
        {tweet.image?.url && (
          <img
            src={tweet.image.url}
            alt="Post"
            className="mt-3 w-full rounded-lg object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </div>
    </div>
  );
}
