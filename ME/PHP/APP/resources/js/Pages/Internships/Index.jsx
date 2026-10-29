import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import GradientAccent from '@/components/AppBits/GradientAccent';
import SpotlightSurface from '@/components/AppBits/SpotlightSurface';
import Magnet from '@/components/reactbits/Magnet/Magnet';

const STATUS_BADGES = {
    pending: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const STATUS_LABELS = {
    pending: 'Pending',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

function decodeLabel(label) {
    return String(label).replace(/&laquo;/g, '«').replace(/&raquo;/g, '»');
}

function Pagination({ paginator }) {
    if (!paginator || !paginator.links?.length || (paginator.last_page ?? 1) <= 1) {
        return null;
    }

    return (
        <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
            <span className='mr-2 text-sm text-slate-500 dark:text-slate-400'>
                Showing {paginator.from}–{paginator.to} of {paginator.total}
            </span>
            {paginator.links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            link.active
                                ? 'bg-brand-600 text-white'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        {decodeLabel(link.label)}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className='px-3 py-1.5 rounded-lg text-sm text-slate-400 dark:text-slate-500 select-none'
                    >
                        {decodeLabel(link.label)}
                    </span>
                ),
            )}
        </div>
    );
}

export default function Index({ internships, auth }) {
    const user = auth.user;

    return (
        <AppLayout title='Internships'>
            <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        <GradientAccent>Internships</GradientAccent>
                    </h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-1'>
                        Manage training programs
                    </p>
                </div>
                {(user.role === 'admin' || user.role === 'supervisor') && (
                    <Magnet padding={48} magnetStrength={1.8} tilt={0} scale={1.05} wrapperClassName='shrink-0'>
                        <Link href={route('internships.create')} className='btn-primary'>
                            <Plus className='w-4 h-4' />
                            New
                        </Link>
                    </Magnet>
                )}
            </div>

            <SpotlightSurface className='p-0! overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='table-base'>
                        <thead className='bg-slate-50 dark:bg-slate-800/40'>
                            <tr>
                                <th className='th-base'>Intern</th>
                                <th className='th-base'>Company</th>
                                <th className='th-base'>Period</th>
                                <th className='th-base'>Progress</th>
                                <th className='th-base'>Status</th>
                                <th className='th-base'></th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                            {internships.data.map((internship) => (
                                <tr
                                    key={internship.id}
                                    className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition'
                                >
                                    <td className='td-base font-medium'>{internship.intern_name}</td>
                                    <td className='td-base text-slate-500 dark:text-slate-400'>
                                        {internship.company}
                                    </td>
                                    <td className='td-base text-sm'>
                                        {internship.start_date} – {internship.end_date}
                                    </td>
                                    <td className='td-base'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5'>
                                                <div
                                                    className='bg-gradient-to-r from-brand-500 to-violet-500 h-1.5 rounded-full'
                                                    style={{ width: `${internship.progress_percent}%` }}
                                                />
                                            </div>
                                            <span className='text-xs text-slate-500 dark:text-slate-400'>
                                                {internship.approved_hours}/{internship.required_hours}h
                                            </span>
                                        </div>
                                    </td>
                                    <td className='td-base'>
                                        <span className={`badge ${STATUS_BADGES[internship.status]}`}>
                                            {STATUS_LABELS[internship.status] ?? internship.status}
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
                            {internships.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className='td-base text-center text-slate-500 dark:text-slate-400 py-10'
                                    >
                                        No internships yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </SpotlightSurface>

            <Pagination paginator={internships} />
        </AppLayout>
    );
}
