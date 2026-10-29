import { Link } from '@inertiajs/react';
import { BookOpen, Calendar } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

const LOG_BADGE = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export default function Intern({ internship, recentLogs, todayLog }) {
    return (
        <AppLayout title='Intern Dashboard'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold tracking-tight'>Intern Dashboard</h1>
                <p className='text-slate-500 dark:text-slate-400 mt-1'>Track your OJT progress</p>
            </div>

            {internship && (
                <div className='card p-6 mb-6 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-br from-brand-500/10 to-violet-500/10 pointer-events-none' />
                    <div className='relative'>
                        <div className='flex flex-wrap justify-between items-start gap-3 mb-3'>
                            <div>
                                <h2 className='text-xl font-semibold'>{internship.company}</h2>
                                <p className='text-slate-500 dark:text-slate-400 text-sm'>
                                    {internship.position} · {internship.department}
                                </p>
                            </div>
                            <span className='badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'>
                                {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                            </span>
                        </div>
                        <p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
                            Supervisor: {internship.supervisor_name} · Required: {internship.required_hours}h ·{' '}
                            {internship.start_date} – {internship.end_date}
                        </p>
                        <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden'>
                            <div
                                className='bg-gradient-to-r from-brand-500 to-violet-500 h-3 rounded-full transition-all duration-700'
                                style={{ width: `${internship.progress_percent}%` }}
                            />
                        </div>
                        <div className='flex justify-between text-sm mt-2'>
                            <span className='text-slate-600 dark:text-slate-300 font-medium'>
                                {internship.approved_hours} / {internship.required_hours} hours
                            </span>
                            <span className='text-brand-600 dark:text-brand-400 font-semibold'>
                                {internship.progress_percent}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className='grid md:grid-cols-2 gap-6'>
                {/* Recent logs */}
                <div className='card p-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='font-semibold flex items-center gap-2'>
                            <BookOpen className='w-4 h-4' />
                            Recent Logs
                        </h2>
                        <Link href={route('logs.create')} className='btn-primary text-sm'>
                            + New Log
                        </Link>
                    </div>
                    <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
                        {recentLogs.map((log, index) => (
                            <li key={index} className='py-3 flex justify-between items-center gap-3'>
                                <div>
                                    <div className='font-medium text-sm'>
                                        {log.log_date} · {log.hours}h
                                    </div>
                                    <div className='text-xs text-slate-500 dark:text-slate-400'>{log.task}</div>
                                </div>
                                <span className={`badge ${LOG_BADGE[log.status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                                    {log.status}
                                </span>
                            </li>
                        ))}
                        {recentLogs.length === 0 && (
                            <li className='py-6 text-center text-slate-500 dark:text-slate-400 text-sm'>
                                No logs yet. Start logging today!
                            </li>
                        )}
                    </ul>
                </div>

                {/* Today's log */}
                <div className='card p-6'>
                    <h2 className='font-semibold flex items-center gap-2 mb-4'>
                        <Calendar className='w-4 h-4' />
                        Today&apos;s Log
                    </h2>
                    {todayLog ? (
                        <div className='rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4'>
                            <p className='text-sm text-slate-600 dark:text-slate-300'>
                                Already logged: <span className='font-medium'>{todayLog.task}</span> ({todayLog.hours}h)
                            </p>
                            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                                Status: {todayLog.status}
                            </p>
                            <Link
                                href={route('logs.edit', todayLog.id)}
                                className='inline-block mt-3 text-brand-600 dark:text-brand-400 text-sm hover:underline'
                            >
                                Edit entry →
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className='text-slate-500 dark:text-slate-400 text-sm mb-4'>
                                You haven&apos;t logged today.
                            </p>
                            <Link href={route('logs.create')} className='btn-primary'>
                                Log today
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
