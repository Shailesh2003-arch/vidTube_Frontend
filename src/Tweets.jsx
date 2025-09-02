import { TweetCard } from "./components/TweetCard";
import { useTweets } from "./hooks/useTweets";
export const Tweets = () => {
  const { tweets } = useTweets();

  return (
    <div className="flex h-screen">
      {/* Main content */}
      <div className="flex-1 p-2 flex flex-col">
        {/* Heading fixed at top */}
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white dark:bg-gray-900 z-10 p-2">
          Tweets
        </h2>

        {/* Scrollable tweets */}
        <div className="flex-1 overflow-y-auto  columns-1 sm:columns-2 lg:columns-3 gap-4">
          {tweets.map((tweet) => (
            <TweetCard key={tweet._id} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
};
