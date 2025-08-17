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
      {/* Google Logo */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-light text-white mb-2">NYC</h1>
        <p className="text-xl text-gray-400">Central Park Weekend Assistant</p>
      </div>

      {/* Google-style Search Bar */}
      <div className="relative mb-8">
        <div className="google-search flex items-center px-6 py-4">
          {/* Search Icon */}
          <svg className="w-5 h-5 text-gray-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Search Input */}
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Ask about Central Park this weekend..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Microphone Icon */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            {/* Camera Icon */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            {/* AI Mode Button */}
            <button className="google-button px-4 py-2 text-sm font-medium">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI Mode</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Google-style Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => onSearch(message)}
          disabled={!message.trim() || isLoading}
          className="google-button px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'NYC Search'}
        </button>
        
        <button
          onClick={() => onSearch("What's the weather in Central Park this weekend?")}
          className="google-button px-6 py-3 text-sm font-medium"
        >
          I'm Feeling Lucky
        </button>
      </div>
      
      {/* Example Queries */}
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-3">Try asking:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "What's the weather in Central Park this weekend?",
            "What should I plan for Central Park this weekend?",
            "What's going on in Central Park this weekend?"
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      
      {/* Debug info - Remove in production */}
      <div className="mt-8 text-xs text-gray-500 text-center">
        Debug: Message length: {message.length} | IsLoading: {isLoading.toString()}
      </div>
    </div>
  );
}
