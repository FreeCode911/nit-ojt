@extends('layouts.app')
@section('title', 'New Log')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="mb-6">
        <h1 class="text-3xl font-bold tracking-tight">New Log Entry</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Record today's training activity</p>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('logs.store') }}" enctype="multipart/form-data" class="space-y-5">
            @csrf
            <div>
                <label class="label">Internship</label>
                <select name="internship_id" required class="input">
                    @foreach($internships as $i)
                        <option value="{{ $i->id }}" @selected(old('internship_id')==$i->id)>
                            {{ $i->intern->name ?? '' }} — {{ $i->company }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Date</label>
                    <input type="date" name="log_date" value="{{ old('log_date', now()->format('Y-m-d')) }}" required class="input">
                </div>
                <div>
                    <label class="label">Hours</label>
                    <input type="number" step="0.25" min="0.25" max="24" name="hours" value="{{ old('hours') }}" required class="input">
                </div>
            </div>
            <div>
                <label class="label">Task</label>
                <input type="text" name="task" value="{{ old('task') }}" required class="input" placeholder="What did you work on?">
            </div>
            <div>
                <label class="label">Description</label>
                <textarea name="description" rows="4" class="input" placeholder="Details, learnings, blockers...">{{ old('description') }}</textarea>
            </div>
            <div>
                <label class="label">Skills (comma separated)</label>
                <input type="text" name="skills" value="{{ old('skills') }}" class="input" placeholder="PHP, Laravel, MySQL">
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Mood</label>
                    <select name="mood" class="input">
                        <option value="">—</option>
                        @foreach(['great','good','okay','tired','stressed'] as $m)
                            <option value="{{ $m }}" @selected(old('mood')==$m)>{{ ucfirst($m) }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="label">Evidence (file)</label>
                    <input type="file" name="evidence" class="input file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-900/40 dark:file:text-brand-300">
                </div>
            </div>
            <div>
                <label class="label">Status</label>
                <select name="status" class="input">
                    <option value="submitted" @selected(old('status','submitted')=='submitted')>Submit for review</option>
                    <option value="draft" @selected(old('status')=='draft')>Save as draft</option>
                </select>
            </div>
            <div class="flex gap-3 pt-2">
                <button class="btn-primary">Save</button>
                <a href="{{ route('logs.index') }}" class="btn-ghost">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection