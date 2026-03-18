<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()
            ->favorites()
            ->with('product')
            ->get()
            ->pluck('product');

        return response()->json([
            'success' => true,
            'favorites' => $favorites,
        ]);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $favorite = Favorite::where([
            'customer_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
        ])->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'success' => true,
                'action' => 'removed',
                'message' => 'Removed from favorites',
            ]);
        } else {
            Favorite::create([
                'customer_id' => $request->user()->id,
                'product_id' => $validated['product_id'],
            ]);
            return response()->json([
                'success' => true,
                'action' => 'added',
                'message' => 'Added to favorites',
            ]);
        }
    }
}