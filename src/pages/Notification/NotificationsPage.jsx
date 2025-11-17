import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import timeAgo from "../../utils/formatTimeAgo";

const Notifications = () => {
  const { notifications, setNotifications } = useAuth();

  const markAsRead = async (id) => {
    try {
      await api.put(`/users/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full px-6 py-2 bg-background text-foreground transition-colors duration-300">
      <h1 className="text-3xl font-semibold mb-4 sticky top-0 bg-background z-10">
        Notifications
      </h1>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center mt-10 text-lg">
            No notifications yet 💨
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              className={`p-4 rounded-2xl shadow-sm border transition-all duration-200 cursor-pointer 
                ${
                  n.isRead
                    ? "bg-muted border-transparent hover:bg-muted/80"
                    : "bg-card border-border hover:bg-accent"
                }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={n.sender?.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
                <div>
                  <p className="font-medium text-base">{n.message}</p>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
