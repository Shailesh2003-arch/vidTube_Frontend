import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeToggler } from "../../components/ThemeToggler";
import { VideoCard } from "../../components/VideoCard";
import { Link } from "react-router-dom";
import LikeButton from "../../components/LikeButton";
import { fetchHomePageVideos } from "../../services/videoService";
import { NotificationBell } from "../../components/NotificationBell";

export const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef(null);

  const loadVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchHomePageVideos(cursor, 10);
      console.log(`Total videos rendered`, data.videos.length);

      if (data?.videos?.length > 0) {
        setVideos((prev) => {
          const combined = [...prev, ...data.videos];
          return combined.filter(
            (video, index, self) =>
              index === self.findIndex((v) => v._id === video._id)
          );
        });

        setCursor(data.nextCursor || null); // ✅ update cursor
        setHasMore(Boolean(data.nextCursor));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error.message);
      setHasMore(false); // 🛑 avoid infinite requests
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("👀 Bottom reached, fetching more videos");
          loadVideos();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="flex h-screen ">
      {/* Main content */}
      <div className="flex-1 p-4 flex flex-col ">
        <div className="flex items-end justify-end gap-4">
          {/* <NotificationBell /> */}
          <Link
            to="/studio/videos"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            <span>Upload</span>
          </Link>

          <ThemeToggler />
        </div>

        <h2 className="text-xl font-bold mb-4">Latest Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-scroll h-[80vh] hide-scrollbar ">
          {videos.map((video, idx) =>
            idx === videos.length - 1 ? (
              <VideoCard ref={lastVideoRef} key={video._id} video={video} />
            ) : (
              <VideoCard key={video._id} video={video} />
            )
          )}
        </div>
        {/* Load More Button */}
        {loading && (
          <div className="flex justify-center mt-6">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};
