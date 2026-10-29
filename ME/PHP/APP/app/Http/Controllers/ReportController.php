<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Evaluation;
use App\Models\Internship;
use App\Models\LogEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function intern(Internship $internship): Response
    {
        $this->authorizeView($internship);
        $internship->load(['intern', 'supervisor', 'logEntries', 'evaluations', 'certificates']);
        $approvedHours = $internship->approvedHours;
        $totalLogs = $internship->logEntries->count();
        $approvedLogs = $internship->logEntries->where('status', 'approved')->count();

        $internship = [
            'id' => $internship->id,
            'company' => $internship->company,
            'position' => $internship->position,
            'supervisor_id' => $internship->supervisor_id,
            'intern_name' => $internship->intern->name,
            'supervisor_name' => $internship->supervisor->name,
            'required_hours' => $internship->required_hours,
            // computed explicitly: accessors are not auto-serialized
            'progress_percent' => $internship->progressPercent,
            'log_entries' => $internship->logEntries->map(fn (LogEntry $log): array => [
                'log_date' => $log->log_date->format('M d, Y'),
                'task' => $log->task,
                'hours' => $log->hours,
                'status' => $log->status,
            ]),
            'evaluations' => $internship->evaluations->map(fn (Evaluation $evaluation): array => [
                'period' => $evaluation->period,
                'overall' => $evaluation->overall,
                'recommendation' => $evaluation->recommendation,
                'comments' => $evaluation->comments,
            ]),
            'certificates' => $internship->certificates->map(fn (Certificate $certificate): array => [
                'certificate_number' => $certificate->certificate_number,
                'issued_to' => $certificate->issued_to,
                'issued_date' => $certificate->issued_date->format('M d, Y'),
            ]),
        ];

        return Inertia::render('Reports/Intern', compact('internship', 'approvedHours', 'totalLogs', 'approvedLogs'));
    }

    public function issueCertificate(Request $request, Internship $internship)
    {
        $request->validate([
            'issued_by' => ['nullable', 'string', 'max:255'],
        ]);
        $number = 'CERT-'.str_pad($internship->id, 5, '0', STR_PAD_LEFT).'-'.now()->format('Y');
        $cert = Certificate::create([
            'internship_id' => $internship->id,
            'certificate_number' => $number,
            'issued_to' => $internship->intern->name,
            'issued_by' => $request->input('issued_by', auth()->user()->name),
            'issued_date' => now()->toDateString(),
        ]);

        return redirect()->route('reports.intern', $internship)->with('success', 'Certificate issued: '.$cert->certificate_number);
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
