import { toast } from "react-toastify";
export const fetchHomePageVideos = async (page, limit = 10) => {
  const res = await fetch(
    `http://localhost:4000/api/v1/videos/homepage?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch videos");
  return data;
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
