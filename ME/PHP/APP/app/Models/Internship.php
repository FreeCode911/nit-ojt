<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Internship extends Model
{
    use HasFactory;

    protected $fillable = [
        'intern_id', 'supervisor_id', 'company', 'department', 'position',
        'start_date', 'end_date', 'required_hours', 'status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'required_hours' => 'integer',
        ];
    }

    public function intern(): BelongsTo
    {
        return $this->belongsTo(User::class, 'intern_id');
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function logEntries(): HasMany
    {
        return $this->hasMany(LogEntry::class);
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function getApprovedHoursAttribute(): float
    {
        return (float) $this->logEntries()->where('status', 'approved')->sum('hours');
    }

    public function getProgressPercentAttribute(): int
    {
        if ($this->required_hours <= 0) {
            return 0;
        }

        return min(100, (int) round(($this->approvedHours / $this->required_hours) * 100));
    }
}
