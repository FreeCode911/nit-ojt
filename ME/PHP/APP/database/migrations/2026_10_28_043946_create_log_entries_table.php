<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('log_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('log_date');
            $table->decimal('hours', 5, 2);
            $table->string('task');
            $table->text('description')->nullable();
            $table->json('skills')->nullable();
            $table->string('mood')->nullable();
            $table->string('evidence_path')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected'])->default('submitted');
            $table->text('supervisor_note')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['internship_id', 'log_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_entries');
    }
};
