'use client';

import { useState } from 'react';

type Theme = 'system' | 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('cartograph-theme') as Theme) || 'system';
  });

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('cartograph-theme', newTheme);

    const root = document.documentElement;
    const isDark =
      newTheme === 'dark' ||
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  return (
    <div className="flex items-center gap-1 bg-black/4 dark:bg-white/6 p-1 rounded text-xs font-mono">
      <button
        onClick={() => updateTheme('system')}
        className={`px-2 py-1 rounded transition-colors ${
          theme === 'system'
            ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
            : 'text-zinc-500 hover:text-black dark:hover:text-white'
        }`}
        title="Follow system theme"
      >
        sys
      </button>
      <button
        onClick={() => updateTheme('light')}
        className={`px-2 py-1 rounded transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
            : 'text-zinc-500 hover:text-black dark:hover:text-white'
        }`}
        title="Force light theme"
      >
        light
      </button>
      <button
        onClick={() => updateTheme('dark')}
        className={`px-2 py-1 rounded transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
            : 'text-zinc-500 hover:text-black dark:hover:text-white'
        }`}
        title="Force dark theme"
      >
        dark
      </button>
    </div>
  );
}
