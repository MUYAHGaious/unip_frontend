import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const HomePage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Universal NLP Intelligence Platform
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Analyze text with advanced NLP capabilities: sentiment, keywords, topics, and summarization
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/analyze">
          <Button>Get Started</Button>
        </Link>
        <Link to="/api-docs">
          <Button variant="secondary">API Documentation</Button>
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-2">😊</div>
          <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
          <p className="text-sm text-gray-600">Detect positive, negative, or neutral sentiment</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">🔑</div>
          <h3 className="font-semibold mb-2">Keyword Extraction</h3>
          <p className="text-sm text-gray-600">Extract important keywords and phrases</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold mb-2">Topic Modeling</h3>
          <p className="text-sm text-gray-600">Identify main topics and themes</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-semibold mb-2">Summarization</h3>
          <p className="text-sm text-gray-600">Generate concise summaries</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
