<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric',
            'subtotal' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        // Generate unique order ID
        $orderId = 'ORD' . strtoupper(Str::random(8));

        // Create order
        $order = Order::create([
            'order_id' => $orderId,
            'customer_id' => $request->user()->id,
            'subtotal' => $validated['subtotal'],
            'shipping' => $validated['shipping'],
            'tax' => $validated['tax'],
            'total' => $validated['total'],
            'status' => 'processing',
        ]);

        // Create order items and update product stock
        foreach ($validated['cart'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'size' => $item['selectedSize'] ?? null,
                'color' => $item['selectedColor'] ?? null,
            ]);

            // Update product stock and sales
            $product = Product::find($item['id']);
            if ($product) {
                $product->decrement('stock', $item['quantity']);
                $product->increment('sales', $item['quantity']);
            }
        }

        return response()->json([
            'success' => true,
            'order' => $order->load('items.product'),
            'message' => 'Order placed successfully',
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with('items.product')->findOrFail($id);

        // Ensure user can only view their own orders
        if ($order->customer_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:processing,shipped,completed,cancelled',
        ]);

        // Try to find by order_id string first (e.g., "ORDABC123")
        $order = Order::where('order_id', $id)->first();
        
        // If not found, try by database ID
        if (!$order) {
            $order = Order::find($id);
        }

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'order' => $order,
            'message' => 'Order status updated successfully',
        ]);
    }
}