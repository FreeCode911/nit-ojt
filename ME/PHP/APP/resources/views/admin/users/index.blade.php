@extends('layouts.app')
@section('title', 'Users')
@section('content')
<div class="flex flex-wrap justify-between items-center gap-4 mb-6">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Users</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage accounts and roles</p>
    </div>
    <a href="{{ route('admin.users.create') }}" class="btn-primary"><i data-lucide="plus" class="w-4 h-4"></i>New User</a>
</div>
<div class="card overflow-hidden">
    <div class="overflow-x-auto">
        <table class="table-base">
            <thead class="bg-slate-50 dark:bg-slate-800/40">
                <tr>
                    <th class="th-base">Name</th>
                    <th class="th-base">Email</th>
                    <th class="th-base">Role</th>
                    <th class="th-base">Company</th>
                    <th class="th-base"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            @foreach($users as $u)
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="td-base font-medium">{{ $u->name }}</td>
                    <td class="td-base text-slate-500 dark:text-slate-400">{{ $u->email }}</td>
                    <td class="td-base">
                        <span class="badge
                            @if($u->role==='admin') bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300
                            @elseif($u->role==='supervisor') bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300
                            @else bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 @endif">
                            {{ ucfirst($u->role) }}
                        </span>
                    </td>
                    <td class="td-base text-slate-500 dark:text-slate-400">{{ $u->company }}</td>
                    <td class="td-base text-right">
                        <a href="{{ route('admin.users.edit', $u) }}" class="text-brand-600 dark:text-brand-400 hover:underline text-sm">Edit</a>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>
<div class="mt-4">{{ $users->links() }}</div>
@endsection