<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        Customer::create([
            'name' => 'Admin',
            'email' => 'admin@rare.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create sample customer
        Customer::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Create sample products matching your React app
        $products = [
            [
                'name' => 'Elegant Silk Dress',
                'description' => 'A timeless piece crafted from the finest silk, perfect for any occasion',
                'price' => 299.00,
                'original_price' => 399.00,
                'category' => 'dresses',
                'image' => '/images/dress.jpg',
                'stock' => 8,
                'rating' => 5,
                'reviews' => 234,
                'is_new' => true,
                'on_sale' => true,
                'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
                'colors' => [
                    ['name' => 'Black', 'hex' => '#000000'],
                    ['name' => 'Navy', 'hex' => '#1e3a8a'],
                    ['name' => 'Burgundy', 'hex' => '#7f1d1d']
                ],
            ],
            [
                'name' => 'Classic Leather Jacket',
                'description' => 'Premium leather jacket with modern design and superior comfort',
                'price' => 549.00,
                'category' => 'jackets',
                'image' => '/images/jacket.jpg',
                'stock' => 15,
                'rating' => 5,
                'reviews' => 189,
                'is_new' => false,
                'on_sale' => false,
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'colors' => [
                    ['name' => 'Black', 'hex' => '#000000'],
                    ['name' => 'Brown', 'hex' => '#78350f'],
                    ['name' => 'Tan', 'hex' => '#d97706']
                ],
            ],
            [
                'name' => 'Designer Handbag',
                'description' => 'Luxurious handbag made with authentic materials and exquisite craftsmanship',
                'price' => 429.00,
                'original_price' => 599.00,
                'category' => 'accessories',
                'image' => '/images/bag.jpg',
                'stock' => 5,
                'rating' => 4,
                'reviews' => 156,
                'is_new' => false,
                'on_sale' => true,
                'sizes' => ['One Size'],
                'colors' => [
                    ['name' => 'Beige', 'hex' => '#d6c9b5'],
                    ['name' => 'Black', 'hex' => '#000000'],
                    ['name' => 'Cream', 'hex' => '#fef3c7']
                ],
            ],
            [
                'name' => 'Cashmere Sweater',
                'description' => 'Ultra-soft cashmere sweater for ultimate comfort and style',
                'price' => 189.00,
                'category' => 'tops',
                'image' => '/images/cash.jpg',
                'stock' => 22,
                'rating' => 5,
                'reviews' => 298,
                'is_new' => true,
                'on_sale' => false,
                'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
                'colors' => [
                    ['name' => 'Cream', 'hex' => '#fef3c7'],
                    ['name' => 'Gray', 'hex' => '#6b7280'],
                    ['name' => 'Navy', 'hex' => '#1e3a8a'],
                    ['name' => 'Camel', 'hex' => '#d97706']
                ],
            ],
            [
                'name' => 'Tailored Blazer',
                'description' => 'Perfectly tailored blazer that combines elegance with modern sophistication',
                'price' => 379.00,
                'category' => 'jackets',
                'image' => '/images/blaze.jpg',
                'stock' => 12,
                'rating' => 4,
                'reviews' => 167,
                'is_new' => false,
                'on_sale' => false,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => [
                    ['name' => 'Black', 'hex' => '#000000'],
                    ['name' => 'Charcoal', 'hex' => '#374151'],
                    ['name' => 'Navy', 'hex' => '#1e3a8a']
                ],
            ],
            [
                'name' => 'Evening Gown',
                'description' => 'Stunning evening gown designed for unforgettable moments',
                'price' => 699.00,
                'original_price' => 899.00,
                'category' => 'dresses',
                'image' => '/images/gown.jpg',
                'stock' => 3,
                'rating' => 5,
                'reviews' => 421,
                'is_new' => true,
                'on_sale' => true,
                'sizes' => ['XS', 'S', 'M', 'L'],
                'colors' => [
                    ['name' => 'Emerald', 'hex' => '#065f46'],
                    ['name' => 'Ruby', 'hex' => '#991b1b'],
                    ['name' => 'Sapphire', 'hex' => '#1e40af'],
                    ['name' => 'Black', 'hex' => '#000000']
                ],
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}