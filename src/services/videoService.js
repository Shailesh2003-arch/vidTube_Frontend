import { toast } from "react-toastify";
import axios from "axios";

export const fetchHomePageVideos = async (cursor = null, limit = 10) => {
  try {
    const res = await axios.get(
      "http://localhost:4000/api/v1/videos/homepage",
      {
        withCredentials: true,
        params: { limit, cursor },
      }
    );
    console.log(res);
    return res.data; // { videos, nextCursor }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch videos"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export const deleteVideoFromthePlaylist = async (playlistId, videoId) => {
  const res = await fetch(
    `http://localhost:4000/api/v1/users/playlist/remove/${playlistId}/${videoId}`,
    {
      credentials: "include",
      method: "PATCH",
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch videos");
  toast.success("Removed Video from the Playlist");
  return data;
};
