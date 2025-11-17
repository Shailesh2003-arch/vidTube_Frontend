import timeAgo from "../../utils/formatTimeAgo";
import api from "../../api/axios";
import { Link } from "react-router-dom";

import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

export const VideoDetails = ({
  title,
  views,
  createdAt,
  owner,
  videoId,
  description,
  likeCount,
  dislikeCount,
  subscribers,
  isSubscribed,
  setIsSubscribed,
  setSubscribersCount,
  channelId,
}) => {
  const handleLike = async () => {
    try {
      await api.post(`/likes/toggle/v/${videoId}`, {
        type: "like",
      });

      // 🔄 Socket will update the UI — no manual state updates needed.
    } catch (error) {
      console.error(
        "Like action failed:",
        error?.response?.data?.message || error.message
      );
    }
  };
  const handleDislike = async () => {
    try {
      await api.post(`/likes/toggle/v/${videoId}`, {
        type: "dislike",
      });

      // No manual state updates — socket got your back.
    } catch (error) {
      console.error(
        "Dislike action failed:",
        error?.response?.data?.message || error.message
      );
    }
  };

  const handleShare = async () => {
    const videoUrl = window.location.href;

    if (navigator.share) {
      // ✅ Native Web Share API (for mobile and some desktop browsers)
      try {
        await navigator.share({
          title: "Check out this video 🎥",
          text: "You’ve got to see this!",
          url: videoUrl,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.log("Share canceled or failed:", error);
      }
    } else {
      // 📋 Fallback: copy to clipboard
      await navigator.clipboard.writeText(videoUrl);
      alert("Link copied to clipboard!");
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/users/subscription/c/${channelId}`,
        {},
        { withCredentials: true }
      );
      const { isSubscribed: newStatus, subscribersCount: newCount } =
        res.data.data || {};
      setIsSubscribed((prev) => !prev);
      setSubscribersCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Error subscribing:", err);
    }
  };

  return (
    <div className="mt-4">
      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h1>

      {/* Views + Date */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
        <span>{views} views</span>
        <span>•</span>
        <span>{timeAgo(createdAt)}</span>
      </div>
      {/* Description */}
      <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        {description}
      </p>

      {/* Channel Info + Subscribe */}
      <div className="flex items-center justify-between mt-4">
        <Link
          to={`/feed/channel/${owner.username}`}
          className="flex items-center gap-3 group"
        >
          <img
            src={owner.avatar || "/default-avatar.png"}
            alt={owner.username}
            className="w-10 h-10 rounded-full group-hover:scale-105 transition-transform duration-200"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
              {owner.username}
            </p>
            <p className="text-sm text-gray-500">{subscribers} subscribers</p>
          </div>
        </Link>

        {/* Subscribe button */}
        <button
          onClick={handleSubscribe}
          className={`px-4 py-2 rounded-full font-medium transition ${
            isSubscribed
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isSubscribed ? "Subscribed ✓" : "Subscribe"}
        </button>
      </div>

      {/* Interaction Bar */}
      <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide">
        {/* Like / Dislike */}
        <div className="flex items-center flex-shrink-0">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 rounded-l-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <ThumbsUp size={18} />
            <span>{likeCount}</span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>

          {/* Dislike Button */}
          <button
            onClick={handleDislike}
            className="flex items-center gap-2 px-4 py-2 rounded-r-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <ThumbsDown size={18} />
            <span>{dislikeCount}</span>
          </button>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 flex-shrink-0 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          <Share2 size={18} /> Share
        </button>
      </div>
    </div>
  );
};
