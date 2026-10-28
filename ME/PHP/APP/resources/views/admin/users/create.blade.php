@extends('layouts.app')
@section('title', 'New User')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="mb-6">
        <h1 class="text-3xl font-bold tracking-tight">New User</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Create an account</p>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('admin.users.store') }}" class="space-y-5">
            @csrf
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Name</label>
                    <input type="text" name="name" value="{{ old('name') }}" required class="input">
                </div>
                <div>
                    <label class="label">Email</label>
                    <input type="email" name="email" value="{{ old('email') }}" required class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Role</label>
                    <select name="role" required class="input">
                        @foreach(['intern','supervisor','admin'] as $r)
                            <option value="{{ $r }}" @selected(old('role')==$r)>{{ ucfirst($r) }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="label">Company</label>
                    <input type="text" name="company" value="{{ old('company') }}" class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Department</label>
                    <input type="text" name="department" value="{{ old('department') }}" class="input">
                </div>
                <div>
                    <label class="label">Phone</label>
                    <input type="text" name="phone" value="{{ old('phone') }}" class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Password</label>
                    <input type="password" name="password" required class="input">
                </div>
                <div>
                    <label class="label">Confirm Password</label>
                    <input type="password" name="password_confirmation" required class="input">
                </div>
            </div>
            <div class="flex gap-3 pt-2">
                <button class="btn-primary">Create</button>
                <a href="{{ route('admin.users.index') }}" class="btn-ghost">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection