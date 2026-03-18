import React, { useState } from 'react';

export default function LoginPage({ onLogin, onBack, onRegister, showNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Password reset states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState('email'); // 'email', 'verify', 'newPassword'
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // API URL - matches your Laravel backend
  const API_URL = 'http://127.0.0.1:8000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validation
    if (!email || !password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password 
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          showNotification(firstError, 'error');
        } else {
          showNotification(data.message || 'Login failed', 'error');
        }
        setLoading(false);
        return;
      }

      // Login successful
      if (data.success) {
        // Store token
        localStorage.setItem('authToken', data.token);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // IMPORTANT: Check and store admin status
        const isAdmin = data.isAdmin === true || data.user?.role === 'admin';
        if (isAdmin) {
          localStorage.setItem('isAdmin', 'true');
          console.log('Admin user detected');
        } else {
          localStorage.removeItem('isAdmin');
          console.log('Regular user detected');
        }
        
        showNotification(data.message || 'Login successful!', 'success');
        
        // Pass user data and admin status to parent
        onLogin({
          ...data.user,
          isAdmin: isAdmin
        }, data.token);
      } else {
        showNotification('Login failed', 'error');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Connection error. Please check your network and try again.', 'error');
      setLoading(false);
    }
  };

  // Password Reset Functions
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setResetStep('email');
    setResetEmail(email); // Pre-fill with login email if available
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetStep('email');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      showNotification('Please enter your email address', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification(data.message || 'Failed to send reset code', 'error');
        setLoading(false);
        return;
      }

      // Success - code sent to email
      showNotification('Reset code sent to your email! Please check your inbox.', 'success');
      
      setResetStep('verify');
      setLoading(false);

    } catch (error) {
      console.error('Send reset code error:', error);
      showNotification('Connection error. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!resetCode) {
      showNotification('Please enter the verification code', 'error');
      return;
    }

    if (resetCode.length !== 6) {
      showNotification('Please enter a valid 6-digit code', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ 
          email: resetEmail.trim(), 
          code: resetCode 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification(data.message || 'Invalid verification code', 'error');
        setLoading(false);
        return;
      }

      showNotification('Code verified successfully!', 'success');
      setResetStep('newPassword');
      setLoading(false);

    } catch (error) {
      console.error('Verify code error:', error);
      showNotification('Connection error. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword || !confirmPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ 
          email: resetEmail.trim(), 
          code: resetCode,
          password: newPassword,
          password_confirmation: confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification(data.message || 'Failed to reset password', 'error');
        setLoading(false);
        return;
      }

      showNotification('Password reset successfully! You can now login with your new password.', 'success');
      
      // Reset states and go back to login
      handleBackToLogin();
      
      // Fill in the email for convenience
      setEmail(resetEmail);
      
      setLoading(false);

    } catch (error) {
      console.error('Reset password error:', error);
      showNotification('Connection error. Please try again.', 'error');
      setLoading(false);
    }
  };

  // Render forgot password UI
  const renderForgotPassword = () => {
    return (
      <div>
        <button 
          onClick={handleBackToLogin} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#6b7280', 
            fontSize: '14px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            marginBottom: '32px' 
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Login
        </button>

        <div style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '0.5em', color: '#1e293b', marginBottom: '48px' }}>RARE STORE</div>
        
        <h1 style={{ fontSize: '36px', fontWeight: 300, color: '#1e293b', marginBottom: '16px', lineHeight: 1.2 }}>
          {resetStep === 'email' && 'Forgot Password'}
          {resetStep === 'verify' && 'Verify Code'}
          {resetStep === 'newPassword' && 'Reset Password'}
        </h1>
        
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '48px', paddingBottom: '16px', borderBottom: '1px solid #d1d5db', textAlign: 'center' }}>
          {resetStep === 'email' && 'Enter your email to receive a verification code'}
          {resetStep === 'verify' && `Enter the 6-digit code sent to ${resetEmail}`}
          {resetStep === 'newPassword' && 'Create your new password'}
        </p>

        <form onSubmit={
          resetStep === 'email' ? handleSendResetCode :
          resetStep === 'verify' ? handleVerifyCode :
          handleResetPassword
        } style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {resetStep === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="reset-email" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Email Address</label>
              <input
                type="email"
                id="reset-email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ 
                  padding: '16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px', 
                  fontSize: '16px', 
                  background: '#fff', 
                  color: '#1e293b' 
                }}
              />
            </div>
          )}

          {resetStep === 'verify' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="reset-code" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Verification Code</label>
              <input
                type="text"
                id="reset-code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength="6"
                style={{ 
                  padding: '16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px', 
                  fontSize: '16px', 
                  background: '#fff', 
                  color: '#1e293b',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  fontWeight: 'bold'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handleSendResetCode}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#7f1d1d',
                    fontSize: '14px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Resend Code
                </button>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  Check your email inbox
                </span>
              </div>
            </div>
          )}

          {resetStep === 'newPassword' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                <label htmlFor="new-password" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>New Password</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{ 
                    padding: '16px', 
                    paddingRight: '50px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px', 
                    fontSize: '16px', 
                    background: '#fff', 
                    color: '#1e293b' 
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.6 }}
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                <label htmlFor="confirm-password" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{ 
                    padding: '16px', 
                    paddingRight: '50px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px', 
                    fontSize: '16px', 
                    background: '#fff', 
                    color: '#1e293b' 
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.6 }}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '-8px' }}>
                Password must be at least 6 characters
              </p>
            </>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              background: '#7f1d1d', 
              color: '#fff', 
              border: 'none', 
              padding: '16px 32px', 
              fontSize: '16px', 
              fontWeight: 600, 
              borderRadius: '50px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              marginTop: '24px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : 
              resetStep === 'email' ? 'Send Reset Code' :
              resetStep === 'verify' ? 'Verify Code' :
              'Reset Password'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: '#fff', color: '#1e293b' }}>
        <div style={{ width: '100%', maxWidth: '480px', animation: 'fadeIn 0.6s ease-out' }}>
          
          {showForgotPassword ? renderForgotPassword() : (
            <>
              <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back to Store
              </button>
              
              <div style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '0.5em', color: '#1e293b', marginBottom: '48px' }}>RARE STORE</div>
              
              <h1 style={{ fontSize: '36px', fontWeight: 300, color: '#1e293b', marginBottom: '16px', lineHeight: 1.2 }}>Welcome Back To RARE STORE</h1>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '48px', paddingBottom: '16px', borderBottom: '1px solid #d1d5db', textAlign: 'center' }}>Authentication</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{ 
                      padding: '16px', 
                      border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`, 
                      borderRadius: '4px', 
                      fontSize: '16px', 
                      background: '#fff', 
                      color: '#1e293b' 
                    }}
                  />
                  {errors.email && (
                    <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email[0]}</span>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                  <label htmlFor="password" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ 
                      padding: '16px', 
                      paddingRight: '50px', 
                      border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`, 
                      borderRadius: '4px', 
                      fontSize: '16px', 
                      background: '#fff', 
                      color: '#1e293b' 
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.6 }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                  {errors.password && (
                    <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.password[0]}</span>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{ 
                    alignSelf: 'flex-start', 
                    fontSize: '14px', 
                    color: '#7f1d1d', 
                    textDecoration: 'underline', 
                    marginTop: '-8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Forgot Password?
                </button>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{ 
                    background: '#7f1d1d', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '16px 32px', 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    borderRadius: '50px', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    marginTop: '24px',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onRegister}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#7f1d1d',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      padding: 0,
                      fontSize: '14px'
                    }}
                  >
                    Create new account
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
      
      <div style={{ position: 'relative', backgroundImage: 'url(https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&h=1600&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.7), rgba(0, 0, 0, 0.6))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', padding: '48px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 300, letterSpacing: '0.2em', marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Luxury Fashion</h2>
          <p style={{ fontSize: '20px', color: '#d1d5db', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Discover exclusive designer collections</p>
        </div>
      </div>
    </div>
  );
}