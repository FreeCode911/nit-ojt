<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'internship_id', 'user_id', 'log_date', 'hours', 'task', 'description',
        'skills', 'mood', 'evidence_path', 'status', 'supervisor_note',
        'reviewed_at', 'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'log_date' => 'date',
            'hours' => 'decimal:2',
            'skills' => 'array',
            'reviewed_at' => 'datetime',
        ];
    }

    public function internship(): BelongsTo
    {
        return $this->belongsTo(Internship::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
