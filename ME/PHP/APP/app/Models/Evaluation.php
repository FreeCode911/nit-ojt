<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'internship_id', 'supervisor_id', 'period', 'attendance', 'performance',
        'initiative', 'teamwork', 'communication', 'overall', 'strengths',
        'improvements', 'comments', 'recommendation',
    ];

    protected function casts(): array
    {
        return [
            'overall' => 'decimal:2',
        ];
    }

    public function internship(): BelongsTo
    {
        return $this->belongsTo(Internship::class);
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }
}
