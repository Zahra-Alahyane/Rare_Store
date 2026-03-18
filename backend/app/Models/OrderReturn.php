<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderReturn extends Model
{
    protected $table = 'returns';

    protected $fillable = [
        'order_id',
        'reason',
        'notes',
        'status',
        'refund_amount',
        'partial_refund',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}