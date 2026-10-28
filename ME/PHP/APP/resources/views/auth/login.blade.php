@extends('layouts.app')
@section('title', 'Login')
@section('content')
<div class="max-w-md mx-auto">
    <div class="text-center mb-8">
        <img src="{{ asset('images/logo.png') }}" alt="OJT Logbook" class="h-16 w-16 object-contain mx-auto mb-4 drop-shadow-lg">
        <h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Sign in to your OJT Logbook</p>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('login') }}" class="space-y-5">
            @csrf
            <div>
                <label class="label">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required class="input" placeholder="you@example.com">
            </div>
            <div>
                <label class="label">Password</label>
                <input type="password" name="password" required class="input" placeholder="••••••••">
            </div>
            <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input type="checkbox" name="remember" class="rounded border-slate-300 text-brand-600 focus:ring-brand-500">
                    Remember me
                </label>
            </div>
            <button class="btn-primary w-full justify-center">Sign in</button>
        </form>
        <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No account? <a href="{{ route('register') }}" class="text-brand-600 dark:text-brand-400 font-medium hover:underline">Create one</a>
        </p>
    </div>
</div>
@endsection