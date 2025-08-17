/**
 * Time utilities for NYC Chatbot
 * Handles timezone conversions and weekend calculations
 */

export const NYC_TIMEZONE = 'America/New_York';

/**
 * Get the next weekend (Saturday and Sunday) dates
 * @returns Object with Saturday and Sunday dates
 */
export function getNextWeekend(): { saturday: Date; sunday: Date } {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  
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
  sunday.setHours(0, 0, 0, 0);
  
  return { saturday, sunday };
}

/**
 * Format date for display
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: NYC_TIMEZONE
  });
}

/**
 * Check if a date is this weekend
 * @param date - Date to check
 * @returns True if date is this weekend
 */
export function isThisWeekend(date: Date): boolean {
  const { saturday, sunday } = getNextWeekend();
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  return dateOnly.getTime() === saturday.getTime() || 
         dateOnly.getTime() === sunday.getTime();
}

/**
 * Get current NYC time
 * @returns Current time in NYC timezone
 */
export function getNYCTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: NYC_TIMEZONE }));
}
