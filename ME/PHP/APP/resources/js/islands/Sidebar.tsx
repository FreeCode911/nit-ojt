import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, X, Menu, Home, Briefcase, BookOpen, Star, Users, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: NavItem[];
  roles?: string[];
}

interface SidebarProps {
  user?: { name: string; role: string; avatar?: string };
  navigation: NavItem[];
  className?: string;
  defaultOpen?: boolean;
}

export function Sidebar({ user, navigation, className, defaultOpen = true }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (label: string) => {
    setExpandedItems((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]);
  };

  const isItemExpanded = (label: string) => expandedItems.includes(label);

  const handleNavClick = (href: string) => {
    if (href.startsWith('http') || href.startsWith('#')) {
      window.open(href, '_blank');
    } else {
      window.location.href = href;
    }
    if (window.innerWidth < 1024) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: isOpen ? '16rem' : '4.5rem' }}
        animate={{ width: isOpen ? '16rem' : '4.5rem' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={clsx(
          'fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50 flex flex-col overflow-hidden',
          className
        )}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">OJT</span>
            </div>
            {isOpen && <span className="font-semibold text-xl text-slate-900 dark:text-white whitespace-nowrap">OJT Logbook</span>}
          </motion.div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              'p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
              isOpen ? 'ml-auto' : 'mx-auto'
            )}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronRight className={clsx('w-5 h-5 transition-transform', isOpen ? 'rotate-180' : '')} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" role="navigation" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <NavItem
              key={item.href + index}
              item={item}
              isOpen={isOpen}
              expanded={isItemExpanded(item.label)}
              onToggle={() => item.children && toggleItem(item.label)}
              onClick={() => handleNavClick(item.href)}
            />
          ))}
        </nav>

        {/* User section */}
        <AnimatePresence>
          {isOpen && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white font-medium">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Mobile menu button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </motion.button>
    </>
  );
}

// NavItem sub-component
function NavItem({ item, isOpen, expanded, onToggle, onClick }: {
  item: NavItem;
  isOpen: boolean;
  expanded: boolean;
  onToggle: () => void;
  onClick: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        onClick={onClick}
        className={clsx(
          'relative flex items-center justify-center w-10 h-10 mx-auto rounded-xl text-slate-500 dark:text-slate-400',
          'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400',
          'transition-all duration-200 group'
        )}
        aria-label={item.label}
        title={item.label}
      >
        <span className="w-5 h-5">{item.icon}</span>
        {item.badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group"
    >
      <button
        onClick={hasChildren ? onToggle : onClick}
        className={clsx(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300',
          'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400',
          'transition-all duration-200',
          !hasChildren && 'justify-between'
        )}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
        <span className="font-medium truncate">{item.label}</span>
        {hasChildren && (
          <ChevronDown
            className={clsx(
              'w-4 h-4 ml-auto flex-shrink-0 transition-transform',
              expanded && 'rotate-180'
            )}
          />
        )}
        {!hasChildren && item.badge && (
          <span className="ml-auto px-2 py-0.5 text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full">
            {item.badge}
          </span>
        )}
      </button>

      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 ml-8 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-3"
          >
            {item.children!.map((child, index) => (
              <motion.li key={child.href + index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <button
                  onClick={() => handleNavClick(child.href)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <span className="w-4 h-4">{child.icon}</span>
                  <span className="truncate">{child.label}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Sidebar;