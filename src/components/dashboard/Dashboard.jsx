import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp, FileText, Sparkles, Activity,
  BarChart3, PieChart as PieChartIcon, Target, Zap, Copy, Check, Hash, CopyCheck, Clock, Server, Globe,
  Lightbulb, AlertCircle, CheckCircle2, TrendingDown, Award, Users, Search, Eye, ThumbsUp, Menu, X
} from 'lucide-react';

const Dashboard = ({ analysisResults, timingData, fileNames }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState(null);
  const [allCopied, setAllCopied] = useState(false);

  // Helper to get responsive chart height based on screen size
  const getChartHeight = () => {
    if (typeof window === 'undefined') return 300;
    const width = window.innerWidth;
    if (width < 640) return 250; // Mobile
    if (width < 1024) return 280; // Tablet
    return 300; // Desktop
  };

  const [chartHeight, setChartHeight] = useState(getChartHeight());

  // Update chart height on window resize
  React.useEffect(() => {
    const handleResize = () => {
      setChartHeight(getChartHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if mobile for responsive features
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Group results by source file
  const resultsByFile = {};
  analysisResults.forEach((result, index) => {
    const sourceFile = result.source_file || (fileNames && fileNames.length === 1 ? fileNames[0] : null);
    const fileKey = sourceFile || `Document ${index + 1}`;
    if (!resultsByFile[fileKey]) {
      resultsByFile[fileKey] = [];
    }
    resultsByFile[fileKey].push({ ...result, originalIndex: index });
  });

  // Get list of document names
  const documentNames = Object.keys(resultsByFile);
  const hasMultipleDocuments = documentNames.length > 1;
  
  // Document selector state - default to "all" if multiple docs, otherwise first doc
  const [selectedDocument, setSelectedDocument] = useState(
    hasMultipleDocuments ? 'all' : (documentNames[0] || 'all')
  );

  // Get filtered results based on selected document
  const getFilteredResults = () => {
    if (selectedDocument === 'all' || !hasMultipleDocuments) {
      return analysisResults;
    }
    return resultsByFile[selectedDocument] || [];
  };

  const filteredResults = getFilteredResults();

  if (!analysisResults || analysisResults.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No analysis data yet. Upload a file to get started!</p>
      </div>
    );
  }

  // Process data for charts using filtered results
  const sentimentData = filteredResults.reduce((acc, result) => {
    if (result.sentiment) {
      const sentiment = result.sentiment.label;
      acc[sentiment] = (acc[sentiment] || 0) + 1;
    }
    return acc;
  }, {});

  const sentimentChartData = Object.entries(sentimentData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    percentage: ((value / filteredResults.length) * 100).toFixed(1)
  }));

  const COLORS = {
    'Positive': '#10b981',
    'Negative': '#ef4444',
    'Neutral': '#6b7280'
  };

  // Keyword frequency data
  const allKeywords = filteredResults.flatMap(r => r.keywords || []);
  const topKeywords = allKeywords
    .slice(0, 10)
    .map(kw => ({
      keyword: kw.keyword,
      score: (kw.score * 100).toFixed(1)
    }));

  // Confidence scores for radar chart
  const sentimentResults = filteredResults.filter(r => r.sentiment);
  const avgConfidence = sentimentResults.length > 0
    ? sentimentResults.reduce((sum, r) => sum + r.sentiment.score, 0) / sentimentResults.length
    : 0;

  const radarData = [
    { metric: 'Sentiment Confidence', value: (avgConfidence * 100).toFixed(0) },
    { metric: 'Keyword Relevance', value: allKeywords.length > 0 ? (allKeywords[0].score * 100).toFixed(0) : 0 },
    { metric: 'Analysis Depth', value: 85 },
    { metric: 'Data Quality', value: 92 },
    { metric: 'Processing Speed', value: 95 }
  ];

  // Calculate dominant sentiment
  const dominantSentimentName = sentimentChartData.length > 0 
    ? sentimentChartData.reduce((prev, current) => (prev.value > current.value ? prev : current)).name
    : 'Neutral';
  
  // Calculate average keyword score
  const avgKeywordScore = allKeywords.length > 0
    ? allKeywords.reduce((sum, kw) => sum + kw.score, 0) / allKeywords.length
    : 0;

  const stats = [
    {
      name: 'Sentiment Score',
      value: dominantSentimentName,
      icon: ThumbsUp,
      bgColor: dominantSentimentName === 'Positive' 
        ? 'bg-green-100 dark:bg-green-900/30' 
        : dominantSentimentName === 'Negative'
        ? 'bg-red-100 dark:bg-red-900/30'
        : 'bg-gray-100 dark:bg-gray-700',
      iconColor: dominantSentimentName === 'Positive'
        ? 'text-green-600 dark:text-green-400'
        : dominantSentimentName === 'Negative'
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-600 dark:text-gray-400',
      change: `${sentimentChartData.find(s => s.name === dominantSentimentName)?.percentage || 0}%`
    },
    {
      name: 'Top Keyword',
      value: (() => {
        if (allKeywords.length === 0 || !allKeywords[0]) return 'N/A';
        const topKw = allKeywords[0];
        return typeof topKw === 'object' && topKw.keyword ? String(topKw.keyword) : 'N/A';
      })(),
      icon: Search,
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      change: (() => {
        if (allKeywords.length === 0 || !allKeywords[0]) return 'No keywords';
        const topKw = allKeywords[0];
        return typeof topKw === 'object' && topKw.score ? `${(topKw.score * 100).toFixed(1)}% relevance` : 'N/A';
      })()
    },
    {
      name: 'Keywords Extracted',
      value: allKeywords.length,
      icon: Sparkles,
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      change: `${allKeywords.length} found`
    },
    {
      name: 'Avg Confidence',
      value: `${(avgConfidence * 100).toFixed(1)}%`,
      icon: Target,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      change: 'High accuracy'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {hasMultipleDocuments && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Document Selector */}
        {hasMultipleDocuments && (
          <>
            {/* Desktop Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0"
            >
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5 md:mb-6">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Documents</h2>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedDocument('all');
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-between touch-manipulation min-h-[44px] ${
                      selectedDocument === 'all'
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      All Documents
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedDocument === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {analysisResults.length}
                    </span>
                  </button>
                  
                  {documentNames.map((docName) => (
                    <button
                      key={docName}
                      onClick={() => {
                        setSelectedDocument(docName);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-between touch-manipulation min-h-[44px] ${
                        selectedDocument === docName
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 sm:gap-2 truncate flex-1 min-w-0">
                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate" title={docName}>{docName}</span>
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                        selectedDocument === docName
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {resultsByFile[docName].length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>

            {/* Mobile Sidebar Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: sidebarOpen ? 0 : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Documents</h2>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedDocument('all');
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-between touch-manipulation min-h-[44px] ${
                      selectedDocument === 'all'
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      All Documents
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedDocument === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {analysisResults.length}
                    </span>
                  </button>
                  
                  {documentNames.map((docName) => (
                    <button
                      key={docName}
                      onClick={() => {
                        setSelectedDocument(docName);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-between touch-manipulation min-h-[44px] ${
                        selectedDocument === docName
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate flex-1 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate" title={docName}>{docName}</span>
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                        selectedDocument === docName
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {resultsByFile[docName].length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}

        {/* Main Content Area - Mobile First */}
        <div className={`flex-1 w-full ${hasMultipleDocuments ? '' : 'max-w-7xl mx-auto'} px-0 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8`}>
          {/* Header - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 sm:mb-4 md:mb-6"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {hasMultipleDocuments && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                    aria-label="Open document selector"
                  >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex flex-wrap items-center gap-1 sm:gap-2">
                    <span>Analytics</span>
                    {hasMultipleDocuments && selectedDocument !== 'all' && (
                      <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500 dark:text-gray-400 truncate">
                        - {selectedDocument}
                      </span>
                    )}
                  </h1>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
              {hasMultipleDocuments && selectedDocument !== 'all' 
                ? `Viewing results for ${selectedDocument}`
                : 'Real-time insights from your NLP analysis'
              }
            </p>
          </motion.div>

        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow p-3 sm:p-4 md:p-5"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`p-1.5 sm:p-2 md:p-2.5 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.iconColor}`} />
                </div>
                <span className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium truncate ml-1">{stat.change}</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-0.5 sm:mb-1 break-words line-clamp-2">{stat.value}</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{stat.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs - Mobile Scrollable */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide -mx-0 sm:mx-0 px-0 sm:px-0">
            <nav className="-mb-px flex space-x-2 sm:space-x-4 md:space-x-6 min-w-max">
              {['overview', 'sentiment', 'keywords', 'topics', 'summary', 'performance', 'insights'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap touch-manipulation min-h-[44px] flex-shrink-0
                    ${activeTab === tab
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-semibold'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Charts Grid - Mobile First */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {/* Sentiment Distribution Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-5 lg:p-6"
            >
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>Sentiment Distribution</span>
              </h3>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <PieChart>
                  <Pie
                    data={sentimentChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={!isMobile}
                    label={isMobile ? false : ({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={isMobile ? 60 : window.innerWidth < 768 ? 70 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: isMobile ? '12px' : '14px',
                      padding: isMobile ? '8px' : '12px',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Keywords Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-5 lg:p-6"
            >
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>Top Keywords</span>
              </h3>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={topKeywords} margin={isMobile ? { top: 5, right: 5, left: 0, bottom: 60 } : { top: 10, right: 10, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="keyword" 
                    angle={isMobile ? -90 : -45} 
                    textAnchor={isMobile ? "middle" : "end"} 
                    height={isMobile ? 80 : 60}
                    tick={{ fontSize: isMobile ? 9 : 11 }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 9 : 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: isMobile ? '12px' : '14px',
                      padding: isMobile ? '8px' : '12px',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Performance Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>Performance Metrics</span>
              </h3>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Sentiment Trend Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>Confidence Trend</span>
              </h3>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart
                  data={filteredResults.map((r, i) => ({
                    index: i + 1,
                    confidence: r.sentiment ? (r.sentiment.score * 100).toFixed(1) : 0
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="index" 
                    label={{ value: 'Text #', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} dot={{ r: isMobile ? 3 : 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {activeTab === 'sentiment' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {(selectedDocument === 'all' 
              ? Object.entries(resultsByFile) 
              : [[selectedDocument, resultsByFile[selectedDocument] || []]]
            ).map(([fileName, fileResults]) => (
              <motion.div
                key={fileName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <FileText className="inline h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  {fileName}
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({fileResults.length} text{fileResults.length > 1 ? 's' : ''})
                  </span>
                </h3>
            <div className="space-y-4">
                  {fileResults.map((result, idx) => (
                result.sentiment && (
                      <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {fileResults.length > 1 ? `Text ${result.text_index || idx + 1}` : 'Content'}
                          </span>
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                            ${result.sentiment.label === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : ''}
                            ${result.sentiment.label === 'negative' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : ''}
                            ${result.sentiment.label === 'neutral' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' : ''}
                      `}>
                        {result.sentiment.label.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{result.text}</p>
                    <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            result.sentiment.label === 'positive' ? 'bg-green-500' :
                            result.sentiment.label === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${result.sentiment.score * 100}%` }}
                        />
                      </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {(result.sentiment.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              ))}
            </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'keywords' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Keyword Analysis</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Click on any keyword to copy it</p>
              </div>
              {allKeywords.length > 0 && (
                <button
                  onClick={async () => {
                    try {
                      const allKeywordsText = allKeywords.map(kw => kw.keyword).join(', ');
                      await navigator.clipboard.writeText(allKeywordsText);
                      setAllCopied(true);
                      setTimeout(() => setAllCopied(false), 2000);
                    } catch (err) {
                      console.error('Failed to copy all keywords:', err);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 touch-manipulation min-h-[44px] w-full sm:w-auto ${
                    allCopied
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50'
                  }`}
                >
                  {allCopied ? (
                    <>
                      <CopyCheck className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy All
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {allKeywords.map((kw, index) => {
                const isCopied = copiedKeyword === kw.keyword;
                return (
                  <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(kw.keyword);
                        setCopiedKeyword(kw.keyword);
                        setTimeout(() => setCopiedKeyword(null), 2000);
                      } catch (err) {
                        console.error('Failed to copy:', err);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 touch-manipulation min-h-[44px] ${
                      isCopied
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50 active:scale-95'
                    } cursor-pointer`}
                  style={{
                    fontSize: `clamp(0.75rem, ${0.75 + kw.score * 0.3}rem, 1rem)`
                  }}
                    title={`Click to copy: ${kw.keyword}`}
                >
                  <span className="truncate max-w-[120px] sm:max-w-none">{kw.keyword}</span>
                    <span className="text-xs opacity-70 flex-shrink-0">
                    {(kw.score * 100).toFixed(0)}%
                  </span>
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 flex-shrink-0" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'topics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {(selectedDocument === 'all' 
              ? Object.entries(resultsByFile) 
              : [[selectedDocument, resultsByFile[selectedDocument] || []]]
            ).map(([fileName, fileResults]) => {
              const fileTopics = fileResults.find(r => r.topics && r.topics.length > 0);
              if (!fileTopics) return null;

              return (
                <motion.div
                  key={fileName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <Hash className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Main Topics - {fileName}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {fileTopics.topics.map((topic) => (
                      <div
                        key={topic.topic_id}
                        className="border-l-4 border-teal-500 dark:border-teal-400 pl-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-r-lg"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-semibold">
                              {topic.topic_id + 1}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              Topic {topic.topic_id + 1}
                            </span>
                          </div>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                            {(topic.score * 100).toFixed(1)}% relevance
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {topic.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
              ))}
            </div>
                </motion.div>
              );
            })}
            {filteredResults.every(r => !r.topics || r.topics.length === 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <Hash className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No topics detected for this analysis</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Topics are identified when analyzing multiple texts together
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'summary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {(selectedDocument === 'all' 
              ? Object.entries(resultsByFile) 
              : [[selectedDocument, resultsByFile[selectedDocument] || []]]
            ).map(([fileName, fileResults], fileIdx) => {
              return fileResults.map((result, idx) => {
                if (!result.summary) return null;
                
                const summaryText = typeof result.summary === 'string' 
                  ? result.summary 
                  : result.summary.summary;
                const keyPoints = result.summary?.key_points || [];
                const compressionRatio = result.summary?.compression_ratio;

                return (
                  <motion.div
                    key={`${fileName}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (fileIdx * 0.1) + (idx * 0.05) }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                        Summary - {fileName}
                        {fileResults.length > 1 && (
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            (Text {result.text_index || idx + 1})
                          </span>
                        )}
                      </h3>
                    {compressionRatio && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        {Math.round((1 - compressionRatio) * 100)}% shorter
                      </span>
                    )}
                  </div>

                  {/* Main Summary */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {summaryText}
                    </p>
                  </div>

                  {/* Key Points */}
                  {keyPoints.length > 0 && (
              <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Target className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        Key Points
                      </h4>
                      <ul className="space-y-2">
                        {keyPoints.map((point, pointIndex) => (
                          <li
                            key={pointIndex}
                            className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400
                                      bg-gray-50 dark:bg-gray-900/50 rounded-lg px-4 py-3
                                      border border-gray-200 dark:border-gray-700"
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full
                                           bg-teal-100 dark:bg-teal-900/30
                                           text-teal-600 dark:text-teal-400
                                           text-xs font-semibold flex-shrink-0 mt-0.5">
                              {pointIndex + 1}
                            </span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Badge */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Sparkles className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" />
                      <span>AI-Generated Summary</span>
                      <span className="text-gray-400 dark:text-gray-600">•</span>
                      <span>BART Large CNN Model</span>
                    </div>
                  </div>
                </motion.div>
                );
              }).filter(Boolean);
            })}
            {filteredResults.every(r => !r.summary) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <FileText className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No summaries available for this analysis</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {timingData ? (
              <>
                {/* Total Request Time - At Top */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-2xl shadow-lg p-6 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Total Request Time</p>
                      <p className="text-4xl font-bold">
                        {timingData.frontend && timingData.backend
                          ? (parseFloat(timingData.frontend.total_duration) + parseFloat(timingData.backend.total_pipeline_duration)).toFixed(3)
                          : timingData.frontend?.total_duration || timingData.backend?.total_pipeline_duration || 'N/A'
                        }s
                      </p>
                      <p className="text-sm opacity-80 mt-2">
                        Complete end-to-end processing time
                      </p>
                    </div>
                    <Zap className="h-16 w-16 opacity-80" />
                  </div>
                </motion.div>

                {/* Overall Timing Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    Request Timeline Breakdown
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Frontend to Backend */}
                    {timingData.frontend && (
                      <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">Frontend → Backend</span>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {timingData.frontend.total_duration}s
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Request sent from browser to backend server
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Backend Processing */}
                    {timingData.backend && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <Server className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">Backend Pipeline</span>
                              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {timingData.backend.total_pipeline_duration}s
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Total backend processing time
                </p>
              </div>
            </div>

                        {/* Colab Requests Breakdown */}
                        {timingData.backend.colab_requests && timingData.backend.colab_requests.length > 0 && (
                          <div className="ml-8 space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                              Colab GPU Requests ({timingData.backend.request_count})
                            </h4>
                            {timingData.backend.colab_requests.map((request, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                                      {request.task?.toUpperCase() || 'NLP'}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {request.text_count} text{request.text_count !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                      {request.request_duration}s
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                      (request)
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                  <span>Total: {request.total_duration}s</span>
                                  <span>{request.endpoint?.split('/').pop() || 'Colab'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                {/* Request Comparison Chart */}
                {timingData.backend?.colab_requests && timingData.backend.colab_requests.length > 1 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      Request Duration Comparison
                    </h3>
                    <ResponsiveContainer width="100%" height={chartHeight}>
                      <BarChart data={timingData.backend.colab_requests.map((req, idx) => ({
                        name: req.task?.charAt(0).toUpperCase() + req.task?.slice(1) || `Request ${idx + 1}`,
                        duration: req.request_duration,
                        total: req.total_duration
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                          labelStyle={{ color: '#f3f4f6' }}
                        />
                        <Legend />
                        <Bar dataKey="duration" fill="#10b981" name="Request Time (s)" />
                        <Bar dataKey="total" fill="#3b82f6" name="Total Time (s)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Timeline Visualization */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <Activity className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    Request Timeline
                  </h3>
                  <div className="space-y-4">
                    {/* Frontend */}
                    {timingData.frontend && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Frontend Request</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                            {timingData.frontend.total_duration}s
                          </span>
                        </div>
                        <div className="ml-5 h-2 bg-blue-200 dark:bg-blue-900/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Backend Pipeline */}
                    {timingData.backend && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Backend Pipeline</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                            {timingData.backend.total_pipeline_duration}s
                          </span>
                        </div>
                        <div className="ml-5 h-2 bg-purple-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: '100%' }}
                          ></div>
                        </div>

                        {/* Individual Colab Requests */}
                        {timingData.backend.colab_requests && timingData.backend.colab_requests.map((req, idx) => (
                          <div key={idx} className="ml-8 mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {req.task?.toUpperCase() || 'NLP'} Request
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                {req.request_duration}s
                              </span>
                            </div>
                            <div className="ml-4 h-1.5 bg-teal-200 dark:bg-teal-900/30 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal-500 rounded-full"
                                style={{ 
                                  width: `${(req.request_duration / timingData.backend.total_pipeline_duration) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <Clock className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No timing data available for this analysis</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Timing information is captured during the analysis process
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'insights' && (() => {
          // Calculate additional insights
          const dominantSentiment = sentimentChartData[0]?.name || 'Neutral';
          const positiveCount = sentimentData.positive || 0;
          const negativeCount = sentimentData.negative || 0;
          const neutralCount = sentimentData.neutral || 0;
          const totalSentiments = positiveCount + negativeCount + neutralCount;
          
          const topKeyword = allKeywords[0];
          const avgKeywordScore = allKeywords.length > 0
            ? allKeywords.reduce((sum, kw) => sum + kw.score, 0) / allKeywords.length
            : 0;
          
          const allTopics = filteredResults.flatMap(r => r.topics || []);
          const uniqueTopics = new Set(allTopics.map(t => t.topic_id));
          
          const summaries = filteredResults.filter(r => r.summary);
          const avgSummaryLength = summaries.length > 0
            ? summaries.reduce((sum, r) => {
                const summaryText = typeof r.summary === 'string' ? r.summary : r.summary?.summary || '';
                return sum + summaryText.length;
              }, 0) / summaries.length
            : 0;
          
          const highConfidenceSentiments = sentimentResults.filter(r => r.sentiment.score > 0.8).length;
          const sentimentStrength = highConfidenceSentiments / totalSentiments;
          
          // SEO Score calculation
          const seoScore = Math.min(100, Math.round(
            (allKeywords.length >= 10 ? 30 : (allKeywords.length / 10) * 30) +
            (avgKeywordScore * 30) +
            (uniqueTopics.size >= 5 ? 20 : (uniqueTopics.size / 5) * 20) +
            (avgConfidence * 20)
          ));
          
          // Content Quality Score
          const qualityScore = Math.min(100, Math.round(
            (sentimentStrength * 30) +
            (avgConfidence * 30) +
            (summaries.length > 0 ? 20 : 0) +
            (allKeywords.length >= 10 ? 20 : (allKeywords.length / 10) * 20)
          ));
          
          // Recommendations
          const recommendations = [];
          if (allKeywords.length < 10) {
            recommendations.push({
              type: 'warning',
              icon: Search,
              title: 'Add More Keywords',
              message: `You have ${allKeywords.length} keywords. Consider adding more to improve SEO visibility. Aim for 15-20 keywords for better YouTube discoverability.`
            });
          }
          if (avgKeywordScore < 0.5) {
            recommendations.push({
              type: 'info',
              icon: Target,
              title: 'Improve Keyword Relevance',
              message: 'Your keywords have moderate relevance. Consider using more specific, niche terms that better match your content.'
            });
          }
          if (negativeCount > positiveCount && negativeCount > 0) {
            recommendations.push({
              type: 'warning',
              icon: AlertCircle,
              title: 'Sentiment Balance',
              message: 'Your content has more negative sentiment. Consider balancing with more positive or neutral content for broader audience appeal.'
            });
          }
          if (uniqueTopics.size < 5) {
            recommendations.push({
              type: 'info',
              icon: Hash,
              title: 'Expand Topic Coverage',
              message: `You have ${uniqueTopics.size} main topics. Diversifying topics can help reach a wider audience and improve content discoverability.`
            });
          }
          if (avgConfidence < 0.7) {
            recommendations.push({
              type: 'info',
              icon: Target,
              title: 'Sentiment Clarity',
              message: 'Some sentiments have lower confidence scores. Consider making your content more explicit in tone for clearer analysis.'
            });
          }
          if (recommendations.length === 0) {
            recommendations.push({
              type: 'success',
              icon: CheckCircle2,
              title: 'Excellent Content Quality',
              message: 'Your content has great keyword coverage, sentiment balance, and topic diversity. Keep up the excellent work!'
            });
          }
          
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Overall Performance Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-2xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Award className="h-8 w-8" />
                    <span className="text-4xl font-bold">{qualityScore}</span>
      </div>
                  <h3 className="text-lg font-semibold mb-2">Content Quality Score</h3>
                  <p className="text-sm opacity-90">
                    {qualityScore >= 80 ? 'Excellent' : qualityScore >= 60 ? 'Good' : qualityScore >= 40 ? 'Fair' : 'Needs Improvement'}
                  </p>
                  <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${qualityScore}%` }}
                    ></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Search className="h-8 w-8" />
                    <span className="text-4xl font-bold">{seoScore}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">SEO Optimization Score</h3>
                  <p className="text-sm opacity-90">
                    {seoScore >= 80 ? 'Highly Optimized' : seoScore >= 60 ? 'Well Optimized' : seoScore >= 40 ? 'Moderate' : 'Needs Optimization'}
                  </p>
                  <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${seoScore}%` }}
                    ></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-2xl shadow-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="h-8 w-8" />
                    <span className="text-4xl font-bold">{(avgConfidence * 100).toFixed(0)}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Analysis Confidence</h3>
                  <p className="text-sm opacity-90">
                    {avgConfidence >= 0.8 ? 'Very High' : avgConfidence >= 0.6 ? 'High' : avgConfidence >= 0.4 ? 'Moderate' : 'Low'}
                  </p>
                  <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${avgConfidence * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{positiveCount}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Positive Texts</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {totalSentiments > 0 ? `${((positiveCount / totalSentiments) * 100).toFixed(1)}% of total` : 'N/A'}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allKeywords.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Keywords Found</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Avg relevance: {(avgKeywordScore * 100).toFixed(1)}%
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <Hash className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{uniqueTopics.size}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Main Topics</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {allTopics.length} total topic instances
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{summaries.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Summaries</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {summaries.length > 0 ? `Avg ${Math.round(avgSummaryLength)} chars` : 'None generated'}
                  </div>
                </motion.div>
              </div>

              {/* Sentiment Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  Sentiment Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Overall Sentiment</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{dominantSentiment}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{positiveCount}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Positive</p>
                      {totalSentiments > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {((positiveCount / totalSentiments) * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{neutralCount}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Neutral</p>
                      {totalSentiments > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {((neutralCount / totalSentiments) * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{negativeCount}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Negative</p>
                      {totalSentiments > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {((negativeCount / totalSentiments) * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Confidence Sentiments</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {highConfidenceSentiments} / {totalSentiments}
                      </span>
                    </div>
                    <div className="h-2 bg-blue-200 dark:bg-blue-900/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(highConfidenceSentiments / totalSentiments) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {((highConfidenceSentiments / totalSentiments) * 100).toFixed(1)}% of sentiments have &gt;80% confidence
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Top Keywords & SEO Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Search className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    Top Performing Keywords
                  </h3>
                  <div className="space-y-3">
                    {topKeywords.slice(0, 5).map((kw, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold text-sm">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{kw.keyword}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{kw.score}%</span>
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-500 rounded-full"
                              style={{ width: `${kw.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {topKeyword && (
                    <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                      <p className="text-sm font-semibold text-teal-900 dark:text-teal-100 mb-1">Best Keyword</p>
                      <p className="text-lg font-bold text-teal-700 dark:text-teal-300">{topKeyword.keyword}</p>
                      <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                        {(topKeyword.score * 100).toFixed(1)}% relevance - Use this in your title and description!
                      </p>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    SEO Recommendations
                  </h3>
                  <div className="space-y-3">
                    {allKeywords.length >= 15 ? (
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-100">Excellent Keyword Count</p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            You have {allKeywords.length} keywords - perfect for YouTube SEO optimization!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-900 dark:text-yellow-100">Add More Keywords</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            You have {allKeywords.length} keywords. Aim for 15-20 for optimal YouTube discoverability.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {avgKeywordScore >= 0.6 ? (
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-100">High Keyword Relevance</p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Your keywords have {(avgKeywordScore * 100).toFixed(1)}% average relevance - great for SEO!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900 dark:text-blue-100">Improve Keyword Specificity</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Use more specific, niche terms that better match your content for higher relevance.
                          </p>
                        </div>
                      </div>
                    )}

                    {uniqueTopics.size >= 5 ? (
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-100">Good Topic Diversity</p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            {uniqueTopics.size} main topics provide excellent content coverage and audience reach.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-purple-900 dark:text-purple-100">Expand Topic Coverage</p>
                          <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                            Consider covering more topics ({uniqueTopics.size} currently) to reach a wider audience.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Actionable Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  Actionable Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        rec.type === 'success' 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                        rec.type === 'warning' 
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                          'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <rec.icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          rec.type === 'success' 
                            ? 'text-green-600 dark:text-green-400' :
                          rec.type === 'warning' 
                            ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-blue-600 dark:text-blue-400'
                        }`} />
                        <div>
                          <h4 className={`font-semibold mb-1 ${
                            rec.type === 'success' 
                              ? 'text-green-900 dark:text-green-100' :
                            rec.type === 'warning' 
                              ? 'text-yellow-900 dark:text-yellow-100' :
                              'text-blue-900 dark:text-blue-100'
                          }`}>{rec.title}</h4>
                          <p className={`text-sm ${
                            rec.type === 'success' 
                              ? 'text-green-700 dark:text-green-300' :
                            rec.type === 'warning' 
                              ? 'text-yellow-700 dark:text-yellow-300' :
                              'text-blue-700 dark:text-blue-300'
                          }`}>{rec.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Processing Info */}
              {timingData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    Processing Performance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Processing Time</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {timingData.frontend && timingData.backend
                          ? (parseFloat(timingData.frontend.total_duration) + parseFloat(timingData.backend.total_pipeline_duration)).toFixed(2)
                          : timingData.frontend?.total_duration || timingData.backend?.total_pipeline_duration || 'N/A'
                        }s
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Colab Requests</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {timingData.backend?.request_count || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Processing Mode</p>
                      <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
                        {timingData.backend?.tasks_processed?.join(', ').toUpperCase() || 'N/A'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
