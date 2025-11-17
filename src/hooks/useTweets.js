import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

export const useTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuth();
  const userId = userInfo?._id;

  // Fetch tweets
  const fetchMyTweets = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/users/tweets/${userId}`);
      setTweets(res.data.data);
    } catch (err) {
      console.error("Error fetching tweets", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchMyTweets();
  }, [userId]);

  // CREATE Tweet
  const createTweet = async (tweetData) => {
    try {
      const headers =
        tweetData instanceof FormData
          ? {}
          : { "Content-Type": "application/json" };

      await api.post(`/api/v1/users/tweets/create`, tweetData, { headers });

      await fetchMyTweets();
    } catch (err) {
      console.log("Error creating tweet:", err);
      alert(err?.response?.data?.message || "Failed to post tweet");
    }
  };

  // UPDATE Tweet
  const updateTweet = async (tweetId, tweetData) => {
    try {
      const headers =
        tweetData instanceof FormData
          ? {}
          : { "Content-Type": "application/json" };

      const res = await api.patch(
        `/api/v1/users/tweets/${tweetId}`,
        tweetData,
        {
          headers,
        }
      );

      await fetchMyTweets();
      return res.data;
    } catch (err) {
      console.error("Update tweet error:", err);
      throw err;
    }
  };

  // DELETE Tweet
  const deleteTweet = async (tweetId) => {
    try {
      await api.delete(`/api/v1/users/tweets/${tweetId}`);

      await fetchMyTweets();
    } catch (err) {
      console.error("Delete tweet error:", err);
      alert(err?.response?.data?.message || "Failed to delete tweet");
    }
  };

  return {
    loading,
    error,
    tweets,
    fetchMyTweets,
    createTweet,
    updateTweet,
    deleteTweet,
  };
};
