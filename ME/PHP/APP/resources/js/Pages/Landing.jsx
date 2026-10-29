import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    Star,
    Award,
    Users,
    FileText,
    User,
    UserCheck,
    Shield,
    CheckCircle,
    LayoutDashboard,
    LogIn,
    UserPlus,
    ArrowRight,
    X,
    Globe,
    Mail,
    MessageCircle,
    Heart,
    Rocket,
    Sun,
    Moon,
    ChevronUp,
    Layers,
    Check,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { AnimatedStats } from '../islands/AnimatedStats';
import { DashboardCharts } from '../islands/DashboardCharts';
import BlurText from '../components/reactbits/BlurText/BlurText';
import GlareHover from '../components/reactbits/GlareHover/GlareHover';
import GradientText from '../components/reactbits/GradientText/GradientText';
import Magnet from '../components/reactbits/Magnet/Magnet';
import ShinyText from '../components/reactbits/ShinyText/ShinyText';
import SpotlightCard from '../components/reactbits/SpotlightCard/SpotlightCard';
import SplitText from '../components/reactbits/SplitText/SplitText';
import StarBorder from '../components/reactbits/StarBorder/StarBorder';
import SpotlightSurface from '../components/AppBits/SpotlightSurface';

const FEATURE_ICONS = {
    'book-open': BookOpen,
    clock: Clock,
    star: Star,
    award: Award,
    users: Users,
    'file-text': FileText,
};

const FEATURE_STYLES = {
    brand: {
        bar: 'from-brand-500 to-brand-400',
        icon: 'from-brand-500 to-brand-600',
    },
    emerald: {
        bar: 'from-emerald-500 to-emerald-400',
        icon: 'from-emerald-500 to-emerald-600',
    },
    amber: {
        bar: 'from-amber-500 to-amber-400',
        icon: 'from-amber-500 to-orange-500',
    },
    violet: {
        bar: 'from-violet-500 to-violet-400',
        icon: 'from-violet-500 to-purple-500',
    },
    blue: {
        bar: 'from-blue-500 to-indigo-500',
        icon: 'from-blue-500 to-indigo-500',
    },
    fuchsia: {
        bar: 'from-fuchsia-500 to-pink-500',
        icon: 'from-fuchsia-500 to-pink-500',
    },
};

const ROLE_STYLES = {
    emerald: {
        icon: 'from-emerald-500 to-teal-500',
        chip: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
        check: 'text-emerald-500',
    },
    blue: {
        icon: 'from-blue-500 to-indigo-500',
        chip: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
        check: 'text-blue-500',
    },
    violet: {
        icon: 'from-violet-500 to-fuchsia-500',
        chip: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
        check: 'text-violet-500',
    },
};

const PRICING_STYLES = {
    free: {
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        card: 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/10',
        name: 'text-emerald-600 dark:text-emerald-400',
        check: 'text-emerald-500',
        cta: 'btn-primary w-full justify-center',
    },
    pro: {
        badge: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
        card: 'border-2 border-brand-500 hover:shadow-lg hover:shadow-brand-500/10',
        name: 'text-brand-600 dark:text-brand-400',
        check: 'text-brand-500',
        cta: 'btn-ghost w-full justify-center border border-slate-200 dark:border-slate-700',
    },
    enterprise: {
        badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        card: 'border-2 border-slate-300 dark:border-slate-700',
        name: 'text-slate-500 dark:text-slate-400',
        check: 'text-slate-500',
        cta: 'btn-ghost w-full justify-center border border-slate-200 dark:border-slate-700',
    },
};

const HERO_PATTERN =
    "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%236366f1\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')";

