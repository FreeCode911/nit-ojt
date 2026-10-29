<?php

use App\Models\Certificate;
use App\Models\Internship;
use App\Models\LogEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/**
 * Anchor fixture: one supervisor, one intern, an active internship with
 * two approved log entries (16 approved hours) — enough for a populated
 * personalized certificate PDF.
 */
function certificatePdfInternship(): Internship
{
    $intern = User::factory()->create(['role' => 'intern']);
    $supervisor = User::factory()->create(['role' => 'supervisor']);

    $internship = Internship::create([
        'intern_id' => $intern->id,
        'supervisor_id' => $supervisor->id,
        'company' => 'Acme Corp',
        'department' => 'Engineering',
        'position' => 'Software Intern',
        'start_date' => now()->subWeeks(16)->toDateString(),
        'end_date' => now()->addWeeks(8)->toDateString(),
        'required_hours' => 480,
        'status' => 'active',
    ]);

    foreach ([now()->subDays(3), now()->subDays(2)] as $offset => $logDate) {
        LogEntry::create([
            'internship_id' => $internship->id,
            'user_id' => $intern->id,
            'log_date' => $logDate->toDateString(),
            'hours' => $offset === 0 ? 7.5 : 8.5,
            'task' => 'Built a demo feature',
            'description' => 'Worked on a seeded demo task.',
            'status' => 'approved',
            'reviewed_by' => $supervisor->id,
        ]);
    }

    return $internship;
}

function certificatePdfRecord(Internship $internship): Certificate
{
    return Certificate::create([
        'internship_id' => $internship->id,
        'certificate_number' => 'CERT-00001-2099',
        'issued_to' => $internship->intern->name,
        'issued_by' => $internship->supervisor->name,
        'issued_date' => now(),
    ]);
}

it('auto-issues and streams a personalized certificate pdf on first download', function () {
    $internship = certificatePdfInternship();

    $response = $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('reports.certificate-pdf', $internship));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
    expect(substr($response->getContent(), 0, 5))->toBe('%PDF-');
    expect(strlen($response->getContent()))->toBeGreaterThan(1000);

    $certificate = Certificate::where('internship_id', $internship->id)->sole();
    expect($certificate->certificate_number)->toMatch('/^CERT-\d{5}-\d{4}$/');
    expect($certificate->issued_to)->toBe($internship->intern->name);
});

it('reuses the existing certificate instead of creating a duplicate', function () {
    $internship = certificatePdfInternship();
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)->get(route('reports.certificate-pdf', $internship));
    $this->actingAs($admin)->get(route('reports.certificate-pdf', $internship));

    expect(Certificate::where('internship_id', $internship->id)->count())->toBe(1);
});

it('streams the exact certificate when downloading a specific record', function () {
    $internship = certificatePdfInternship();
    $certificate = certificatePdfRecord($internship);

    $response = $this->actingAs($internship->intern)->get(route('certificates.pdf', $certificate));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
    expect($response->headers->get('content-disposition'))->toContain('CERT-00001-2099.pdf');
});

it('forbids interns from downloading certificates outside their own internship', function () {
    $certificate = certificatePdfRecord(certificatePdfInternship());
    $outsider = User::factory()->create(['role' => 'intern']);

    $this->actingAs($outsider)->get(route('certificates.pdf', $certificate))->assertForbidden();
});

it('requires authentication before a certificate pdf can be generated', function () {
    $internship = certificatePdfInternship();

    $this->from('/')->get(route('reports.certificate-pdf', $internship))->assertRedirect(route('login'));
});
