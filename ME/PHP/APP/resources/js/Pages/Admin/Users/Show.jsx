import { Link, router, usePage } from '@inertiajs/react';
import { Building2, CalendarDays, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import GradientAccent from '@/components/AppBits/GradientAccent';
import SpotlightSurface from '@/components/AppBits/SpotlightSurface';

const ROLE_BADGES = {
    admin: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    supervisor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    intern: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

const ROLE_LABELS = {
    admin: 'Admin',
    supervisor: 'Supervisor',
    intern: 'Intern',
};

export default function Show({ user }) {
    const authUser = usePage().props.auth.user;
    const isSelf = authUser.id === user.id;

    const destroy = (e) => {
        e.preventDefault();
        router.delete(route('admin.users.destroy', user.id), {
            onBefore: () => confirm('Delete this user?'),
        });
    };

    return (
        <AppLayout title='User'>
            <div className='max-w-3xl mx-auto'>
                <SpotlightSurface className='p-0! overflow-hidden mb-6'>
                    <div className='h-24 bg-gradient-to-r from-brand-500 to-violet-500' />
                    <div className='px-6 pb-6'>
                        <div className='flex flex-wrap items-end justify-between gap-4 -mt-10'>
                            <span className='inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-white text-2xl font-semibold ring-4 ring-white dark:ring-slate-900'>
                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </span>
                            <div className='flex gap-2 pb-1'>
                                <Link href={route('admin.users.edit', user.id)} className='btn-ghost text-sm'>
                                    <Pencil className='w-4 h-4' />
                                    Edit
                                </Link>
                                {!isSelf && (
                                    <button onClick={destroy} className='btn-danger text-sm'>
                                        <Trash2 className='w-4 h-4' />
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='mt-4 flex flex-wrap items-center gap-3'>
                            <h1 className='text-2xl font-bold'>
                                <GradientAccent>{user.name}</GradientAccent>
                            </h1>
                            <span className={`badge ${ROLE_BADGES[user.role]}`}>
                                {ROLE_LABELS[user.role] ?? user.role}
                            </span>
                        </div>
                        <p className='text-slate-500 dark:text-slate-400 mt-1'>{user.email}</p>

                        <div className='grid sm:grid-cols-2 gap-4 mt-6'>
                            <div className='flex items-center gap-3 text-sm'>
                                <span className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'>
                                    <Mail className='w-4 h-4' />
                                </span>
                                <div>
                                    <p className='text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500'>
                                        Email
                                    </p>
                                    <p className='font-medium'>{user.email}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 text-sm'>
                                <span className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'>
                                    <Phone className='w-4 h-4' />
                                </span>
                                <div>
                                    <p className='text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500'>
                                        Phone
                                    </p>
                                    <p className='font-medium'>{user.phone ?? '—'}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 text-sm'>
                                <span className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'>
                                    <Building2 className='w-4 h-4' />
                                </span>
                                <div>
                                    <p className='text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500'>
                                        Department / Company
                                    </p>
                                    <p className='font-medium'>
                                        {user.department ?? '—'}
                                        <span className='text-slate-400 dark:text-slate-500'> · </span>
                                        {user.company ?? '—'}
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 text-sm'>
                                <span className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'>
                                    <CalendarDays className='w-4 h-4' />
                                </span>
                                <div>
                                    <p className='text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500'>
                                        Joined
                                    </p>
                                    <p className='font-medium'>{user.created_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SpotlightSurface>

                <div className='flex gap-3'>
                    <Link href={route('admin.users.index')} className='btn-ghost'>
                        ← Back to Users
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
