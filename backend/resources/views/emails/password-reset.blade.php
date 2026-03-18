<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #7f1d1d;
            padding: 32px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 300;
            letter-spacing: 6px;
            margin: 0;
        }
        .body {
            padding: 40px 32px;
            text-align: center;
        }
        .body p {
            color: #6b7280;
            font-size: 15px;
            margin-bottom: 24px;
        }
        .code-box {
            background-color: #f9f9f9;
            border: 2px dashed #7f1d1d;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
        }
        .code-box span {
            font-size: 42px;
            font-weight: bold;
            color: #7f1d1d;
            letter-spacing: 10px;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px 32px;
            text-align: center;
        }
        .footer p {
            color: #9ca3af;
            font-size: 12px;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>RARE STORE</h1>
        </div>
        <div class="body">
            <p>You requested a password reset. Use the code below to continue:</p>
            <div class="code-box">
                <span>{{ $code }}</span>
            </div>
            <p>This code expires in <strong>15 minutes</strong>.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Rare Store. All rights reserved.</p>
        </div>
    </div>
</body>
</html>