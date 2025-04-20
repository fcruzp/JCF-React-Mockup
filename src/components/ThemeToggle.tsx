import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage and system preference on initial render
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme') === 'dark') {
      return true;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Update class and localStorage when theme changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Moon size={20} className="text-gray-800 dark:text-gray-200" />
      ) : (
        <Sun size={20} className="text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
}