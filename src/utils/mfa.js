import * as OTPAuth from 'otpauth';
import { encryptData, decryptData } from './encryption';

export const generateTOTP = () => {
  // Generate random secret
  const secret = OTPAuth.Secret.random();
  
  // Create TOTP object
  const totp = new OTPAuth.TOTP({
    secret: secret,
    algorithm: 'SHA1',
    digits: 6,
    period: 30
  });

  // Generate current token
  const token = totp.generate();

  return { secret: secret.base32, token };
};

export const verifyTOTP = (token, secret) => {
  const totp = new OTPAuth.TOTP({
    secret: secret,
    algorithm: 'SHA1',
    digits: 6,
    period: 30
  });

  // Verify token with ±1 period window
  const delta = totp.validate({ token, window: 1 });
  
  return delta !== null;
};

export const setupMFA = async (userId, method) => {
  const { secret } = generateTOTP();
  
  // Encrypt secret before storage
  const encryptedSecret = encryptData(secret);
  
  await fetch('/api/auth/mfa/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      secret: encryptedSecret,
      method
    })
  });

  return secret;
}; 