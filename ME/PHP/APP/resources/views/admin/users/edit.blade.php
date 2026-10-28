@extends('layouts.app')
@section('title', 'Edit User')
@section('content')
<div class="max-w-3xl mx-auto">
    <div class="mb-6">
        <h1 class="text-3xl font-bold tracking-tight">Edit User</h1>
    </div>
    <div class="card p-8">
        <form method="POST" action="{{ route('admin.users.update', $user) }}" class="space-y-5">
            @csrf @method('PUT')
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Name</label>
                    <input type="text" name="name" value="{{ old('name', $user->name) }}" required class="input">
                </div>
                <div>
                    <label class="label">Email</label>
                    <input type="email" name="email" value="{{ old('email', $user->email) }}" required class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Role</label>
                    <select name="role" required class="input">
                        @foreach(['intern','supervisor','admin'] as $r)
                            <option value="{{ $r }}" @selected(old('role',$user->role)==$r)>{{ ucfirst($r) }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="label">Company</label>
                    <input type="text" name="company" value="{{ old('company', $user->company) }}" class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">Department</label>
                    <input type="text" name="department" value="{{ old('department', $user->department) }}" class="input">
                </div>
                <div>
                    <label class="label">Phone</label>
                    <input type="text" name="phone" value="{{ old('phone', $user->phone) }}" class="input">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
                <div>
                    <label class="label">New Password (optional)</label>
                    <input type="password" name="password" class="input">
                </div>
                <div>
                    <label class="label">Confirm</label>
                    <input type="password" name="password_confirmation" class="input">
                </div>
            </div>
            <div class="flex gap-3 pt-2">
                <button class="btn-primary">Update</button>
                <a href="{{ route('admin.users.index') }}" class="btn-ghost">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection