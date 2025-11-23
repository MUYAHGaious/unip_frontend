const KeywordsCard = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
            title={`Score: ${(kw.score * 100).toFixed(1)}%`}
          >
            {kw.keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordsCard;
