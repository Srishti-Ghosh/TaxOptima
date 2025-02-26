import { render, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../components/LoginPage';
import { AuthProvider } from '../context/AuthContext';

describe('Authentication Flow', () => {
  test('login with valid credentials', async () => {
    const { getByLabelText, getByText } = render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: 'ValidPass123!' },
    });
    fireEvent.click(getByText(/log in/i));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
}); 