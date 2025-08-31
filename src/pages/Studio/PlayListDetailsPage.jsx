import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteVideoFromthePlaylist } from "../../services/videoService";
export default function PlaylistDetailsPage() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/v1/users/playlist/${playlistId}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch playlist");
      const data = await res.json();
      console.log(data.data);
      setPlaylist(data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const handleDelete = async (playlistId, videoId) => {
    try {
      await deleteVideoFromthePlaylist(playlistId, videoId);
      await fetchPlaylist();
    } catch (error) {
      console.log(`Error Removing the video from the playlist`, error.message);
    }
  };

  if (loading) return <p>Loading playlist...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!playlist) return <p>Playlist not found</p>;

  return (
    <div className="p-4">
      {/* Playlist header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Playlist : {playlist.name}</h2>
        {/* <p className="text-gray-500">{playlist.videos.length} videos</p> */}
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlist.videos && playlist.videos.length > 0 ? (
          playlist.videos.map((video, index) => (
            <div
              key={video._id || index}
              className="rounded-lg overflow-hidden shadow bg-white dark:bg-gray-800"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {video.title}
                </h3>
                <div className="flex justify-between item-center">
                  <p className="text-sm text-gray-500">{video.duration}</p>
                  <button
                    onClick={() => handleDelete(playlist._id, video._id)}
                    className="px-3 py-2 text-xs  bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full">
            No videos in this playlist yet 📭
          </p>
        )}
      </div>
    </div>
  );
}
