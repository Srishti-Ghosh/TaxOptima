import { api } from '../services/api';

describe('API Integration', () => {
  test('API endpoints are accessible', async () => {
    const endpoints = ['/auth/status', '/upload', '/documents'];
    
    for (const endpoint of endpoints) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`);
      expect(response.status).not.toBe(404);
    }
  });
}); 