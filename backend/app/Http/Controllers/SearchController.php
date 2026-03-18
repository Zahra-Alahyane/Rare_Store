<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $q = $request->q;
        if (!$q || strlen($q) < 2) {
            return response()->json(['success' => false, 'message' => 'Query too short']);
        }

        $products = Product::where('name', 'like', "%{$q}%")
            ->orWhere('category', 'like', "%{$q}%")
            ->limit(5)->get(['id', 'name', 'category', 'price', 'status']);

        $orders = Order::where('order_id', 'like', "%{$q}%")
            ->orWhereHas('customer', fn($query) => $query->where('name', 'like', "%{$q}%"))
            ->with('customer:id,name')
            ->limit(5)->get(['id', 'order_id', 'total', 'status', 'customer_id']);

        $customers = Customer::where('name', 'like', "%{$q}%")
            ->orWhere('email', 'like', "%{$q}%")
            ->limit(5)->get(['id', 'name', 'email']);

        return response()->json([
            'success' => true,
            'results' => compact('products', 'orders', 'customers')
        ]);
    }
}