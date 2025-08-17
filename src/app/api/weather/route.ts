import { NextRequest, NextResponse } from 'next/server';
import { getNextWeekend } from '@/lib/time';
import { generateMockWeather } from '@/lib/nyc-data';

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
      console.error('OpenWeatherMap API key not configured, using mock weather data');
      const mockWeather = generateMockWeather();
      return NextResponse.json({
        ...mockWeather,
        metadata: {
          ...mockWeather.metadata,
          note: 'Using mock weather data due to missing API key'
        }
      });
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || DEFAULT_LAT;
    const lon = searchParams.get('lon') || DEFAULT_LON;
    
    const { saturday, sunday } = getNextWeekend();
    
    const weatherUrl = `${OPENWEATHER_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial&cnt=40`;
    
    console.log('Calling OpenWeatherMap API:', weatherUrl.replace(OPENWEATHER_API_KEY, 'HIDDEN'));
    
    const response = await fetch(weatherUrl);
    
    console.log('OpenWeatherMap response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWeatherMap API error:', response.status, errorText);
      
      // Fall back to mock weather data instead of throwing an error
      console.log('OpenWeatherMap API failed, using mock weather data as fallback');
      const mockWeather = generateMockWeather();
      return NextResponse.json({
        ...mockWeather,
        metadata: {
          ...mockWeather.metadata,
          note: 'Using mock weather data due to OpenWeatherMap API error',
          original_error: `${response.status}: ${errorText}`
        }
      });
    }
    
    const weatherData = await response.json();
    console.log('OpenWeatherMap data received, processing...');
    
    const processedData = processOpenWeatherData(weatherData, saturday, sunday);
    
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
    
    // Even on error, return mock weather data so the UI can still work
    console.log('Weather API error occurred, using mock weather data as fallback');
    const mockWeather = generateMockWeather();
    
    return NextResponse.json({
      ...mockWeather,
      metadata: {
        ...mockWeather.metadata,
        note: 'Using mock weather data due to API error',
        error_details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}

function processOpenWeatherData(weatherData: any, saturday: Date, sunday: Date) {
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
