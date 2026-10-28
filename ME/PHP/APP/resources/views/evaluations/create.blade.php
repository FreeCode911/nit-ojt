@extends('layouts.app')
@section('title', 'New Evaluation')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="mb-6">
        <h1 class="text-3xl font-bold tracking-tight">New Evaluation</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Score an intern's performance</p>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('evaluations.store') }}" class="space-y-5">
            @csrf
            <div>
                <label class="label">Internship</label>
                <select name="internship_id" required class="input">
                    @foreach($internships as $i)
                        <option value="{{ $i->id }}" @selected(old('internship_id')==$i->id)>{{ $i->intern->name }} — {{ $i->company }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="label">Period</label>
                <input type="text" name="period" value="{{ old('period') }}" required class="input" placeholder="e.g. Week 1-4">
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                @foreach(['attendance','performance','initiative','teamwork','communication'] as $c)
                <div>
                    <label class="label text-xs">{{ ucfirst($c) }}</label>
                    <input type="number" name="{{ $c }}" value="{{ old($c, 80) }}" min="0" max="100" required class="input text-center">
                </div>
                @endforeach
            </div>
            <div>
                <label class="label">Strengths</label>
                <textarea name="strengths" rows="2" class="input">{{ old('strengths') }}</textarea>
            </div>
            <div>
                <label class="label">Areas to Improve</label>
                <textarea name="improvements" rows="2" class="input">{{ old('improvements') }}</textarea>
            </div>
            <div>
                <label class="label">Comments</label>
                <textarea name="comments" rows="2" class="input">{{ old('comments') }}</textarea>
            </div>
            <div>
                <label class="label">Recommendation</label>
                <select name="recommendation" required class="input">
                    <option value="pass">Pass</option>
                    <option value="needs_improvement">Needs Improvement</option>
                    <option value="fail">Fail</option>
                </select>
            </div>
            <div class="flex gap-3 pt-2">
                <button class="btn-primary">Save</button>
                <a href="{{ route('evaluations.index') }}" class="btn-ghost">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection