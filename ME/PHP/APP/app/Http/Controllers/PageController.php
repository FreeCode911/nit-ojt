<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\LogEntry;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PageController extends Controller
{
    public function landing()
    {
        $stats = [
            'internships' => Internship::count(),
            'logs' => LogEntry::count(),
            'users' => User::count(),
        ];
        return view('landing', compact('stats'));
    }
}