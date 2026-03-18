<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('status', 'active');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'products' => $products,
        ]);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'success' => true,
            'product' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'category' => 'required|string',
            'image' => 'required|string',
            'stock' => 'required|integer|min:0',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
            'is_new' => 'nullable|boolean',
            'on_sale' => 'nullable|boolean',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'product' => $product,
            'message' => 'Product created successfully',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'product' => $product,
            'message' => 'Product updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
    public function bulkDelete(Request $request)
{
    $request->validate(['ids' => 'required|array']);
    Product::whereIn('id', $request->ids)->delete();
    return response()->json(['success' => true, 'message' => 'Products deleted successfully']);
}

public function bulkPrice(Request $request)
{
    $request->validate([
        'ids' => 'required|array',
        'price' => 'required|numeric|min:0',
    ]);
    Product::whereIn('id', $request->ids)->update(['price' => $request->price]);
    return response()->json(['success' => true, 'message' => 'Prices updated successfully']);
}
}