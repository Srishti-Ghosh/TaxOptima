import React, { useState } from 'react';
import { validateFileType, sanitizeFileName } from '../utils/security';
import ChatBot from './ChatBot';
import './Dashboard.css';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    try {
      const uploadedFiles = Array.from(e.target.files);
      
      // Validate each file
      for (const file of uploadedFiles) {
        if (!validateFileType(file)) {
          throw new Error(`Invalid file type: ${file.name}`);
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error(`File too large: ${file.name}`);
        }
      }

      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('files', file, sanitizeFileName(file.name));
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setFiles(prev => [...prev, ...uploadedFiles]);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {error && <div className="error-message">{error}</div>}
      <div className="upload-section">
        <div className="upload-box">
          <h2>Upload Documents</h2>
          <div className="upload-area">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              className="file-input"
            />
            <label htmlFor="file-upload" className="upload-label">
              Drop files here or click to upload
            </label>
          </div>
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                {file.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="chat-section">
        <ChatBot />
      </div>
    </div>
  );
};

export default Dashboard; 