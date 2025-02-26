import { generateTOTP, verifyTOTP } from '../utils/mfa';
import { sendSMS, sendEmail } from '../utils/notifications';

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.requiresMFA) {
        // Generate and send MFA code
        const { secret, token } = generateTOTP();
        
        // Store secret temporarily
        sessionStorage.setItem('mfa_secret', secret);
        
        // Send token via preferred method
        if (data.mfaPreference === 'sms') {
          await sendSMS(data.phoneNumber, token);
        } else {
          await sendEmail(email, token);
        }
        
        return { requiresMFA: true };
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async verifyMFA(token) {
    const secret = sessionStorage.getItem('mfa_secret');
    
    if (!secret) {
      throw new Error('MFA session expired');
    }

    try {
      const isValid = verifyTOTP(token, secret);
      
      if (!isValid) {
        throw new Error('Invalid MFA token');
      }

      // Clear temporary secret
      sessionStorage.removeItem('mfa_secret');

      // Complete authentication
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      return response.json();
    } catch (error) {
      console.error('MFA verification error:', error);
      throw error;
    }
  }
}

export default new AuthService(); 