import { useState, useRef } from 'react';
import { analyzeFile } from '../../services/api';
import { formatFileSize } from '../../utils/helpers';
import { MAX_FILE_SIZE, FILE_TYPES } from '../../utils/constants';
import { validateFileType, validateFileSize, sanitizeInput } from '../../utils/security';

const FileUpload = ({ onAnalyze, disabled }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');

    if (!selectedFile) return;

    // Validate file type
    if (!validateFileType(selectedFile.name, Object.values(FILE_TYPES))) {
      setError(`Unsupported file type. Supported: ${Object.values(FILE_TYPES).join(', ')}`);
      return;
    }

    // Validate file size
    if (!validateFileSize(selectedFile.size, MAX_FILE_SIZE)) {
      setError(`File too large. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    // Additional security: Check file name for dangerous patterns
    const sanitizedFilename = sanitizeInput(selectedFile.name);
    if (sanitizedFilename !== selectedFile.name) {
      setError('Invalid file name. Please rename the file.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const result = await analyzeFile(file);
      onAnalyze(result.results);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload file to analyze
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.csv,.pdf"
        onChange={handleFileChange}
        disabled={disabled || loading}
        className="input-field"
        multiple={false}
      />
      {file && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {sanitizeInput(file.name)} ({formatFileSize(file.size)})
        </div>
      )}
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={disabled || !file || loading}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze File'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
