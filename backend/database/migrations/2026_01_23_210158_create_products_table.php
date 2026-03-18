<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('category');
            $table->string('image');
            $table->integer('stock')->default(0);
            $table->integer('sales')->default(0);
            $table->integer('rating')->default(5);
            $table->integer('reviews')->default(0);
            $table->boolean('is_new')->default(false);
            $table->boolean('on_sale')->default(false);
            $table->string('status')->default('active');
            $table->json('sizes')->nullable();
            $table->json('colors')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};