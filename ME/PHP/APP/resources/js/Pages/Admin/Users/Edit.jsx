import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import GradientAccent from '@/components/AppBits/GradientAccent'; 
import SpotlightSurface from '@/components/AppBits/SpotlightSurface';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        department: user.department,
        phone: user.phone,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AppLayout title='Edit User'>
            <div className='max-w-3xl mx-auto'>
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold tracking-tight'><GradientAccent>Edit User</GradientAccent></h1>
                </div>

                <SpotlightSurface>
                    <form onSubmit={submit} className='space-y-5'>
                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>Name</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className='input'
                                />
                                {errors.name && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className='input'
                                />
                                {errors.email && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>Role</label>
                                <select
                                    name='role'
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                    className='input'
                                >
                                    {['intern', 'supervisor', 'admin'].map((role) => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.role}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>Company</label>
                                <input
                                    type='text'
                                    name='company'
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    className='input'
                                />
                                {errors.company && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.company}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-5'>
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
                            <div>
                                <label className='label'>Phone</label>
                                <input
                                    type='text'
                                    name='phone'
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className='input'
                                />
                                {errors.phone && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-5'>
                            <div>
                                <label className='label'>New Password (optional)</label>
                                <input
                                    type='password'
                                    name='password'
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className='input'
                                />
                                {errors.password && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className='label'>Confirm</label>
                                <input
                                    type='password'
                                    name='password_confirmation'
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    className='input'
                                />
                            </div>
                        </div>

                        <div className='flex gap-3 pt-2'>
                            <button type='submit' disabled={processing} className='btn-primary'>
                                Update
                            </button>
                            <Link
                                href={route('admin.users.index')}
                                disabled={processing}
                                className='btn-ghost'
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </SpotlightSurface>
            </div>
        </AppLayout>
    );
}
