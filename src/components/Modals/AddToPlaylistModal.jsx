import { usePlaylist } from "../../hooks/usePlaylist";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

export const AddToPlaylist = ({ isOpen, onClose, videoId }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo?._id;
  const { playlists, fetchPlaylists } = usePlaylist(userId, false);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen]);

  const handleAdd = async () => {
    if (!selectedPlaylist) {
      return alert("Please select a Playlist");
    }

    try {
      const res = await api.patch(
        `/playlists/add/${selectedPlaylist}/${videoId}`,
        { videoId } // body
      );

      toast.success("Video added successfully ✅");
      console.log("Video added successfully", res.data);

      onClose();
    } catch (error) {
      toast.error(error.message || "Failed adding video to the playlist");
      console.log("Error adding video to playlist:", error.message);
    }
  };

  if (!isOpen) return;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Add Video to Playlist
        </h2>

        <select
          className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
        >
          <option value="">Select a playlist</option>
          {playlists.map((pl) => (
            <option key={pl._id} value={pl._id}>
              {pl.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
