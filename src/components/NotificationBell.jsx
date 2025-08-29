import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
// import { socket } from "../socket";
import { useAuth } from "../contexts/AuthContext";
export const NotificationBell = () => {
  const { notifications } = useAuth(); // saare notifications
  const [unreadCount, setUnreadCount] = useState(0); // badge ke liye
  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  //   badge reset on click
  const handleClick = () => {
    setUnreadCount(0);
  };

  return (
    <div
      className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
      onClick={handleClick}
    >
      <Bell size={35} className="w-6 h-6 text-gray-700 dark:text-gray-200" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};
