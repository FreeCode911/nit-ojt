import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

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

function decodeLabel(label) {
    return String(label).replace(/&laquo;/g, '«').replace(/&raquo;/g, '»');
}

function Pagination({ paginator }) {
    if (!paginator || !paginator.links?.length || (paginator.last_page ?? 1) <= 1) {
        return null;
    }

    return (
        <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
            <span className='mr-2 text-sm text-slate-500 dark:text-slate-400'>
                Showing {paginator.from}–{paginator.to} of {paginator.total}
            </span>
            {paginator.links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            link.active
                                ? 'bg-brand-600 text-white'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        {decodeLabel(link.label)}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className='px-3 py-1.5 rounded-lg text-sm text-slate-400 dark:text-slate-500 select-none'
                    >
                        {decodeLabel(link.label)}
                    </span>
                ),
            )}
        </div>
    );
}

export default function Index({ users }) {
    return (
        <AppLayout title='Users'>
            <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
                    <p className='text-slate-500 dark:text-slate-400 mt-1'>
                        Manage accounts and roles
                    </p>
                </div>
                <Link href={route('admin.users.create')} className='btn-primary'>
                    <Plus className='w-4 h-4' />
                    New User
                </Link>
            </div>

            <div className='card overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='table-base'>
                        <thead className='bg-slate-50 dark:bg-slate-800/40'>
                            <tr>
                                <th className='th-base'>Name</th>
                                <th className='th-base'>Email</th>
                                <th className='th-base'>Role</th>
                                <th className='th-base'>Company</th>
                                <th className='th-base'></th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition'
                                >
                                    <td className='td-base font-medium'>
                                        <Link
                                            href={route('admin.users.show', user.id)}
                                            className='hover:underline'
                                        >
                                            {user.name}
                                        </Link>
                                    </td>
                                    <td className='td-base text-slate-500 dark:text-slate-400'>
                                        {user.email}
                                    </td>
                                    <td className='td-base'>
                                        <span className={`badge ${ROLE_BADGES[user.role]}`}>
                                            {ROLE_LABELS[user.role] ?? user.role}
                                        </span>
                                    </td>
                                    <td className='td-base text-slate-500 dark:text-slate-400'>
                                        {user.company}
                                    </td>
                                    <td className='td-base text-right'>
                                        <Link
                                            href={route('admin.users.edit', user.id)}
                                            className='text-brand-600 dark:text-brand-400 hover:underline text-sm'
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className='td-base text-center text-slate-500 dark:text-slate-400 py-10'
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination paginator={users} />
        </AppLayout>
    );
}
