import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../utils/encryption';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
  });
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    try {
      // Encrypt sensitive data before transmission
      const encryptedPassword = await encryptData(formData.password);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          email: formData.email,
          password: encryptedPassword,
          twoFactorCode: formData.twoFactorCode
        }),
        credentials: 'include' // For secure cookie handling
      });

      const data = await response.json();

      if (data.requiresTwoFactor) {
        setShowTwoFactor(true);
        return;
      }

      if (data.success) {
        onLogin(data.token);
        navigate('/dashboard');
      } else {
        setLoginAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= 3) {
            setIsLocked(true);
            setTimeout(() => {
              setIsLocked(false);
              setLoginAttempts(0);
            }, 900000); // 15 minutes lockout
          }
          return newAttempts;
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Secure Login</h2>
        {isLocked ? (
          <div className="error-message">
            Account temporarily locked. Please try again in 15 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                title="Password must be at least 8 characters long and include letters, numbers, and special characters"
              />
            </div>
            {showTwoFactor && (
              <div className="form-group">
                <label htmlFor="twoFactorCode">2FA Code</label>
                <input
                  type="text"
                  id="twoFactorCode"
                  name="twoFactorCode"
                  value={formData.twoFactorCode}
                  onChange={handleChange}
                  required
                  pattern="\d{6}"
                  title="Please enter the 6-digit code"
                />
              </div>
            )}
            <button type="submit">Log In</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage; 