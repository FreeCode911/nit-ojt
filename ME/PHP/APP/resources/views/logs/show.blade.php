@extends('layouts.app')
@section('title', 'Log Entry')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="card p-8">
        <div class="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold">{{ $log->task }}</h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm">{{ $log->user->name }} · {{ $log->internship->company }} · {{ $log->log_date->format('M d, Y') }} · {{ $log->hours }}h</p>
            </div>
            <span class="badge
                @if($log->status==='approved') bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300
                @elseif($log->status==='rejected') bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300
                @else bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 @endif">
                {{ $log->status }}
            </span>
        </div>
        @if($log->description)
            <div class="mb-5">
                <h3 class="label">Description</h3>
                <p class="text-slate-600 dark:text-slate-300 whitespace-pre-line">{{ $log->description }}</p>
            </div>
        @endif
        @if(is_array($log->skills) && count($log->skills))
            <div class="mb-5">
                <h3 class="label">Skills</h3>
                <div class="flex flex-wrap gap-2 mt-1">
                    @foreach($log->skills as $s)<span class="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{{ $s }}</span>@endforeach
                </div>
            </div>
        @endif
        @if($log->mood)
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Mood: <span class="font-medium text-slate-700 dark:text-slate-200">{{ $log->mood }}</span></p>
        @endif
        @if($log->evidence_path)
            <p class="text-sm mb-5"><a href="{{ asset('storage/'.$log->evidence_path) }}" target="_blank" class="text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"><i data-lucide="paperclip" class="w-4 h-4"></i>View evidence file</a></p>
        @endif
        @if($log->supervisor_note)
            <div class="mb-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4">
                <h3 class="label">Supervisor Note</h3>
                <p class="text-slate-600 dark:text-slate-300 text-sm">{{ $log->supervisor_note }}</p>
                <p class="text-xs text-slate-400 mt-2">Reviewed {{ $log->reviewed_at?->format('M d, Y H:i') }} by {{ $log->reviewer?->name }}</p>
            </div>
        @endif

        @if(auth()->user()->isAdmin() || (auth()->user()->isSupervisor() && $log->internship->supervisor_id === auth()->id()))
            @if($log->status === 'submitted')
                <div class="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <form method="POST" action="{{ route('logs.approve', $log) }}" class="flex gap-2 items-center flex-wrap">
                        @csrf
                        <input type="text" name="note" placeholder="Approval note (optional)" class="input text-sm max-w-xs">
                        <button class="btn-success text-sm"><i data-lucide="check" class="w-4 h-4"></i>Approve</button>
                    </form>
                    <form method="POST" action="{{ route('logs.reject', $log) }}" class="flex gap-2 items-center flex-wrap">
                        @csrf
                        <input type="text" name="note" placeholder="Reason for rejection" required class="input text-sm max-w-xs">
                        <button class="btn-danger text-sm"><i data-lucide="x" class="w-4 h-4"></i>Reject</button>
                    </form>
                </div>
            @endif
        @endif

        <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            @if(auth()->user()->id === $log->user_id || auth()->user()->isAdmin())
                <a href="{{ route('logs.edit', $log) }}" class="btn-ghost text-sm"><i data-lucide="pencil" class="w-4 h-4"></i>Edit</a>
            @endif
            <a href="{{ route('logs.index') }}" class="btn-ghost text-sm">Back</a>
        </div>
    </div>
</div>
@endsection