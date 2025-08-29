import UploadButton from "../UplaodButton";
import UploadPlaylistModal from "../Modals/UploadPlaylistModal";
import { useState } from "react";
import { Plus, Folder } from "lucide-react";
import { usePlaylist } from "../../hooks/usePlaylist";
import { Link } from "react-router-dom";

export default function PlaylistsTab() {
  const { playlists, loading, error, fetchPlaylists } = usePlaylist();
  const [isUploadPlaylistModalOpen, setIsUploadPlaylistModalOpen] =
    useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-none">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Playlists
        </h2>
        <button
          onClick={() => setIsUploadPlaylistModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Playlist
        </button>
      </div>
      {/* Empty State */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {console.log(playlists)}
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/studio/playlists/${playlist._id}`} // 👈 route to detail page
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-md transition cursor-pointer"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                {playlist.thumbnail ? (
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <Folder size={32} className="text-gray-500" />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {playlist.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {playlist.videos.length || 0} videos
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Playlist Modal */}
      {isUploadPlaylistModalOpen && (
        <UploadPlaylistModal
          isOpen={isUploadPlaylistModalOpen}
          onClose={() => setIsUploadPlaylistModalOpen(false)}
          onSuccess={fetchPlaylists}
        />
      )}
    </div>
  );
}
