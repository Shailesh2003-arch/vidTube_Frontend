import { useCallback, useRef } from "react";
import CommunityPostCard from "./components/CommunityPostCard";
import { useGlobalTweets } from "./hooks/useGlobalTweets";
export const Tweets = () => {
  const { tweets, loading, hasMore, fetchAllTweets, error } = useGlobalTweets();
  const observer = useRef();

  const lastTweetRef = useCallback(
    (node) => {
      if (loading) return; // guard: agar already loading, skip

      if (observer.current) observer.current.disconnect(); // purana observer clear

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchAllTweets(); // sirf tabhi call hoga jab aur data hai
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchAllTweets]
  );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-2 flex flex-col">
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white dark:bg-gray-900 z-10 p-2">
          Tweets
        </h2>

        <div className="flex-1 overflow-y-auto columns-1 sm:columns-2 lg:columns-3 gap-4">
          {tweets.map((tweet, index) => {
            if (tweets.length === index + 1) {
              return (
                <div ref={lastTweetRef} key={tweet._id}>
                  <CommunityPostCard tweet={tweet} />
                </div>
              );
            } else {
              return <CommunityPostCard key={tweet._id} tweet={tweet} />;
            }
          })}

          {loading && <p>Loading...</p>}
          {/* {!hasMore && <p className="text-center mt-4">No more tweets</p>} */}
        </div>
      </div>
    </div>
  );
};
