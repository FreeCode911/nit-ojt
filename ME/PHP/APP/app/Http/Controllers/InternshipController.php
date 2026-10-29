<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Evaluation;
use App\Models\Internship;
use App\Models\LogEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InternshipController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            $internships = Internship::with(['intern', 'supervisor'])->latest()->paginate(15);
        } elseif ($user->isSupervisor()) {
            $internships = Internship::where('supervisor_id', $user->id)->with('intern')->latest()->paginate(15);
        } else {
            $internships = Internship::where('intern_id', $user->id)->with('supervisor')->latest()->paginate(15);
        }

        $internships->getCollection()->transform(function (Internship $internship) {
            return [
                'id' => $internship->id,
                'intern_name' => $internship->intern?->name ?? '—',
                'supervisor_name' => $internship->supervisor?->name ?? '—',
                'company' => $internship->company,
                'department' => $internship->department,
                'position' => $internship->position,
                'start_date' => $internship->start_date->format('M d, Y'),
                'end_date' => $internship->end_date->format('M d, Y'),
                'required_hours' => $internship->required_hours,
                'approved_hours' => $internship->approvedHours,
                'progress_percent' => $internship->progressPercent,
                'status' => $internship->status,
            ];
        });

        return Inertia::render('Internships/Index', [
            'internships' => $internships,
        ]);
    }

    public function create(): Response
    {
        $interns = User::where('role', 'intern')->orderBy('name')->get(['id', 'name']);
        $supervisors = User::where('role', 'supervisor')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Internships/Create', [
            'interns' => $interns,
            'supervisors' => $supervisors,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'intern_id' => ['required', 'exists:users,id'],
            'supervisor_id' => ['required', 'exists:users,id'],
            'company' => ['required', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'required_hours' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:pending,active,completed,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);
        $internship = Internship::create($data);

        return redirect()->route('internships.show', $internship)->with('success', 'Internship created.');
    }

    public function show(Internship $internship): Response
    {
        $this->authorizeView($internship);
        $internship->load(['intern', 'supervisor', 'logEntries', 'evaluations', 'certificates']);

        return Inertia::render('Internships/Show', [
            'internship' => [
                'id' => $internship->id,
                'intern_name' => $internship->intern?->name ?? '—',
                'supervisor_name' => $internship->supervisor?->name ?? '—',
                'company' => $internship->company,
                'department' => $internship->department,
                'position' => $internship->position,
                'start_date' => $internship->start_date->format('M d, Y'),
                'end_date' => $internship->end_date->format('M d, Y'),
                'required_hours' => $internship->required_hours,
                'approved_hours' => $internship->approvedHours,
                'progress_percent' => $internship->progressPercent,
                'status' => $internship->status,
                'notes' => $internship->notes,
                'log_entries' => $internship->logEntries->map(function (LogEntry $log) {
                    return [
                        'id' => $log->id,
                        'log_date' => $log->log_date->format('M d, Y'),
                        'hours' => $log->hours,
                        'task' => $log->task,
                        'status' => $log->status,
                    ];
                }),
                'evaluations' => $internship->evaluations->map(function (Evaluation $evaluation) {
                    return [
                        'id' => $evaluation->id,
                        'period' => $evaluation->period,
                        'overall' => $evaluation->overall,
                        'recommendation' => $evaluation->recommendation,
                    ];
                }),
                'certificates' => $internship->certificates->map(function (Certificate $certificate) {
                    return [
                        'id' => $certificate->id,
                        'certificate_number' => $certificate->certificate_number,
                        'issued_date' => $certificate->issued_date?->format('M d, Y'),
                    ];
                }),
            ],
        ]);
    }

    public function edit(Internship $internship): Response
    {
        $interns = User::where('role', 'intern')->orderBy('name')->get(['id', 'name']);
        $supervisors = User::where('role', 'supervisor')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Internships/Edit', [
            'internship' => [
                'id' => $internship->id,
                'intern_id' => $internship->intern_id,
                'supervisor_id' => $internship->supervisor_id,
                'company' => $internship->company,
                'department' => $internship->department,
                'position' => $internship->position,
                'start_date' => $internship->start_date->format('Y-m-d'),
                'end_date' => $internship->end_date->format('Y-m-d'),
                'required_hours' => $internship->required_hours,
                'status' => $internship->status,
                'notes' => $internship->notes,
            ],
            'interns' => $interns,
            'supervisors' => $supervisors,
        ]);
    }

    public function update(Request $request, Internship $internship)
    {
        $data = $request->validate([
            'intern_id' => ['required', 'exists:users,id'],
            'supervisor_id' => ['required', 'exists:users,id'],
            'company' => ['required', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'required_hours' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:pending,active,completed,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);
        $internship->update($data);

        return redirect()->route('internships.show', $internship)->with('success', 'Internship updated.');
    }

    public function destroy(Internship $internship)
    {
        $internship->delete();

        return redirect()->route('internships.index')->with('success', 'Internship deleted.');
    }

    protected function authorizeView(Internship $internship): void
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return;
        }
        if ($user->isSupervisor() && $internship->supervisor_id === $user->id) {
            return;
        }
        if ($user->isIntern() && $internship->intern_id === $user->id) {
            return;
        }
        abort(403);
    }
}
