import { validateEmail, validatePassword, validateFile } from '../utils/validation';

describe('Form Validation', () => {
  test('email validation', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });

  test('password validation', () => {
    expect(validatePassword('ValidPass123!')).toBe(true);
    expect(validatePassword('weak')).toBe(false);
  });

  test('file validation', () => {
    const validFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const invalidFile = new File([''], 'test.exe', { type: 'application/x-msdownload' });
    
    expect(validateFile(validFile)).toBe(true);
    expect(validateFile(invalidFile)).toBe(false);
  });
}); 