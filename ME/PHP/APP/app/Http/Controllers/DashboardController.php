<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\LogEntry;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            $stats = [
                'users' => User::count(),
                'internships' => Internship::count(),
                'pending_logs' => LogEntry::where('status', 'submitted')->count(),
                'completed' => Internship::where('status', 'completed')->count(),
            ];
            $statusCounts = [
                'pending' => Internship::where('status', 'pending')->count(),
                'active' => Internship::where('status', 'active')->count(),
                'completed' => Internship::where('status', 'completed')->count(),
                'cancelled' => Internship::where('status', 'cancelled')->count(),
            ];
            $recent = Internship::with(['intern', 'supervisor'])->latest()->take(8)->get();

            return Inertia::render('Dashboard/Admin', compact('stats', 'recent', 'statusCounts'));
        }

        if ($user->isSupervisor()) {
            $internshipModels = Internship::where('supervisor_id', $user->id)->with('intern')->get();
            $pendingLogModels = LogEntry::whereHas('internship', fn ($query) => $query->where('supervisor_id', $user->id))
                ->where('status', 'submitted')->with(['user', 'internship'])->latest()->take(10)->get();

            $internships = $internshipModels->values()->map(fn (Internship $internship): array => [
                'id' => $internship->id,
                'company' => $internship->company,
                'position' => $internship->position,
                'intern_name' => $internship->intern->name,
                'required_hours' => $internship->required_hours,
                // computed explicitly: accessors are not auto-serialized
                'approved_hours' => $internship->approvedHours,
                'progress_percent' => $internship->progressPercent,
            ]);
            $totalApprovedHours = (float) $internshipModels->sum(fn (Internship $internship): float => $internship->approvedHours);

            $pendingLogs = $pendingLogModels->values()->map(fn (LogEntry $log): array => [
                'id' => $log->id,
                'intern_name' => $log->user->name,
                'log_date' => $log->log_date->format('M d, Y'),
                'task' => $log->task,
                'hours' => $log->hours,
            ]);

            return Inertia::render('Dashboard/Supervisor', compact('internships', 'pendingLogs', 'totalApprovedHours'));
        }

        // intern
        $internshipModel = Internship::where('intern_id', $user->id)->with('supervisor')->latest()->first();
        $recentLogModels = LogEntry::where('user_id', $user->id)->latest('log_date')->take(7)->get();
        $todayLogModel = LogEntry::where('user_id', $user->id)->whereDate('log_date', today())->first();

        $internship = $internshipModel ? [
            'id' => $internshipModel->id,
            'company' => $internshipModel->company,
            'position' => $internshipModel->position,
            'department' => $internshipModel->department,
            'status' => $internshipModel->status,
            'supervisor_name' => $internshipModel->supervisor->name,
            'required_hours' => $internshipModel->required_hours,
            'start_date' => $internshipModel->start_date->format('M d'),
            'end_date' => $internshipModel->end_date->format('M d, Y'),
            // computed explicitly: accessors are not auto-serialized
            'approved_hours' => $internshipModel->approvedHours,
            'progress_percent' => $internshipModel->progressPercent,
        ] : null;

        $recentLogs = $recentLogModels->map(fn (LogEntry $log): array => [
            'log_date' => $log->log_date->format('M d, Y'),
            'hours' => $log->hours,
            'task' => Str::limit($log->task, 40),
            'status' => $log->status,
        ]);

        $todayLog = $todayLogModel ? [
            'id' => $todayLogModel->id,
            'task' => $todayLogModel->task,
            'hours' => $todayLogModel->hours,
            'status' => $todayLogModel->status,
        ] : null;

        return Inertia::render('Dashboard/Intern', compact('internship', 'recentLogs', 'todayLog'));
    }
}
