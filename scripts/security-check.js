const axios = require('axios');
const crypto = require('crypto');

async function runSecurityChecks() {
  // CSRF Protection Check
  const csrfCheck = async () => {
    try {
      await axios.post('/api/auth/login', {}, { withCredentials: false });
      console.error('❌ CSRF protection failed');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ CSRF protection working');
      }
    }
  };

  // Session Management Check
  const sessionCheck = async () => {
    const res1 = await axios.get('/api/auth/status');
    const res2 = await axios.get('/api/auth/status');
    if (res1.headers['set-cookie'] === res2.headers['set-cookie']) {
      console.error('❌ Session tokens are static');
    } else {
      console.log('✅ Session management working');
    }
  };

  // Encryption Check
  const encryptionCheck = () => {
    const testData = 'test';
    const encrypted = encryptData(testData);
    const decrypted = decryptData(encrypted);
    
    if (testData === decrypted) {
      console.log('✅ Encryption working');
    } else {
      console.error('❌ Encryption failed');
    }
  };

  await csrfCheck();
  await sessionCheck();
  encryptionCheck();
}

runSecurityChecks(); 