import { Link } from "react-router-dom";
import timeAgo from "../utils/formatTimeAgo";
export const VideoCard = ({ video }) => {
  return (
    <Link key={video._id} className="group" to={`/watch/${video._id}`}>
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Duration */}
        <span className="absolute bottom-1 right-1 bg-black dark:bg-gray-700 text-white text-xs px-1 py-0.5 rounded">
          {video.duration || "0:00"}
        </span>
      </div>

      <div className="flex mt-2 gap-3">
        {/* Avatar */}
        <img
          src={video.videoOwner?.avatar || "/default-avatar.png"}
          alt={video.videoOwner?.username || "User"}
          loading="lazy"
          className="w-9 h-9 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">
            {video.title}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {video.videoOwner?.username || "Unknown"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {video.views || 0} views • {timeAgo(video.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};
