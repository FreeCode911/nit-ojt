import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { clsx } from 'clsx';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const themes: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <Sun className='w-5 h-5' /> },
    { value: 'dark', label: 'Dark', icon: <Moon className='w-5 h-5' /> },
    { value: 'system', label: 'System', icon: <Monitor className='w-5 h-5' /> },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className={clsx('relative inline-flex', className)}>
      <motion.button
        onClick={() => {
          const currentIndex = themes.findIndex((t) => t.value === theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setTheme(themes[nextIndex].value);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          'relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
          'bg-white dark:bg-slate-800',
          'border border-slate-200 dark:border-slate-700',
          'hover:bg-slate-100 dark:hover:bg-slate-700',
          'text-slate-700 dark:text-slate-300',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
        )}
        aria-label='Toggle theme'
      >
        <AnimatePresence mode='popLayout'>
          <motion.span
            key={theme}
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className='flex items-center justify-center w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
          >
            {currentTheme.icon}
          </motion.span>
        </AnimatePresence>
        {showLabel && (
          <motion.span
            key={theme}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className='text-sm font-medium hidden sm:inline'
          >
            {currentTheme.label}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className='absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 overflow-hidden z-50'
        >
          {themes.map((t) => (
            <motion.button
              key={t.value}
              onClick={() => setTheme(t.value)}
              whileHover={{ x: 4 }}
              className={clsx(
                'w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors',
                theme === t.value
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              <span className={clsx('w-8 h-8 flex items-center justify-center rounded-lg', theme === t.value ? 'bg-brand-100 dark:bg-brand-900/30' : 'bg-slate-100 dark:bg-slate-700')}>
                {t.icon}
              </span>
              <span className='text-sm font-medium'>{t.label}</span>
              {theme === t.value && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='ml-auto w-4 h-4 text-brand-600 dark:text-brand-400'
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggle;
