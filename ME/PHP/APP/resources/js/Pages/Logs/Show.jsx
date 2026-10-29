import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { Check, Edit, Paperclip, X } from 'lucide-react';

const STATUS_BADGES = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

export default function LogsShow({ log, auth }) {
    const user = auth.user;
    const approveForm = useForm({ note: '' });
    const rejectForm = useForm({ note: '' });

    const canReview =
        user.role === 'admin' || (user.role === 'supervisor' && log.internship?.supervisor_id === user.id);
    const canEdit = user.id === log.user_id || user.role === 'admin';

    return (
        <AppLayout title='Log Entry'>
            <div className='max-w-3xl mx-auto'>
                <div className='card p-8'>
                    <div className='flex flex-wrap justify-between items-start gap-4 mb-6'>
                        <div>
                            <h1 className='text-2xl font-bold'>{log.task}</h1>
                            <p className='text-slate-500 dark:text-slate-400 text-sm'>
                                {log.user?.name} · {log.internship?.company} · {log.log_date_display} ·{' '}
                                {log.hours}h
                            </p>
                        </div>
                        <span className={`badge ${STATUS_BADGES[log.status] ?? STATUS_BADGES.default}`}>
                            {log.status}
                        </span>
                    </div>

                    {log.description && (
                        <div className='mb-5'>
                            <h3 className='label'>Description</h3>
                            <p className='text-slate-600 dark:text-slate-300 whitespace-pre-line'>
                                {log.description}
                            </p>
                        </div>
                    )}

                    {(log.skills || []).length > 0 && (
                        <div className='mb-5'>
                            <h3 className='label'>Skills</h3>
                            <div className='flex flex-wrap gap-2 mt-1'>
                                {log.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className='badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {log.mood && (
                        <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
                            Mood:{' '}
                            <span className='font-medium text-slate-700 dark:text-slate-200'>
                                {log.mood}
                            </span>
                        </p>
                    )}

                    {log.evidence_path && (
                        <p className='text-sm mb-5'>
                            <a
                                href={log.evidence_url}
                                target='_blank'
                                rel='noreferrer'
                                className='text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1'
                            >
                                <Paperclip className='w-4 h-4' />
                                View evidence file
                            </a>
                        </p>
                    )}

                    {log.supervisor_note && (
                        <div className='mb-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4'>
                            <h3 className='label'>Supervisor Note</h3>
                            <p className='text-slate-600 dark:text-slate-300 text-sm'>
                                {log.supervisor_note}
                            </p>
                            <p className='text-xs text-slate-400 mt-2'>
                                Reviewed {log.reviewed_at_display} by {log.reviewer?.name}
                            </p>
                        </div>
                    )}

                    {canReview && log.status === 'submitted' && (
                        <div className='flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700'>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    approveForm.post(route('logs.approve', log.id), {
                                        preserveState: true,
                                    });
                                }}
                                className='flex gap-2 items-center flex-wrap'
                            >
                                <input
                                    type='text'
                                    name='note'
                                    value={approveForm.data.note}
                                    onChange={(e) => approveForm.setData('note', e.target.value)}
                                    placeholder='Approval note (optional)'
                                    className='input text-sm max-w-xs'
                                />
                                <button
                                    type='submit'
                                    disabled={approveForm.processing}
                                    className='inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-emerald-500 transition disabled:opacity-60'
                                >
                                    <Check className='w-4 h-4' />
                                    Approve
                                </button>
                            </form>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    rejectForm.post(route('logs.reject', log.id), {
                                        preserveState: true,
                                    });
                                }}
                                className='flex gap-2 items-center flex-wrap'
                            >
                                <input
                                    type='text'
                                    name='note'
                                    required
                                    value={rejectForm.data.note}
                                    onChange={(e) => rejectForm.setData('note', e.target.value)}
                                    placeholder='Reason for rejection'
                                    className='input text-sm max-w-xs'
                                />
                                <button
                                    type='submit'
                                    disabled={rejectForm.processing}
                                    className='btn-danger text-sm disabled:opacity-60'
                                >
                                    <X className='w-4 h-4' />
                                    Reject
                                </button>
                            </form>
                        </div>
                    )}

                    <div className='flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700'>
                        {canEdit && (
                            <Link href={route('logs.edit', log.id)} className='btn-ghost text-sm'>
                                <Edit className='w-4 h-4' />
                                Edit
                            </Link>
                        )}
                        <Link href={route('logs.index')} className='btn-ghost text-sm'>
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
