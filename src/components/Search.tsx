'use client';

import React, { useState } from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const exampleQueries = [
    "What's going on in Central Park this weekend?",
    "Where can I relax in Central Park?"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* NYC Logo and Title */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-white mb-2">NYC</h1>
        <p className="text-xl text-gray-300">Central Park Weekend Assistant</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Central Park this weekend..."
            className="w-full pl-12 pr-4 py-4 text-lg bg-[#303134] border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-[#3c4043]"
          />
        </div>
      </form>

      {/* Example Queries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => {
            setQuery("What's going on in Central Park this weekend?");
            onSearch("What's going on in Central Park this weekend?");
          }}
          className="example-card group p-6 text-left rounded-xl"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                What's happening this weekend?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Discover events, activities, and the latest buzz in Central Park
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setQuery("Where can I relax in Central Park?");
            onSearch("Where can I relax in Central Park?");
          }}
          className="example-card relax group p-6 text-left rounded-xl"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-200 transition-colors duration-300">
                Find your peaceful spot
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Discover the best places to unwind and escape the city's energy
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
