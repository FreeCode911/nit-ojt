@extends('layouts.app')
@section('title', 'Intern Report')
@section('content')
<div class="max-w-4xl mx-auto">
    <div class="card p-8 mb-6">
        <h1 class="text-2xl font-bold mb-1">OJT Report — {{ $internship->intern->name }}</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">{{ $internship->company }} · {{ $internship->position }} · Supervisor: {{ $internship->supervisor->name }}</p>
        <div class="grid md:grid-cols-4 gap-4 mt-6">
            @foreach([['Required Hours',$internship->required_hours,'target'],['Approved Hours',$approvedHours,'check-circle'],['Total Logs',$totalLogs,'book-open'],['Approved Logs',$approvedLogs,'check']] as [$l,$v,$icon])
                <div class="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center">
                    <i data-lucide="{{ $icon }}" class="w-5 h-5 mx-auto text-brand-600 dark:text-brand-400 mb-1"></i>
                    <div class="text-2xl font-bold">{{ $v }}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">{{ $l }}</div>
                </div>
            @endforeach
        </div>
        <div class="mt-5">
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div class="bg-gradient-to-r from-brand-500 to-violet-500 h-3 rounded-full" style="width: {{ $internship->progressPercent() }}%"></div>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">{{ $internship->progressPercent() }}% complete</p>
        </div>
    </div>

    <div class="card p-6 mb-6">
        <h2 class="font-semibold flex items-center gap-2 mb-4"><i data-lucide="book-open" class="w-4 h-4"></i>Log Entries</h2>
        <div class="overflow-x-auto">
            <table class="table-base">
                <thead class="bg-slate-50 dark:bg-slate-800/40">
                    <tr>
                        <th class="th-base">Date</th>
                        <th class="th-base">Task</th>
                        <th class="th-base">Hours</th>
                        <th class="th-base">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                @foreach($internship->logEntries as $log)
                    <tr>
                        <td class="td-base text-sm">{{ $log->log_date->format('M d, Y') }}</td>
                        <td class="td-base text-sm">{{ $log->task }}</td>
                        <td class="td-base">{{ $log->hours }}</td>
                        <td class="td-base text-xs">{{ $log->status }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <div class="card p-6 mb-6">
        <h2 class="font-semibold flex items-center gap-2 mb-4"><i data-lucide="star" class="w-4 h-4"></i>Evaluations</h2>
        @forelse($internship->evaluations as $ev)
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-3">
                <div class="flex justify-between flex-wrap gap-2">
                    <span class="font-medium">{{ $ev->period }}</span>
                    <span class="text-sm text-slate-500 dark:text-slate-400">Overall {{ $ev->overall }} · {{ $ev->recommendation }}</span>
                </div>
                @if($ev->comments)<p class="text-sm text-slate-600 dark:text-slate-300 mt-2">{{ $ev->comments }}</p>@endif
            </div>
        @empty
            <p class="text-slate-500 dark:text-slate-400 text-sm">No evaluations yet.</p>
        @endforelse
    </div>

    @if(auth()->user()->isAdmin() || (auth()->user()->isSupervisor() && $internship->supervisor_id === auth()->id()))
        <div class="card p-6">
            <h2 class="font-semibold flex items-center gap-2 mb-4"><i data-lucide="award" class="w-4 h-4"></i>Issue Certificate</h2>
            <form method="POST" action="{{ route('reports.certificate', $internship) }}" class="flex gap-3 items-end flex-wrap">
                @csrf
                <div class="flex-1 min-w-[200px]">
                    <label class="label">Issued by</label>
                    <input type="text" name="issued_by" value="{{ auth()->user()->name }}" class="input">
                </div>
                <button class="btn-primary">Issue</button>
            </form>
            @if($internship->certificates->count())
                <div class="mt-5">
                    <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Issued Certificates</h3>
                    <ul class="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-1">
                        @foreach($internship->certificates as $c)
                            <li class="flex items-center gap-2"><i data-lucide="award" class="w-3.5 h-3.5 text-brand-600"></i>{{ $c->certificate_number }} — {{ $c->issued_to }} ({{ $c->issued_date->format('M d, Y') }})</li>
                        @endforeach
                    </ul>
                </div>
            @endif
        </div>
    @endif
</div>
@endsection