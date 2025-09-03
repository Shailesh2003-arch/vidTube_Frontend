import { useState, useEffect } from "react";
import axios from "axios";
export const useGlobalTweets = (limit = 10) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAllTweets = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/users/tweets/tweets`,
        {
          withCredentials: true,
          params: { limit, cursor },
        }
      );

      const { tweets: newTweets, nextCursor } = res.data.data;
      console.log(`Response from the server`, res);
      setTweets((prev) => {
        const merged = [...prev, ...res.data.data.tweets];
        const unique = Array.from(
          new Map(merged.map((t) => [t._id, t])).values()
        );
        return unique;
      });
      setCursor(nextCursor || null);
      setHasMore(!!nextCursor); // agar nextCursor hai toh aur data bacha h
    } catch (error) {
      setError(error);
      setLoading(false);
      console.log(`Error fetching all tweets`, error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTweets();
  }, []);

  return { tweets, error, loading, fetchAllTweets, hasMore };
};
