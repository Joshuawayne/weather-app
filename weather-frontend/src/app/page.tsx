// src/app/page.tsx
'use client'; // Enable client-side rendering for this Next.js page

// Import React hooks for state management, effects, and form handling
import React, { useState, useEffect, FormEvent, useRef } from 'react';
// Import Next.js Head component for dynamic metadata
import Head from 'next/head';
// Import service to fetch weather data from an external API
import { getWeatherDataByCity } from '@/services/weatherApiService';
// Import weather data types for type safety
import { WeatherData, ForecastDayData } from '@/types/weather';
// Import GSAP for animations on weather data display
import { gsap } from 'gsap';

// Import child components for modular UI rendering
import HeaderControls from '@/components/HeaderControls';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorDisplay from '@/components/ErrorDisplay';
import CurrentWeatherDisplay from '@/components/CurrentWeatherDisplay';
import ForecastDisplay from '@/components/ForecastDisplay';
import WeatherDetailsCards from '@/components/WeatherDetailsCards';

// Main page component for the SkyCast Weather App
export default function HomePage() {
  // State for the current city being queried (default: Nairobi)
  const [city, setCity] = useState<string>('Nairobi');
  // State for the search input field, synced with city on form submission
  const [searchInput, setSearchInput] = useState<string>('Nairobi');
  // State to store fetched weather data or null if not yet loaded or failed
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // State to manage loading status during API calls
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to store error messages from API failures
  const [error, setError] = useState<string | null>(null);
  // State to toggle between Celsius ('C') and Fahrenheit ('F') units
  const [displayUnit, setDisplayUnit] = useState<'C' | 'F'>('C');

  // Refs for DOM elements to apply GSAP animations
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const currentIconRef = useRef<HTMLImageElement | null>(null);
  const currentTemperatureRef = useRef<HTMLParagraphElement | null>(null);
  const currentDescriptionRef = useRef<HTMLParagraphElement | null>(null);
  const currentLocationRef = useRef<HTMLDivElement | null>(null);
  const forecastCardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const windCardRef = useRef<HTMLDivElement | null>(null);
  const humidityCardRef = useRef<HTMLDivElement | null>(null);

  // Effect to fetch weather data when city changes
  useEffect(() => {
    const cityForThisFetch = city; // Capture city for this fetch to avoid race conditions
    const abortController = new AbortController(); // Enable cancellation of fetch on unmount or city change
    const signal = abortController.signal;

    const fetchWeatherDataInternal = async () => {
      setIsLoading(true); // Show loading indicator
      setError(null); // Clear previous errors
      try {
        // Fetch weather data for the specified city
        const data = await getWeatherDataByCity(cityForThisFetch, { signal });
        if (!signal.aborted) setWeatherData(data); // Update state only if not aborted
      } catch (err: any) {
        // Handle fetch abortion or errors
        if (err.name === 'AbortError') console.log('[Page] Fetch aborted for city:', cityForThisFetch);
        else if (!signal.aborted) {
          setError(err.message || 'Failed to fetch data.'); // Set error message
          setWeatherData(null); // Clear weather data on failure
        }
      } finally {
        if (!signal.aborted) setIsLoading(false); // Stop loading indicator
      }
    };

    // Fetch data only if city is valid; otherwise, show error
    if (cityForThisFetch && cityForThisFetch.trim() !== '') fetchWeatherDataInternal();
    else {
      setWeatherData(null);
      setIsLoading(false);
      setError('Please enter a city name.');
    }
    // Cleanup: Abort fetch on component unmount or city change
    return () => abortController.abort();
  }, [city]);

  // Effect to animate UI elements when weather data is loaded successfully
  useEffect(() => {
    if (!isLoading && weatherData && !error) {
      // Create GSAP timeline for smooth, staggered animations
      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.5 } });
      // Animate weather icon with scale and fade-in
      if (currentIconRef.current) tl.fromTo(currentIconRef.current, { opacity: 0, scale: 0.5, y: -30 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, delay: 0.1 });
      // Animate temperature, description, and location with fade-in and slide
      if (currentTemperatureRef.current) tl.fromTo(currentTemperatureRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.5");
      if (currentDescriptionRef.current) tl.fromTo(currentDescriptionRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.4");
      if (currentLocationRef.current) tl.fromTo(currentLocationRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");

      // Resize forecast cards array to match forecast data length
      forecastCardsRef.current = forecastCardsRef.current.slice(0, weatherData.forecast.length);
      // Animate each forecast card with staggered effect for visual appeal
      weatherData.forecast.forEach((day: ForecastDayData, index: number) => {
        const card = forecastCardsRef.current[index];
        if (card) tl.fromTo(card, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, delay: index * 0.07 }, "-=0.2");
      });

      // Animate wind and humidity cards with slide-in effects
      if (windCardRef.current) tl.fromTo(windCardRef.current, { opacity: 0, x: -25 }, { opacity: 1, x: 0, duration: 0.45 }, "-=0.2");
      if (humidityCardRef.current) tl.fromTo(humidityCardRef.current, { opacity: 0, x: 25 }, { opacity: 1, x: 0, duration: 0.45 }, "-=0.35");
    }
  }, [isLoading, weatherData, error, displayUnit]);

  // Handle form submission for city search
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedSearchInput = searchInput.trim();
    // Update city only if input is valid and different from current city
    if (trimmedSearchInput && trimmedSearchInput.toLowerCase() !== city.toLowerCase()) {
      setCity(trimmedSearchInput);
    }
  };

  // Utility to generate URL for weather icons from OpenWeatherMap
  const getWeatherIconUrl = (iconCode: string) => `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  // Assign refs to forecast cards for animation
  const assignForecastCardRef = (el: HTMLDivElement | null, index: number) => {
    forecastCardsRef.current[index] = el;
  };

  return (
    <>
      {/* Dynamic metadata for SEO and browser display */}
      <Head>
        <title>SkyCast Weather - {weatherData?.location.name || city || 'Search'}</title>
        <meta name="description" content={`Get the latest weather forecast for ${weatherData?.location.name || city || 'your favorite cities'}.`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main content with responsive gradient background and padding */}
      <main
        ref={pageContainerRef}
        className="min-h-screen bg-gradient-to-br from-sky-600 via-indigo-700 to-purple-800 text-white p-4 sm:p-6 md:p-8 selection:bg-sky-300 selection:text-sky-900"
      >
        <div className="container mx-auto max-w-4xl">
          {/* Header with search and unit toggle controls */}
          <HeaderControls
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={handleSearchSubmit}
            isLoading={isLoading}
            isSearchingThisCity={isLoading && city.toLowerCase() === searchInput.trim().toLowerCase()}
            currentUnit={displayUnit}
            onUnitChange={setDisplayUnit}
          />

          {/* Show loading indicator during API calls */}
          {isLoading && <LoadingIndicator />}
          {/* Display error message if API call fails */}
          {!isLoading && error && <ErrorDisplay message={error} />}

          {/* Render weather data when loaded successfully */}
          {!isLoading && weatherData && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Display current weather conditions */}
              <CurrentWeatherDisplay
                currentWeather={weatherData.current}
                locationData={weatherData.location}
                displayUnit={displayUnit}
                getWeatherIconUrl={getWeatherIconUrl}
                cityForIconKey={city}
                iconRef={currentIconRef}
                temperatureRef={currentTemperatureRef}
                descriptionRef={currentDescriptionRef}
                locationRef={currentLocationRef}
              />
              <div className="lg:col-span-2 space-y-6">
                {/* Display multi-day weather forecast */}
                <ForecastDisplay
                  forecastDays={weatherData.forecast}
                  displayUnit={displayUnit}
                  getWeatherIconUrl={getWeatherIconUrl}
                  assignForecastCardRef={assignForecastCardRef}
                />
                {/* Display additional weather details (e.g., wind, humidity) */}
                <WeatherDetailsCards
                  details={weatherData.details}
                  displayUnit={displayUnit}
                  windCardRef={windCardRef}
                  humidityCardRef={humidityCardRef}
                />
              </div>
            </div>
          )}

          {/* Footer with app info and data source credit */}
          <footer className="text-center mt-12 py-4 text-sm text-white/60">
            SkyCast Weather App © {new Date().getFullYear()} by Joshua. Data powered by OpenWeatherMap.
          </footer>
        </div>
      </main>
    </>
  );
}
