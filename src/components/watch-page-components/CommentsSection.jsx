import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import timeAgo from "../../utils/formatTimeAgo";

export const CommentsSection = ({ avatar, alt, videoId }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  const currentUserId = userInfo._id;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/api/v1/comments/${videoId}`);
        setComments(res.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch comments:",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchComments();
  }, [videoId]);

  const handleAddComment = async (text) => {
    try {
      const res = await api.post(`/api/v1/comments/${videoId}`, { text });

      const newComment = res.data.data;

      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setIsFocused(false);
    } catch (err) {
      console.error(
        "Error adding comment:",
        err?.response?.data?.message || err.message
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/v1/comments/comment/${commentId}`);

      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(
        "Error deleting comment:",
        err?.response?.data?.message || err.message
      );
    }
  };

  // const handleAddReply = async (commentId, text) => {
  //   try {
  //     const res = await axios.post(
  //       `http://localhost:4000/api/v1/reply/${commentId}`,
  //       { text },
  //       { withCredentials: true }
  //     );

  //     const newReply = res.data.reply;

  //     setComments((prevComments) =>
  //       prevComments.map((comment) =>
  //         comment._id === commentId
  //           ? { ...comment, replies: [newReply, ...(comment.replies || [])] }
  //           : comment
  //       )
  //     );

  //     setReplyText((prev) => ({ ...prev, [commentId]: "" }));
  //     setShowReplyBox((prev) => ({ ...prev, [commentId]: false }));
  //   } catch (err) {
  //     console.error("Error adding reply:", err);
  //   }
  // };

  const handleAddReply = async (commentId, text) => {
    try {
      const res = await api.post(`api/v1/reply/${commentId}`, { text });
      const newReply = res.data.reply;

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [newReply, ...(comment.replies || [])] }
            : comment
        )
      );

      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyBox((prev) => ({ ...prev, [commentId]: false }));
    } catch (err) {
      console.error(
        "Error adding reply:",
        err?.response?.data?.message || err.message
      );
    }
  };

  const handleViewReplies = async (commentId) => {
    // If replies are already open → toggle off
    if (showReplies[commentId]) {
      setShowReplies((prev) => ({ ...prev, [commentId]: false }));
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(`/api/v1/reply/${commentId}`);
      const fetchedReplies = res.data.replies || [];

      // Insert replies into the correct comment
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: fetchedReplies }
            : comment
        )
      );

      // Show replies for this comment
      setShowReplies((prev) => ({ ...prev, [commentId]: true }));
    } catch (error) {
      console.error(
        "Error fetching replies:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      // 🔥 Optimistic UI update (instant feedback)
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likesCount: comment.likesCount + 1 }
            : comment
        )
      );

      // 📡 Actual API call (your new axios instance)
      const res = await api.post(`/api/v1/comments/${commentId}/like`);
      const { likesCount, dislikesCount } = res.data.data;

      // 🎯 Sync UI with real backend values
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likesCount, dislikesCount }
            : comment
        )
      );
    } catch (error) {
      console.error(
        "Error liking comment:",
        error?.response?.data?.message || error.message
      );
    }
  };

  const handleDislike = async (commentId) => {
    try {
      // 📡 Hit backend using your custom axios instance
      const res = await api.post(`/api/v1/comments/${commentId}/dislike`);

      const { likesCount, dislikesCount } = res.data.data;

      // 🎯 Update UI instantly with the real values
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                likesCount,
                dislikesCount,
              }
            : c
        )
      );
    } catch (error) {
      console.error(
        "Error disliking comment:",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Comments • {comments.length}</h2>
      </div>

      {/* Add Comment */}
      <div className="flex gap-3 mb-6">
        <img src={avatar} alt={alt} className="w-10 h-10 rounded-full" />

        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !commentText && setIsFocused(false)}
            className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 transition-all text-sm py-1"
          />

          {isFocused && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setIsFocused(false);
                  setCommentText("");
                }}
                className="text-sm px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddComment(commentText)}
                disabled={!commentText.trim()}
                className={`text-sm px-4 py-1 rounded-full text-white transition ${
                  commentText.trim()
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment, idx) => (
          <div
            key={idx}
            className="flex gap-3 group hover:bg-gray-50 dark:hover:bg-[#1a1a1a] p-2 rounded-md transition"
          >
            <img
              src={comment?.owner?.avatar}
              alt={comment?.owner?.username}
              className="w-9 h-9 rounded-full"
            />

            <div className="flex-1">
              {/* Top Row — username + delete button */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {comment?.owner?.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {timeAgo(comment?.createdAt) || "2 days ago"}
                  </span>
                </div>

                {/* Delete icon — only visible for the owner */}
                {comment?.owner?._id === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Comment text */}
              <p className="text-sm mt-1">{comment?.text}</p>

              {/* Interaction buttons */}
              <div className="flex items-center gap-4 mt-1 text-gray-500">
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className="flex items-center gap-1 hover:text-blue-500 transition"
                >
                  <ThumbsUp size={16} />{" "}
                  <span className="text-xs">{comment?.likesCount || 0}</span>
                </button>

                <button
                  onClick={() => handleDislike(comment._id)}
                  className="flex items-center gap-1 hover:text-red-400 transition"
                >
                  <ThumbsDown size={16} />{" "}
                  <span className="text-xs">{comment?.dislikesCount || 0}</span>
                </button>
                <button
                  onClick={() =>
                    setShowReplyBox((prev) => ({
                      ...prev,
                      [comment._id]: !prev[comment._id],
                    }))
                  }
                  className="text-xs font-medium hover:text-blue-400 transition"
                >
                  Reply
                </button>
                {showReplyBox[comment._id] && (
                  <div className="mt-2 ml-10">
                    <input
                      type="text"
                      placeholder="Reply..."
                      value={replyText[comment._id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [comment._id]: e.target.value,
                        }))
                      }
                      className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 text-sm py-1"
                    />
                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={() =>
                          setShowReplyBox((prev) => ({
                            ...prev,
                            [comment._id]: false,
                          }))
                        }
                        className="text-xs px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleAddReply(comment._id, replyText[comment._id])
                        }
                        disabled={!replyText[comment._id]?.trim()}
                        className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {comment.replies?.length > 0 && (
                  <div className="mt-2 ml-10">
                    <button
                      onClick={() => handleViewReplies(comment._id)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      {showReplies[comment._id]
                        ? "Hide replies"
                        : `View replies (${comment.replies?.length || 0})`}
                    </button>

                    {showReplies[comment._id] && (
                      <div className="mt-2 space-y-3 border-l border-gray-300 pl-3">
                        {comment.replies.map((reply, ridx) => (
                          <div key={ridx} className="flex gap-2">
                            <img
                              src={reply.user?.avatar}
                              alt={reply.user?.username}
                              className="w-7 h-7 rounded-full"
                            />
                            <div>
                              <p className="text-sm">
                                <span className="font-semibold">
                                  {reply.user?.username}
                                </span>{" "}
                                {reply.text}
                              </p>
                              <p className="text-xs text-gray-500">
                                {timeAgo(reply.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
