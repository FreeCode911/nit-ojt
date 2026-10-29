import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Briefcase,
    BookOpen,
    Star,
    Users,
    Sun,
    Moon,
    ChevronDown,
    LogOut,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ACTIVE_CLASSES =
    'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300';
const IDLE_CLASSES =
    'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';

const NAV_ITEMS = [
    { route: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', pattern: 'dashboard*' },
    { route: 'internships.index', icon: Briefcase, label: 'Internships', pattern: 'internships*' },
    { route: 'logs.index', icon: BookOpen, label: 'Logs', pattern: 'logs*' },
    { route: 'evaluations.index', icon: Star, label: 'Evaluations', pattern: 'evaluations*' },
];

const PANEL_ITEM = { route: 'admin.users.index', icon: Users, label: 'Users', pattern: 'admin*' };

const MOBILE_ITEMS = NAV_ITEMS.map(({ route, label }) => ({
    route,
    label,
    pattern: ['internships', 'logs', 'evaluations'].includes(route.replace('.index', ''))
        ? `${route.replace('.index', '')}*`
        : 'dashboard*',
}));

export default function AppLayout({ title, children }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const errorList = Object.values(props.errors || {}).flat().filter(Boolean);
    const { dark, toggleTheme } = useTheme();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        document.title = title ? `${title} — OJT Logbook` : 'OJT Logbook';
    }, [title]);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const logout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const linkClasses = (active) =>
        `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
            active ? ACTIVE_CLASSES : IDLE_CLASSES
        }`;

    const isActive = (pattern) => route().current(pattern);

    return (
        <div className='min-h-screen flex flex-col'>
            {/* Top bar */}
            <header className='sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shrink-0'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='flex h-16 items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <Link
                                href={route('dashboard')}
                                className='flex items-center gap-2 font-bold text-lg'
                            >
                                <img
                                    src='/images/logo.png'
                                    alt='OJT Logbook'
                                    className='h-9 w-9 rounded-xl object-contain shadow-md bg-white/80 dark:bg-white/10 p-1'
                                />
                                <span className='hidden sm:inline bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent'>
                                    OJT Logbook
                                </span>
                            </Link>
                        </div>

                        <nav className='hidden md:flex items-center gap-1'>
                            {NAV_ITEMS.map(({ route: routeName, icon: Icon, label, pattern }) => (
                                <Link
                                    key={routeName}
                                    href={route(routeName)}
                                    className={linkClasses(isActive(pattern))}
                                >
                                    <Icon className='w-4 h-4' />
                                    {label}
                                </Link>
                            ))}
                            {user?.role === 'admin' && (
                                <Link
                                    href={route(PANEL_ITEM.route)}
                                    className={linkClasses(isActive(PANEL_ITEM.pattern))}
                                >
                                    <PANEL_ITEM.icon className='w-4 h-4' />
                                    {PANEL_ITEM.label}
                                </Link>
                            )}
                        </nav>

                        <div className='flex items-center gap-2'>
                            {/* theme toggle */}
                            <button
                                onClick={toggleTheme}
                                className='p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
                                aria-label='Toggle theme'
                            >
                                {dark ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
                            </button>

                            {/* user dropdown */}
                            <div className='relative' ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className='flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition'
                                >
                                    <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-white text-sm font-semibold'>
                                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                    </span>
                                    <span className='hidden sm:block text-sm font-medium'>
                                        {user?.name}
                                    </span>
                                    <ChevronDown className='w-4 h-4 text-slate-400' />
                                </button>
                                {menuOpen && (
                                    <div className='absolute right-0 mt-2 w-48 card p-2 shadow-lg'>
                                        <div className='px-3 py-2 text-xs text-slate-500 dark:text-slate-400'>
                                            {user?.role}
                                        </div>
                                        <button
                                            onClick={logout}
                                            className='w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        >
                                            <LogOut className='w-4 h-4' />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile nav */}
            <div className='md:hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-x-auto'>
                <div className='flex gap-1 px-4 py-2'>
                    {MOBILE_ITEMS.map(({ route: routeName, label }) => (
                        <Link
                            key={routeName}
                            href={route(routeName)}
                            className='px-3 py-1.5 rounded-lg text-sm whitespace-nowrap text-slate-600 dark:text-slate-300'
                        >
                            {label}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link
                            href={route('admin.users.index')}
                            className='px-3 py-1.5 rounded-lg text-sm whitespace-nowrap text-slate-600 dark:text-slate-300'
                        >
                            Users
                        </Link>
                    )}
                </div>
            </div>

            <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full'>
                {props.flash?.success && (
                    <div
                        className='mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-emerald-800 dark:text-emerald-300'
                        role='alert'
                    >
                        <CheckCircle className='w-5 h-5 shrink-0' />
                        {props.flash.success}
                    </div>
                )}
                {props.flash?.error && (
                    <div
                        className='mb-6 flex items-center gap-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-300'
                        role='alert'
                    >
                        <AlertCircle className='w-5 h-5 shrink-0' />
                        {props.flash.error}
                    </div>
                )}
                {errorList.length > 0 && (
                    <div
                        className='mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-300'
                        role='alert'
                    >
                        <div className='flex items-center gap-2 font-medium mb-1'>
                            <AlertTriangle className='w-5 h-5' />
                            Please fix the following:
                        </div>
                        <ul className='list-disc pl-7 text-sm'>
                            {errorList.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {children}
            </main>

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
