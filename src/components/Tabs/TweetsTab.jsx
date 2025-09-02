import { useTweets } from "../../hooks/useTweets";
import { Plus } from "lucide-react";
import { CreateTweetModal } from "../Modals/CreateTweetModal";
import { useState } from "react";
import { TweetCard } from "../TweetCard";
export default function TweetsTab() {
  const { error, tweets, loading, fetchMyTweets, createTweet, updateTweet } =
    useTweets();
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);

  const handleEditTweet = (tweet) => {
    setEditingTweet(tweet);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleNewTweet = async (tweetData) => {
    try {
      await createTweet(tweetData); // <-- delegate to hook
      setIsTweetModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4 flex-none">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Tweets
        </h2>
        <button
          onClick={() => {
            setIsTweetModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Tweet
        </button>
      </div>

      <div className="p-4 columns-1 sm:columns-2 lg:columns-3 gap-4">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet._id}
            tweet={tweet}
            onEdit={(tweet) => handleEditTweet(tweet)}
          />
        ))}

        {
          <CreateTweetModal
            isOpen={isTweetModalOpen}
            onClose={() => {
              setIsTweetModalOpen(false);
            }}
            onSubmit={handleNewTweet}
          />
        }
      </div>
    </div>
  );
}
