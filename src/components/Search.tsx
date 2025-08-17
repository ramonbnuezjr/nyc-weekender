'use client';

import { useState } from 'react';

interface SearchProps {
  onSearch: (message: string) => void;
  isLoading: boolean;
}

export default function Search({ onSearch, isLoading }: SearchProps) {
  const [message, setMessage] = useState('');

  console.log('Search component render - message:', message, 'isLoading:', isLoading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with message:', message);
    if (message.trim() && !isLoading) {
      onSearch(message.trim());
      setMessage('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed from:', message, 'to:', newValue);
    setMessage(newValue);
  };

  const handleExampleClick = (example: string) => {
    console.log('Example clicked:', example);
    onSearch(example);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Simple test input */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h3 className="text-sm font-medium mb-2">Test Input (should work):</h3>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type here to test..."
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-500 mt-1">Current value: "{message}"</p>
      </div>

      {/* Main search form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Ask about Central Park this weekend..."
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>
      
      {/* Example queries */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p className="mb-2">Try asking:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "What's the weather in Central Park this weekend?",
            "What should I plan for Central Park this weekend?",
            "What's going on in Central Park this weekend?"
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      
      {/* Debug info */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        Debug: Message length: {message.length} | IsLoading: {isLoading.toString()}
      </div>
    </div>
  );
}
