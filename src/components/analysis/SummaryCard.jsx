import { FileText, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  // Handle both old and new summary formats
  const summaryText = typeof summary === 'string' ? summary : summary.summary;
  const keyPoints = summary?.key_points || [];
  const compressionRatio = summary?.compression_ratio;

  return (
    <div className="card-gradient hover-lift">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
          <Lightbulb className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Intelligent Summary
        </h3>
        {compressionRatio && (
          <span className="ml-auto badge badge-success">
            {Math.round((1 - compressionRatio) * 100)}% shorter
          </span>
        )}
      </div>

      {/* Main Summary */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            {summaryText}
          </p>
        </div>
      </div>

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            Key Points
          </h4>
          <ul className="space-y-2">
            {keyPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400
                          bg-white dark:bg-gray-800 rounded-lg px-4 py-3
                          border border-gray-100 dark:border-gray-700
                          hover:border-teal-200 dark:hover:border-teal-800
                          transition-all duration-200"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full
                               bg-teal-100 dark:bg-teal-900/30
                               text-teal-600 dark:text-teal-400
                               text-xs font-semibold flex-shrink-0 mt-0.5">
                  {index + 1}
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
    </div>
  );
};

export default SummaryCard;
