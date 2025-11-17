import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { PlaylistSkeleton } from "../../components/skeleton/PlaylistSkeleton";
import timeAgo from "../../utils/formatTimeAgo";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/playlists/${playlistId}`,
          { withCredentials: true }
        );

        setPlaylist(res.data.data || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  if (loading) return <PlaylistSkeleton />;

  if (error)
    return (
      <div className="p-4 text-red-500 flex justify-center mt-10">
        Failed to load playlist 😔
      </div>
    );

  if (!playlist)
    return (
      <div className="p-4 text-gray-500 flex justify-center mt-10">
        Playlist not found.
      </div>
    );

  const { name, description, videos, owner, thumbnail } = playlist;

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-6 bg-background text-foreground">
      {/* ========== HEADER SECTION ========== */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Thumbnail */}
        <div className="w-full md:w-72 aspect-video rounded-xl overflow-hidden bg-muted border border-border">
          <img
            src={thumbnail?.url || "/default-thumb.jpg"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{name}</h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {description || "No description available."}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <span>{videos?.length || 0} videos</span>
            <span>•</span>
            <span>Created by {owner?.username}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-border my-8" />

      {/* ========== VIDEOS LIST ========== */}
      <div className="flex flex-col gap-6">
        {videos?.length ? (
          videos.map((video) => (
            <Link
              key={video._id}
              to={`/feed/watch/${video._id}?playlist=${playlistId}`}
              className="group flex gap-4 p-3 rounded-xl border border-border bg-card hover:bg-card/80 transition flex-col sm:flex-row"
            >
              {/* Video Thumb */}
              <div className="w-full sm:w-56 aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={video.thumbnail?.url || video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center gap-1">
                <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition">
                  {video.title}
                </h3>

                <p className="text-xs text-muted-foreground">
                  {video.views} views • {timeAgo(video.createdAt)}
                </p>

                <p className="text-xs text-muted-foreground">
                  from {video?.videoOwner?.username || owner?.username}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground text-center mt-10">
            No videos added to this playlist yet ✨
          </p>
        )}
      </div>
    </div>
  );
}
