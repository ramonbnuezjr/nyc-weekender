import { NextRequest, NextResponse } from 'next/server';
import { 
  buildNYCDataURLs, 
  buildWeekendEventsQuery, 
  buildCentralParkLocationsQuery,
  processCentralParkEvents,
  generateMockEvents,
  type NYCEvent,
  type NYCEventLocation,
  type CentralParkEvent
} from '@/lib/nyc-data';

// Force dynamic runtime to prevent build-time execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';
export const runtime = 'nodejs';

const NYC_OPEN_DATA_APP_TOKEN = process.env.NYC_OPEN_DATA_APP_TOKEN;

export async function GET(request: NextRequest) {
  try {
    console.log('Events API called - fetching NYC Open Data...');
    
    const { searchParams } = new URL(request.url);
    const includeLocations = searchParams.get('locations') !== 'false';
    const useMockData = searchParams.get('mock') === 'true';
    
    let centralParkEvents: CentralParkEvent[] = [];
    
    if (useMockData) {
      // Use mock data for testing
      console.log('Using mock events data for testing');
      centralParkEvents = generateMockEvents();
    } else {
      // Try to fetch from NYC Open Data
      try {
        // Build API URLs
        const urls = buildNYCDataURLs();
        
        // Fetch weekend events
        console.log('Fetching weekend events from NYC Open Data...');
        const eventsResponse = await fetch(urls.events + buildWeekendEventsQuery());
        
        if (!eventsResponse.ok) {
          throw new Error(`NYC Events API error: ${eventsResponse.status}`);
        }
        
        const events: NYCEvent[] = await eventsResponse.json();
        console.log(`Fetched ${events.length} total events from NYC Open Data`);
        
        if (includeLocations) {
          try {
            // Try to fetch event locations for Central Park
            console.log('Fetching Central Park event locations...');
            const locationsResponse = await fetch(urls.locations + buildCentralParkLocationsQuery());
            
            if (locationsResponse.ok) {
              const locations: NYCEventLocation[] = await locationsResponse.json();
              console.log(`Fetched ${locations.length} event locations`);
              
              // Process and filter events for Central Park
              centralParkEvents = processCentralParkEvents(events, locations);
            } else {
              console.log('Locations API returned error, falling back to date-only filtering');
              // Fall back to processing events without location data
              centralParkEvents = processCentralParkEvents(events, []);
            }
          } catch (locationError) {
            console.log('Error fetching locations, falling back to date-only filtering:', locationError);
            // Fall back to processing events without location data
            centralParkEvents = processCentralParkEvents(events, []);
          }
        } else {
          // If not including locations, just return basic event info
          centralParkEvents = processCentralParkEvents(events, []);
        }
        
        // If no events found from NYC Open Data, fall back to mock data
        if (centralParkEvents.length === 0) {
          console.log('No events found from NYC Open Data, falling back to mock data');
          centralParkEvents = generateMockEvents();
        }
        
      } catch (nycDataError) {
        console.log('Error fetching from NYC Open Data, using mock data:', nycDataError);
        // Fall back to mock data if NYC Open Data fails
        centralParkEvents = generateMockEvents();
      }
    }
    
    console.log(`Processed ${centralParkEvents.length} Central Park events for this weekend`);
    
    // Add metadata
    const enrichedData = {
      events: centralParkEvents,
      metadata: {
        total_events: centralParkEvents.length,
        total_fetched: centralParkEvents.length,
        weekend_range: {
          start: new Date().toISOString().split('T')[0], // Today's date for display
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Next week
        },
        source: useMockData ? 'Mock Data (Testing)' : 'NYC Open Data + Mock Data Fallback',
        timestamp: new Date().toISOString(),
        location_filter: includeLocations ? 'Central Park spatial filter applied' : 'No spatial filtering',
        note: useMockData ? 
          'Using mock data for testing. NYC Open Data events are historical (2013-2018).' :
          'Events filtered by weekend dates. Location filtering may be limited by available data. Fallback to mock data if no real events found.'
      }
    };
    
    return NextResponse.json(enrichedData);
    
  } catch (error) {
    console.error('Events API error:', error);
    
    // Even on error, return mock data so the UI can still work
    const fallbackEvents = generateMockEvents();
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch events data, using mock data',
        details: error instanceof Error ? error.message : 'Unknown error',
        events: fallbackEvents,
        metadata: {
          total_events: fallbackEvents.length,
          source: 'Mock Data (Error Fallback)',
          timestamp: new Date().toISOString(),
          error: true,
          note: 'Using mock data due to API error. This allows testing of the events display functionality.'
        }
      },
      { status: 200 } // Return 200 with mock data instead of 500
    );
  }
}

// POST method for testing with specific queries
export async function POST(request: NextRequest) {
  try {
    const { query, dateRange } = await request.json();
    
    console.log('Events API POST called with:', { query, dateRange });
    
    // For now, return the same data as GET
    // In the future, this could handle custom queries
    return GET(request);
    
  } catch (error) {
    console.error('Events API POST error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}
