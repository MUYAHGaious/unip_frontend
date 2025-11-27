import { Activity, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Loading = ({ message = 'Loading...', subMessage = null, currentTask = null, completedTasks = [], totalTasks = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative mb-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 dark:border-teal-900 border-t-teal-600 dark:border-t-teal-400"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="h-6 w-6 text-teal-600 dark:text-teal-400 animate-pulse" />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{message}</p>
        {subMessage && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{subMessage}</p>
        )}
      </motion.div>

      {/* Task Progress */}
      {totalTasks > 0 && (
        <div className="w-full max-w-md mt-4 space-y-2">
          {completedTasks.map((task, idx) => (
            <motion.div
              key={task}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{task}</span>
            </motion.div>
          ))}
          {currentTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{currentTask}</span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Loading;
