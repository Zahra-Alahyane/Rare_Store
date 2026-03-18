<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalRevenue = Order::where('status', 'completed')->sum('total');
        $totalOrders = Order::count();
        $totalCustomers = Customer::where('role', 'customer')->count();
        $totalProducts = Product::count();

        $recentOrders = Order::with('customer')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_id,
                    'dbId' => $order->id,
                    'customer' => $order->customer->name,
                    'email' => $order->customer->email,
                    'date' => $order->created_at->format('Y-m-d'),
                    'items' => $order->items->count(),
                    'total' => (float) $order->total,
                    'status' => $order->status,
                ];
            });

        return response()->json([
            'success' => true,
            'stats' => [
                'revenue' => (float) $totalRevenue,
                'orders' => $totalOrders,
                'customers' => $totalCustomers,
                'products' => $totalProducts,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
 public function customers()
{
    $customers = Customer::where('role', 'customer')
        ->withCount('orders')
        ->withSum(['orders as total_spent' => function($query) {
            $query->where('status', 'completed');
        }], 'total')
        ->with(['orders' => function($query) {
            $query->orderBy('created_at', 'desc')->take(10);
        }])
        ->get()
        ->map(function ($customer) {
            return [
                'id'          => $customer->id,
                'name'        => $customer->name,
                'email'       => $customer->email,
                'joinDate'    => $customer->created_at->format('Y-m-d'),
                'orders'      => $customer->orders_count,
                'total_spent' => (float) ($customer->total_spent ?? 0),
                'notes'       => $customer->notes,
                'is_banned'   => $customer->is_banned,
                'order_history' => $customer->orders->map(fn($o) => [
                    'id'     => $o->order_id,
                    'date'   => $o->created_at->format('Y-m-d'),
                    'total'  => (float) $o->total,
                    'status' => $o->status,
                    'items'  => $o->items()->count(),
                ]),
            ];
        });

    return response()->json(['success' => true, 'customers' => $customers]);
}

    

    public function allOrders()
    {
        $orders = Order::with('customer', 'items')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_id,
                    'customer' => $order->customer->name,
                    'email' => $order->customer->email,
                    'date' => $order->created_at->format('Y-m-d'),
                    'items' => $order->items->count(),
                    'total' => (float) $order->total,
                    'status' => $order->status,
                ];
            });

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }
    public function updateCustomer(Request $request, $id)
{
    $customer = Customer::findOrFail($id);

    $validated = $request->validate([
        'notes' => 'nullable|string',
        'is_banned' => 'nullable|boolean',
    ]);

    $customer->update($validated);

    return response()->json(['success' => true, 'customer' => $customer]);
}
}