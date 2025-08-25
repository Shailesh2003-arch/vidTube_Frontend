import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import timeAgo from "../utils/formatTimeAgo";

export const UserWatchHistoryRow = () => {
  const [videos, setVideos] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const rowRef = useRef(null);

  const fetchWatched = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/v1/users/watch-history`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setIsloading(false);
      console.log(`Data recieved is`, data);
      console.log(`Video recieved is`, data.data);
      setVideos(data.data);
    } catch (error) {
      console.log(`Error fetching watched videos`, error.message);
    }
  };

  useEffect(() => {
    fetchWatched();
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
  const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    rowRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mb-6">
      {/* Heading + See All button + Arrows */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Watch History</h2>
        <div className="flex items-center gap-2">
          {showArrows && (
            <>
              <button
                onClick={scrollLeft}
                className="hidden md:flex border border-gray-400 dark:border-gray-600 
             bg-white dark:bg-gray-800 
             text-gray-700 dark:text-white 
             p-1.5 rounded-full shadow 
             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollRight}
                className="hidden md:flex border border-gray-400 dark:border-gray-600 
             bg-white dark:bg-gray-800 
             text-gray-700 dark:text-white 
             p-1.5 rounded-full shadow 
             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          <Link
            to="/history"
            className="px-3 py-1.5 text-sm font-medium border border-gray-500 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            View all
          </Link>
        </div>
      </div>

      {/* Row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar w-full max-w-full"
      >
        {videos.slice(0, 8).map((item) => (
          <div
            key={item.video._id}
            className="flex-shrink-0 w-40 sm:w-52 md:w-60"
          >
            <Link to={`/watch/${item.video._id}`} className="block group">
              {/* Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                <img
                  src={item.video.thumbnail}
                  alt={item.video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 py-0.5 rounded">
                  {item.video.duration || "0:00"}
                </span>
              </div>

              {/* Video Info */}
              <div className="flex mt-2 gap-2">
                <img
                  src={"/default-avatar.png"}
                  alt={item.video.owner.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                    {item.video.title}
                  </h3>
                  <span className="text-xs text-gray-500 mt-1">
                    {item.video.owner.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.video.views || 0} views • {timeAgo(item.createdAt)}
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
