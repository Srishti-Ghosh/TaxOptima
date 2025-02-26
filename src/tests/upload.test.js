import { render, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('File Upload', () => {
  test('successful file upload', async () => {
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const { getByLabelText, getByText } = render(<Dashboard />);
    
    const input = getByLabelText(/upload/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(getByText('File uploaded successfully')).toBeInTheDocument();
    });
  });
}); 