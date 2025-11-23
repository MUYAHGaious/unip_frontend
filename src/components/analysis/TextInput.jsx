import { useState } from 'react';
import { validateTextLength, sanitizeInput } from '../../utils/security';
import { MAX_TEXT_LENGTH } from '../../utils/constants';

const TextInput = ({ onAnalyze, disabled }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Validate length
    if (!validateTextLength(inputValue, MAX_TEXT_LENGTH)) {
      setError(`Text too long. Maximum ${MAX_TEXT_LENGTH.toLocaleString()} characters allowed.`);
      return;
    }

    setError('');
    setText(inputValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }

    // Sanitize before sending
    const sanitizedText = sanitizeInput(text.trim());

    if (!sanitizedText) {
      setError('Invalid text input.');
      return;
    }

    onAnalyze([sanitizedText]);
    setText('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enter text to analyze
      </label>
      <textarea
        value={text}
        onChange={handleChange}
        className="input-field h-32 resize-none"
        placeholder="Paste or type your text here..."
        disabled={disabled}
        maxLength={MAX_TEXT_LENGTH}
      />
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>{error && <span className="text-red-600">{error}</span>}</span>
        <span>{text.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()} characters</span>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="btn-primary"
        >
          Analyze Text
        </button>
      </div>
    </form>
  );
};

export default TextInput;
