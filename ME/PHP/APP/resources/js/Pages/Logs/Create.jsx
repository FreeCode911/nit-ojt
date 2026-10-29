import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';

const MOODS = ['great', 'good', 'okay', 'tired', 'stressed'];

const ucfirst = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function LogsCreate({ internships }) {
    const today = new Date().toISOString().split('T')[0];
    const { data, setData, post, processing, errors, reset } = useForm({
        internship_id: internships.length ? String(internships[0].id) : '',
        log_date: today,
        hours: '',
        task: '',
        description: '',
        skills: '',
        mood: '',
        evidence: null,
        status: 'submitted',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('logs.store'), { forceFormData: true, onSuccess: () => reset() });
    };

    return (
        <AppLayout title='New Log'>
            <div className='max-w-3xl mx-auto'>
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold tracking-tight'>New Log Entry</h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-1'>
                        Record today's training activity
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
                                        {i.intern?.name ? `${i.intern.name} — ` : ''}
                                        {i.company}
                                    </option>
                                ))}
                            </select>
                            {errors.internship_id && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.internship_id}
                                </p>
                            )}
                        </div>
                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>Date</label>
                                <input
                                    type='date'
                                    name='log_date'
                                    value={data.log_date}
                                    onChange={(e) => setData('log_date', e.target.value)}
                                    required
                                    className='input'
                                />
                                {errors.log_date && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.log_date}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>Hours</label>
                                <input
                                    type='number'
                                    step='0.25'
                                    min='0.25'
                                    max='24'
                                    name='hours'
                                    value={data.hours}
                                    onChange={(e) => setData('hours', e.target.value)}
                                    required
                                    className='input'
                                />
                                {errors.hours && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.hours}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className='label'>Task</label>
                            <input
                                type='text'
                                name='task'
                                value={data.task}
                                onChange={(e) => setData('task', e.target.value)}
                                required
                                className='input'
                                placeholder='What did you work on?'
                            />
                            {errors.task && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.task}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className='label'>Description</label>
                            <textarea
                                name='description'
                                rows='4'
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className='input'
                                placeholder='Details, learnings, blockers...'
                            />
                            {errors.description && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.description}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className='label'>Skills (comma separated)</label>
                            <input
                                type='text'
                                name='skills'
                                value={data.skills}
                                onChange={(e) => setData('skills', e.target.value)}
                                className='input'
                                placeholder='PHP, Laravel, MySQL'
                            />
                            {errors.skills && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.skills}
                                </p>
                            )}
                        </div>
                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>Mood</label>
                                <select
                                    name='mood'
                                    value={data.mood}
                                    onChange={(e) => setData('mood', e.target.value)}
                                    className='input'
                                >
                                    <option value=''>—</option>
                                    {MOODS.map((m) => (
                                        <option key={m} value={m}>
                                            {ucfirst(m)}
                                        </option>
                                    ))}
                                </select>
                                {errors.mood && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.mood}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>Evidence (file)</label>
                                <input
                                    type='file'
                                    name='evidence'
                                    onChange={(e) => setData('evidence', e.target.files[0] || null)}
                                    className='input file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-900/40 dark:file:text-brand-300'
                                />
                                {errors.evidence && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.evidence}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className='label'>Status</label>
                            <select
                                name='status'
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className='input'
                            >
                                <option value='submitted'>Submit for review</option>
                                <option value='draft'>Save as draft</option>
                            </select>
                            {errors.status && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.status}
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
                            <Link href={route('logs.index')} className='btn-ghost'>
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
