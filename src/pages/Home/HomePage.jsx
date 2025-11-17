import { useState, useEffect, useCallback, useRef } from "react";
import { VideoCard } from "../../components/VideoCard";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Settings, Moon, Sun, LogOut } from "lucide-react";
import { fetchHomePageVideos } from "../../services/videoService";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
// import axios from "axios";
import api from "../../api/axios";
import VideoCardSkeleton from "../../components/skeleton/VideoCardSkeleton";

export const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const {
    notifications = [],
    setUserInfo,
    setNotifications,
    userInfo,
  } = useAuth() || {};
  const { lightTheme, darkTheme, themeMode } = useTheme();
  // console.log(notifications);

  const toggleTheme = () => {
    if (themeMode === "dark") lightTheme();
    else darkTheme();
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/users/logout", {});
      setUserInfo(null);
      setNotifications([]);
      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("watch_history");
      navigate("/register");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const observer = useRef(null);

  const loadVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchHomePageVideos(cursor, 10);
      // console.log(`Total videos rendered`, data.videos.length);

      if (data?.videos?.length > 0) {
        setVideos((prev) => {
          const combined = [...prev, ...data.videos];
          return combined.filter(
            (video, index, self) =>
              index === self.findIndex((v) => v._id === video._id)
          );
        });

        setCursor(data.nextCursor || null); // ✅ update cursor
        setHasMore(Boolean(data.nextCursor));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error.message);
      setHasMore(false); // 🛑 avoid infinite requests
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("👀 Bottom reached, fetching more videos");
          loadVideos();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadVideos]
  );

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 flex flex-col relative">
        {/* ===== Fixed Top Bar ===== */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-md">
          {/* Left side (optional: add logo or title later) */}
          <div></div>

          {/* Right section: Notifications + Profile */}
          <div className="flex items-center gap-4 ml-auto relative">
            {/* Notification Bell */}
            <Link
              to="/feed/notifications"
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden hover:ring-2 hover:ring-blue-400 transition"
              >
                {userInfo?.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 dark:text-gray-200 font-semibold">
                    {userInfo?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border dark:border-gray-700">
                  <Link
                    to={`/feed/channel/${userInfo?.username}`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>

                  <Link
                    to="/feed/settings"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>

                  <button
                    onClick={() => {
                      toggleTheme();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    {themeMode === "dark" ? (
                      <>
                        <Sun className="w-4 h-4" /> Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" /> Dark Mode
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-700 dark:text-red-400 transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Scrollable Video Grid ===== */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video, idx) =>
              idx === videos.length - 1 ? (
                <VideoCard ref={lastVideoRef} key={video._id} video={video} />
              ) : (
                <VideoCard key={video._id} video={video} />
              )
            )}
          </div>
          {/* 
          {loading && (
            <div className="flex justify-center mt-6">
              <p>Loading...</p>
            </div>
          )} */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <VideoCardSkeleton key={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
