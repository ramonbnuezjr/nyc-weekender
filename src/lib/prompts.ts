/**
 * Prompt templates for NYC Chatbot
 * Defines system messages and user prompt structures
 */

interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
  metadata: {
    location: string;
    source: string;
    timestamp: string;
  };
}

export const SYSTEM_PROMPT = `You are NYC Chat, a helpful assistant for New York City visitors and residents. 

IMPORTANT RULES:
- Be concise and friendly
- Use JSON tool outputs when provided
- NEVER hallucinate events or activities
- If events are unavailable, say so clearly and offer weather-aware suggestions instead
- Focus on Central Park and NYC-specific information
- Always consider weather context when making recommendations
- Use accurate weather data from OpenWeatherMap

Your responses should be helpful, accurate, and NYC-focused.`;

export const WEATHER_CONTEXT_PROMPT = `Based on the weather forecast for Central Park this weekend:

{weather_summary}

Please provide:
1. A brief weather summary for the weekend
2. 3 weather-aware activity suggestions for Central Park
3. Any relevant tips based on the weather conditions

Remember: Do not invent events. Focus on general activities that would be enjoyable given the weather conditions.`;

export const ACTIVITY_SUGGESTION_PROMPT = `Given the weather forecast for Central Park this weekend:

{weather_summary}

Please suggest 3 weather-appropriate activities for Central Park. Consider:
- Temperature and precipitation
- Seasonal appropriateness
- Accessibility and safety
- Popular Central Park activities

Format your response as:
1. [Activity 1] - Brief explanation why it's good for this weather
2. [Activity 2] - Brief explanation why it's good for this weather  
3. [Activity 3] - Brief explanation why it's good for this weather

Note: Events and specific activities will be available in the next version. For now, focus on general activity suggestions.`;

export const WEATHER_QUERY_PROMPT = `The user is asking about weather in Central Park this weekend. 

Please provide a clear, concise weather summary including:
- Temperature ranges (min/max) for Saturday and Sunday
- Precipitation probability
- General conditions (sunny, cloudy, etc.)
- Brief human-readable summary

Use the weather data provided to give accurate information.`;

/**
 * Helper function to format weather data into a readable summary
 * Works with OpenWeatherMap data (already in Fahrenheit)
 */
export function formatWeatherSummary(weatherData: WeatherData): string {
  if (!weatherData || !weatherData.daily) {
    return "Weather data unavailable";
  }
  
  const { daily } = weatherData;
  const saturday = daily.time[0];
  const sunday = daily.time[1];
  
  // OpenWeatherMap data is already in Fahrenheit
  const satMinF = Math.round(daily.temperature_2m_min[0]);
  const satMaxF = Math.round(daily.temperature_2m_max[0]);
  const sunMinF = Math.round(daily.temperature_2m_min[1]);
  const sunMaxF = Math.round(daily.temperature_2m_max[1]);
  
  // Format precipitation probability
  const satPrecip = daily.precipitation_probability_max[0];
  const sunPrecip = daily.precipitation_probability_max[1];
  
  return `Saturday (${saturday}): ${satMinF}°F to ${satMaxF}°F, ${satPrecip}% chance of rain
Sunday (${sunday}): ${sunMinF}°F to ${sunMaxF}°F, ${sunPrecip}% chance of rain`;
}
