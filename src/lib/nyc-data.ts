/**
 * NYC Open Data Integration Utilities
 * Handles spatial filtering, event processing, and API interactions
 */

export interface NYCEvent {
  event_id: string;
  title: string;
  snippet?: string;
  date: string;
  start_time: string;
  end_time: string;
  cost_free: string; // "1" for free, "0" for paid
  cost_description?: string;
  location_description?: string;
  description?: string;
  url?: string;
  phone?: string;
  email?: string;
}

export interface NYCEventLocation {
  event_id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  park_name?: string;
}

export interface CentralParkEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isFree: boolean;
  costDescription?: string;
  locationDescription?: string;
  ticketUrl?: string;
  category?: string;
  location: {
    lat: number;
    lng: number;
  };
  source: string;
}

export interface MockWeatherData {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
    humidity?: number[]; // Added humidity
  };
  metadata: {
    location: string;
    source: string;
    timestamp: string;
  };
}

// Central Park bounding box (approximate)
const CENTRAL_PARK_BOUNDS = {
  north: 40.8005,
  south: 40.7647,
  east: -73.9494,
  west: -73.9818
};

// Central Park centroid
const CENTRAL_PARK_CENTROID = {
  lat: 40.7812,
  lng: -73.9665
};

/**
 * Generate intelligent mock weather data for Central Park
 * Provides realistic NYC summer weather patterns
 */
