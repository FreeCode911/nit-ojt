import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 5000);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className='w-5 h-5 text-emerald-500' />,
    error: <AlertCircle className='w-5 h-5 text-red-500' />,
    info: <Info className='w-5 h-5 text-blue-500' />,
    warning: <AlertTriangle className='w-5 h-5 text-amber-500' />,
  };

  const colors = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20',
    error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
    info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    warning: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20',
  };

  return (
    <AnimatePresence>
      <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none'>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={clsx(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-md',
              colors[toast.type]
            )}
          >
            <div className='flex-shrink-0 mt-0.5'>{icons[toast.type]}</div>
            <div className='flex-1 min-w-0'>
              <p className={clsx('font-medium', toast.type === 'success' ? 'text-emerald-800 dark:text-emerald-300' : toast.type === 'error' ? 'text-red-800 dark:text-red-300' : toast.type === 'info' ? 'text-blue-800 dark:text-blue-300' : 'text-amber-800 dark:text-amber-300')}>
                {toast.title}
              </p>
              {toast.message && (
                <p className={clsx('mt-1 text-sm', toast.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : toast.type === 'error' ? 'text-red-700 dark:text-red-400' : toast.type === 'info' ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400')}>
                  {toast.message}
                </p>
              )}
              {toast.action && (
                <motion.button
                  onClick={() => { toast.action.onClick(); onRemove(toast.id); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx('mt-2 text-sm font-medium', toast.type === 'success' ? 'text-emerald-700 dark:text-emerald-300 hover:underline' : toast.type === 'error' ? 'text-red-700 dark:text-red-300 hover:underline' : toast.type === 'info' ? 'text-blue-700 dark:text-blue-300 hover:underline' : 'text-amber-700 dark:text-amber-300 hover:underline')}
                >
                  {toast.action.label}
                </motion.button>
              )}
            </div>
            <motion.button
              onClick={() => onRemove(toast.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={clsx('flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10', toast.type === 'success' ? 'text-emerald-500' : toast.type === 'error' ? 'text-red-500' : toast.type === 'info' ? 'text-blue-500' : 'text-amber-500')}
            >
              <X className='w-4 h-4' />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}

export function NotificationToast({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  action,
  onClose 
}: Toast & { onClose?: () => void }) {
  const icons = {
    success: <CheckCircle className='w-5 h-5 text-emerald-500' />,
    error: <AlertCircle className='w-5 h-5 text-red-500' />,
    info: <Info className='w-5 h-5 text-blue-500' />,
    warning: <AlertTriangle className='w-5 h-5 text-amber-500' />,
  };

  const colors = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20',
    error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
    info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    warning: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      onClick={onClose}
      className={clsx(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-md',
        colors[type]
      )}
    >
      <div className='flex-shrink-0 mt-0.5'>{icons[type]}</div>
      <div className='flex-1 min-w-0'>
        <p className={clsx('font-medium', type === 'success' ? 'text-emerald-800 dark:text-emerald-300' : type === 'error' ? 'text-red-800 dark:text-red-300' : type === 'info' ? 'text-blue-800 dark:text-blue-300' : 'text-amber-800 dark:text-amber-300')}>
          {title}
        </p>
        {message && (
          <p className={clsx('mt-1 text-sm', type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : type === 'error' ? 'text-red-700 dark:text-red-400' : type === 'info' ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400')}>
            {message}
          </p>
        )}
        {action && (
          <button
            onClick={(e) => { e.stopPropagation(); action.onClick(); onClose?.(); }}
            className={clsx('mt-2 text-sm font-medium', type === 'success' ? 'text-emerald-700 dark:text-emerald-300 hover:underline' : type === 'error' ? 'text-red-700 dark:text-red-300 hover:underline' : type === 'info' ? 'text-blue-700 dark:text-blue-300 hover:underline' : 'text-amber-700 dark:text-amber-300 hover:underline')}
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        className={clsx('flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10', type === 'success' ? 'text-emerald-500' : type === 'error' ? 'text-red-500' : type === 'info' ? 'text-blue-500' : 'text-amber-500')}
      >
        <X className='w-4 h-4' />
      </button>
    </motion.div>
  );
}

export default NotificationToast;
