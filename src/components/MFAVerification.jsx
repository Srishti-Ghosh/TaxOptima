import React, { useState, useEffect } from 'react';
import './MFAVerification.css';

const MFAVerification = ({ onVerify, onCancel, error, loading }) => {
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(token);
  };

  return (
    <div className="mfa-container">
      <h2>Two-Factor Authentication</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="mfa-form">
        <div className="form-group">
          <label htmlFor="token">Enter Verification Code</label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            maxLength="6"
            pattern="\d{6}"
            required
          />
        </div>

        <div className="timer">Code expires in: {timeLeft}s</div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MFAVerification; 