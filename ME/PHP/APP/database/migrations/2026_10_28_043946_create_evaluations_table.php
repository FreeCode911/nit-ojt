<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('supervisor_id')->constrained('users')->cascadeOnDelete();
            $table->string('period'); // e.g. "Week 1-4", "Midterm", "Final"
            $table->unsignedTinyInteger('attendance')->default(0);
            $table->unsignedTinyInteger('performance')->default(0);
            $table->unsignedTinyInteger('initiative')->default(0);
            $table->unsignedTinyInteger('teamwork')->default(0);
            $table->unsignedTinyInteger('communication')->default(0);
            $table->decimal('overall', 4, 2)->default(0);
            $table->text('strengths')->nullable();
            $table->text('improvements')->nullable();
            $table->text('comments')->nullable();
            $table->enum('recommendation', ['pass', 'needs_improvement', 'fail'])->default('pass');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
