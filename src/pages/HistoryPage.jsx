import { useState, useRef } from 'react';
import { useHistory } from '../context/HistoryContext';
import Dashboard from '../components/dashboard/Dashboard';
import { History, Clock, Trash2, Eye, X, Menu } from 'lucide-react';

const HistoryPage = () => {
  const { history, clearHistory, removeFromHistory } = useHistory();
  const [selectedResult, setSelectedResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const resultsRef = useRef(null);

  const viewHistoryItem = (item) => {
    setSelectedResult(item);
    setSidebarOpen(false); // Close sidebar on mobile when selecting
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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-20 lg:pb-8">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-30 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 py-3 sm:py-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <History className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Analysis History
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                {history.length} {history.length === 1 ? 'analysis' : 'analyses'} saved
              </p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Clear all history"
            >
              <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline ml-2 text-sm font-medium">Clear</span>
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 sm:py-16 md:py-20 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 sm:mb-6">
            <History className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
            No history yet
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4 max-w-md mx-auto">
            Go to the Analyze page to get started with your first analysis!
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Mobile: History List as Cards */}
          <div className="lg:hidden space-y-3">
            {[...history].reverse().map((item, index) => (
              <div
                key={item.id}
                className={`card p-4 transition-all duration-200 ${
                  selectedResult?.id === item.id
                    ? 'ring-2 ring-teal-500 dark:ring-teal-400 bg-teal-50 dark:bg-teal-900/20'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-semibold flex-shrink-0">
                      {history.length - index}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        Analysis #{history.length - index}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => viewHistoryItem(item)}
                      className={`p-2 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        selectedResult?.id === item.id
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      aria-label="View analysis"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Delete analysis"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>{item.textCount || item.results?.length || 0} text{(item.textCount || item.results?.length || 0) > 1 ? 's' : ''}</span>
                  {item.fileNames && item.fileNames.length > 0 && (
                    <span className="truncate">{item.fileNames[0]}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Sidebar Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4 md:gap-6">
            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-4 sm:p-5 sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  History ({history.length})
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {[...history].reverse().map((item, index) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-3 sm:p-4 transition-all duration-200 cursor-pointer touch-manipulation ${
                        selectedResult?.id === item.id
                          ? 'border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => viewHistoryItem(item)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold flex-shrink-0">
                              {history.length - index}
                            </span>
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              Analysis #{history.length - index}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.textCount || item.results?.length || 0} text{(item.textCount || item.results?.length || 0) > 1 ? 's' : ''}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex-shrink-0 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Delete"
                          aria-label="Delete analysis"
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
                <div className="card p-8 sm:p-12 text-center fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <Eye className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Select an analysis
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    Choose an analysis from the history to view detailed results
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Selected Result Display */}
          {selectedResult && (
            <div className="lg:hidden fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Analysis Details</h2>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div ref={resultsRef}>
                <Dashboard 
                  analysisResults={selectedResult.results || []} 
                  timingData={selectedResult.timing}
                  fileNames={selectedResult.fileNames || []}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
