import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export const useTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuth();
  const userId = userInfo._id;

  const fetchMyTweets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:4000/api/v1/users/tweets/${userId}`,
        {
          withCredentials: true, // jwt cookie bhejna
        }
      );
      setTweets(res.data.data);
      console.log(res);
    } catch (err) {
      console.error("Error fetching tweets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchMyTweets();
  }, [userId]);

  const createTweet = async (tweetData) => {
    try {
      let res;
      if (tweetData instanceof FormData) {
        res = await fetch("http://localhost:4000/api/v1/users/tweets/create", {
          method: "POST",
          body: tweetData,
          credentials: "include",
        });
      } else {
        res = await fetch("http://localhost:4000/api/v1/users/tweets/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tweetData),
          credentials: "include",
        });
      }
      const data = await res.json();
      if (res.ok) {
        await fetchMyTweets();
      } else {
        alert(data.message || "Failed to post tweet");
      }
    } catch (error) {
      console.log(`Error creating the Tweet`, error.message);
    }
  };

  const updateTweet = async (tweetId, tweetData) => {
    try {
      let res;
      if (tweetData instanceof FormData) {
        res = await fetch(
          `http://localhost:4000/api/v1/users/tweets/${tweetId}`,
          {
            method: "PATCH",
            body: tweetData,
            credentials: "include",
          }
        );
      } else {
        res = await fetch(
          `http://localhost:4000/api/v1/users/tweets/${tweetId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tweetData),
            credentials: "include",
          }
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update tweet");
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    loading,
    error,
    fetchMyTweets,
    tweets,
    createTweet,
    updateTweet,
  };
};
