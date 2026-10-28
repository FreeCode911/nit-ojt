@extends('layouts.app')
@section('title', 'Logs')
@section('content')
<div class="flex flex-wrap justify-between items-center gap-4 mb-6">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Log Entries</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Daily training journals</p>
    </div>
    <a href="{{ route('logs.create') }}" class="btn-primary"><i data-lucide="plus" class="w-4 h-4"></i>New Log</a>
</div>
<div class="card overflow-hidden">
    <div class="overflow-x-auto">
        <table class="table-base">
            <thead class="bg-slate-50 dark:bg-slate-800/40">
                <tr>
                    <th class="th-base">Date</th>
                    <th class="th-base">Intern</th>
                    <th class="th-base">Task</th>
                    <th class="th-base">Hours</th>
                    <th class="th-base">Status</th>
                    <th class="th-base"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            @foreach($logs as $log)
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="td-base text-sm">{{ $log->log_date->format('M d, Y') }}</td>
                    <td class="td-base font-medium">{{ $log->user->name }}</td>
                    <td class="td-base text-slate-500 dark:text-slate-400">{{ \Illuminate\Support\Str::limit($log->task, 40) }}</td>
                    <td class="td-base">{{ $log->hours }}</td>
                    <td class="td-base">
                        <span class="badge
                            @if($log->status==='approved') bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300
                            @elseif($log->status==='rejected') bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300
                            @else bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 @endif">
                            {{ $log->status }}
                        </span>
                    </td>
                    <td class="td-base text-right"><a href="{{ route('logs.show', $log) }}" class="text-brand-600 dark:text-brand-400 hover:underline">View →</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>
<div class="mt-4">{{ $logs->links() }}</div>
@endsection