import AuthForm from "./pages/Auth/AuthForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/Home/HomePage";
import { FeedLayout } from "./FeedLayout";
import { FeedYou } from "./pages/Feed/FeedYou";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import StudioLayout from "./pages/studio/StudioLayout";
import VideosPage from "./pages/Studio/VideosPage";
import CommunityPostPage from "./pages/Studio/CommunityPostPage";
import { Tweets } from "./Tweets";
import PlaylistDetailsPage from "./pages/Studio/PlayListDetailsPage";
function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/register" replace />} />
              <Route path="/register" element={<AuthForm />} />

              {/* Protected /feed routes with layout */}
              <Route path="/feed" element={<FeedLayout />}>
                <Route path="homepage" element={<HomePage />} />
                <Route path="you" element={<FeedYou />} />
                <Route path="tweets" element={<Tweets />} />
              </Route>
              {/* studio */}
              <Route path="/studio" element={<StudioLayout />}>
                <Route path="videos" element={<VideosPage />} />
                <Route path="community" element={<CommunityPostPage />} />
                <Route
                  path="playlists/:playlistId"
                  element={<PlaylistDetailsPage />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>

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
