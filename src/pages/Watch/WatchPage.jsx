import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { VideoPlayer } from "../../components/watch-page-components/VideoPlayer";
import { VideoDetails } from "../../components/watch-page-components/VideoDetails";
import { CommentsSection } from "../../components/watch-page-components/CommentsSection";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
// import { RecommendedVideos } from "../../components/watch-page-components/RecommendedVideos";

export default function WatchPage() {
  // const { state } = useLocation();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  useEffect(() => {
    // agar state se video nahi mila, toh fetch karo
    if (!video) {
      const fetchVideo = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `http://localhost:4000/api/v1/videos/vId/${videoId}`,
            { withCredentials: true }
          );
          setVideo(res.data.data);
        } catch (err) {
          console.error("Failed to load video:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVideo();
    }
  }, [video, videoId]);

  if (loading) return <p className="p-4">Loading video...</p>;
  if (!video) return <p className="p-4">Video not found</p>;

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 gap-6">
      {/* Main Video Section */}
      <div className="flex-1">
        { console.log(video)}
        <VideoPlayer videoUrl={video.videoFile} />
        <VideoDetails
          title={video.title}
          views={video.views}
          createdAt={video.createdAt}
          owner={video.videoOwner}
          description={video.description}
        />
        {console.log(userInfo)}
        <CommentsSection avatar={userInfo.avatar} alt={userInfo.username} />
      </div>

      {/* Sidebar with Recommended videos */}
      <div className="w-full lg:w-1/3">{/* <RecommendedVideos /> */}</div>
    </div>
  );
}


// {/*state?.video ||*/ }
// {/*!state?.video*/}