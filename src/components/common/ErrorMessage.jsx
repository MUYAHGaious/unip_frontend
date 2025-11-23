import { sanitizeInput } from '../../utils/security';

const ErrorMessage = ({ message, onDismiss }) => {
  // Sanitize error message to prevent XSS
  const sanitizedMessage = sanitizeInput(message || 'An error occurred');

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
      <span>{sanitizedMessage}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-700 hover:text-red-900"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
