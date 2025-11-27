import { useState, useRef } from 'react';
import { useHistory } from '../context/HistoryContext';
import Dashboard from '../components/dashboard/Dashboard';
import { History, Clock, Trash2, Eye } from 'lucide-react';

const HistoryPage = () => {
  const { history, clearHistory, removeFromHistory } = useHistory();
  const [selectedResult, setSelectedResult] = useState(null);
  const resultsRef = useRef(null);

  const viewHistoryItem = (item) => {
    setSelectedResult(item);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      clearHistory();
      setSelectedResult(null);
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      removeFromHistory(id);
      if (selectedResult?.id === id) {
        setSelectedResult(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <History className="h-10 w-10 text-teal-600 dark:text-teal-400" />
            Analysis History
          </h1>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <History className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No analysis history yet. Go to the Analyze page to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* History List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  History ({history.length})
                </h2>
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {[...history].reverse().map((item, index) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                        selectedResult?.id === item.id
                          ? 'border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => viewHistoryItem(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                              {history.length - index}
                            </span>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              Analysis #{history.length - index}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                            <span>{item.textCount || item.results?.length || 0} text{(item.textCount || item.results?.length || 0) > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex-shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Result Display */}
            <div className="lg:col-span-2">
              {selectedResult ? (
                <div ref={resultsRef} className="fade-in-up">
                  <Dashboard 
                    analysisResults={selectedResult.results || []} 
                    timingData={selectedResult.timing}
                    fileNames={selectedResult.fileNames || []}
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <Eye className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    Select an analysis from the history to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

