<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Internship;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            $evaluations = Evaluation::with(['internship.intern', 'supervisor'])->latest()->paginate(20);
        } elseif ($user->isSupervisor()) {
            $evaluations = Evaluation::where('supervisor_id', $user->id)->with('internship.intern')->latest()->paginate(20);
        } else {
            $evaluations = Evaluation::whereHas('internship', fn ($q) => $q->where('intern_id', $user->id))
                ->with('supervisor')->latest()->paginate(20);
        }

        return view('evaluations.index', compact('evaluations'));
    }

    public function create()
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            $internships = Internship::with('intern')->get();
        } else {
            $internships = Internship::where('supervisor_id', $user->id)->with('intern')->get();
        }

        return view('evaluations.create', compact('internships'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'internship_id' => ['required', 'exists:internships,id'],
            'period' => ['required', 'string', 'max:100'],
            'attendance' => ['required', 'integer', 'between:0,100'],
            'performance' => ['required', 'integer', 'between:0,100'],
            'initiative' => ['required', 'integer', 'between:0,100'],
            'teamwork' => ['required', 'integer', 'between:0,100'],
            'communication' => ['required', 'integer', 'between:0,100'],
            'strengths' => ['nullable', 'string'],
            'improvements' => ['nullable', 'string'],
            'comments' => ['nullable', 'string'],
            'recommendation' => ['required', 'in:pass,needs_improvement,fail'],
        ]);

        $internship = Internship::findOrFail($data['internship_id']);
        $user = auth()->user();
        if (! $user->isAdmin() && $internship->supervisor_id !== $user->id) {
            abort(403);
        }

        $overall = round(($data['attendance'] + $data['performance'] + $data['initiative'] + $data['teamwork'] + $data['communication']) / 5, 2);

        Evaluation::create([
            'internship_id' => $internship->id,
            'supervisor_id' => $user->id,
            'period' => $data['period'],
            'attendance' => $data['attendance'],
            'performance' => $data['performance'],
            'initiative' => $data['initiative'],
            'teamwork' => $data['teamwork'],
            'communication' => $data['communication'],
            'overall' => $overall,
            'strengths' => $data['strengths'] ?? null,
            'improvements' => $data['improvements'] ?? null,
            'comments' => $data['comments'] ?? null,
            'recommendation' => $data['recommendation'],
        ]);

        return redirect()->route('evaluations.index')->with('success', 'Evaluation saved.');
    }

    public function show(Evaluation $evaluation)
    {
        return view('evaluations.show', compact('evaluation'));
    }

    public function edit(Evaluation $evaluation)
    {
        $internships = Internship::with('intern')->get();

        return view('evaluations.edit', compact('evaluation', 'internships'));
    }

    public function update(Request $request, Evaluation $evaluation)
    {
        $data = $request->validate([
            'internship_id' => ['required', 'exists:internships,id'],
            'period' => ['required', 'string', 'max:100'],
            'attendance' => ['required', 'integer', 'between:0,100'],
            'performance' => ['required', 'integer', 'between:0,100'],
            'initiative' => ['required', 'integer', 'between:0,100'],
            'teamwork' => ['required', 'integer', 'between:0,100'],
            'communication' => ['required', 'integer', 'between:0,100'],
            'strengths' => ['nullable', 'string'],
            'improvements' => ['nullable', 'string'],
            'comments' => ['nullable', 'string'],
            'recommendation' => ['required', 'in:pass,needs_improvement,fail'],
        ]);
        $overall = round(($data['attendance'] + $data['performance'] + $data['initiative'] + $data['teamwork'] + $data['communication']) / 5, 2);
        $evaluation->update(array_merge($data, ['overall' => $overall]));

        return redirect()->route('evaluations.index')->with('success', 'Evaluation updated.');
    }

    public function destroy(Evaluation $evaluation)
    {
        $evaluation->delete();

        return redirect()->route('evaluations.index')->with('success', 'Evaluation deleted.');
    }
}
