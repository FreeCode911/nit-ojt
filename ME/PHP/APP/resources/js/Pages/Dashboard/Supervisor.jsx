import { Link } from '@inertiajs/react';
import { CheckCircle, Inbox, TrendingUp, Users } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

const STAT_CARDS = [
    {
        label: 'Assigned Interns',
        count: (internships) => internships.length,
        icon: Users,
        grad: 'from-blue-500 to-indigo-500',
    },
    {
        label: 'Pending Reviews',
        count: (_, pendingLogs) => pendingLogs.length,
        icon: Inbox,
        grad: 'from-amber-500 to-orange-500',
    },
    {
        label: 'Total Approved Hours',
        count: (_, __, totalApprovedHours) => `${totalApprovedHours}h`,
        icon: TrendingUp,
        grad: 'from-emerald-500 to-teal-500',
    },
];

export default function Supervisor({ internships, pendingLogs, totalApprovedHours }) {
    return (
        <AppLayout title='Supervisor Dashboard'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold tracking-tight'>Supervisor Dashboard</h1>
                <p className='text-slate-500 dark:text-slate-400 mt-1'>Your interns and pending reviews</p>
            </div>

            {/* Stat cards */}
            <div className='grid md:grid-cols-3 gap-4 mb-6'>
                {STAT_CARDS.map(({ label, count, icon: Icon, grad }) => (
                    <div key={label} className='card p-5 flex items-center gap-4'>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${grad} text-white shadow-md`}>
                            <Icon className='w-6 h-6' />
                        </div>
                        <div>
                            <div className='text-2xl font-bold'>{count(internships, pendingLogs, totalApprovedHours)}</div>
                            <div className='text-xs text-slate-500 dark:text-slate-400'>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
                {/* My interns */}
                <div className='card p-6'>
                    <h2 className='font-semibold flex items-center gap-2 mb-4'>
                        <Users className='w-4 h-4' />
                        My Interns
                    </h2>
                    <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
                        {internships.map((internship) => (
                            <li key={internship.id} className='py-4'>
                                <div className='flex justify-between items-start gap-3'>
                                    <div className='flex-1'>
                                        <div className='font-medium'>{internship.intern_name}</div>
                                        <div className='text-sm text-slate-500 dark:text-slate-400'>
                                            {internship.company} · {internship.position}
                                        </div>
                                        <div className='mt-2'>
                                            <div className='flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1'>
                                                <span>
                                                    {internship.approved_hours} / {internship.required_hours} h
                                                </span>
                                                <span>{internship.progress_percent}%</span>
                                            </div>
                                            <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2'>
                                                <div
                                                    className='bg-gradient-to-r from-brand-500 to-violet-500 h-2 rounded-full transition-all duration-700'
                                                    style={{ width: `${internship.progress_percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('internships.show', internship.id)}
                                        className='text-brand-600 dark:text-brand-400 text-sm hover:underline whitespace-nowrap'
                                    >
                                        View →
                                    </Link>
                                </div>
                            </li>
                        ))}
                        {internships.length === 0 && (
                            <li className='py-8 text-center'>
                                <Users className='w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2' />
                                <p className='text-slate-500 dark:text-slate-400 text-sm'>No interns assigned yet.</p>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Pending log reviews */}
                <div className='card p-6'>
                    <h2 className='font-semibold flex items-center gap-2 mb-4'>
                        <Inbox className='w-4 h-4' />
                        Pending Log Reviews
                    </h2>
                    <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
                        {pendingLogs.map((log) => (
                            <li key={log.id} className='py-4 flex justify-between items-start gap-3'>
                                <div>
                                    <div className='font-medium'>{log.intern_name}</div>
                                    <div className='text-sm text-slate-500 dark:text-slate-400'>
                                        {log.log_date} · {log.task} · {log.hours}h
                                    </div>
                                </div>
                                <Link href={route('logs.show', log.id)} className='btn-primary text-sm py-1.5 px-3'>
                                    Review
                                </Link>
                            </li>
                        ))}
                        {pendingLogs.length === 0 && (
                            <li className='py-8 text-center'>
                                <CheckCircle className='w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2' />
                                <p className='text-slate-500 dark:text-slate-400 text-sm'>No pending logs. 🎉</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
