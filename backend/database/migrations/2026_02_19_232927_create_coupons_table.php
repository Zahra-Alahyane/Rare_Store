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
    Schema::create('coupons', function (Blueprint $table) {
        $table->id();
        $table->string('code')->unique();
        $table->enum('type', ['percentage', 'fixed']);
        $table->decimal('value', 8, 2);
        $table->decimal('min_order', 8, 2)->default(0);
        $table->integer('usage_limit')->nullable();
        $table->integer('times_used')->default(0);
        $table->boolean('is_active')->default(true);
        $table->timestamp('expiry_date')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('coupons');
}
};
