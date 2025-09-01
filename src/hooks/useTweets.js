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
    } catch (err) {
      console.error("Error fetching tweets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTweets();
  }, []);

  return { loading, error, fetchMyTweets, tweets };
};
