import { NextRequest, NextResponse } from 'next/server';
import { getNextWeekend } from '@/lib/time';

// Force dynamic runtime to prevent build-time execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';
export const runtime = 'nodejs';

const OPENWEATHER_BASE = process.env.OPENWEATHER_BASE || 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const DEFAULT_LAT = process.env.DEFAULT_LAT || '40.7812';
const DEFAULT_LON = process.env.DEFAULT_LON || '-73.9665';

export async function GET(request: NextRequest) {
  try {
    console.log('Weather API called with env vars:', {
      OPENWEATHER_BASE,
      OPENWEATHER_API_KEY: OPENWEATHER_API_KEY ? 'SET' : 'MISSING',
      DEFAULT_LAT,
      DEFAULT_LON
    });

    if (!OPENWEATHER_API_KEY) {
      console.error('OpenWeatherMap API key not configured');
      return NextResponse.json(
        { error: 'OpenWeatherMap API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || DEFAULT_LAT;
    const lon = searchParams.get('lon') || DEFAULT_LON;
    
    // Get weekend dates for weather forecast
    const { saturday, sunday } = getNextWeekend();
    
    // OpenWeatherMap forecast endpoint (5-day forecast)
    const weatherUrl = `${OPENWEATHER_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial&cnt=40`;
    
    console.log('Calling OpenWeatherMap API:', weatherUrl.replace(OPENWEATHER_API_KEY, 'HIDDEN'));
    
    const response = await fetch(weatherUrl);
    
    console.log('OpenWeatherMap response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWeatherMap API error:', response.status, errorText);
      throw new Error(`OpenWeatherMap API error: ${response.status} - ${errorText}`);
    }
    
    const weatherData = await response.json();
    console.log('OpenWeatherMap data received, processing...');
    
    // Process OpenWeatherMap data to match our expected format
    const processedData = processOpenWeatherData(weatherData, saturday, sunday);
    
    // Add metadata
    const enrichedData = {
      ...processedData,
      metadata: {
        location: 'Central Park, NYC',
        coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
        forecast_period: { 
          start: saturday.toISOString().split('T')[0], 
          end: sunday.toISOString().split('T')[0] 
        },
        source: 'OpenWeatherMap',
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('Weather data processed successfully');
    return NextResponse.json(enrichedData);
    
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function processOpenWeatherData(weatherData: any, saturday: Date, sunday: Date) {
  // OpenWeatherMap returns data in 3-hour intervals
  const saturdayStr = saturday.toISOString().split('T')[0];
  const sundayStr = sunday.toISOString().split('T')[0];
  
  const saturdayData = weatherData.list.filter((item: any) => 
    item.dt_txt.startsWith(saturdayStr)
  );
  
  const sundayData = weatherData.list.filter((item: any) => 
    item.dt_txt.startsWith(sundayStr)
  );
  
  console.log('Filtered data:', {
    saturday: saturdayStr,
    sunday: sundayStr,
    saturdayCount: saturdayData.length,
    sundayCount: sundayData.length
  });
  
  // Calculate min/max temperatures and precipitation for each day
  const getDayStats = (dayData: any[]) => {
    if (dayData.length === 0) return { min: 0, max: 0, precipitation: 0 };
    
    const temps = dayData.map((item: any) => item.main.temp);
    const precip = dayData.map((item: any) => item.pop * 100); // Convert to percentage
    
    return {
      min: Math.min(...temps),
      max: Math.max(...temps),
      precipitation: Math.max(...precip)
    };
  };
  
  const satStats = getDayStats(saturdayData);
  const sunStats = getDayStats(sundayData);
  
  return {
    daily: {
      time: [saturdayStr, sundayStr],
      temperature_2m_min: [satStats.min, sunStats.min],
      temperature_2m_max: [satStats.max, sunStats.max],
      precipitation_probability_max: [Math.round(satStats.precipitation), Math.round(sunStats.precipitation)],
      weather_code: [1, 1] // Placeholder, OpenWeatherMap uses different codes
    }
  };
}
