import { useState } from "react";
import CommunityPostCard from "./components/CommunityPostCard";
import { useGlobalTweets } from "./hooks/useGlobalTweets";
export const Tweets = () => {
  const { tweets, loading, hasMore, fetchAllTweets, error } = useGlobalTweets();

  if (error) return <p>Error: {error.message}</p>;

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
            <CommunityPostCard key={tweet._id} tweet={tweet} />
          ))}

          {loading && <p>Loading...</p>}

          <div className="flex justify-center mt-4">
            {hasMore && !loading && (
              <button onClick={fetchAllTweets}>Load More</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
