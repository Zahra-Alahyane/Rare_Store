<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['product:id,name', 'customer:id,name']);
        if ($request->status) $query->where('status', $request->status);
        return response()->json(['success' => true, 'reviews' => $query->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'body'       => 'required|string|min:10',
            'order_id'   => 'nullable',
        ]);

        $existing = Review::where('product_id', $validated['product_id'])
            ->where('customer_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json(['success' => false, 'message' => 'You already reviewed this product.'], 422);
        }

        $review = Review::create([
            'product_id'  => $validated['product_id'],
            'customer_id' => $request->user()->id,
            'rating'      => $validated['rating'],
            'body'        => $validated['body'],
            'status'      => 'pending',
        ]);

        return response()->json(['success' => true, 'review' => $review], 201);
    }

    public function approve($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => 'approved']);
        return response()->json(['success' => true]);
    }

    public function reject($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => 'rejected']);
        return response()->json(['success' => true]);
    }

    public function reply(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $review->update(['reply' => $request->reply]);
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        Review::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}