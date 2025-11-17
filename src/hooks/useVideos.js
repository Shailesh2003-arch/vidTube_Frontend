import { useEffect, useState } from "react";
import api from "../api/axios";

export const useVideos = () => {
  // for setting up the fetched video's array into the state...
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetches the uploaded videos of the user...
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/videos/user");

      setVideos(res.data.data || []);
    } catch (err) {
      console.error("Error fetching uploaded videos:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  //   for updating the user's uploaded video details such as thumbnail, description, and thumbnail...
  // const updateVideo = async (videoId, formData) => {
  //   const res = await fetch(
  //     `http://localhost:4000/api/v1/videos/vId/${videoId}`,
  //     {
  //       credentials: "include",
  //       method: "PATCH",
  //       body: formData,
  //     }
  //   );
  //   const data = await res.json();
  //   // Make sure to add some Custom Error Classes.
  //   if (!res.ok) throw new Error(data.message || "Failed to update video");
  //   setVideos((prev) =>
  //     prev.map((v) => (v._id === videoId ? { ...v, ...data.data } : v))
  //   );
  // };

  const updateVideo = async (videoId, formData) => {
    try {
      const res = await api.patch(`/videos/vId/${videoId}`, formData);

      setVideos((prev) =>
        prev.map((v) => (v._id === videoId ? { ...v, ...res.data.data } : v))
      );
    } catch (err) {
      console.error("Error updating video:", err);
      throw err;
    }
  };

  // for deleting the user's uploaded videos...
  const deleteVideo = async (videoId) => {
    try {
      await api.delete(`/videos/vId/${videoId}`);

      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Error deleting video:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);
  return { videos, loading, error, updateVideo, deleteVideo, fetchVideos };
};
