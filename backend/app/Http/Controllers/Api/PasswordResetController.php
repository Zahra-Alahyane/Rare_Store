<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetMail;
use App\Models\Customer;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Send password reset code via email
     */
    public function sendResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:customers,email'
        ]);

        $code = rand(100000, 999999);

        DB::table('password_resets')->where('email', $request->email)->delete();

        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => Hash::make($code),
            'created_at' => Carbon::now()
        ]);

        Mail::to($request->email)->send(new PasswordResetMail($code));

        return response()->json([
            'message' => 'Reset code sent to your email'
        ], 200);
    }

    /**
     * Verify the reset code
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string'
        ]);

        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Invalid or expired code'
            ], 400);
        }

        if (Carbon::parse($resetRecord->created_at)->addMinutes(15)->isPast()) {
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Code has expired. Please request a new one.'
            ], 400);
        }

        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'message' => 'Invalid verification code'
            ], 400);
        }

        return response()->json([
            'message' => 'Code verified successfully'
        ], 200);
    }

    /**
     * Reset the password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'password' => 'required|string|min:6|confirmed'
        ]);

        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Invalid reset request'
            ], 400);
        }

        if (Carbon::parse($resetRecord->created_at)->addMinutes(15)->isPast()) {
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Code has expired. Please request a new one.'
            ], 400);
        }

        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'message' => 'Invalid verification code'
            ], 400);
        }

        $customer = Customer::where('email', $request->email)->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }

        $customer->password = Hash::make($request->password);
        $customer->save();

        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password reset successfully. You can now login with your new password.'
        ], 200);
    }
}