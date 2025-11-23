import SentimentCard from './SentimentCard';
import KeywordsCard from './KeywordsCard';
import TopicsCard from './TopicsCard';
import SummaryCard from './SummaryCard';

const ResultsDisplay = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-6 fade-in">
      {results.map((result, index) => (
        <div key={index} className="space-y-4">
          <div className="card bg-gray-50">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Original Text</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{result.text}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SentimentCard sentiment={result.sentiment} />
            <KeywordsCard keywords={result.keywords} />
          </div>

          <TopicsCard topics={result.topics} />
          <SummaryCard summary={result.summary} />
        </div>
      ))}
    </div>
  );
};

export default ResultsDisplay;
