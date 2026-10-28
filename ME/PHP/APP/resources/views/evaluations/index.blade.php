@extends('layouts.app')
@section('title', 'Evaluations')
@section('content')
<div class="flex flex-wrap justify-between items-center gap-4 mb-6">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Evaluations</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Performance reviews</p>
    </div>
    @if(auth()->user()->isAdmin() || auth()->user()->isSupervisor())
        <a href="{{ route('evaluations.create') }}" class="btn-primary"><i data-lucide="plus" class="w-4 h-4"></i>New</a>
    @endif
</div>
<div class="card overflow-hidden">
    <div class="overflow-x-auto">
        <table class="table-base">
            <thead class="bg-slate-50 dark:bg-slate-800/40">
                <tr>
                    <th class="th-base">Intern</th>
                    <th class="th-base">Period</th>
                    <th class="th-base">Overall</th>
                    <th class="th-base">Recommendation</th>
                    <th class="th-base"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            @foreach($evaluations as $ev)
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="td-base font-medium">{{ $ev->internship->intern->name }}</td>
                    <td class="td-base text-slate-500 dark:text-slate-400">{{ $ev->period }}</td>
                    <td class="td-base">
                        <span class="font-semibold text-brand-600 dark:text-brand-400">{{ $ev->overall }}</span><span class="text-slate-400">/100</span>
                    </td>
                    <td class="td-base">
                        <span class="badge
                            @if($ev->recommendation==='pass') bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300
                            @elseif($ev->recommendation==='needs_improvement') bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300
                            @else bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 @endif">
                            {{ ucfirst(str_replace('_',' ',$ev->recommendation)) }}
                        </span>
                    </td>
                    <td class="td-base text-right"><a href="{{ route('evaluations.show', $ev) }}" class="text-brand-600 dark:text-brand-400 hover:underline">View →</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>
<div class="mt-4">{{ $evaluations->links() }}</div>
@endsection