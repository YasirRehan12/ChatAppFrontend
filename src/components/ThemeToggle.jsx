import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-darkPanel text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-accent-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center transition-transform ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon size={14} className="text-accent-600" /> : <Sun size={14} className="text-yellow-500" />}
      </span>
    </button>
  );
};

export default ThemeToggle;
