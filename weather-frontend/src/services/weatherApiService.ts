// src/services/weatherApiService.ts
import { WeatherData, WeatherError } from '@/types/weather';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LARAVEL_API_URL || // 1. Env variable
  (process.env.NODE_ENV === 'production'
    ? '/api/v1' // 2. Prod default (relative)
    : 'http://127.0.0.1:8000/api/v1'); // 3. Dev default (local Laravel)

export const getWeatherDataByCity = async (
  city: string,
  options?: { signal?: AbortSignal }
): Promise<WeatherData> => {
  const requestUrl = `${API_BASE_URL}/weather/${encodeURIComponent(city)}`;
  console.log(`[Frontend] Fetching weather data from: ${requestUrl}`);

  const response = await fetch(requestUrl, { signal: options?.signal });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status} from ${requestUrl}`;
    if (options?.signal?.aborted) {
        console.warn(`[Frontend] Fetch aborted for ${requestUrl}`);
        throw new DOMException('Request aborted by user', 'AbortError');
    }
    try {
      const errorData = await response.json() as WeatherError | { message?: string; details?: string };
      if (typeof errorData === 'object' && errorData !== null) {
        if ('error' in errorData && typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if ('message' in errorData && typeof errorData.message === 'string') { // Fallback for generic message
          errorMessage = errorData.message;
        }
      }
    } catch (e) {
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
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json() as WeatherData;
    console.log(`[Frontend] Received data for ${city}:`, data);
    return data;
  } catch (e) {
    console.error(`[Frontend] Failed to parse successful JSON response from ${requestUrl}:`, e);
    throw new Error(`Malformed data received from server when calling ${requestUrl}.`);
  }
};