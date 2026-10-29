import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command as CommandIcon, X, ChevronDown, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
  section?: string;
  keywords?: string[];
}

interface SearchCommandProps {
  items: CommandItem[];
  placeholder?: string;
  className?: string;
  onClose?: () => void;
}

export function SearchCommand({ items, placeholder = 'Search commands...', className, onClose }: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredItems = items
    .filter((item) => {
      if (!query) return true;
      const searchText = [
        item.label,
        item.description,
        item.section,
        ...(item.keywords || []),
      ].join(' ').toLowerCase();
      return searchText.includes(query.toLowerCase());
    })
    .map((item, index) => ({ ...item, originalIndex: index }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          setQuery('');
          setIsOpen(false);
          onClose?.();
        }
        break;
      case 'Escape':
        setQuery('');
        setIsOpen(false);
        onClose?.();
        break;
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex(0);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const scrollToSelected = useCallback(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    scrollToSelected();
  }, [selectedIndex, scrollToSelected]);

  if (!isOpen && !query) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex items-start justify-center pt-20 px-4'
        onClick={() => { setIsOpen(false); onClose?.(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={clsx('w-full max-w-2xl', className)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden'>
            <div className='relative p-4'>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                <input
                  ref={inputRef}
                  type='text'
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsOpen(true)}
                  placeholder={placeholder}
                  className='w-full pl-12 pr-12 py-3 text-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
                />
                {query && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuery('')}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  >
                    <X className='w-5 h-5' />
                  </motion.button>
                )}
              </div>
              <div className='flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400'>
                <kbd className='px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 font-mono'>⌘K</kbd>
                <span>to open</span>
                <span className='mx-1'>•</span>
                <kbd className='px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 font-mono'>↑↓</kbd>
                <span>to navigate</span>
                <span className='mx-1'>•</span>
                <kbd className='px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 font-mono'>Enter</kbd>
                <span>to select</span>
              </div>
            </div>

            <AnimatePresence mode='popLayout'>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='max-h-96 overflow-y-auto'
              >
                <div ref={listRef} className='py-2'>
                  {filteredItems.length === 0 ? (
                    <div className='px-4 py-8 text-center text-slate-500 dark:text-slate-400'>
                      No commands found
                    </div>
                  ) : (
                    <>
                      {Array.from(new Set(filteredItems.map((i) => i.section).filter(Boolean))).map((section) => (
                        <div key={section} className='px-4 py-2'>
                          <h4 className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
                            {section}
                          </h4>
                          {filteredItems
                            .filter((item) => item.section === section)
                            .map((item, index) => (
                              <motion.button
                                key={item.id}
                                onClick={() => { item.action(); setQuery(''); setIsOpen(false); onClose?.(); }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={clsx(
                                  'w-full px-4 py-3 rounded-xl text-left transition-colors flex items-center gap-3',
                                  selectedIndex === filteredItems.indexOf(item)
                                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                )}
                              >
                                {item.icon && (
                                  <span className='w-8 h-8 flex items-center justify-center text-slate-400'>
                                    {item.icon}
                                  </span>
                                )}
                                <div className='flex-1 min-w-0'>
                                  <p className='font-medium truncate'>{item.label}</p>
                                  {item.description && (
                                    <p className='text-sm text-slate-500 dark:text-slate-400 truncate'>{item.description}</p>
                                  )}
                                </div>
                                {item.shortcut && (
                                  <kbd className='px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500 dark:text-slate-400 font-mono'>
                                    {item.shortcut}
                                  </kbd>
                                )}
                              </motion.button>
                            ))}
                        </div>
                      ))}
                      {filteredItems.filter((i) => !i.section).map((item) => (
                        <motion.button
                          key={item.id}
                          onClick={() => { item.action(); setQuery(''); setIsOpen(false); onClose?.(); }}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={clsx(
                            'w-full px-4 py-3 rounded-xl text-left transition-colors flex items-center gap-3',
                            selectedIndex === filteredItems.indexOf(item)
                              ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          )}
                        >
                          {item.icon && (
                            <span className='w-8 h-8 flex items-center justify-center text-slate-400'>
                              {item.icon}
                            </span>
                          )}
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium truncate'>{item.label}</p>
                            {item.description && (
                              <p className='text-sm text-slate-500 dark:text-slate-400 truncate'>{item.description}</p>
                            )}
                          </div>
                          {item.shortcut && (
                            <kbd className='px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500 dark:text-slate-400 font-mono'>
                              {item.shortcut}
                            </kbd>
                          )}
                        </motion.button>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SearchCommand;
