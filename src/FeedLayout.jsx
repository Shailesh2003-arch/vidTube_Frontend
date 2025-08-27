// FeedLayout.jsx
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

export const FeedLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-16 md:pb-0 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};
