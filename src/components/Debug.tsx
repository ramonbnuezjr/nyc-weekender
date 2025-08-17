'use client';

import { useState } from 'react';

export default function Debug() {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testWeatherAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/weather');
      const data = await response.json();
      setDebugInfo(`Weather API Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setDebugInfo(`Weather API Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testEventsAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setDebugInfo(`Events API Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setDebugInfo(`Events API Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testChatAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What\'s going on in Central Park this weekend?' }),
      });
      const data = await response.json();
      setDebugInfo(`Chat API Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setDebugInfo(`Chat API Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnvironment = () => {
    const envVars = [
      'GEMINI_API_KEY',
      'OPENWEATHER_API_KEY',
      'NYC_OPEN_DATA_APP_TOKEN',
      'WEATHER_PROVIDER',
      'OPENWEATHER_BASE',
      'NYC_TIMEZONE',
      'DEFAULT_LAT',
      'DEFAULT_LON',
      'MODEL_ID'
    ];
    
    const envInfo = envVars.map(varName => {
      const value = process.env[varName];
      return `${varName}: ${value ? '✅ Set' : '❌ Missing'}`;
    }).join('\n');
    
    setDebugInfo(`Environment Variables:\n${envInfo}\n\nNote: Client-side env vars are limited in Next.js`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-[#303134] rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-white">Debug Panel</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={testWeatherAPI}
          disabled={isLoading}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Test Weather API
        </button>
        
        <button
          onClick={testEventsAPI}
          disabled={isLoading}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          Test Events API
        </button>
        
        <button
          onClick={testChatAPI}
          disabled={isLoading}
          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          Test Chat API
        </button>
        
        <button
          onClick={checkEnvironment}
          className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Check Environment
        </button>
      </div>
      
      {debugInfo && (
        <div className="mt-4 p-3 bg-[#202124] rounded border border-gray-600">
          <h4 className="font-medium mb-2 text-white">Debug Output:</h4>
          <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-64 text-gray-300">
            {debugInfo}
          </pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-300">
        <p><strong>Common Issues:</strong></p>
        <ul className="list-disc list-inside mt-2">
          <li>Missing GEMINI_API_KEY in .env.local</li>
          <li>Missing OPENWEATHER_API_KEY in .env.local</li>
          <li>Missing NYC_OPEN_DATA_APP_TOKEN in .env.local</li>
          <li>Development server needs restart after env changes</li>
          <li>API routes returning 500 errors</li>
        </ul>
        
        <p className="mt-2"><strong>New Features:</strong></p>
        <ul className="list-disc list-inside mt-2">
          <li>✅ Real events from NYC Parks Open Data</li>
          <li>✅ Spatial filtering for Central Park events</li>
          <li>✅ Weekend time filtering</li>
          <li>✅ Enhanced AI responses with event context</li>
        </ul>
        
        <p className="mt-2"><strong>Get NYC Open Data App Token:</strong></p>
        <p className="text-xs text-gray-400 mt-1">
          Visit <a href="https://dev.socrata.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://dev.socrata.com/register</a> for free access
        </p>
      </div>
    </div>
  );
}
