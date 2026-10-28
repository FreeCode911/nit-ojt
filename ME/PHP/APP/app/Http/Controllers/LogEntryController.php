<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\LogEntry;
use Illuminate\Http\Request;

class LogEntryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            $logs = LogEntry::with(['user', 'internship'])->latest('log_date')->paginate(20);
        } elseif ($user->isSupervisor()) {
            $logs = LogEntry::whereHas('internship', fn ($q) => $q->where('supervisor_id', $user->id))
                ->with(['user', 'internship'])->latest('log_date')->paginate(20);
        } else {
            $logs = LogEntry::where('user_id', $user->id)->with('internship')->latest('log_date')->paginate(20);
        }

        return view('logs.index', compact('logs'));
    }

    public function create()
    {
        $user = auth()->user();
        if ($user->isIntern()) {
            $internships = Internship::where('intern_id', $user->id)->where('status', 'active')->get();
        } else {
            $internships = Internship::where('status', 'active')->with('intern')->get();
        }

        return view('logs.create', compact('internships'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'internship_id' => ['required', 'exists:internships,id'],
            'log_date' => ['required', 'date'],
            'hours' => ['required', 'numeric', 'min:0.25', 'max:24'],
            'task' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'skills' => ['nullable', 'string'],
            'mood' => ['nullable', 'string', 'max:50'],
            'evidence' => ['nullable', 'file', 'max:2048'],
            'status' => ['nullable', 'in:draft,submitted'],
        ]);

        $internship = Internship::findOrFail($data['internship_id']);
        $this->authorizeInternship($internship);

        $skills = [];
        if (! empty($data['skills'])) {
            $skills = array_map('trim', explode(',', $data['skills']));
            $skills = array_values(array_filter($skills));
        }

        $evidencePath = null;
        if ($request->hasFile('evidence')) {
            $evidencePath = $request->file('evidence')->store('evidence', 'public');
        }

        LogEntry::create([
            'internship_id' => $internship->id,
            'user_id' => auth()->id(),
            'log_date' => $data['log_date'],
            'hours' => $data['hours'],
            'task' => $data['task'],
            'description' => $data['description'] ?? null,
            'skills' => $skills,
            'mood' => $data['mood'] ?? null,
            'evidence_path' => $evidencePath,
            'status' => $data['status'] ?? 'submitted',
        ]);

        return redirect()->route('logs.index')->with('success', 'Log entry saved.');
    }

    public function show(LogEntry $log)
    {
        $this->authorizeView($log);

        return view('logs.show', compact('log'));
    }

    public function edit(LogEntry $log)
    {
        $this->authorizeOwner($log);
        $internships = Internship::where('intern_id', auth()->id())->get();
        if (auth()->user()->isAdmin() || auth()->user()->isSupervisor()) {
            $internships = Internship::all();
        }

        return view('logs.edit', compact('log', 'internships'));
    }

    public function update(Request $request, LogEntry $log)
    {
        $this->authorizeOwner($log);
        $data = $request->validate([
            'internship_id' => ['required', 'exists:internships,id'],
            'log_date' => ['required', 'date'],
            'hours' => ['required', 'numeric', 'min:0.25', 'max:24'],
            'task' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'skills' => ['nullable', 'string'],
            'mood' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'in:draft,submitted'],
        ]);

        $skills = [];
        if (! empty($data['skills'])) {
            $skills = array_map('trim', explode(',', $data['skills']));
            $skills = array_values(array_filter($skills));
        }

        $log->update([
            'internship_id' => $data['internship_id'],
            'log_date' => $data['log_date'],
            'hours' => $data['hours'],
            'task' => $data['task'],
            'description' => $data['description'] ?? null,
            'skills' => $skills,
            'mood' => $data['mood'] ?? null,
            'status' => $data['status'] ?? $log->status,
        ]);

        return redirect()->route('logs.show', $log)->with('success', 'Log entry updated.');
    }

    public function destroy(LogEntry $log)
    {
        $this->authorizeOwner($log);
        $log->delete();

        return redirect()->route('logs.index')->with('success', 'Log entry deleted.');
    }

    public function approve(Request $request, LogEntry $log)
    {
        $this->authorizeReviewer($log);
        $log->update([
            'status' => 'approved',
            'supervisor_note' => $request->input('note'),
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        return back()->with('success', 'Log approved.');
    }

    public function reject(Request $request, LogEntry $log)
    {
        $request->validate(['note' => ['required', 'string']]);
        $this->authorizeReviewer($log);
        $log->update([
            'status' => 'rejected',
            'supervisor_note' => $request->input('note'),
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        return back()->with('success', 'Log rejected.');
    }

    protected function authorizeInternship(Internship $internship): void
    {
        $user = auth()->user();
        if ($user->isAdmin() || $user->isSupervisor()) {
            return;
        }
        if ($internship->intern_id !== $user->id) {
            abort(403);
        }
    }

    protected function authorizeView(LogEntry $log): void
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return;
        }
        if ($user->isSupervisor() && $log->internship->supervisor_id === $user->id) {
            return;
        }
        if ($log->user_id === $user->id) {
            return;
        }
        abort(403);
    }

    protected function authorizeOwner(LogEntry $log): void
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return;
        }
        if ($log->user_id !== $user->id) {
            abort(403);
        }
        if (in_array($log->status, ['approved'], true)) {
            abort(403, 'Approved logs cannot be edited.');
        }
    }

    protected function authorizeReviewer(LogEntry $log): void
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return;
        }
        if ($user->isSupervisor() && $log->internship->supervisor_id === $user->id) {
            return;
        }
        abort(403);
    }
}
