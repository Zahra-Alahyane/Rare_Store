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
    Schema::create('returns', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->constrained()->onDelete('cascade');
        $table->string('reason');
        $table->text('notes')->nullable();
        $table->enum('status', ['pending', 'approved', 'rejected', 'refunded'])->default('pending');
        $table->decimal('refund_amount', 8, 2)->default(0);
        $table->boolean('partial_refund')->default(false);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('returns');
}
};
