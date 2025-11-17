import { toast } from "react-toastify";
import api from "../api/axios";
export const fetchHomePageVideos = async (cursor = null, limit = 10) => {
  try {
    const res = await api.get("/api/v1/videos/homepage", {
      params: { limit, cursor },
    });

    return res.data; // { videos, nextCursor }
  } catch (error) {
    console.error(
      "Error fetching home page videos:",
      error.response?.data || error.message
    );

    throw new Error(error.response?.data?.message || "Failed to fetch videos");
  }
};

export const deleteVideoFromthePlaylist = async (playlistId, videoId) => {
  try {
    const res = await api.patch(
      `/api/v1/playlists/remove/${playlistId}/${videoId}`
    );

    toast.success("Removed Video from the Playlist");

    return res.data;
  } catch (error) {
    console.error(
      "Error removing video from playlist:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to remove video");
  }
};
