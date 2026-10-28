@extends('layouts.app')
@section('title', 'Edit Evaluation')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="mb-6">
        <h1 class="text-3xl font-bold tracking-tight">Edit Evaluation</h1>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('evaluations.update', $evaluation) }}" class="space-y-5">
            @csrf @method('PUT')
            <div>
                <label class="label">Internship</label>
                <select name="internship_id" required class="input">
                    @foreach($internships as $i)
                        <option value="{{ $i->id }}" @selected(old('internship_id',$evaluation->internship_id)==$i->id)>{{ $i->intern->name }} — {{ $i->company }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="label">Period</label>
                <input type="text" name="period" value="{{ old('period', $evaluation->period) }}" required class="input">
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                @foreach(['attendance','performance','initiative','teamwork','communication'] as $c)
                <div>
                    <label class="label text-xs">{{ ucfirst($c) }}</label>
                    <input type="number" name="{{ $c }}" value="{{ old($c, $evaluation->$c) }}" min="0" max="100" required class="input text-center">
                </div>
                @endforeach
            </div>
            <div>
                <label class="label">Strengths</label>
                <textarea name="strengths" rows="2" class="input">{{ old('strengths', $evaluation->strengths) }}</textarea>
            </div>
            <div>
                <label class="label">Areas to Improve</label>
                <textarea name="improvements" rows="2" class="input">{{ old('improvements', $evaluation->improvements) }}</textarea>
            </div>
            <div>
                <label class="label">Comments</label>
                <textarea name="comments" rows="2" class="input">{{ old('comments', $evaluation->comments) }}</textarea>
            </div>
            <div>
                <label class="label">Recommendation</label>
                <select name="recommendation" required class="input">
                    @foreach(['pass','needs_improvement','fail'] as $r)
                        <option value="{{ $r }}" @selected(old('recommendation',$evaluation->recommendation)==$r)>{{ ucfirst(str_replace('_',' ',$r)) }}</option>
                    @endforeach
                </select>
            </div>
            <div class="flex gap-3 pt-2">
                <button class="btn-primary">Update</button>
                <a href="{{ route('evaluations.index') }}" class="btn-ghost">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection