<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'supervisor', 'intern'])->default('intern')->after('password');
            $table->string('department')->nullable()->after('role');
            $table->string('company')->nullable()->after('department');
            $table->string('phone')->nullable()->after('company');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'department', 'company', 'phone']);
        });
    }
};