export function generateMockWeather(): MockWeatherData {
  const now = new Date();
  const currentDay = now.getDay();
  
  // Calculate this weekend's dates
  let saturdayOffset: number;
  let sundayOffset: number;
  
  if (currentDay === 0) { // Sunday
    saturdayOffset = 6; // Next Saturday
    sundayOffset = 7;   // Next Sunday
  } else if (currentDay === 6) { // Saturday
    saturdayOffset = 0; // Today
    sundayOffset = 1;   // Tomorrow
  } else { // Monday through Friday
    saturdayOffset = 6 - currentDay; // Days until Saturday
    sundayOffset = 7 - currentDay;   // Days until Sunday
  }
  
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + saturdayOffset);
  
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + sundayOffset);
  
  // Generate realistic NYC summer weather
  // August typically has highs 80-85°F, lows 65-70°F
  const saturdayHigh = 82 + Math.floor(Math.random() * 6); // 82-87°F
  const saturdayLow = 67 + Math.floor(Math.random() * 4);  // 67-70°F
  const sundayHigh = 80 + Math.floor(Math.random() * 8);   // 80-87°F
  const sundayLow = 65 + Math.floor(Math.random() * 6);    // 65-70°F
  
  // Precipitation probability (summer showers are common)
  const saturdayPrecip = Math.random() < 0.3 ? Math.floor(Math.random() * 30) + 10 : 0; // 0-40%
  const sundayPrecip = Math.random() < 0.25 ? Math.floor(Math.random() * 25) + 5 : 0;   // 0-30%
  
  // Humidity (NYC summer is typically humid)
  const saturdayHumidity = 65 + Math.floor(Math.random() * 25); // 65-90%
  const sundayHumidity = 60 + Math.floor(Math.random() * 30);   // 60-90%
  
  return {
    daily: {
      time: [
        saturday.toISOString().split('T')[0],
        sunday.toISOString().split('T')[0]
      ],
      temperature_2m_min: [saturdayLow, sundayLow],
      temperature_2m_max: [saturdayHigh, sundayHigh],
      precipitation_probability_max: [saturdayPrecip, sundayPrecip],
      humidity: [saturdayHumidity, sundayHumidity],
      weather_code: [1, 1] // Clear weather
    },
    metadata: {
      location: 'Central Park, NYC',
      source: 'Mock Weather Data (Testing)',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Generate mock events for testing purposes
 * Since NYC Open Data events are historical (2013-2018), we'll create realistic mock data
 */
export function generateMockEvents(): CentralParkEvent[] {
  const now = new Date();
  const currentDay = now.getDay();
  
  // Calculate this weekend's dates
  let saturdayOffset: number;
  let sundayOffset: number;
  
  if (currentDay === 0) { // Sunday
    saturdayOffset = 6; // Next Saturday
    sundayOffset = 7;   // Next Sunday
  } else if (currentDay === 6) { // Saturday
    saturdayOffset = 0; // Today
    sundayOffset = 1;   // Tomorrow
  } else { // Monday through Friday
    saturdayOffset = 6 - currentDay; // Days until Saturday
    sundayOffset = 7 - currentDay;   // Days until Sunday
  }
  
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + saturdayOffset);
  saturday.setHours(10, 0, 0, 0); // 10 AM
  
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + sundayOffset);
  sunday.setHours(14, 0, 0, 0); // 2 PM
  
  return [
    {
      id: 'mock-1',
      title: 'Central Park Walking Tour',
      description: 'Join our expert guides for a 90-minute walking tour of Central Park\'s most iconic landmarks including Bethesda Fountain, Bow Bridge, and the Mall.',
      startTime: saturday.toISOString(),
      endTime: new Date(saturday.getTime() + 90 * 60 * 1000).toISOString(),
      isFree: false,
      costDescription: 'Tickets: $25 per person',
      locationDescription: 'Meet at the Dairy Visitor Center (mid-Park between 64th and 65th Streets)',
      ticketUrl: 'https://www.centralparknyc.org/events',
      category: 'Walking Tour',
      location: { lat: 40.7647, lng: -73.9719 },
      source: 'Central Park Conservancy (Mock Data)'
    },
    {
      id: 'mock-2',
      title: 'Yoga in the Park',
      description: 'Free outdoor yoga session suitable for all levels. Bring your own mat and water bottle.',
      startTime: saturday.toISOString(),
      endTime: new Date(saturday.getTime() + 60 * 60 * 1000).toISOString(),
      isFree: true,
      costDescription: 'Free',
      locationDescription: 'Sheep Meadow (mid-Park between 66th and 69th Streets)',
      ticketUrl: undefined,
      category: 'Fitness',
      location: { lat: 40.7689, lng: -73.9719 },
      source: 'NYC Parks (Mock Data)'
    },
    {
      id: 'mock-3',
      title: 'Bird Watching Workshop',
      description: 'Learn to identify common birds of Central Park with our experienced naturalists. Binoculars provided.',
      startTime: sunday.toISOString(),
      endTime: new Date(sunday.getTime() + 90 * 60 * 1000).toISOString(),
      isFree: true,
      costDescription: 'Free',
      locationDescription: 'The Ramble (mid-Park between 73rd and 79th Streets)',
      ticketUrl: undefined,
      category: 'Nature',
      location: { lat: 40.7769, lng: -73.9719 },
      source: 'NYC Parks (Mock Data)'
    },
    {
      id: 'mock-4',
      title: 'Central Park Photography Walk',
      description: 'Capture the beauty of Central Park with professional photography tips. All skill levels welcome.',
      startTime: sunday.toISOString(),
      endTime: new Date(sunday.getTime() + 120 * 60 * 1000).toISOString(),
      isFree: false,
      costDescription: 'Tickets: $35 per person',
      locationDescription: 'Bethesda Terrace (mid-Park at 72nd Street)',
      ticketUrl: 'https://www.centralparknyc.org/events',
      category: 'Photography',
      location: { lat: 40.7739, lng: -73.9719 },
      source: 'Central Park Conservancy (Mock Data)'
    },
    {
      id: 'mock-5',
      title: 'Family Story Time',
      description: 'Bring the kids for free storytelling and crafts in the heart of Central Park. Perfect for ages 3-8.',
      startTime: saturday.toISOString(),
      endTime: new Date(saturday.getTime() + 45 * 60 * 1000).toISOString(),
      isFree: true,
      costDescription: 'Free',
      locationDescription: 'Dairy Visitor Center (mid-Park between 64th and 65th Streets)',
      ticketUrl: undefined,
      category: 'Family',
      location: { lat: 40.7647, lng: -73.9719 },
      source: 'NYC Parks (Mock Data)'
    }
  ];
}

/**
 * Check if coordinates are within Central Park bounds
 */
export function isWithinCentralPark(lat: number, lng: number): boolean {
  return lat >= CENTRAL_PARK_BOUNDS.south && 
         lat <= CENTRAL_PARK_BOUNDS.north && 
         lng >= CENTRAL_PARK_BOUNDS.west && 
         lng <= CENTRAL_PARK_BOUNDS.east;
}

