import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ interns, supervisors }) {
    const { data, setData, post, processing, errors } = useForm({
        intern_id: interns[0]?.id ?? '',
        supervisor_id: supervisors[0]?.id ?? '',
        company: '',
        department: '',
        position: '',
        start_date: '',
        end_date: '',
        required_hours: 480,
        status: 'active',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('internships.store'));
    };

    return (
        <AppLayout title='New Internship'>
            <div className='max-w-3xl mx-auto'>
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold tracking-tight'>New Internship</h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-1'>
                        Set up a training program
                    </p>
                </div>

                <div className='card p-8'>
                    <form onSubmit={submit} className='space-y-5'>
                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>Intern</label>
                                <select
                                    name='intern_id'
                                    value={data.intern_id}
                                    onChange={(e) => setData('intern_id', e.target.value)}
                                    required
                                    className='input'
                                >
                                    {interns.map((intern) => (
                                        <option key={intern.id} value={intern.id}>
                                            {intern.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.intern_id && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.intern_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>Supervisor</label>
                                <select
                                    name='supervisor_id'
                                    value={data.supervisor_id}
                                    onChange={(e) => setData('supervisor_id', e.target.value)}
                                    required
                                    className='input'
                                >
                                    {supervisors.map((supervisor) => (
                                        <option key={supervisor.id} value={supervisor.id}>
                                            {supervisor.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.supervisor_id && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.supervisor_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>Company</label>
                                <input
                                    type='text'
                                    name='company'
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    required
                                    className='input'
                                />
                                {errors.company && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.company}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>Department</label>
                                <input
                                    type='text'
                                    name='department'
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className='input'
                                />
                                {errors.department && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.department}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>Position</label>
                                <input
                                    type='text'
                                    name='position'
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    className='input'
                                />
                                {errors.position && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.position}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>Required Hours</label>
                                <input
                                    type='number'
                                    name='required_hours'
                                    value={data.required_hours}
                                    onChange={(e) => setData('required_hours', e.target.value)}
                                    required
                                    min={1}
                                    className='input'
                                />
                                {errors.required_hours && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.required_hours}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>Start Date</label>
                                <input
                                    type='date'
                                    name='start_date'
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    required
                                    className='input'
                                />
                                {errors.start_date && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.start_date}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>End Date</label>
                                <input
                                    type='date'
                                    name='end_date'
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    required
                                    className='input'
                                />
                                {errors.end_date && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.end_date}
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
                                required
                                className='input'
                            >
                                {['pending', 'active', 'completed', 'cancelled'].map((status) => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className='label'>Notes</label>
                            <textarea
                                name='notes'
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className='input'
                            />
                            {errors.notes && (
                                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <div className='flex gap-3 pt-2'>
                            <button type='submit' disabled={processing} className='btn-primary'>
                                Save
                            </button>
                            <Link
                                href={route('internships.index')}
                                disabled={processing}
                                className='btn-ghost'
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
