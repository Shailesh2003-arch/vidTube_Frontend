import { useEffect, useState } from "react";
import { UserProfileHeader } from "../../components/UserProfileHeader";
import { useAuth } from "../../contexts/AuthContext";
import { UserWatchHistoryRow } from "../../components/UserWatchHistory";
export const FeedYou = () => {
  const [userData, setUserData] = useState(null);
  const { userInfo } = useAuth();
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/users/profile", {
        credentials: "include",
      });
      const data = await res.json();
      console.log("User Info from context:", userInfo);
      console.log(data.data);
      setUserData(data.data);
    } catch (error) {
      console.log(`Error Fetching User Profile`, error.message);
    }
  };

  useEffect(() => {
    // Fetch User Profile
    fetchUserProfile();
  }, []);

  if (!userData) {
    return <p className="text-[#f1f1f1]">Loading...</p>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
      <UserProfileHeader
        avatar={userData.avatar}
        fullName={userInfo.fullName}
        username={userInfo.username}
      />
      <div>
        <UserWatchHistoryRow />
      </div>
    </div>
  );
};
