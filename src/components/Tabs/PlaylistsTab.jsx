import UploadButton from "../UplaodButton";
import UploadPlaylistModal from "../Modals/UploadPlaylistModal";
import { useState } from "react";
import { Plus, Folder } from "lucide-react";
import { usePlaylist } from "../../hooks/usePlaylist";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { PlaylistCard } from "../PlaylistCard";

export default function PlaylistsTab() {
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo?._id;
  const { playlists, loading, error, fetchPlaylists } = usePlaylist(userId);
  const [isUploadPlaylistModalOpen, setIsUploadPlaylistModalOpen] =
    useState(false);
  const [editPlaylist, setEditPlaylist] = useState(null); // 👈 for edit

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
          onClick={() => {
            setIsUploadPlaylistModalOpen(true);
            setEditPlaylist(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Playlist
        </button>
      </div>
      {/* Empty State */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              onEdit={(p) => {
                setEditPlaylist(playlist);
                setIsUploadPlaylistModalOpen(p);
              }}
              onDelete={(id) => handleDelete(id)}
            />
          ))}
        </div>
      </div>
      {/* Playlist Modal */}
      {isUploadPlaylistModalOpen && (
        <UploadPlaylistModal
          isOpen={isUploadPlaylistModalOpen}
          onClose={() => setIsUploadPlaylistModalOpen(false)}
          onSuccess={fetchPlaylists}
          initialData={editPlaylist}
          isEdit={!!editPlaylist}
        />
      )}
    </div>
  );
}
