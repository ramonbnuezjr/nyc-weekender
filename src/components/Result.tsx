'use client';

import { formatWeatherSummary } from '@/lib/prompts';

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

interface ResultProps {
  response: string;
  weather: WeatherData | null;
  query: string;
  isLoading?: boolean;
}

export default function Result({ response, weather, query, isLoading = false }: ResultProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="bg-[#303134] rounded-lg shadow-lg p-6 animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* Query */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">You asked:</p>
        <p className="text-lg font-medium text-white">{query}</p>
      </div>

      {/* Response Card */}
      <div className="bg-[#303134] rounded-lg shadow-lg overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold text-sm">NYC</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">NYC Chat</h3>
              <p className="text-blue-100 text-sm">Central Park Assistant</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
              {response}
            </div>
          </div>

          {/* Weather Summary */}
          {weather && (
            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
              <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.004 5.004 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Weather Forecast
              </h4>
              <div className="text-sm text-blue-200">
                {formatWeatherSummary(weather)}
              </div>
              <p className="text-xs text-blue-300 mt-2">
                Source: {weather.metadata.source} • Updated: {new Date(weather.metadata.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <p className="text-xs text-gray-400 text-center">
              Events and specific activities will be available in the next version. 
              For now, we provide weather-aware general suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