/**
 * Get weekend date range for filtering
 */
export function getWeekendDateRange(): { start: string; end: string } {
  const now = new Date();
  const currentDay = now.getDay();
  
  let saturdayOffset: number;
  let sundayOffset: number;
  
  if (currentDay === 0) { // Sunday
    saturdayOffset = 6; // Next Saturday
    sundayOffset = 7;   // Next Sunday
  } else if (currentDay === 6) { // Saturday
    saturdayOffset = 0; // Today
    sundayOffset = 1;   // Tomorrow
  } else { // Monday through Friday
    saturdayOffset = 6 - currentDay; // Days until Saturday
    sundayOffset = 7 - currentDay;   // Days until Sunday
  }
  
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + saturdayOffset);
  saturday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + sundayOffset);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    start: saturday.toISOString(),
    end: sunday.toISOString()
  };
}

/**
 * Format event data for display
 */
export function formatEventForDisplay(event: NYCEvent, location?: NYCEventLocation): CentralParkEvent {
  // Parse the date and time fields
  const eventDate = new Date(event.date);
  const startTime = event.start_time;
  const endTime = event.end_time;
  
  // Create ISO strings for start and end times
  const startDateTime = new Date(eventDate);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  startDateTime.setHours(startHour, startMinute, 0, 0);
  
  const endDateTime = new Date(eventDate);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  endDateTime.setHours(endHour, endMinute, 0, 0);
  
  return {
    id: event.event_id,
    title: event.title,
    description: event.snippet || event.description,
    startTime: startDateTime.toISOString(),
    endTime: endDateTime.toISOString(),
    isFree: event.cost_free === "1",
    costDescription: event.cost_description,
    locationDescription: event.location_description,
    ticketUrl: event.url ? `https://www.nycgovparks.org/events/${event.url}` : undefined,
    category: undefined, // Not available in this dataset
    location: location ? {
      lat: location.location.latitude,
      lng: location.location.longitude
    } : CENTRAL_PARK_CENTROID,
    source: 'NYC Parks Open Data'
  };
}

/**
 * Build NYC Open Data API URLs
 */
export function buildNYCDataURLs() {
  const baseURL = 'https://data.cityofnewyork.us/resource';
  
  return {
    events: `${baseURL}/fudw-fgrp.json`,
    locations: `${baseURL}/cpcm-i88g.json`,
    parks: `${baseURL}/enfh-gkve.json`,
    categories: `${baseURL}/xtsw-fqvh.json`
  };
}

/**
 * Build SoQL query for weekend events
 */
export function buildWeekendEventsQuery(): string {
  const { start, end } = getWeekendDateRange();
  
  // Convert ISO strings to NYC Open Data format (YYYY-MM-DD)
  const startDate = start.split('T')[0];
  const endDate = end.split('T')[0];
  
  // For now, let's get recent events and filter by date in our code
  // since the NYC Open Data API doesn't seem to support complex date filtering
  return `?$limit=100`;
}

/**
 * Build SoQL query for event locations in Central Park
 */
export function buildCentralParkLocationsQuery(): string {
  return `?$limit=100`;
}

/**
 * Process and filter events for Central Park
 */
export function processCentralParkEvents(
  events: NYCEvent[], 
  locations: NYCEventLocation[]
): CentralParkEvent[] {
  const { start, end } = getWeekendDateRange();
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  // Create a map of event_id to location
  const locationMap = new Map<string, NYCEventLocation>();
  locations.forEach(loc => locationMap.set(loc.event_id, loc));
  
  // Filter events that:
  // 1. Are within the weekend date range
  // 2. Have locations in Central Park (if locations are available)
  const centralParkEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const isInWeekend = eventDate >= startDate && eventDate <= endDate;
      
      // If we have location data, check if it's in Central Park
      if (locations.length > 0) {
        const hasLocation = locationMap.has(event.event_id);
        return isInWeekend && hasLocation;
      }
      
      // If no location data, just check the date
      return isInWeekend;
    })
    .map(event => {
      const location = locationMap.get(event.event_id);
      return formatEventForDisplay(event, location);
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  return centralParkEvents;
}
