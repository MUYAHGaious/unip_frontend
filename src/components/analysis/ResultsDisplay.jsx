import { useState } from 'react';
import SentimentCard from './SentimentCard';
import KeywordsCard from './KeywordsCard';
import TopicsCard from './TopicsCard';
import SummaryCard from './SummaryCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ResultsDisplay = ({ results }) => {
  const [expandedTexts, setExpandedTexts] = useState({});

  if (!results || results.length === 0) return null;

  const toggleText = (index) => {
    setExpandedTexts(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-6 fade-in">
      {results.map((result, index) => {
        const isExpanded = expandedTexts[index];
        const textLines = result.text.split('\n');
        const shouldTruncate = textLines.length > 3 || result.text.length > 200;

        return (
          <div key={index} className="space-y-4">
            <div className="card bg-gray-50 relative">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Original Text</h3>
              <div className={`relative ${!isExpanded && shouldTruncate ? 'max-h-24 overflow-hidden' : ''}`}>
                <p className="text-gray-700 whitespace-pre-wrap">{result.text}</p>
                {!isExpanded && shouldTruncate && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
                )}
              </div>
              {shouldTruncate && (
                <button
                  onClick={() => toggleText(index)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SentimentCard sentiment={result.sentiment} />
            <KeywordsCard keywords={result.keywords} />
          </div>

            <TopicsCard topics={result.topics} />
            <SummaryCard summary={result.summary} />
          </div>
        );
      })}
    </div>
  );
};

export default ResultsDisplay;
