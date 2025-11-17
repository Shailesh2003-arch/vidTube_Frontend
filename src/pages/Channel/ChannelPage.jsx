import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import timeAgo from "../../utils/formatTimeAgo";

import { UserPlaylistCard } from "../../components/UserPlaylistCard/UserPlaylistCard";

const ChannelPage = () => {
  const { username } = useParams();
  const { userInfo: loggedInUser } = useAuth();
  const [channelData, setChannelData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await api.get(`/users/${username}`);
        const data = res.data.data;

        setChannelData(data);
        setIsOwner(
          loggedInUser?.username?.toLowerCase() ===
            data.user.username?.toLowerCase()
        );
      } catch (err) {
        console.error(
          "Error fetching channel data:",
          err.response?.data || err.message
        );
      }
    };

    if (username) fetchChannel();
  }, [username, loggedInUser]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    const endpointMap = {
      avatar: "update-avatar",
      coverImage: "update-coverImage",
    };

    const endpoint = endpointMap[type];
    if (!endpoint) {
      console.error("Invalid update type!");
      return;
    }

    setUploading(true);

    // here also we have not used axios instance...

    // try {
    //   await axios.patch(
    //     `http://localhost:4000/api/v1/users/${endpoint}`,
    //     formData,
    //     { withCredentials: true }
    //   );

    //   const refreshed = await axios.get(
    //     `http://localhost:4000/api/v1/users/${username}`,
    //     { withCredentials: true }
    //   );
    //   setChannelData(refreshed.data.data);
    // } catch (err) {
    //   console.error("Error updating image:", err);
    // } finally {
    //   setUploading(false);
    // }

    try {
      // Update the user (endpoint could be 'avatar', 'banner', etc.)
      await api.patch(`/users/${endpoint}`, formData);

      // Fetch refreshed user data
      const refreshed = await api.get(`/users/${username}`);
      setChannelData(refreshed.data.data);
    } catch (err) {
      console.error("Error updating image:", err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!channelData) return <p>Loading...</p>;

  const { user, videos, playlists } = channelData;

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* ===== FIXED HEADER SECTION ===== */}
      <div className="flex-shrink-0">
        {/* Cover Image */}
        <div className="relative w-full h-56 sm:h-72 md:h-80 bg-muted">
          <img
            src={user.coverImage || "/default-cover.jpg"}
            alt="cover"
            className="w-full h-full object-cover"
          />

          {isOwner && (
            <>
              <input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                className="hidden"
                onChange={(e) => handleFileChange(e, "coverImage")}
              />
              <button
                onClick={() => coverInputRef.current.click()}
                disabled={uploading}
                className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 text-sm rounded-md hover:bg-black/80 transition"
              >
                {uploading ? "Uploading..." : "Change Cover"}
              </button>
            </>
          )}

          {/* Avatar + Username */}
          <div className="absolute -bottom-14 left-6 flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-background object-cover shadow-lg"
              />
              {isOwner && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "avatar")}
                  />
                  <button
                    onClick={() => avatarInputRef.current.click()}
                    disabled={uploading}
                    className="absolute bottom-1 right-1 bg-black/70 text-xs text-white px-2 py-1 rounded-md hover:bg-black/90 transition"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.username}</h2>
              <p className="text-sm text-muted-foreground">
                {user.subscribersCount} subscribers
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 border-b border-border flex gap-6 px-6 text-muted-foreground font-medium sticky top-0 bg-background z-10">
          {["videos", "playlists"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 capitalize border-b-2 transition ${
                activeTab === tab
                  ? "text-foreground border-foreground"
                  : "border-transparent hover:text-foreground hover:border-foreground/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ===== SCROLLABLE CONTENT SECTION ===== */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos?.length ? (
              videos.map((video) => (
                <Link
                  key={video._id}
                  to={`/feed/watch/${video._id}`} // 👈 your original watch route
                  state={{ video }}
                  className="group block"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Duration */}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration || "0:00"}
                    </span>
                  </div>

                  {/* Video Info */}
                  <div className="flex mt-2 gap-3">
                    {/* Avatar */}
                    <img
                      src={user?.avatar || "/default-avatar.png"}
                      alt={video.videoOwner?.username || "User"}
                      loading="lazy"
                      className="w-9 h-9 rounded-full object-cover"
                    />

                    <div className="flex flex-col">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                        {video.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.username || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {video.views || 0} views • {timeAgo(video.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-full mt-10">
                No videos uploaded yet 🎬
              </p>
            )}
          </div>
        )}

        {/* Playlists Tab */}
        {activeTab === "playlists" && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists?.length ? (
              playlists.map((pl) => (
                <UserPlaylistCard key={pl._id} playlist={pl} />
              ))
            ) : (
              <p className="text-center text-muted-foreground mt-10 col-span-full">
                No playlists yet 📁
              </p>
            )}
          </div>
        )}

        {/* About Tab */}
        {/* {activeTab === "about" && (
          <div className="text-sm text-muted-foreground max-w-2xl mx-auto mt-10 leading-relaxed">
            <p>
              {user.about ||
                "This creator hasn't added a description yet. Check back later!"}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ChannelPage;
