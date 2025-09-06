import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useGlobalTweets = (limit = 10) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAllTweets = useCallback(async () => {
    if (loading || !hasMore) return; // 🛑 guard against double-fetch
    setLoading(true);

    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/users/tweets/tweets",
        {
          withCredentials: true,
          params: { limit, cursor },
        }
      );

      const { tweets: newTweets, nextCursor } = res.data.data;

      setTweets((prev) => {
        // merge + dedupe
        const merged = [...prev, ...newTweets];
        const unique = Array.from(
          new Map(merged.map((t) => [t._id, t])).values()
        );
        return unique;
      });

      // nextCursor handle
      setCursor(nextCursor || null);
      setHasMore(Boolean(nextCursor)); // false if no more data
    } catch (err) {
      setError(err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          // 🛑 stop infinite calls
          setHasMore(false);
          // optional: auto-logout or redirect
          console.warn("Session expired, stopping further requests");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading, limit]);

  // initial fetch
  useEffect(() => {
    fetchAllTweets();
  }, [fetchAllTweets]);

  return { tweets, error, loading, fetchAllTweets, hasMore };
};
