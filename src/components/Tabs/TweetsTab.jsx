import { useTweets } from "../../hooks/useTweets";
import { Plus } from "lucide-react";
export default function TweetsTab() {
  const { error, tweets, loading } = useTweets();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4 flex-none">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Tweets
        </h2>
        <button
          onClick={() => {
            // setIsUploadPlaylistModalOpen(true);
            // setEditPlaylist(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Tweet
        </button>
      </div>

      <div className="p-4 columns-1 sm:columns-2 lg:columns-3 gap-4">
        {tweets.map((tweet) => (
          <div
            key={tweet._id}
            className="mb-4 break-inside-avoid rounded-xl border shadow-sm 
        bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <div className={`${tweet.image ? "p-4" : "p-3"}`}>
              <p className="text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-relaxed">
                {tweet.content}
              </p>

              {tweet.image?.url ? (
                <img
                  src={tweet.image.url}
                  alt="Tweet"
                  className="mt-3 w-full rounded-lg object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
