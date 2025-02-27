<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sms', function (Blueprint $table) {
            $table->id('id')->primary();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('environment_id')->constrained('environments');
            $table->string('rental_id');
            $table->string('rental_number');
            $table->string('service')->nullable();
            $table->string('code')->nullable();
            $table->string('text')->nullable();
            $table->string('message_id')->nullable();
            $table->string('sender')->nullable();
            $table->string('country')->nullable();
            $table->string('received_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->foreignId('deleted_by')->nullable()->constrained('users'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms');
    }
};
