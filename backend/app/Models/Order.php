<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'customer_id',
        'subtotal',
        'shipping',
        'tax',
        'total',
        'status',
        'tracking_number',      // NEW
        'refund_amount',        // NEW
        'refund_reason',        // NEW
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'refund_amount' => 'decimal:2',  // NEW
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderReturn()          // NEW
    {
        return $this->hasOne(OrderReturn::class);
    }
}