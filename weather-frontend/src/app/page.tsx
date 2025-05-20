// src/app/page.tsx
'use client';

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import Head from 'next/head';
import { getWeatherDataByCity } from '@/services/weatherApiService';
// Using direct import for ForecastDayData, no alias needed if no local conflict
import { WeatherData, ForecastDayData } from '@/types/weather';
import { gsap } from 'gsap';

// Import Child Components
import HeaderControls from '@/components/HeaderControls';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorDisplay from '@/components/ErrorDisplay';
import CurrentWeatherDisplay from '@/components/CurrentWeatherDisplay';
import ForecastDisplay from '@/components/ForecastDisplay';
import WeatherDetailsCards from '@/components/WeatherDetailsCards';

export default function HomePage() {
  const [city, setCity] = useState<string>('Nairobi');
  const [searchInput, setSearchInput] = useState<string>('Nairobi');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [displayUnit, setDisplayUnit] = useState<'C' | 'F'>('C');

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const currentIconRef = useRef<HTMLImageElement | null>(null);
  const currentTemperatureRef = useRef<HTMLParagraphElement | null>(null);
  const currentDescriptionRef = useRef<HTMLParagraphElement | null>(null);
  const currentLocationRef = useRef<HTMLDivElement | null>(null);
  const forecastCardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const windCardRef = useRef<HTMLDivElement | null>(null);
  const humidityCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cityForThisFetch = city;
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchWeatherDataInternal = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWeatherDataByCity(cityForThisFetch, { signal });
        if (!signal.aborted) setWeatherData(data);
      } catch (err: any) {
        if (err.name === 'AbortError') console.log('[Page] Fetch aborted for city:', cityForThisFetch);
        else if (!signal.aborted) {
          setError(err.message || 'Failed to fetch data.');
          setWeatherData(null);
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    if (cityForThisFetch && cityForThisFetch.trim() !== '') fetchWeatherDataInternal();
    else {
      setWeatherData(null);
      setIsLoading(false);
      setError('Please enter a city name.');
    }
    return () => abortController.abort();
  }, [city]);

  useEffect(() => {
    if (!isLoading && weatherData && !error) {
      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.5 } });
      if (currentIconRef.current) tl.fromTo(currentIconRef.current, { opacity: 0, scale: 0.5, y: -30 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, delay: 0.1 });
      if (currentTemperatureRef.current) tl.fromTo(currentTemperatureRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.5");
      if (currentDescriptionRef.current) tl.fromTo(currentDescriptionRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.4");
      if (currentLocationRef.current) tl.fromTo(currentLocationRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");

      forecastCardsRef.current = forecastCardsRef.current.slice(0, weatherData.forecast.length);
      // Explicitly type 'day' and 'index' for the forEach callback
      weatherData.forecast.forEach((day: ForecastDayData, index: number) => {
        const card = forecastCardsRef.current[index];
        if (card) tl.fromTo(card, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, delay: index * 0.07 }, "-=0.2");
      });

      if (windCardRef.current) tl.fromTo(windCardRef.current, { opacity: 0, x: -25 }, { opacity: 1, x: 0, duration: 0.45 }, "-=0.2");
      if (humidityCardRef.current) tl.fromTo(humidityCardRef.current, { opacity: 0, x: 25 }, { opacity: 1, x: 0, duration: 0.45 }, "-=0.35");
    }
  }, [isLoading, weatherData, error, displayUnit]);


  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedSearchInput = searchInput.trim();
    if (trimmedSearchInput && trimmedSearchInput.toLowerCase() !== city.toLowerCase()) {
      setCity(trimmedSearchInput);
    }
  };

  const getWeatherIconUrl = (iconCode: string) => `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  const assignForecastCardRef = (el: HTMLDivElement | null, index: number) => {
    forecastCardsRef.current[index] = el;
  };

  return (
    <>
      <Head>
        <title>SkyCast Weather - {weatherData?.location.name || city || 'Search'}</title>
        <meta name="description" content={`Get the latest weather forecast for ${weatherData?.location.name || city || 'your favorite cities'}.`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        ref={pageContainerRef}
        className="min-h-screen bg-gradient-to-br from-sky-600 via-indigo-700 to-purple-800 text-white p-4 sm:p-6 md:p-8 selection:bg-sky-300 selection:text-sky-900"
      >
        <div className="container mx-auto max-w-4xl">
          <HeaderControls
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={handleSearchSubmit}
            isLoading={isLoading}
            isSearchingThisCity={isLoading && city.toLowerCase() === searchInput.trim().toLowerCase()}
            currentUnit={displayUnit}
            onUnitChange={setDisplayUnit}
          />

          {isLoading && <LoadingIndicator />}
          {!isLoading && error && <ErrorDisplay message={error} />}

          {!isLoading && weatherData && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
                <ForecastDisplay // This component should now be correctly resolved
                  forecastDays={weatherData.forecast} // This is Array<ForecastDayData>
                  displayUnit={displayUnit}
                  getWeatherIconUrl={getWeatherIconUrl}
                  assignForecastCardRef={assignForecastCardRef}
                />
                <WeatherDetailsCards
                  details={weatherData.details}
                  displayUnit={displayUnit}
                  windCardRef={windCardRef}
                  humidityCardRef={humidityCardRef}
                />
              </div>
            </div>
          )}

          <footer className="text-center mt-12 py-4 text-sm text-white/60">
            SkyCast Weather App © {new Date().getFullYear()} by Joshua. Data powered by OpenWeatherMap.
          </footer>
        </div>
      </main>
    </>
  );
}