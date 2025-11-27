import { useState, useRef } from 'react';
import { formatFileSize } from '../../utils/helpers';
import { MAX_FILE_SIZE, FILE_TYPES } from '../../utils/constants';
import { validateFileType, validateFileSize, sanitizeInput } from '../../utils/security';
import { X, FileText, Upload } from 'lucide-react';

const FileUpload = ({ onAnalyze, disabled }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError('');

    if (selectedFiles.length === 0) return;

    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
    // Validate file type
      if (!validateFileType(file.name, Object.values(FILE_TYPES))) {
        errors.push(`${file.name}: Unsupported file type`);
      return;
    }

    // Validate file size
      if (!validateFileSize(file.size, MAX_FILE_SIZE)) {
        errors.push(`${file.name}: File too large (max ${formatFileSize(MAX_FILE_SIZE)})`);
      return;
    }

    // Additional security: Check file name for dangerous patterns
      const sanitizedFilename = sanitizeInput(file.name);
      if (sanitizedFilename !== file.name) {
        errors.push(`${file.name}: Invalid file name`);
      return;
    }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join('; '));
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      await onAnalyze(files);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze files. Please try again.');
    }
  };

  return (
    <div className="card">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Upload files to analyze (multiple files supported)
      </label>
      <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.csv,.pdf,.md,.srt"
        onChange={handleFileChange}
        disabled={disabled}
        className="input-field"
        multiple={true}
      />
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Supported formats: .txt, .csv, .pdf, .md, .srt • Max {formatFileSize(MAX_FILE_SIZE)} per file
      </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-3 sm:mt-4 space-y-2">
          <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected Files ({files.length}):
          </div>
          <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto scrollbar-thin">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">
                    {sanitizeInput(file.name)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-auto">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="ml-2 p-1.5 sm:p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</div>
      )}
      
      <div className="mt-3 sm:mt-4 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={disabled || files.length === 0}
          className="btn-primary flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center"
        >
          <Upload className="h-4 w-4 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {files.length > 0 ? `Analyze ${files.length} File${files.length > 1 ? 's' : ''}` : 'Analyze Files'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
