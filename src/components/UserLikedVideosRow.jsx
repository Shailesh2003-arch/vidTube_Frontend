import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import timeAgo from "../utils/formatTimeAgo";
import api from "../api/axios";
import { Link } from "react-router-dom";

export const UserLikedVideosRow = () => {
  const [videos, setLikedVideos] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await api.get("/videos/liked");

        setLikedVideos(res.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching liked videos:", error);
      }
    };

    fetchLikedVideos();
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (rowRef.current) {
        setShowArrows(rowRef.current.scrollWidth > rowRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [videos]);

  const scrollLeft = () =>
    rowRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    rowRef.current.scrollBy({ left: 300, behavior: "smooth" });

  if (isLoading) {
    return <p className="text-gray-500">Loading liked videos...</p>;
  }

  return (
    <div className="mb-6">
      {/* Heading + Controls */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Liked Videos</h2>
        <div className="flex items-center gap-2">
          {showArrows && (
            <>
              <button
                onClick={scrollLeft}
                className="hidden md:flex border border-gray-400 dark:border-gray-600 
             bg-white dark:bg-gray-800 text-gray-700 dark:text-white 
             p-1.5 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollRight}
                className="hidden md:flex border border-gray-400 dark:border-gray-600 
             bg-white dark:bg-gray-800 text-gray-700 dark:text-white 
             p-1.5 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          <Link
            to="/liked-videos"
            className="px-3 py-1.5 text-sm font-medium border border-gray-500 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            View all
          </Link>
        </div>
      </div>

      {/* Video Row */}
      <div
        ref={rowRef}
        className="flex overflow-x-auto gap-4 hide-scrollbar scroll-smooth w-full"
      >
        {videos.slice(0, 8).map((item) => (
          <div key={item._id} className="flex-shrink-0 w-52 sm:w-52 md:w-60">
            <Link to={`/feed/watch/${item._id}`} className="block group">
              {/* Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 py-0.5 rounded">
                  {item.duration || "0:00"}
                </span>
              </div>

              {/* Info */}
              <div className="flex mt-2 gap-2">
                <img
                  src={item?.videoOwner.avatar || "/default-avatar.png"}
                  alt={item?.videoOwner.username || "channel"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-500 mt-1">
                    {item.videoOwner.username || "Unknown"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.views || 0} views • {timeAgo(item.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
