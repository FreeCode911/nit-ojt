import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import GradientAccent from '@/components/AppBits/GradientAccent';
import SpotlightSurface from '@/components/AppBits/SpotlightSurface';

const CRITERIA = ['attendance', 'performance', 'initiative', 'teamwork', 'communication'];

const RECOMMENDATION_BADGES = {
    pass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    needs_improvement: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    fail: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const recommendationLabel = (value) =>
    value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const labelize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function EvaluationsShow({ evaluation }) {
    return (
        <AppLayout title='Evaluation'>
            <div className='max-w-3xl mx-auto'>
                <SpotlightSurface>
                    <h1 className='text-2xl font-bold mb-1'>
                        <GradientAccent>{evaluation.period}</GradientAccent>
                    </h1>
                    <p className='text-slate-500 dark:text-slate-400 text-sm mb-6'>
                        {evaluation.internship?.intern?.name} · {evaluation.internship?.company} · by{' '}
                        {evaluation.supervisor?.name}
                    </p>
                    <div className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-6'>
                        {CRITERIA.map((c) => (
                            <div
                                key={c}
                                className='rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center'
                            >
                                <div className='text-xs text-slate-500 dark:text-slate-400'>
                                    {labelize(c)}
                                </div>
                                <div className='text-2xl font-bold text-brand-600 dark:text-brand-400'>
                                    {evaluation[c]}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-wrap items-center gap-4 mb-6'>
                        <div className='rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white px-5 py-3'>
                            <div className='text-xs opacity-80'>Overall</div>
                            <div className='text-2xl font-bold'>
                                {evaluation.overall}
                                <span className='text-sm opacity-80'>/100</span>
                            </div>
                        </div>
                        <span
                            className={`badge text-sm px-3 py-1 ${
                                RECOMMENDATION_BADGES[evaluation.recommendation] ??
                                RECOMMENDATION_BADGES.fail
                            }`}
                        >
                            {recommendationLabel(evaluation.recommendation)}
                        </span>
                    </div>
                    {[
                        ['strengths', 'Strengths'],
                        ['improvements', 'Areas to Improve'],
                        ['comments', 'Comments'],
                    ].map(
                        ([field, label]) =>
                            evaluation[field] && (
                                <div key={field} className='mb-4'>
                                    <h3 className='label'>{label}</h3>
                                    <p className='text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line'>
                                        {evaluation[field]}
                                    </p>
                                </div>
                            ),
                    )}
                    <div className='flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700'>
                        <Link href={route('evaluations.edit', evaluation.id)} className='btn-ghost text-sm'>
                            <Edit className='w-4 h-4' />
                            Edit
                        </Link>
                        <Link href={route('evaluations.index')} className='btn-ghost text-sm'>
                            Back
                        </Link>
                    </div>
                </SpotlightSurface>
            </div>
        </AppLayout>
    );
}
