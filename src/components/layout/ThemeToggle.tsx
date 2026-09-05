import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'pill' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'segmented') {
    const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
      { mode: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
      { mode: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
      { mode: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
    ];

    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${className}`}>
        {options.map((opt) => {
          const isActive = theme === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setTheme(opt.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={isActive ? (opt.mode === 'light' ? 'text-amber-500' : opt.mode === 'dark' ? 'text-[#FF2E7E]' : 'text-cyan-500') : ''}>
                {opt.icon}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium ${
          resolvedTheme === 'dark'
            ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
        } ${className}`}
        title={`Current: ${resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}. Click to switch.`}
      >
        {resolvedTheme === 'dark' ? (
          <>
            <Moon className="w-3.5 h-3.5 text-[#FF2E7E]" />
            <span className="hidden sm:inline">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Light</span>
          </>
        )}
      </button>
    );
  }

  // Compact variant (Default for Navbar/Header)
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all relative group flex items-center justify-center ${
        resolvedTheme === 'dark'
          ? 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-slate-800'
          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      aria-label={`Toggle theme (Currently ${resolvedTheme} mode)`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform group-hover:-rotate-12 duration-300" />
      )}
    </button>
  );
};
