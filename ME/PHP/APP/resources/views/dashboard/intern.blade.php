@extends('layouts.app')
@section('title', 'Intern Dashboard')
@section('content')
<div class="mb-8">
    <h1 class="text-3xl font-bold tracking-tight">Intern Dashboard</h1>
    <p class="text-slate-500 dark:text-slate-400 mt-1">Track your OJT progress</p>
</div>
@if($internship)
    <div class="card p-6 mb-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-violet-500/10 pointer-events-none"></div>
        <div class="relative">
            <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                    <h2 class="text-xl font-semibold">{{ $internship->company }}</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">{{ $internship->position }} · {{ $internship->department }}</p>
                </div>
                <span class="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{{ ucfirst($internship->status) }}</span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Supervisor: {{ $internship->supervisor->name }} · Required: {{ $internship->required_hours }}h · {{ $internship->start_date->format('M d') }} – {{ $internship->end_date->format('M d, Y') }}</p>
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div class="bg-gradient-to-r from-brand-500 to-violet-500 h-3 rounded-full transition-all duration-700" style="width: {{ $internship->progressPercent() }}%"></div>
            </div>
            <div class="flex justify-between text-sm mt-2">
                <span class="text-slate-600 dark:text-slate-300 font-medium">{{ $internship->approvedHours() }} / {{ $internship->required_hours }} hours</span>
                <span class="text-brand-600 dark:text-brand-400 font-semibold">{{ $internship->progressPercent() }}%</span>
            </div>
        </div>
    </div>
@endif
<div class="grid md:grid-cols-2 gap-6">
    <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold flex items-center gap-2"><i data-lucide="book-open" class="w-4 h-4"></i>Recent Logs</h2>
            <a href="{{ route('logs.create') }}" class="btn-primary text-sm">+ New Log</a>
        </div>
        <ul class="divide-y divide-slate-200 dark:divide-slate-700">
            @forelse($recentLogs as $log)
                <li class="py-3 flex justify-between items-center gap-3">
                    <div>
                        <div class="font-medium text-sm">{{ $log->log_date->format('M d, Y') }} · {{ $log->hours }}h</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">{{ \Illuminate\Support\Str::limit($log->task, 40) }}</div>
                    </div>
                    <span class="badge
                        @if($log->status==='approved') bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300
                        @elseif($log->status==='rejected') bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300
                        @else bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 @endif">
                        {{ $log->status }}
                    </span>
                </li>
            @empty
                <li class="py-6 text-center text-slate-500 dark:text-slate-400 text-sm">No logs yet. Start logging today!</li>
            @endforelse
        </ul>
    </div>
    <div class="card p-6">
        <h2 class="font-semibold flex items-center gap-2 mb-4"><i data-lucide="calendar" class="w-4 h-4"></i>Today's Log</h2>
        @if($todayLog)
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4">
                <p class="text-sm text-slate-600 dark:text-slate-300">Already logged: <span class="font-medium">{{ $todayLog->task }}</span> ({{ $todayLog->hours }}h)</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Status: {{ $todayLog->status }}</p>
                <a href="{{ route('logs.edit', $todayLog) }}" class="inline-block mt-3 text-brand-600 dark:text-brand-400 text-sm hover:underline">Edit entry →</a>
            </div>
        @else
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-4">You haven't logged today.</p>
            <a href="{{ route('logs.create') }}" class="btn-primary">Log today</a>
        @endif
    </div>
</div>
@endsection