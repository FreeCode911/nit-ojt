import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const STATUS_BADGES = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

const limit = (value, count) =>
    value && value.length > count ? `${value.slice(0, count)}...` : value;

export default function LogsIndex({ logs }) {
    const { meta, links } = logs;

    return (
        <AppLayout title='Logs'>
            <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Log Entries</h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-1'>Daily training journals</p>
                </div>
                <Link href={route('logs.create')} className='btn-primary'>
                    <Plus className='w-4 h-4' />
                    New Log
                </Link>
            </div>

            <div className='card overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='table-base'>
                        <thead className='bg-slate-50 dark:bg-slate-800/40'>
                            <tr>
                                <th className='th-base'>Date</th>
                                <th className='th-base'>Intern</th>
                                <th className='th-base'>Task</th>
                                <th className='th-base'>Hours</th>
                                <th className='th-base'>Status</th>
                                <th className='th-base'></th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                            {logs.data.map((log) => (
                                <tr
                                    key={log.id}
                                    className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition'
                                >
                                    <td className='td-base text-sm'>{log.log_date_display}</td>
                                    <td className='td-base font-medium'>{log.user?.name}</td>
                                    <td className='td-base text-slate-500 dark:text-slate-400'>
                                        {limit(log.task, 40)}
                                    </td>
                                    <td className='td-base'>{log.hours}</td>
                                    <td className='td-base'>
                                        <span
                                            className={`badge ${
                                                STATUS_BADGES[log.status] ?? STATUS_BADGES.default
                                            }`}
                                        >
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className='td-base text-right'>
                                        <Link
                                            href={route('logs.show', log.id)}
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
            </div>

            {meta.last_page > 1 && (
                <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                        Showing {meta.from} to {meta.to} of {meta.total} results
                    </p>
                    <div className='flex items-center gap-2'>
                        <Link
                            href={links.prev ?? '#'}
                            disabled={!links.prev}
                            className='inline-flex items-center rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:pointer-events-none disabled:opacity-50'
                        >
                            ← Prev
                        </Link>
                        <span className='text-sm text-slate-500 dark:text-slate-400'>
                            Page {meta.current_page} of {meta.last_page}
                        </span>
                        <Link
                            href={links.next ?? '#'}
                            disabled={!links.next}
                            className='inline-flex items-center rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:pointer-events-none disabled:opacity-50'
                        >
                            Next →
                        </Link>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
