<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\LogEntry;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
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

            return view('dashboard.admin', compact('stats', 'recent', 'statusCounts'));
        }

        if ($user->isSupervisor()) {
            $internships = Internship::where('supervisor_id', $user->id)->with('intern')->get();
            $pendingLogs = LogEntry::whereHas('internship', fn ($q) => $q->where('supervisor_id', $user->id))
                ->where('status', 'submitted')->with(['user', 'internship'])->latest()->take(10)->get();

            return view('dashboard.supervisor', compact('internships', 'pendingLogs'));
        }

        // intern
        $internship = Internship::where('intern_id', $user->id)->latest()->first();
        $recentLogs = LogEntry::where('user_id', $user->id)->latest('log_date')->take(7)->get();
        $todayLog = LogEntry::where('user_id', $user->id)->whereDate('log_date', today())->first();

        return view('dashboard.intern', compact('internship', 'recentLogs', 'todayLog'));
    }
}
