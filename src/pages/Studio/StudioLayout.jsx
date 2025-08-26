import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  Video,
  ListVideo,
  BarChart3,
} from "lucide-react";

export default function StudioLayout() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 w-60 transform 
      bg-gray-100 dark:bg-gray-800 p-4 flex flex-col gap-4 
      transition-transform duration-300 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Studio</h2>
          {/* Close button (mobile only) */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            {
              to: "/studio/dashboard",
              label: "Dashboard",
              icon: <LayoutDashboard size={18} />,
            },
            {
              to: "/studio/videos",
              label: "Content",
              icon: <Video size={18} />,
            },
            {
              to: "/studio/analytics",
              label: "Analytics",
              icon: <BarChart3 size={18} />,
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                location.pathname.includes(item.to.split("/")[2])
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              onClick={() => setIsOpen(false)} // close sidebar on nav click
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hamburger (mobile only) */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 text-gray-700 dark:text-gray-300"
        >
          <Menu size={24} />
        </button>

        {/* Scrollable outlet container */}
        <div className="flex-1 overflow-y-auto p-6 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
