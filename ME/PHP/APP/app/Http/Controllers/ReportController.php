<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Evaluation;
use App\Models\Internship;
use App\Models\LogEntry;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

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
                'id' => $certificate->id,
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
        $number = $this->nextCertificateNumber($internship);
        $cert = Certificate::create([
            'internship_id' => $internship->id,
            'certificate_number' => $number,
            'issued_to' => $internship->intern->name,
            'issued_by' => $request->input('issued_by', auth()->user()->name),
            'issued_date' => now()->toDateString(),
        ]);

        return redirect()->route('reports.intern', $internship)->with('success', 'Certificate issued: '.$cert->certificate_number);
    }

    /**
     * Stream a personalized OJT certificate PDF for the internship. The
     * first download auto-issues the certificate, so every intern always
     * has one personal certificate that can be regenerated at any time.
     */
    public function certificatePdf(Internship $internship): SymfonyResponse
    {
        $this->authorizeView($internship);

        $certificate = $internship->certificates()->orderByDesc('id')->first()
            ?? $internship->certificates()->create([
                'certificate_number' => $this->nextCertificateNumber($internship),
                'issued_to' => $internship->intern->name,
                'issued_by' => $internship->supervisor->name,
                'issued_date' => today(),
            ]);

        return $this->streamCertificate($certificate);
    }

    /**
     * Stream the PDF document for one specific certificate record.
     */
    public function downloadCertificate(Certificate $certificate): SymfonyResponse
    {
        $certificate->load(['internship.intern', 'internship.supervisor']);
        $this->authorizeView($certificate->internship);

        return $this->streamCertificate($certificate);
    }

    private function streamCertificate(Certificate $certificate): SymfonyResponse
    {
        $pdf = Pdf::loadView('pdf.certificate', $this->certificateData($certificate))
            ->setPaper('a4', 'landscape');

        return $pdf->download($certificate->certificate_number.'.pdf');
    }

    /**
     * @return array<string, mixed>
     */
    private function certificateData(Certificate $certificate): array
    {
        $internship = $certificate->internship;

        return [
            'certificate' => [
                'number' => $certificate->certificate_number,
                'issued_to' => $certificate->issued_to,
                'issued_by' => $certificate->issued_by,
                'issued_date' => $certificate->issued_date->format('F j, Y'),
            ],
            'internship' => [
                'position' => (string) $internship->position,
                'company' => $internship->company,
                'department' => (string) $internship->department,
                'supervisor_name' => $internship->supervisor->name,
                'period' => $internship->start_date->format('M j, Y').' — '.$internship->end_date->format('M j, Y'),
                'approved_hours' => $this->formatHours($internship->approvedHours),
                'required_hours' => $this->formatHours((float) $internship->required_hours),
                'progress_percent' => $internship->progressPercent,
            ],
            'app_name' => (string) config('app.name'),
        ];
    }

    private function formatHours(float $hours): string
    {
        $rounded = round($hours, 2);

        if ($rounded == floor($rounded)) {
            return (string) (int) $rounded;
        }

        return number_format($rounded, 2);
    }

    private function nextCertificateNumber(Internship $internship): string
    {
        return 'CERT-'.str_pad((string) $internship->id, 5, '0', STR_PAD_LEFT).'-'.now()->format('Y');
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
