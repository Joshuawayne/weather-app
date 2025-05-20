// src/types/weather.ts
export interface WindInfoForDisplay {
    speed_kmh: number;
    speed_mph?: number; // Optional: if your backend provides it
    direction: string;
  }
  
  export interface ForecastDayData {
    date: string;        // e.g., "21 May"
    icon: string;        // Icon code from API
    temp_min: number;    // Celsius (raw from API)
    temp_max: number;    // Celsius (raw from API)
    temp_range: string;  // Pre-formatted Celsius range from API (e.g., "10-15°C")
  }
  
  export interface WeatherData {
    location: {
      name: string;
      country: string;
      date_full: string; // Pre-formatted full date
    };
    current: {
      temp: number;      // Celsius (raw from API)
      description: string;
      icon: string;      // Icon code
    };
    details: {
      humidity: number;    // Percentage
      wind: WindInfoForDisplay;
    };
    forecast: ForecastDayData[]; // Array of forecast days
    source_units: 'metric';   // Indicates the source temperature/speed units
  }
  
  export interface WeatherError {
    error: string; // Expected error structure from your Laravel API
    // details?: string; // Optional, if your API sends more error info
  }