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
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          AI-Powered NLP Platform
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          Universal NLP
          <span className="block gradient-text">Intelligence Platform</span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Analyze text with advanced NLP capabilities powered by state-of-the-art transformer models.
          Get insights from sentiment analysis, keyword extraction, topic modeling, and intelligent summarization.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/analyze" className="group">
            <button className="btn-primary flex items-center gap-2 text-lg px-8 py-3">
              Get Started
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link to="/api-docs">
            <button className="btn-secondary flex items-center gap-2 text-lg px-8 py-3">
              API Documentation
            </button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="card hover-lift text-center group cursor-pointer fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="mt-20 card-gradient text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Powered by Advanced AI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="scale-in">
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              99.2%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Sentiment Accuracy
            </div>
          </div>
          <div className="scale-in" style={{ animationDelay: '100ms' }}>
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              4 Models
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              NLP Capabilities
            </div>
          </div>
          <div className="scale-in" style={{ animationDelay: '200ms' }}>
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              GPU
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Accelerated Processing
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 mb-12 text-center fade-in">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Ready to analyze your text?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Upload a document or paste your text to get started with AI-powered analysis
        </p>
        <Link to="/analyze">
          <button className="btn-primary text-lg px-10 py-4 group">
            Start Analyzing
            <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
