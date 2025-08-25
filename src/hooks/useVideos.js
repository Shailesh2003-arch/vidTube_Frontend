import { useEffect, useState } from "react";

export const useVideos = () => {
  // for setting up the fetched video's array into the state...
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetches the uploaded videos of the user...
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/v1/videos/user`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(`Fetched Uploaded videos by the user`, data);
      setVideos(data.data || []);
    } catch (error) {
      setError(error);
      console.log(`Error fetching the videos`, error.message);
    } finally {
      setLoading(false);
    }
  };

  //   for updating the user's uploaded video details such as thumbnail, description, and thumbnail...
  const updateVideo = async (videoId, formData) => {
    const res = await fetch(
      `http://localhost:4000/api/v1/videos/vId/${videoId}`,
      {
        credentials: "include",
        method: "PATCH",
        body: formData,
      }
    );
    const data = await res.json();
    // Make sure to add some Custom Error Classes.
    if (!res.ok) throw new Error(data.message || "Failed to update video");
    setVideos((prev) =>
      prev.map((v) => (v._id === videoId ? { ...v, ...data.data } : v))
    );
  };

  // for deleting the user's uploaded videos...
  const deleteVideo = async (videoId) => {
    const res = await fetch(
      `http://localhost:4000/api/v1/videos/vId/${videoId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to delete video");

    setVideos((prev) => prev.filter((v) => v._id !== videoId));
  };

  useEffect(() => {
    fetchVideos();
  }, []);
  return { videos, loading, error, updateVideo, deleteVideo, fetchVideos };
};
