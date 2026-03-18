import React, { useState } from 'react';

export default function RegisterPage({ onRegister, onBack, onLogin, showNotification }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    stylePreference: '',
    favoriteColors: [],
    size: '',
    interests: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // API URL - Change this to your Laravel backend URL
  const API_URL = 'http://127.0.0.1:8000/api';

  const styleOptions = ['Classic', 'Modern', 'Bohemian', 'Minimalist', 'Vintage', 'Streetwear'];
  const colorOptions = ['Black', 'White', 'Beige', 'Navy', 'Red', 'Pink', 'Green', 'Blue'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const interestOptions = ['Dresses', 'Jackets', 'Tops', 'Accessories', 'Shoes', 'Jewelry'];

  const handleColorToggle = (color) => {
    if (formData.favoriteColors.includes(color)) {
      setFormData({
        ...formData,
        favoriteColors: formData.favoriteColors.filter(c => c !== color)
      });
    } else {
      if (formData.favoriteColors.length < 3) {
        setFormData({
          ...formData,
          favoriteColors: [...formData.favoriteColors, color]
        });
      } else {
        showNotification('You can select up to 3 colors', 'info');
      }
    }
  };

  const handleInterestToggle = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare preferences as JSON object
      const preferences = {
        stylePreference: formData.stylePreference,
        favoriteColors: formData.favoriteColors,
        size: formData.size,
        interests: formData.interests
      };

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          preferences: preferences // Send as a single JSON object
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        showNotification(`Welcome to RARE STORE, ${data.user.name}!`, 'success');
        
        // ✅ CORRECTION: Call onRegister with user object from API
        onRegister(data.user);
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          showNotification(errorMessages, 'error');
        } else {
          showNotification(data.message || 'Registration failed', 'error');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      showNotification('Connection error. Please check if the backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* Left Side - Form */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '48px 24px', 
        background: '#fff', 
        color: '#1e293b',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '480px', animation: 'fadeIn 0.6s ease-out' }}>
          {/* Back Button */}
          <button 
            onClick={onBack} 
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
            Back to Store
          </button>
          
          {/* Logo */}
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 300, 
            letterSpacing: '0.5em', 
            color: '#1e293b', 
            marginBottom: '48px' 
          }}>
            RARE STORE
          </div>
          
          {/* Header */}
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 300, 
            color: '#1e293b', 
            marginBottom: '16px', 
            lineHeight: 1.2 
          }}>
            Create Your Account
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '48px', 
            paddingBottom: '16px', 
            borderBottom: '1px solid #d1d5db', 
            textAlign: 'center' 
          }}>
            Join Our Exclusive Community
          </p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="name" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                disabled={isLoading}
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

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                disabled={isLoading}
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
            
            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label htmlFor="password" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password (min. 6 characters)"
                disabled={isLoading}
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
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '42px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '18px', 
                  opacity: 0.6 
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Confirm Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label htmlFor="confirmPassword" style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                Confirm Password *
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                disabled={isLoading}
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
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '42px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '18px', 
                  opacity: 0.6 
                }}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Divider */}
            <div style={{ 
              borderTop: '1px solid #d1d5db', 
              marginTop: '16px', 
              paddingTop: '24px' 
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                marginBottom: '24px', 
                color: '#1e293b' 
              }}>
                Tell us about your style (Optional)
              </h3>
            </div>

            {/* Style Preference */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                marginBottom: '12px', 
                color: '#1e293b' 
              }}>
                Style Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {styleOptions.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, stylePreference: style })}
                    disabled={isLoading}
                    style={{
                      padding: '12px',
                      background: formData.stylePreference === style ? '#7f1d1d' : '#fff',
                      border: `1px solid ${formData.stylePreference === style ? '#7f1d1d' : '#d1d5db'}`,
                      borderRadius: '4px',
                      color: formData.stylePreference === style ? '#fff' : '#1e293b',
                      fontSize: '14px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.5 : 1
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Favorite Colors */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                marginBottom: '8px', 
                color: '#1e293b' 
              }}>
                Favorite Colors <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '12px' }}>(Select up to 3)</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    disabled={isLoading}
                    style={{
                      padding: '12px',
                      background: formData.favoriteColors.includes(color) ? '#7f1d1d' : '#fff',
                      border: `1px solid ${formData.favoriteColors.includes(color) ? '#7f1d1d' : '#d1d5db'}`,
                      borderRadius: '4px',
                      color: formData.favoriteColors.includes(color) ? '#fff' : '#1e293b',
                      fontSize: '14px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.5 : 1
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                marginBottom: '12px', 
                color: '#1e293b' 
              }}>
                Usual Size
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                {sizeOptions.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData({ ...formData, size })}
                    disabled={isLoading}
                    style={{
                      padding: '12px',
                      background: formData.size === size ? '#7f1d1d' : '#fff',
                      border: `1px solid ${formData.size === size ? '#7f1d1d' : '#d1d5db'}`,
                      borderRadius: '4px',
                      color: formData.size === size ? '#fff' : '#1e293b',
                      fontSize: '14px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.5 : 1
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Shopping Interests */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                marginBottom: '12px', 
                color: '#1e293b' 
              }}>
                Shopping Interests
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    disabled={isLoading}
                    style={{
                      padding: '12px',
                      background: formData.interests.includes(interest) ? '#7f1d1d' : '#fff',
                      border: `1px solid ${formData.interests.includes(interest) ? '#7f1d1d' : '#d1d5db'}`,
                      borderRadius: '4px',
                      color: formData.interests.includes(interest) ? '#fff' : '#1e293b',
                      fontSize: '14px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.5 : 1
                    }}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading} 
              style={{ 
                background: '#7f1d1d', 
                color: '#fff', 
                border: 'none', 
                padding: '16px 32px', 
                fontSize: '16px', 
                fontWeight: 600, 
                borderRadius: '50px', 
                cursor: isLoading ? 'not-allowed' : 'pointer', 
                marginTop: '24px',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            {/* Login Link */}
            <p style={{ 
              textAlign: 'center', 
              fontSize: '14px', 
              color: '#6b7280', 
              marginTop: '16px' 
            }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onLogin}
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
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div style={{ 
        position: 'relative', 
        backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1600&fit=crop)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.7), rgba(0, 0, 0, 0.6))' 
        }} />
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center', 
          color: '#fff', 
          padding: '48px' 
        }}>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: 300, 
            letterSpacing: '0.2em', 
            marginBottom: '16px', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)' 
          }}>
            Join RARE
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: '#d1d5db', 
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)' 
          }}>
            Curate your personal style journey
          </p>
        </div>
      </div>
    </div>
  );
}