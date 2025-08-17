'use client';

import { useState } from 'react';
import Search from '@/components/Search';
import Result from '@/components/Result';

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

interface CentralParkEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isFree: boolean;
  ticketUrl?: string;
  category?: string;
  location: {
    lat: number;
    lng: number;
  };
  source: string;
}

interface EventsData {
  events: CentralParkEvent[];
  metadata: {
    total_events: number;
    source: string;
    timestamp: string;
  };
}

interface ChatResponse {
  response: string;
  weather: WeatherData | null;
  events: EventsData | null;
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
    <main className="min-h-screen bg-[#202124]">
      <div className="container mx-auto px-4 py-12">

        {/* Search Component - Now includes the NYC logo */}
        <Search onSearch={handleSearch} />

        {/* Error Display */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">Error</h3>
                  <p className="text-sm text-red-200 mt-1">{error}</p>
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
            events={chatResponse.events}
            query={currentQuery}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="w-full max-w-2xl mx-auto mt-8 p-8 text-center">
            <div className="shimmer w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Thinking about Central Park...</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-400">
          <p>
            Powered by Google Gemini AI • Weather data from OpenWeatherMap • 
            Events from NYC Parks Open Data • Built for NYC weekend planning
          </p>
          <p className="mt-2">
            Real events and activities powered by NYC Open Data
          </p>
        </div>
      </div>
    </main>
  );
}
