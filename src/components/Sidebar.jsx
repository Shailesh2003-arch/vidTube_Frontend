import { useState, useEffect } from "react";
import { Home, Compass, Video, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for mobile bottom nav
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { icon: <Home size={24} />, label: "Home", path: "/feed/homepage" },
    { icon: <Compass size={24} />, label: "Explore", path: "/feed/explore" },
    { icon: <Video size={24} />, label: "Subscriptions", path: "/feed/subs" },
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
      className={` h-screen p-2 transition-all duration-300 flex flex-col  dark:bg-gray-900 text-black dark:text-white 
      ${collapsed ? "w-15" : "w-56"}`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 p-2  rounded"
      >
        {collapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      {menuItems.map((item, i) => (
        <Link
          key={i}
          to={item.path}
          className={`flex items-center gap-4 p-2  rounded-md  hover:bg-gray-200 dark:hover:bg-gray-700 transition
            ${collapsed ? "flex-col justify-center gap-1" : ""}`}
        >
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </div>
  );
}
