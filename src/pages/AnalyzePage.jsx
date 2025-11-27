import { useState, useRef, useEffect } from 'react';
import { analyzeTexts, analyzeFile } from '../services/api';
import TextInput from '../components/analysis/TextInput';
import FileUpload from '../components/analysis/FileUpload';
import Dashboard from '../components/dashboard/Dashboard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import StatusMessage from '../components/common/StatusMessage';
import { useHistory } from '../context/HistoryContext';
import { History, X, Sparkles } from 'lucide-react';

const AnalyzePage = () => {
  // Load current results from localStorage on mount
  const [currentResults, setCurrentResults] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('currentAnalysisResult');
    if (saved) {
        return JSON.parse(saved);
        }
      }
    } catch (e) {
      console.error('Error loading saved results:', e);
    }
    return null;
  });
  const { addToHistory } = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);
  const [progressInterval, setProgressInterval] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [processingInfo, setProcessingInfo] = useState(null);
  const resultsRef = useRef(null);
  const loadingRef = useRef(null);

  // Persist current results to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
    if (currentResults) {
      localStorage.setItem('currentAnalysisResult', JSON.stringify(currentResults));
    } else {
      localStorage.removeItem('currentAnalysisResult');
        }
      }
    } catch (e) {
      console.error('Error saving results:', e);
    }
  }, [currentResults]);

  const handleAnalyze = async (texts) => {
    setLoading(true);
    setError('');
    setStatusMessage(null);
    setProcessingInfo(null);
    
    const textCount = texts.length;
    const tasks = ['sentiment', 'keywords', 'topics', 'summary'];
    let completedTasks = [];
    let currentTaskIndex = 0;
    
    // Initialize progress
    setProgress({ 
      stage: 'Initializing analysis...', 
      percent: 5,
      subMessage: `Preparing to analyze ${textCount} text${textCount > 1 ? 's' : ''}`,
      currentTask: null,
      completedTasks: [],
      totalTasks: tasks.length
    });

    // Auto-scroll to loading section
    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      // Stage 1: Connection
      setProgress({ 
        stage: 'Connecting to NLP engine...', 
        percent: 10,
        subMessage: 'Establishing connection to backend service',
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Stage 2: Health check
      setProgress({ 
        stage: 'Checking GPU service availability...', 
        percent: 15,
        subMessage: 'Verifying Colab GPU service status',
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Stage 3: Sending request
      setProgress({ 
        stage: 'Sending data to NLP engine', 
        percent: 20,
        subMessage: `Uploading ${textCount} text${textCount > 1 ? 's' : ''} for processing`,
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      
      const requestStartTime = Date.now();
      
      // Simulate progress updates during processing
      const progressSimulator = setInterval(() => {
        currentTaskIndex++;
        if (currentTaskIndex < tasks.length) {
          const task = tasks[currentTaskIndex];
          const taskNames = {
            sentiment: 'Analyzing Sentiment',
            keywords: 'Extracting Keywords',
            topics: 'Modeling Topics',
            summary: 'Generating Summaries'
          };
          
          completedTasks = tasks.slice(0, currentTaskIndex).map(t => taskNames[t]);
          const currentTask = taskNames[task];
          
          const basePercent = 25;
          const taskPercent = (currentTaskIndex / tasks.length) * 50;
          const textProgress = (1 / textCount) * 20;
          
          setProgress({ 
            stage: currentTask,
            percent: Math.min(95, basePercent + taskPercent),
            subMessage: `Processing ${textCount} text${textCount > 1 ? 's' : ''}...`,
            currentTask: currentTask,
            completedTasks: completedTasks,
            totalTasks: tasks.length
          });
        }
      }, 2000);
      
      setProgressInterval(progressSimulator);
      
      const response = await analyzeTexts(texts);
      const requestEndTime = Date.now();
      
      // Clear progress simulator
      if (progressSimulator) {
        clearInterval(progressSimulator);
        setProgressInterval(null);
      }
      
      // Mark all tasks as completed
      completedTasks = tasks.map(t => {
        const taskNames = {
          sentiment: 'Analyzing Sentiment',
          keywords: 'Extracting Keywords',
          topics: 'Modeling Topics',
          summary: 'Generating Summaries'
        };
        return taskNames[t];
      });
      
      setProgress({ 
        stage: 'Processing completed', 
        percent: 95,
        subMessage: 'Finalizing results...',
        currentTask: null,
        completedTasks: completedTasks,
        totalTasks: tasks.length
      });

      // Handle processing info
      if (response.processing_info) {
        setProcessingInfo(response.processing_info);
        
        if (response.processing_info.mode === 'colab') {
          setStatusMessage({
            type: 'success',
            message: '✓ Using GPU-accelerated processing (Colab) for faster and more accurate results'
          });
        } else if (response.processing_info.colab_failed) {
          setStatusMessage({
            type: 'warning',
            message: `⚠ ${response.processing_info.warnings?.[0] || 'Using local processing'}`
          });
        } else {
          setStatusMessage({
            type: 'info',
            message: 'ℹ Processing with local models'
          });
        }
      }

      // Set as current results with timing info
      const newResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        results: response.results,
        textCount: texts.length,
        processingInfo: response.processing_info,
        timing: {
          frontend: {
            request_start: requestStartTime,
            request_end: requestEndTime,
            total_duration: ((requestEndTime - requestStartTime) / 1000).toFixed(3)
          },
          backend: response.processing_info?.timing || null,
          ...(response.frontend_timing ? { frontend_timing: response.frontend_timing } : {})
        }
      };

      setCurrentResults(newResult);
      addToHistory(newResult);

      setProgress({ 
        stage: 'Analysis Complete!', 
        percent: 100,
        subMessage: `Successfully analyzed ${textCount} text${textCount > 1 ? 's' : ''}`,
        currentTask: null,
        completedTasks: completedTasks,
        totalTasks: tasks.length
      });

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err) {
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      setError(err.message || 'Failed to analyze text');
      setStatusMessage({
        type: 'error',
        message: `Error: ${err.message || 'Analysis failed. Please try again.'}`
      });
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      setTimeout(() => {
        setLoading(false);
        setProgress(null);
      }, 1000);
    }
  };

  const handleFileAnalyze = async (files) => {
    setLoading(true);
    setError('');
    setStatusMessage(null);
    setProcessingInfo(null);
    
    const fileArray = Array.isArray(files) ? files : [files];
    const tasks = ['sentiment', 'keywords', 'topics', 'summary'];
    let completedTasks = [];
    let currentTaskIndex = 0;
    
    setProgress({ 
      stage: 'Initializing file analysis...', 
      percent: 5,
      subMessage: `Preparing to analyze ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`,
      currentTask: null,
      completedTasks: [],
      totalTasks: tasks.length
    });

    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      setProgress({ 
        stage: 'Validating files...', 
        percent: 10,
        subMessage: `Checking ${fileArray.length} file${fileArray.length > 1 ? 's' : ''} format and size`,
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setProgress({ 
        stage: 'Parsing files...', 
        percent: 15,
        subMessage: `Extracting text from ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`,
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setProgress({ 
        stage: 'Connecting to NLP engine...', 
        percent: 20,
        subMessage: 'Establishing connection to backend service',
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setProgress({ 
        stage: 'Checking GPU service availability...', 
        percent: 25,
        subMessage: 'Verifying Colab GPU service status',
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setProgress({ 
        stage: 'Sending data to NLP engine', 
        percent: 30,
        subMessage: `Uploading content from ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`,
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      
      const requestStartTime = Date.now();
      
      const progressSimulator = setInterval(() => {
        currentTaskIndex++;
        if (currentTaskIndex < tasks.length) {
          const task = tasks[currentTaskIndex];
          const taskNames = {
            sentiment: 'Analyzing Sentiment',
            keywords: 'Extracting Keywords',
            topics: 'Modeling Topics',
            summary: 'Generating Summaries'
          };
          
          completedTasks = tasks.slice(0, currentTaskIndex).map(t => taskNames[t]);
          const currentTask = taskNames[task];
          
          const basePercent = 35;
          const taskPercent = (currentTaskIndex / tasks.length) * 50;
          
          setProgress({ 
            stage: currentTask,
            percent: Math.min(95, basePercent + taskPercent),
            subMessage: `Processing content from ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}...`,
            currentTask: currentTask,
            completedTasks: completedTasks,
            totalTasks: tasks.length
          });
        }
      }, 2000);
      
      setProgressInterval(progressSimulator);
      
      const response = await analyzeFile(fileArray);
      const requestEndTime = Date.now();
      
      if (progressSimulator) {
        clearInterval(progressSimulator);
        setProgressInterval(null);
      }
      
      completedTasks = tasks.map(t => {
        const taskNames = {
          sentiment: 'Analyzing Sentiment',
          keywords: 'Extracting Keywords',
          topics: 'Modeling Topics',
          summary: 'Generating Summaries'
        };
        return taskNames[t];
      });
      
      setProgress({ 
        stage: 'Processing completed', 
        percent: 95,
        subMessage: 'Finalizing results...',
        currentTask: null,
        completedTasks: completedTasks,
        totalTasks: tasks.length
      });

      if (response.processing_info) {
        setProcessingInfo(response.processing_info);
        
        if (response.processing_info.mode === 'colab') {
          setStatusMessage({
            type: 'success',
            message: '✓ Using GPU-accelerated processing (Colab) for faster and more accurate results'
          });
        } else if (response.processing_info.colab_failed) {
          setStatusMessage({
            type: 'warning',
            message: `⚠ ${response.processing_info.warnings?.[0] || 'Using local processing'}`
          });
        } else {
          setStatusMessage({
            type: 'info',
            message: 'ℹ Processing with local models'
          });
        }
      }

      const fileNames = fileArray.map(f => f.name);
      
    const newResult = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
        results: response.results,
        textCount: response.results.length,
        fileCount: fileArray.length,
        fileNames: fileNames,
        processingInfo: response.processing_info,
        timing: {
          frontend: {
            request_start: requestStartTime,
            request_end: requestEndTime,
            total_duration: ((requestEndTime - requestStartTime) / 1000).toFixed(3)
          },
          backend: response.processing_info?.timing || null,
          ...(response.frontend_timing ? { frontend_timing: response.frontend_timing } : {})
        }
    };

    setCurrentResults(newResult);
      addToHistory(newResult);

      setProgress({ 
        stage: 'Analysis Complete!', 
        percent: 100,
        subMessage: `Successfully analyzed ${fileArray.length} file${fileArray.length > 1 ? 's' : ''} with ${response.results.length} text${response.results.length > 1 ? 's' : ''}`,
        currentTask: null,
        completedTasks: completedTasks,
        totalTasks: tasks.length
      });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    } catch (err) {
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      setError(err.message || 'Failed to analyze file');
      setStatusMessage({
        type: 'error',
        message: `Error: ${err.message || 'File analysis failed. Please try again.'}`
      });
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      setTimeout(() => {
        setLoading(false);
        setProgress(null);
      }, 1000);
    }
  };

  const clearCurrentResults = () => {
    setCurrentResults(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-20 lg:pb-8">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-30 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 py-3 sm:py-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Text Analysis
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                Analyze text with AI-powered NLP
              </p>
            </div>
          </div>
        {currentResults && (
          <button
            onClick={clearCurrentResults}
              className="p-2 sm:px-4 sm:py-2 rounded-lg text-gray-600 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Clear Results"
          >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline ml-2 text-sm font-medium">Clear</span>
          </button>
        )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 sm:mb-4">
        <ErrorMessage
          message={error}
          onDismiss={() => setError('')}
        />
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className="mb-3 sm:mb-4">
          <StatusMessage
            type={statusMessage.type}
            message={statusMessage.message}
            onDismiss={() => setStatusMessage(null)}
            persistent={statusMessage.type === 'error'}
          />
        </div>
      )}

      {/* Input Section - Mobile Optimized */}
      {!currentResults && !loading && (
        <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-8">
          <div className="card p-4 sm:p-5 md:p-6">
        <TextInput onAnalyze={handleAnalyze} disabled={loading} />
          </div>
          
          <div className="flex items-center gap-3 px-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>
          
          <div className="card p-4 sm:p-5 md:p-6">
        <FileUpload onAnalyze={handleFileAnalyze} disabled={loading} />
      </div>
        </div>
      )}

      {/* Loading with Progress - Mobile Optimized */}
      {loading && progress && (
        <div ref={loadingRef} className="mb-6 sm:mb-8">
          <div className="card p-4 sm:p-5 md:p-6">
          <Loading 
            message={progress.stage} 
            subMessage={progress.subMessage || null}
            currentTask={progress.currentTask || null}
            completedTasks={progress.completedTasks || []}
            totalTasks={progress.totalTasks || 0}
          />
            <div className="mt-4 sm:mt-5 space-y-2">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden shadow-inner">
            <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-500 h-2.5 sm:h-3 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress.percent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{progress.percent}%</span>
              {progress.totalTasks > 0 && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {progress.completedTasks.length} / {progress.totalTasks} tasks
                  </span>
              )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section - Mobile First Design */}
      {currentResults && !loading && (
        <div ref={resultsRef} className="space-y-4 sm:space-y-6 md:space-y-8 fade-in-up">
          {/* Quick Stats Bar - Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {currentResults.results.length > 0 && currentResults.results[0].sentiment && (
              <div className="card p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {currentResults.results.filter(r => r.sentiment?.label === 'positive').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Positive</div>
              </div>
            )}
            {currentResults.results.length > 0 && currentResults.results[0].keywords && (
              <div className="card p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {currentResults.results.reduce((sum, r) => sum + (r.keywords?.length || 0), 0)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Keywords</div>
              </div>
            )}
            {currentResults.results.length > 0 && currentResults.results[0].topics && (
              <div className="card p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {currentResults.results[0].topics?.length || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Topics</div>
              </div>
            )}
            <div className="card p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {currentResults.textCount || currentResults.results.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Texts</div>
            </div>
          </div>

          {/* Dashboard - Full Width Mobile */}
          <div className="card p-0 overflow-hidden">
            <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Analytics Overview
              </h2>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {new Date(currentResults.timestamp).toLocaleString()}
              </span>
            </div>
            </div>
            <div className="p-4 sm:p-5 md:p-6">
            <Dashboard 
              analysisResults={currentResults.results} 
              timingData={currentResults.timing}
              fileNames={currentResults.fileNames}
            />
            </div>
          </div>
        </div>
      )}

      {/* Empty State - Mobile Optimized */}
      {!currentResults && !loading && (
        <div className="text-center py-12 sm:py-16 md:py-20 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20
                        bg-gray-100 dark:bg-gray-800 rounded-full mb-4 sm:mb-6">
            <History className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
            No analysis yet
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4 max-w-md mx-auto">
            Upload a file or enter text to get started with AI-powered analysis
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
