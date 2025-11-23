const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Summary</h3>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </div>
  );
};

export default SummaryCard;
