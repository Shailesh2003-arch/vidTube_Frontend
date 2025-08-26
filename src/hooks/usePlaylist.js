import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
export const usePlaylist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo?._id;

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/v1/users/playlist/user/${userId}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch playlists"); // [PENDING]
      const data = await res.json();
      setPlaylists(data?.data || []);
    } catch (error) {
      setError(error);
      console.log(`Error fetching the playlist`, error.message);
    } finally {
      console.log(playlists);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPlaylists();
    }
  }, [userId]);

  return { playlists, fetchPlaylists, loading, error };
};
