import { useState, useEffect } from "react";
export const usePlaylist = (userId, fetchOnMount = true) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/v1/users/playlist/user/${userId}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch playlists");
      const data = await res.json();
      console.log(data.data);
      setPlaylists(data?.data || []);
    } catch (error) {
      setError(error);
      console.log(`Error fetching the playlist`, error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) fetchPlaylists();
  }, [userId]);

  return { playlists, fetchPlaylists, loading, error };
};
