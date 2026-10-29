import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface AnimatedStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease';
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export function AnimatedStats({ stats, className }: AnimatedStatsProps) {
  return (
    <div className={clsx('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className='bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
        >
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>{stat.label}</p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                className='mt-2 text-3xl font-bold text-slate-900 dark:text-white'
              >
                {stat.value}
              </motion.p>
              {stat.change && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className={clsx(
                    'mt-2 inline-flex items-center gap-1 text-sm font-medium',
                    stat.changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {stat.changeType === 'increase' ? '↑' : '↓'} {stat.change}
                </motion.span>
              )}
            </div>
            {stat.icon && (
              <div className='p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'>
                {stat.icon}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default AnimatedStats;
