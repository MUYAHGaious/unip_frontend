import { Link } from 'react-router-dom';
import { Smile, Key, BarChart2, FileText, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

const HomePage = () => {
  const features = [
    {
      icon: Smile,
      title: 'Sentiment Analysis',
      description: 'Detect positive, negative, or neutral sentiment with high accuracy',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: Key,
      title: 'Keyword Extraction',
      description: 'Extract important keywords and phrases automatically',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: BarChart2,
      title: 'Topic Modeling',
      description: 'Identify main topics and themes in your text',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: FileText,
      title: 'Summarization',
      description: 'Generate concise, intelligent summaries',
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30'
    }
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Section - Mobile First */}
      <div className="text-center py-8 sm:py-12 md:py-16 fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>AI-Powered NLP Platform</span>
        </div>

        {/* Heading - Mobile First Typography */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight px-2">
          Universal NLP
          <span className="block gradient-text mt-1 sm:mt-2">Intelligence Platform</span>
        </h1>

        {/* Description - Mobile First */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
          Analyze text with advanced NLP capabilities powered by state-of-the-art transformer models.
          Get insights from sentiment analysis, keyword extraction, topic modeling, and intelligent summarization.
        </p>

        {/* CTA Buttons - Mobile First */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-2">
          <Link to="/analyze" className="w-full sm:w-auto group">
            <button className="btn-primary flex items-center justify-center gap-2 text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto min-h-[44px] touch-manipulation">
              Get Started
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link to="/api-docs" className="w-full sm:w-auto">
            <button className="btn-secondary flex items-center justify-center gap-2 text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto min-h-[44px] touch-manipulation">
              API Documentation
            </button>
          </Link>
        </div>
      </div>

      {/* Features Grid - Mobile First */}
      <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="card hover-lift text-center group cursor-pointer fade-in-up p-4 sm:p-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${feature.bgColor} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats Section - Mobile First */}
      <div className="mt-12 sm:mt-16 md:mt-20 card-gradient text-center py-8 sm:py-10 md:py-12 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
          Powered by Advanced AI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="scale-in">
            <div className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              99.2%
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Sentiment Accuracy
            </div>
          </div>
          <div className="scale-in" style={{ animationDelay: '100ms' }}>
            <div className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              4 Models
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              NLP Capabilities
            </div>
          </div>
          <div className="scale-in" style={{ animationDelay: '200ms' }}>
            <div className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              GPU
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Accelerated Processing
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Mobile First */}
      <div className="mt-12 sm:mt-16 md:mt-20 mb-8 sm:mb-12 text-center fade-in px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Ready to analyze your text?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Upload a document or paste your text to get started with AI-powered analysis
        </p>
        <Link to="/analyze" className="inline-block">
          <button className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 group min-h-[44px] touch-manipulation">
            Start Analyzing
            <ArrowRight className="inline-block ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
