import { Link } from '@inertiajs/react';
import {
    Briefcase,
    CheckCircle,
    Clock,
    List,
    PieChart as PieChartIcon,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import AppLayout from '@/Layouts/AppLayout';
import GradientAccent from '@/components/AppBits/GradientAccent';
import SpotlightSurface from '@/components/AppBits/SpotlightSurface';
import CountUp from '@/components/reactbits/CountUp/CountUp';

const STAT_CARDS = [
    { label: 'Users', key: 'users', icon: Users, grad: 'from-blue-500 to-cyan-500' },
    { label: 'Internships', key: 'internships', icon: Briefcase, grad: 'from-indigo-500 to-violet-500' },
    { label: 'Pending Logs', key: 'pending_logs', icon: Clock, grad: 'from-amber-500 to-orange-500' },
    { label: 'Completed', key: 'completed', icon: CheckCircle, grad: 'from-emerald-500 to-teal-500' },
];

// Chart slice colors match the original Chart.js palette
const STATUS_CHART = [
    { name: 'Pending', key: 'pending', color: '#f59e0b' },
    { name: 'Active', key: 'active', color: '#10b981' },
    { name: 'Completed', key: 'completed', color: '#3b82f6' },
    { name: 'Cancelled', key: 'cancelled', color: '#ef4444' },
];

// Progress bar colors match the original blade colors array (amber, blue, emerald, red)
const STATUS_BARS = [
    { name: 'pending', bar: 'bg-amber-500' },
    { name: 'active', bar: 'bg-blue-500' },
    { name: 'completed', bar: 'bg-emerald-500' },
    { name: 'cancelled', bar: 'bg-red-500' },
];

const STATUS_BADGE = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const CHART_TOOLTIP_STYLE = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

export default function Admin({ stats, statusCounts, recent }) {
    return (
        <AppLayout title='Admin Dashboard'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    <GradientAccent>Admin Dashboard</GradientAccent>
                </h1>
                <p className='text-slate-500 dark:text-slate-400 mt-1'>Overview of the whole platform</p>
            </div>

            {/* Stat cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                {STAT_CARDS.map(({ label, key, icon: Icon, grad }) => (
                    <SpotlightSurface key={label} className='p-6 relative'>
                        <div
                            className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${grad} opacity-10`}
                        />
                        <div className='flex items-center gap-3'>
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${grad} text-white shadow-md`}>
                                <Icon className='w-5 h-5' />
                            </div>
                            <div>
                                <div className='text-2xl font-bold'>
                                    <CountUp to={stats[key]} duration={1.6} separator=',' easing='easeOut' trigger='view' replayOnHover />
                                </div>
                                <div className='text-xs text-slate-500 dark:text-slate-400'>{label}</div>
                            </div>
                        </div>
                    </SpotlightSurface>
                ))}
            </div>

            <div className='grid lg:grid-cols-3 gap-6 mb-8'>
                {/* Status breakdown chart (doughnut) */}
                <div className='card p-6 lg:col-span-2'>
                    <h2 className='font-semibold flex items-center gap-2 mb-4'>
                        <TrendingUp className='w-4 h-4' />
                        Internship Status Breakdown
                    </h2>
                    <div className='relative h-64'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <PieChart>
                                <Pie
                                    data={STATUS_CHART.map((s) => ({ name: s.name, value: statusCounts[s.key] }))}
                                    dataKey='value'
                                    nameKey='name'
                                    cx='50%'
                                    cy='50%'
                                    innerRadius='50%'
                                    outerRadius='80%'
                                    stroke='none'
                                >
                                    {STATUS_CHART.map((s) => (
                                        <Cell key={s.key} fill={s.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Bottom legend with point-style dots */}
                    <div className='flex flex-wrap justify-center gap-4 mt-2'>
                        {STATUS_CHART.map((s) => (
                            <div
                                key={s.key}
                                className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300'
                            >
                                <span
                                    className='w-2.5 h-2.5 rounded-full inline-block'
                                    style={{ backgroundColor: s.color }}
                                />
                                {s.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick stats */}
                <div className='card p-6'>
                    <h2 className='font-semibold flex items-center gap-2 mb-4'>
                        <PieChartIcon className='w-4 h-4' />
                        Quick Stats
                    </h2>
                    <div className='space-y-4'>
                        {STATUS_BARS.map(({ name, bar }) => {
                            const percent =
                                stats.internships > 0
                                    ? Math.min(100, (statusCounts[name] * 100) / stats.internships)
                                    : 0;
                            return (
                                <div key={name}>
                                    <div className='flex justify-between text-sm mb-1'>
                                        <span className='capitalize font-medium'>{name}</span>
                                        <span className='text-slate-500 dark:text-slate-400'>
                                            {statusCounts[name]}
                                        </span>
                                    </div>
                                    <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2'>
                                        <div
                                            className={`${bar} h-2 rounded-full transition-all duration-700`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent internships */}
            <SpotlightSurface className='p-0! overflow-hidden'>
                <div className='px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between'>
                    <h2 className='font-semibold flex items-center gap-2'>
                        <List className='w-4 h-4' />
                        Recent Internships
                    </h2>
                    <Link href={route('internships.index')} className='text-sm text-brand-600 dark:text-brand-400 hover:underline'>
                        View all
                    </Link>
                </div>
                <div className='overflow-x-auto'>
                    <table className='table-base'>
                        <thead className='bg-slate-50 dark:bg-slate-800/40'>
                            <tr>
                                <th className='th-base'>Intern</th>
                                <th className='th-base'>Company</th>
                                <th className='th-base'>Status</th>
                                <th className='th-base'></th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                            {recent.map((internship) => (
                                <tr
                                    key={internship.id}
                                    className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition'
                                >
                                    <td className='td-base font-medium'>{internship.intern?.name}</td>
                                    <td className='td-base text-slate-500 dark:text-slate-400'>
                                        {internship.company}
                                    </td>
                                    <td className='td-base'>
                                        <span
                                            className={`badge ${
                                                STATUS_BADGE[internship.status] ??
                                                'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className='td-base text-right'>
                                        <Link
                                            href={route('internships.show', internship.id)}
                                            className='text-brand-600 dark:text-brand-400 hover:underline'
                                        >
                                            View →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SpotlightSurface>
        </AppLayout>
    );
}
