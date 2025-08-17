import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, WEATHER_CONTEXT_PROMPT, WEATHER_QUERY_PROMPT, formatWeatherSummary } from '@/lib/prompts';

// Force dynamic runtime to prevent build-time execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';
export const runtime = 'nodejs';

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing environment variable: ${name}`);
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Read env vars at runtime, not build time
    const GEMINI_API_KEY = getEnv('GEMINI_API_KEY');
    const MODEL_ID = process.env.MODEL_ID || 'gemini-2.0-flash';

    console.log('Environment check passed, initializing Gemini...');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    console.log('Processing message:', message);
    
    // Fetch weather data for Central Park
    const weatherResponse = await fetch(`${request.nextUrl.origin}/api/weather`);
    let weatherData = null;
    
    if (weatherResponse.ok) {
      weatherData = await weatherResponse.json();
      console.log('Weather data fetched successfully');
    } else {
      console.log('Weather API returned error:', weatherResponse.status);
    }
    
    // Determine the type of query and select appropriate prompt
    const userPrompt = message;
    let systemPrompt = SYSTEM_PROMPT;
    
    if (message.toLowerCase().includes('weather')) {
      systemPrompt += '\n\n' + WEATHER_QUERY_PROMPT;
    } else if (message.toLowerCase().includes('plan') || message.toLowerCase().includes('going on') || message.toLowerCase().includes('suggest')) {
      systemPrompt += '\n\n' + WEATHER_CONTEXT_PROMPT.replace('{weather_summary}', weatherData ? formatWeatherSummary(weatherData) : 'Weather data unavailable');
    }
    
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: MODEL_ID });
    
    // Create chat session
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });
    
    // Send message with context - combine system prompt and user message
    const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;
    console.log('Sending to Gemini:', fullPrompt.substring(0, 200) + '...');
    
    const result = await chat.sendMessage(fullPrompt);
    
    const response = await result.response;
    const responseText = response.text();
    
    const duration = Date.now() - startTime;
    
    // Log request for observability
    console.log(`Chat request processed in ${duration}ms`, {
      messageLength: message.length,
      hasWeatherData: !!weatherData,
      model: MODEL_ID,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      response: responseText,
      weather: weatherData,
      metadata: {
        duration,
        model: MODEL_ID,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Chat API error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to process chat request';
    if (error instanceof Error) {
      if (error.message.includes('Missing environment variable')) {
        errorMessage = 'API configuration error: Missing required environment variables';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        metadata: {
          duration,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}
