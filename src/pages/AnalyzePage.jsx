import { useState, useRef } from 'react';
import { analyzeTexts } from '../services/api';
import TextInput from '../components/analysis/TextInput';
import FileUpload from '../components/analysis/FileUpload';
import ResultsDisplay from '../components/analysis/ResultsDisplay';
import Dashboard from '../components/dashboard/Dashboard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { History, X, Clock } from 'lucide-react';

const AnalyzePage = () => {
  const [currentResults, setCurrentResults] = useState(null);
  const [resultsHistory, setResultsHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const resultsRef = useRef(null);

  const handleAnalyze = async (texts) => {
    setLoading(true);
    setError('');
    setProgress({ stage: 'Initializing', percent: 10 });

    try {
      setProgress({ stage: 'Sending to NLP engine', percent: 30 });
      const response = await analyzeTexts(texts);

      setProgress({ stage: 'Processing results', percent: 70 });

      // Set as current results
      const newResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        results: response.results,
        textCount: texts.length
      };

      setCurrentResults(newResult);

      // Add to history
      setResultsHistory(prev => [...prev, newResult]);

      setProgress({ stage: 'Complete!', percent: 100 });

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err) {
      setError(err.message || 'Failed to analyze text');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(null);
      }, 500);
    }
  };

  const handleFileResults = (fileResults) => {
    const newResult = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      results: fileResults,
      textCount: fileResults.length
    };

    setCurrentResults(newResult);
    setResultsHistory(prev => [...prev, newResult]);
    setError('');

    // Auto-scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const clearHistory = () => {
    setResultsHistory([]);
    setShowHistory(false);
  };

  const viewHistoryItem = (item) => {
    setCurrentResults(item);
    setShowHistory(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Text Analysis</h1>
        {resultsHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2
                     bg-teal-100 dark:bg-teal-900/30
                     text-teal-700 dark:text-teal-300
                     rounded-lg hover:bg-teal-200 dark:hover:bg-teal-900/50
                     transition-all duration-200"
          >
            <History className="h-4 w-4" />
            History ({resultsHistory.length})
          </button>
        )}
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      {/* Input Section */}
      <div className="max-w-4xl mx-auto space-y-6 mb-8">
        <TextInput onAnalyze={handleAnalyze} disabled={loading} />
        <div className="text-center text-gray-500 dark:text-gray-400">OR</div>
        <FileUpload onAnalyze={handleFileResults} disabled={loading} />
      </div>

      {/* Loading with Progress */}
      {loading && progress && (
        <div className="max-w-2xl mx-auto mb-8">
          <Loading message={progress.stage} />
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-teal-600 dark:bg-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out progress-bar"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{progress.percent}%</p>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <History className="h-6 w-6" />
                Analysis History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] scrollbar-thin">
              {resultsHistory.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No history yet</p>
              ) : (
                <div className="space-y-3">
                  {[...resultsHistory].reverse().map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => viewHistoryItem(item)}
                      className="w-full text-left border border-gray-200 dark:border-gray-700
                               rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50
                               transition-all duration-200 hover-lift"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6
                                         rounded-full bg-teal-100 dark:bg-teal-900/30
                                         text-teal-700 dark:text-teal-300 text-xs font-semibold">
                              {resultsHistory.length - index}
                            </span>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              Analysis #{resultsHistory.length - index}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                            <span>{item.textCount} text{item.textCount > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="text-teal-600 dark:text-teal-400 text-sm font-medium">
                          View →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {resultsHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="mt-6 w-full px-4 py-2 text-red-600 dark:text-red-400
                           hover:bg-red-50 dark:hover:bg-red-900/20
                           rounded-lg transition-colors text-sm font-medium"
                >
                  Clear All History
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Results */}
      {currentResults && !loading && (
        <div ref={resultsRef} className="space-y-8 fade-in-up">
          {/* Dashboard */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Analytics Overview
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(currentResults.timestamp).toLocaleString()}
              </span>
            </div>
            <Dashboard analysisResults={currentResults.results} />
          </div>

          {/* Detailed Results */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Detailed Results
            </h2>
            <ResultsDisplay results={currentResults.results} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentResults && !loading && (
        <div className="text-center py-16 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16
                        bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <History className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No analysis yet. Upload a file or enter text to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
