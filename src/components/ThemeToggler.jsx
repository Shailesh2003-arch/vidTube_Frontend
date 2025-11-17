import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggler = ({ collapsed = false }) => {
  const { themeMode, lightTheme, darkTheme } = useTheme();

  const toggleTheme = () => {
    if (themeMode === "dark") {
      lightTheme();
    } else {
      darkTheme();
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-4 p-2 rounded-md w-full text-gray-900 dark:text-gray-100 
        hover:bg-gray-200 dark:hover:bg-gray-700 transition`}
    >
      {themeMode === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
      {!collapsed && (
        <span className="text-sm font-medium">
          {themeMode === "light" ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
};
