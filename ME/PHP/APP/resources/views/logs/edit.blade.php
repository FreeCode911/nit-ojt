@extends('layouts.app')
@section('title', 'Edit Log')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="mb-6">
        <h1 class="text-3xl font-bold tracking-tight">Edit Log Entry</h1>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('logs.update', $log) }}" class="space-y-5">
            @csrf @method('PUT')
            <div>
                <label class="label">Internship</label>
                <select name="internship_id" required class="input">
                    @foreach($internships as $i)
                        <option value="{{ $i->id }}" @selected(old('internship_id',$log->internship_id)==$i->id)>
                            {{ $i->intern->name ?? '' }} — {{ $i->company }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Date</label>
                    <input type="date" name="log_date" value="{{ old('log_date', $log->log_date->format('Y-m-d')) }}" required class="input">
                </div>
                <div>
                    <label class="label">Hours</label>
                    <input type="number" step="0.25" min="0.25" max="24" name="hours" value="{{ old('hours', $log->hours) }}" required class="input">
                </div>
            </div>
            <div>
                <label class="label">Task</label>
                <input type="text" name="task" value="{{ old('task', $log->task) }}" required class="input">
            </div>
            <div>
                <label class="label">Description</label>
                <textarea name="description" rows="4" class="input">{{ old('description', $log->description) }}</textarea>
            </div>
            <div>
                <label class="label">Skills (comma separated)</label>
                <input type="text" name="skills" value="{{ old('skills', is_array($log->skills) ? implode(', ', $log->skills) : '') }}" class="input">
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Mood</label>
                    <select name="mood" class="input">
                        <option value="">—</option>
                        @foreach(['great','good','okay','tired','stressed'] as $m)
                            <option value="{{ $m }}" @selected(old('mood',$log->mood)==$m)>{{ ucfirst($m) }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="label">Status</label>
                    <select name="status" class="input">
                        <option value="submitted" @selected(old('status',$log->status)=='submitted')>Submit for review</option>
                        <option value="draft" @selected(old('status',$log->status)=='draft')>Draft</option>
                    </select>
                </div>
            </div>
            <div class="flex gap-3 pt-2">
                <button class="btn-primary">Update</button>
                <a href="{{ route('logs.show', $log) }}" class="btn-ghost">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection