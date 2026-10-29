import GuestLayout from '../../Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        role: 'intern',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout title='Register'>
            <div className='max-w-md mx-auto'>
                <div className='text-center mb-8'>
                    <img
                        src='/images/logo.png'
                        alt='OJT Logbook'
                        className='h-16 w-16 object-contain mx-auto mb-4 drop-shadow-lg'
                    />
                    <h1 className='text-3xl font-bold tracking-tight'>Create account</h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-2'>Join the OJT Logbook</p>
                </div>

                <div className='card p-8'>
                    <form onSubmit={submit} className='space-y-5'>
                        <div>
                            <label className='label'>Name</label>
                            <input
                                type='text'
                                name='name'
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className='input'
                                placeholder='Jane Doe'
                            />
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
                                placeholder='you@example.com'
                            />
                        </div>

                        <div>
                            <label className='label'>Role</label>
                            <select
                                name='role'
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                required
                                className='input'
                            >
                                <option value='intern'>Intern</option>
                                <option value='supervisor'>Supervisor</option>
                            </select>
                        </div>

                        <div>
                            <label className='label'>Password</label>
                            <input
                                type='password'
                                name='password'
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className='input'
                                placeholder='••••••••'
                            />
                        </div>

                        <div>
                            <label className='label'>Confirm Password</label>
                            <input
                                type='password'
                                name='password_confirmation'
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                className='input'
                                placeholder='••••••••'
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={processing}
                            className='btn-primary w-full justify-center disabled:opacity-60'
                        >
                            {processing ? 'Creating...' : 'Create account'}
                        </button>
                    </form>

                    <p className='text-center text-sm text-slate-500 dark:text-slate-400 mt-6'>
                        Already have an account?{' '}
                        <a
                            href={route('login')}
                            className='text-brand-600 dark:text-brand-400 hover:underline'
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
