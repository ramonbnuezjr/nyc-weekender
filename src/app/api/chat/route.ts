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
    
    // Fetch events data for Central Park
    const eventsResponse = await fetch(`${request.nextUrl.origin}/api/events`);
    let eventsData = null;
    
    if (eventsResponse.ok) {
      eventsData = await eventsResponse.json();
      console.log(`Events data fetched successfully: ${eventsData.events?.length || 0} events`);
    } else {
      console.log('Events API returned error:', eventsResponse.status);
    }
    
    // Determine the type of query and select appropriate prompt
    const userPrompt = message;
    let systemPrompt = SYSTEM_PROMPT;
    
    if (message.toLowerCase().includes('weather')) {
      systemPrompt += '\n\n' + WEATHER_QUERY_PROMPT;
    } else if (message.toLowerCase().includes('going on') || message.toLowerCase().includes('events')) {
      // Enhanced prompt for events queries
      systemPrompt += '\n\n' + `Based on real NYC Parks events data for Central Park this weekend:

EVENTS DATA:
${eventsData?.events?.length > 0 ? 
  eventsData.events.map((event: any) => 
    `- ${event.title} (${event.startTime}) - ${event.isFree ? 'Free' : 'Paid'}${event.description ? ` - ${event.description}` : ''}`
  ).join('\n') : 
  'No events found for this weekend'
}

WEATHER FORECAST:
${weatherData ? formatWeatherSummary(weatherData) : 'Weather data unavailable'}

Please create a compelling, story-driven response that:

1. **Tells a story** about what someone could experience this weekend in Central Park
2. **Weaves together** the weather conditions and available events
3. **Creates an emotional connection** to the park experience
4. **Provides practical insights** without listing out event details

EXAMPLE STORY APPROACH:
- "Picture yourself on a [weather description] Saturday morning in Central Park..."
- "As the sun [weather context], you could [event suggestion]..."
- "The perfect weekend for [weather-appropriate activity] while [event opportunity]..."

IMPORTANT: 
- Only mention events that are actually in the data. Never invent or hallucinate events.
- DO NOT list out all the individual events with times/details - that information is displayed separately in the UI.
- Focus on storytelling and emotional connection, not data listing.
- The user can see the detailed event list below your response.

FORMATTING: Use clear, readable formatting with proper spacing and structure.`;
    } else if (message.toLowerCase().includes('relax') || message.toLowerCase().includes('peaceful') || message.toLowerCase().includes('quiet')) {
      // Enhanced prompt for relaxation queries
      systemPrompt += '\n\n' + `Based on real NYC Parks events data and weather for Central Park this weekend:

EVENTS DATA:
${eventsData?.events?.length > 0 ? 
  eventsData.events.map((event: any) => 
    `- ${event.title} (${event.startTime}) - ${event.isFree ? 'Free' : 'Paid'}${event.description ? ` - ${event.description}` : ''}`
  ).join('\n') : 
  'No events found for this weekend'
}

WEATHER FORECAST:
${weatherData ? formatWeatherSummary(weatherData) : 'Weather data unavailable'}

Please create a beautiful, calming response about finding peaceful spots in Central Park:

1. **Paint a picture** of Central Park as a peaceful escape from the city
2. **Suggest specific relaxing locations** that are perfect for the current weather
3. **Mention any relevant events** that could enhance the relaxation experience
4. **Create an emotional connection** to finding peace in nature

EXAMPLE APPROACH:
- "Central Park offers many peaceful spots perfect for [weather description]..."
- "For a truly relaxing experience, consider visiting [specific location]..."
- "The [weather condition] makes this an ideal time to [relaxing activity]..."

IMPORTANT: 
- Focus on relaxation and peaceful experiences
- Suggest real locations and activities
- Keep the tone calming and inviting
- Use beautiful, descriptive language

FORMATTING: Use clear, readable formatting with proper spacing and structure.`;
    } else if (message.toLowerCase().includes('plan') || message.toLowerCase().includes('suggest')) {
      systemPrompt += '\n\n' + WEATHER_CONTEXT_PROMPT.replace('{weather_summary}', weatherData ? formatWeatherSummary(weatherData) : 'Weather data unavailable');
      
      // Add events context if available
      if (eventsData?.events?.length > 0) {
        systemPrompt += `\n\nREAL EVENTS THIS WEEKEND:
${eventsData.events.map((event: any) => 
  `- ${event.title} (${event.startTime}) - ${event.isFree ? 'Free' : 'Paid'}`
).join('\n')}

Create a compelling story that weaves together the weather and events. Focus on storytelling and emotional connection rather than listing event details!`;
      }
    }
    
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: MODEL_ID });
    
    // Create chat session
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 800, // Increased for event data
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
      hasEventsData: !!eventsData,
      eventCount: eventsData?.events?.length || 0,
      model: MODEL_ID,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      response: responseText,
      weather: weatherData,
      events: eventsData,
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
