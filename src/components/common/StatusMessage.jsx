import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusMessage = ({ type = 'info', message, onDismiss, persistent = false }) => {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const styles = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  };

  const Icon = icons[type] || Info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-lg border p-4 ${styles[type]} flex items-start gap-3`}
      >
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && !persistent && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusMessage;

