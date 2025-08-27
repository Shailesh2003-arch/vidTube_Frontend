import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeToggler } from "../../components/ThemeToggler";
import { VideoCard } from "../../components/VideoCard";
import { Upload } from "lucide-react";
import {} from "react";
import { Link } from "react-router-dom";
import { fetchHomePageVideos } from "../../services/videoService";

export const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHomePageVideos(page);
      console.log(`Total videos rendered`, data.videos.length);
      if (data?.videos?.length > 0) {
        setVideos((prev) => {
          const combined = [...prev, ...data.videos];
          return combined.filter(
            (video, index, self) =>
              index === self.findIndex((v) => v._id === video._id)
          );
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  return (
    <div className="flex h-screen ">
      {/* Main content */}
      <div className="flex-1 p-4 flex flex-col ">
        <div className="flex items-end justify-end gap-4">
          {/* Upload Button */}
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
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
