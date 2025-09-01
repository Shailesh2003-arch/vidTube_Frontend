import { useLocation, useNavigate } from "react-router-dom";
import VideosTab from "../../components/Tabs/VideosTab";
import PlaylistsTab from "../../components/Tabs/PlaylistsTab";
import TweetsTab from "../../components/Tabs/TweetsTab";

// After refractoring the code...
export default function VideosPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const activeTab = params.get("tab") || "videos";

  const tabs = [
    { key: "videos", label: "Videos" },
    { key: "playlists", label: "Playlists" },
    { key: "tweets", label: "Tweets" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Channel Content
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Manage and organize your content here.
      </p>
      <div className="flex gap-4 border-b mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(`?tab=${tab.key}`)}
            className={activeTab === tab.key ? "text-blue-600 border-b-2" : ""}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "videos" && <VideosTab />}
      {activeTab === "playlists" && <PlaylistsTab />}
      {activeTab === "tweets" && <TweetsTab />}
    </div>
  );
}
