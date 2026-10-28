@extends('layouts.app')
@section('title', 'Edit Internship')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="mb-6">
        <h1 class="text-3xl font-bold tracking-tight">Edit Internship</h1>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('internships.update', $internship) }}" class="space-y-5">
            @csrf @method('PUT')
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Intern</label>
                    <select name="intern_id" required class="input">
                        @foreach($interns as $u)<option value="{{ $u->id }}" @selected(old('intern_id',$internship->intern_id)==$u->id)>{{ $u->name }}</option>@endforeach
                    </select>
                </div>
                <div>
                    <label class="label">Supervisor</label>
                    <select name="supervisor_id" required class="input">
                        @foreach($supervisors as $u)<option value="{{ $u->id }}" @selected(old('supervisor_id',$internship->supervisor_id)==$u->id)>{{ $u->name }}</option>@endforeach
                    </select>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Company</label>
                    <input type="text" name="company" value="{{ old('company', $internship->company) }}" required class="input">
                </div>
                <div>
                    <label class="label">Department</label>
                    <input type="text" name="department" value="{{ old('department', $internship->department) }}" class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Position</label>
                    <input type="text" name="position" value="{{ old('position', $internship->position) }}" class="input">
                </div>
                <div>
                    <label class="label">Required Hours</label>
                    <input type="number" name="required_hours" value="{{ old('required_hours', $internship->required_hours) }}" required min="1" class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Start Date</label>
                    <input type="date" name="start_date" value="{{ old('start_date', $internship->start_date->format('Y-m-d')) }}" required class="input">
                </div>
                <div>
                    <label class="label">End Date</label>
                    <input type="date" name="end_date" value="{{ old('end_date', $internship->end_date->format('Y-m-d')) }}" required class="input">
                </div>
            </div>
            <div>
                <label class="label">Status</label>
                <select name="status" required class="input">
                    @foreach(['pending','active','completed','cancelled'] as $s)
                        <option value="{{ $s }}" @selected(old('status',$internship->status)==$s)>{{ ucfirst($s) }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="label">Notes</label>
                <textarea name="notes" rows="3" class="input">{{ old('notes', $internship->notes) }}</textarea>
            </div>
            <div class="flex gap-3 pt-2">
                <button class="btn-primary">Update</button>
                <a href="{{ route('internships.show', $internship) }}" class="btn-ghost">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection