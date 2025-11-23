import { useState } from 'react';
import { analyzeTexts } from '../services/api';
import TextInput from '../components/analysis/TextInput';
import FileUpload from '../components/analysis/FileUpload';
import ResultsDisplay from '../components/analysis/ResultsDisplay';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const AnalyzePage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (texts) => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await analyzeTexts(texts);
      setResults(response.results);
    } catch (err) {
      setError(err.message || 'Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const handleFileResults = (fileResults) => {
    setResults(fileResults);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Text Analysis</h1>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      <div className="space-y-6 mb-8">
        <TextInput onAnalyze={handleAnalyze} disabled={loading} />
        <div className="text-center text-gray-500">OR</div>
        <FileUpload onAnalyze={handleFileResults} disabled={loading} />
      </div>

      {loading && <Loading message="Analyzing text..." />}

      {results && !loading && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Results</h2>
          <ResultsDisplay results={results} />
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
