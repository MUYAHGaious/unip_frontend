import { getSentimentColor } from '../../utils/helpers';

const SentimentCard = ({ sentiment }) => {
  if (!sentiment) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
      <div className="flex items-center space-x-4">
        <span className={`px-4 py-2 rounded-full font-medium ${getSentimentColor(sentiment.label)}`}>
          {sentiment.label.toUpperCase()}
        </span>
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Confidence</span>
            <span>{(sentiment.score * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${sentiment.score * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentCard;
