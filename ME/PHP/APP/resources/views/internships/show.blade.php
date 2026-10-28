@extends('layouts.app')
@section('title', 'Internship')
@section('content')
<div class="card p-6 mb-6">
    <div class="flex flex-wrap justify-between items-start gap-4">
        <div>
            <h1 class="text-2xl font-bold">{{ $internship->intern->name }}</h1>
            <p class="text-slate-500 dark:text-slate-400">{{ $internship->company }} · {{ $internship->position }} · {{ $internship->department }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Supervisor: {{ $internship->supervisor->name }} · {{ $internship->start_date->format('M d, Y') }} – {{ $internship->end_date->format('M d, Y') }}</p>
        </div>
        <div class="flex gap-2">
            <a href="{{ route('reports.intern', $internship) }}" class="btn-ghost text-sm"><i data-lucide="file-text" class="w-4 h-4"></i>Report</a>
            @if(auth()->user()->isAdmin() || auth()->user()->isSupervisor())
                <a href="{{ route('internships.edit', $internship) }}" class="btn-ghost text-sm"><i data-lucide="pencil" class="w-4 h-4"></i>Edit</a>
            @endif
        </div>
    </div>
    <div class="mt-5">
        <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div class="bg-gradient-to-r from-brand-500 to-violet-500 h-3 rounded-full" style="width: {{ $internship->progressPercent() }}%"></div>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">{{ $internship->approvedHours() }} / {{ $internship->required_hours }} approved hours · {{ $internship->progressPercent() }}% · Status: {{ ucfirst($internship->status) }}</p>
    </div>
    @if($internship->notes)
        <p class="mt-3 text-sm text-slate-500 dark:text-slate-400 italic">{{ $internship->notes }}</p>
    @endif
</div>

<div class="grid md:grid-cols-2 gap-6">
    <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold flex items-center gap-2"><i data-lucide="book-open" class="w-4 h-4"></i>Log Entries</h2>
            <a href="{{ route('logs.create') }}" class="text-brand-600 dark:text-brand-400 text-sm hover:underline">+ New</a>
        </div>
        <ul class="divide-y divide-slate-200 dark:divide-slate-700">
            @forelse($internship->logEntries as $log)
                <li class="py-3 flex justify-between items-center gap-3">
                    <div>
                        <a href="{{ route('logs.show', $log) }}" class="font-medium hover:underline">{{ $log->log_date->format('M d, Y') }}</a>
                        <span class="text-sm text-slate-500 dark:text-slate-400">· {{ $log->hours }}h · {{ $log->task }}</span>
                    </div>
                    <span class="badge
                        @if($log->status==='approved') bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300
                        @elseif($log->status==='rejected') bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300
                        @else bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 @endif">
                        {{ $log->status }}
                    </span>
                </li>
            @empty
                <li class="py-3 text-slate-500 dark:text-slate-400 text-sm">No logs.</li>
            @endforelse
        </ul>
    </div>
    <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold flex items-center gap-2"><i data-lucide="star" class="w-4 h-4"></i>Evaluations</h2>
            @if(auth()->user()->isAdmin() || auth()->user()->isSupervisor())
                <a href="{{ route('evaluations.create') }}" class="text-brand-600 dark:text-brand-400 text-sm hover:underline">+ New</a>
            @endif
        </div>
        <ul class="divide-y divide-slate-200 dark:divide-slate-700">
            @forelse($internship->evaluations as $ev)
                <li class="py-3 flex justify-between items-center">
                    <div>
                        <a href="{{ route('evaluations.show', $ev) }}" class="font-medium hover:underline">{{ $ev->period }}</a>
                        <span class="text-sm text-slate-500 dark:text-slate-400">· Overall {{ $ev->overall }}/100 · {{ $ev->recommendation }}</span>
                    </div>
                </li>
            @empty
                <li class="py-3 text-slate-500 dark:text-slate-400 text-sm">No evaluations.</li>
            @endforelse
        </ul>
    </div>
</div>
@endsection