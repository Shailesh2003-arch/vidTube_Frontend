// FeedLayout.jsx
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

export const FeedLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};
