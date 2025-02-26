import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import MFAVerification from './MFAVerification';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showMFA, setShowMFA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      if (response.requiresMFA) {
        setShowMFA(true);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerification = async (token) => {
    setError('');
    setLoading(true);

    try {
      await authService.verifyMFA(token);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid MFA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {!showMFA ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      ) : (
        <MFAVerification
          onVerify={handleMFAVerification}
          onCancel={() => setShowMFA(false)}
          error={error}
          loading={loading}
        />
      )}
    </div>
  );
};

export default LoginPage; 