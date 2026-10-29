import GuestLayout from '../../Layouts/GuestLayout';
import GradientAccent from '../../components/AppBits/GradientAccent';
import SpotlightSurface from '../../components/AppBits/SpotlightSurface';
import StarSubmit from '../../components/AppBits/StarSubmit';
import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title='Login'>
            <div className='max-w-md mx-auto'>
                <div className='text-center mb-8'>
                    <img
                        src='/images/logo.png'
                        alt='OJT Logbook'
                        className='h-16 w-16 object-contain mx-auto mb-4 drop-shadow-lg'
                    />
                    <h1 className='text-3xl font-bold tracking-tight'>
                        <GradientAccent>Welcome back</GradientAccent>
                    </h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-2'>Sign in to your OJT Logbook</p>
                </div>

                <SpotlightSurface className='p-8'>
                    <form onSubmit={submit} className='space-y-5'>
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

                        <div className='flex items-center justify-between'>
                            <label className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300'>
                                <input
                                    type='checkbox'
                                    name='remember'
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className='rounded border-slate-300 text-brand-600 focus:ring-brand-500'
                                />
                                Remember me
                            </label>
                        </div>

                        <StarSubmit>{processing ? 'Signing in...' : 'Sign in'}</StarSubmit>
                    </form>

                    <p className='mt-6 text-center text-sm text-slate-500 dark:text-slate-400'>
                        No account?{' '}
                        <a
                            href={route('register')}
                            className='text-brand-600 dark:text-brand-400 font-medium hover:underline'
                        >
                            Create one
                        </a>
                    </p>
                </SpotlightSurface>
            </div>
        </GuestLayout>
    );
}
