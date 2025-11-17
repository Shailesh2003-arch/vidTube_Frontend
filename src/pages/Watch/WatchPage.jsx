import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { VideoPlayer } from "../../components/watch-page-components/VideoPlayer";
import { VideoDetails } from "../../components/watch-page-components/VideoDetails";
import { CommentsSection } from "../../components/watch-page-components/CommentsSection";
import { useAuth } from "../../contexts/AuthContext";
import socket from "../../socket";
import api from "../../api/axios";
import VideoSkeleton from "../../components/skeleton/VideoSkeleton";

import { useWatchHistory } from "../../contexts/WatchHistoryContext";

export default function WatchPage() {
  // const { state } = useLocation();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { userInfo } = useAuth();
  const { refreshHistory } = useWatchHistory();

  useEffect(() => {
    // agar state se video nahi mila, toh fetch karo
    if (!video) {
      const fetchVideo = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/api/v1/videos/vId/${videoId}`);
          const data = res.data.data;
          setVideo(data);
          setIsSubscribed(data.isSubscribed);
          setViewCount(data.views);
          setLikeCount(data.likeCount);
          setDislikeCount(data.dislikeCount);
          setSubscribersCount(data.videoOwner.subscribersCount);

          refreshHistory();
        } catch (err) {
          console.error("Failed to load video:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVideo();
    }
  }, [video, videoId]);

  useEffect(() => {
    if (!videoId) return;

    // join that specific video room
    socket.emit("joinVideoRoom", videoId);

    // listen for live view updates
    socket.on("viewCountUpdated", ({ videoId: id, newCount }) => {
      if (id === videoId) {
        setViewCount(newCount);
      }
    });

    // 👇 New listener for like/dislike live updates
    socket.on(
      "likeDislikeUpdated",
      ({ videoId: id, likeCount, dislikeCount }) => {
        if (id === videoId) {
          setLikeCount(likeCount);
          setDislikeCount(dislikeCount);
        }
      }
    );

    // cleanup on unmount
    return () => {
      socket.emit("leaveVideoRoom", videoId);
      socket.off("viewCountUpdated");
      socket.off("likeDislikeUpdated");
    };
  }, [videoId]);

  // if (loading) return <p className="p-4">Loading video...</p>;

  if (loading)
    return (
      <div className="p-4">
        <VideoSkeleton />
      </div>
    );
  if (!video) return <p className="p-4">Video not found</p>;

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 gap-6">
      {/* Main Video Section */}
      <div className="flex-1">
        {console.log(video)}
        <VideoPlayer videoUrl={video.videoFile} />
        <VideoDetails
          title={video.title}
          views={viewCount}
          createdAt={video.createdAt}
          owner={video.videoOwner}
          description={video.description}
          likeCount={likeCount}
          videoId={videoId}
          dislikeCount={dislikeCount}
          subscribers={subscribersCount}
          channelId={video.videoOwner?._id}
          isSubscribed={isSubscribed}
          setIsSubscribed={setIsSubscribed}
          setSubscribersCount={setSubscribersCount}
        />
        {/* {console.log(userInfo)} */}
        <CommentsSection
          videoId={videoId}
          avatar={userInfo.avatar}
          alt={userInfo.username}
        />
      </div>

      {/* Sidebar with Recommended videos */}
      <div className="w-full lg:w-1/3">{/* <RecommendedVideos /> */}</div>
    </div>
  );
}
