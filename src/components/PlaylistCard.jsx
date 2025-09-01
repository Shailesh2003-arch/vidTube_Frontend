import { Link } from "react-router-dom";
import { Folder, MoreVertical } from "lucide-react";
import { useState } from "react";

export const PlaylistCard = ({ playlist, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
      {/* Thumbnail + Link */}
      <Link to={`/studio/playlists/${playlist._id}`}>
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
          {playlist.thumbnail ? (
            <img
              src={playlist.thumbnail.url}
              alt={playlist.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <Folder size={32} className="text-gray-500" />
          )}
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {playlist.videos.length || 0} videos
        </p>
      </div>

      {/* Three Dots Menu */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit(playlist);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Edit Playlist
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete(playlist._id);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700/40"
            >
              Delete Playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
