import { usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Award, BookOpen, Check, CheckCircle, Download, Star, Target } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import GradientAccent from '@/components/AppBits/GradientAccent';
import SpotlightSurface from '@/components/AppBits/SpotlightSurface';
import CountUp from '@/components/reactbits/CountUp/CountUp';

export default function InternReport({ internship, approvedHours, totalLogs, approvedLogs }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const canIssueCertificate =
        user?.role === 'admin' ||
        (user?.role === 'supervisor' && internship.supervisor_id === user?.id);

    const { data, setData, post, processing } = useForm({
        issued_by: user?.name ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('reports.certificate', internship.id));
    };

    return (
        <AppLayout title='Intern Report'>
            <div className='max-w-4xl mx-auto'>
                <SpotlightSurface className='mb-6'>
                    <h1 className='text-2xl font-bold mb-1'>
                        <GradientAccent>OJT Report — {internship.intern_name}</GradientAccent>
                    </h1>
                    <p className='text-slate-500 dark:text-slate-400 text-sm'>
                        {internship.company} · {internship.position} · Supervisor: {internship.supervisor_name}
                    </p>

                    <div className='grid md:grid-cols-4 gap-4 mt-6'>
                        <div className='rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center'>
                            <Target className='w-5 h-5 mx-auto text-brand-600 dark:text-brand-400 mb-1' />
                            <div className='text-2xl font-bold'>
                                <CountUp to={internship.required_hours} duration={1.6} separator=',' easing='easeOut' trigger='view' replayOnHover />
                            </div>
                            <div className='text-xs text-slate-500 dark:text-slate-400'>Required Hours</div>
                        </div>
                        <div className='rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center'>
                            <CheckCircle className='w-5 h-5 mx-auto text-brand-600 dark:text-brand-400 mb-1' />
                            <div className='text-2xl font-bold'>
                                <CountUp to={approvedHours} duration={1.6} separator=',' easing='easeOut' trigger='view' replayOnHover />
                            </div>
                            <div className='text-xs text-slate-500 dark:text-slate-400'>Approved Hours</div>
                        </div>
                        <div className='rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center'>
                            <BookOpen className='w-5 h-5 mx-auto text-brand-600 dark:text-brand-400 mb-1' />
                            <div className='text-2xl font-bold'>
                                <CountUp to={totalLogs} duration={1.6} separator=',' easing='easeOut' trigger='view' replayOnHover />
                            </div>
                            <div className='text-xs text-slate-500 dark:text-slate-400'>Total Logs</div>
                        </div>
                        <div className='rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center'>
                            <Check className='w-5 h-5 mx-auto text-brand-600 dark:text-brand-400 mb-1' />
                            <div className='text-2xl font-bold'>
                                <CountUp to={approvedLogs} duration={1.6} separator=',' easing='easeOut' trigger='view' replayOnHover />
                            </div>
                            <div className='text-xs text-slate-500 dark:text-slate-400'>Approved Logs</div>
                        </div>
                    </div>

                    <div className='mt-5'>
                        <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden'>
                            <div
                                className='bg-gradient-to-r from-brand-500 to-violet-500 h-3 rounded-full transition-all duration-700'
                                style={{ width: `${internship.progress_percent}%` }}
                            />
                        </div>
                        <p className='text-sm text-slate-600 dark:text-slate-300 mt-2'>
                            {internship.progress_percent}% complete
                        </p>
                    </div>
                </SpotlightSurface>

                {/* Log entries */}
                <div className='card p-6 mb-6'>
                    <h2 className='font-semibold flex items-center gap-2 mb-4'>
                        <BookOpen className='w-4 h-4' />
                        Log Entries
                    </h2>
                    <div className='overflow-x-auto'>
                        <table className='table-base'>
                            <thead className='bg-slate-50 dark:bg-slate-800/40'>
                                <tr>
                                    <th className='th-base'>Date</th>
                                    <th className='th-base'>Task</th>
                                    <th className='th-base'>Hours</th>
                                    <th className='th-base'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                                {internship.log_entries.map((log, index) => (
                                    <tr key={index}>
                                        <td className='td-base text-sm'>{log.log_date}</td>
                                        <td className='td-base text-sm'>{log.task}</td>
                                        <td className='td-base'>{log.hours}</td>
                                        <td className='td-base text-xs'>{log.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Evaluations */}
                <div className='card p-6 mb-6'>
                    <h2 className='font-semibold flex items-center gap-2 mb-4'>
                        <Star className='w-4 h-4' />
                        Evaluations
                    </h2>
                    {internship.evaluations.map((evaluation) => (
                        <div
                            key={evaluation.period}
                            className='rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-3'
                        >
                            <div className='flex justify-between flex-wrap gap-2'>
                                <span className='font-medium'>{evaluation.period}</span>
                                <span className='text-sm text-slate-500 dark:text-slate-400'>
                                    Overall {evaluation.overall} · {evaluation.recommendation}
                                </span>
                            </div>
                            {evaluation.comments && (
                                <p className='text-sm text-slate-600 dark:text-slate-300 mt-2'>{evaluation.comments}</p>
                            )}
                        </div>
                    ))}
                    {internship.evaluations.length === 0 && (
                        <p className='text-slate-500 dark:text-slate-400 text-sm'>No evaluations yet.</p>
                    )}
                </div>

                <div className='card p-6'>
                    <div className='flex justify-between flex-wrap gap-3 items-center mb-4'>
                        <h2 className='font-semibold flex items-center gap-2'>
                            <Award className='w-4 h-4' />
                            Certificate
                        </h2>
                        <a
                            href={route('reports.certificate-pdf', internship.id)}
                            className='btn-primary inline-flex items-center gap-2'
                        >
                            <Download className='w-4 h-4' />
                            Download PDF
                        </a>
                    </div>
                    <p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
                        {internship.certificates.length > 0
                            ? 'Downloading generates a fresh PDF of the issued certificate.'
                            : 'No certificate issued yet — downloading generates the personal certificate automatically.'}
                    </p>

                    {canIssueCertificate && (
                        <form onSubmit={submit} className='flex gap-3 items-end flex-wrap mb-5'>
                            <div className='flex-1 min-w-[200px]'>
                                <label className='label'>Issued by</label>
                                <input
                                    type='text'
                                    name='issued_by'
                                    value={data.issued_by}
                                    onChange={(e) => setData('issued_by', e.target.value)}
                                    className='input'
                                />
                            </div>
                            <button type='submit' disabled={processing} className='btn-primary'>
                                Issue
                            </button>
                        </form>
                    )}

                    {internship.certificates.length > 0 && (
                        <div>
                            <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
                                Issued Certificates
                            </h3>
                            <ul className='text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-2'>
                                {internship.certificates.map((certificate) => (
                                    <li
                                        key={certificate.id}
                                        className='flex items-center justify-between gap-2'
                                    >
                                        <span className='flex items-center gap-2'>
                                            <Award className='w-3.5 h-3.5 text-brand-600' />
                                            {certificate.certificate_number} — {certificate.issued_to} (
                                            {certificate.issued_date})
                                        </span>
                                        <a
                                            href={route('certificates.pdf', certificate.id)}
                                            className='inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline'
                                        >
                                            <Download className='w-3.5 h-3.5' />
                                            PDF
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
