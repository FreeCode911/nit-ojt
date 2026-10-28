<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Internship;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function intern(Internship $internship)
    {
        $this->authorizeView($internship);
        $internship->load(['intern', 'supervisor', 'logEntries', 'evaluations']);
        $approvedHours = $internship->approvedHours;
        $totalLogs = $internship->logEntries->count();
        $approvedLogs = $internship->logEntries->where('status', 'approved')->count();

        return view('reports.intern', compact('internship', 'approvedHours', 'totalLogs', 'approvedLogs'));
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
