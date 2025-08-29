import { useState } from "react";
import axios from "axios";

const LikeButton = ({ videoId }) => {
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:4000/api/v1/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      console.log("✅ Like response:", res.data);
    } catch (err) {
      console.error("❌ Like error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="px-2 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 "
    >
      {loading ? "Liking..." : "Like this Video"}
    </button>
  );
};

export default LikeButton;
