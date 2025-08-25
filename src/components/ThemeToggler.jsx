import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggler = () => {
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
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:scale-105 transition"
    >
      {themeMode === "light" ? (
        <>
          <Moon className="w-5 h-5" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="w-5 h-5" />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
};
