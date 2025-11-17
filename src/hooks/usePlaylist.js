import { useState, useEffect } from "react";
import api from "../api/axios";
export const usePlaylist = (userId, fetchOnMount = true) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const res = await api.get(`/api/v1/playlists/user/${userId}`);

      setPlaylists(res.data?.data || []);
    } catch (error) {
      setError(error);
      console.log("Error fetching playlists:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) fetchPlaylists();
  }, [userId]);

  return { playlists, fetchPlaylists, loading, error };
};
