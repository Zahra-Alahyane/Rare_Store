<?php

namespace App\Http\Controllers;

use App\Models\OrderReturn;
use Illuminate\Http\Request;

class ReturnController extends Controller
{
    public function index()
    {
        $returns = OrderReturn::with('order.customer')->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'returns' => $returns]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'required|string',
            'notes' => 'nullable|string',
            'refund_amount' => 'nullable|numeric|min:0',
            'partial_refund' => 'nullable|boolean',
        ]);

        $return = OrderReturn::create($validated);
        return response()->json(['success' => true, 'return' => $return], 201);
    }

    public function update(Request $request, $id)
    {
        $return = OrderReturn::findOrFail($id);
        $return->update($request->all());
        return response()->json(['success' => true, 'return' => $return]);
    }
}