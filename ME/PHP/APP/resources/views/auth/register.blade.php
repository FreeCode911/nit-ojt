@extends('layouts.app')
@section('title', 'Register')
@section('content')
<div class="max-w-md mx-auto">
    <div class="text-center mb-8">
        <img src="{{ asset('images/logo.png') }}" alt="OJT Logbook" class="h-16 w-16 object-contain mx-auto mb-4 drop-shadow-lg">
        <h1 class="text-3xl font-bold tracking-tight">Create account</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Join the OJT Logbook</p>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('register') }}" class="space-y-5">
            @csrf
            <div>
                <label class="label">Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required class="input" placeholder="Jane Doe">
            </div>
            <div>
                <label class="label">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required class="input" placeholder="you@example.com">
            </div>
            <div>
                <label class="label">Role</label>
                <select name="role" required class="input">
                    <option value="intern" @selected(old('role')==='intern')>Intern</option>
                    <option value="supervisor" @selected(old('role')==='supervisor')>Supervisor</option>
                </select>
            </div>
            <div>
                <label class="label">Password</label>
                <input type="password" name="password" required class="input" placeholder="••••••••">
            </div>
            <div>
                <label class="label">Confirm Password</label>
                <input type="password" name="password_confirmation" required class="input" placeholder="••••••••">
            </div>
            <button class="btn-primary w-full justify-center">Create account</button>
        </form>
    </div>
</div>
@endsection