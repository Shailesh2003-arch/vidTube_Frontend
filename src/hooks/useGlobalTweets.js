import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

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
      const res = await api.get("/api/v1/users/tweets/tweets", {
        params: { limit, cursor },
      });

      const { tweets: newTweets, nextCursor } = res.data.data;

      // merge + dedupe
      setTweets((prev) => {
        const merged = [...prev, ...newTweets];
        return Array.from(new Map(merged.map((t) => [t._id, t])).values());
      });

      setCursor(nextCursor || null);
      setHasMore(Boolean(nextCursor)); // no nextCursor → no more data
    } catch (err) {
      setError(err);

      if (err.response?.status === 401) {
        console.warn("Session expired, stopping further requests");
        setHasMore(false);
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
