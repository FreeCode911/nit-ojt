<?php

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\InternshipController;
use App\Http\Controllers\LogEntryController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'landing'])->name('landing');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('internships', InternshipController::class);
    Route::resource('logs', LogEntryController::class);

    Route::post('logs/{log}/approve', [LogEntryController::class, 'approve'])->name('logs.approve');
    Route::post('logs/{log}/reject', [LogEntryController::class, 'reject'])->name('logs.reject');

    Route::resource('evaluations', EvaluationController::class);

    Route::get('reports/intern/{internship}', [ReportController::class, 'intern'])->name('reports.intern');
    Route::post('reports/intern/{internship}/certificate', [ReportController::class, 'issueCertificate'])->name('reports.certificate');
    Route::get('reports/intern/{internship}/certificate-pdf', [ReportController::class, 'certificatePdf'])->name('reports.certificate-pdf');
    Route::get('certificates/{certificate}/pdf', [ReportController::class, 'downloadCertificate'])->name('certificates.pdf');

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', AdminUserController::class);
    });
});
