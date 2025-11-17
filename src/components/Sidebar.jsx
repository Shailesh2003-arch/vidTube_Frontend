import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, Menu, X, Feather, Plus, LogOut } from "lucide-react";
import { ThemeToggler } from "./ThemeToggler.jsx";
import api from "../api/axios.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { userInfo, setUserInfo, setNotifications } = useAuth();
  const navigate = useNavigate();

  // Detect screen size for mobile bottom nav
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout", {});

      // Clear auth + notifications
      setUserInfo(null);
      setNotifications([]);
      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("watch_history");

      navigate("/register");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const menuItems = [
    { icon: <Home size={24} />, label: "Home", path: "/feed/homepage" },
    { icon: <Plus size={24} />, label: "Create", path: "/studio/videos" },
    { icon: <Feather size={24} />, label: "Tweets", path: "/feed/tweets" },
    { icon: <User size={24} />, label: "Profile", path: "/feed/you" },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 text-black dark:text-white flex justify-around p-2 z-50">
        {menuItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className="flex flex-col items-center text-sm "
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`h-screen p-2 transition-all duration-300 flex flex-col justify-between dark:bg-gray-900 text-black dark:text-white 
      ${collapsed ? "w-16" : "w-56"}`}
    >
      {/* Top section (toggle + menu) */}
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {collapsed ? <Menu size={24} /> : <X size={24} />}
        </button>

        {menuItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`flex items-center gap-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition
              ${collapsed ? "flex-col justify-center gap-1" : ""}`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Bottom section (Theme + Logout) */}
      <div className="flex flex-col gap-2">
        <ThemeToggler collapsed={collapsed} />

        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 p-2 rounded-md transition font-medium mb-2
      hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500
      ${collapsed ? "flex-col justify-center gap-1" : ""}`}
        >
          <LogOut size={24} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
