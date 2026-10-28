<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\User;
use Illuminate\Http\Request;

class InternshipController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->isAdmin()) {
            $internships = Internship::with(['intern', 'supervisor'])->latest()->paginate(15);
        } elseif ($user->isSupervisor()) {
            $internships = Internship::where('supervisor_id', $user->id)->with('intern')->latest()->paginate(15);
        } else {
            $internships = Internship::where('intern_id', $user->id)->with('supervisor')->latest()->paginate(15);
        }

        return view('internships.index', compact('internships'));
    }

    public function create()
    {
        $interns = User::where('role', 'intern')->orderBy('name')->get();
        $supervisors = User::where('role', 'supervisor')->orderBy('name')->get();

        return view('internships.create', compact('interns', 'supervisors'));
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

    public function show(Internship $internship)
    {
        $this->authorizeView($internship);
        $internship->load(['intern', 'supervisor', 'logEntries', 'evaluations', 'certificates']);

        return view('internships.show', compact('internship'));
    }

    public function edit(Internship $internship)
    {
        $interns = User::where('role', 'intern')->orderBy('name')->get();
        $supervisors = User::where('role', 'supervisor')->orderBy('name')->get();

        return view('internships.edit', compact('internship', 'interns', 'supervisors'));
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
