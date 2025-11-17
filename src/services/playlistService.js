import api from "../api/axios";

export const createPlaylist = async (formData) => {
  try {
    const res = await api.post("/playlists", formData);
    return res.data;
  } catch (error) {
    console.error(
      "Error creating playlist:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create playlist"
    );
  }
};

export const updatePlaylist = async (playlistId, formData) => {
  try {
    const res = await api.patch(`/playlists/${playlistId}`, formData);
    return res.data;
  } catch (error) {
    console.error(
      "Error updating playlist:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update playlist"
    );
  }
};

export const deletePlaylist = async (playlistId) => {
  try {
    const res = await api.delete(`/playlists/${playlistId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Error deleting playlist:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete playlist"
    );
  }
};
