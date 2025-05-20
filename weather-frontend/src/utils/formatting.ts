// src/utils/formatting.ts

// Export this function directly so it can be imported by name
export const convertTemperature = (tempCelsius: number, unit: 'C' | 'F'): number => {
  if (unit === 'F') {
    return Math.round((tempCelsius * 9/5) + 32);
  }
  return Math.round(tempCelsius); // Already in Celsius
};

/**
 * Formats a temperature value with its unit symbol for display.
 * @param tempCelsius - Temperature in Celsius.
 * @param unit - Target display unit ('C' or 'F').
 * @returns Formatted temperature string (e.g., "25°C" or "77°F").
 */
export const formatDisplayTemp = (tempCelsius: number, unit: 'C' | 'F'): string => {
  return `${convertTemperature(tempCelsius, unit)}°${unit.charAt(0)}`;
};

/**
 * Formats a temperature range (min-max) with unit symbols for display.
 * @param tempMinC - Minimum temperature in Celsius.
 * @param tempMaxC - Maximum temperature in Celsius.
 * @param unit - Target display unit ('C' | 'F').
 * @returns Formatted temperature range string (e.g., "10°-15°C" or "50°-59°F").
 */
export const formatDisplayTempRange = (tempMinC: number, tempMaxC: number, unit: 'C' | 'F'): string => {
  const min = convertTemperature(tempMinC, unit);
  const max = convertTemperature(tempMaxC, unit);
  return `${min}°-${max}°${unit.charAt(0)}`;
};

// No need for the separate export { convertTemperature }; at the bottom if it's exported directly above