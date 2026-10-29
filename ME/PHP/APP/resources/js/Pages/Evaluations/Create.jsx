import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';

const CRITERIA = ['attendance', 'performance', 'initiative', 'teamwork', 'communication'];

export default function EvaluationsCreate({ internships }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        internship_id: internships.length ? String(internships[0].id) : '',
        period: '',
        attendance: 80,
        performance: 80,
        initiative: 80,
        teamwork: 80,
        communication: 80,
        strengths: '',
        improvements: '',
        comments: '',
        recommendation: 'pass',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('evaluations.store'), { onSuccess: () => reset() });
    };

    return (
        <AppLayout title='New Evaluation'>
            <div className='max-w-3xl mx-auto'>
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold tracking-tight'>New Evaluation</h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-1'>
                        Score an intern's performance
                    </p>
                </div>
                <div className='card p-8'>
                    <form onSubmit={submit} className='space-y-5'>
                        <div>
                            <label className='label'>Internship</label>
                            <select
                                name='internship_id'
                                required
                                value={data.internship_id}
                                onChange={(e) => setData('internship_id', e.target.value)}
                                className='input'
                            >
                                {internships.map((i) => (
                                    <option key={i.id} value={i.id}>
                                        {i.intern?.name} — {i.company}
                                    </option>
                                ))}
                            </select>
                            {errors.internship_id && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.internship_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className='label'>Period</label>
                            <input
                                type='text'
                                name='period'
                                value={data.period}
                                onChange={(e) => setData('period', e.target.value)}
                                required
                                className='input'
                                placeholder='e.g. Week 1-4'
                            />
                            {errors.period && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.period}
                                </p>
                            )}
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                            {CRITERIA.map((c) => (
                                <div key={c}>
                                    <label className='label text-xs'>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </label>
                                    <input
                                        type='number'
                                        name={c}
                                        value={data[c]}
                                        onChange={(e) => setData(c, e.target.value)}
                                        min='0'
                                        max='100'
                                        required
                                        className='input text-center'
                                    />
                                    {errors[c] && (
                                        <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                            {errors[c]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className='label'>Strengths</label>
                            <textarea
                                name='strengths'
                                rows='2'
                                value={data.strengths}
                                onChange={(e) => setData('strengths', e.target.value)}
                                className='input'
                            />
                            {errors.strengths && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.strengths}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className='label'>Areas to Improve</label>
                            <textarea
                                name='improvements'
                                rows='2'
                                value={data.improvements}
                                onChange={(e) => setData('improvements', e.target.value)}
                                className='input'
                            />
                            {errors.improvements && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.improvements}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className='label'>Comments</label>
                            <textarea
                                name='comments'
                                rows='2'
                                value={data.comments}
                                onChange={(e) => setData('comments', e.target.value)}
                                className='input'
                            />
                            {errors.comments && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.comments}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className='label'>Recommendation</label>
                            <select
                                name='recommendation'
                                required
                                value={data.recommendation}
                                onChange={(e) => setData('recommendation', e.target.value)}
                                className='input'
                            >
                                <option value='pass'>Pass</option>
                                <option value='needs_improvement'>Needs Improvement</option>
                                <option value='fail'>Fail</option>
                            </select>
                            {errors.recommendation && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.recommendation}
                                </p>
                            )}
                        </div>
                        <div className='flex gap-3 pt-2'>
                            <button
                                type='submit'
                                disabled={processing}
                                className='btn-primary disabled:opacity-60'
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>
                            <Link href={route('evaluations.index')} className='btn-ghost'>
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
