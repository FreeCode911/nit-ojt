@extends('layouts.app')
@section('title', 'Internships')
@section('content')
<div class="flex flex-wrap justify-between items-center gap-4 mb-6">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Internships</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage training programs</p>
    </div>
    @if(auth()->user()->isAdmin() || auth()->user()->isSupervisor())
        <a href="{{ route('internships.create') }}" class="btn-primary"><i data-lucide="plus" class="w-4 h-4"></i>New</a>
    @endif
</div>
<div class="card overflow-hidden">
    <div class="overflow-x-auto">
        <table class="table-base">
            <thead class="bg-slate-50 dark:bg-slate-800/40">
                <tr>
                    <th class="th-base">Intern</th>
                    <th class="th-base">Company</th>
                    <th class="th-base">Period</th>
                    <th class="th-base">Progress</th>
                    <th class="th-base">Status</th>
                    <th class="th-base"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            @foreach($internships as $i)
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="td-base font-medium">{{ $i->intern->name }}</td>
                    <td class="td-base text-slate-500 dark:text-slate-400">{{ $i->company }}</td>
                    <td class="td-base text-sm">{{ $i->start_date->format('M d, Y') }} – {{ $i->end_date->format('M d, Y') }}</td>
                    <td class="td-base">
                        <div class="flex items-center gap-2">
                            <div class="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                <div class="bg-gradient-to-r from-brand-500 to-violet-500 h-1.5 rounded-full" style="width: {{ $i->progressPercent() }}%"></div>
                            </div>
                            <span class="text-xs text-slate-500 dark:text-slate-400">{{ $i->approvedHours() }}/{{ $i->required_hours }}h</span>
                        </div>
                    </td>
                    <td class="td-base">
                        <span class="badge
                            @if($i->status==='active') bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300
                            @elseif($i->status==='completed') bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300
                            @elseif($i->status==='cancelled') bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300
                            @else bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 @endif">
                            {{ ucfirst($i->status) }}
                        </span>
                    </td>
                    <td class="td-base text-right"><a href="{{ route('internships.show', $i) }}" class="text-brand-600 dark:text-brand-400 hover:underline">View →</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>
<div class="mt-4">{{ $internships->links() }}</div>
@endsection