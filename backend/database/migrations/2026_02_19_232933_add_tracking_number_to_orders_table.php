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
    Schema::table('orders', function (Blueprint $table) {
        $table->string('tracking_number')->nullable()->after('status');
        $table->decimal('refund_amount', 8, 2)->nullable()->after('tracking_number');
        $table->string('refund_reason')->nullable()->after('refund_amount');
    });
}

public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropColumn(['tracking_number', 'refund_amount', 'refund_reason']);
    });
}
};
