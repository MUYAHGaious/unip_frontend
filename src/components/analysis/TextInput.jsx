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
      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Enter text to analyze
      </label>
      <textarea
        value={text}
        onChange={handleChange}
        className="input-field h-28 sm:h-32 md:h-36 resize-none"
        placeholder="Paste or type your text here..."
        disabled={disabled}
        maxLength={MAX_TEXT_LENGTH}
      />
      <div className="mt-2 flex flex-col xs:flex-row justify-between gap-1 xs:gap-0 text-xs text-gray-500 dark:text-gray-400">
        <span>{error && <span className="text-red-600 dark:text-red-400">{error}</span>}</span>
        <span>{text.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()} characters</span>
      </div>
      <div className="mt-3 sm:mt-4 flex justify-end">
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="btn-primary w-full sm:w-auto"
        >
          Analyze Text
        </button>
      </div>
    </form>
  );
};

export default TextInput;
