import { useState, useEffect } from 'react';
import { getMeta } from '../services/api';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const ApiDocsPage = () => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <Loading message="Loading API documentation..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Endpoint: POST /api/v1/analyze</h2>
        <p className="text-gray-700 mb-4">Analyze one or more texts using the NLP pipeline.</p>

        <h3 className="font-semibold mb-2">Request Body:</h3>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "texts": ["Text to analyze"],
  "tasks": ["sentiment", "keywords", "topics", "summary"]  // Optional
}`}
        </pre>

        <h3 className="font-semibold mb-2 mt-4">Response:</h3>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
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
      "topics": [...],
      "summary": "Generated summary..."
    }
  ],
  "metadata": {...}
}`}
        </pre>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Example: cURL</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST http://localhost:8000/api/v1/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "texts": ["This is a great product!"],
    "tasks": ["sentiment"]
  }'`}
        </pre>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Example: JavaScript</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`const response = await fetch('http://localhost:8000/api/v1/analyze', {
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

      {meta && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">API Capabilities</h2>
          <div className="space-y-2">
            <p><strong>Version:</strong> {meta.version}</p>
            <p><strong>Pipeline Version:</strong> {meta.pipeline_version}</p>
            <div>
              <strong>NLP Tasks:</strong>
              <ul className="list-disc list-inside ml-4">
                {meta.capabilities?.nlp_tasks?.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Supported Formats:</strong>
              <ul className="list-disc list-inside ml-4">
                {meta.capabilities?.supported_formats?.map((format, idx) => (
                  <li key={idx}>{format}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDocsPage;
