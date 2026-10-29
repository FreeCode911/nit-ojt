import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import GradientAccent from '@/components/AppBits/GradientAccent';
import SpotlightSurface from '@/components/AppBits/SpotlightSurface';
import Magnet from '@/components/reactbits/Magnet/Magnet';

const RECOMMENDATION_BADGES = {
    pass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    needs_improvement: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    fail: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const recommendationLabel = (value) =>
    value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export default function EvaluationsIndex({ evaluations, auth }) {
    const user = auth.user;
    // Inertia v3.5 serializes Laravel paginators flat (data/current_page/last_page/...)
    // without a { data, meta, links } envelope — flatten by aliasing.
    const meta = evaluations;
    const links = { prev: evaluations.prev_page_url, next: evaluations.next_page_url };
    return (
        <AppLayout title='Evaluations'>
            <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        <GradientAccent>Evaluations</GradientAccent>
                    </h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-1'>Performance reviews</p>
                </div>
                {(user.role === 'admin' || user.role === 'supervisor') && (
                    <Magnet padding={48} magnetStrength={1.8} tilt={0} scale={1.05} wrapperClassName='shrink-0'>
                        <Link href={route('evaluations.create')} className='btn-primary'>
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
                                <th className='th-base'>Period</th>
                                <th className='th-base'>Overall</th>
                                <th className='th-base'>Recommendation</th>
                                <th className='th-base'></th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                            {evaluations.data.map((evaluation) => (
                                <tr
                                    key={evaluation.id}
                                    className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition'
                                >
                                    <td className='td-base font-medium'>
                                        {evaluation.internship?.intern?.name}
                                    </td>
                                    <td className='td-base text-slate-500 dark:text-slate-400'>
                                        {evaluation.period}
                                    </td>
                                    <td className='td-base'>
                                        <span className='font-semibold text-brand-600 dark:text-brand-400'>
                                            {evaluation.overall}
                                        </span>
                                        <span className='text-slate-400'>/100</span>
                                    </td>
                                    <td className='td-base'>
                                        <span
                                            className={`badge ${
                                                RECOMMENDATION_BADGES[evaluation.recommendation] ??
                                                RECOMMENDATION_BADGES.fail
                                            }`}
                                        >
                                            {recommendationLabel(evaluation.recommendation)}
                                        </span>
                                    </td>
                                    <td className='td-base text-right'>
                                        <Link
                                            href={route('evaluations.show', evaluation.id)}
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
