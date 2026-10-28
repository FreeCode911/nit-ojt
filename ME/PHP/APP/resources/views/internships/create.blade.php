@extends('layouts.app')
@section('title', 'New Internship')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="mb-6">
        <h1 class="text-3xl font-bold tracking-tight">New Internship</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Set up a training program</p>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('internships.store') }}" class="space-y-5">
            @csrf
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Intern</label>
                    <select name="intern_id" required class="input">
                        @foreach($interns as $u)<option value="{{ $u->id }}" @selected(old('intern_id')==$u->id)>{{ $u->name }}</option>@endforeach
                    </select>
                </div>
                <div>
                    <label class="label">Supervisor</label>
                    <select name="supervisor_id" required class="input">
                        @foreach($supervisors as $u)<option value="{{ $u->id }}" @selected(old('supervisor_id')==$u->id)>{{ $u->name }}</option>@endforeach
                    </select>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Company</label>
                    <input type="text" name="company" value="{{ old('company') }}" required class="input">
                </div>
                <div>
                    <label class="label">Department</label>
                    <input type="text" name="department" value="{{ old('department') }}" class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Position</label>
                    <input type="text" name="position" value="{{ old('position') }}" class="input">
                </div>
                <div>
                    <label class="label">Required Hours</label>
                    <input type="number" name="required_hours" value="{{ old('required_hours', 480) }}" required min="1" class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Start Date</label>
                    <input type="date" name="start_date" value="{{ old('start_date') }}" required class="input">
                </div>
                <div>
                    <label class="label">End Date</label>
                    <input type="date" name="end_date" value="{{ old('end_date') }}" required class="input">
                </div>
            </div>
            <div>
                <label class="label">Status</label>
                <select name="status" required class="input">
                    @foreach(['pending','active','completed','cancelled'] as $s)
                        <option value="{{ $s }}" @selected(old('status','active')==$s)>{{ ucfirst($s) }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="label">Notes</label>
                <textarea name="notes" rows="3" class="input">{{ old('notes') }}</textarea>
            </div>
            <div class="flex gap-3 pt-2">
                <button class="btn-primary">Save</button>
                <a href="{{ route('internships.index') }}" class="btn-ghost">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection