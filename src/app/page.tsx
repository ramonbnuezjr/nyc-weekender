'use client';

import { useState } from 'react';
import Search from '@/components/Search';
import Result from '@/components/Result';
import Debug from '@/components/Debug';

interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
  metadata: {
    location: string;
    source: string;
    timestamp: string;
  };
}

interface ChatResponse {
  response: string;
  weather: WeatherData | null;
  metadata: {
    duration: number;
    model: string;
    timestamp: string;
  };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testInput, setTestInput] = useState('');

  const handleSearch = async (message: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(message);
    setChatResponse(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setChatResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NYC Chatbot
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI assistant for Central Park and NYC weekend planning. 
            Get weather-aware suggestions and local insights.
          </p>
        </div>

        {/* Test Input - Remove this after fixing */}
        <div className="w-full max-w-2xl mx-auto mb-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">🧪 Test Input (Debug)</h3>
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Type here to test React state..."
            className="w-full p-3 border rounded-lg"
          />
          <p className="text-sm text-gray-600 mt-2">
            Current value: <strong>"{testInput}"</strong> | Length: {testInput.length}
          </p>
        </div>

        {/* Search Component */}
        <Search onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {chatResponse && (
          <Result
            response={chatResponse.response}
            weather={chatResponse.weather}
            query={currentQuery}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <Result
            response=""
            weather={null}
            query={currentQuery}
            isLoading={true}
          />
        )}

        {/* Debug Panel - Remove this after fixing issues */}
        <Debug />

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            Powered by Google Gemini AI • Weather data from Open-Meteo • 
            Built for NYC weekend planning
          </p>
          <p className="mt-2">
            Events and specific activities coming in v0.1
          </p>
        </div>
      </div>
    </main>
  );
}
