import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { clsx } from 'clsx';

interface DashboardChartsProps {
  data: Array<{ name: string; [key: string]: number | string }>;
  lines: Array<{ key: string; color: string; name: string }>;
  className?: string;
  height?: number;
}

export function DashboardCharts({ data, lines, className, height = 300 }: DashboardChartsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx('bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50', className)}
    >
      <div className='mb-4'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>Activity Overview</h3>
        <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>Last 30 days activity</p>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {lines.map((line, i) => (
                <linearGradient key={line.key} id={line.key} x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={line.color} stopOpacity={0.3} />
                  <stop offset='95%' stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' vertical={false} />
            <XAxis dataKey='name' stroke='#94a3b8' fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke='#94a3b8' fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 600 }}
            />
            {lines.map((line, i) => (
              <Area
                key={line.key}
                type='monotone'
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${line.key})`}
                name={line.name}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default DashboardCharts;
