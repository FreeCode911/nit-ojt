@extends('layouts.app')
@section('title', 'Evaluation')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="card p-8">
        <h1 class="text-2xl font-bold mb-1">{{ $evaluation->period }}</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">{{ $evaluation->internship->intern->name }} · {{ $evaluation->internship->company }} · by {{ $evaluation->supervisor->name }}</p>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            @foreach(['attendance','performance','initiative','teamwork','communication'] as $c)
                <div class="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center">
                    <div class="text-xs text-slate-500 dark:text-slate-400">{{ ucfirst($c) }}</div>
                    <div class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ $evaluation->$c }}</div>
                </div>
            @endforeach
        </div>
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <div class="rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white px-5 py-3">
                <div class="text-xs opacity-80">Overall</div>
                <div class="text-2xl font-bold">{{ $evaluation->overall }}<span class="text-sm opacity-80">/100</span></div>
            </div>
            <span class="badge text-sm px-3 py-1
                @if($evaluation->recommendation==='pass') bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300
                @elseif($evaluation->recommendation==='needs_improvement') bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300
                @else bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 @endif">
                {{ ucfirst(str_replace('_',' ',$evaluation->recommendation)) }}
            </span>
        </div>
        @foreach(['strengths'=>'Strengths','improvements'=>'Areas to Improve','comments'=>'Comments'] as $f=>$label)
            @if($evaluation->$f)
                <div class="mb-4">
                    <h3 class="label">{{ $label }}</h3>
                    <p class="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line">{{ $evaluation->$f }}</p>
                </div>
            @endif
        @endforeach
        <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <a href="{{ route('evaluations.edit', $evaluation) }}" class="btn-ghost text-sm"><i data-lucide="pencil" class="w-4 h-4"></i>Edit</a>
            <a href="{{ route('evaluations.index') }}" class="btn-ghost text-sm">Back</a>
        </div>
    </div>
</div>
@endsection