import AuthForm from "./pages/Auth/AuthForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/Home/HomePage";
import { FeedLayout } from "./FeedLayout";
// import {StudioLayout} from "./pages/studio/StudioLayout";
import { FeedYou } from "./pages/Feed/FeedYou";
import VideosPage from "./pages/Studio/VideosPage";
import { Tweets } from "./Tweets";
import PlaylistDetailsPage from "./pages/Studio/PlayListDetailsPage";
import WatchPage from "./pages/Watch/WatchPage";
import NotificationsPage from "./pages/Notification/NotificationsPage";
import ChannelPage from "./pages/Channel/ChannelPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import HistoryPage from "./pages/History/HistoryPage";
import { useAuth } from "./contexts/AuthContext";
import PlaylistPage from "./pages/Playlist/PlayListPage";

function App() {
  const { isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Checking session...
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<AuthForm />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected /feed routes with layout */}

        <Route path="/feed" element={<FeedLayout />}>
          <Route path="homepage" element={<HomePage />} />
          <Route path="watch/:videoId" element={<WatchPage />} />
          <Route path="you" element={<FeedYou />} />
          <Route path="tweets" element={<Tweets />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="channel/:username" element={<ChannelPage />} />
        </Route>
        <Route path="/playlists/:playlistId" element={<PlaylistPage />} />

        {/* studio */}
        <Route path="/studio" element={<StudioLayout />}>
          <Route path="videos" element={<VideosPage />} />
          <Route
            path="playlists/:playlistId"
            element={<PlaylistDetailsPage />}
          />
        </Route>
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
