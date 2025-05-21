
// This file defines a service to fetch weather data from a backend API (Laravel-based) for a given city.
// It handles API requests, error parsing, and cancellation using AbortSignal, returning structured weather data.

// Import weather data and error types for type safety
import { WeatherData, WeatherError } from '@/types/weather';

// Determine the base API URL based on environment
const API_BASE_URL =
  process.env.NEXT_PUBLIC_LARAVEL_API_URL || // 1. Use environment variable if defined
  (process.env.NODE_ENV === 'production'
    ? '/api/v1' // 2. Use relative path for production
    : 'http://127.0.0.1:8000/api/v1'); // 3. Use local Laravel server for development

// Fetch weather data for a specified city, with optional AbortSignal for cancellation
export const getWeatherDataByCity = async (
  city: string, // City name to query
  options?: { signal?: AbortSignal } // Optional AbortSignal for cancelling requests
): Promise<WeatherData> => {
  // Construct API URL with encoded city name to handle special characters
  const requestUrl = `${API_BASE_URL}/weather/${encodeURIComponent(city)}`;
  // Log request for debugging
  console.log(`[Frontend] Fetching weather data from: ${requestUrl}`);

  // Perform fetch with optional AbortSignal
  const response = await fetch(requestUrl, { signal: options?.signal });

  // Handle non-OK HTTP responses (e.g., 404, 500)
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status} from ${requestUrl}`;
    // Check if request was aborted
    if (options?.signal?.aborted) {
      console.warn(`[Frontend] Fetch aborted for ${requestUrl}`);
      throw new DOMException('Request aborted by user', 'AbortError');
    }
    try {
      // Attempt to parse error response as JSON
      const errorData = await response.json() as WeatherError | { message?: string; details?: string };
      if (typeof errorData === 'object' && errorData !== null) {
        // Prioritize WeatherError 'error' field, fallback to 'message'
        if ('error' in errorData && typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if ('message' in errorData && typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        }
      }
    } catch (e) {
      // Handle cases where error response is not JSON
      console.error(`[Frontend] Could not parse JSON error from ${requestUrl} or other fetch error:`, e);
      if (!options?.signal?.aborted) {
        try {
          const textError = await response.text();
          console.error("[Frontend] Backend error response (not JSON):", textError);
          errorMessage = `Backend error (status ${response.status}) when calling ${requestUrl}. Non-JSON response. Check console.`;
        } catch (textParseError) {
          console.error("[Frontend] Could not read error response text:", textParseError);
        }
      }
    }
    // Throw error with detailed message
    throw new Error(errorMessage);
  }

  // Parse successful response as WeatherData
  try {
    const data = await response.json() as WeatherData;
    // Log successful response for debugging
    console.log(`[Frontend] Received data for ${city}:`, data);
    return data;
  } catch (e) {
    // Handle malformed JSON in successful response
    console.error(`[Frontend] Failed to parse successful JSON response from ${requestUrl}:`, e);
    throw new Error(`Malformed data received from server when calling ${requestUrl}.`);
  }
};
