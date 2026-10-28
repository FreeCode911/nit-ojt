<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department',
        'company',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSupervisor(): bool
    {
        return $this->role === 'supervisor';
    }

    public function isIntern(): bool
    {
        return $this->role === 'intern';
    }

    public function internshipsAsIntern(): HasMany
    {
        return $this->hasMany(Internship::class, 'intern_id');
    }

    public function internshipsAsSupervisor(): HasMany
    {
        return $this->hasMany(Internship::class, 'supervisor_id');
    }

    public function logEntries(): HasMany
    {
        return $this->hasMany(LogEntry::class);
    }
}
