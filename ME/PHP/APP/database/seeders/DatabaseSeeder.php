<?php

namespace Database\Seeders;

use App\Models\Internship;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@ojt.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $supervisor = User::create([
            'name' => 'Jane Supervisor',
            'email' => 'supervisor@ojt.test',
            'password' => Hash::make('password'),
            'role' => 'supervisor',
            'company' => 'Acme Corp',
            'department' => 'Engineering',
        ]);

        $intern = User::create([
            'name' => 'John Intern',
            'email' => 'intern@ojt.test',
            'password' => Hash::make('password'),
            'role' => 'intern',
            'company' => 'Acme Corp',
            'department' => 'Engineering',
        ]);

        Internship::create([
            'intern_id' => $intern->id,
            'supervisor_id' => $supervisor->id,
            'company' => 'Acme Corp',
            'department' => 'Engineering',
            'position' => 'Software Intern',
            'start_date' => now()->subWeeks(2)->toDateString(),
            'end_date' => now()->addMonths(3)->toDateString(),
            'required_hours' => 480,
            'status' => 'active',
            'notes' => 'Seeded demo internship.',
        ]);
    }
}
