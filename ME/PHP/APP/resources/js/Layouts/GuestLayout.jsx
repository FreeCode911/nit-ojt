import { Link } from '@inertiajs/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function GuestLayout({ title, children }) {
    const { dark, toggleTheme } = useTheme();

    return (
        <div className='min-h-screen flex flex-col'>
            <header className='sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shrink-0'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='flex h-16 items-center justify-between gap-4'>
                        <Link href={route('landing')} className='flex items-center gap-2 font-bold text-lg'>
                            <img
                                src='/images/logo.png'
                                alt='OJT Logbook'
                                className='h-9 w-9 rounded-xl object-contain shadow-md bg-white/80 dark:bg-white/10 p-1'
                            />
                            <span className='hidden sm:inline bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent'>
                                OJT Logbook
                            </span>
                        </Link>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={toggleTheme}
                                className='p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
                                aria-label='Toggle theme'
                            >
                                {dark ? <Sun /> : <Moon />}
                            </button>
                            <Link href={route('login')} className='btn-ghost'>
                                Login
                            </Link>
                            <Link href={route('register')} className='btn-primary'>
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full'>{children}</main>

            <footer className='border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0'>
                <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                        <img
                            src='/images/logo.png'
                            alt='OJT Logbook'
                            className='h-7 w-7 rounded-lg object-contain'
                        />
                        <span className='font-semibold text-sm'>OJT Logbook</span>
                    </div>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                        Built with Laravel, React &amp; Tailwind CSS
                    </p>
                </div>
            </footer>
        </div>
    );
}
