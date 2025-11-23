const TopicsCard = ({ topics }) => {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Topics</h3>
      <div className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.topic_id} className="border-l-4 border-primary-500 pl-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">Topic {topic.topic_id + 1}</span>
              <span className="text-sm text-gray-500">
                {(topic.score * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topic.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsCard;
