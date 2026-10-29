import { Link, router, usePage } from '@inertiajs/react';
import { Award, BookOpen, Download, FileText, Pencil, Star, Trash2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import GradientAccent from '@/components/AppBits/GradientAccent';
import SpotlightSurface from '@/components/AppBits/SpotlightSurface';
import CountUp from '@/components/reactbits/CountUp/CountUp';

const LOG_STATUS_BADGES = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    pending: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

const INTERNSHIP_STATUS_BADGES = {
    pending: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

function capitalize(value) {
    return value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : '';
}

export default function Show({ internship }) {
    const user = usePage().props.auth.user;
    const canManage = user.role === 'admin' || user.role === 'supervisor';

    const destroy = (e) => {
        e.preventDefault();
        router.delete(route('internships.destroy', internship.id), {
            onBefore: () =>
                confirm('Delete this internship? Its logs, evaluations and certificates will also be deleted.'),
        });
    };

    return (
        <AppLayout title='Internship'>
            <SpotlightSurface className='p-6! mb-6'>
                <div className='flex flex-wrap justify-between items-start gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold'>
                            <GradientAccent>{internship.intern_name}</GradientAccent>
                        </h1>
                        <p className='text-slate-500 dark:text-slate-400'>
                            {internship.company} · {internship.position} · {internship.department}
                        </p>
                        <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                            Supervisor: {internship.supervisor_name} · {internship.start_date} –{' '}
                            {internship.end_date}
                        </p>
                    </div>
                    <div className='flex gap-2'>
                        <Link
                            href={route('reports.intern', internship.id)}
                            className='btn-ghost text-sm'
                        >
                            <FileText className='w-4 h-4' />
                            Report
                        </Link>
                        {canManage && (
                            <Link
                                href={route('internships.edit', internship.id)}
                                className='btn-ghost text-sm'
                            >
                                <Pencil className='w-4 h-4' />
                                Edit
                            </Link>
                        )}
                        {user.role === 'admin' && (
                            <button onClick={destroy} className='btn-danger text-sm'>
                                <Trash2 className='w-4 h-4' />
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                <div className='mt-5'>
                    <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden'>
                        <div
                            className='bg-gradient-to-r from-brand-500 to-violet-500 h-3 rounded-full'
                            style={{ width: `${internship.progress_percent}%` }}
                        />
                    </div>
                    <p className='text-sm text-slate-600 dark:text-slate-300 mt-2'>
                        {internship.approved_hours} / {internship.required_hours} approved hours ·{' '}
                        <CountUp
                            to={internship.progress_percent}
                            suffix='%'
                            duration={1.6}
                            easing='easeOut'
                            trigger='view'
                            replayOnHover
                        />{' '}
                        · Status:{' '}
                        <span
                            className={`badge ${INTERNSHIP_STATUS_BADGES[internship.status]}`}
                        >
                            {capitalize(internship.status)}
                        </span>
                    </p>
                </div>

                {internship.notes && (
                    <p className='mt-3 text-sm text-slate-500 dark:text-slate-400 italic'>
                        {internship.notes}
                    </p>
                )}
            </SpotlightSurface>

            <div className='grid md:grid-cols-2 gap-6'>
                <div className='card p-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='font-semibold flex items-center gap-2'>
                            <BookOpen className='w-4 h-4' />
                            Log Entries
                        </h2>
                        <Link
                            href={route('logs.create')}
                            className='text-brand-600 dark:text-brand-400 text-sm hover:underline'
                        >
                            + New
                        </Link>
                    </div>
                    <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
                        {internship.log_entries.map((log) => (
                            <li key={log.id} className='py-3 flex justify-between items-center gap-3'>
                                <div>
                                    <Link
                                        href={route('logs.show', log.id)}
                                        className='font-medium hover:underline'
                                    >
                                        {log.log_date}
                                    </Link>
                                    <span className='text-sm text-slate-500 dark:text-slate-400'>
                                        · {log.hours}h · {log.task}
                                    </span>
                                </div>
                                <span className={`badge ${LOG_STATUS_BADGES[log.status]}`}>
                                    {log.status}
                                </span>
                            </li>
                        ))}
                        {internship.log_entries.length === 0 && (
                            <li className='py-3 text-slate-500 dark:text-slate-400 text-sm'>
                                No logs.
                            </li>
                        )}
                    </ul>
                </div>

                <div className='card p-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='font-semibold flex items-center gap-2'>
                            <Star className='w-4 h-4' />
                            Evaluations
                        </h2>
                        {canManage && (
                            <Link
                                href={route('evaluations.create')}
                                className='text-brand-600 dark:text-brand-400 text-sm hover:underline'
                            >
                                + New
                            </Link>
                        )}
                    </div>
                    <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
                        {internship.evaluations.map((evaluation) => (
                            <li key={evaluation.id} className='py-3 flex justify-between items-center'>
                                <div>
                                    <Link
                                        href={route('evaluations.show', evaluation.id)}
                                        className='font-medium hover:underline'
                                    >
                                        {evaluation.period}
                                    </Link>
                                    <span className='text-sm text-slate-500 dark:text-slate-400'>
                                        · Overall {evaluation.overall}/100 ·{' '}
                                        {evaluation.recommendation}
                                    </span>
                                </div>
                            </li>
                        ))}
                        {internship.evaluations.length === 0 && (
                            <li className='py-3 text-slate-500 dark:text-slate-400 text-sm'>
                                No evaluations.
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className='card p-6 mt-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='font-semibold flex items-center gap-2'>
                        <Award className='w-4 h-4' />
                        Certificates
                    </h2>
                </div>
                <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
                    {internship.certificates.map((certificate) => (
                        <li key={certificate.id} className='py-3 flex justify-between items-center gap-3'>
                            <div>
                                <span className='font-medium'>{certificate.certificate_number}</span>
                                {certificate.issued_date && (
                                    <span className='text-sm text-slate-500 dark:text-slate-400'>
                                        {' '}
                                        · Issued {certificate.issued_date}
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center gap-4'>
                                <a
                                    href={route('certificates.pdf', certificate.id)}
                                    className='inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-sm hover:underline'
                                >
                                    <Download className='w-3.5 h-3.5' />
                                    PDF
                                </a>
                                <Link
                                    href={route('reports.intern', internship.id)}
                                    className='text-brand-600 dark:text-brand-400 text-sm hover:underline'
                                >
                                    View report
                                </Link>
                            </div>
                        </li>
                    ))}
                    {internship.certificates.length === 0 && (
                        <li className='py-3 flex justify-between items-center gap-3'>
                            <span className='text-slate-500 dark:text-slate-400 text-sm'>
                                No certificates issued.
                            </span>
                            <a
                                href={route('reports.certificate-pdf', internship.id)}
                                className='inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-sm hover:underline'
                            >
                                <Download className='w-3.5 h-3.5' />
                                Generate PDF certificate
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </AppLayout>
    );
}
