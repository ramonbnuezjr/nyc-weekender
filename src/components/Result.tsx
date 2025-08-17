'use client';

import { formatWeatherSummary } from '@/lib/prompts';

interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
    date: string; // Added for weather grid
  }[];
  metadata: {
    location: string;
    source: string;
    timestamp: string;
    note?: string; // Added for weather source
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

interface ResultProps {
  response: string;
  weather: WeatherData | null;
  events: EventsData | null;
  query: string;
  isLoading?: boolean;
}

/**
 * Simple markdown renderer for basic formatting
 */
function renderMarkdown(text: string): string {
  return text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\*   (.*$)/gm, '• $1')
    .replace(/^\* (.*$)/gm, '• $1')
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

export default function Result({ response, weather, events, query, isLoading = false }: ResultProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 text-center">
        <div className="shimmer w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Thinking about Central Park...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      {/* Query Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
          <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-blue-200 text-sm font-medium">{query}</span>
        </div>
      </div>

      {/* AI Response Card */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">NYC Chat Central Park Assistant</h2>
            <div className="prose prose-invert max-w-none">
              <div 
                className="chat-response text-gray-200 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdown(response) 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      {events && events.events && events.events.length > 0 && (
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-700/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Real Events This Weekend</h3>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full border border-green-500/30">
              {events.events.length} events
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.events.slice(0, 6).map((event) => (
              <div key={event.id} className="event-card bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-gray-600/30 hover:border-green-500/50 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white group-hover:text-green-200 transition-colors duration-300">
                    {event.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.isFree 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {event.isFree ? 'Free' : 'Paid'}
                  </span>
                </div>
                
                {event.description && (
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    {event.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(event.startTime).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  
                  {event.ticketUrl && (
                    <a 
                      href={event.ticketUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                    >
                      Tickets
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-green-700/30">
            <p className="text-sm text-green-300 text-center">
              Source: NYC Open Data + Mock Data Fallback • Updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Weather Summary */}
      {weather && (
        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm border border-blue-700/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Weather Forecast</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Handle both mock weather and real OpenWeatherMap data structures */}
            {weather.daily && (
              // Check if it's the mock weather structure (with arrays)
              'time' in weather.daily && Array.isArray(weather.daily.time) ? (
                // Mock weather structure
                (weather.daily as any).time.map((date: string, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-blue-800/20 to-indigo-800/20 p-4 rounded-xl border border-blue-600/30">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {index === 0 ? 'Saturday' : 'Sunday'} ({date})
                    </h4>
                    <div className="space-y-2 text-sm text-blue-200">
                      <div className="flex justify-between">
                        <span>High:</span>
                        <span className="font-medium">{(weather.daily as any).temperature_2m_max[index]}°F</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Low:</span>
                        <span className="font-medium">{(weather.daily as any).temperature_2m_min[index]}°F</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rain:</span>
                        <span className="font-medium">{(weather.daily as any).precipitation_probability_max[index]}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Humidity:</span>
                        <span className="font-medium">{(weather.daily as any).humidity?.[index] || 'N/A'}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Real OpenWeatherMap structure (array of daily objects)
                Array.isArray(weather.daily) && weather.daily.length > 0 ? (
                  weather.daily.slice(0, 2).map((day: any, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-blue-800/20 to-indigo-800/20 p-4 rounded-xl border border-blue-600/30">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {index === 0 ? 'Saturday' : 'Sunday'} ({day.date})
                      </h4>
                      <div className="space-y-2 text-sm text-blue-200">
                        <div className="flex justify-between">
                          <span>High:</span>
                          <span className="font-medium">{day.temperature_2m_max}°F</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Low:</span>
                          <span className="font-medium">{day.temperature_2m_min}°F</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rain:</span>
                          <span className="font-medium">{day.precipitation_probability_max}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Humidity:</span>
                          <span className="font-medium">{day.humidity || 'N/A'}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback for unknown structure
                  <div className="col-span-2 bg-gradient-to-br from-blue-800/20 to-indigo-800/20 p-6 rounded-xl border border-blue-600/30">
                    <h4 className="text-lg font-semibold text-white mb-3">Weather Information</h4>
                    <p className="text-blue-200 text-sm">
                      Weather data is currently being processed. Please check back shortly for the latest forecast.
                    </p>
                  </div>
                )
              )
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-700/30">
            <p className="text-sm text-blue-300 text-center">
              Source: {weather.metadata?.note || weather.metadata?.source || 'OpenWeatherMap'} • Updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          {events && events.events && events.events.length > 0 
            ? 'Real events from NYC Parks Open Data. Weather context provided for planning.'
            : 'Events and specific activities will be available in the next version. For now, we provide weather-aware general suggestions.'
          }
        </p>
      </div>
    </div>
  );
}
