import { useState, useEffect } from 'react';
import { getMeta } from '../services/api';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { Copy, Check } from 'lucide-react';

const ApiDocsPage = () => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const data = await getMeta();
        setMeta(data);
      } catch (err) {
        setError(err.message || 'Failed to load API metadata');
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  const copyToClipboard = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CodeBlock = ({ code, id }) => (
    <div className="relative group">
      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200 max-w-full scrollbar-thin">
        {code}
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-700/90 rounded
                   hover:bg-white dark:hover:bg-gray-700 transition-all duration-200
                   opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Copy code"
      >
        {copiedCode === id ? (
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </div>
  );

  if (loading) return <Loading message="Loading API documentation..." />;
  if (error) return <ErrorMessage message={error} />;

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">API Documentation</h1>
        <p className="text-gray-600 dark:text-gray-400">Complete reference for the UNIP API endpoints</p>
      </div>

      {/* Health Endpoint */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-semibold">GET</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">/api/v1/health</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Check the health status of the API service.</p>

        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Response:</h3>
        <CodeBlock
          id="health-response"
          code={`{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000000",
  "service": "UNIP API"
}`}
        />

        <h3 className="font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">Example:</h3>
        <CodeBlock
          id="health-curl"
          code={`curl ${apiBaseUrl}/api/v1/health`}
        />
      </div>

      {/* Meta Endpoint */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold">GET</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">/api/v1/meta</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Get API metadata, capabilities, and model information.</p>

        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Response:</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
{`{
  "version": "1.0.0",
  "pipeline_version": "1.0.0",
  "capabilities": {
    "nlp_tasks": ["sentiment_analysis", "keyword_extraction", "topic_modeling", "summarization"],
    "supported_formats": ["text", "txt", "csv", "pdf"],
    "batch_processing": true,
    "max_batch_size": 100
  },
  "models": {
    "sentiment": "cardiffnlp/twitter-roberta-base-sentiment-latest",
    "summary": "facebook/bart-large-cnn",
    "keywords": "all-MiniLM-L6-v2"
  }
}`}
        </pre>

        <h3 className="font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">Example:</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
{`curl ${apiBaseUrl}/api/v1/meta`}
        </pre>
      </div>

      {/* Analyze Text Endpoint */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-semibold">POST</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">/api/v1/analyze</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Analyze one or more texts using the NLP pipeline.</p>

        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Request Body:</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
{`{
  "texts": ["Text to analyze"],
  "tasks": ["sentiment", "keywords", "topics", "summary"]  // Optional
}`}
        </pre>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <strong>Parameters:</strong>
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ml-4 mb-4">
          <li><strong>texts</strong> (required): Array of strings, 1-100 texts</li>
          <li><strong>tasks</strong> (optional): Array of task names. Valid values: "sentiment", "keywords", "topics", "summary"</li>
        </ul>

        <h3 className="font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">Response:</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
{`{
  "results": [
    {
      "text": "Original text",
      "sentiment": {
        "label": "positive",
        "score": 0.95
      },
      "keywords": [
        {"keyword": "example", "score": 0.85}
      ],
      "topics": [
        {
          "topic_id": 0,
          "keywords": ["keyword1", "keyword2"],
          "score": 0.75
        }
      ],
      "summary": "Generated summary..."
    }
  ],
  "metadata": {
    "timestamp": "2024-01-01T12:00:00.000000",
    "pipeline_version": "1.0.0"
  }
}`}
        </pre>

        <h3 className="font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">Example: cURL</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
{`curl -X POST ${apiBaseUrl}/api/v1/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "texts": ["This is a great product!"],
    "tasks": ["sentiment", "keywords"]
  }'`}
        </pre>

        <h3 className="font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">Example: JavaScript</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
{`const response = await fetch('${apiBaseUrl}/api/v1/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    texts: ['This is a great product!'],
    tasks: ['sentiment', 'keywords']
  })
});
const data = await response.json();
console.log(data);`}
        </pre>
      </div>

      {/* Analyze File Endpoint */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-semibold">POST</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">/api/v1/analyze/file</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Analyze text from an uploaded file. Supports TXT, CSV, and PDF formats.</p>

        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Request:</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>Content-Type:</strong> multipart/form-data
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ml-4 mb-4">
          <li><strong>file</strong> (required): File to upload (.txt, .csv, or .pdf)</li>
          <li><strong>tasks</strong> (optional): Comma-separated list of tasks (e.g., "sentiment,keywords")</li>
        </ul>

        <h3 className="font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">Response:</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Same format as <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">/api/v1/analyze</code></p>

        <h3 className="font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">Example: cURL</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
{`curl -X POST ${apiBaseUrl}/api/v1/analyze/file \\
  -F "file=@document.txt" \\
  -F "tasks=sentiment,keywords,summary"`}
        </pre>

        <h3 className="font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">Example: JavaScript</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
{`const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('tasks', 'sentiment,keywords');

const response = await fetch('${apiBaseUrl}/api/v1/analyze/file', {
  method: 'POST',
  body: formData
});
const data = await response.json();
console.log(data);`}
        </pre>
      </div>

      {/* API Capabilities */}
      {meta && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">API Capabilities</h2>
          <div className="space-y-3">
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Version:</strong>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{meta.version}</span>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Pipeline Version:</strong>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{meta.pipeline_version}</span>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">NLP Tasks:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {meta.capabilities?.nlp_tasks?.map((task, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">{task}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Supported Formats:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {meta.capabilities?.supported_formats?.map((format, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">{format}</li>
                ))}
              </ul>
            </div>
            {meta.capabilities?.max_batch_size && (
              <div>
                <strong className="text-gray-900 dark:text-gray-100">Max Batch Size:</strong>
                <span className="ml-2 text-gray-700 dark:text-gray-300">{meta.capabilities.max_batch_size} texts</span>
              </div>
            )}
            {meta.models && (
              <div>
                <strong className="text-gray-900 dark:text-gray-100">Models:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {Object.entries(meta.models).map(([key, value]) => (
                    <li key={key} className="text-gray-700 dark:text-gray-300">
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rate Limiting Info */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mt-6">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">Rate Limiting</h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          API requests are limited to 10 requests per minute per IP address. Rate limit headers are included in responses.
        </p>
      </div>
    </div>
  );
};

export default ApiDocsPage;
