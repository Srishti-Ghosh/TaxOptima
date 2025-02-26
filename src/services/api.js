import { encryptData } from '../utils/encryption';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const api = {
  login: async (credentials) => {
    const encryptedPassword = await encryptData(credentials.password);
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...credentials,
        password: encryptedPassword,
      }),
    }).then(handleResponse);
  },

  uploadDocuments: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then(handleResponse);
  },

  // Add other API endpoints
}; 