export default function Landing({
    stats,
    features,
    roles,
    testimonials,
    pricing,
    animatedStats,
    dashboardChartData,
}) {
    const user = usePage().props.auth?.user;
    const { dark, toggleTheme } = useTheme();
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        document.title = 'OJT Logbook — Modern On-the-Job Training Management';
    }, []);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const sectionLinks = (
        <>
            {[
                ['#features', 'Features'],
                ['#roles', 'Roles'],
                ['#testimonials', 'Testimonials'],
                ['#pricing', 'Pricing'],
            ].map(([href, label]) => (
                <a
                    key={href}
                    href={href}
                    className='px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                >
                    {label}
                </a>
            ))}
        </>
    );

    const ctaButtons = user ? (
        <StarBorder
            as={Link}
            href={route('dashboard')}
            theme={dark ? 'dark' : 'light'}
            duration={3.5}
            glow={0.75}
            radius={14}
            thickness={1.25}
            sparkle
            backgroundColor='#4f46e5'
            textColor='#ffffff'
            borderColor={dark ? 'rgba(165, 180, 252, 0.4)' : 'rgba(79, 70, 229, 0.3)'}
            className='group px-10! py-4! text-lg shadow-lg hover:shadow-xl transition-shadow duration-200'
        >
            <LayoutDashboard className='w-5 h-5 mr-2 transition-transform group-hover:translate-x-1' />
            Go to Dashboard
        </StarBorder>
    ) : (
        <>
            <StarBorder
                as={Link}
                href={route('register')}
                theme={dark ? 'dark' : 'light'}
                duration={3.5}
                glow={0.75}
                radius={14}
                thickness={1.25}
                sparkle
                backgroundColor='#4f46e5'
                textColor='#ffffff'
                borderColor={dark ? 'rgba(165, 180, 252, 0.4)' : 'rgba(79, 70, 229, 0.3)'}
                className='group px-10! py-4! text-lg shadow-lg hover:shadow-xl transition-shadow duration-200'
            >
                <UserPlus className='w-5 h-5 mr-2 transition-transform group-hover:translate-x-1' />
                Start Free Trial
            </StarBorder>
            <Link
                href={route('login')}
                className='btn-ghost group text-lg px-10 py-4 whitespace-nowrap border-2 border-slate-200 dark:border-slate-700'
            >
                <LogIn className='w-5 h-5 mr-2 inline-block' />
                Sign In
            </Link>
        </>
    );

    const scrollTo = (e, href) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, href);
        }
    };

    return (
        <div className='min-h-screen flex flex-col'>
            {/* Header */}
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

                        <nav className='hidden md:flex items-center gap-1'>{sectionLinks}</nav>

                        <div className='flex items-center gap-2'>
                            <button
                                onClick={toggleTheme}
                                className='p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
                                aria-label='Toggle theme'
                            >
                                {dark ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
                            </button>
                            {user ? (
                                <Link href={route('dashboard')} className='btn-primary'>
                                    <LayoutDashboard className='w-4 h-4' />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className='btn-ghost'>
                                        Login
                                    </Link>
                                    <Link href={route('register')} className='btn-primary'>
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className='relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-violet-50/50 dark:from-brand-950/30 dark:via-slate-950 dark:to-violet-950/30'></div>
                <div className='absolute inset-0 opacity-5' style={{ backgroundImage: HERO_PATTERN }}></div>
                <div
                    aria-hidden='true'
                    className='hero-aurora pointer-events-none absolute -top-48 left-1/2 h-[32rem] w-[58rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[96px] dark:bg-brand-500/25'
                ></div>
                <div
                    aria-hidden='true'
                    className='hero-aurora-b pointer-events-none absolute top-56 left-1/2 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[96px] dark:bg-violet-500/25'
                ></div>

                <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='text-center max-w-4xl mx-auto'>
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/80 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8 backdrop-blur-sm border border-brand-200/50 dark:border-brand-800/50 animate-fade-in-up'>
                            <span className='relative flex h-2 w-2'>
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75'></span>
                                <span className='relative inline-flex rounded-full h-2 w-2 bg-brand-500'></span>
                            </span>
                            <span>New: Real-time analytics &amp; Dark mode</span>
                        </div>

                        <h1 className='text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white mb-6'>
                            Track your{' '}
                            <GradientText
                                colors={['#4f46e5', '#7c3aed', '#a855f7', '#4f46e5']}
                                animationSpeed={6.5}
                                yoyo
                                glow={0.14}
                            >
                                OJT journey
                            </GradientText>{' '}
                            <br className='hidden lg:inline' />
                            <SplitText
                                text='in one beautiful place'
                                tag='span'
                                trigger='load'
                                splitType='chars'
                                effect='rise'
                                delay={20}
                                duration={0.9}
                                className='text-slate-900 dark:text-white'
                            />
                        </h1>

                        <BlurText
                            text='A complete On-the-Job Training logbook for interns, supervisors, and admins. Log daily tasks, track hours, get evaluated, and earn certificates — with a modern dark UI.'
                            className='text-lg sm:text-xl lg:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-10'
                            animateBy='words'
                            direction='top'
                            trigger='load'
                            delay={16}
                            blur={7}
                            distance={26}
                            stepDuration={0.32}
                        />

                        <div
                            className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up'
                            style={{ animationDelay: '300ms' }}
                        >
                            {ctaButtons}
                        </div>

                        <div
                            className='flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up'
                            style={{ animationDelay: '400ms' }}
                        >
                            {['Free forever', 'No credit card required', 'Dark mode ready', 'SOC 2 compliant'].map(
                                (label) => (
                                    <div key={label} className='flex items-center gap-2'>
                                        <CheckCircle className='w-4 h-4 text-emerald-500' />
                                        {label}
                                    </div>
                                ),
                            )}
                        </div>

                        <div className='mt-16 animate-fade-in-up' style={{ animationDelay: '500ms' }}>
                            <AnimatedStats stats={animatedStats} className='w-full' />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id='features' className='py-24 lg:py-32 bg-white dark:bg-slate-900 relative scroll-mt-16'>
                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-slate-900/50' />
                <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='text-center max-w-3xl mx-auto mb-20'>
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6'>
                            <Layers className='w-4 h-4' />
                            Core Features
                        </div>
                        <h2 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6'>
                            Everything you need for{' '}
                            <GradientText colors={['#4f46e5', '#7c3aed', '#4f46e5']} animationSpeed={7} yoyo>
                                successful OJT
                            </GradientText>
                        </h2>
                        <p className='text-lg text-slate-500 dark:text-slate-400'>
                            Built for the real world of On-the-Job Training. Powerful features, beautiful
                            design, zero complexity.
                        </p>
                    </div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
                        {features.map((feature, index) => {
                            const styles = FEATURE_STYLES[feature.color] || FEATURE_STYLES.brand;
                            const Icon = FEATURE_ICONS[feature.icon] || CheckCircle;
                            return (
                                <SpotlightCard
                                    key={feature.title}
                                    theme={dark ? 'dark' : 'light'}
                                    spotlightColor={dark ? '#818cf8' : '#4f46e5'}
                                    intensity={dark ? 0.28 : 0.14}
                                    spotlightSize={260}
                                    softness={0.72}
                                    borderGlow={dark ? 0.6 : 0.45}
                                    proximity={70}
                                    flare
                                    className='group transition-transform duration-500 hover:-translate-y-2 animate-fade-in-up'
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        '--spotlight-card-surface': dark ? 'rgba(15, 23, 42, 0.92)' : '#ffffff',
                                        '--spotlight-card-shadow': 'none',
                                    }}
                                >
                                    <div
                                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                    />
                                    <div className='relative z-10'>
                                        <div
                                            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.icon} text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <Icon className='w-7 h-7' />
                                        </div>
                                        <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-3'>
                                            {feature.title}
                                        </h3>
                                        <p className='text-slate-500 dark:text-slate-400 leading-relaxed'>
                                            {feature.desc}
                                        </p>
                                    </div>
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.bar} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                                    />
                                </SpotlightCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Roles */}
            <section id='roles' className='py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 relative scroll-mt-16'>
                <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='text-center max-w-3xl mx-auto mb-20'>
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6'>
                            <User className='w-4 h-4' />
                            Built For Everyone
                        </div>
                        <h2 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6'>
                            One platform,{' '}
                            <span className='bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent'>
                                three powerful roles
                            </span>
                        </h2>
                        <p className='text-lg text-slate-500 dark:text-slate-400'>
                            Tailored dashboards and tools for every stage of the OJT program.
                        </p>
                    </div>

                    <div className='grid md:grid-cols-3 gap-6 lg:gap-8'>
                        {roles.map((role, index) => {
                            const styles = ROLE_STYLES[role.color_base] || ROLE_STYLES.emerald;
                            const RoleIcon =
                                { user: User, 'user-check': UserCheck, shield: Shield }[role.icon] || User;
                            return (
                                <SpotlightSurface
                                    key={role.title}
                                    className='group relative hover:-translate-y-2 transition-all duration-500 animate-fade-in-up'
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div
                                        className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.icon} text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <RoleIcon className='w-7 h-7' />
                                    </div>
                                    <h3 className='text-2xl font-bold text-slate-900 dark:text-white mb-3'>
                                        {role.title}
                                    </h3>
                                    <p className='text-slate-500 dark:text-slate-400 leading-relaxed mb-6'>
                                        {role.desc}
                                    </p>
                                    <ul className='space-y-3 mb-8'>
                                        {role.features.map((feature) => (
                                            <li key={feature} className='flex items-center gap-3 text-sm'>
                                                <Check className={`w-4 h-4 ${styles.check} shrink-0`} />
                                                <span className='text-slate-600 dark:text-slate-300'>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </SpotlightSurface>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Dashboard preview */}
            <section
                id='dashboard-preview'
                className='py-24 lg:py-32 bg-white dark:bg-slate-900 relative scroll-mt-16'
            >
                <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
                        <div className='lg:order-2'>
                            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6'>
                                <LayoutDashboard className='w-4 h-4' />
                                Dashboard Preview
                            </div>
                            <h2 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6'>
                                See your OJT progress{' '}
                                <GradientText colors={['#4f46e5', '#7c3aed', '#4f46e5']} animationSpeed={7} yoyo>
                                    at a glance
                                </GradientText>
                            </h2>
                            <p className='text-lg text-slate-500 dark:text-slate-400 mb-8'>
                                Beautiful, interactive dashboards give you real-time insights into hours,
                                progress, and evaluations. Built with React for smooth, reactive updates.
                            </p>
                            <ul className='space-y-4 mb-8'>
                                {[
                                    ['Real-time progress tracking', 'Check progress bars and percentages instantly'],
                                    ['Interactive charts', 'Visualize hours, logs, and trends over time'],
                                    ['Role-based views', 'Intern, supervisor, and admin dashboards'],
                                    ['Dark mode support', 'Easy on the eyes, day or night'],
                                ].map(([heading, desc]) => (
                                    <li key={heading} className='flex items-start gap-4'>
                                        <div className='flex-shrink-0 h-10 w-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center'>
                                            <Check className='w-5 h-5 text-brand-600 dark:text-brand-400' />
                                        </div>
                                        <div>
                                            <p className='font-semibold text-slate-900 dark:text-white'>
                                                {heading}
                                            </p>
                                            <p className='text-sm text-slate-500 dark:text-slate-400'>{desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {user ? (
                                <Link href={route('dashboard')} className='btn-primary group inline-flex'>
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className='w-5 h-5 transition-transform group-hover:translate-x-1' />
                                </Link>
                            ) : (
                                <Link href={route('register')} className='btn-primary group inline-flex'>
                                    <span>Start Free Trial</span>
                                    <ArrowRight className='w-5 h-5 transition-transform group-hover:translate-x-1' />
                                </Link>
                            )}
                        </div>
                        <div className='lg:order-1 relative'>
                            <GlareHover
                                width='100%'
                                glareColor='#ffffff'
                                glareOpacity={0.45}
                                blendMode='overlay'
                                glareSize={26}
                                softness={0.7}
                                variant='streak'
                                mode='hover'
                                borderRadius='1rem'
                                borderColor='rgba(0, 0, 0, 0)'
                                className='animate-fade-in-up'
                                style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                            >
                                <div className='w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden rounded-2xl'>
                                    <div className='flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50'>
                                        <div className='flex gap-1.5'>
                                            <div className='h-3 w-3 rounded-full bg-red-500'></div>
                                            <div className='h-3 w-3 rounded-full bg-amber-500'></div>
                                            <div className='h-3 w-3 rounded-full bg-emerald-500'></div>
                                        </div>
                                        <div className='flex-1 text-center text-xs text-slate-500 dark:text-slate-400 font-mono'>
                                            dashboard.ojt-logbook.test
                                        </div>
                                    </div>
                                    <div className='p-6'>
                                        <DashboardCharts
                                            data={dashboardChartData.data}
                                            lines={dashboardChartData.lines}
                                            height={dashboardChartData.height}
                                            className='shadow-none border-0 bg-transparent dark:bg-transparent'
                                        />
                                    </div>
                                </div>
                            </GlareHover>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section
                id='testimonials'
                className='py-24 lg:py-32 bg-white dark:bg-slate-900 relative scroll-mt-16'
            >
                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-slate-900/50' />
                <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='text-center max-w-3xl mx-auto mb-20'>
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6'>
                            <MessageCircle className='w-4 h-4' />
                            Trusted by Teams
                        </div>
                        <h2 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6'>
                            Loved by{' '}
                            <GradientText colors={['#4f46e5', '#7c3aed', '#4f46e5']} animationSpeed={7} yoyo>
                                universities &amp; companies
                            </GradientText>
                        </h2>
                        <p className='text-lg text-slate-500 dark:text-slate-400'>
                            See what educators and supervisors say about OJT Logbook.
                        </p>
                    </div>

                    <div className='grid md:grid-cols-3 gap-6'>
                        {testimonials.map((t, index) => (
                            <SpotlightSurface
                                key={t.author}
                                className='hover:-translate-y-1 transition-all duration-500 animate-fade-in-up'
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className='flex items-center gap-1 mb-6'>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className='w-5 h-5 text-amber-400 fill-amber-400' />
                                    ))}
                                </div>
                                <p className='text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8'>
                                    {t.content}
                                </p>
                                <div className='flex items-center gap-4'>
                                    <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg'>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-slate-900 dark:text-white'>
                                            {t.author}
                                        </p>
                                        <p className='text-sm text-slate-500 dark:text-slate-400'>{t.role}</p>
                                        <p className='text-xs text-slate-400 dark:text-slate-500'>{t.org}</p>
                                    </div>
                                </div>
                            </SpotlightSurface>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id='pricing' className='py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 relative scroll-mt-16'>
                <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='text-center max-w-3xl mx-auto mb-20'>
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6'>
                            <Rocket className='w-4 h-4' />
                            Simple Pricing
                        </div>
                        <h2 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6'>
                            Powerful plans for{' '}
                            <GradientText colors={['#4f46e5', '#7c3aed', '#4f46e5']} animationSpeed={7} yoyo>
                                every team
                            </GradientText>
                        </h2>
                        <p className='text-lg text-slate-500 dark:text-slate-400'>
                            Start free. Upgrade when your program grows. No hidden fees, ever.
                        </p>
                    </div>

                    <div className='grid md:grid-cols-3 gap-6 lg:gap-8 items-center'>
                        {Object.entries(pricing).map(([key, plan], index) => {
                            const styles = PRICING_STYLES[key];
                            return (
                                <SpotlightSurface
                                    key={key}
                                    className={`transition-all duration-500 animate-fade-in-up ${styles.card}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {plan.badge && (
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${styles.badge}`}
                                        >
                                            {plan.badge}
                                        </span>
                                    )}
                                    <h3 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
                                        {plan.name}
                                    </h3>
                                    <p className='text-sm text-slate-500 dark:text-slate-400 mb-6'>
                                        {plan.desc}
                                    </p>
                                    <ul className='space-y-3 mb-8 min-h-11'>
                                        {plan.features.map((feature) => (
                                            <li key={feature} className='flex items-center gap-3 text-sm'>
                                                <Check className={`w-4 h-4 ${styles.check} shrink-0`} />
                                                <span className='text-slate-600 dark:text-slate-300'>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        disabled={plan.disabled}
                                        className={`${styles.cta} ${
                                            plan.disabled ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </SpotlightSurface>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className='py-24 lg:py-32 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600'></div>
                <div
                    className='absolute inset-0 opacity-100'
                    style={{
                        backgroundImage:
                            "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                    }}
                ></div>

                <div className='relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center'>
                    <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm'>
                        <Rocket className='w-4 h-4 animate-bounce' />
                        Ready to transform your OJT program?
                    </div>
                    <h2 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6'>
                        Join thousands of educators <br />
                        already using OJT Logbook
                    </h2>
                    <p className='text-lg sm:text-xl mb-10 max-w-2xl mx-auto'>
                        <ShinyText
                            text='Set up your account in minutes. No credit card required. Cancel anytime.'
                            color='#c7d2fe'
                            shineColor='#ffffff'
                            speed={3.2}
                            glow={0.3}
                        />
                    </p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                        {user ? (
                            <Magnet padding={140} magnetStrength={2.2} tilt={6} scale={1.05}>
                                <Link
                                    href={route('dashboard')}
                                    className='bg-white text-brand-600 hover:bg-brand-50 px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 group'
                                >
                                    <LayoutDashboard className='w-5 h-5 mr-2 inline-block group-hover:translate-x-1 transition-transform' />
                                    Go to Dashboard
                                </Link>
                            </Magnet>
                        ) : (
                            <>
                                <Magnet padding={140} magnetStrength={2.2} tilt={6} scale={1.05}>
                                    <Link
                                        href={route('register')}
                                        className='bg-white text-brand-600 hover:bg-brand-50 px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 group'
                                    >
                                        <UserPlus className='w-5 h-5 mr-2 inline-block group-hover:translate-x-1 transition-transform' />
                                        Start Free Trial
                                    </Link>
                                </Magnet>
                                <Link
                                    href={route('login')}
                                    className='whitespace-nowrap border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200'
                                >
                                    <LogIn className='w-5 h-5 mr-2 inline-block' />
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                    <p className='mt-8 text-brand-200 text-sm'>
                        Trusted by 50+ universities • 10,000+ active interns • 99.9% uptime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className='bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 relative'>
                <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-violet-500' />
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20'>
                    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12'>
                        <div className='lg:col-span-2'>
                            <Link
                                href={route('landing')}
                                className='flex items-center gap-2 mb-6'
                                aria-label='OJT Logbook Home'
                            >
                                <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg'>
                                    <img src='/images/logo.png' alt='' className='h-7 w-7' />
                                </div>
                                <span className='font-bold text-xl bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent'>
                                    OJT Logbook
                                </span>
                            </Link>
                            <p className='text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed mb-6'>
                                The modern On-the-Job Training logbook for interns, supervisors, and
                                admins. Beautiful, powerful, and free.
                            </p>
                            <div className='flex gap-4'>
                                {[
                                    [X, 'Practices'],
                                    [Globe, 'Website'],
                                    [Mail, 'Email'],
                                    [MessageCircle, 'Community'],
                                ].map(([Icon, label]) => (
                                    <a
                                        key={label}
                                        href='#'
                                        className='text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors'
                                        aria-label={label}
                                    >
                                        <Icon className='w-5 h-5' />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {[
                            ['Product', ['Features', '#features'], ['Roles', '#roles'], ['Pricing', '#pricing'], ['Testimonials', '#testimonials']],
                            ['Resources', ['Dashboard', route('login')], ['Sign Up', route('register')], ['Help Center', '#'], ['Community', '#']],
                            ['Company', ['About', '#'], ['Careers', '#'], ['Contact', '#'], ['Privacy', '#'], ['Terms', '#']],
                        ].map(([heading, ...links]) => (
                            <nav key={heading}>
                                <h4 className='font-semibold text-slate-900 dark:text-white mb-4'>{heading}</h4>
                                <ul className='space-y-3'>
                                    {links.map(([label, href]) => (
                                        <li key={label}>
                                            <a
                                                href={href}
                                                className='text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors'
                                            >
                                                {label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>

                    <div className='pt-8 border-t border-slate-200 dark:border-slate-800'>
                        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>
                                © {new Date().getFullYear()} OJT Logbook. Built with Laravel, React, and
                                Tailwind CSS.
                            </p>
                            <div className='flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400'>
                                <a href='#' className='hover:text-brand-600 dark:hover:text-brand-400 transition-colors'>
                                    Privacy Policy
                                </a>
                                <a href='#' className='hover:text-brand-600 dark:hover:text-brand-400 transition-colors'>
                                    Terms of Service
                                </a>
                                <span className='text-brand-500 flex items-center gap-1'>
                                    <Heart className='w-3.5 h-3.5' /> Made with care
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-8 right-8 z-40 p-3 rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-500 hover:scale-105 transition-all duration-300 ${
                    showTop ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                aria-label='Back to top'
            >
                <ChevronUp className='w-5 h-5' />
            </button>
        </div>
    );
}
