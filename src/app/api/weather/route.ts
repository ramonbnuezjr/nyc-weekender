import { NextRequest, NextResponse } from 'next/server';
import { getNextWeekend } from '@/lib/time';

// Force dynamic runtime to prevent build-time execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';
export const runtime = 'nodejs';

const OPEN_METEO_BASE = process.env.OPEN_METEO_BASE || 'https://api.open-meteo.com';
const DEFAULT_LAT = process.env.DEFAULT_LAT || '40.7812';
const DEFAULT_LON = process.env.DEFAULT_LON || '-73.9665';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || DEFAULT_LAT;
    const lon = searchParams.get('lon') || DEFAULT_LON;
    
    // Get weekend dates for weather forecast
    const { saturday, sunday } = getNextWeekend();
    const startDate = saturday.toISOString().split('T')[0];
    const endDate = sunday.toISOString().split('T')[0];
    
    const weatherUrl = `${OPEN_METEO_BASE}/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=America/New_York&start_date=${startDate}&end_date=${endDate}`;
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const weatherData = await response.json();
    
    // Add metadata
    const enrichedData = {
      ...weatherData,
      metadata: {
        location: 'Central Park, NYC',
        coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
        forecast_period: { start: startDate, end: endDate },
        source: 'Open-Meteo',
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(enrichedData);
    
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
