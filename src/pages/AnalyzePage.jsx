import { useState, useRef, useEffect } from 'react';
import { analyzeTexts, analyzeFile } from '../services/api';
import TextInput from '../components/analysis/TextInput';
import FileUpload from '../components/analysis/FileUpload';
import Dashboard from '../components/dashboard/Dashboard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import StatusMessage from '../components/common/StatusMessage';
import { useHistory } from '../context/HistoryContext';
import { History } from 'lucide-react';

const AnalyzePage = () => {
  // Load current results from localStorage on mount
  const [currentResults, setCurrentResults] = useState(() => {
    const saved = localStorage.getItem('currentAnalysisResult');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
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
    if (currentResults) {
      localStorage.setItem('currentAnalysisResult', JSON.stringify(currentResults));
    } else {
      localStorage.removeItem('currentAnalysisResult');
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
          const taskPercent = (currentTaskIndex / tasks.length) * 50; // 25-75% for tasks
          const textProgress = (1 / textCount) * 20; // Remaining 20% for texts
          
          setProgress({ 
            stage: currentTask,
            percent: Math.min(95, basePercent + taskPercent),
            subMessage: `Processing ${textCount} text${textCount > 1 ? 's' : ''}...`,
            currentTask: currentTask,
            completedTasks: completedTasks,
            totalTasks: tasks.length
          });
        }
      }, 2000); // Update every 2 seconds
      
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
        
        // Show status messages based on processing mode
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
            total_duration: ((requestEndTime - requestEndTime) / 1000).toFixed(3)
          },
          backend: response.processing_info?.timing || null,
          ...(response.frontend_timing ? { frontend_timing: response.frontend_timing } : {})
        }
      };

      setCurrentResults(newResult);

      // Add to history
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
      // Clear any progress intervals on error
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
      // Clear any progress intervals
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
    
    // Handle single file or multiple files
    const fileArray = Array.isArray(files) ? files : [files];
    const tasks = ['sentiment', 'keywords', 'topics', 'summary'];
    let completedTasks = [];
    let currentTaskIndex = 0;
    
    // Initialize progress
    setProgress({ 
      stage: 'Initializing file analysis...', 
      percent: 5,
      subMessage: `Preparing to analyze ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`,
      currentTask: null,
      completedTasks: [],
      totalTasks: tasks.length
    });

    // Auto-scroll to loading section
    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      // Stage 1: File validation
      setProgress({ 
        stage: 'Validating files...', 
        percent: 10,
        subMessage: `Checking ${fileArray.length} file${fileArray.length > 1 ? 's' : ''} format and size`,
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Stage 2: File parsing
      setProgress({ 
        stage: 'Parsing files...', 
        percent: 15,
        subMessage: `Extracting text from ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`,
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Stage 3: Connection
      setProgress({ 
        stage: 'Connecting to NLP engine...', 
        percent: 20,
        subMessage: 'Establishing connection to backend service',
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Stage 4: Health check
      setProgress({ 
        stage: 'Checking GPU service availability...', 
        percent: 25,
        subMessage: 'Verifying Colab GPU service status',
        currentTask: null,
        completedTasks: [],
        totalTasks: tasks.length
      });
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Stage 5: Sending request
      setProgress({ 
        stage: 'Sending data to NLP engine', 
        percent: 30,
        subMessage: `Uploading content from ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`,
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
          
          const basePercent = 35;
          const taskPercent = (currentTaskIndex / tasks.length) * 50; // 35-85% for tasks
          
          setProgress({ 
            stage: currentTask,
            percent: Math.min(95, basePercent + taskPercent),
            subMessage: `Processing content from ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}...`,
            currentTask: currentTask,
            completedTasks: completedTasks,
            totalTasks: tasks.length
          });
        }
      }, 2000); // Update every 2 seconds
      
      setProgressInterval(progressSimulator);
      
      const response = await analyzeFile(fileArray);
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
        
        // Show status messages based on processing mode
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
      // fileArray is already declared at the top of the function
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

      // Add to history
      addToHistory(newResult);

      setProgress({ 
        stage: 'Analysis Complete!', 
        percent: 100,
        subMessage: `Successfully analyzed ${fileArray.length} file${fileArray.length > 1 ? 's' : ''} with ${response.results.length} text${response.results.length > 1 ? 's' : ''}`,
        currentTask: null,
        completedTasks: completedTasks,
        totalTasks: tasks.length
      });

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err) {
      // Clear any progress intervals on error
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
      // Clear any progress intervals
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
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Text Analysis</h1>
        {currentResults && (
          <button
            onClick={clearCurrentResults}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     rounded-lg transition-colors"
          >
            Clear Results
          </button>
        )}
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className="max-w-4xl mx-auto mb-6">
          <StatusMessage
            type={statusMessage.type}
            message={statusMessage.message}
            onDismiss={() => setStatusMessage(null)}
            persistent={statusMessage.type === 'error'}
          />
        </div>
      )}

      {/* Input Section */}
      <div className="max-w-4xl mx-auto space-y-6 mb-8">
        <TextInput onAnalyze={handleAnalyze} disabled={loading} />
        <div className="text-center text-gray-500 dark:text-gray-400">OR</div>
        <FileUpload onAnalyze={handleFileAnalyze} disabled={loading} />
      </div>

      {/* Loading with Progress */}
      {loading && progress && (
        <div ref={loadingRef} className="max-w-2xl mx-auto mb-8">
          <Loading 
            message={progress.stage} 
            subMessage={progress.subMessage || null}
            currentTask={progress.currentTask || null}
            completedTasks={progress.completedTasks || []}
            totalTasks={progress.totalTasks || 0}
          />
          <div className="mt-6 space-y-2">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-500 h-3 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress.percent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress.percent}%</p>
              {progress.totalTasks > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {progress.completedTasks.length} / {progress.totalTasks} tasks completed
                </p>
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
            <Dashboard 
              analysisResults={currentResults.results} 
              timingData={currentResults.timing}
              fileNames={currentResults.fileNames}
            />
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
